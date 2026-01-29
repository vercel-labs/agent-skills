#!/usr/bin/env python3
"""
Database Updater for Genetic Health Analysis

Downloads and updates all genetic databases:
- ClinVar (NCBI)
- PharmGKB
- CPIC
- GWAS Catalog (EBI)
- CIViC
- gnomAD
- SNPedia

Run quarterly or when new data is needed.

Usage:
    python update_databases.py           # Update all databases
    python update_databases.py --db cpic # Update specific database
    python update_databases.py --list    # Show database status
"""

import argparse
import subprocess
import sys
import os
import gzip
import shutil
from pathlib import Path
from datetime import datetime
import json
import urllib.request
import urllib.error

SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"

# Database download configurations
DATABASES = {
    'clinvar': {
        'name': 'ClinVar',
        'url': 'https://ftp.ncbi.nlm.nih.gov/pub/clinvar/tab_delimited/variant_summary.txt.gz',
        'output': 'clinvar_variant_summary.txt.gz',
        'description': 'Pathogenic variants and disease associations',
        'requires_processing': True,
        'source_url': 'https://www.ncbi.nlm.nih.gov/clinvar/'
    },
    'cpic': {
        'name': 'CPIC',
        'urls': {
            'genes': 'https://api.cpicpgx.org/v1/gene',
            'drugs': 'https://api.cpicpgx.org/v1/drug',
            'pairs': 'https://api.cpicpgx.org/v1/pair',
            'recommendations': 'https://api.cpicpgx.org/v1/recommendation',
            'alleles': 'https://api.cpicpgx.org/v1/allele',
            'diplotypes': 'https://api.cpicpgx.org/v1/diplotype'
        },
        'description': 'Clinical pharmacogenomics guidelines',
        'source_url': 'https://cpicpgx.org/'
    },
    'gwas': {
        'name': 'GWAS Catalog',
        'url': 'ftp://ftp.ebi.ac.uk/pub/databases/gwas/releases/latest/gwas-catalog-associations_ontology-annotated.tsv',
        'output': 'gwas_full.tsv',
        'description': 'Genome-wide association study results',
        'source_url': 'https://www.ebi.ac.uk/gwas/'
    },
    'civic': {
        'name': 'CIViC',
        'url': 'https://civicdb.org/downloads/nightly/nightly-VariantSummaries.tsv',
        'output': 'civic_variants.tsv',
        'description': 'Cancer variant interpretations',
        'source_url': 'https://civicdb.org/'
    },
    'gnomad': {
        'name': 'gnomAD',
        'url': 'https://storage.googleapis.com/gcp-public-data--gnomad/release/2.1.1/constraint/gnomad.v2.1.1.lof_metrics.by_gene.txt.bgz',
        'output': 'gnomad_lof_metrics.tsv.bgz',
        'description': 'Population frequencies and gene constraints',
        'source_url': 'https://gnomad.broadinstitute.org/'
    },
    'snpedia': {
        'name': 'SNPedia',
        'url': 'https://bots.snpedia.com/index.php/Special:Ask/-5B-5BCategory:Is_a_snp-5D-5D/-3Frsid/-3FMagnitude/-3FRepute/-3FSummary/format%3Dcsv/limit%3D50000',
        'output': 'snpedia_dump.txt',
        'description': 'Community-curated SNP interpretations',
        'source_url': 'https://www.snpedia.com/'
    },
    'pharmgkb': {
        'name': 'PharmGKB',
        'manual': True,
        'description': 'Drug-gene interactions (requires manual download)',
        'source_url': 'https://www.pharmgkb.org/downloads',
        'instructions': '''
PharmGKB requires a free account for downloads:
1. Go to https://www.pharmgkb.org/downloads
2. Create account or log in
3. Download "Clinical Annotations" files:
   - clinical_annotations.tsv
   - clinical_ann_alleles.tsv
4. Place files in: {data_dir}
'''
    }
}


def download_file(url, output_path, description=""):
    """Download a file with progress indication."""
    print(f"  Downloading {description or output_path.name}...")
    try:
        # Use curl for better handling of FTP and large files
        cmd = ['curl', '-L', '-o', str(output_path), url]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if result.returncode != 0:
            raise Exception(f"curl failed: {result.stderr}")

        if output_path.exists() and output_path.stat().st_size > 100:
            print(f"    Downloaded: {output_path.stat().st_size / 1024 / 1024:.1f} MB")
            return True
        else:
            print(f"    Warning: File too small or missing")
            return False

    except Exception as e:
        print(f"    Error: {e}")
        return False


def download_json_api(url, output_path):
    """Download JSON from API endpoint."""
    print(f"  Fetching {output_path.name}...")
    try:
        req = urllib.request.Request(url, headers={'Accept': 'application/json'})
        with urllib.request.urlopen(req, timeout=60) as response:
            data = json.loads(response.read().decode('utf-8'))
            with open(output_path, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"    Fetched: {len(data)} records")
            return True
    except Exception as e:
        print(f"    Error: {e}")
        return False


