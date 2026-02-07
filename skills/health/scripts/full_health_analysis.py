#!/usr/bin/env python3
"""
Comprehensive Genetic Health Optimization Analysis
Generates a complete lifestyle/health optimization report based on genetic data.
"""

import csv
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

from comprehensive_snp_database import COMPREHENSIVE_SNPS

DATA_DIR = Path(__file__).parent.parent / "data"
REPORTS_DIR = Path(__file__).parent.parent / "reports"


def load_genome(genome_path: Path) -> dict:
    """Load 23andMe genome file into a dictionary."""
    genome = {}
    with open(genome_path, 'r') as f:
        for line in f:
            if line.startswith('#'):
                continue
            parts = line.strip().split('\t')
            if len(parts) >= 4:
                rsid, chrom, pos, genotype = parts[0], parts[1], parts[2], parts[3]
                if genotype != '--':
                    genome[rsid] = {
                        'chromosome': chrom,
                        'position': pos,
                        'genotype': genotype
                    }
    return genome


def load_pharmgkb(annotations_path: Path, alleles_path: Path) -> dict:
    """Load PharmGKB drug-gene annotations."""
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

    return pharmgkb


def analyze_genome(genome: dict, pharmgkb: dict) -> dict:
    """Analyze genome against comprehensive database."""
    results = {
        'findings': [],
        'pharmgkb_findings': [],
        'by_category': defaultdict(list),
        'summary': {
            'total_snps': len(genome),
            'analyzed_snps': 0,
            'high_impact': 0,
            'moderate_impact': 0,
            'low_impact': 0,
        }
    }

    # Check against comprehensive database
    for rsid, info in COMPREHENSIVE_SNPS.items():
        if rsid in genome:
            genotype = genome[rsid]['genotype']
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
        if rsid in genome:
            genotype = genome[rsid]['genotype']
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

    return results


