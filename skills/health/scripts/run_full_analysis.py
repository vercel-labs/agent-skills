#!/usr/bin/env python3
"""
Full Genetic Health Analysis Pipeline

This master script runs the complete genetic analysis workflow:
1. Lifestyle/Health Analysis -> EXHAUSTIVE_GENETIC_REPORT.md
2. Disease Risk Analysis -> EXHAUSTIVE_DISEASE_RISK_REPORT.md
3. Actionable Health Protocol -> ACTIONABLE_HEALTH_PROTOCOL.md

Usage:
    python run_full_analysis.py                     # Uses default genome.txt
    python run_full_analysis.py path/to/genome.txt  # Custom genome file
    python run_full_analysis.py --name "John Doe"   # Add name to reports
"""

import sys
import os
import shutil
import json
import csv
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# Add scripts directory to path for imports
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from comprehensive_snp_database import COMPREHENSIVE_SNPS

# Directory configuration
BASE_DIR = SCRIPT_DIR.parent
DATA_DIR = BASE_DIR / "data"
REPORTS_DIR = BASE_DIR / "reports"


def print_header(text):
    """Print a formatted header."""
    print()
    print("=" * 70)
    print(text)
    print("=" * 70)


def print_step(text):
    """Print a step indicator."""
    print(f"\n>>> {text}")


# =============================================================================
# GENOME LOADING
# =============================================================================

def load_genome(genome_path: Path) -> tuple:
    """Load 23andMe genome file into dictionaries."""
    print_step(f"Loading genome from {genome_path}")

    genome_by_rsid = {}
    genome_by_position = {}

    with open(genome_path, 'r') as f:
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
                    pos_key = f"{chrom}:{pos}"
                    genome_by_position[pos_key] = {
                        'rsid': rsid,
                        'genotype': genotype
                    }

    print(f"    Loaded {len(genome_by_rsid):,} SNPs")
    return genome_by_rsid, genome_by_position


# =============================================================================
# PHARMGKB LOADING
# =============================================================================

