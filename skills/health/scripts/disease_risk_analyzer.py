#!/usr/bin/env python3
"""
Disease Risk Analyzer

Scans genome against ClinVar database to identify:
- Pathogenic variants (affected status)
- Likely pathogenic variants
- Carrier status for recessive conditions
- Risk factors and other clinically relevant findings

Generates EXHAUSTIVE_DISEASE_RISK_REPORT.md
"""

import csv
import os
from collections import defaultdict
from datetime import datetime

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(BASE_DIR, "data")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")

GENOME_PATH = os.path.join(DATA_DIR, "genome.txt")
CLINVAR_PATH = os.path.join(DATA_DIR, "clinvar_alleles.tsv")
OUTPUT_PATH = os.path.join(REPORTS_DIR, "EXHAUSTIVE_DISEASE_RISK_REPORT.md")


def load_genome():
    """Load genome file and create position-based index."""
    print("Loading genome data...")
    genome_by_rsid = {}
    genome_by_position = {}

    with open(GENOME_PATH, 'r') as f:
        for line in f:
            if line.startswith('#'):
                continue
            parts = line.strip().split('\t')
            if len(parts) >= 4:
                rsid, chrom, pos, genotype = parts[0], parts[1], parts[2], parts[3]
                if genotype != '--':
                    genome_by_rsid[rsid] = {
                        'chromosome': chrom,
                        'position': pos,
                        'genotype': genotype
                    }
                    # Position-based key for ClinVar matching
                    pos_key = f"{chrom}:{pos}"
                    genome_by_position[pos_key] = {
                        'rsid': rsid,
                        'genotype': genotype
                    }

    print(f"  Loaded {len(genome_by_rsid):,} SNPs")
    return genome_by_rsid, genome_by_position


