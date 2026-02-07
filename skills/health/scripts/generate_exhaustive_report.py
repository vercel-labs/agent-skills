#!/usr/bin/env python3
"""
Exhaustive Genetic Health Report Generator

Generates a comprehensive report covering every single finding in the genetic data,
with full descriptions, clinical context, and actionable recommendations.
"""

import json
from datetime import datetime
from collections import defaultdict
from pathlib import Path

# Clinical context database - provides deeper interpretation for each gene/status combination
CLINICAL_CONTEXT = {
    # METHYLATION
    ("MTHFR", "significantly_reduced"): {
        "mechanism": "The MTHFR enzyme converts folic acid to methylfolate (5-MTHF), the active form used by the body. With 70% reduced activity, you produce significantly less methylfolate, affecting over 200 methylation-dependent reactions.",
        "implications": [
            "Elevated homocysteine levels (cardiovascular risk marker)",
            "Reduced production of SAMe (S-adenosylmethionine), the universal methyl donor",
            "Potential impacts on neurotransmitter synthesis, DNA repair, and detoxification",
            "Folic acid from fortified foods may accumulate as unmetabolized folic acid (UMFA)"
        ],
        "actions": [
            "Use methylfolate (5-MTHF) instead of folic acid - typical dose 400-800mcg",
            "Consider methylcobalamin (methyl-B12) rather than cyanocobalamin",
            "Support with riboflavin (B2) which is a cofactor for MTHFR",
            "Monitor homocysteine levels periodically",
            "Avoid high-dose folic acid supplements and limit heavily fortified foods"
        ],
        "interactions": ["Synergizes with MTRR status - both impaired compounds effect", "COMT status affects methylation demand"]
    },
    ("MTRR", "significantly_reduced"): {
        "mechanism": "MTRR regenerates methylcobalamin (methyl-B12), the active form of B12. Impaired MTRR means B12 recycling is less efficient, potentially leading to functional B12 deficiency even with normal blood levels.",
        "implications": [
            "May need higher B12 intake to maintain adequate methylcobalamin levels",
            "Can compound MTHFR issues (both affect methylation)",
            "Potential neurological and cognitive effects if B12 recycling insufficient"
        ],
        "actions": [
            "Use methylcobalamin or adenosylcobalamin forms of B12",
            "Consider sublingual or injectable B12 for better absorption",
            "Typical supportive dose: 1000-5000mcg methylcobalamin",
            "Check serum B12 and methylmalonic acid (MMA) for functional status"
        ],
        "interactions": ["Compounds with MTHFR C677T", "Affects homocysteine pathway"]
    },
    ("PEMT", "reduced"): {
        "mechanism": "PEMT creates phosphatidylcholine from phosphatidylethanolamine using SAMe. Reduced function means you rely more on dietary choline intake.",
        "implications": [
            "Higher dietary choline requirement",
            "Particularly important during pregnancy (fetal brain development)",
            "May affect liver health and lipid metabolism"
        ],
        "actions": [
            "Increase dietary choline: eggs (especially yolks), liver, beef, fish",
            "Consider choline supplementation: 250-500mg phosphatidylcholine or CDP-choline",
            "Ensure adequate methyl donors (folate, B12) as PEMT uses SAMe"
        ],
        "interactions": ["Increased demand when MTHFR is impaired (SAMe dependent)"]
    },
    # NEUROTRANSMITTERS
    ("COMT", "slow"): {
        "mechanism": "COMT breaks down catecholamines (dopamine, norepinephrine, epinephrine). Slow COMT means these neurotransmitters remain active longer, leading to higher baseline levels.",
        "implications": [
            "Higher baseline dopamine - better working memory, focus in calm conditions",
            "More sensitive to stress - catecholamines accumulate faster under pressure",
            "Stimulants (caffeine, medications) have stronger, longer-lasting effects",
            "May be more prone to anxiety and rumination",
            "Can have advantages in pain tolerance"
        ],
        "actions": [
            "Prioritize stress management: meditation, breathwork, regular exercise",
            "Use lower doses of stimulants; caffeine half-life effectively longer for you",
            "Magnesium (glycinate, 300-400mg) supports COMT function",
            "Consider adaptogens (ashwagandha, rhodiola) over stimulants for energy",
            "L-theanine may help modulate catecholamine effects",
            "Avoid combining multiple stimulants"
        ],
        "interactions": ["Synergizes with caffeine metabolism genes", "Affects response to ADHD medications"]
    },
    ("OPRM1", "altered"): {
        "mechanism": "OPRM1 encodes the mu-opioid receptor. The A118G variant alters receptor binding, affecting response to endorphins, opioid medications, and reward from alcohol.",
        "implications": [
            "May require different opioid dosing for pain management",
            "Altered reward response to alcohol (some studies show increased craving)",
            "Potentially different response to naltrexone treatment"
        ],
        "actions": [
            "Inform anesthesiologists before surgery",
            "May need adjusted opioid dosing for adequate pain control",
            "Be aware of potentially altered alcohol reward response"
        ],
        "interactions": ["Relevant for pain management planning"]
    },
    # CAFFEINE
    ("CYP1A2", "intermediate"): {
        "mechanism": "CYP1A2 is the primary enzyme metabolizing caffeine. Intermediate metabolizers clear caffeine at a moderate rate, with ~5-6 hour half-life.",
        "implications": [
            "Moderate caffeine clearance - effects last several hours",
            "Afternoon caffeine may affect sleep more than fast metabolizers",
            "Cardiovascular effects of caffeine are intermediate"
        ],
        "actions": [
            "Limit caffeine to morning/early afternoon (before 2pm ideally)",
            "Moderate intake (~200-300mg/day) typically well-tolerated",
            "Wait 90+ minutes after waking for first caffeine (cortisol awakening response)"
        ],
        "interactions": ["ADORA2A affects anxiety response to caffeine"]
    },
    ("ADORA2A", "anxiety_prone"): {
        "mechanism": "ADORA2A encodes adenosine receptors. This variant is associated with increased anxiety response to caffeine.",
        "implications": [
            "More likely to experience jitteriness, anxiety, or panic from caffeine",
            "May be more sensitive to sleep disruption from caffeine"
        ],
        "actions": [
            "Consider lower caffeine doses or slower-release forms",
            "Pair caffeine with L-theanine (green tea naturally has this)",
            "Matcha or green tea may be better tolerated than coffee",
            "Consider caffeine alternatives: yerba mate, guayusa"
        ],
        "interactions": ["Compounds with slow COMT for stress sensitivity"]
    },
    ("ADORA2A", "lower_sensitivity"): {
        "mechanism": "This variant is associated with lower caffeine sensitivity regarding anxiety.",
        "implications": [
            "Less likely to experience anxiety from caffeine",
            "May tolerate higher doses without jitteriness"
        ],
        "actions": [
            "Can likely enjoy caffeine without anxiety issues",
            "Still respect timing for sleep quality"
        ],
        "interactions": []
    },
    # CARDIOVASCULAR
    ("AGTR1", "increased"): {
        "mechanism": "AGTR1 encodes the angiotensin II type 1 receptor. This variant is associated with increased receptor activity and hypertension risk.",
        "implications": [
            "Higher risk of developing hypertension",
            "May have enhanced response to angiotensin receptor blockers (ARBs)"
        ],
        "actions": [
            "Regular blood pressure monitoring",
            "Sodium restriction particularly beneficial",
            "ARBs (losartan, valsartan) may be especially effective if BP medication needed"
        ],
        "interactions": ["Compounds with ACE and AGT variants"]
    },
    ("ACE", "high"): {
        "mechanism": "Higher ACE activity means more conversion of angiotensin I to angiotensin II, a potent vasoconstrictor.",
        "implications": [
            "Increased hypertension risk",
            "May confer advantage in power/sprint athletics",
            "Good response expected to ACE inhibitors"
        ],
        "actions": [
            "Blood pressure monitoring essential",
            "ACE inhibitors (lisinopril, enalapril) likely very effective if needed",
            "Potassium-rich diet supports blood pressure"
        ],
        "interactions": ["Synergizes with AGTR1 and AGT variants for BP risk"]
    },
    ("AGT", "increased"): {
        "mechanism": "AGT M235T is associated with higher angiotensinogen levels, feeding into the renin-angiotensin system.",
        "implications": [
            "Slightly elevated blood pressure risk",
            "Contributes to overall cardiovascular profile"
        ],
        "actions": [
            "Part of overall BP monitoring strategy",
            "Responds to general cardiovascular lifestyle measures"
        ],
        "interactions": ["Additive with ACE and AGTR1 variants"]
    },
    ("GNB3", "increased"): {
        "mechanism": "GNB3 C825T affects G-protein signaling, associated with hypertension and obesity risk.",
        "implications": [
            "Increased hypertension risk",
            "May be more prone to weight gain",
            "Can affect response to certain medications"
        ],
        "actions": [
            "Weight management particularly important",
            "Regular blood pressure monitoring",
            "May respond differently to beta-blockers"
        ],
        "interactions": ["Compounds with other BP variants"]
    },
    # NUTRITION
    ("APOA2", "sensitive"): {
        "mechanism": "APOA2 affects how saturated fat influences body weight. The CC genotype shows strong correlation between saturated fat intake and obesity.",
        "implications": [
            "Saturated fat intake more strongly linked to weight gain for you",
            "Limiting saturated fat may be more impactful than for others"
        ],
        "actions": [
            "Limit saturated fat to <7% of calories",
            "Replace with unsaturated fats (olive oil, nuts, avocado)",
            "Minimize: butter, fatty red meat, full-fat dairy, coconut oil",
            "Prioritize: olive oil, fatty fish, nuts, avocados"
        ],
        "interactions": []
    },
    ("GC", "low"): {
        "mechanism": "GC encodes vitamin D binding protein. This variant results in lower circulating 25-OH vitamin D levels.",
        "implications": [
            "Genetically predisposed to lower vitamin D status",
            "Higher supplementation needs, especially at northern latitudes",
            "May need to supplement year-round"
        ],
        "actions": [
            "Supplement vitamin D3: 2,000-5,000 IU/day depending on season and sun exposure",
            "Take with fat-containing meal for absorption",
            "Test 25-OH vitamin D after 2-3 months",
            "Target blood level: 40-60 ng/mL (100-150 nmol/L)",
            "Consider vitamin K2 (MK-7) alongside D3"
        ],
        "interactions": []
    },
    ("BCMO1", "reduced"): {
        "mechanism": "BCMO1 converts beta-carotene to vitamin A. Reduced activity means less efficient conversion from plant sources.",
        "implications": [
            "Plant carotenoids (carrots, sweet potatoes) less efficiently converted to vitamin A",
            "May benefit from preformed vitamin A sources"
        ],
        "actions": [
            "Include preformed vitamin A: liver, eggs, dairy, fatty fish",
            "Don't rely solely on beta-carotene for vitamin A needs",
            "Still consume carotenoid-rich foods for other benefits (antioxidant)"
        ],
        "interactions": []
    },
    # INFLAMMATION
    ("IL6", "high"): {
        "mechanism": "IL-6 -174 G/G is associated with higher baseline IL-6 production, an inflammatory cytokine.",
        "implications": [
            "Higher baseline inflammation",
            "More pronounced inflammatory response to triggers",
            "May affect recovery, aging, chronic disease risk"
        ],
        "actions": [
            "Anti-inflammatory diet: omega-3s, colorful vegetables, low processed foods",
            "Omega-3 fatty acids (EPA/DHA): 2-3g/day",
            "Regular exercise (but don't overtrain)",
            "Adequate sleep - sleep deprivation spikes IL-6",
            "Consider curcumin, SPMs (specialized pro-resolving mediators)"
        ],
        "interactions": ["Affects recovery and chronic disease risk"]
    },
    # AUTOIMMUNE
    ("HLA-DQA1", "increased_risk"): {
        "mechanism": "HLA-DQ2.5 is strongly associated with celiac disease susceptibility. Not deterministic but increases risk.",
        "implications": [
            "Increased risk of celiac disease (but not guaranteed)",
            "~3% of HLA-DQ2.5 carriers develop celiac disease",
            "Should be aware of celiac symptoms"
        ],
        "actions": [
            "Know celiac symptoms: GI issues, fatigue, anemia, nutrient deficiencies",
            "If symptoms arise, get celiac antibody testing (tTG-IgA) while still eating gluten",
            "No need for preventive gluten-free diet unless symptomatic",
            "Inform healthcare providers of this risk"
        ],
        "interactions": []
    },
    # SKIN
    ("MC1R", "accelerated"): {
        "mechanism": "MC1R variants affect melanin production and skin aging. V92M is associated with accelerated skin aging.",
        "implications": [
            "May show earlier signs of skin aging (wrinkles, photoaging)",
            "Importance of sun protection heightened"
        ],
        "actions": [
            "Daily broad-spectrum SPF 30+ sunscreen",
            "Topical retinoids (tretinoin, retinol) for anti-aging",
            "Antioxidant serums (vitamin C, E)",
            "Avoid excessive sun exposure and tanning"
        ],
        "interactions": []
    },
    # SLEEP
    ("ARNTL", "significantly_altered"): {
        "mechanism": "BMAL1 (ARNTL) is a core circadian clock gene. This variant may weaken circadian rhythm strength.",
        "implications": [
            "May have less robust circadian rhythm",
            "Potentially more susceptible to jet lag, shift work effects",
            "Sleep timing may be less consistent"
        ],
        "actions": [
            "Strong light exposure in morning (10,000 lux or sunlight)",
            "Consistent sleep/wake times, even weekends",
            "Blue light reduction in evening",
            "Consider melatonin 0.5-1mg 30-60 min before bed if needed",
            "Keep bedroom cool, dark, quiet"
        ],
        "interactions": []
    },
    # DETOXIFICATION
    ("NAT2", "intermediate"): {
        "mechanism": "NAT2 acetylates various drugs and toxins. Intermediate acetylators have moderate metabolism of NAT2 substrates.",
        "implications": [
            "Moderate metabolism of drugs like isoniazid, hydralazine, some sulfonamides",
            "Between slow and fast acetylator phenotypes"
        ],
        "actions": [
            "Generally standard drug dosing appropriate",
            "Inform physicians if taking NAT2-metabolized drugs"
        ],
        "interactions": []
    },
    ("SOD2", "high_activity"): {
        "mechanism": "SOD2 (MnSOD) is a key mitochondrial antioxidant enzyme. High activity (Ala/Ala) provides efficient superoxide neutralization.",
        "implications": [
            "Efficient mitochondrial antioxidant defense",
            "Good protection against mitochondrial oxidative stress"
        ],
        "actions": [
            "This is a favorable variant - no specific intervention needed",
            "Continue supporting mitochondrial health: exercise, CoQ10, adequate sleep"
        ],
        "interactions": []
    },
    # FITNESS
    ("ACTN3", "mixed"): {
        "mechanism": "ACTN3 R577X affects fast-twitch muscle fiber composition. R/X (heterozygous) provides balanced fiber distribution.",
        "implications": [
            "Versatile muscle fiber composition",
            "Can develop both power and endurance capacity",
            "Neither extreme sprinter nor ultra-endurance genotype"
        ],
        "actions": [
            "Train for both power and endurance based on goals",
            "Respond well to varied training programs",
            "Can optimize for either direction with proper training"
        ],
        "interactions": []
    },
    ("ADRB2", "gly16"): {
        "mechanism": "ADRB2 Gly16 is associated with enhanced lipolysis (fat burning) response to exercise and catecholamines.",
        "implications": [
            "Better fat mobilization during exercise",
            "Enhanced response to beta-agonists (bronchodilators)"
        ],
        "actions": [
            "May see good fat loss response to exercise",
            "Cardio and HIIT can be particularly effective for body composition"
        ],
        "interactions": []
    },
    # IRON
    ("HFE", "carrier"): {
        "mechanism": "HFE H63D is a minor hemochromatosis variant. Carriers have slightly increased iron absorption.",
        "implications": [
            "Mild increase in iron absorption",
            "Usually not clinically significant alone",
            "Should be aware of iron accumulation over time"
        ],
        "actions": [
            "Periodic ferritin checks (every 1-2 years)",
            "Avoid unnecessary iron supplements",
            "Blood donation if ferritin runs high - helps regulate iron"
        ],
        "interactions": ["Compound with C282Y for hemochromatosis risk"]
    },
    # LONGEVITY
    ("TP53", "arg72"): {
        "mechanism": "TP53 R72P affects p53 apoptotic efficiency. Arg72 has less efficient apoptosis induction.",
        "implications": [
            "Slightly less efficient programmed cell death",
            "Complex effects on cancer and aging"
        ],
        "actions": [
            "Standard cancer screening appropriate for age",
            "Anti-aging lifestyle: exercise, sleep, stress management, healthy diet"
        ],
        "interactions": []
    },
    ("CETP", "favorable"): {
        "mechanism": "CETP I405V affects cholesterol transfer between lipoproteins. This variant is associated with higher HDL and longevity.",
        "implications": [
            "Favorable lipid profile tendency",
            "Associated with exceptional longevity in studies"
        ],
        "actions": [
            "This is a favorable variant",
            "Support with heart-healthy lifestyle"
        ],
        "interactions": []
    },
    # ALCOHOL
    ("ADH1B", "slow"): {
        "mechanism": "ADH1B affects the first step of alcohol metabolism (alcohol to acetaldehyde). Slow metabolizers have longer alcohol effects.",
        "implications": [
            "Alcohol effects last longer",
            "May feel effects at lower doses",
            "Slower acetaldehyde production (not the \"flush\" gene)"
        ],
        "actions": [
            "Moderate alcohol consumption appropriate",
            "Effects may persist longer - factor into timing",
            "Space drinks and stay hydrated"
        ],
        "interactions": ["ALDH2 affects second step (acetaldehyde clearance)"]
    },
    # DRUG METABOLISM
    ("CYP2C19", "rapid"): {
        "mechanism": "CYP2C19*17 causes ultra-rapid metabolism of many drugs including PPIs, some antidepressants, and clopidogrel.",
        "implications": [
            "Faster breakdown of PPIs (may need higher doses or alternatives)",
            "Faster clopidogrel activation (actually better for this prodrug)",
            "Some antidepressants metabolized faster"
        ],
        "actions": [
            "PPIs (omeprazole): may need higher doses or alternatives",
            "Clopidogrel: good metabolizer, likely effective",
            "Inform prescribers about CYP2C19 status"
        ],
        "interactions": ["Pharmacogenomic testing reference"]
    },
    ("CYP3A5", "non_expressor"): {
        "mechanism": "CYP3A5*3/*3 means you don't express CYP3A5. CYP3A4 handles the work. This is the most common genotype in many populations.",
        "implications": [
            "Standard dosing for CYP3A4/5 substrates",
            "Tacrolimus dosing follows standard protocols"
        ],
        "actions": [
            "Standard drug dosing typically appropriate",
            "CYP3A4 remains the primary metabolizer for many drugs"
        ],
        "interactions": []
    },
}