def load_pharmgkb() -> dict:
    """Load PharmGKB drug-gene annotations."""
    annotations_path = DATA_DIR / "clinical_annotations.tsv"
    alleles_path = DATA_DIR / "clinical_ann_alleles.tsv"

    if not annotations_path.exists() or not alleles_path.exists():
        print("    PharmGKB files not found, skipping drug interactions")
        return {}

    print_step("Loading PharmGKB data")

    pharmgkb = {}
    annotations = {}

    with open(annotations_path, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            ann_id = row.get('Clinical Annotation ID', '')
            variant = row.get('Variant/Haplotypes', '')
            if variant.startswith('rs'):
                annotations[ann_id] = {
                    'rsid': variant,
                    'gene': row.get('Gene', ''),
                    'drugs': row.get('Drug(s)', ''),
                    'phenotype': row.get('Phenotype(s)', ''),
                    'level': row.get('Level of Evidence', ''),
                    'category': row.get('Phenotype Category', ''),
                }

    with open(alleles_path, 'r') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            ann_id = row.get('Clinical Annotation ID', '')
            if ann_id in annotations:
                rsid = annotations[ann_id]['rsid']
                genotype = row.get('Genotype/Allele', '')
                if rsid not in pharmgkb:
                    pharmgkb[rsid] = {
                        'gene': annotations[ann_id]['gene'],
                        'drugs': annotations[ann_id]['drugs'],
                        'phenotype': annotations[ann_id]['phenotype'],
                        'level': annotations[ann_id]['level'],
                        'category': annotations[ann_id]['category'],
                        'genotypes': {}
                    }
                pharmgkb[rsid]['genotypes'][genotype] = row.get('Annotation Text', '')

    print(f"    Loaded {len(pharmgkb):,} drug-gene interactions")
    return pharmgkb


# =============================================================================
# LIFESTYLE/HEALTH ANALYSIS
# =============================================================================

def analyze_lifestyle_health(genome_by_rsid: dict, pharmgkb: dict) -> dict:
    """Analyze genome against lifestyle/health SNP database."""
    print_step("Running lifestyle/health analysis")

    results = {
        'findings': [],
        'pharmgkb_findings': [],
        'by_category': defaultdict(list),
        'summary': {
            'total_snps': len(genome_by_rsid),
            'analyzed_snps': 0,
            'high_impact': 0,
            'moderate_impact': 0,
            'low_impact': 0,
        }
    }

    # Check against comprehensive database
    for rsid, info in COMPREHENSIVE_SNPS.items():
        if rsid in genome_by_rsid:
            genotype = genome_by_rsid[rsid]['genotype']
            genotype_rev = genotype[::-1] if len(genotype) == 2 else genotype

            variant_info = info['variants'].get(genotype) or info['variants'].get(genotype_rev)

            if variant_info:
                finding = {
                    'rsid': rsid,
                    'gene': info['gene'],
                    'category': info['category'],
                    'genotype': genotype,
                    'status': variant_info['status'],
                    'description': variant_info['desc'],
                    'magnitude': variant_info['magnitude'],
                    'note': info.get('note', ''),
                }
                results['findings'].append(finding)
                results['by_category'][info['category']].append(finding)
                results['summary']['analyzed_snps'] += 1

                if variant_info['magnitude'] >= 3:
                    results['summary']['high_impact'] += 1
                elif variant_info['magnitude'] >= 2:
                    results['summary']['moderate_impact'] += 1
                elif variant_info['magnitude'] >= 1:
                    results['summary']['low_impact'] += 1

    # Check PharmGKB
    for rsid, info in pharmgkb.items():
        if rsid in genome_by_rsid:
            genotype = genome_by_rsid[rsid]['genotype']
            genotype_rev = genotype[::-1] if len(genotype) == 2 else genotype
            annotation = info['genotypes'].get(genotype) or info['genotypes'].get(genotype_rev)
            if annotation and info['level'] in ['1A', '1B', '2A', '2B']:
                finding = {
                    'rsid': rsid,
                    'gene': info['gene'],
                    'drugs': info['drugs'],
                    'genotype': genotype,
                    'annotation': annotation,
                    'level': info['level'],
                    'category': info['category'],
                }
                results['pharmgkb_findings'].append(finding)

    # Sort findings
    results['findings'].sort(key=lambda x: -x['magnitude'])
    results['pharmgkb_findings'].sort(key=lambda x: x['level'])

    print(f"    Found {len(results['findings'])} lifestyle/health findings")
    print(f"    Found {len(results['pharmgkb_findings'])} drug-gene interactions")

    return results


# =============================================================================
# DISEASE RISK ANALYSIS
# =============================================================================

def load_clinvar_and_analyze(genome_by_position: dict) -> tuple:
    """Load ClinVar and analyze for disease variants."""
    clinvar_path = DATA_DIR / "clinvar_alleles.tsv"

    if not clinvar_path.exists():
        print("    ClinVar file not found, skipping disease risk analysis")
        return None, None

    print_step("Loading ClinVar and analyzing disease risk")

    findings = {
        'pathogenic': [],
        'likely_pathogenic': [],
        'risk_factor': [],
        'drug_response': [],
        'protective': [],
        'other_significant': []
    }

    stats = {
        'total_clinvar': 0,
        'matched': 0,
        'pathogenic_matched': 0,
        'likely_pathogenic_matched': 0
    }

    with open(clinvar_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')

        for row in reader:
            stats['total_clinvar'] += 1

            chrom = row['chrom']
            pos = row['pos']
            pos_key = f"{chrom}:{pos}"

            if pos_key not in genome_by_position:
                continue

            stats['matched'] += 1

            user_data = genome_by_position[pos_key]
            user_genotype = user_data['genotype']
            ref_allele = row['ref']
            alt_allele = row['alt']
            clinical_sig = row['clinical_significance'].lower()

            # Only process true SNPs
            if len(ref_allele) != 1 or len(alt_allele) != 1:
                continue

            has_variant = alt_allele in user_genotype
            is_homozygous = user_genotype == alt_allele + alt_allele
            is_heterozygous = has_variant and not is_homozygous
            has_ref_only = user_genotype == ref_allele + ref_allele

            if has_ref_only or not has_variant:
                continue

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
                'review_status': row['review_status'],
                'gold_stars': int(row['gold_stars']) if row['gold_stars'] else 0,
                'traits': row['all_traits'],
                'inheritance': row.get('inheritance_modes', ''),
                'hgvs_p': row.get('hgvs_p', ''),
                'hgvs_c': row.get('hgvs_c', ''),
                'molecular_consequence': row.get('molecular_consequence', ''),
                'xrefs': row.get('xrefs', '')
            }

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

    print(f"    ClinVar entries scanned: {stats['total_clinvar']:,}")
    print(f"    Pathogenic variants: {stats['pathogenic_matched']}")
    print(f"    Likely pathogenic: {stats['likely_pathogenic_matched']}")
    print(f"    Risk factors: {len(findings['risk_factor'])}")

    return findings, stats


def classify_zygosity(finding):
    """Classify zygosity impact."""
    inheritance = finding['inheritance'].lower() if finding['inheritance'] else ''

    if finding['is_homozygous']:
        return 'AFFECTED', 'Homozygous for variant'
    elif finding['is_heterozygous']:
        if 'recessive' in inheritance:
            return 'CARRIER', 'Heterozygous carrier (recessive)'
        elif 'dominant' in inheritance:
            return 'AFFECTED', 'Heterozygous (dominant)'
        else:
            return 'HETEROZYGOUS', 'Heterozygous (inheritance unclear)'
    return 'UNKNOWN', 'Zygosity unclear'


# =============================================================================
# REPORT GENERATION
# =============================================================================

def generate_exhaustive_genetic_report(results: dict, output_path: Path, subject_name: str = None):
    """Generate the exhaustive lifestyle/health genetic report."""
    print_step(f"Generating exhaustive genetic report")

    # Import the generator logic
    from generate_exhaustive_report import (
        generate_executive_summary, generate_priority_findings,
        generate_pathway_analysis, generate_full_findings,
        generate_pharmgkb_report, generate_action_summary, generate_disclaimer,
        CLINICAL_CONTEXT, PATHWAYS
    )

    # Build the data structure expected by generator
    data = {
        'findings': results['findings'],
        'pharmgkb_findings': results['pharmgkb_findings'],
        'summary': results['summary']
    }

    # Generate report parts
    report_parts = []
    report_parts.append(generate_executive_summary(data))
    report_parts.append(generate_priority_findings(results['findings']))
    report_parts.append(generate_pathway_analysis(results['findings']))
    report_parts.append(generate_full_findings(results['findings']))
    report_parts.append(generate_pharmgkb_report(results['pharmgkb_findings']))
    report_parts.append(generate_action_summary(results['findings']))
    report_parts.append(generate_disclaimer())

    full_report = "\n".join(report_parts)

    # Add subject name if provided
    if subject_name:
        full_report = full_report.replace(
            "# Exhaustive Genetic Health Report",
            f"# Exhaustive Genetic Health Report\n\n**Subject:** {subject_name}"
        )

    with open(output_path, 'w') as f:
        f.write(full_report)

    print(f"    Written to: {output_path}")


def generate_disease_risk_report(findings: dict, stats: dict, genome_count: int,
                                  output_path: Path, subject_name: str = None):
    """Generate the exhaustive disease risk report."""
    print_step("Generating disease risk report")

    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Classify findings
    affected = []
    carriers = []
    het_unknown = []

    for f in findings['pathogenic'] + findings['likely_pathogenic']:
        status, desc = classify_zygosity(f)
        f['zygosity_status'] = status
        f['zygosity_description'] = desc

        if status == 'AFFECTED':
            affected.append(f)
        elif status == 'CARRIER':
            carriers.append(f)
        else:
            het_unknown.append(f)

    # Sort by confidence
    for lst in [affected, carriers, het_unknown]:
        lst.sort(key=lambda x: (-x['gold_stars'], x['gene']))
    findings['risk_factor'].sort(key=lambda x: (-x['gold_stars'], x['gene']))
    findings['drug_response'].sort(key=lambda x: (-x['gold_stars'], x['gene']))
    findings['protective'].sort(key=lambda x: (-x['gold_stars'], x['gene']))

    subject_line = f"\n**Subject:** {subject_name}" if subject_name else ""

    report = f"""# Exhaustive Disease Risk Report
{subject_line}
**Generated:** {now}

---

## Executive Summary

### Genome Overview
- **Total SNPs in Raw Data:** {genome_count:,}
- **ClinVar Variants Scanned:** {stats['total_clinvar']:,}

### Clinical Findings Summary

| Category | Count | Description |
|----------|-------|-------------|
| **Pathogenic (Affected)** | {len(affected)} | Homozygous or dominant |
| **Pathogenic (Carrier)** | {len(carriers)} | Heterozygous carrier for recessive |
| **Likely Pathogenic** | {len(het_unknown)} | Heterozygous, inheritance unclear |
| **Risk Factors** | {len(findings['risk_factor'])} | Increased susceptibility |
| **Drug Response** | {len(findings['drug_response'])} | Pharmacogenomic variants |
| **Protective** | {len(findings['protective'])} | Reduced disease risk |

---

"""

    # Affected section
    if affected:
        report += "## Pathogenic Variants - Affected Status\n\n"
        for f in affected:
            stars = '*' * f['gold_stars'] + '.' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} - {f['traits'].split(';')[0] if f['traits'] else 'Unknown'}