def load_clinvar(genome_by_position):
    """Load ClinVar and find variants present in user's genome."""
    print("Loading ClinVar database and matching variants...")

    findings = {
        'pathogenic': [],
        'likely_pathogenic': [],
        'risk_factor': [],
        'drug_response': [],
        'protective': [],
        'other_significant': [],
        'uncertain_but_notable': []
    }

    stats = {
        'total_clinvar': 0,
        'matched': 0,
        'pathogenic_matched': 0,
        'likely_pathogenic_matched': 0
    }

    with open(CLINVAR_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')

        for row in reader:
            stats['total_clinvar'] += 1

            # Create position key
            chrom = row['chrom']
            pos = row['pos']
            pos_key = f"{chrom}:{pos}"

            # Check if user has this position
            if pos_key not in genome_by_position:
                continue

            stats['matched'] += 1

            user_data = genome_by_position[pos_key]
            user_genotype = user_data['genotype']
            ref_allele = row['ref']
            alt_allele = row['alt']
            clinical_sig = row['clinical_significance'].lower()
            clinical_sig_ordered = row.get('clinical_significance_ordered', clinical_sig)

            # CRITICAL: Only process true SNPs (single nucleotide variants)
            # 23andMe data cannot reliably represent indels (insertions/deletions)
            # Indels would cause false positives (e.g., user has "CC" reference,
            # ClinVar has deletion "CTGCCCAAT→C", code would incorrectly match)
            if len(ref_allele) != 1 or len(alt_allele) != 1:
                continue

            # For true SNPs, check if user has the variant allele
            has_variant = alt_allele in user_genotype
            is_homozygous = user_genotype == alt_allele + alt_allele
            is_heterozygous = has_variant and not is_homozygous

            # Also verify user doesn't just have reference allele
            has_ref_only = user_genotype == ref_allele + ref_allele
            if has_ref_only:
                continue

            if not has_variant:
                continue

            # Build finding record
            finding = {
                'chromosome': chrom,
                'position': pos,
                'rsid': user_data['rsid'],
                'gene': row['symbol'],
                'ref': ref_allele,
                'alt': alt_allele,
                'user_genotype': user_genotype,
                'is_homozygous': is_homozygous,
                'is_heterozygous': is_heterozygous,
                'clinical_significance': row['clinical_significance'],
                'clinical_significance_ordered': clinical_sig_ordered,
                'review_status': row['review_status'],
                'gold_stars': int(row['gold_stars']) if row['gold_stars'] else 0,
                'traits': row['all_traits'],
                'inheritance': row.get('inheritance_modes', ''),
                'hgvs_c': row.get('hgvs_c', ''),
                'hgvs_p': row.get('hgvs_p', ''),
                'molecular_consequence': row.get('molecular_consequence', ''),
                'pmids': row.get('all_pmids', ''),
                'xrefs': row.get('xrefs', ''),
                'age_of_onset': row.get('age_of_onset', ''),
                'prevalence': row.get('prevalence', ''),
                'submitters': row.get('all_submitters', ''),
                'last_evaluated': row.get('last_evaluated', '')
            }

            # Categorize by clinical significance
            if 'pathogenic' in clinical_sig and 'likely' not in clinical_sig and 'conflict' not in clinical_sig:
                findings['pathogenic'].append(finding)
                stats['pathogenic_matched'] += 1
            elif 'likely pathogenic' in clinical_sig or 'likely_pathogenic' in clinical_sig:
                findings['likely_pathogenic'].append(finding)
                stats['likely_pathogenic_matched'] += 1
            elif 'risk factor' in clinical_sig or 'risk_factor' in clinical_sig:
                findings['risk_factor'].append(finding)
            elif 'drug response' in clinical_sig or 'drug_response' in clinical_sig:
                findings['drug_response'].append(finding)
            elif 'protective' in clinical_sig:
                findings['protective'].append(finding)
            elif 'association' in clinical_sig or 'affects' in clinical_sig:
                findings['other_significant'].append(finding)
            elif 'uncertain' in clinical_sig and finding['gold_stars'] >= 2:
                # High-confidence uncertain significance - might be notable
                findings['uncertain_but_notable'].append(finding)

    print(f"  ClinVar entries scanned: {stats['total_clinvar']:,}")
    print(f"  Positions matched in genome: {stats['matched']:,}")
    print(f"  Pathogenic variants found: {stats['pathogenic_matched']}")
    print(f"  Likely pathogenic variants found: {stats['likely_pathogenic_matched']}")

    return findings, stats


def classify_zygosity_impact(finding):
    """Determine clinical impact based on zygosity and inheritance."""
    inheritance = finding['inheritance'].lower() if finding['inheritance'] else ''
    is_hom = finding['is_homozygous']
    is_het = finding['is_heterozygous']

    if is_hom:
        return 'AFFECTED', 'Homozygous for variant allele'
    elif is_het:
        if 'recessive' in inheritance:
            return 'CARRIER', 'Heterozygous carrier (autosomal recessive condition)'
        elif 'dominant' in inheritance:
            return 'AFFECTED', 'Heterozygous (autosomal dominant - one copy sufficient)'
        elif 'x-linked' in inheritance:
            return 'CARRIER/AT_RISK', 'X-linked variant (impact depends on sex)'
        else:
            return 'HETEROZYGOUS', 'Heterozygous (inheritance pattern not specified)'

    return 'UNKNOWN', 'Zygosity unclear'


def generate_priority_actions_disease(findings, affected_findings, carrier_findings):
    """Generate Priority Actions for disease risk report with explanations."""
    actions = []

    # Cancer genes requiring genetic counseling
    cancer_genes = {'MEN1', 'PALB2', 'BRCA1', 'BRCA2', 'TP53', 'APC', 'MLH1', 'MSH2', 'CDH1', 'STK11'}
    cancer_affected = [f for f in affected_findings if f.get('gene') in cancer_genes and f.get('gold_stars', 0) >= 2]
    cancer_het = [f for f in findings['pathogenic'] + findings['likely_pathogenic']
                  if f.get('gene') in cancer_genes and f.get('gold_stars', 0) >= 2]
    if cancer_affected or cancer_het:
        genes = sorted(set(f['gene'] for f in cancer_affected + cancer_het))
        stars = max(f.get('gold_stars', 0) for f in cancer_affected + cancer_het)
        actions.append({
            'priority': 1,
            'action': f"Genetic counseling for {'/'.join(genes)} cancer variant(s)",
            'explanation': f'Schedule an appointment with a certified genetic counselor to discuss whether these {stars}-star confidence variants require additional cancer screening (colonoscopies, breast MRIs, etc.).',
            'refs': '[ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/)'
        })

    # Cardiac genes
    cardiac_genes = {'SCN5A', 'KCNQ1', 'KCNH2', 'MYH7', 'MYBPC3', 'LMNA'}
    cardiac_findings = [f for f in affected_findings + findings['risk_factor'] if f.get('gene') in cardiac_genes]
    if cardiac_findings:
        genes = sorted(set(f['gene'] for f in cardiac_findings))
        actions.append({
            'priority': 2,
            'action': f"Cardiology evaluation for {'/'.join(genes)} variants",
            'explanation': 'Schedule an appointment with a cardiologist to discuss whether these cardiac gene variants require an ECG, echocardiogram, or other monitoring.',
            'refs': '[ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/)'
        })

    # High-confidence pathogenic (not cancer/cardiac)
    other_high = [f for f in affected_findings if f.get('gene') not in cancer_genes.union(cardiac_genes) and f.get('gold_stars', 0) >= 2]
    if other_high:
        conditions = sorted(set(f.get('traits', '').split(';')[0][:50] for f in other_high if f.get('traits')))[:3]
        actions.append({
            'priority': 3,
            'action': 'Specialist consultation for pathogenic findings',
            'explanation': f"Discuss these high-confidence pathogenic variants with your doctor to determine if specialist referral is needed: {', '.join(conditions) if conditions else 'multiple conditions detected'}.",
            'refs': '[ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/)'
        })

    # Carrier status - reproductive counseling
    if carrier_findings:
        genes = sorted(set(f['gene'] for f in carrier_findings[:5]))
        actions.append({
            'priority': 4,
            'action': f"Genetic counseling if planning pregnancy",
            'explanation': f"You are a carrier for {len(carrier_findings)} recessive conditions ({'/'.join(genes[:3])}...). If planning pregnancy, both partners should be tested to assess risk to offspring.",
            'refs': '[ACMG Guidelines](https://www.acmg.net/)'
        })

    # Drug response variants
    drug_high = [f for f in findings['drug_response'] if f.get('gold_stars', 0) >= 2]
    if drug_high:
        actions.append({
            'priority': 5,
            'action': 'Share pharmacogenomic findings with physicians',
            'explanation': f"Print or share this report with your doctors before starting new medications. You have {len(drug_high)} drug response variants that may affect dosing or drug selection.",
            'refs': '[PharmGKB](https://www.pharmgkb.org/)'
        })

    # Risk factors - monitoring
    risk_count = len(findings['risk_factor'])
    if risk_count > 0:
        diabetes_risk = [f for f in findings['risk_factor'] if 'diabet' in f.get('traits', '').lower()]
        heart_risk = [f for f in findings['risk_factor'] if any(x in f.get('traits', '').lower() for x in ['heart', 'coronary', 'cardio'])]
        cancer_risk = [f for f in findings['risk_factor'] if 'cancer' in f.get('traits', '').lower()]

        if diabetes_risk or heart_risk or cancer_risk:
            conditions = []
            if diabetes_risk: conditions.append('diabetes')
            if heart_risk: conditions.append('cardiovascular')
            if cancer_risk: conditions.append('cancer')
            actions.append({
                'priority': 6,
                'action': f"Preventive screening focus: {', '.join(conditions)}",
                'explanation': f"Discuss enhanced screening with your doctor for these conditions where you have genetic risk factors. This may include earlier or more frequent testing.",
                'refs': '[ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/)'
            })

    actions.sort(key=lambda x: x['priority'])
    return actions


def generate_report(findings, stats, genome_by_rsid):
    """Generate the exhaustive disease risk report."""
    print("Generating report...")

    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Count totals
    total_pathogenic = len(findings['pathogenic'])
    total_likely_path = len(findings['likely_pathogenic'])
    total_risk = len(findings['risk_factor'])
    total_drug = len(findings['drug_response'])
    total_protective = len(findings['protective'])
    total_other = len(findings['other_significant'])

    # Separate affected vs carrier for pathogenic
    affected_findings = []
    carrier_findings = []
    het_unknown_findings = []

    for f in findings['pathogenic'] + findings['likely_pathogenic']:
        status, desc = classify_zygosity_impact(f)
        f['zygosity_status'] = status
        f['zygosity_description'] = desc

        if status == 'AFFECTED':
            affected_findings.append(f)
        elif status == 'CARRIER':
            carrier_findings.append(f)
        else:
            het_unknown_findings.append(f)

    # Sort by gold stars (confidence) descending
    affected_findings.sort(key=lambda x: (-x['gold_stars'], x['gene']))
    carrier_findings.sort(key=lambda x: (-x['gold_stars'], x['gene']))
    het_unknown_findings.sort(key=lambda x: (-x['gold_stars'], x['gene']))
    findings['risk_factor'].sort(key=lambda x: (-x['gold_stars'], x['gene']))
    findings['drug_response'].sort(key=lambda x: (-x['gold_stars'], x['gene']))
    findings['protective'].sort(key=lambda x: (-x['gold_stars'], x['gene']))

    # Generate priority actions
    priority_actions = generate_priority_actions_disease(findings, affected_findings, carrier_findings)

    report = f"""# Exhaustive Disease Risk Report

**Generated:** {now}

---

## Priority Actions Summary

**Act on these first.** Each recommendation is based on ClinVar pathogenic variant findings.

"""
    for i, action in enumerate(priority_actions, 1):
        report += f"""{i}. **{action['action']}**
   → {action['explanation']}
   *Reference:* {action['refs']}

"""

    report += f"""---

## Executive Summary

### Genome Overview
- **Total SNPs in Raw Data:** {len(genome_by_rsid):,}
- **ClinVar Variants Scanned:** {stats['total_clinvar']:,}
- **Your Positions in ClinVar:** {stats['matched']:,}

### Clinical Findings Summary

| Category | Count | Description |
|----------|-------|-------------|
| 🔴 **Pathogenic (Affected)** | {len(affected_findings)} | Homozygous or dominant - clinical phenotype expected |
| 🟠 **Pathogenic (Carrier)** | {len(carrier_findings)} | Heterozygous carrier for recessive conditions |
| 🟡 **Likely Pathogenic** | {len(het_unknown_findings)} | Heterozygous, inheritance unclear |
| 🔵 **Risk Factors** | {total_risk} | Increased disease susceptibility |
| 💊 **Drug Response** | {total_drug} | Pharmacogenomic variants |
| 🟢 **Protective** | {total_protective} | Reduced disease risk |
| ⚪ **Other Associations** | {total_other} | Other clinically noted variants |

### Confidence Levels (Gold Stars)
- ⭐⭐⭐⭐ (4): Practice guideline / Expert panel reviewed
- ⭐⭐⭐ (3): Multiple submitters, no conflicts
- ⭐⭐ (2): Multiple submitters with some conflicts, or single submitter with criteria
- ⭐ (1): Single submitter with criteria
- ☆ (0): No assertion criteria provided

---

"""

    # AFFECTED SECTION
    if affected_findings:
        report += """## 🔴 Pathogenic Variants — Affected Status

These variants are classified as pathogenic and your genotype suggests you may be affected.
**Consult a genetic counselor or physician for clinical interpretation.**

"""
        for f in affected_findings:
            stars = '⭐' * f['gold_stars'] + '☆' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} — {f['traits'].split(';')[0] if f['traits'] else 'Condition not specified'}