# Gene pathway groupings for cross-referencing
PATHWAYS = {
    "Methylation Cycle": ["MTHFR", "MTRR", "MTR", "CBS", "BHMT", "PEMT"],
    "Catecholamine Metabolism": ["COMT", "MAO-A", "MAO-B", "DBH"],
    "Caffeine Response": ["CYP1A2", "ADORA2A", "ADA"],
    "Blood Pressure": ["ACE", "AGT", "AGTR1", "GNB3", "ADRB1"],
    "Inflammation": ["IL6", "TNF", "CRP", "IL10"],
    "Drug Metabolism - Phase I": ["CYP1A2", "CYP2C9", "CYP2C19", "CYP2D6", "CYP3A4", "CYP3A5"],
    "Drug Metabolism - Phase II": ["NAT2", "GSTP1", "UGT1A1"],
    "Lipid Metabolism": ["APOE", "APOA2", "CETP", "PPARG", "PPARA"],
    "Vitamin Metabolism": ["GC", "BCMO1", "FUT2", "MTHFR"],
    "Circadian Rhythm": ["ARNTL", "PER2", "CLOCK"],
    "Muscle & Exercise": ["ACTN3", "PPARGC1A", "ADRB2", "ACE"],
}


def load_genetic_data(filepath):
    """Load the comprehensive results JSON."""
    with open(filepath, 'r') as f:
        return json.load(f)


