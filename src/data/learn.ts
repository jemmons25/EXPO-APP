/**
 * Learn Hub content — sourced & evidence-graded from docs/02-SCIENCE-CONTENT.md.
 * Layered: summary (30-sec) → deepDive (5-min) → citations.
 */
import { EvidenceStrength } from '@/theme/colors';
import { Citation } from './ingredients';

export interface LearnTopic {
  slug: string;
  title: string;
  emoji: string;
  evidence: EvidenceStrength;
  summary: string;
  deepDive: string[]; // paragraphs
  bothSides?: { mainstream: string; dissent: string; agreement?: string };
  citations: Citation[];
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    slug: 'fructose-vs-glucose',
    title: 'Fructose vs. Glucose',
    emoji: '🍬',
    evidence: 'strong',
    summary:
      'Glucose is used by every cell and tightly controlled by insulin. Fructose is processed almost entirely in your liver, with no insulin brake. In large amounts (soda, not whole fruit) that drives liver fat and raises uric acid.',
    deepDive: [
      'Glucose is phosphorylated by glucokinase/hexokinase and its breakdown (glycolysis) is throttled at phosphofructokinase by insulin, ATP, and citrate — a regulated valve.',
      'Fructose is phosphorylated by ketohexokinase (KHK), which has a much lower Km and no feedback inhibition. Fructose catabolism runs ~10× faster and bypasses that control point.',
      'Rapid KHK phosphorylation depletes liver ATP → AMP → uric acid, generating oxidative stress. This is why high fructose acutely raises uric acid.',
      'Fructose strongly activates the lipogenic transcription factors ChREBP and SREBP-1c, so more of it is turned into liver fat. Its handling is often described as "more like ethanol than glucose."',
      'Context matters: this is a dose and source story. Whole fruit — with fiber, water, and modest fructose — is not the same as sugar-sweetened drinks. The disease link is strongest for large amounts of liquid/added fructose.',
    ],
    citations: [
      { title: 'Divergent effects of glucose and fructose on hepatic lipogenesis', publisher: 'JCI', studyType: 'mechanistic', url: 'https://www.jci.org/articles/view/94585' },
      { title: 'Insights into Hexose Liver Metabolism — Glucose vs Fructose', publisher: 'Nutrients', studyType: 'review', url: 'https://www.mdpi.com/2072-6643/9/9/1026' },
    ],
  },
  {
    slug: 'seed-oils',
    title: 'Seed Oils & Linoleic Acid',
    emoji: '🌻',
    evidence: 'contested',
    summary:
      'Seed oils are high in the omega-6 fat linoleic acid. Online they are called toxic — but the actual human evidence links higher linoleic acid to LOWER heart-disease and diabetes risk, and it does not reliably raise inflammation. The better-supported concerns are ultra-processing and repeatedly-heated oils.',
    deepDive: [
      'This is the app\u2019s honesty test, so we show it straight.',
      'Meta-analyses of large cohorts: the highest linoleic acid intake is associated with roughly 15% lower coronary event risk and ~21% lower coronary-death risk. A biomarker study across 30 cohorts and ~68,000 people found higher blood linoleic acid tracked with lower cardiovascular disease and ~35% lower type-2-diabetes risk.',
      'Randomized trials: replacing saturated fat with polyunsaturated fat lowers LDL and improves glucose/insulin markers, and does not raise inflammatory markers (CRP, IL-6, TNF-α). Linoleic acid does not convert efficiently to arachidonic acid.',
      'Where everyone agrees, and what we actually flag: ultra-processed foods high in seed oils are worth limiting (because of the whole ultra-processing package), and repeatedly-heated/oxidized frying oils produce harmful compounds. So we mark seed oils as an ultra-processing MARKER (yellow), not a toxin (never red).',
    ],
    bothSides: {
      mainstream:
        'Weight of evidence (cohorts + RCTs): linoleic acid is neutral-to-beneficial for heart and metabolic health; replacing saturated fat with it lowers risk.',
      dissent:
        'Some researchers argue very high intake may raise oxidized linoleic-acid metabolites or affect mitochondria, and call for more long-term trials. This is emerging, not established.',
      agreement:
        'Avoid ultra-processed foods and repeatedly-heated frying oil. Do not smoke or reuse cooking oils.',
    },
    citations: [
      { title: 'Concerns about seed oils are without scientific foundation (scoping review)', publisher: 'Crit Rev Food Sci Nutr 2026', studyType: 'review', url: 'https://www.tandfonline.com/doi/full/10.1080/10408398.2026.2657527' },
      { title: 'The controversial role of linoleic acid in cardiometabolic health', publisher: 'Frontiers in Nutrition 2025', studyType: 'review', url: 'https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2025.1728865/full' },
      { title: 'The Evidence Behind Seed Oils\u2019 Health Effects', publisher: 'Johns Hopkins Bloomberg SPH', url: 'https://publichealth.jhu.edu/2025/the-evidence-behind-seed-oils-health-effects' },
    ],
  },
  {
    slug: 'sun-vitamin-d',
    title: 'Sun Exposure & Vitamin D',
    emoji: '☀️',
    evidence: 'moderate',
    summary:
      'Your skin makes vitamin D from UVB, which only reaches you when the sun is high — roughly UV index ≥ 3 and your shadow shorter than you are. Fair skin needs a few minutes; darker skin needs much longer. More time doesn\u2019t mean more vitamin D — it plateaus.',
    deepDive: [
      'UV index ≥ 3 is the practical threshold for meaningful UVB. Below that (early morning, winter at high latitude) you make little to none.',
      'Shadow rule: if your shadow is shorter than your height, the sun is high enough for UVB to reach the ground — usually around 10am–2pm.',
      'Skin-type dose at UV ≥ 3, without burning: Types I–II ~ up to 10 min; III–IV ~ up to 15 min; V–VI ~ up to 30 min (and darker skin may need multiples of that for equal synthesis).',
      'Plateau + safety valve: UVB degrades the vitamin-D precursor past a point, so synthesis self-limits. Extra time only adds burn and skin-cancer risk.',
      'Honest nuance: dermatology bodies emphasize skin-cancer risk and often prefer supplementation to deliberate UV. The "sensible sun" camp emphasizes light\u2019s other benefits. We show both and default to "don\u2019t burn."',
    ],
    citations: [
      { title: 'How much sun do I need for vitamin D production?', publisher: 'Examine', url: 'https://examine.com/faq/how-much-sun-do-i-need-for-vitamin-d-production/' },
      { title: 'Vitamin D Synthesis Following a Single Bout of Sun Exposure', publisher: 'Nutrients 2020', studyType: 'human study', url: 'https://www.mdpi.com/2072-6643/12/8/2237' },
    ],
  },
  {
    slug: 'morning-light',
    title: 'Morning Light & Circadian Rhythm',
    emoji: '🌅',
    evidence: 'strong',
    summary:
      'Bright morning light hits special cells in your eyes that set your master clock. It sharpens your morning cortisol (alertness) and starts the timer for melatonin that night — better sleep. Get outside within ~30–60 minutes of waking.',
    deepDive: [
      'Mechanism is well established: melanopsin cells (ipRGCs) signal the suprachiasmatic nucleus. Morning light phase-advances the clock (earlier sleep/wake); evening light delays it.',
      'Post-awakening bright light boosts the cortisol awakening response, most sensitively to short-wavelength (blue) light.',
      'Honest dosing caveat: the popular "5–10 minutes" figure is practical, but the strongest controlled data used longer/brighter exposures. So the direction is well-supported; the exact minimum dose is less certain. Outdoor light is far brighter than indoor, so a few minutes outside beats much longer inside.',
      'Practical protocol: get outside within 30–60 min of waking, no sunglasses (never stare at the sun); longer on overcast days; if it\u2019s dark when you wake, use bright indoor light then get sun later. Consistency beats perfection.',
    ],
    citations: [
      { title: 'Morning bright light phase-advance dose study', publisher: 'PMC4344919', studyType: 'RCT', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4344919/' },
      { title: 'Does Huberman\u2019s morning-sunlight protocol work? (critical review)', publisher: 'Caveat', url: 'https://caveat-ai.com/checks/huberman-morning-sunlight' },
    ],
  },
  {
    slug: 'protein-amino-acids',
    title: 'Protein & Amino Acids',
    emoji: '🥩',
    evidence: 'strong',
    summary:
      'Muscle is built meal-by-meal. Each meal needs ~20–40 g of quality protein — enough to supply the ~2.5–3 g of leucine that flips on muscle protein synthesis. Older adults need more. Animal proteins are the richest, most complete sources.',
    deepDive: [
      'Essential vs non-essential: 9 essential amino acids must come from food. Complete proteins (animal, soy) have all 9 in good ratios; most single plant sources are incomplete and are combined to complete them.',
      'Leucine is both a trigger (activates the mTORC1 pathway) and a building block. The per-meal signaling target is often cited as ~2–3 g leucine (~25–40 g quality protein).',
      'There\u2019s a ceiling: muscle protein synthesis saturates, so a huge single dose isn\u2019t proportionally better. Spreading protein across meals beats loading it all at once.',
      'Older adults have "anabolic resistance" — they need more (~3–4 g leucine / ~35–40 g protein per meal, ~1.2–1.5 g/kg/day).',
      'Honest nuance: recent reviews argue the strict leucine-threshold idea is overstated for real mixed meals, where total protein and the food matrix predict the response better. So treat leucine as a useful heuristic, not a rule.',
    ],
    citations: [
      { title: 'Reconsidering the pre-eminence of dietary leucine (perspective)', publisher: 'Am J Clin Nutr 2024', studyType: 'review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11251220/' },
    ],
  },
  {
    slug: 'ultra-processed-foods',
    title: 'Ultra-Processed Foods (NOVA)',
    emoji: '🏭',
    evidence: 'moderate',
    summary:
      'NOVA sorts food by how processed it is, not just nutrients. Group 4 — ultra-processed — means industrial formulations with additives you\u2019d never use at home (emulsifiers, colors, flavors). Higher intake tracks with more chronic disease.',
    deepDive: [
      'The tell for NOVA 4: cosmetic/industrial-only additives (flavors, colors, emulsifiers, sweeteners, thickeners) and ingredients not found in home kitchens.',
      'Emulsifiers & the gut: emerging human and lab evidence that some emulsifiers reduce microbial diversity and thin the gut mucus barrier, nudging low-grade inflammation. This is emerging and additive-specific.',
      'UPF intake is consistently associated with obesity and metabolic problems across cohorts; controlled-feeding work suggests UPFs drive people to eat more calories. Disentangling "processing" from "nutrient profile" is ongoing.',
      'In TrueHealth, NOVA level is the single biggest input to your clean score — this is the main correction to nutrient-only scoring apps.',
    ],
    citations: [
      { title: 'Detrimental impact of UPFs on the gut microbiome and barrier', publisher: 'Nutrients 2025', studyType: 'review', url: 'https://www.mdpi.com/2072-6643/17/5/859' },
    ],
  },
  {
    slug: 'gras-loophole',
    title: 'Food Additives & the GRAS Loophole',
    emoji: '🔬',
    evidence: 'strong',
    summary:
      'In the US, companies can declare a new ingredient "Generally Recognized As Safe" themselves — using their own studies — and add it to food without telling the FDA. That\u2019s the self-affirmed GRAS loophole. It\u2019s real and legal, and it\u2019s the evidence-based reason not to assume "on the shelf = FDA-vetted."',
    deepDive: [
      'The 1958 Food Additives Amendment created two paths: formal FDA review, or GRAS (meant for obvious staples like vinegar). A 1997 rule made notifying the FDA voluntary.',
      'Result: most new additives now reach market via GRAS, many "secret" (FDA never notified, data unpublished). The GAO, EWG, and academics have all flagged this.',
      'US vs. rest of world diverges: titanium dioxide is banned in EU food but allowed in the US; potassium bromate is banned in many countries but only voluntarily discouraged by the FDA; BVO and Red Dye No. 3 were only recently pulled in the US.',
      'The honest framing: "don\u2019t blindly trust regulators" is supported — not as conspiracy, but because the review gap is documented. Equally, "banned in Europe" doesn\u2019t automatically mean dangerous at real doses. We show mechanism, dose, and multi-country status, and let you decide.',
    ],
    bothSides: {
      mainstream: 'The FDA maintains GRAS ingredients meet the same safety standard as reviewed additives.',
      dissent: 'The GAO, EWG, and academics document that many "self-affirmed" ingredients entered food with unpublished data and no FDA review.',
      agreement: 'Transparency is improving; the FDA is exploring rulemaking to require notification.',
    },
    citations: [
      { title: 'Generally Recognized as Safe (GRAS)', publisher: 'FDA', url: 'https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras' },
      { title: 'Secret GRAS: How 100+ food chemicals bypassed safety review', publisher: 'EWG', url: 'https://www.ewg.org/research/secret-gras-how-100-food-chemicals-bypassed-government-safety-review' },
    ],
  },
];

export function getTopic(slug: string): LearnTopic | undefined {
  return LEARN_TOPICS.find((t) => t.slug === slug);
}