| Field | Value |
|-------|-------|
| **Gene** | {f['gene']} |
| **Position** | chr{f['chromosome']}:{f['position']} |
| **RSID** | {f['rsid']} |
| **Your Genotype** | `{f['user_genotype']}` |
| **Variant** | {f['ref']} → {f['alt']} |
| **Zygosity** | {'Homozygous' if f['is_homozygous'] else 'Heterozygous'} |
| **Clinical Significance** | {f['clinical_significance']} |
| **Confidence** | {stars} ({f['gold_stars']}/4) |
| **Review Status** | {f['review_status']} |
| **Inheritance** | {f['inheritance'] if f['inheritance'] else 'Not specified'} |

**Condition(s):** {f['traits'] if f['traits'] else 'Not specified'}

**Molecular Detail:** {f['hgvs_p'] if f['hgvs_p'] else f['hgvs_c'] if f['hgvs_c'] else 'Not available'}

**Consequence:** {f['molecular_consequence'] if f['molecular_consequence'] else 'Not specified'}

{f'**Age of Onset:** {f["age_of_onset"]}' if f['age_of_onset'] else ''}
{f'**Prevalence:** {f["prevalence"]}' if f['prevalence'] else ''}

**Database References:** {f['xrefs'] if f['xrefs'] else 'None'}