- **Position:** chr{f['chromosome']}:{f['position']}
- **RSID:** {f['rsid']}
- **Genotype:** `{f['user_genotype']}` ({'Homozygous' if f['is_homozygous'] else 'Heterozygous'})
- **Variant:** {f['ref']} -> {f['alt']}
- **Confidence:** {stars} ({f['gold_stars']}/4)
- **Condition:** {f['traits'] if f['traits'] else 'Not specified'}

---

"""

    # Carrier section
    if carriers:
        report += "## Carrier Status - Recessive Conditions\n\n"
        report += "**You are a carrier - no personal symptoms expected, but reproductive implications.**\n\n"
        for f in carriers:
            stars = '*' * f['gold_stars'] + '.' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} - {f['traits'].split(';')[0] if f['traits'] else 'Unknown'}

- **RSID:** {f['rsid']}
- **Genotype:** `{f['user_genotype']}` (Carrier)
- **Confidence:** {stars} ({f['gold_stars']}/4)
- **Condition:** {f['traits'] if f['traits'] else 'Not specified'}

---

"""

    # Het unknown section
    if het_unknown:
        report += "## Pathogenic/Likely Pathogenic - Inheritance Unclear\n\n"
        for f in het_unknown:
            stars = '*' * f['gold_stars'] + '.' * (4 - f['gold_stars'])
            report += f"""### {f['gene']} - {f['traits'].split(';')[0] if f['traits'] else 'Unknown'}

- **RSID:** {f['rsid']}
- **Genotype:** `{f['user_genotype']}`
- **Confidence:** {stars} ({f['gold_stars']}/4)
- **Condition:** {f['traits'] if f['traits'] else 'Not specified'}

---

"""

    # Risk factors
    if findings['risk_factor']:
        report += "## Risk Factor Variants\n\n"
        for f in findings['risk_factor'][:30]:
            report += f"- **{f['gene']}** ({f['rsid']}): `{f['user_genotype']}` - {f['traits'][:80] if f['traits'] else 'Risk factor'}...\n"
        report += "\n---\n\n"

    # Drug response
    if findings['drug_response']:
        report += "## Drug Response Variants\n\n"
        for f in findings['drug_response'][:30]:
            report += f"- **{f['gene']}** ({f['rsid']}): `{f['user_genotype']}` - {f['traits'][:80] if f['traits'] else 'Drug response'}...\n"
        report += "\n---\n\n"

    # Protective
    if findings['protective']:
        report += "## Protective Variants\n\n"
        for f in findings['protective']:
            report += f"- **{f['gene']}** ({f['rsid']}): `{f['user_genotype']}` - {f['traits'][:80] if f['traits'] else 'Protective'}...\n"
        report += "\n---\n\n"

    report += """## Disclaimer

This report is for **informational purposes only**. It is NOT a clinical diagnosis.

- Consult a genetic counselor or physician for clinical interpretation
- Variant classifications may change as research progresses
- Carrier status has reproductive implications

---

*Generated using ClinVar database*
"""

    with open(output_path, 'w') as f:
        f.write(report)

    print(f"    Written to: {output_path}")