def get_clinical_context(gene, status):
    """Get clinical context for a gene/status combination."""
    return CLINICAL_CONTEXT.get((gene, status), None)


def get_related_pathways(gene):
    """Find all pathways a gene belongs to."""
    return [pathway for pathway, genes in PATHWAYS.items() if gene in genes]


def format_magnitude(mag):
    """Format magnitude with color indicator."""
    if mag >= 3:
        return f"🔴 HIGH ({mag}/6)"
    elif mag == 2:
        return f"🟡 MODERATE ({mag}/6)"
    elif mag == 1:
        return f"🟢 LOW ({mag}/6)"
    else:
        return f"⚪ NEUTRAL ({mag}/6)"


def format_evidence_level(level):
    """Format PharmGKB evidence level."""
    if level == "1A":
        return "🔵 1A - Clinical guideline annotation"
    elif level == "1B":
        return "🔵 1B - Clinical guideline annotation"
    elif level == "2A":
        return "🟣 2A - Variant has moderate evidence"
    elif level == "2B":
        return "🟣 2B - Variant has moderate evidence"
    else:
        return f"⚫ {level}"


def generate_finding_section(finding, index):
    """Generate a comprehensive section for a single finding."""
    gene = finding.get('gene', 'Unknown')
    rsid = finding.get('rsid', '')
    category = finding.get('category', 'Uncategorized')
    genotype = finding.get('genotype', '')
    status = finding.get('status', '')
    description = finding.get('description', '')
    magnitude = finding.get('magnitude', 0)
    note = finding.get('note', '')

    section = []
    section.append(f"### {index}. {gene} ({rsid})")
    section.append("")
    section.append(f"**Category:** {category}  ")
    section.append(f"**Your Genotype:** `{genotype}`  ")
    section.append(f"**Status:** {status.replace('_', ' ').title()}  ")
    section.append(f"**Impact:** {format_magnitude(magnitude)}")
    section.append("")
    section.append(f"**Description:** {description}")

    if note:
        section.append(f"")
        section.append(f"**Note:** {note}")

    # Add pathways this gene belongs to
    pathways = get_related_pathways(gene)
    if pathways:
        section.append("")
        section.append(f"**Related Pathways:** {', '.join(pathways)}")

    # Add clinical context if available
    context = get_clinical_context(gene, status)
    if context:
        section.append("")
        section.append("#### Mechanism")
        section.append(context['mechanism'])

        if context.get('implications'):
            section.append("")
            section.append("#### Implications")
            for imp in context['implications']:
                section.append(f"- {imp}")

        if context.get('actions'):
            section.append("")
            section.append("#### Recommended Actions")
            for action in context['actions']:
                section.append(f"- {action}")

        if context.get('interactions'):
            section.append("")
            section.append("#### Gene Interactions")
            for interaction in context['interactions']:
                section.append(f"- {interaction}")

    section.append("")
    section.append("---")
    section.append("")

    return "\n".join(section)