**Literature:** {f['pmids'] if f['pmids'] else 'None'}

---

"""

    # CARRIER SECTION
    if carrier_findings:
        report += """## 🟠 Carrier Status — Recessive Conditions

You are a heterozygous carrier for these autosomal recessive conditions.
**Carriers typically do not show symptoms but may pass the variant to offspring.**

### Reproductive Implications
- If your partner is also a carrier for the same condition: **25% chance** of affected child
- If your partner is affected: **50% chance** of affected child
- Consider genetic counseling if planning pregnancy

"""
        for f in carrier_findings:
            stars = '⭐' * f['gold_stars'] + '☆' * (4 - f['gold_stars'])
            condition = f['traits'].split(';')[0] if f['traits'] else 'Condition not specified'

            # Add carrier-specific notes for known conditions
            carrier_notes = get_carrier_phenotype_notes(f['gene'], condition)

            report += f"""### {f['gene']} — {condition}

| Field | Value |
|-------|-------|
| **Gene** | {f['gene']} |
| **Position** | chr{f['chromosome']}:{f['position']} |
| **RSID** | {f['rsid']} |
| **Your Genotype** | `{f['user_genotype']}` (Carrier) |
| **Variant** | {f['ref']} → {f['alt']} |
| **Clinical Significance** | {f['clinical_significance']} |
| **Confidence** | {stars} ({f['gold_stars']}/4) |
| **Inheritance** | Autosomal Recessive |