def decompress_file(input_path, output_path):
    """Decompress gzip/bgz file."""
    print(f"  Decompressing {input_path.name}...")
    try:
        with gzip.open(input_path, 'rb') as f_in:
            with open(output_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        print(f"    Decompressed: {output_path.stat().st_size / 1024 / 1024:.1f} MB")
        return True
    except Exception as e:
        print(f"    Error: {e}")
        return False


def update_clinvar():
    """Update ClinVar database."""
    print("\n=== Updating ClinVar ===")
    config = DATABASES['clinvar']

    gz_path = DATA_DIR / config['output']
    if download_file(config['url'], gz_path, 'ClinVar variant summary'):
        txt_path = DATA_DIR / 'clinvar_variant_summary.txt'
        if decompress_file(gz_path, txt_path):
            print("  ClinVar updated successfully")
            print("  Note: Run clinvar_processor.py to generate clinvar_alleles.tsv")
            return True
    return False


def update_cpic():
    """Update CPIC database."""
    print("\n=== Updating CPIC ===")
    config = DATABASES['cpic']
    success = True

    for name, url in config['urls'].items():
        output_path = DATA_DIR / f'cpic_{name}.json'
        if not download_json_api(url, output_path):
            success = False

    if success:
        print("  CPIC updated successfully")
    return success


def update_gwas():
    """Update GWAS Catalog."""
    print("\n=== Updating GWAS Catalog ===")
    config = DATABASES['gwas']

    output_path = DATA_DIR / config['output']
    if download_file(config['url'], output_path, 'GWAS associations'):
        print("  GWAS Catalog updated successfully")
        return True
    return False


def update_civic():
    """Update CIViC database."""
    print("\n=== Updating CIViC ===")
    config = DATABASES['civic']

    output_path = DATA_DIR / config['output']
    if download_file(config['url'], output_path, 'CIViC variants'):
        print("  CIViC updated successfully")
        return True
    return False


def update_gnomad():
    """Update gnomAD gene constraints."""
    print("\n=== Updating gnomAD ===")
    config = DATABASES['gnomad']

    bgz_path = DATA_DIR / config['output']
    if download_file(config['url'], bgz_path, 'gnomAD gene constraints'):
        tsv_path = DATA_DIR / 'gnomad_lof_metrics.tsv'
        if decompress_file(bgz_path, tsv_path):
            print("  gnomAD updated successfully")
            return True
    return False


def update_snpedia():
    """Update SNPedia database."""
    print("\n=== Updating SNPedia ===")
    config = DATABASES['snpedia']

    output_path = DATA_DIR / config['output']
    if download_file(config['url'], output_path, 'SNPedia annotations'):
        # Check if we got HTML error page
        with open(output_path, 'r', errors='replace') as f:
            first_line = f.readline()
            if '<html>' in first_line.lower():
                print("  Warning: Got HTML instead of data - SNPedia may be blocking automated access")
                return False
        print("  SNPedia updated successfully")
        return True
    return False


def show_pharmgkb_instructions():
    """Show PharmGKB manual download instructions."""
    print("\n=== PharmGKB (Manual Download Required) ===")
    config = DATABASES['pharmgkb']
    print(config['instructions'].format(data_dir=DATA_DIR))


def show_status():
    """Show status of all databases."""
    print("\n=== Database Status ===\n")
    print(f"Data directory: {DATA_DIR}\n")

    for db_id, config in DATABASES.items():
        print(f"{config['name']}:")
        print(f"  Description: {config['description']}")
        print(f"  Source: {config['source_url']}")

        if config.get('manual'):
            print("  Status: Manual download required")
        elif config.get('urls'):
            # Multi-file database (CPIC)
            all_exist = True
            for name in config['urls'].keys():
                path = DATA_DIR / f'cpic_{name}.json'
                if path.exists():
                    mtime = datetime.fromtimestamp(path.stat().st_mtime)
                    print(f"  - cpic_{name}.json: {mtime.strftime('%Y-%m-%d')}")
                else:
                    print(f"  - cpic_{name}.json: NOT FOUND")
                    all_exist = False
        else:
            output = config.get('output', '')
            path = DATA_DIR / output
            if path.exists():
                size = path.stat().st_size
                mtime = datetime.fromtimestamp(path.stat().st_mtime)
                print(f"  File: {output}")
                print(f"  Size: {size / 1024 / 1024:.1f} MB")
                print(f"  Updated: {mtime.strftime('%Y-%m-%d %H:%M')}")
            else:
                print(f"  Status: NOT DOWNLOADED")

        print()


def update_all():
    """Update all databases."""
    print("=" * 60)
    print("GENETIC DATABASE UPDATER")
    print("=" * 60)
    print(f"\nData directory: {DATA_DIR}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    results = {}

    # Update each database
    results['cpic'] = update_cpic()
    results['gwas'] = update_gwas()
    results['civic'] = update_civic()
    results['gnomad'] = update_gnomad()
    results['snpedia'] = update_snpedia()

    # Show PharmGKB instructions
    show_pharmgkb_instructions()

    # Summary
    print("\n" + "=" * 60)
    print("UPDATE SUMMARY")
    print("=" * 60)
    for db, success in results.items():
        status = "OK" if success else "FAILED"
        print(f"  {db}: {status}")

    print(f"\nFinished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


def main():
    parser = argparse.ArgumentParser(
        description='Update genetic health analysis databases',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python update_databases.py           # Update all databases
  python update_databases.py --db cpic # Update CPIC only
  python update_databases.py --list    # Show current status
'''
    )
    parser.add_argument('--db', choices=list(DATABASES.keys()),
                       help='Update specific database only')
    parser.add_argument('--list', action='store_true',
                       help='Show database status')

    args = parser.parse_args()

    # Ensure data directory exists
    DATA_DIR.mkdir(exist_ok=True)

    if args.list:
        show_status()
    elif args.db:
        # Update specific database
        updaters = {
            'clinvar': update_clinvar,
            'cpic': update_cpic,
            'gwas': update_gwas,
            'civic': update_civic,
            'gnomad': update_gnomad,
            'snpedia': update_snpedia,
            'pharmgkb': show_pharmgkb_instructions
        }
        updaters[args.db]()
    else:
        update_all()


if __name__ == '__main__':
    main()