def generate_pharmgkb_section(finding, index):
    """Generate a comprehensive section for a PharmGKB drug interaction."""
    gene = finding.get('gene', 'Unknown')
    rsid = finding.get('rsid', '')
    drugs = finding.get('drugs', '')
    genotype = finding.get('genotype', '')
    annotation = finding.get('annotation', '')
    level = finding.get('level', '')
    category = finding.get('category', 'Other')

    section = []
    section.append(f"### {index}. {gene} - {rsid}")
    section.append("")
    section.append(f"**Evidence Level:** {format_evidence_level(level)}  ")
    section.append(f"**Category:** {category}  ")
    section.append(f"**Your Genotype:** `{genotype}`  ")
    section.append(f"**Affected Drugs:** {drugs}")
    section.append("")
    section.append("#### Clinical Annotation")
    section.append(annotation)
    section.append("")

    # Add drug-specific guidance based on level and category
    if level in ["1A", "1B"]:
        section.append("#### Clinical Significance")
        section.append("This is a high-evidence drug-gene interaction with clinical guideline support. Discuss with prescribing physicians before starting these medications.")

    section.append("---")
    section.append("")

    return "\n".join(section)


def generate_category_summary(findings, category):
    """Generate a summary for a category."""
    cat_findings = [f for f in findings if f.get('category') == category]
    if not cat_findings:
        return ""

    high_impact = [f for f in cat_findings if f.get('magnitude', 0) >= 3]
    mod_impact = [f for f in cat_findings if f.get('magnitude', 0) == 2]

    summary = []
    summary.append(f"## {category}")
    summary.append("")
    summary.append(f"**Findings in this category:** {len(cat_findings)}  ")
    if high_impact:
        summary.append(f"**High Impact:** {len(high_impact)}  ")
    if mod_impact:
        summary.append(f"**Moderate Impact:** {len(mod_impact)}")
    summary.append("")

    return "\n".join(summary)