**Full Condition(s):** {f['traits'] if f['traits'] else 'Not specified'}

**Molecular Detail:** {f['hgvs_p'] if f['hgvs_p'] else f['hgvs_c'] if f['hgvs_c'] else 'Not available'}

{carrier_notes}

**Database References:** {f['xrefs'] if f['xrefs'] else 'None'}

---

"""

    # HETEROZYGOUS UNKNOWN INHERITANCE
    if het_unknown_findings:
        report += """## 🟡 Pathogenic/Likely Pathogenic — Inheritance Unclear

You are heterozygous for these variants. The inheritance pattern is not clearly specified,
so clinical impact is uncertain. Some may be dominant (one copy = affected), others may be
carrier status only.

"""
        for f in het_unknown_findings:
            stars = '⭐' * f['gold_stars'] + '☆' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} — {f['traits'].split(';')[0] if f['traits'] else 'Condition not specified'}

| Field | Value |
|-------|-------|
| **Gene** | {f['gene']} |
| **Position** | chr{f['chromosome']}:{f['position']} |
| **RSID** | {f['rsid']} |
| **Your Genotype** | `{f['user_genotype']}` |
| **Variant** | {f['ref']} → {f['alt']} |
| **Clinical Significance** | {f['clinical_significance']} |
| **Confidence** | {stars} ({f['gold_stars']}/4) |
| **Inheritance** | {f['inheritance'] if f['inheritance'] else 'Not specified'} |

**Condition(s):** {f['traits'] if f['traits'] else 'Not specified'}

**Molecular Detail:** {f['hgvs_p'] if f['hgvs_p'] else f['hgvs_c'] if f['hgvs_c'] else 'Not available'}

---

"""

    # RISK FACTORS
    if findings['risk_factor']:
        report += """## 🔵 Risk Factor Variants

These variants are associated with increased susceptibility to certain conditions.
They do not guarantee disease but indicate elevated risk.

"""
        for f in findings['risk_factor']:
            stars = '⭐' * f['gold_stars'] + '☆' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} — {f['traits'].split(';')[0] if f['traits'] else 'Risk factor'}