def generate_comprehensive_report(results: dict, output_path: Path):
    """Generate the comprehensive health optimization report."""

    with open(output_path, 'w') as f:
        f.write("# Complete Genetic Health Optimization Report\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n")
        f.write("---\n\n")

        # Executive Summary
        f.write("## Executive Summary\n\n")
        f.write(f"- **Total SNPs in genome:** {results['summary']['total_snps']:,}\n")
        f.write(f"- **SNPs analyzed against curated database:** {results['summary']['analyzed_snps']}\n")
        f.write(f"- **High-impact findings (magnitude ≥3):** {results['summary']['high_impact']}\n")
        f.write(f"- **Moderate-impact findings (magnitude 2):** {results['summary']['moderate_impact']}\n")
        f.write(f"- **Notable findings (magnitude 1):** {results['summary']['low_impact']}\n")
        f.write(f"- **PharmGKB drug interactions (Level 1-2):** {len(results['pharmgkb_findings'])}\n\n")

        # Top Priority Findings
        f.write("---\n\n")
        f.write("## 🔴 Top Priority Findings\n\n")
        f.write("These findings have the highest impact on your health decisions.\n\n")

        high_impact = [x for x in results['findings'] if x['magnitude'] >= 3]
        if high_impact:
            for finding in high_impact:
                f.write(f"### {finding['gene']} ({finding['rsid']})\n\n")
                f.write(f"- **Category:** {finding['category']}\n")
                f.write(f"- **Your Genotype:** `{finding['genotype']}`\n")
                f.write(f"- **Status:** {finding['status'].replace('_', ' ').title()}\n")
                f.write(f"- **Impact:** {finding['magnitude']}/6\n")
                f.write(f"- **Details:** {finding['description']}\n")
                if finding['note']:
                    f.write(f"- **Note:** {finding['note']}\n")
                f.write("\n")
        else:
            f.write("✅ No high-impact (magnitude ≥3) findings detected. This is good news.\n\n")

        # =====================================================================
        # SECTION BY SECTION ANALYSIS
        # =====================================================================

        category_order = [
            ("Drug Metabolism", "💊", "How you process medications - critical for dosing"),
            ("Methylation", "🧬", "B-vitamin processing and detoxification"),
            ("Detoxification", "🧹", "Phase I/II detox enzyme function"),
            ("Neurotransmitters", "🧠", "Dopamine, serotonin, and brain chemistry"),
            ("Caffeine Response", "☕", "How you respond to caffeine"),
            ("Sleep/Circadian", "😴", "Sleep patterns and circadian rhythm"),
            ("Fitness", "💪", "Exercise response and athletic potential"),
            ("Nutrition", "🥗", "Nutrient metabolism and dietary needs"),
            ("Cardiovascular", "❤️", "Heart health and blood pressure"),
            ("Inflammation", "🔥", "Inflammatory response"),
            ("Iron Metabolism", "🩸", "Iron absorption and storage"),
            ("Autoimmune", "🛡️", "Autoimmune disease susceptibility"),
            ("Skin", "☀️", "Skin sensitivity and aging"),
            ("Longevity", "⏳", "Aging and longevity markers"),
            ("Respiratory", "🫁", "Lung health"),
            ("Alcohol", "🍷", "Alcohol metabolism"),
        ]

        for category, emoji, description in category_order:
            if category in results['by_category']:
                findings = results['by_category'][category]
                f.write("---\n\n")
                f.write(f"## {emoji} {category}\n\n")
                f.write(f"*{description}*\n\n")

                # Sort by magnitude within category
                findings_sorted = sorted(findings, key=lambda x: -x['magnitude'])

                f.write("| Gene | SNP | Genotype | Status | Impact | Interpretation |\n")
                f.write("|------|-----|----------|--------|--------|----------------|\n")

                for finding in findings_sorted:
                    status = finding['status'].replace('_', ' ').title()
                    desc = finding['description']
                    if len(desc) > 60:
                        desc = desc[:57] + "..."
                    impact_indicator = "🔴" if finding['magnitude'] >= 3 else "🟡" if finding['magnitude'] >= 2 else "🟢" if finding['magnitude'] >= 1 else "⚪"
                    f.write(f"| {finding['gene']} | {finding['rsid']} | `{finding['genotype']}` | {status} | {impact_indicator} {finding['magnitude']} | {desc} |\n")

                f.write("\n")

                # Add detailed interpretation for each category
                write_category_interpretation(f, category, findings_sorted)

        # =====================================================================
        # PHARMGKB DRUG INTERACTIONS
        # =====================================================================

        f.write("---\n\n")
        f.write("## 💊 Drug-Gene Interactions (PharmGKB)\n\n")
        f.write("Clinical-grade drug-gene interaction data. Level 1A/1B = strongest evidence.\n\n")

        # Group by evidence level
        level_1 = [x for x in results['pharmgkb_findings'] if x['level'] in ['1A', '1B']]
        level_2 = [x for x in results['pharmgkb_findings'] if x['level'] in ['2A', '2B']]

        if level_1:
            f.write("### Level 1 Evidence (Clinical Guidelines Exist)\n\n")
            for finding in level_1[:20]:
                f.write(f"**{finding['gene']} - {finding['rsid']}** ({finding['level']})\n")
                f.write(f"- Drugs: {finding['drugs']}\n")
                f.write(f"- Your Genotype: `{finding['genotype']}`\n")
                annotation = finding['annotation']
                if len(annotation) > 300:
                    annotation = annotation[:297] + "..."
                f.write(f"- {annotation}\n\n")

        if level_2:
            f.write("### Level 2 Evidence (Moderate Evidence)\n\n")
            f.write("<details>\n<summary>Click to expand Level 2 findings</summary>\n\n")
            for finding in level_2[:30]:
                f.write(f"**{finding['gene']} - {finding['rsid']}** ({finding['level']})\n")
                f.write(f"- Drugs: {finding['drugs']}\n")
                f.write(f"- Your Genotype: `{finding['genotype']}`\n\n")
            f.write("</details>\n\n")

        # =====================================================================
        # ACTIONABLE RECOMMENDATIONS
        # =====================================================================

        f.write("---\n\n")
        f.write("## 📋 Personalized Action Plan\n\n")

        write_action_plan(f, results)

        # =====================================================================
        # DISCLAIMER
        # =====================================================================

        f.write("---\n\n")
        f.write("## ⚠️ Disclaimer\n\n")
        f.write("This report is for **informational and educational purposes only**. It is not medical advice.\n\n")
        f.write("- Genetic associations are probabilistic, not deterministic\n")
        f.write("- Environmental factors, lifestyle, and other genes also influence outcomes\n")
        f.write("- Consult healthcare providers before making medical decisions\n")
        f.write("- Some variants may have different effects in different populations\n")
        f.write("- This analysis is based on currently available research, which evolves\n")

    print(f"Comprehensive report generated: {output_path}")