def generate_priority_actions(findings, pharmgkb):
    """Generate Priority Actions Summary with references and explanations."""
    actions = []

    # Check for high-impact drug metabolism
    cyp2c9 = next((f for f in findings if f.get('gene') == 'CYP2C9' and f.get('magnitude', 0) >= 3), None)
    if cyp2c9:
        actions.append({
            'priority': 1,
            'action': 'Warfarin dose reduction if prescribed',
            'explanation': 'If ever prescribed warfarin (blood thinner), tell your doctor you are a CYP2C9 intermediate metabolizer and will likely need a 25-30% lower dose to avoid bleeding complications.',
            'refs': '[PMID:21900891](https://pubmed.ncbi.nlm.nih.gov/21900891/)'
        })

    slco1b1 = next((f for f in findings if f.get('gene') == 'SLCO1B1' and f.get('magnitude', 0) >= 3), None)
    if slco1b1:
        actions.append({
            'priority': 2,
            'action': 'Statin caution - SLCO1B1 intermediate metabolizer',
            'explanation': 'If you need cholesterol medication, ask your doctor for rosuvastatin, pravastatin, or fluvastatin instead of simvastatin, because your SLCO1B1 gene makes simvastatin 4x more likely to cause muscle pain/damage.',
            'refs': '[PMID:22617227](https://pubmed.ncbi.nlm.nih.gov/22617227/)'
        })

    # Blood pressure genes
    bp_genes = {'AGTR1', 'ACE', 'AGT', 'GNB3'}
    bp_findings = [f for f in findings if f.get('gene') in bp_genes and f.get('magnitude', 0) >= 1]
    if len(bp_findings) >= 2:
        genes_str = ', '.join(f['gene'] for f in bp_findings)
        actions.append({
            'priority': 3,
            'action': 'Blood pressure monitoring at home',
            'explanation': f'Buy a home blood pressure monitor and check your BP weekly, since you have multiple gene variants ({genes_str}) that increase hypertension risk.',
            'refs': '[PMID:16046653](https://pubmed.ncbi.nlm.nih.gov/16046653/)'
        })

    # BDNF
    bdnf = next((f for f in findings if f.get('gene') == 'BDNF' and f.get('magnitude', 0) >= 2), None)
    if bdnf:
        actions.append({
            'priority': 4,
            'action': 'Exercise consistently - critical for BDNF',
            'explanation': 'Exercise at least 150 min/week because your BDNF gene variant means your brain produces less growth factor at rest, but exercise strongly boosts it.',
            'refs': '[PMID:12802256](https://pubmed.ncbi.nlm.nih.gov/12802256/)'
        })

    # HFE
    hfe = next((f for f in findings if f.get('gene') == 'HFE'), None)
    if hfe:
        actions.append({
            'priority': 5,
            'action': 'Iron monitoring - HFE carrier',
            'explanation': 'Get a ferritin blood test every 1-2 years and avoid iron supplements unless a doctor confirms deficiency, because your HFE variant causes increased iron absorption.',
            'refs': '[PMID:10807540](https://pubmed.ncbi.nlm.nih.gov/10807540/)'
        })

    # Macular degeneration
    amd_genes = {'CFH', 'C3', 'ERCC6', 'ARMS2'}
    amd_findings = [f for f in findings if f.get('gene') in amd_genes]
    if amd_findings:
        actions.append({
            'priority': 6,
            'action': 'Regular eye exams (ophthalmology)',
            'explanation': 'Get annual dilated eye exams from an ophthalmologist (not just optometrist) to catch early signs of age-related macular degeneration.',
            'refs': '[PMID:15761122](https://pubmed.ncbi.nlm.nih.gov/15761122/)'
        })

    # Methylation
    mthfr = next((f for f in findings if f.get('gene') == 'MTHFR' and f.get('magnitude', 0) >= 2), None)
    mtrr = next((f for f in findings if f.get('gene') == 'MTRR' and f.get('magnitude', 0) >= 2), None)
    if mthfr or mtrr:
        genes = [g for g in ['MTHFR', 'MTRR'] if next((f for f in findings if f.get('gene') == g and f.get('magnitude', 0) >= 2), None)]
        actions.append({
            'priority': 7,
            'action': f"Methylation support ({'/'.join(genes)})",
            'explanation': 'Consider taking methylfolate (not folic acid) and methylcobalamin (not regular B12) supplements, because your gene variants reduce your ability to process the standard forms.',
            'refs': '[PMID:19805654](https://pubmed.ncbi.nlm.nih.gov/19805654/)'
        })

    # Caffeine
    adora2a = next((f for f in findings if f.get('gene') == 'ADORA2A' and 'anxiety' in f.get('status', '')), None)
    if adora2a:
        actions.append({
            'priority': 8,
            'action': 'Caffeine - limit to mornings only',
            'explanation': 'Limit coffee/caffeine to before 10am and consider smaller amounts, because your ADORA2A gene variant makes caffeine more likely to cause jitteriness and anxiety.',
            'refs': '[PMID:17522618](https://pubmed.ncbi.nlm.nih.gov/17522618/)'
        })

    # Circadian
    arntl = next((f for f in findings if f.get('gene') == 'ARNTL' and f.get('magnitude', 0) >= 2), None)
    if arntl:
        actions.append({
            'priority': 9,
            'action': 'Circadian rhythm support',
            'explanation': 'Maintain strict sleep/wake times (even weekends) and get bright light exposure within 30 minutes of waking, because your ARNTL gene variant means your internal body clock is weaker than average.',
            'refs': '[PMID:17060375](https://pubmed.ncbi.nlm.nih.gov/17060375/)'
        })

    actions.sort(key=lambda x: x['priority'])
    return actions