| **RSID** | **Genotype** | **Significance** | **Confidence** |
|----------|--------------|------------------|----------------|
| {f['rsid']} | `{f['user_genotype']}` | {f['clinical_significance']} | {stars} |

**Associated Conditions:** {f['traits'] if f['traits'] else 'Not specified'}

---

"""

    # DRUG RESPONSE
    if findings['drug_response']:
        report += """## 💊 Drug Response Variants

These variants affect response to medications.

"""
        for f in findings['drug_response']:
            stars = '⭐' * f['gold_stars'] + '☆' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} — {f['traits'].split(';')[0] if f['traits'] else 'Drug response'}

| **RSID** | **Genotype** | **Significance** | **Confidence** |
|----------|--------------|------------------|----------------|
| {f['rsid']} | `{f['user_genotype']}` | {f['clinical_significance']} | {stars} |

**Drug/Response:** {f['traits'] if f['traits'] else 'Not specified'}

---

"""

    # PROTECTIVE
    if findings['protective']:
        report += """## 🟢 Protective Variants

These variants are associated with reduced disease risk or protective effects.

"""
        for f in findings['protective']:
            stars = '⭐' * f['gold_stars'] + '☆' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} — {f['traits'].split(';')[0] if f['traits'] else 'Protective'}

| **RSID** | **Genotype** | **Significance** | **Confidence** |
|----------|--------------|------------------|----------------|
| {f['rsid']} | `{f['user_genotype']}` | {f['clinical_significance']} | {stars} |

**Protective Against:** {f['traits'] if f['traits'] else 'Not specified'}

---

"""

    # OTHER SIGNIFICANT
    if findings['other_significant']:
        report += """## ⚪ Other Clinically Noted Variants

These variants have clinical annotations that don't fit the above categories.

"""
        for f in findings['other_significant'][:50]:  # Limit to 50
            stars = '⭐' * f['gold_stars'] + '☆' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} — {f['rsid']}

| **Genotype** | **Significance** | **Confidence** | **Traits** |
|--------------|------------------|----------------|------------|
| `{f['user_genotype']}` | {f['clinical_significance']} | {stars} | {f['traits'][:100] if f['traits'] else 'Not specified'}... |

---

"""

    # STATISTICS SECTION
    report += f"""## 📊 Analysis Statistics

| Metric | Value |
|--------|-------|
| Total SNPs in genome | {len(genome_by_rsid):,} |
| ClinVar variants scanned | {stats['total_clinvar']:,} |
| Genome positions with ClinVar data | {stats['matched']:,} |
| Pathogenic variants found | {stats['pathogenic_matched']} |
| Likely pathogenic variants found | {stats['likely_pathogenic_matched']} |
| Risk factors found | {len(findings['risk_factor'])} |
| Drug response variants | {len(findings['drug_response'])} |
| Protective variants | {len(findings['protective'])} |

---

## ⚠️ Important Disclaimer

This report is for **informational and educational purposes only**. It is NOT a clinical diagnosis.

### Key Points:
- Variant classifications are based on ClinVar submissions and may change over time
- Clinical significance depends on individual and family history
- Many variants have incomplete penetrance (not everyone with variant develops condition)
- Carrier status has reproductive implications but typically no personal health impact
- Variants with low gold stars have less evidence supporting their classification
- **Consult a genetic counselor or physician for clinical interpretation**

### How to Use This Report:
1. **Pathogenic/Affected**: Discuss with physician immediately
2. **Carrier Status**: Consider genetic counseling if planning pregnancy
3. **Risk Factors**: Inform preventive care decisions
4. **Drug Response**: Share with prescribing physicians

---

*Report generated using ClinVar database. Classifications reflect ClinVar submissions as of database download date.*
"""

    # Write report
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"Report written to: {OUTPUT_PATH}")
    return report