def write_category_interpretation(f, category: str, findings: list):
    """Write detailed interpretation and recommendations for each category."""

    findings_dict = {f['gene']: f for f in findings}

    if category == "Methylation":
        f.write("### Methylation Interpretation\n\n")

        mthfr_677 = findings_dict.get('MTHFR')
        if mthfr_677 and mthfr_677['magnitude'] >= 2:
            f.write("**MTHFR C677T Finding:**\n")
            f.write("Your MTHFR variant reduces your ability to convert folic acid to its active form (methylfolate). ")
            f.write("This affects:\n")
            f.write("- Homocysteine metabolism (cardiovascular risk marker)\n")
            f.write("- Neurotransmitter synthesis\n")
            f.write("- DNA repair and cell division\n")
            f.write("- Detoxification pathways\n\n")
            f.write("**Recommendations:**\n")
            f.write("- Consider methylfolate (L-5-MTHF) instead of folic acid: 400-800mcg/day\n")
            f.write("- Consider methylcobalamin (B12): 1000mcg sublingual\n")
            f.write("- Get homocysteine levels tested (optimal: <10 μmol/L)\n")
            f.write("- Eat folate-rich foods: leafy greens, legumes, liver\n")
            f.write("- Avoid folic acid-fortified processed foods when possible\n\n")

        comt = findings_dict.get('COMT')
        if comt and comt['status'] == 'slow':
            f.write("**COMT + MTHFR Interaction:**\n")
            f.write("With slow COMT, methylation support becomes more complex. ")
            f.write("Too much methylfolate can increase methyl donors, potentially worsening anxiety/overstimulation. ")
            f.write("Start low and titrate slowly.\n\n")

    elif category == "Neurotransmitters":
        f.write("### Neurotransmitter Interpretation\n\n")

        comt = findings_dict.get('COMT')
        if comt:
            if comt['status'] == 'slow':
                f.write("**Slow COMT (Met/Met):**\n")
                f.write("You have higher baseline dopamine and norepinephrine levels. This means:\n\n")
                f.write("*Advantages:*\n")
                f.write("- Better working memory and cognitive performance\n")
                f.write("- Higher pain tolerance\n")
                f.write("- May perform better under low-pressure conditions\n\n")
                f.write("*Considerations:*\n")
                f.write("- More sensitive to stress (catecholamines build up)\n")
                f.write("- Stimulants (caffeine, medications) hit harder and last longer\n")
                f.write("- May be more prone to anxiety under high-pressure situations\n")
                f.write("- Performance may degrade more under stress\n\n")
                f.write("**Recommendations:**\n")
                f.write("- Prioritize stress management (meditation, exercise, sleep)\n")
                f.write("- Be cautious with stimulants - lower doses, earlier in day\n")
                f.write("- Consider adaptogens (ashwagandha, rhodiola) over stimulants\n")
                f.write("- Magnesium supports COMT function\n")
                f.write("- Green tea (L-theanine + caffeine) may be better tolerated than coffee\n\n")
            elif comt['status'] == 'fast':
                f.write("**Fast COMT (Val/Val):**\n")
                f.write("You clear dopamine and norepinephrine quickly. This means:\n\n")
                f.write("*Advantages:*\n")
                f.write("- Better stress resilience (catecholamines don't build up)\n")
                f.write("- May perform better under high-pressure situations\n")
                f.write("- Less prone to anxiety from stimulants\n\n")
                f.write("*Considerations:*\n")
                f.write("- Lower baseline dopamine - may seek more stimulation\n")
                f.write("- May need more motivation/reward to stay engaged\n")
                f.write("- May tolerate higher caffeine without issues\n\n")

        bdnf = findings_dict.get('BDNF')
        if bdnf and bdnf['magnitude'] >= 2:
            f.write("**BDNF Val66Met Finding:**\n")
            f.write("Your BDNF variant reduces activity-dependent BDNF secretion, which affects neuroplasticity. ")
            f.write("This makes **exercise especially important** for you - physical activity is one of the strongest ")
            f.write("natural BDNF boosters and can compensate for the genetic reduction.\n\n")

    elif category == "Fitness":
        f.write("### Fitness Profile Interpretation\n\n")

        actn3 = findings_dict.get('ACTN3')
        ace = findings_dict.get('ACE')

        if actn3:
            f.write(f"**Muscle Fiber Type (ACTN3): {actn3['status'].replace('_', ' ').title()}**\n\n")
            if actn3['status'] == 'power':
                f.write("You have the 'power' genotype with functional alpha-actinin-3 in fast-twitch muscle fibers.\n")
                f.write("- Better suited for: Sprinting, jumping, strength/power sports\n")
                f.write("- Training focus: Can excel at explosive movements, strength training\n")
                f.write("- Recovery: May recover faster from power-based training\n\n")
            elif actn3['status'] == 'endurance':
                f.write("You lack alpha-actinin-3 in fast-twitch fibers (X/X genotype).\n")
                f.write("- Better suited for: Endurance sports, distance running, cycling\n")
                f.write("- Advantage: More efficient slow-twitch fiber function\n")
                f.write("- Training focus: May excel at higher volume, aerobic training\n")
                f.write("- Note: Can still build strength with appropriate training\n\n")
            else:
                f.write("You have a mixed profile, giving you versatility across training modalities.\n\n")

        if ace:
            f.write(f"**ACE Profile: {ace['status'].replace('_', ' ').title()}**\n\n")
            if 'endurance' in ace['status']:
                f.write("Lower ACE activity associated with:\n")
                f.write("- Better endurance performance\n")
                f.write("- Superior altitude adaptation\n")
                f.write("- More efficient oxygen utilization\n\n")
            elif 'power' in ace['status']:
                f.write("Higher ACE activity associated with:\n")
                f.write("- Better strength/power performance\n")
                f.write("- Greater muscle hypertrophy response\n")
                f.write("- May need to watch blood pressure\n\n")

    elif category == "Nutrition":
        f.write("### Nutritional Genomics Interpretation\n\n")

        fto = findings_dict.get('FTO')
        if fto and fto['magnitude'] >= 1:
            f.write(f"**FTO (Obesity Risk): {fto['status'].replace('_', ' ').title()}**\n\n")
            if fto['status'] in ['increased', 'elevated']:
                f.write("Your FTO variant is associated with increased appetite and reduced satiety signaling.\n")
                f.write("- Higher protein intake helps counteract this effect\n")
                f.write("- Regular exercise significantly modifies FTO risk\n")
                f.write("- Focus on satiety: protein, fiber, whole foods\n")
                f.write("- May benefit more from structured eating schedules\n\n")

        vit_d = findings_dict.get('GC')
        if vit_d and vit_d['status'] == 'low':
            f.write("**Vitamin D (GC): Genetically Low**\n\n")
            f.write("You have reduced vitamin D binding protein, leading to lower circulating vitamin D.\n")
            f.write("- Supplementation typically needed, especially at northern latitudes\n")
            f.write("- Target blood level: 40-60 ng/mL (100-150 nmol/L)\n")
            f.write("- Suggested dose: 2,000-5,000 IU/day depending on season and sun exposure\n")
            f.write("- Take with fat-containing meal for absorption\n")
            f.write("- Get 25-OH vitamin D tested after 2-3 months\n\n")

        fads = findings_dict.get('FADS1')
        if fads and fads['status'] == 'low_conversion':
            f.write("**Omega-3 Conversion (FADS1): Low**\n\n")
            f.write("You poorly convert plant omega-3s (ALA) to EPA/DHA.\n")
            f.write("- Flax, chia, walnuts won't provide adequate EPA/DHA for you\n")
            f.write("- Need direct sources: fatty fish, fish oil, or algae oil\n")
            f.write("- Consider 1-2g EPA+DHA daily from marine sources\n\n")

        lactose = findings_dict.get('MCM6/LCT')
        if lactose and lactose['status'] == 'lactose_intolerant':
            f.write("**Lactose Intolerance: Confirmed**\n\n")
            f.write("You have the lactase non-persistence genotype.\n")
            f.write("- Lactase enzyme production declines in adulthood\n")
            f.write("- May tolerate small amounts or fermented dairy (yogurt, cheese)\n")
            f.write("- Lactase enzyme supplements can help\n")
            f.write("- Ensure calcium from other sources if avoiding dairy\n\n")

    elif category == "Cardiovascular":
        f.write("### Cardiovascular Interpretation\n\n")

        # APOE interpretation
        apoe_429 = findings_dict.get('APOE') if 'APOE' in findings_dict else None

        # Check for blood pressure genes
        bp_genes = ['AGTR1', 'AGT', 'ACE', 'GNB3']
        bp_findings = [findings_dict[g] for g in bp_genes if g in findings_dict and findings_dict[g]['magnitude'] >= 1]

        if bp_findings:
            f.write("**Blood Pressure Genetics:**\n\n")
            risk_count = sum(1 for f in bp_findings if f['magnitude'] >= 2)
            if risk_count >= 2:
                f.write("⚠️ You have multiple genetic variants associated with elevated blood pressure risk.\n\n")
                f.write("**Recommendations:**\n")
                f.write("- Monitor blood pressure regularly (home monitoring recommended)\n")
                f.write("- Sodium restriction may be particularly beneficial for you\n")
                f.write("- DASH diet pattern recommended\n")
                f.write("- Regular aerobic exercise (150+ min/week)\n")
                f.write("- Maintain healthy weight\n")
                f.write("- Limit alcohol\n")
                f.write("- If prescribed BP medications, genetic profile may guide selection\n\n")

        # Clotting factors
        f5 = findings_dict.get('F5')
        f2 = findings_dict.get('F2')
        if (f5 and f5['magnitude'] >= 3) or (f2 and f2['magnitude'] >= 3):
            f.write("**⚠️ Clotting Factor Variant Detected:**\n\n")
            f.write("You carry a variant that increases blood clot risk.\n")
            f.write("- Inform all healthcare providers\n")
            f.write("- Avoid estrogen-containing contraceptives/HRT if possible\n")
            f.write("- Stay well-hydrated\n")
            f.write("- Move regularly on long flights/drives\n")
            f.write("- Know DVT symptoms: leg pain, swelling, warmth\n")
            f.write("- Know PE symptoms: sudden shortness of breath, chest pain\n\n")

    elif category == "Caffeine Response":
        f.write("### Caffeine Response Interpretation\n\n")

        cyp1a2 = findings_dict.get('CYP1A2')
        adora_anx = findings_dict.get('ADORA2A')

        f.write("**Your Caffeine Profile:**\n\n")

        if cyp1a2:
            f.write(f"- **Metabolism (CYP1A2):** {cyp1a2['status'].replace('_', ' ').title()}\n")
        if adora_anx:
            status = adora_anx['status']
            if status == 'anxiety_prone':
                f.write(f"- **Anxiety Response (ADORA2A):** Prone to caffeine-induced anxiety\n")
            elif status == 'lower_sensitivity':
                f.write(f"- **Anxiety Response (ADORA2A):** Lower sensitivity\n")

        f.write("\n**Recommendations:**\n")

        # Build personalized caffeine recommendations
        slow_metabolizer = cyp1a2 and cyp1a2['status'] in ['slow', 'intermediate']
        anxiety_prone = adora_anx and adora_anx['status'] == 'anxiety_prone'

        if slow_metabolizer and anxiety_prone:
            f.write("- ⚠️ You're both a slower metabolizer AND anxiety-prone to caffeine\n")
            f.write("- Keep caffeine very early in the day (before 10am)\n")
            f.write("- Consider max 100-200mg/day (1 small coffee)\n")
            f.write("- L-theanine can help smooth the response\n")
            f.write("- Green tea may be better tolerated than coffee\n")
            f.write("- Consider caffeine-free alternatives for productivity (cold exposure, exercise)\n")
        elif slow_metabolizer:
            f.write("- Keep caffeine to morning hours only\n")
            f.write("- Stop by noon to protect sleep\n")
            f.write("- You may do well with moderate doses but early timing\n")
        elif anxiety_prone:
            f.write("- You clear caffeine normally but are sensitive to its effects\n")
            f.write("- Lower doses recommended\n")
            f.write("- L-theanine can help (as in green tea)\n")
        else:
            f.write("- You have favorable caffeine genetics\n")
            f.write("- Can likely tolerate moderate caffeine without issues\n")
            f.write("- Still respect the 90-minute post-wake delay for optimal benefit\n")

        f.write("\n")