def generate_executive_summary(data):
    """Generate executive summary."""
    findings = data.get('findings', [])
    pharmgkb = data.get('pharmgkb_findings', [])
    summary = data.get('summary', {})

    high_impact = [f for f in findings if f.get('magnitude', 0) >= 3]
    mod_impact = [f for f in findings if f.get('magnitude', 0) == 2]
    low_impact = [f for f in findings if f.get('magnitude', 0) == 1]

    # Count PharmGKB by level
    level_1 = [f for f in pharmgkb if f.get('level', '').startswith('1')]
    level_2 = [f for f in pharmgkb if f.get('level', '').startswith('2')]

    # Categories
    categories = set(f.get('category') for f in findings)

    # Generate priority actions
    priority_actions = generate_priority_actions(findings, pharmgkb)

    lines = []
    lines.append("# Exhaustive Genetic Health Report")
    lines.append("")
    lines.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Priority Actions Summary")
    lines.append("")
    lines.append("**Act on these first.** Each recommendation is backed by your genetic findings.")
    lines.append("")
    for i, action in enumerate(priority_actions, 1):
        lines.append(f"{i}. **{action['action']}**")
        lines.append(f"   → {action['explanation']}")
        lines.append(f"   *Reference:* {action['refs']}")
        lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Executive Summary")
    lines.append("")
    lines.append("### Genome Overview")
    lines.append(f"- **Total SNPs in Raw Data:** {summary.get('total_snps', 'N/A'):,}")
    lines.append(f"- **Clinically Relevant SNPs Analyzed:** {len(findings)}")
    lines.append(f"- **PharmGKB Drug Interactions:** {len(pharmgkb)}")
    lines.append("")
    lines.append("### Impact Distribution")
    lines.append(f"- 🔴 **High Impact (magnitude ≥3):** {len(high_impact)}")
    lines.append(f"- 🟡 **Moderate Impact (magnitude 2):** {len(mod_impact)}")
    lines.append(f"- 🟢 **Low Impact (magnitude 1):** {len(low_impact)}")
    lines.append(f"- ⚪ **Informational (magnitude 0):** {len(findings) - len(high_impact) - len(mod_impact) - len(low_impact)}")
    lines.append("")
    lines.append("### Pharmacogenomics")
    lines.append(f"- 🔵 **Level 1 (Clinical Guidelines):** {len(level_1)}")
    lines.append(f"- 🟣 **Level 2 (Moderate Evidence):** {len(level_2)}")
    lines.append("")
    lines.append("### Categories Covered")
    for cat in sorted(categories):
        count = len([f for f in findings if f.get('category') == cat])
        lines.append(f"- {cat}: {count} findings")
    lines.append("")
    lines.append("---")
    lines.append("")

    return "\n".join(lines)