def get_carrier_phenotype_notes(gene, condition):
    """Return carrier-specific phenotype notes for known conditions."""

    carrier_effects = {
        'CFTR': """
**Carrier Phenotype Notes:**
- CF carriers may have ~10% reduced lung function (FEV1)
- Increased risk of pancreatitis (2-3x general population)
- Higher prevalence of chronic sinusitis
- Possible male fertility effects (CBAVD spectrum)
- **Recommended:** Baseline pulmonary function test, avoid smoking
""",
        'HBB': """
**Carrier Phenotype Notes (Sickle Cell Trait):**
- Generally asymptomatic under normal conditions
- Possible complications at extreme altitude or severe dehydration
- Malaria resistance (evolutionary advantage)
- Rare: exercise-related complications in extreme conditions
- **Recommended:** Stay hydrated during intense exercise; inform physicians before surgery
""",
        'SERPINA1': """
**Carrier Phenotype Notes (Alpha-1 Antitrypsin):**
- Carriers (MZ) have ~60% normal AAT levels
- Mildly increased risk of COPD, especially if smoking
- Possible liver involvement in some carriers
- **Recommended:** Absolutely avoid smoking; baseline liver function; consider AAT level testing
""",
        'GBA': """
**Carrier Phenotype Notes (Gaucher Disease):**
- Carriers have increased Parkinson's disease risk (5-8x)
- No Gaucher disease symptoms
- **Recommended:** Awareness of early Parkinson's symptoms; inform neurologist of carrier status
""",
        'HFE': """
**Carrier Phenotype Notes (Hemochromatosis):**
- Carriers may have mildly elevated iron absorption
- Usually clinically insignificant
- **Recommended:** Periodic ferritin monitoring; avoid unnecessary iron supplements
""",
        'HEXA': """
**Carrier Phenotype Notes (Tay-Sachs):**
- Carriers have no symptoms or health effects
- Purely reproductive implications
- **Recommended:** Carrier testing for partner if planning pregnancy
""",
        'SMN1': """
**Carrier Phenotype Notes (Spinal Muscular Atrophy):**
- Carriers have no symptoms
- ~1 in 50 people are carriers
- **Recommended:** Carrier testing for partner if planning pregnancy
""",
        'PAH': """
**Carrier Phenotype Notes (Phenylketonuria):**
- Carriers have no symptoms
- Normal phenylalanine metabolism
- **Recommended:** Carrier testing for partner if planning pregnancy
"""
    }

    gene_upper = gene.upper() if gene else ''
    if gene_upper in carrier_effects:
        return carrier_effects[gene_upper]

    return """
**Carrier Phenotype Notes:**
- Carrier status typically does not cause symptoms for recessive conditions
- Primary implication is reproductive risk if partner is also a carrier
- Some carriers may have subtle biochemical differences without clinical significance
- **Recommended:** Genetic counseling if planning pregnancy
"""


def main():
    print("=" * 60)
    print("Disease Risk Analyzer")
    print("=" * 60)
    print()

    # Load genome
    genome_by_rsid, genome_by_position = load_genome()

    # Load ClinVar and find matches
    findings, stats = load_clinvar(genome_by_position)

    # Generate report
    generate_report(findings, stats, genome_by_rsid)

    print()
    print("=" * 60)
    print("Analysis complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