def generate_protocol_priority_actions(findings_dict, health_results, disease_findings, affected, carriers, het_unknown):
    """Generate Priority Actions for the actionable protocol with references and explanations."""
    actions = []

    # 1. Cancer genes requiring genetic counseling
    cancer_genes = {'MEN1', 'PALB2', 'BRCA1', 'BRCA2', 'TP53', 'APC', 'MLH1', 'MSH2', 'CDH1', 'STK11'}
    cancer_findings = [f for f in affected + het_unknown if f.get('gene') in cancer_genes and f.get('gold_stars', 0) >= 2]
    if cancer_findings:
        genes = sorted(set(f['gene'] for f in cancer_findings))
        stars = max(f.get('gold_stars', 0) for f in cancer_findings)
        actions.append({
            'priority': 1,
            'action': f"Genetic counseling for {'/'.join(genes)} cancer variant(s)",
            'explanation': f'Schedule an appointment with a certified genetic counselor to discuss whether these {stars}-star confidence variants require additional cancer screening (colonoscopies, breast MRIs, etc.).',
            'refs': '[ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/), [NCCN Guidelines](https://www.nccn.org/)'
        })

    # 2. Blood pressure monitoring
    bp_genes = ['AGTR1', 'ACE', 'AGT', 'GNB3', 'HFE']
    bp_findings = [findings_dict[g] for g in bp_genes if g in findings_dict and findings_dict[g].get('magnitude', 0) >= 1]
    if len(bp_findings) >= 2:
        genes_str = ', '.join([g for g in bp_genes if g in findings_dict])
        actions.append({
            'priority': 2,
            'action': 'Blood pressure monitoring at home',
            'explanation': f'Buy a home blood pressure monitor and check your BP weekly, since you have multiple gene variants ({genes_str}) that increase hypertension risk.',
            'refs': '[PMID:16046653](https://pubmed.ncbi.nlm.nih.gov/16046653/)'
        })

    # 3. Eye exams - macular degeneration
    amd_genes = ['CFH', 'C3', 'ERCC6', 'ARMS2']
    amd_risk = disease_findings.get('risk_factor', []) if disease_findings else []
    amd_findings = [f for f in amd_risk if any(g in str(f.get('gene', '')).upper() for g in amd_genes)]
    amd_lifestyle = [findings_dict[g] for g in amd_genes if g in findings_dict]
    if amd_findings or amd_lifestyle:
        actions.append({
            'priority': 3,
            'action': 'Regular eye exams (ophthalmology)',
            'explanation': 'Get annual dilated eye exams from an ophthalmologist (not just optometrist) to catch early signs of age-related macular degeneration.',
            'refs': '[PMID:15761122](https://pubmed.ncbi.nlm.nih.gov/15761122/)'
        })

    # 4. Exercise for BDNF
    if 'BDNF' in findings_dict and findings_dict['BDNF'].get('magnitude', 0) >= 2:
        actions.append({
            'priority': 4,
            'action': 'Exercise consistently - critical for BDNF',
            'explanation': 'Exercise at least 150 min/week because your BDNF gene variant means your brain produces less growth factor at rest, but exercise strongly boosts it.',
            'refs': '[PMID:12802256](https://pubmed.ncbi.nlm.nih.gov/12802256/)'
        })

    # 5. Iron monitoring - HFE
    if 'HFE' in findings_dict:
        actions.append({
            'priority': 5,
            'action': 'Iron monitoring - HFE carrier',
            'explanation': 'Get a ferritin blood test every 1-2 years and avoid iron supplements unless a doctor confirms deficiency, because your HFE variant causes increased iron absorption.',
            'refs': '[PMID:10807540](https://pubmed.ncbi.nlm.nih.gov/10807540/)'
        })

    # 6. Statin caution - SLCO1B1
    if 'SLCO1B1' in findings_dict and findings_dict['SLCO1B1'].get('magnitude', 0) >= 3:
        actions.append({
            'priority': 6,
            'action': 'Statin caution - SLCO1B1 intermediate metabolizer',
            'explanation': 'If you need cholesterol medication, ask your doctor for rosuvastatin, pravastatin, or fluvastatin instead of simvastatin, because your SLCO1B1 gene makes simvastatin 4x more likely to cause muscle pain/damage.',
            'refs': '[PMID:22617227](https://pubmed.ncbi.nlm.nih.gov/22617227/), [CPIC](https://cpicpgx.org/guidelines/guideline-for-statins-and-slco1b1/)'
        })

    # 7. Warfarin dose reduction - CYP2C9
    if 'CYP2C9' in findings_dict and findings_dict['CYP2C9'].get('magnitude', 0) >= 3:
        actions.append({
            'priority': 7,
            'action': 'Warfarin dose reduction if prescribed',
            'explanation': 'If ever prescribed warfarin (blood thinner), tell your doctor you are a CYP2C9 intermediate metabolizer and will likely need a 25-30% lower dose to avoid bleeding complications.',
            'refs': '[PMID:21900891](https://pubmed.ncbi.nlm.nih.gov/21900891/)'
        })

    # 8. Methylation support - MTHFR/MTRR
    has_mthfr = 'MTHFR' in findings_dict and findings_dict['MTHFR'].get('magnitude', 0) >= 2
    has_mtrr = 'MTRR' in findings_dict and findings_dict['MTRR'].get('magnitude', 0) >= 2
    if has_mthfr or has_mtrr:
        genes = []
        if has_mthfr: genes.append('MTHFR')
        if has_mtrr: genes.append('MTRR')
        actions.append({
            'priority': 8,
            'action': f"Methylation support ({'/'.join(genes)})",
            'explanation': 'Consider taking methylfolate (not folic acid) and methylcobalamin (not regular B12) supplements, because your gene variants reduce your ability to process the standard forms.',
            'refs': '[PMID:19805654](https://pubmed.ncbi.nlm.nih.gov/19805654/)'
        })

    # 9. Caffeine caution
    caffeine_issues = []
    if 'CYP1A2' in findings_dict and findings_dict['CYP1A2'].get('status') in ['slow', 'intermediate']:
        caffeine_issues.append('slow metabolizer')
    if 'ADORA2A' in findings_dict and 'anxiety' in findings_dict['ADORA2A'].get('status', ''):
        caffeine_issues.append('anxiety variant')
    if caffeine_issues:
        actions.append({
            'priority': 9,
            'action': 'Caffeine - limit to mornings only',
            'explanation': 'Limit coffee/caffeine to before 10am and consider smaller amounts, because your genes mean caffeine stays in your system longer and is more likely to cause jitteriness/anxiety.',
            'refs': '[PMID:17522618](https://pubmed.ncbi.nlm.nih.gov/17522618/)'
        })

    # 10. Circadian support
    if 'ARNTL' in findings_dict and findings_dict['ARNTL'].get('magnitude', 0) >= 2:
        actions.append({
            'priority': 10,
            'action': 'Circadian rhythm support',
            'explanation': 'Maintain strict sleep/wake times (even weekends) and get bright light exposure within 30 minutes of waking, because your ARNTL gene variant means your internal body clock is weaker than average.',
            'refs': '[PMID:17060375](https://pubmed.ncbi.nlm.nih.gov/17060375/)'
        })

    actions.sort(key=lambda x: x['priority'])
    return actions