def generate_priority_findings(findings):
    """Generate the priority findings section."""
    high_impact = [f for f in findings if f.get('magnitude', 0) >= 3]
    mod_impact = [f for f in findings if f.get('magnitude', 0) == 2]

    lines = []
    lines.append("## 🔴 Priority Findings (High Impact)")
    lines.append("")
    lines.append("These findings have the most significant implications for your health decisions.")
    lines.append("")

    for i, finding in enumerate(high_impact, 1):
        lines.append(generate_finding_section(finding, i))

    if mod_impact:
        lines.append("## 🟡 Moderate Impact Findings")
        lines.append("")
        lines.append("These findings warrant attention and may influence health decisions.")
        lines.append("")

        for i, finding in enumerate(mod_impact, 1):
            lines.append(generate_finding_section(finding, i))

    return "\n".join(lines)


def generate_full_findings(findings):
    """Generate all findings organized by category."""
    categories = sorted(set(f.get('category', 'Other') for f in findings))

    lines = []
    lines.append("## Complete Findings by Category")
    lines.append("")
    lines.append("Every genetic finding analyzed, organized by category.")
    lines.append("")

    for category in categories:
        cat_findings = [f for f in findings if f.get('category') == category]
        if not cat_findings:
            continue

        lines.append(f"### 📂 {category}")
        lines.append("")

        # Sort by magnitude (highest first)
        cat_findings.sort(key=lambda x: x.get('magnitude', 0), reverse=True)

        for i, finding in enumerate(cat_findings, 1):
            gene = finding.get('gene', 'Unknown')
            rsid = finding.get('rsid', '')
            genotype = finding.get('genotype', '')
            status = finding.get('status', '').replace('_', ' ').title()
            description = finding.get('description', '')
            magnitude = finding.get('magnitude', 0)

            mag_icon = "🔴" if magnitude >= 3 else "🟡" if magnitude == 2 else "🟢" if magnitude == 1 else "⚪"

            lines.append(f"#### {i}. {gene} ({rsid}) {mag_icon}")
            lines.append(f"- **Genotype:** `{genotype}` | **Status:** {status} | **Impact:** {magnitude}/6")
            lines.append(f"- {description}")

            context = get_clinical_context(gene, finding.get('status', ''))
            if context:
                lines.append(f"- **Mechanism:** {context['mechanism'][:200]}...")
                if context.get('actions'):
                    lines.append(f"- **Key Action:** {context['actions'][0]}")

            lines.append("")

        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def generate_pharmgkb_report(pharmgkb):
    """Generate comprehensive pharmacogenomics section."""
    lines = []
    lines.append("## 💊 Pharmacogenomics - Complete Drug-Gene Interactions")
    lines.append("")
    lines.append("This section contains all drug-gene interactions from PharmGKB with clinical annotations.")
    lines.append("Share this information with prescribing physicians before starting new medications.")
    lines.append("")

    # Organize by evidence level
    level_1a = [f for f in pharmgkb if f.get('level') == '1A']
    level_1b = [f for f in pharmgkb if f.get('level') == '1B']
    level_2a = [f for f in pharmgkb if f.get('level') == '2A']
    level_2b = [f for f in pharmgkb if f.get('level') == '2B']

    if level_1a:
        lines.append("### Level 1A - Highest Evidence (Clinical Guideline Annotations)")
        lines.append("")
        for i, finding in enumerate(level_1a, 1):
            lines.append(generate_pharmgkb_section(finding, i))

    if level_1b:
        lines.append("### Level 1B - High Evidence (Clinical Guideline Annotations)")
        lines.append("")
        for i, finding in enumerate(level_1b, 1):
            lines.append(generate_pharmgkb_section(finding, i))

    if level_2a:
        lines.append("### Level 2A - Moderate Evidence")
        lines.append("")
        for i, finding in enumerate(level_2a, 1):
            lines.append(generate_pharmgkb_section(finding, i))

    if level_2b:
        lines.append("### Level 2B - Moderate Evidence")
        lines.append("")
        for i, finding in enumerate(level_2b, 1):
            lines.append(generate_pharmgkb_section(finding, i))

    return "\n".join(lines)


