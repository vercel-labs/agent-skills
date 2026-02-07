---
name: health
description: Analyze 23andMe genetic data for health insights, drug interactions, disease risk, and lifestyle recommendations. Use when user says "analyze my genome", "run health analysis", "genetic report", "health report", "update health databases", "check my DNA", "pharmacogenomics", or mentions genetic/genomic analysis. Supports argument for subject name or "update" to refresh databases.
---

# Genetic Health Analysis

Analyze 23andMe genome data against multiple databases with full source attribution.

## First-Time Setup (New Computer)

1. Create project directory:
```bash
mkdir -p ~/genome/Genetic\ Health/{scripts,data,reports}
```

2. Copy scripts from this skill:
```bash
cp ~/.claude/skills/health/scripts/*.py ~/genome/Genetic\ Health/scripts/
```

3. Download databases:
```bash
cd ~/genome/Genetic\ Health
python3 scripts/update_databases.py
```

4. Place your 23andMe genome file in `~/genome/`

## Workflow

### Run Analysis

```bash
cd ~/genome/Genetic\ Health
python3 scripts/run_full_analysis.py ~/genome/YOUR_GENOME_FILE.txt --name "Your Name"
python3 scripts/enhanced_analysis.py ~/genome/YOUR_GENOME_FILE.txt --name "Your Name"
```

### Update Databases

```bash
python3 scripts/update_databases.py
python3 scripts/update_databases.py --list  # Check status
```

## Bundled Scripts

| Script | Purpose |
|--------|---------|
| `run_full_analysis.py` | Main entry point - lifestyle + disease risk |
| `enhanced_analysis.py` | Multi-database analysis (CPIC, CIViC, gnomAD) |
| `disease_risk_analyzer.py` | ClinVar pathogenic variant analysis |
| `generate_exhaustive_report.py` | Report generation |
| `comprehensive_snp_database.py` | Curated SNP interpretations |
| `database_loader.py` | Database loading utilities |
| `update_databases.py` | Download/update all databases |
| `full_health_analysis.py` | Core analysis logic |

## Output Reports

| Report | Content |
|--------|---------|
| `ACTIONABLE_HEALTH_PROTOCOL_V3.md` | Priority actions with explanations |
| `EXHAUSTIVE_GENETIC_REPORT.md` | Lifestyle/health findings |
| `EXHAUSTIVE_DISEASE_RISK_REPORT.md` | Pathogenic variants, carrier status |
| `ENHANCED_GENETIC_REPORT.md` | Multi-database with CPIC/CIViC |

## Databases (Downloaded by update_databases.py)

| Database | Content |
|----------|---------|
| ClinVar | Pathogenic variants |
| PharmGKB | Drug-gene interactions |
| CPIC | Clinical pharmacogenomics |
| CIViC | Cancer variants |
| gnomAD | Gene constraints |

## Post-Analysis

1. Read Priority Actions Summary from `ACTIONABLE_HEALTH_PROTOCOL_V3.md`
2. Ask about current medications for personalized analysis
3. Highlight high-impact findings (magnitude >= 3)

## Database Reference

See `references/databases.md` for detailed database documentation.
