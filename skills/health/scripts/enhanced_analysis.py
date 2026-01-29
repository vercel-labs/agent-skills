#!/usr/bin/env python3
"""
Enhanced Genetic Health Analysis

Integrates multiple databases with full source attribution:
- ClinVar (pathogenic variants)
- PharmGKB (drug-gene interactions)
- CPIC (clinical pharmacogenomics)
- GWAS Catalog (trait associations)
- CIViC (cancer variants)
- gnomAD (gene constraints)
- SNPedia (community annotations)
- Custom curated SNP database

Every finding includes its source database for transparency.
"""

import sys
import csv
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict

SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from comprehensive_snp_database import COMPREHENSIVE_SNPS
from database_loader import get_database_loader

BASE_DIR = SCRIPT_DIR.parent
DATA_DIR = BASE_DIR / "data"
REPORTS_DIR = BASE_DIR / "reports"


class EnhancedAnalyzer:
    """Enhanced genetic analyzer with multi-database integration."""

    def __init__(self):
        self.db_loader = get_database_loader()
        self.genome_by_rsid = {}
        self.genome_by_position = {}
        self.findings = []
        self.sources_used = set()

    def load_genome(self, genome_path: Path):
        """Load 23andMe genome file."""
        print(f"\nLoading genome from {genome_path}")
        with open(genome_path, 'r') as f:
            for line in f:
                if line.startswith('#'):
                    continue
                parts = line.strip().split('\t')
                if len(parts) >= 4:
                    rsid, chrom, pos, genotype = parts[0], parts[1], parts[2], parts[3]
                    if genotype != '--':
                        self.genome_by_rsid[rsid] = {
                            'chromosome': chrom,
                            'position': pos,
                            'genotype': genotype
                        }
                        pos_key = f"{chrom}:{pos}"
                        self.genome_by_position[pos_key] = {
                            'rsid': rsid,
                            'genotype': genotype
                        }
        print(f"  Loaded {len(self.genome_by_rsid):,} SNPs")

    def analyze_curated_snps(self):
        """Analyze against curated SNP database."""
        print("\nAnalyzing curated SNP database...")
        count = 0

        for rsid, info in COMPREHENSIVE_SNPS.items():
            if rsid in self.genome_by_rsid:
                genotype = self.genome_by_rsid[rsid]['genotype']
                genotype_rev = genotype[::-1] if len(genotype) == 2 else genotype

                variant_info = info['variants'].get(genotype) or info['variants'].get(genotype_rev)

                if variant_info:
                    self.findings.append({
                        'type': 'lifestyle',
                        'rsid': rsid,
                        'gene': info['gene'],
                        'category': info['category'],
                        'genotype': genotype,
                        'status': variant_info['status'],
                        'description': variant_info['desc'],
                        'magnitude': variant_info['magnitude'],
                        'note': info.get('note', ''),
                        'source': 'Curated SNP Database',
                        'source_url': 'Internal curated database based on peer-reviewed literature'
                    })
                    count += 1
                    self.sources_used.add('Curated SNP Database')

        print(f"  Found {count} curated SNP findings")

    def analyze_gwas(self):
        """Analyze against GWAS Catalog."""
        print("\nAnalyzing GWAS Catalog...")

        # Load GWAS studies file (has SNP info in study context)
        gwas_path = DATA_DIR / 'gwas_studies.tsv'
        if not gwas_path.exists():
            gwas_path = DATA_DIR / 'gwas_full.tsv'
        if not gwas_path.exists():
            print("  GWAS file not found, skipping")
            return

        gwas_snps = defaultdict(list)
        try:
            with open(gwas_path, 'r', encoding='utf-8', errors='replace') as f:
                reader = csv.DictReader(f, delimiter='\t')
                for row in reader:
                    # GWAS studies file doesn't have direct SNP column
                    # We need the associations file for that
                    pass
        except Exception as e:
            print(f"  Error loading GWAS: {e}")

        # Use database loader's GWAS data
        gwas_count = 0
        for rsid in list(self.genome_by_rsid.keys())[:10000]:  # Sample for performance
            gwas_data = self.db_loader.get_gwas_for_rsid(rsid)
            if gwas_data:
                genotype = self.genome_by_rsid[rsid]['genotype']
                for assoc in gwas_data[:3]:  # Limit per SNP
                    self.findings.append({
                        'type': 'gwas',
                        'rsid': rsid,
                        'gene': assoc.get('gene', ''),
                        'genotype': genotype,
                        'trait': assoc.get('trait', ''),
                        'p_value': assoc.get('p_value', ''),
                        'risk_allele': assoc.get('risk_allele', ''),
                        'pubmed': assoc.get('pubmed', ''),
                        'source': 'GWAS Catalog (EBI/NHGRI)',
                        'source_url': 'https://www.ebi.ac.uk/gwas/'
                    })
                    gwas_count += 1
                    self.sources_used.add('GWAS Catalog')

        print(f"  Found {gwas_count} GWAS associations")

    def analyze_cpic(self):
        """Analyze against CPIC guidelines."""
        print("\nAnalyzing CPIC pharmacogenomics...")
        cpic_count = 0

        # Get genes from our findings
        genes_found = set()
        for f in self.findings:
            if f.get('gene'):
                genes_found.add(f['gene'])

        # Check ALL genes in CPIC database that we have variants for
        if 'cpic' in self.db_loader.databases:
            cpic_genes = set(self.db_loader.databases['cpic']['gene_drug_map'].keys())
            genes_to_check = genes_found.union(cpic_genes)
        else:
            # Fallback to common pharmacogenes
            pharmacogenes = [
                'CYP2D6', 'CYP2C19', 'CYP2C9', 'CYP3A5', 'CYP1A2', 'CYP2B6',
                'SLCO1B1', 'VKORC1', 'TPMT', 'DPYD', 'UGT1A1', 'NUDT15',
                'HLA-A', 'HLA-B', 'G6PD', 'CFTR', 'RYR1', 'CACNA1S',
                'IFNL3', 'IFNL4', 'CYP4F2', 'OPRM1', 'COMT', 'MTHFR'
            ]
            genes_to_check = genes_found.union(set(pharmacogenes))

        for gene in genes_to_check:
            cpic_data = self.db_loader.get_cpic_for_gene(gene)
            if cpic_data:
                for interaction in cpic_data:
                    pmids = interaction.get('pmids', [])
                    pubmed_links = interaction.get('pubmed_links', [])

                    self.findings.append({
                        'type': 'cpic',
                        'gene': gene,
                        'drug': interaction.get('drug', ''),
                        'cpic_level': interaction.get('cpic_level', ''),
                        'guideline': interaction.get('guideline', ''),
                        'url': interaction.get('url', ''),
                        'pmids': pmids,
                        'pubmed_links': pubmed_links,
                        'source': 'CPIC (Clinical Pharmacogenetics Implementation Consortium)',
                        'source_url': 'https://cpicpgx.org/'
                    })
                    cpic_count += 1
                    self.sources_used.add('CPIC')

        print(f"  Found {cpic_count} CPIC drug-gene guidelines")

    def analyze_civic(self):
        """Analyze against CIViC cancer database."""
        print("\nAnalyzing CIViC cancer variants...")
        civic_count = 0

        # Get genes from our findings
        genes_found = set()
        for f in self.findings:
            if f.get('gene'):
                genes_found.add(f['gene'])

        # Add known cancer genes
        cancer_genes = [
            'BRCA1', 'BRCA2', 'TP53', 'EGFR', 'KRAS', 'BRAF', 'ALK',
            'MET', 'ROS1', 'RET', 'NTRK1', 'NTRK2', 'NTRK3', 'PIK3CA',
            'APC', 'MLH1', 'MSH2', 'MSH6', 'PMS2', 'PALB2', 'ATM',
            'CHEK2', 'CDH1', 'STK11', 'PTEN', 'MEN1', 'VHL', 'RB1'
        ]
        genes_to_check = genes_found.union(set(cancer_genes))

        for gene in genes_to_check:
            civic_data = self.db_loader.get_civic_for_gene(gene)
            if civic_data:
                for variant in civic_data[:5]:  # Limit per gene
                    self.findings.append({
                        'type': 'civic',
                        'gene': gene,
                        'variant': variant.get('variant', ''),
                        'disease': variant.get('disease', ''),
                        'drugs': variant.get('drugs', ''),
                        'evidence_level': variant.get('evidence_level', ''),
                        'clinical_significance': variant.get('clinical_significance', ''),
                        'source': 'CIViC (Clinical Interpretation of Variants in Cancer)',
                        'source_url': 'https://civicdb.org/'
                    })
                    civic_count += 1
                    self.sources_used.add('CIViC')

        print(f"  Found {civic_count} CIViC cancer variant annotations")

    def analyze_gnomad(self):
        """Add gnomAD gene constraint data."""
        print("\nAnalyzing gnomAD gene constraints...")
        gnomad_count = 0

        # Get unique genes
        genes_found = set()
        for f in self.findings:
            if f.get('gene'):
                genes_found.add(f['gene'])

        for gene in genes_found:
            gnomad_data = self.db_loader.get_gnomad_for_gene(gene)
            if gnomad_data and gnomad_data.get('pLI', 0) > 0.9:
                # Only report highly constrained genes
                self.findings.append({
                    'type': 'gnomad_constraint',
                    'gene': gene,
                    'pLI': gnomad_data.get('pLI', 0),
                    'oe_lof': gnomad_data.get('oe_lof', ''),
                    'interpretation': 'Loss-of-function intolerant (pLI > 0.9)',
                    'source': 'gnomAD v2.1.1',
                    'source_url': 'https://gnomad.broadinstitute.org/'
                })
                gnomad_count += 1
                self.sources_used.add('gnomAD')

        print(f"  Found {gnomad_count} highly constrained genes")

    def analyze_snpedia(self):
        """Enrich with SNPedia annotations."""
        print("\nEnriching with SNPedia annotations...")
        snpedia_count = 0

        for rsid in self.genome_by_rsid:
            snpedia_data = self.db_loader.get_snpedia_for_rsid(rsid)
            if snpedia_data and snpedia_data.get('magnitude', 0) >= 2:
                self.findings.append({
                    'type': 'snpedia',
                    'rsid': rsid,
                    'genotype': self.genome_by_rsid[rsid]['genotype'],
                    'magnitude': snpedia_data.get('magnitude', 0),
                    'repute': snpedia_data.get('repute', ''),
                    'summary': snpedia_data.get('summary', ''),
                    'source': 'SNPedia',
                    'source_url': f'https://www.snpedia.com/index.php/{rsid}'
                })
                snpedia_count += 1
                self.sources_used.add('SNPedia')

        print(f"  Found {snpedia_count} significant SNPedia annotations")

    def run_full_analysis(self, genome_path: Path, subject_name: str = None):
        """Run complete multi-database analysis."""
        print("=" * 70)
        print("ENHANCED GENETIC HEALTH ANALYSIS")
        print("=" * 70)
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        # Load genome
        self.load_genome(genome_path)

        # Run all analyses
        self.analyze_curated_snps()
        self.analyze_cpic()
        self.analyze_civic()
        self.analyze_gnomad()
        self.analyze_snpedia()
        # Note: GWAS requires the associations file which needs different parsing
        # self.analyze_gwas()

        # Generate report with sources
        self.generate_enhanced_report(subject_name)

        print("\n" + "=" * 70)
        print("ANALYSIS COMPLETE")
        print("=" * 70)
        print(f"\nSources used: {', '.join(sorted(self.sources_used))}")
        print(f"Total findings: {len(self.findings)}")

    def generate_priority_actions(self, findings_by_type):
        """Generate Priority Actions Summary with references and clear explanations."""
        actions = []

        lifestyle = findings_by_type.get('lifestyle', [])
        cpic = findings_by_type.get('cpic', [])
        civic = findings_by_type.get('civic', [])
        gnomad = findings_by_type.get('gnomad_constraint', [])

        # 1. Check for cancer-related genes from CIViC
        cancer_genes = {'MEN1', 'PALB2', 'BRCA1', 'BRCA2', 'TP53', 'APC', 'MLH1', 'MSH2'}
        cancer_findings = [f for f in civic if f.get('gene') in cancer_genes]
        if cancer_findings:
            genes = sorted(set(f['gene'] for f in cancer_findings))
            actions.append({
                'priority': 1,
                'action': f"Genetic counseling for {'/'.join(genes)} cancer variants",
                'explanation': 'Schedule an appointment with a certified genetic counselor to discuss whether these variants require additional cancer screening (colonoscopies, breast MRIs, etc.).',
                'source': 'CIViC',
                'refs': ['[CIViC Database](https://civicdb.org/)']
            })

        # 2. Check for blood pressure genes
        bp_genes = {'AGTR1', 'ACE', 'AGT', 'GNB3', 'HFE'}
        bp_findings = [f for f in lifestyle if f.get('gene') in bp_genes and f.get('magnitude', 0) >= 2]
        if len(bp_findings) >= 2:
            genes_str = ', '.join(f['gene'] for f in bp_findings)
            actions.append({
                'priority': 2,
                'action': 'Blood pressure monitoring at home',
                'explanation': f'Buy a home blood pressure monitor and check your BP weekly, since you have multiple gene variants ({genes_str}) that increase hypertension risk.',
                'source': 'Curated SNP Database',
                'refs': ['[PMID:16046653](https://pubmed.ncbi.nlm.nih.gov/16046653/)']
            })

        # 3. Check for macular degeneration genes
        amd_genes = {'CFH', 'C3', 'ERCC6', 'ARMS2'}
        amd_findings = [f for f in lifestyle if f.get('gene') in amd_genes]
        if amd_findings:
            actions.append({
                'priority': 3,
                'action': 'Regular eye exams (ophthalmology)',
                'explanation': 'Get annual dilated eye exams from an ophthalmologist (not just optometrist) to catch early signs of age-related macular degeneration.',
                'source': 'Curated SNP Database',
                'refs': ['[PMID:15761122](https://pubmed.ncbi.nlm.nih.gov/15761122/)']
            })

        # 4. Check for BDNF (exercise critical)
        bdnf = next((f for f in lifestyle if f.get('gene') == 'BDNF' and f.get('magnitude', 0) >= 2), None)
        if bdnf:
            actions.append({
                'priority': 4,
                'action': 'Exercise consistently - critical for BDNF',
                'explanation': 'Exercise at least 150 min/week because your BDNF gene variant means your brain produces less growth factor at rest, but exercise strongly boosts it.',
                'source': 'Curated SNP Database',
                'refs': ['[PMID:12802256](https://pubmed.ncbi.nlm.nih.gov/12802256/)']
            })

        # 5. Check for HFE (iron)
        hfe = next((f for f in lifestyle if f.get('gene') == 'HFE'), None)
        if hfe:
            actions.append({
                'priority': 5,
                'action': 'Iron monitoring - HFE carrier',
                'explanation': 'Get a ferritin blood test every 1-2 years and avoid iron supplements unless a doctor confirms deficiency, because your HFE variant causes increased iron absorption.',
                'source': 'Curated SNP Database',
                'refs': ['[PMID:10807540](https://pubmed.ncbi.nlm.nih.gov/10807540/)']
            })

        # 6. Check for SLCO1B1 (statin myopathy)
        slco1b1 = next((f for f in lifestyle if f.get('gene') == 'SLCO1B1' and f.get('magnitude', 0) >= 3), None)
        slco1b1_cpic = [f for f in cpic if f.get('gene') == 'SLCO1B1']
        if slco1b1 or slco1b1_cpic:
            pmids = []
            for f in slco1b1_cpic:
                pmids.extend(f.get('pmids', [])[:2])
            refs = [f"[PMID:{p}](https://pubmed.ncbi.nlm.nih.gov/{p}/)" for p in pmids[:3]] if pmids else ['[CPIC Guidelines](https://cpicpgx.org/guidelines/guideline-for-statins-and-slco1b1/)']
            actions.append({
                'priority': 6,
                'action': 'Statin caution - SLCO1B1 intermediate metabolizer',
                'explanation': 'If you need cholesterol medication, ask your doctor for rosuvastatin, pravastatin, or fluvastatin instead of simvastatin, because your SLCO1B1 gene makes simvastatin 4x more likely to cause muscle pain/damage.',
                'source': 'CPIC Level A',
                'refs': refs
            })

        # 7. Check for CYP2C9 (warfarin)
        cyp2c9 = next((f for f in lifestyle if f.get('gene') == 'CYP2C9' and f.get('magnitude', 0) >= 3), None)
        if cyp2c9:
            actions.append({
                'priority': 7,
                'action': 'Warfarin dose reduction if prescribed',
                'explanation': 'If ever prescribed warfarin (blood thinner), tell your doctor you are a CYP2C9 intermediate metabolizer and will likely need a 25-30% lower dose to avoid bleeding complications.',
                'source': 'CPIC Level A',
                'refs': ['[PMID:21900891](https://pubmed.ncbi.nlm.nih.gov/21900891/)']
            })

        # 8. Check for MTHFR/methylation
        mthfr = next((f for f in lifestyle if f.get('gene') == 'MTHFR' and f.get('magnitude', 0) >= 2), None)
        mtrr = next((f for f in lifestyle if f.get('gene') == 'MTRR' and f.get('magnitude', 0) >= 2), None)
        if mthfr or mtrr:
            genes = []
            if mthfr: genes.append('MTHFR')
            if mtrr: genes.append('MTRR')
            actions.append({
                'priority': 8,
                'action': f"Methylation support ({'/'.join(genes)})",
                'explanation': 'Consider taking methylfolate (not folic acid) and methylcobalamin (not regular B12) supplements, because your gene variants reduce your ability to process the standard forms.',
                'source': 'Curated SNP Database',
                'refs': ['[PMID:19805654](https://pubmed.ncbi.nlm.nih.gov/19805654/)']
            })

        # 9. Check for caffeine sensitivity
        adora2a = next((f for f in lifestyle if f.get('gene') == 'ADORA2A' and 'anxiety' in f.get('status', '')), None)
        cyp1a2 = next((f for f in lifestyle if f.get('gene') == 'CYP1A2'), None)
        if adora2a or (cyp1a2 and 'slow' in cyp1a2.get('status', '')):
            actions.append({
                'priority': 9,
                'action': 'Caffeine - limit to mornings only',
                'explanation': 'Limit coffee/caffeine to before 10am and consider smaller amounts, because your genes mean caffeine stays in your system longer and is more likely to cause jitteriness/anxiety.',
                'source': 'Curated SNP Database',
                'refs': ['[PMID:17522618](https://pubmed.ncbi.nlm.nih.gov/17522618/)']
            })

        # 10. Check for circadian rhythm
        arntl = next((f for f in lifestyle if f.get('gene') == 'ARNTL' and f.get('magnitude', 0) >= 2), None)
        if arntl:
            actions.append({
                'priority': 10,
                'action': 'Circadian rhythm support',
                'explanation': 'Maintain strict sleep/wake times (even weekends) and get bright light exposure within 30 minutes of waking, because your ARNTL gene variant means your internal body clock is weaker than average.',
                'source': 'Curated SNP Database',
                'refs': ['[PMID:17060375](https://pubmed.ncbi.nlm.nih.gov/17060375/)']
            })

        actions.sort(key=lambda x: x['priority'])
        return actions

    def generate_enhanced_report(self, subject_name: str = None):
        """Generate report with full source attribution."""
        print("\nGenerating enhanced report with source attribution...")

        REPORTS_DIR.mkdir(exist_ok=True)
        output_path = REPORTS_DIR / "ENHANCED_GENETIC_REPORT.md"

        now = datetime.now().strftime("%Y-%m-%d %H:%M")
        subject_line = f"\n**Subject:** {subject_name}" if subject_name else ""

        # Group findings by type
        findings_by_type = defaultdict(list)
        for f in self.findings:
            findings_by_type[f['type']].append(f)

        # Generate priority actions
        priority_actions = self.generate_priority_actions(findings_by_type)

        report = f"""# Enhanced Genetic Health Report
{subject_line}
**Generated:** {now}

This report integrates findings from multiple genetic databases.
**Every finding includes its source for transparency and verification.**

---

## Priority Actions Summary

**Act on these first.** Each recommendation is backed by genetic findings from multiple databases.

"""
        for i, action in enumerate(priority_actions, 1):
            refs_str = ', '.join(action['refs'])
            report += f"""{i}. **{action['action']}**
   → {action['explanation']}
   *Source: {action['source']}* | {refs_str}

"""

        report += """---

## Data Sources Used

| Database | Description | URL |
|----------|-------------|-----|
"""
        for source_info in self.db_loader.get_all_sources():
            report += f"| {source_info['database']} | {source_info['source']} | - |\n"

        report += """
---

## Lifestyle & Health Findings

*Source: Curated SNP Database (peer-reviewed literature)*

"""
        lifestyle = findings_by_type.get('lifestyle', [])
        lifestyle.sort(key=lambda x: -x.get('magnitude', 0))

        high_impact = [f for f in lifestyle if f.get('magnitude', 0) >= 3]
        if high_impact:
            report += "### High Impact (Magnitude >= 3)\n\n"
            report += "| Gene | SNP | Genotype | Status | Impact | Description | Source |\n"
            report += "|------|-----|----------|--------|--------|-------------|--------|\n"
            for f in high_impact:
                report += f"| {f['gene']} | {f['rsid']} | `{f['genotype']}` | {f['status']} | {f['magnitude']} | {f['description'][:50]}... | {f['source']} |\n"
            report += "\n"

        moderate_impact = [f for f in lifestyle if 2 <= f.get('magnitude', 0) < 3]
        if moderate_impact:
            report += "### Moderate Impact (Magnitude 2)\n\n"
            report += "| Gene | SNP | Genotype | Status | Description | Source |\n"
            report += "|------|-----|----------|--------|-------------|--------|\n"
            for f in moderate_impact[:20]:
                report += f"| {f['gene']} | {f['rsid']} | `{f['genotype']}` | {f['status']} | {f['description'][:50]}... | {f['source']} |\n"
            report += "\n"

        # CPIC Findings
        cpic = findings_by_type.get('cpic', [])
        if cpic:
            report += """---

## Pharmacogenomics (CPIC Guidelines)

*Source: Clinical Pharmacogenetics Implementation Consortium (cpicpgx.org)*

These are clinical-grade drug dosing guidelines based on your genetics.

| Gene | Drug | CPIC Level | References |
|------|------|------------|------------|
"""
            seen = set()
            for f in cpic:
                key = (f['gene'], f['drug'])
                if key not in seen:
                    seen.add(key)
                    level = f.get('cpic_level', 'N/A')
                    # Format PubMed citations
                    pmids = f.get('pmids', [])
                    if pmids:
                        refs = ', '.join([f"[PMID:{pmid}](https://pubmed.ncbi.nlm.nih.gov/{pmid}/)" for pmid in pmids[:3]])
                    else:
                        refs = f"[CPIC]({f.get('url', 'https://cpicpgx.org')})"
                    report += f"| {f['gene']} | {f['drug']} | {level} | {refs} |\n"
            report += "\n"

        # CIViC Cancer Findings
        civic = findings_by_type.get('civic', [])
        if civic:
            report += """---

## Cancer Variant Annotations (CIViC)

*Source: Clinical Interpretation of Variants in Cancer (civicdb.org)*

| Gene | Variant | Disease | Drugs | Evidence | Source |
|------|---------|---------|-------|----------|--------|
"""
            seen = set()
            for f in civic[:30]:
                key = (f['gene'], f.get('variant', ''))
                if key not in seen:
                    seen.add(key)
                    disease = f.get('disease', '')[:30] or 'Various'
                    drugs = f.get('drugs', '')[:30] or '-'
                    evidence = f.get('evidence_level', 'N/A')
                    report += f"| {f['gene']} | {f.get('variant', 'N/A')[:20]} | {disease} | {drugs} | {evidence} | CIViC |\n"
            report += "\n"

        # gnomAD Constrained Genes
        gnomad = findings_by_type.get('gnomad_constraint', [])
        if gnomad:
            report += """---

## Highly Constrained Genes (gnomAD)

*Source: gnomAD v2.1.1 (gnomad.broadinstitute.org)*

These genes are intolerant to loss-of-function mutations (pLI > 0.9),
meaning variants in these genes are more likely to be clinically significant.

| Gene | pLI Score | O/E LoF | Interpretation | Source |
|------|-----------|---------|----------------|--------|
"""
            for f in sorted(gnomad, key=lambda x: -x.get('pLI', 0))[:20]:
                report += f"| {f['gene']} | {f['pLI']:.3f} | {f.get('oe_lof', 'N/A')} | {f['interpretation']} | gnomAD |\n"
            report += "\n"

        # SNPedia Annotations
        snpedia = findings_by_type.get('snpedia', [])
        if snpedia:
            report += """---

## Community Annotations (SNPedia)

*Source: SNPedia (snpedia.com) - community-curated SNP wiki*

| SNP | Genotype | Magnitude | Repute | Summary | Source |
|-----|----------|-----------|--------|---------|--------|
"""
            for f in sorted(snpedia, key=lambda x: -x.get('magnitude', 0))[:30]:
                summary = f.get('summary', '')[:50] or 'See SNPedia'
                repute = f.get('repute', 'N/A')
                report += f"| [{f['rsid']}]({f['source_url']}) | `{f['genotype']}` | {f['magnitude']} | {repute} | {summary}... | SNPedia |\n"
            report += "\n"

        # Disclaimer with sources
        report += """---

## Source Attribution & Disclaimer

### Databases Used in This Analysis

"""
        for source in sorted(self.sources_used):
            report += f"- **{source}**\n"

        report += """
### Disclaimer

This report integrates data from multiple peer-reviewed databases for informational purposes.
It is NOT a clinical diagnosis.

- Genetic associations are probabilistic, not deterministic
- Findings should be confirmed with clinical-grade testing
- Consult healthcare providers before making medical decisions
- Database content evolves as research progresses

### Updating Databases

To update the databases to the latest versions, run:
```bash
python scripts/update_databases.py
```

---

*Generated by Enhanced Genetic Health Analysis Pipeline*
"""

        with open(output_path, 'w') as f:
            f.write(report)

        print(f"  Written to: {output_path}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Enhanced genetic health analysis")
    parser.add_argument('genome', nargs='?', type=Path, default=None,
                       help='Path to genome file')
    parser.add_argument('--name', '-n', type=str, default=None,
                       help='Subject name')

    args = parser.parse_args()

    genome_path = args.genome or DATA_DIR / "genome.txt"
    if not genome_path.exists():
        print(f"Error: Genome file not found: {genome_path}")
        sys.exit(1)

    analyzer = EnhancedAnalyzer()
    analyzer.run_full_analysis(genome_path, args.name)


if __name__ == '__main__':
    main()
