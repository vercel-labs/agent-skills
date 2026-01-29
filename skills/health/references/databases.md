# Database Reference

## Data Sources

| Database | File | Description | Update Frequency |
|----------|------|-------------|------------------|
| ClinVar | `clinvar_alleles.tsv` | Pathogenic variant classifications | Quarterly |
| PharmGKB | `clinical_annotations.tsv`, `clinical_ann_alleles.tsv`, `clinical_ann_evidence.tsv` | Drug-gene interactions with evidence | Quarterly |
| CPIC | `cpic_*.json` | Clinical pharmacogenomics guidelines | As guidelines change |
| CIViC | `civic_variants.tsv` | Cancer variant interpretations | Monthly |
| gnomAD | `gnomad_gene_constraints.tsv` | Gene constraint metrics (pLI scores) | Per release |
| GWAS | `gwas_studies.tsv` | Trait associations | Quarterly |
| SNPedia | `snpedia_snps.tsv` | Community annotations | Manual |

## Key SNP Categories

### Drug Metabolism
- CYP2C9, CYP2C19, CYP2D6, CYP3A4, CYP1A2, CYP2B6
- SLCO1B1, VKORC1, DPYD, UGT1A1, TPMT, NUDT15

### Methylation
- MTHFR, MTRR, COMT, CBS

### Cardiovascular
- AGTR1, ACE, AGT, HFE, F5, F13B

### Cancer Risk
- MEN1, PALB2, BRCA1, BRCA2, TP53, APC, MLH1, MSH2

## Update Command

```bash
cd "/Users/joannastew/projects/genome/Genetic Health"
python3 scripts/update_databases.py
python3 scripts/update_databases.py --list  # Check status
```

## Impact Magnitude Scale

| Magnitude | Meaning |
|-----------|---------|
| 0 | Informational |
| 1 | Low impact |
| 2 | Moderate impact |
| 3+ | High impact - actionable |

## ClinVar Confidence (Gold Stars)

| Stars | Meaning |
|-------|---------|
| 4 | Practice guideline / Expert panel |
| 3 | Multiple submitters, no conflicts |
| 2 | Multiple submitters with conflicts, or single with criteria |
| 1 | Single submitter |
| 0 | No assertion criteria |