def write_action_plan(f, results: dict):
    """Write personalized action plan based on all findings."""

    findings_dict = {finding['gene']: finding for finding in results['findings']}

    # Organize recommendations by priority
    immediate_actions = []
    dietary_recs = []
    supplement_recs = []
    lifestyle_recs = []
    monitoring_recs = []

    # MTHFR
    if 'MTHFR' in findings_dict and findings_dict['MTHFR']['magnitude'] >= 2:
        supplement_recs.append("**Methylation Support:** Consider methylfolate (400-800mcg) + methylcobalamin B12 (1000mcg)")
        monitoring_recs.append("Get homocysteine levels tested")
        dietary_recs.append("Emphasize folate-rich foods: leafy greens, legumes, liver")

    # COMT
    if 'COMT' in findings_dict:
        comt = findings_dict['COMT']
        if comt['status'] == 'slow':
            lifestyle_recs.append("**Stress Management is Critical:** Daily meditation, regular exercise, adequate sleep")
            lifestyle_recs.append("Be cautious with stimulants - use lower doses, earlier in day")
            supplement_recs.append("Magnesium (300-400mg glycinate) in evening may help")

    # Vitamin D
    if 'GC' in findings_dict and findings_dict['GC']['status'] == 'low':
        supplement_recs.append("**Vitamin D:** 2,500-5,000 IU daily depending on season (you're genetically low)")
        monitoring_recs.append("Test 25-OH vitamin D in 2-3 months, target 40-60 ng/mL")

    # FADS1/Omega-3
    if 'FADS1' in findings_dict and findings_dict['FADS1']['status'] == 'low_conversion':
        dietary_recs.append("**Omega-3s:** Get EPA/DHA directly from fish or algae oil (you convert ALA poorly)")
        supplement_recs.append("Fish oil or algae oil: 1-2g EPA+DHA daily")

    # FTO
    if 'FTO' in findings_dict and findings_dict['FTO']['magnitude'] >= 1:
        dietary_recs.append("**Satiety Focus:** Higher protein, fiber-rich foods (FTO variant responds well)")
        lifestyle_recs.append("Regular exercise significantly modifies FTO obesity risk")

    # TCF7L2/Diabetes
    if 'TCF7L2' in findings_dict and findings_dict['TCF7L2']['magnitude'] >= 2:
        dietary_recs.append("**Carb Management:** Low-glycemic diet recommended (TCF7L2 diabetes risk variant)")
        monitoring_recs.append("Consider periodic fasting glucose or HbA1c monitoring")

    # Blood pressure genes
    bp_risk = sum(1 for g in ['AGTR1', 'AGT', 'GNB3'] if g in findings_dict and findings_dict[g]['magnitude'] >= 2)
    if bp_risk >= 1:
        lifestyle_recs.append("**Blood Pressure:** Monitor regularly, sodium restriction helpful")
        dietary_recs.append("DASH diet pattern recommended")

    # Celiac
    if 'HLA-DQA1' in findings_dict and findings_dict['HLA-DQA1']['magnitude'] >= 2:
        monitoring_recs.append("If unexplained GI issues arise, consider celiac antibody testing (you carry HLA-DQ2.5)")

    # Iron
    if 'HFE' in findings_dict and findings_dict['HFE']['magnitude'] >= 1:
        monitoring_recs.append("Monitor iron/ferritin periodically (HFE carrier)")
        dietary_recs.append("Don't supplement iron unless deficiency confirmed")

    # BDNF
    if 'BDNF' in findings_dict and findings_dict['BDNF']['magnitude'] >= 2:
        lifestyle_recs.append("**Exercise is Critical:** Your BDNF variant makes exercise especially important for brain health")

    # Fitness
    if 'ACTN3' in findings_dict:
        actn3 = findings_dict['ACTN3']
        if actn3['status'] == 'endurance':
            lifestyle_recs.append("**Training Style:** Your genetics favor endurance - you may excel at aerobic training")
        elif actn3['status'] == 'power':
            lifestyle_recs.append("**Training Style:** Your genetics favor power/strength - explosive training suits you")

    # Write organized recommendations
    f.write("### Immediate Actions\n\n")
    if immediate_actions:
        for action in immediate_actions:
            f.write(f"- {action}\n")
    else:
        f.write("- No urgent actions required\n")
    f.write("\n")

    f.write("### Dietary Recommendations\n\n")
    if dietary_recs:
        for rec in dietary_recs:
            f.write(f"- {rec}\n")
    else:
        f.write("- No specific dietary modifications needed beyond general healthy eating\n")
    f.write("\n")

    f.write("### Supplement Considerations\n\n")
    f.write("*Discuss with healthcare provider before starting supplements*\n\n")
    if supplement_recs:
        for rec in supplement_recs:
            f.write(f"- {rec}\n")
    else:
        f.write("- No specific supplements indicated by genetic profile\n")
    f.write("\n")

    f.write("### Lifestyle Recommendations\n\n")
    if lifestyle_recs:
        for rec in lifestyle_recs:
            f.write(f"- {rec}\n")
    else:
        f.write("- Standard healthy lifestyle recommendations apply\n")
    f.write("\n")

    f.write("### Monitoring Recommendations\n\n")
    if monitoring_recs:
        for rec in monitoring_recs:
            f.write(f"- {rec}\n")
    else:
        f.write("- Standard health monitoring appropriate\n")
    f.write("\n")