def generate_actionable_protocol(health_results: dict, disease_findings: dict,
                                  output_path: Path, subject_name: str = None):
    """Generate comprehensive actionable health protocol combining ALL sources."""
    print_step("Generating actionable health protocol (comprehensive)")

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    subject_line = f"\n**Subject:** {subject_name}" if subject_name else ""

    # Build lookup dictionaries
    findings_dict = {f['gene']: f for f in health_results['findings']}

    # Classify disease findings
    affected = []
    carriers = []
    het_unknown = []

    if disease_findings:
        for f in disease_findings.get('pathogenic', []) + disease_findings.get('likely_pathogenic', []):
            inheritance = f.get('inheritance', '').lower()
            if f.get('is_homozygous'):
                affected.append(f)
            elif f.get('is_heterozygous'):
                if 'recessive' in inheritance:
                    carriers.append(f)
                elif 'dominant' in inheritance:
                    affected.append(f)
                else:
                    het_unknown.append(f)

    # Generate priority actions
    priority_actions = generate_protocol_priority_actions(findings_dict, health_results, disease_findings, affected, carriers, het_unknown)

    # Count totals for summary
    total_lifestyle = len(health_results['findings'])
    total_pharmgkb = len(health_results['pharmgkb_findings'])
    total_risk_factors = len(disease_findings.get('risk_factor', [])) if disease_findings else 0
    total_drug_response = len(disease_findings.get('drug_response', [])) if disease_findings else 0
    total_protective = len(disease_findings.get('protective', [])) if disease_findings else 0

    report = f"""# Actionable Health Protocol (V3)
{subject_line}
**Generated:** {now}

This protocol synthesizes ALL genetic findings into concrete recommendations:
- Lifestyle/health genetics ({total_lifestyle} findings)
- PharmGKB drug interactions ({total_pharmgkb} interactions)
- Pathogenic/likely pathogenic variants ({len(affected)} affected, {len(carriers)} carrier, {len(het_unknown)} unclear)
- Risk factors ({total_risk_factors} variants)
- ClinVar drug response ({total_drug_response} variants)
- Protective variants ({total_protective} variants)

---

## Priority Actions Summary

**Act on these first.** Each recommendation is backed by your genetic findings.

"""

    for i, action in enumerate(priority_actions, 1):
        report += f"""{i}. **{action['action']}**
   → {action['explanation']}
   *Reference:* {action['refs']}

"""

    report += """---

## Executive Summary

### High-Impact Lifestyle Findings (Magnitude >= 3)

"""

    high_impact = [f for f in health_results['findings'] if f['magnitude'] >= 3]
    if high_impact:
        for f in high_impact:
            report += f"- **{f['gene']}** ({f['category']}): {f['description']}\n"
    else:
        report += "None detected.\n"

    report += "\n### Pathogenic/Likely Pathogenic Variants\n\n"

    if affected:
        report += "**Affected Status:**\n"
        for f in affected:
            condition = f['traits'].split(';')[0] if f['traits'] else 'Unknown condition'
            stars = f['gold_stars']
            confidence = f"({stars}/4 stars)" if stars > 0 else "(low confidence)"
            report += f"- **{f['gene']}**: {condition} {confidence}\n"
        report += "\n"

    if carriers:
        report += "**Carrier Status (Recessive):**\n"
        for f in carriers:
            condition = f['traits'].split(';')[0] if f['traits'] else 'Unknown condition'
            stars = f['gold_stars']
            confidence = f"({stars}/4 stars)" if stars > 0 else "(low confidence)"
            report += f"- **{f['gene']}**: {condition} {confidence}\n"
        report += "\n"

    if het_unknown:
        report += "**Heterozygous (Inheritance Unclear):**\n"
        for f in het_unknown:
            condition = f['traits'].split(';')[0] if f['traits'] else 'Unknown condition'
            stars = f['gold_stars']
            confidence = f"({stars}/4 stars)" if stars > 0 else "(low confidence)"
            report += f"- **{f['gene']}**: {condition} {confidence}\n"
        report += "\n"

    if not affected and not carriers and not het_unknown:
        report += "None detected.\n\n"

    # Protective variants
    report += "### Protective Variants\n\n"
    if disease_findings and disease_findings.get('protective'):
        for f in disease_findings['protective']:
            condition = f['traits'].split(';')[0] if f['traits'] else 'Protective effect'
            report += f"- **{f['gene']}**: {condition}\n"
    else:
        report += "None detected.\n"

    report += """

---

## Supplement Recommendations

*Discuss with healthcare provider before starting any supplements*

"""

    supplements = []

    # MTHFR
    if 'MTHFR' in findings_dict and findings_dict['MTHFR']['magnitude'] >= 2:
        supplements.append({
            'name': 'Methylfolate (L-5-MTHF)',
            'dose': '400-800mcg daily',
            'reason': 'MTHFR variant reduces folic acid conversion',
            'source': 'MTHFR (lifestyle)',
            'notes': 'Avoid synthetic folic acid. Start low if slow COMT.'
        })
        supplements.append({
            'name': 'Methylcobalamin (B12)',
            'dose': '1000mcg sublingual',
            'reason': 'Supports methylation cycle',
            'source': 'MTHFR (lifestyle)',
            'notes': 'Prefer methylcobalamin over cyanocobalamin'
        })

    # MTRR from lifestyle
    if 'MTRR' in findings_dict and findings_dict['MTRR']['magnitude'] >= 2:
        # Check if B12 already added
        if not any('B12' in s['name'] for s in supplements):
            supplements.append({
                'name': 'Methylcobalamin (B12)',
                'dose': '1000-5000mcg sublingual',
                'reason': 'MTRR variant impairs B12 recycling',
                'source': 'MTRR (lifestyle)',
                'notes': 'May need higher doses than typical'
            })

    # Vitamin D
    if 'GC' in findings_dict and findings_dict['GC'].get('status') == 'low':
        supplements.append({
            'name': 'Vitamin D3',
            'dose': '2000-5000 IU daily',
            'reason': 'Genetically low vitamin D binding protein',
            'source': 'GC (lifestyle)',
            'notes': 'Take with fat. Test 25-OH-D after 2-3 months. Target 40-60 ng/mL.'
        })
        supplements.append({
            'name': 'Vitamin K2 (MK-7)',
            'dose': '100-200mcg daily',
            'reason': 'Synergistic with D3 for calcium metabolism',
            'source': 'GC (lifestyle)',
            'notes': 'Optional but recommended with high-dose D3'
        })

    # Omega-3
    if 'FADS1' in findings_dict and findings_dict['FADS1'].get('status') == 'low_conversion':
        supplements.append({
            'name': 'Fish Oil or Algae Oil (EPA/DHA)',
            'dose': '1-2g EPA+DHA daily',
            'reason': 'Poor conversion from plant omega-3s (ALA)',
            'source': 'FADS1 (lifestyle)',
            'notes': 'Direct marine source required. Flax/chia insufficient.'
        })

    # Magnesium for COMT
    if 'COMT' in findings_dict and findings_dict['COMT'].get('status') == 'slow':
        supplements.append({
            'name': 'Magnesium Glycinate',
            'dose': '300-400mg evening',
            'reason': 'Supports COMT function, calming effect',
            'source': 'COMT (lifestyle)',
            'notes': 'Glycinate form preferred for bioavailability and sleep'
        })

    # Choline for PEMT
    if 'PEMT' in findings_dict:
        supplements.append({
            'name': 'Choline (Phosphatidylcholine or CDP-Choline)',
            'dose': '250-500mg daily',
            'reason': 'PEMT variant increases dietary choline requirement',
            'source': 'PEMT (lifestyle)',
            'notes': 'Eggs are excellent food source (2 eggs = ~300mg)'
        })

    # BCMO1 - Vitamin A
    if 'BCMO1' in findings_dict and findings_dict['BCMO1'].get('status') == 'reduced':
        supplements.append({
            'name': 'Preformed Vitamin A or Cod Liver Oil',
            'dose': '2500-5000 IU (as retinol)',
            'reason': 'Poor conversion from beta-carotene',
            'source': 'BCMO1 (lifestyle)',
            'notes': 'Get from food (liver, eggs) or supplement. Avoid excess.'
        })

    # IL6 inflammation
    if 'IL6' in findings_dict and findings_dict['IL6'].get('status') == 'high':
        supplements.append({
            'name': 'Omega-3 (EPA/DHA)',
            'dose': '2-3g daily',
            'reason': 'Higher baseline inflammation (IL-6)',
            'source': 'IL6 (lifestyle)',
            'notes': 'Anti-inflammatory. Consider curcumin as well.'
        })

    if supplements:
        report += "| Supplement | Dose | Reason | Notes |\n"
        report += "|------------|------|--------|-------|\n"
        for s in supplements:
            report += f"| {s['name']} | {s['dose']} | {s['reason']} | {s['notes']} |\n"
    else:
        report += "No specific supplements indicated by genetic profile.\n"

    report += """

---

## Dietary Recommendations

"""

    diet_recs = []

    # Saturated fat
    if 'APOA2' in findings_dict and findings_dict['APOA2'].get('status') == 'sensitive':
        diet_recs.append("**Limit saturated fat (<7% calories)**: APOA2 variant links sat fat intake to weight gain. Minimize butter, fatty red meat, full-fat dairy, coconut oil. Prefer olive oil, nuts, avocado.")

    # Folate foods
    if 'MTHFR' in findings_dict and findings_dict['MTHFR']['magnitude'] >= 2:
        diet_recs.append("**Emphasize folate-rich foods**: Leafy greens, legumes, liver. Avoid folic acid-fortified processed foods when possible (UMFA accumulation risk).")

    # Anti-inflammatory
    if 'IL6' in findings_dict:
        diet_recs.append("**Anti-inflammatory diet**: Omega-3 rich fish, colorful vegetables, minimize processed foods. Sleep deprivation spikes IL-6.")

    # Lactose
    if 'MCM6/LCT' in findings_dict and 'intolerant' in findings_dict['MCM6/LCT'].get('status', ''):
        diet_recs.append("**Lactose intolerance**: May tolerate small amounts or fermented dairy (yogurt, aged cheese). Lactase supplements available. Ensure calcium from other sources.")

    # Celiac risk
    if 'HLA-DQA1' in findings_dict:
        diet_recs.append("**Celiac risk (HLA-DQ2.5)**: No preventive gluten-free diet needed. If GI symptoms arise, get celiac antibody testing (tTG-IgA) *while still eating gluten*.")

    # Caffeine
    caffeine_issues = []
    if 'CYP1A2' in findings_dict and findings_dict['CYP1A2'].get('status') in ['slow', 'intermediate']:
        caffeine_issues.append("slow metabolizer")
    if 'ADORA2A' in findings_dict and findings_dict['ADORA2A'].get('status') == 'anxiety_prone':
        caffeine_issues.append("anxiety-prone")
    if 'COMT' in findings_dict and findings_dict['COMT'].get('status') == 'slow':
        caffeine_issues.append("slow COMT")

    if caffeine_issues:
        diet_recs.append(f"**Caffeine caution** ({', '.join(caffeine_issues)}): Limit to morning only (before 10am). Consider lower doses, green tea (L-theanine), or alternatives.")

    # Iron
    if 'HFE' in findings_dict:
        diet_recs.append("**Iron awareness (HFE carrier)**: Don't supplement iron unless deficiency confirmed. Blood donation helps regulate if ferritin runs high.")

    if diet_recs:
        for rec in diet_recs:
            report += f"- {rec}\n\n"
    else:
        report += "No specific dietary modifications beyond general healthy eating.\n"

    report += """
---

## Lifestyle Recommendations

"""

    lifestyle_recs = []

    # Stress management for slow COMT
    if 'COMT' in findings_dict and findings_dict['COMT'].get('status') == 'slow':
        lifestyle_recs.append("**Stress management is critical**: Slow COMT means catecholamines (dopamine, norepinephrine) build up under stress. Daily meditation, breathwork, adequate sleep. Avoid combining multiple stimulants.")

    # Exercise for BDNF
    if 'BDNF' in findings_dict and findings_dict['BDNF']['magnitude'] >= 2:
        lifestyle_recs.append("**Exercise is essential**: BDNF variant reduces activity-dependent brain growth factor. Physical activity is one of the strongest natural BDNF boosters.")

    # Exercise type for ACTN3
    if 'ACTN3' in findings_dict:
        status = findings_dict['ACTN3'].get('status', '')
        if status == 'endurance':
            lifestyle_recs.append("**Training style (ACTN3 endurance)**: Genetics favor endurance/aerobic training. Can still build strength but may excel at higher volume, aerobic work.")
        elif status == 'power':
            lifestyle_recs.append("**Training style (ACTN3 power)**: Genetics favor explosive/strength training. May recover faster from power-based work.")
        else:
            lifestyle_recs.append("**Training style (ACTN3 mixed)**: Versatile profile - respond well to both power and endurance training.")

    # Circadian rhythm
    if 'ARNTL' in findings_dict:
        lifestyle_recs.append("**Circadian rhythm support (ARNTL)**: May have weaker internal clock. Strong morning light exposure, consistent sleep/wake times even weekends, blue light reduction in evening.")

    # Blood pressure
    bp_genes = ['AGTR1', 'ACE', 'AGT', 'GNB3']
    bp_findings = [findings_dict[g] for g in bp_genes if g in findings_dict]
    if len(bp_findings) >= 2:
        lifestyle_recs.append("**Blood pressure focus**: Multiple BP-related variants. Regular monitoring, sodium restriction, DASH diet pattern, 150+ min/week aerobic exercise.")

    # Skin aging
    if 'MC1R' in findings_dict:
        lifestyle_recs.append("**Sun protection (MC1R)**: Accelerated skin aging variant. Daily SPF 30+, topical retinoids, antioxidant serums. Avoid excessive sun exposure.")

    if lifestyle_recs:
        for rec in lifestyle_recs:
            report += f"- {rec}\n\n"
    else:
        report += "Standard healthy lifestyle recommendations apply.\n"

    report += """
---

## Monitoring Recommendations

"""

    monitoring = []

    # Homocysteine
    if 'MTHFR' in findings_dict and findings_dict['MTHFR']['magnitude'] >= 2:
        monitoring.append("**Homocysteine**: Annually. Target <10 μmol/L. MTHFR variant affects metabolism.")

    # B12/MMA
    if 'MTRR' in findings_dict and findings_dict['MTRR']['magnitude'] >= 2:
        monitoring.append("**B12 + Methylmalonic acid (MMA)**: For functional B12 status. MTRR affects recycling.")

    # Vitamin D
    if 'GC' in findings_dict:
        monitoring.append("**25-OH Vitamin D**: After 2-3 months supplementation, then annually. Target 40-60 ng/mL.")

    # Blood pressure
    if any(g in findings_dict for g in ['AGTR1', 'ACE', 'AGT', 'GNB3']):
        monitoring.append("**Blood pressure**: Home monitoring recommended. Multiple BP-related variants.")

    # Ferritin
    if 'HFE' in findings_dict:
        monitoring.append("**Ferritin/iron panel**: Every 1-2 years. HFE carrier status.")

    # Glucose
    if 'TCF7L2' in findings_dict and findings_dict['TCF7L2']['magnitude'] >= 2:
        monitoring.append("**Fasting glucose or HbA1c**: Annually. TCF7L2 diabetes risk variant.")

    # From disease risk factors
    if disease_findings:
        risk_conditions = set()
        for f in disease_findings.get('risk_factor', []):
            traits = f.get('traits', '').lower()
            if 'macular degeneration' in traits:
                risk_conditions.add('macular_degeneration')
            if 'diabetes' in traits:
                risk_conditions.add('diabetes')
            if 'hypertension' in traits:
                risk_conditions.add('hypertension')
            if 'thrombosis' in traits or 'thromboembolism' in traits:
                risk_conditions.add('thrombosis')

        if 'macular_degeneration' in risk_conditions:
            monitoring.append("**Eye exams**: Regular ophthalmology. Multiple age-related macular degeneration risk variants (CFH, C3, ERCC6).")
        if 'diabetes' in risk_conditions and 'TCF7L2' not in findings_dict:
            monitoring.append("**Glucose monitoring**: Multiple diabetes susceptibility variants detected.")
        if 'thrombosis' in risk_conditions:
            monitoring.append("**Clotting awareness**: Risk variants for venous thrombosis (F13B, FGA). Stay hydrated, move on long flights, know DVT symptoms.")

    if monitoring:
        for m in monitoring:
            report += f"- {m}\n"
    else:
        report += "Standard health monitoring appropriate for age.\n"

    report += """

---

## Drug-Gene Interactions

**Share this section with prescribing physicians.**

### PharmGKB Level 1 (Clinical Guidelines Exist)

"""

    level_1 = [f for f in health_results['pharmgkb_findings'] if f['level'] in ['1A', '1B']]
    if level_1:
        report += "| Gene | Level | Drugs | Your Genotype |\n"
        report += "|------|-------|-------|---------------|\n"
        for f in level_1:
            drugs = f['drugs'][:50] + '...' if len(f['drugs']) > 50 else f['drugs']
            report += f"| {f['gene']} | {f['level']} | {drugs} | `{f['genotype']}` |\n"
    else:
        report += "None detected.\n"

    report += "\n### PharmGKB Level 2 (Moderate Evidence)\n\n"

    level_2 = [f for f in health_results['pharmgkb_findings'] if f['level'] in ['2A', '2B']]
    if level_2:
        report += "| Gene | Level | Drugs | Your Genotype |\n"
        report += "|------|-------|-------|---------------|\n"
        for f in level_2[:15]:
            drugs = f['drugs'][:50] + '...' if len(f['drugs']) > 50 else f['drugs']
            report += f"| {f['gene']} | {f['level']} | {drugs} | `{f['genotype']}` |\n"
        if len(level_2) > 15:
            report += f"\n*...and {len(level_2) - 15} more Level 2 interactions*\n"
    else:
        report += "None detected.\n"

    # ClinVar drug response
    report += "\n### ClinVar Drug Response Variants\n\n"

    if disease_findings and disease_findings.get('drug_response'):
        drug_resp = disease_findings['drug_response']
        report += "| Gene | RSID | Genotype | Drug/Response |\n"
        report += "|------|------|----------|---------------|\n"
        for f in drug_resp[:20]:
            traits = f['traits'][:60] + '...' if len(f['traits']) > 60 else f['traits']
            gene = f['gene'] if f['gene'] else '—'
            report += f"| {gene} | {f['rsid']} | `{f['user_genotype']}` | {traits} |\n"
        if len(drug_resp) > 20:
            report += f"\n*...and {len(drug_resp) - 20} more drug response variants*\n"
    else:
        report += "None detected.\n"

    # Carrier-specific phenotype notes
    report += """

---

## Carrier Status Notes

"""

    carrier_notes = {
        'CFTR': """**Cystic Fibrosis Carrier (CFTR)**:
- CF carriers may have ~10% reduced lung function (FEV1)
- Increased risk of pancreatitis (2-3x general population)
- Higher prevalence of chronic sinusitis
- Possible male fertility effects (CBAVD spectrum)
- **Recommendation**: Baseline pulmonary function test, avoid smoking, genetic counseling if planning pregnancy
""",
        'HBB': """**Sickle Cell Trait Carrier (HBB)**:
- Generally asymptomatic under normal conditions
- Possible complications at extreme altitude or severe dehydration
- Malaria resistance (evolutionary advantage)
- **Recommendation**: Stay hydrated during intense exercise; inform physicians before surgery
""",
        'GBA': """**Gaucher Disease Carrier (GBA)**:
- Carriers have increased Parkinson's disease risk (5-8x)
- No Gaucher disease symptoms
- **Recommendation**: Awareness of early Parkinson's symptoms; inform neurologist
""",
        'SERPINA1': """**Alpha-1 Antitrypsin Carrier (SERPINA1)**:
- Carriers (MZ) have ~60% normal AAT levels
- Mildly increased risk of COPD, especially if smoking
- **Recommendation**: Absolutely avoid smoking; baseline liver function; consider AAT level testing
"""
    }

    found_carriers = False
    all_carrier_genes = [f['gene'].upper() for f in carriers + het_unknown if f.get('gene')]

    for gene, note in carrier_notes.items():
        if gene in all_carrier_genes:
            report += note + "\n"
            found_carriers = True

    # Check for CFTR specifically in het_unknown (your case)
    cftr_finding = next((f for f in het_unknown if f.get('gene', '').upper() == 'CFTR'), None)
    if cftr_finding and 'CFTR' not in all_carrier_genes:
        report += carrier_notes['CFTR'] + "\n"
        found_carriers = True

    if not found_carriers:
        if carriers or het_unknown:
            report += "Carrier status detected but no specific phenotype notes available for these genes. General recommendation: genetic counseling if planning pregnancy.\n"
        else:
            report += "No carrier status detected.\n"

    # Risk factor summary
    report += """

---

## Risk Factor Summary

*These variants indicate increased susceptibility, not certainty of disease.*

"""

    if disease_findings and disease_findings.get('risk_factor'):
        # Group by condition type
        conditions = defaultdict(list)
        for f in disease_findings['risk_factor']:
            traits = f.get('traits', '').lower()
            gene = f.get('gene', 'Unknown')

            if 'hypertension' in traits:
                conditions['Hypertension'].append(gene)
            elif 'diabetes' in traits:
                conditions['Diabetes'].append(gene)
            elif 'macular degeneration' in traits:
                conditions['Macular Degeneration'].append(gene)
            elif 'thrombosis' in traits or 'thromboembolism' in traits:
                conditions['Thrombosis/Clotting'].append(gene)
            elif 'obesity' in traits:
                conditions['Obesity'].append(gene)
            elif 'cancer' in traits or 'carcinoma' in traits:
                conditions['Cancer Risk'].append(gene)
            elif 'inflammatory bowel' in traits or 'crohn' in traits:
                conditions['Inflammatory Bowel Disease'].append(gene)

        if conditions:
            report += "| Condition | Genes Involved |\n"
            report += "|-----------|----------------|\n"
            for condition, genes in sorted(conditions.items()):
                unique_genes = list(set(g for g in genes if g))[:5]
                report += f"| {condition} | {', '.join(unique_genes)} |\n"
        else:
            report += "Risk factors detected but not categorizable. See full disease risk report for details.\n"
    else:
        report += "No significant risk factors detected.\n"

    report += """

---

## Disclaimer

This protocol synthesizes genetic findings from multiple sources for informational purposes.
It is NOT a clinical diagnosis or medical advice.

- Genetic associations are probabilistic, not deterministic
- Environmental factors, lifestyle, and other genes also influence outcomes
- Classifications evolve as research progresses
- Consult healthcare providers before making medical decisions

---

*Generated by Genetic Health Analysis Pipeline - combining lifestyle genetics, PharmGKB, and ClinVar*
"""

    with open(output_path, 'w') as f:
        f.write(report)

    print(f"    Written to: {output_path}")