def generate_pathway_analysis(findings):
    """Generate pathway analysis section."""
    lines = []
    lines.append("## 🔗 Pathway Analysis")
    lines.append("")
    lines.append("Your genes grouped by biological pathway, showing how multiple variants may interact.")
    lines.append("")

    for pathway_name, pathway_genes in PATHWAYS.items():
        # Find findings in this pathway
        pathway_findings = [f for f in findings if f.get('gene') in pathway_genes]
        if not pathway_findings:
            continue

        lines.append(f"### {pathway_name}")
        lines.append("")

        for finding in pathway_findings:
            gene = finding.get('gene', '')
            status = finding.get('status', '').replace('_', ' ').title()
            magnitude = finding.get('magnitude', 0)
            mag_icon = "🔴" if magnitude >= 3 else "🟡" if magnitude == 2 else "🟢" if magnitude == 1 else "⚪"

            lines.append(f"- {mag_icon} **{gene}:** {status}")

        lines.append("")

        # Add pathway interpretation if relevant
        if pathway_name == "Methylation Cycle":
            mthfr = next((f for f in pathway_findings if f.get('gene') == 'MTHFR' and f.get('magnitude', 0) >= 2), None)
            mtrr = next((f for f in pathway_findings if f.get('gene') == 'MTRR' and f.get('magnitude', 0) >= 2), None)
            if mthfr and mtrr:
                lines.append("⚠️ **Pathway Impact:** Multiple methylation cycle variants detected. Consider comprehensive methylation support (methylfolate + methylcobalamin + B2).")
                lines.append("")

        elif pathway_name == "Blood Pressure":
            bp_findings = [f for f in pathway_findings if f.get('magnitude', 0) >= 1]
            if len(bp_findings) >= 2:
                lines.append("⚠️ **Pathway Impact:** Multiple blood pressure-related variants. Recommend regular monitoring and lifestyle optimization.")
                lines.append("")

        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def generate_action_summary(findings):
    """Generate comprehensive action summary."""
    lines = []
    lines.append("## 📋 Comprehensive Action Summary")
    lines.append("")

    # Collect all actions from clinical context
    supplement_actions = []
    diet_actions = []
    lifestyle_actions = []
    monitoring_actions = []
    medical_actions = []

    for finding in findings:
        context = get_clinical_context(finding.get('gene'), finding.get('status'))
        if context and context.get('actions'):
            for action in context['actions']:
                action_lower = action.lower()
                if any(word in action_lower for word in ['supplement', 'vitamin', 'mg', 'mcg', 'iu', 'dose']):
                    supplement_actions.append(f"- {action} *(from {finding.get('gene')})*")
                elif any(word in action_lower for word in ['diet', 'eat', 'food', 'limit', 'avoid', 'meal']):
                    diet_actions.append(f"- {action} *(from {finding.get('gene')})*")
                elif any(word in action_lower for word in ['exercise', 'sleep', 'stress', 'meditation']):
                    lifestyle_actions.append(f"- {action} *(from {finding.get('gene')})*")
                elif any(word in action_lower for word in ['test', 'monitor', 'check', 'measure']):
                    monitoring_actions.append(f"- {action} *(from {finding.get('gene')})*")
                elif any(word in action_lower for word in ['doctor', 'physician', 'medical', 'prescrib']):
                    medical_actions.append(f"- {action} *(from {finding.get('gene')})*")

    if supplement_actions:
        lines.append("### 💊 Supplement Considerations")
        lines.append("*Discuss with healthcare provider before starting*")
        lines.append("")
        lines.extend(list(set(supplement_actions))[:15])  # Dedupe and limit
        lines.append("")

    if diet_actions:
        lines.append("### 🥗 Dietary Recommendations")
        lines.append("")
        lines.extend(list(set(diet_actions))[:10])
        lines.append("")

    if lifestyle_actions:
        lines.append("### 🏃 Lifestyle Actions")
        lines.append("")
        lines.extend(list(set(lifestyle_actions))[:10])
        lines.append("")

    if monitoring_actions:
        lines.append("### 📊 Monitoring Recommendations")
        lines.append("")
        lines.extend(list(set(monitoring_actions))[:10])
        lines.append("")

    if medical_actions:
        lines.append("### 🏥 Medical Considerations")
        lines.append("")
        lines.extend(list(set(medical_actions))[:10])
        lines.append("")

    lines.append("---")
    lines.append("")

    return "\n".join(lines)


def generate_disclaimer():
    """Generate disclaimer section."""
    return """## ⚠️ Important Disclaimer

This report is for **informational and educational purposes only**. It is NOT medical advice.

### Key Points:
- Genetic associations are probabilistic, not deterministic
- Your genes are just one factor - environment, lifestyle, and other genes matter
- "Risk" variants don't guarantee outcomes; "protective" variants don't guarantee safety
- Consult healthcare providers before making medical decisions
- Some findings may have different implications in different populations
- Genetic science evolves - recommendations may change as research advances

### How to Use This Report:
1. **Share with providers** - Especially the pharmacogenomics section before new medications
2. **Focus on actionable items** - Prioritize evidence-based interventions
3. **Don't over-interpret** - One gene doesn't define your health destiny
4. **Combine with testing** - Many recommendations include follow-up lab tests

---

*Report generated using comprehensive genetic analysis. Data source: Personal genome analysis with PharmGKB clinical annotations.*
"""


def main():
    # Load data
    data_path = Path(__file__).parent.parent / "reports" / "comprehensive_results.json"
    output_path = Path(__file__).parent.parent / "reports" / "EXHAUSTIVE_GENETIC_REPORT.md"

    print(f"Loading genetic data from {data_path}...")
    data = load_genetic_data(data_path)

    findings = data.get('findings', [])
    pharmgkb = data.get('pharmgkb_findings', [])

    print(f"Processing {len(findings)} findings and {len(pharmgkb)} drug interactions...")

    # Build report
    report_parts = []

    # Executive summary
    print("Generating executive summary...")
    report_parts.append(generate_executive_summary(data))

    # Priority findings
    print("Generating priority findings...")
    report_parts.append(generate_priority_findings(findings))

    # Pathway analysis
    print("Generating pathway analysis...")
    report_parts.append(generate_pathway_analysis(findings))

    # Full findings by category
    print("Generating complete findings...")
    report_parts.append(generate_full_findings(findings))

    # Pharmacogenomics
    print("Generating pharmacogenomics report...")
    report_parts.append(generate_pharmgkb_report(pharmgkb))

    # Action summary
    print("Generating action summary...")
    report_parts.append(generate_action_summary(findings))

    # Disclaimer
    report_parts.append(generate_disclaimer())

    # Combine and write
    full_report = "\n".join(report_parts)

    print(f"Writing report to {output_path}...")
    with open(output_path, 'w') as f:
        f.write(full_report)

    print(f"\n✅ Report generated successfully!")
    print(f"   Output: {output_path}")
    print(f"   Total length: {len(full_report):,} characters")
    print(f"   Findings covered: {len(findings)}")
    print(f"   Drug interactions covered: {len(pharmgkb)}")


if __name__ == "__main__":
    main()