def main():
    print("=" * 70)
    print("COMPREHENSIVE GENETIC HEALTH OPTIMIZATION ANALYSIS")
    print("=" * 70)

    # Load genome
    genome_path = DATA_DIR / "genome.txt"
    print(f"\nLoading genome from {genome_path}...")
    genome = load_genome(genome_path)
    print(f"Loaded {len(genome):,} SNPs")

    # Load PharmGKB
    pharmgkb_annotations = DATA_DIR / "clinical_annotations.tsv"
    pharmgkb_alleles = DATA_DIR / "clinical_ann_alleles.tsv"
    print(f"\nLoading PharmGKB data...")
    pharmgkb = load_pharmgkb(pharmgkb_annotations, pharmgkb_alleles)
    print(f"Loaded {len(pharmgkb):,} drug-gene interactions")

    # Analyze
    print(f"\nAnalyzing against {len(COMPREHENSIVE_SNPS)} curated SNPs...")
    results = analyze_genome(genome, pharmgkb)

    # Save raw results
    results_json = {
        'findings': results['findings'],
        'pharmgkb_findings': results['pharmgkb_findings'],
        'summary': results['summary'],
    }
    results_path = REPORTS_DIR / "comprehensive_results.json"
    with open(results_path, 'w') as f:
        json.dump(results_json, f, indent=2)
    print(f"Raw results saved to {results_path}")

    # Generate comprehensive report
    report_path = REPORTS_DIR / "COMPLETE_HEALTH_REPORT.md"
    generate_comprehensive_report(results, report_path)

    # Print summary
    print("\n" + "=" * 70)
    print("ANALYSIS COMPLETE")
    print("=" * 70)
    print(f"\nSNPs analyzed: {results['summary']['analyzed_snps']}")
    print(f"High-impact findings: {results['summary']['high_impact']}")
    print(f"Moderate-impact findings: {results['summary']['moderate_impact']}")
    print(f"Low-impact findings: {results['summary']['low_impact']}")
    print(f"\nFull report: {report_path}")


if __name__ == "__main__":
    main()
