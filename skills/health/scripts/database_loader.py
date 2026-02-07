#!/usr/bin/env python3
"""
Database Loader for Genetic Health Analysis

Loads and indexes multiple genetic databases:
- ClinVar (pathogenic variants)
- PharmGKB (drug-gene interactions)
- CPIC (clinical pharmacogenomics guidelines)
- GWAS Catalog (trait associations)
- CIViC (cancer variants)
- gnomAD (population frequencies and gene constraints)
- SNPedia (community-curated SNP interpretations)

Each finding includes source attribution for transparency.
"""

import json
import csv
import os
from pathlib import Path
from collections import defaultdict
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"


class DatabaseLoader:
    """Loads and provides access to all genetic databases."""

    def __init__(self):
        self.databases = {}
        self.load_status = {}

    def load_all(self):
        """Load all available databases."""
        print("Loading genetic databases...")

        self._load_cpic()
        self._load_pharmgkb_evidence()
        self._load_gwas()
        self._load_civic()
        self._load_gnomad()
        self._load_snpedia()

        print(f"\nDatabases loaded: {list(self.load_status.keys())}")
        return self.load_status

    def _load_pharmgkb_evidence(self):
        """Load PharmGKB evidence with PMIDs."""
        evidence_path = DATA_DIR / 'clinical_ann_evidence.tsv'

        if not evidence_path.exists():
            self.load_status['pharmgkb_evidence'] = {'loaded': False, 'reason': 'File not found'}
            return

        try:
            evidence_by_annotation = defaultdict(list)

            with open(evidence_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f, delimiter='\t')
                for row in reader:
                    ann_id = row.get('Clinical Annotation ID', '')
                    pmid = row.get('PMID', '')
                    if ann_id and pmid:
                        evidence_by_annotation[ann_id].append({
                            'pmid': pmid,
                            'pubmed_url': f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                            'summary': row.get('Summary', ''),
                            'score': row.get('Score', ''),
                            'evidence_type': row.get('Evidence Type', '')
                        })

            self.databases['pharmgkb_evidence'] = evidence_by_annotation
            total_evidence = sum(len(v) for v in evidence_by_annotation.values())
            self.load_status['pharmgkb_evidence'] = {
                'loaded': True,
                'annotations': len(evidence_by_annotation),
                'total_evidence': total_evidence,
                'source': 'PharmGKB (pharmgkb.org)',
                'version': datetime.now().strftime('%Y-%m')
            }
            print(f"  PharmGKB Evidence: {total_evidence} citations for {len(evidence_by_annotation)} annotations")

        except Exception as e:
            self.load_status['pharmgkb_evidence'] = {'loaded': False, 'reason': str(e)}

    def _load_cpic(self):
        """Load CPIC pharmacogenomics data."""
        cpic_files = {
            'genes': DATA_DIR / 'cpic_genes.json',
            'drugs': DATA_DIR / 'cpic_drugs.json',
            'pairs': DATA_DIR / 'cpic_pairs.json',
            'recommendations': DATA_DIR / 'cpic_recommendations.json'
        }

        if not all(f.exists() for f in cpic_files.values()):
            self.load_status['cpic'] = {'loaded': False, 'reason': 'Files not found'}
            return

        try:
            cpic = {}
            for name, path in cpic_files.items():
                with open(path, 'r') as f:
                    cpic[name] = json.load(f)

            # Build drug ID to name mapping
            drug_id_to_name = {}
            for d in cpic['drugs']:
                if d.get('drugid') and d.get('name'):
                    drug_id_to_name[d['drugid']] = d['name']

            # Index by gene symbol for quick lookup
            self.databases['cpic'] = {
                'genes': {g['symbol']: g for g in cpic['genes'] if g.get('symbol')},
                'drugs': {d['name']: d for d in cpic['drugs'] if d.get('name')},
                'pairs': cpic['pairs'],
                'recommendations': cpic['recommendations'],
                'gene_drug_map': defaultdict(list)
            }

            # Build gene-drug mapping with citations
            for pair in cpic['pairs']:
                gene = pair.get('genesymbol')
                drug_id = pair.get('drugid')
                drug_name = drug_id_to_name.get(drug_id, drug_id)  # Fall back to ID if no name
                citations = pair.get('citations') or []

                if gene and drug_name and not pair.get('removed'):
                    # Format citations as PubMed links
                    pubmed_links = [f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" for pmid in citations if pmid]

                    self.databases['cpic']['gene_drug_map'][gene].append({
                        'drug': drug_name,
                        'cpic_level': pair.get('cpiclevel'),
                        'pgkb_level': pair.get('pgkbcalevel'),
                        'guideline_id': pair.get('guidelineid'),
                        'url': f"https://cpicpgx.org/guidelines/",
                        'pmids': citations,
                        'pubmed_links': pubmed_links
                    })

            self.load_status['cpic'] = {
                'loaded': True,
                'genes': len(cpic['genes']),
                'drugs': len(cpic['drugs']),
                'pairs': len(cpic['pairs']),
                'recommendations': len(cpic['recommendations']),
                'source': 'CPIC (cpicpgx.org)',
                'version': datetime.now().strftime('%Y-%m')
            }
            print(f"  CPIC: {len(cpic['genes'])} genes, {len(cpic['drugs'])} drugs, {len(cpic['pairs'])} pairs")

        except Exception as e:
            self.load_status['cpic'] = {'loaded': False, 'reason': str(e)}

    def _load_gwas(self):
        """Load GWAS Catalog associations."""
        gwas_path = DATA_DIR / 'gwas_full.tsv'
        if not gwas_path.exists():
            gwas_path = DATA_DIR / 'gwas_catalog_associations.tsv'

        if not gwas_path.exists() or gwas_path.stat().st_size < 10000:
            self.load_status['gwas'] = {'loaded': False, 'reason': 'File not found or too small'}
            return

        try:
            gwas_by_rsid = defaultdict(list)
            count = 0

            with open(gwas_path, 'r', encoding='utf-8', errors='replace') as f:
                reader = csv.DictReader(f, delimiter='\t')
                for row in reader:
                    snps = row.get('SNPS', '') or row.get('SNP_ID_CURRENT', '')
                    if not snps:
                        continue

                    # Handle multiple SNPs
                    for snp in snps.replace(';', ',').split(','):
                        snp = snp.strip()
                        if snp.startswith('rs'):
                            gwas_by_rsid[snp].append({
                                'trait': row.get('DISEASE/TRAIT', row.get('MAPPED_TRAIT', '')),
                                'p_value': row.get('P-VALUE', ''),
                                'or_beta': row.get('OR or BETA', ''),
                                'ci': row.get('95% CI (TEXT)', ''),
                                'risk_allele': row.get('STRONGEST SNP-RISK ALLELE', ''),
                                'gene': row.get('MAPPED_GENE', row.get('REPORTED GENE(S)', '')),
                                'pubmed': row.get('PUBMEDID', ''),
                                'study': row.get('STUDY', ''),
                                'source': 'GWAS Catalog (EBI/NHGRI)'
                            })
                            count += 1

            self.databases['gwas'] = gwas_by_rsid
            self.load_status['gwas'] = {
                'loaded': True,
                'associations': count,
                'unique_snps': len(gwas_by_rsid),
                'source': 'GWAS Catalog (www.ebi.ac.uk/gwas)',
                'version': datetime.now().strftime('%Y-%m')
            }
            print(f"  GWAS Catalog: {count} associations for {len(gwas_by_rsid)} SNPs")

        except Exception as e:
            self.load_status['gwas'] = {'loaded': False, 'reason': str(e)}

    def _load_civic(self):
        """Load CIViC cancer variant data."""
        civic_path = DATA_DIR / 'civic_variants.tsv'

        if not civic_path.exists():
            self.load_status['civic'] = {'loaded': False, 'reason': 'File not found'}
            return

        try:
            civic_by_gene = defaultdict(list)
            count = 0

            with open(civic_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f, delimiter='\t')
                for row in reader:
                    gene = row.get('gene', '')
                    if not gene:
                        continue

                    civic_by_gene[gene].append({
                        'variant': row.get('variant', ''),
                        'disease': row.get('disease', ''),
                        'drugs': row.get('drugs', ''),
                        'evidence_type': row.get('evidence_type', ''),
                        'evidence_level': row.get('evidence_level', ''),
                        'evidence_direction': row.get('evidence_direction', ''),
                        'clinical_significance': row.get('clinical_significance', ''),
                        'variant_types': row.get('variant_types', ''),
                        'hgvs': row.get('hgvs_expressions', ''),
                        'chromosome': row.get('chromosome', ''),
                        'start': row.get('start', ''),
                        'reference_bases': row.get('reference_bases', ''),
                        'variant_bases': row.get('variant_bases', ''),
                        'source': 'CIViC (civicdb.org)'
                    })
                    count += 1

            self.databases['civic'] = civic_by_gene
            self.load_status['civic'] = {
                'loaded': True,
                'variants': count,
                'genes': len(civic_by_gene),
                'source': 'CIViC - Clinical Interpretation of Variants in Cancer (civicdb.org)',
                'version': datetime.now().strftime('%Y-%m')
            }
            print(f"  CIViC: {count} cancer variants across {len(civic_by_gene)} genes")

        except Exception as e:
            self.load_status['civic'] = {'loaded': False, 'reason': str(e)}

    def _load_gnomad(self):
        """Load gnomAD gene constraint metrics."""
        gnomad_path = DATA_DIR / 'gnomad_lof_metrics.tsv'

        if not gnomad_path.exists():
            self.load_status['gnomad'] = {'loaded': False, 'reason': 'File not found'}
            return

        def safe_float(val, default=0):
            """Safely convert to float, handling NA and empty values."""
            if val in (None, '', 'NA', 'nan', 'NaN'):
                return default
            try:
                return float(val)
            except (ValueError, TypeError):
                return default

        try:
            gnomad_by_gene = {}

            with open(gnomad_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f, delimiter='\t')
                for row in reader:
                    gene = row.get('gene', row.get('gene_symbol', ''))
                    if not gene:
                        continue

                    gnomad_by_gene[gene] = {
                        'pLI': safe_float(row.get('pLI')),  # Prob of LoF intolerance
                        'pRec': safe_float(row.get('pRec')),  # Prob of being recessive
                        'pNull': safe_float(row.get('pNull')),  # Prob of being tolerant
                        'oe_lof': row.get('oe_lof', ''),  # Observed/expected LoF
                        'oe_lof_upper': row.get('oe_lof_upper', ''),
                        'oe_mis': row.get('oe_mis', ''),  # Observed/expected missense
                        'mis_z': row.get('mis_z', ''),  # Missense Z-score
                        'syn_z': row.get('syn_z', ''),  # Synonymous Z-score
                        'constraint_flag': row.get('constraint_flag', ''),
                        'source': 'gnomAD v2.1.1 (gnomad.broadinstitute.org)'
                    }

            self.databases['gnomad'] = gnomad_by_gene
            self.load_status['gnomad'] = {
                'loaded': True,
                'genes': len(gnomad_by_gene),
                'source': 'gnomAD v2.1.1 (gnomad.broadinstitute.org)',
                'version': '2.1.1'
            }
            print(f"  gnomAD: {len(gnomad_by_gene)} gene constraint metrics")

        except Exception as e:
            self.load_status['gnomad'] = {'loaded': False, 'reason': str(e)}

    def _load_snpedia(self):
        """Load SNPedia annotations."""
        snpedia_path = DATA_DIR / 'snpedia_dump.txt'

        if not snpedia_path.exists():
            self.load_status['snpedia'] = {'loaded': False, 'reason': 'File not found'}
            return

        try:
            snpedia_by_rsid = {}

            with open(snpedia_path, 'r', encoding='utf-8', errors='replace') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # The SNPedia export has entry name in first column (unnamed or '')
                    # and Rsid in second column
                    rsid = row.get('Rsid', '')

                    # Also check first column for rsid-like patterns
                    if not rsid:
                        first_col = list(row.values())[0] if row else ''
                        if first_col and first_col.lower().startswith('rs'):
                            rsid = first_col

                    # Skip non-rsid entries
                    if not rsid or not rsid.lower().startswith('rs'):
                        continue

                    # Clean and validate rsid
                    rsid = rsid.strip().lower()
                    if not rsid.startswith('rs'):
                        continue

                    magnitude = row.get('Magnitude', '')
                    try:
                        magnitude = float(magnitude) if magnitude and magnitude != '' else 0
                    except (ValueError, TypeError):
                        magnitude = 0

                    summary = row.get('Summary', '')
                    repute = row.get('Repute', '')

                    # Only include entries with actual content
                    if summary or magnitude > 0:
                        snpedia_by_rsid[rsid] = {
                            'magnitude': magnitude,
                            'repute': repute,
                            'summary': summary,
                            'source': 'SNPedia (snpedia.com)'
                        }

            self.databases['snpedia'] = snpedia_by_rsid
            self.load_status['snpedia'] = {
                'loaded': True,
                'snps': len(snpedia_by_rsid),
                'source': 'SNPedia (snpedia.com)',
                'version': datetime.now().strftime('%Y-%m')
            }
            print(f"  SNPedia: {len(snpedia_by_rsid)} SNP annotations")

        except Exception as e:
            self.load_status['snpedia'] = {'loaded': False, 'reason': str(e)}

    def get_cpic_for_gene(self, gene_symbol):
        """Get CPIC drug interactions for a gene."""
        if 'cpic' not in self.databases:
            return []
        return self.databases['cpic']['gene_drug_map'].get(gene_symbol, [])

    def get_gwas_for_rsid(self, rsid):
        """Get GWAS associations for an rsID."""
        if 'gwas' not in self.databases:
            return []
        return self.databases['gwas'].get(rsid, [])

    def get_civic_for_gene(self, gene_symbol):
        """Get CIViC cancer variants for a gene."""
        if 'civic' not in self.databases:
            return []
        return self.databases['civic'].get(gene_symbol, [])

    def get_gnomad_for_gene(self, gene_symbol):
        """Get gnomAD constraint metrics for a gene."""
        if 'gnomad' not in self.databases:
            return None
        return self.databases['gnomad'].get(gene_symbol)

    def get_snpedia_for_rsid(self, rsid):
        """Get SNPedia annotation for an rsID."""
        if 'snpedia' not in self.databases:
            return None
        return self.databases['snpedia'].get(rsid)

    def get_pharmgkb_evidence(self, annotation_id):
        """Get PharmGKB evidence (PMIDs) for an annotation."""
        if 'pharmgkb_evidence' not in self.databases:
            return []
        return self.databases['pharmgkb_evidence'].get(str(annotation_id), [])

    def get_all_sources(self):
        """Get list of all loaded database sources with versions."""
        sources = []
        for db_name, status in self.load_status.items():
            if status.get('loaded'):
                sources.append({
                    'database': db_name,
                    'source': status.get('source', db_name),
                    'version': status.get('version', 'unknown')
                })
        return sources


# Singleton instance
_loader = None

def get_database_loader():
    """Get or create the database loader singleton."""
    global _loader
    if _loader is None:
        _loader = DatabaseLoader()
        _loader.load_all()
    return _loader


if __name__ == '__main__':
    # Test loading
    loader = get_database_loader()
    print("\n=== Load Status ===")
    for db, status in loader.load_status.items():
        print(f"{db}: {status}")