# =============================================================================
# MAIN PIPELINE
# =============================================================================

def run_full_analysis(genome_path: Path = None, subject_name: str = None):
    """Run the complete genetic analysis pipeline."""

    print_header("FULL GENETIC HEALTH ANALYSIS")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Default genome path
    if genome_path is None:
        genome_path = DATA_DIR / "genome.txt"

    if not genome_path.exists():
        print(f"\nERROR: Genome file not found: {genome_path}")
        print("Please provide a valid 23andMe genome file.")
        sys.exit(1)

    # Create reports directory
    REPORTS_DIR.mkdir(exist_ok=True)

    # Load genome
    genome_by_rsid, genome_by_position = load_genome(genome_path)

    # Load PharmGKB
    pharmgkb = load_pharmgkb()

    # Run lifestyle/health analysis
    health_results = analyze_lifestyle_health(genome_by_rsid, pharmgkb)

    # Save intermediate results for exhaustive report generator
    results_json = {
        'findings': health_results['findings'],
        'pharmgkb_findings': health_results['pharmgkb_findings'],
        'summary': health_results['summary'],
    }
    intermediate_path = REPORTS_DIR / "comprehensive_results.json"
    with open(intermediate_path, 'w') as f:
        json.dump(results_json, f, indent=2)

    # Generate exhaustive genetic report
    genetic_report_path = REPORTS_DIR / "EXHAUSTIVE_GENETIC_REPORT.md"
    generate_exhaustive_genetic_report(health_results, genetic_report_path, subject_name)

    # Run disease risk analysis
    disease_findings, disease_stats = load_clinvar_and_analyze(genome_by_position)

    # Generate disease risk report
    if disease_findings:
        disease_report_path = REPORTS_DIR / "EXHAUSTIVE_DISEASE_RISK_REPORT.md"
        generate_disease_risk_report(disease_findings, disease_stats, len(genome_by_rsid),
                                      disease_report_path, subject_name)

    # Generate actionable protocol - use versioned filename
    protocol_path = REPORTS_DIR / "ACTIONABLE_HEALTH_PROTOCOL_V3.md"
    generate_actionable_protocol(health_results, disease_findings, protocol_path, subject_name)

    # Summary
    print_header("ANALYSIS COMPLETE")
    print(f"\nReports generated in: {REPORTS_DIR}")
    print(f"\n  1. EXHAUSTIVE_GENETIC_REPORT.md")
    print(f"     - {len(health_results['findings'])} lifestyle/health findings")
    print(f"     - {len(health_results['pharmgkb_findings'])} drug-gene interactions")

    if disease_findings:
        total_disease = (len(disease_findings['pathogenic']) +
                        len(disease_findings['likely_pathogenic']) +
                        len(disease_findings['risk_factor']))
        print(f"\n  2. EXHAUSTIVE_DISEASE_RISK_REPORT.md")
        print(f"     - {len(disease_findings['pathogenic'])} pathogenic variants")
        print(f"     - {len(disease_findings['likely_pathogenic'])} likely pathogenic")
        print(f"     - {len(disease_findings['risk_factor'])} risk factors")

    print(f"\n  3. ACTIONABLE_HEALTH_PROTOCOL_V3.md")
    print(f"     - Comprehensive protocol (lifestyle + disease risk + carrier status)")

    print(f"\nFinished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    return {
        'health_results': health_results,
        'disease_findings': disease_findings,
        'disease_stats': disease_stats
    }


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Run full genetic health analysis pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_full_analysis.py                        # Use default genome.txt
  python run_full_analysis.py /path/to/genome.txt   # Custom genome file
  python run_full_analysis.py --name "John Doe"     # Add name to reports
        """
    )
    parser.add_argument('genome', nargs='?', type=Path, default=None,
                       help='Path to 23andMe genome file (default: data/genome.txt)')
    parser.add_argument('--name', '-n', type=str, default=None,
                       help='Subject name to include in reports')

    args = parser.parse_args()

    run_full_analysis(args.genome, args.name)


if __name__ == "__main__":
    main()
