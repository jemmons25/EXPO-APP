# Science Content Library (Learn Hub source of truth)

Every Learn Hub topic and every protocol recommendation draws from this file. Each topic is written in three layers (30-second summary → 5-minute deep dive → citations) and carries an **evidence-strength grade**.

## Evidence grading scale (show this legend in-app)

| Grade | Meaning | Typical basis |
|---|---|---|
| **Strong** | Consistent results across multiple RCTs and/or large meta-analyses; mechanism understood | Meta-analyses of RCTs, large pooled cohorts with biomarkers |
| **Moderate** | Good evidence, some inconsistency or reliance on cohort/observational data | Several cohorts, smaller RCTs |
| **Emerging** | Plausible and early evidence, not yet confirmed in humans at scale | Small human trials, strong mechanistic/animal data |
| **Contested** | Experts actively disagree; evidence points in different directions | Conflicting RCTs/cohorts, active debate |

**Golden rule:** on contested topics, show the mainstream (CDC/FDA/USDA) position *and* the newer/dissenting research side-by-side, each with its own grade. Never resolve it for the user by hiding one side.

---

## Topic 1 — Fructose vs. Glucose  ·  Grade: **Strong** (mechanism), **Moderate** (dose-dependent disease link)

**30-sec:** Glucose is used by every cell in your body and its handling is tightly controlled by insulin. Fructose is processed almost entirely in your **liver**, and that pathway is *not* regulated by insulin or by how much energy your cell already has. In large amounts (think sugar-sweetened drinks), that unregulated liver processing drives fat production in the liver (de novo lipogenesis) and spikes uric acid. Fruit is fine — the fiber, water, and dose make whole fruit a totally different thing than soda.

**5-min deep dive:**
- Glucose enters cells widely, is phosphorylated by glucokinase/hexokinase (glucokinase Km ≈ 10 mM), and glycolysis is throttled at phosphofructokinase by insulin, ATP, and citrate — a regulated valve.
- Fructose is phosphorylated by **ketohexokinase (KHK)**, which has a *much* lower Km (≈ 0.8 mM) and **no feedback inhibition**. Fructose catabolism runs ~10× faster than glucose and bypasses the PFK control point.
- Rapid KHK phosphorylation **depletes hepatic ATP → AMP → uric acid** (via AMP deaminase), generating reactive oxygen species and mitochondrial oxidative stress. This is why high fructose intake acutely raises uric acid.
- Fructose potently activates the lipogenic transcription factors **ChREBP and SREBP-1c**, upregulating fatty-acid synthesis → hepatic triglyceride accumulation. Its liver handling is often described as "more similar to ethanol than to glucose."
- **Context that matters:** this is a *dose and source* story. Whole fruit (fiber, slow absorption, modest fructose) is not sugar-sweetened beverages. The disease link (NAFLD/MASLD, insulin resistance) is strongest at high intakes of added/liquid fructose.

**Sources:** JCI "Divergent effects of glucose and fructose on hepatic lipogenesis" (jci.org/articles/view/94585); Baylor College of Medicine executive summary on fructose metabolism; *Nutrients* "Insights into the Hexose Liver Metabolism — Glucose versus Fructose" (mdpi.com/2072-6643/9/9/1026); review "Dietary fructose: from uric acid to a metabolic switch" (tandfonline 10.1080/10408398.2024.2392150).

---

## Topic 2 — Seed Oils & Linoleic Acid  ·  Grade: **Contested** (public debate) / **Moderate–Strong** (published evidence favors neutrality-to-benefit)

**⚠️ This is the app's credibility test. Present it honestly.**

**30-sec:** Seed oils (canola, soybean, sunflower, corn, cottonseed) are high in the omega-6 fat **linoleic acid**. Online they're called toxic and inflammatory. But when you look at the actual human studies — large cohorts and randomized trials — higher linoleic acid is generally linked to *lower* risk of heart disease, stroke, and type 2 diabetes, and it does **not** reliably raise inflammatory markers. The better-supported concern isn't the oil molecule itself; it's that seed oils are everywhere in **ultra-processed food**, and that oils **repeatedly heated** (deep-fryer oil) form harmful oxidation products.

**5-min deep dive — both sides:**

*The mainstream / weight-of-evidence position (Grade: Moderate–Strong):*
- Meta-analyses of prospective cohorts: highest vs lowest linoleic acid intake ≈ 15% lower coronary event risk, ~21% lower CAD-death risk (2014 meta-analysis of 13 cohorts; replicated in an 18-cohort review).
- Biomarker study across 30 cohorts / 13 countries / ~68,000 people: higher blood linoleic acid → lower cardiovascular disease and stroke; ~35% lower type-2-diabetes risk in the highest group.
- RCTs: replacing saturated fat with PUFA lowers LDL, improves glucose/insulin markers, and does **not** raise CRP/IL-6/TNF-α. Linoleic acid does not efficiently convert to arachidonic acid; omega-6 also yields anti-inflammatory lipoxins/resolvins.
- Multiple 2025–2026 reviews conclude the "seed oils are harmful" claim is "without scientific foundation."

*The dissenting / caution position (Grade: Emerging/Contested):*
- Some researchers argue very high linoleic acid may increase **oxidized linoleic acid metabolites (OXLAMs)**, affect mitochondrial function, or suppress omega-3 (EPA) status; they call for more long-term RCTs (e.g., ongoing trials NCT07287514).
- The omega-6:omega-3 ratio framing has limited mechanistic support but retains some descriptive use.

*Where both sides actually agree (Grade: Moderate–Strong — this is what the app should emphasize):*
- **Ultra-processed food** high in seed oils is genuinely worth avoiding — but because of the ultra-processing package (see NOVA topic), not proven to be the oil per se.
- **Repeatedly heated / high-temperature oxidized oils** (commercial deep fryers) produce harmful compounds. "Don't reuse frying oil; don't smoke your oils" is well supported.

**How TrueHealth handles it in-product:** flag seed oils as an **ultra-processing marker** (yellow, context: "common in ultra-processed foods"), NOT as a toxin (red). Link both sides. This is the honest, defensible position.

**Sources:** Frontiers in Nutrition 2025 (10.3389/fnut.2025.1728865); Tandfonline scoping review 2026 (10.1080/10408398.2026.2657527); *A Clinician's Guide for Trending Cardiovascular Nutritional Controversies in 2026* (PMC12914412); Johns Hopkins Bloomberg SPH explainer (2025); Marklund et al. 2019 pooled biomarker analysis.

---

## Topic 3 — Sun Exposure & Vitamin D  ·  Grade: **Strong** (mechanism), **Moderate** (optimal-dose specifics)

**30-sec:** Your skin makes vitamin D from **UVB**, which only reaches you when the sun is high enough — roughly when the **UV index is ≥ 3** and your **shadow is shorter than you are** (usually ~10am–2pm). Fair skin needs only a few minutes; darker skin (more melanin = natural sunscreen) can need 10× longer for the same vitamin D. More time doesn't mean more vitamin D — production **plateaus** and excess just risks burning.

**5-min deep dive (drives the Sun Calculator):**
- **UV index ≥ 3** is the practical threshold for meaningful UVB/vitamin-D synthesis. Below that (early morning, winter at high latitude), you make little to none.
- **Shadow rule:** if your shadow is shorter than your height, the sun angle is high enough for UVB to reach the ground.
- **Skin-type dose (Fitzpatrick), at UV ≥ 3, for vitamin D without burning:** Types I–II ≈ up to ~10 min; III–IV ≈ up to ~15 min; V–VI ≈ up to ~30 min (and may need multiples of lighter types for equal synthesis).
- **Plateau + safety valve:** UVB degrades cutaneous vitamin D precursors past a point, so synthesis self-limits — a built-in guard against toxicity. Extra time only adds burn/skin-cancer risk.
- **Age:** cutaneous D3 production declines ~13% per decade, but sun remains a meaningful source in older adults.
- **Sunscreen:** blocks UVB (and vitamin D). Common approach: brief unprotected exposure within your skin-type limit, *then* cover up / apply sunscreen — protecting sensitive areas (face, hands) while exposing larger areas (arms, legs).
- **Nuance to state honestly:** dermatology bodies emphasize skin-cancer risk and often recommend supplementation over deliberate UV exposure; the "sensible sun" camp emphasizes non-vitamin-D benefits of light. Show both.

**Calculator inputs:** live UV index (by lat/long), Fitzpatrick type, time/season (sun elevation), optional % skin exposed. Output: recommended minutes today + a hard "don't burn past X" ceiling. See [`04-DATA-SOURCES-AND-APIS.md`](04-DATA-SOURCES-AND-APIS.md) for UV APIs.

**Sources:** Examine.com "How much sun for vitamin D"; GrassrootsHealth skin-type & sun-safety guides; *Nutrients* 2020 single-bout sun-exposure study (mdpi 2072-6643/12/8/2237); Fitzpatrick/Holick vitamin-D literature.

---

## Topic 4 — Morning Light & Circadian Rhythm  ·  Grade: **Strong** (mechanism), **Moderate** (exact protocol dose)

**30-sec:** Bright light in the morning hits specialized cells in your eyes (melanopsin ipRGCs) that set your master clock (the suprachiasmatic nucleus). Morning light sharpens the natural morning cortisol rise (alertness) and starts the timer so melatonin releases earlier that night — meaning better sleep. Get outside within ~30–60 minutes of waking.

**5-min deep dive:**
- Mechanism is well-established: ipRGCs → SCN; light is the dominant "zeitgeber" (time cue). Morning light *phase-advances* the clock (earlier sleep/wake); evening light *delays* it.
- Cortisol: post-awakening bright light boosts the cortisol awakening response, most sensitively to **short-wavelength (blue) light**.
- **Honest dosing caveat:** the popular "5–10 minutes" figure is practical but the strongest controlled data used longer/brighter exposures (e.g., 30-minute pulses; a field study used 1.5h at 1000 lux and improved sleep efficiency). Small samples are common. So: the *direction* is well-supported; the *exact minimal dose* is less certain. Outdoor daylight is far brighter than indoor light, so a few minutes outside beats much longer indoors.
- Practical protocol: outside within 30–60 min of waking; no sunglasses (don't stare at the sun); on overcast days, longer; if dark on waking, use bright indoor light then get sun later. Consistency > perfection.

**Sources:** Wright/Crowley morning-bright-light phase-advance study (PMC4344919); cortisol-awakening-response light studies (PMC9116651); Huberman Lab light episodes (secondary/synthesis); St Hilaire & Khalsa phase-response-curve studies; "Morning sunlight: does Huberman's protocol work?" critical review (caveat-ai.com).

---

## Topic 5 — Protein & Amino Acids (Muscle Protein Synthesis)  ·  Grade: **Strong** (protein need), **Moderate/Contested** (strict leucine-threshold framing)

**30-sec:** Muscle is built meal-by-meal, not just by daily totals. Each meal needs enough high-quality protein to "flip the switch" on muscle protein synthesis — roughly **20–40g protein** per meal, which supplies the ~**2.5–3g of leucine** that triggers the mTORC1 pathway. Older adults need more (anabolic resistance). Animal proteins are the richest, most complete leucine sources; plant proteins need more planning.

**5-min deep dive:**
- **Essential vs non-essential:** 9 essential amino acids must come from diet; the rest your body can make. **Complete** proteins (animal, soy) contain all 9 in good ratios; most single plant sources are **incomplete** and are combined to complete them.
- **Leucine "trigger":** leucine both signals (activates mTORC1 via Sestrin2 sensing) and supplies substrate. Per-meal signaling target commonly cited as ~2–3g leucine (~25–40g quality protein). WHO daily leucine requirement (~39 mg/kg/day) is much lower — that's the *substrate* minimum, not the *signaling* optimum.
- **Ceiling per meal:** MPS response saturates; a huge single dose isn't proportionally better. Distributing protein across meals beats loading it all at once.
- **Older adults:** anabolic resistance → ~3–4g leucine (~35–40g protein) per meal; total ~1.2–1.5 g/kg/day (above the old 0.8 g/kg RDA). 2025 meta-analysis: ~3g leucine/meal improved grip strength and gait speed in older adults.
- **Honest nuance (Grade: Contested):** recent reviews (AJCN 2024, PMC11251220) argue the leucine-trigger hypothesis is *overstated* for mixed whole-food meals — in real foods, total protein and the food matrix predict MPS better than isolated leucine. So teach leucine as a **useful heuristic**, not an iron law.
- **Practical leucine anchors:** 4oz steak ≈ 3.4g; 1 cup cottage cheese ≈ 2.9g; 3oz chicken ≈ 2.4g; 4oz ground beef/pork ≈ 2.5g; 2 eggs ≈ only ~1.2g (below older-adult per-meal target).

**Sources:** AJCN 2024 perspective reconsidering leucine pre-eminence (PMC11251220 / S0002916524004581); 2025 sarcopenia/leucine reviews (JCSM e70060); older-adult protein guidance syntheses; Moore et al. dose-response MPS data.

---

## Topic 6 — Ultra-Processed Foods & the NOVA System  ·  Grade: **Moderate–Strong** (association), **Emerging** (causal mechanism specifics)

**30-sec:** NOVA sorts food by *how processed* it is, not just nutrients. Group 1 = whole/minimally processed; Group 2 = culinary ingredients (oil, salt, sugar); Group 3 = processed (bread, cheese, canned veg); **Group 4 = ultra-processed** — industrial formulations with 5+ ingredients including additives you'd never use at home (emulsifiers, colors, flavors, sweeteners). Higher ultra-processed intake tracks with more chronic disease.

**5-min deep dive:**
- The **tell** for NOVA 4: presence of "cosmetic"/industrial-only additives (flavors, colors, emulsifiers, non-sugar sweeteners, thickeners) and ingredients not found in home kitchens.
- **Emulsifiers & the gut:** emerging human/in-vitro evidence that some emulsifiers (e.g., polysorbate-80, carboxymethylcellulose, and others like SSL/PGMS) can reduce microbial diversity, cut butyrate-producers, and thin the mucus/gut barrier → low-grade inflammation. This is **emerging**, not settled, and additive-specific.
- **Why it matters:** UPF associations with obesity, metabolic syndrome, and IBD are consistent across cohorts, but disentangling *processing itself* from *nutrient profile + overeating* is ongoing (the landmark controlled-feeding work suggests UPFs drive excess calorie intake).
- **Product use:** NOVA level is a **first-class input** to the clean score — this is the single biggest correction to Yuka's nutrient-only approach.

**Sources:** *Nutrients* 2025 "Detrimental Impact of UPFs on Gut Microbiome and Gut Barrier" (mdpi 2072-6643/17/5/859); FAO UPF report; Healthy Eating Research 2026 UPF definitions technical report; *Nutrients* 2025 UPF/microbiota/IBD review (17/16/2677); Monteiro NOVA framework.

---

## Topic 7 — Food Additives & the "GRAS Loophole" (Institutional Skepticism, Done Right)  ·  Grade: **Strong** (the loophole is real), **Varies** (per-additive risk)

**30-sec:** In the US, companies can declare a new food ingredient "Generally Recognized As Safe" (GRAS) **themselves**, using their own studies, and put it in food **without telling the FDA**. That's the "self-affirmed GRAS loophole." It's real, it's legal, and 100+ chemicals entered the food supply this way. This is the legitimate, evidence-based reason not to assume "if it's on the shelf, the FDA vetted it."

**5-min deep dive:**
- The 1958 Food Additives Amendment created two paths: formal FDA review, or GRAS (meant for obvious staples like vinegar/baking soda). A 1997 voluntary-notification rule let companies *decide whether to even tell* the FDA.
- Result: most new additives now reach market via GRAS, many "secret" (FDA never notified, data unpublished). Government Accountability Office, EWG, and academics have all flagged this.
- **US vs. rest of world divergence (great in-app comparisons):**
  - **Titanium dioxide (E171):** banned in EU food (2022, genotoxicity concern); still allowed in US ≤1% by weight (FDA reviewing a petition; California banned via AB 2316).
  - **Potassium bromate:** IARC Group 2B possible carcinogen; banned in EU/UK/Canada/etc.; FDA has *asked* bakers to stop since 1991 but never banned it (California banning, effective 2027).
  - **Brominated vegetable oil (BVO):** FDA revoked authorization 2024 (compliance by Aug 2025); never approved in EU.
  - **Red Dye No. 3 (erythrosine):** FDA revoked authorization Jan 2025 (phase-out by Jan 2027); already restricted elsewhere.
  - **Red 40 / azodicarbonamide / propylparaben:** varying restrictions abroad; some state-level US bans.
- **The honest framing:** "don't blindly trust regulators" is *supported* — not as conspiracy, but because the review gap is documented and the US/EU divergence is real. Equally, "banned in Europe" ≠ automatically dangerous at real doses (precautionary principle differs). Show the mechanism, the dose, the regulatory status in multiple jurisdictions, and the evidence grade. Let users decide.

**Sources:** FDA GRAS page (fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras); EWG "Secret GRAS"; Thompson Coburn "Changing Landscape of US Food Additive Regulation (MAHA)"; Undark interview w/ Jennifer Pomeranz (NYU); Everyday Health & National Ag Law Center additive-ban trackers; plainingredients.com banned-in-EU comparison.

---

## Topic 8 — Cholesterol & Lipoproteins, Honestly  ·  Grade: **Strong** (LDL/ApoB → CVD), **Moderate** (dietary nuance)

**30-sec:** "Cholesterol" in your blood travels in particles (lipoproteins). LDL (and more precisely ApoB particle count) causally drives atherosclerosis — that's about as settled as nutrition science gets. But dietary cholesterol (eggs) affects most people's blood cholesterol far less than saturated fat and refined carbs do, and HDL/triglycerides/particle size add important context. Teach the nuance without denying the core.

**5-min deep dive:** (build from primary lipidology reviews — LDL/ApoB causality, response-to-diet variability, the limits of "dietary cholesterol = blood cholesterol," and where low-carb vs standard-diet debates are genuinely unresolved). Grade each sub-claim; flag the honest disagreements (e.g., saturated fat's role is *strong* for LDL-raising, *contested* for hard endpoints in some subgroups).

*(Content stub — populate from the cardiovascular controversies review PMC12914412 and standard lipidology sources during build.)*

---

## Topic 9 — Hormone-Support Modules  ·  Grade: **Mixed — grade each lever individually**

Cover testosterone, estrogen balance, thyroid, insulin, cortisol. For each: the well-supported lifestyle levers (sleep, resistance training, body composition, sun/light, alcohol, key micronutrients), which are **strong** vs **emerging**, and **which blood panels to request + how to read them** (e.g., total & free testosterone, SHBG, estradiol, TSH + free T3/T4 + thyroid antibodies, fasting insulin + HbA1c + HOMA-IR, AM cortisol). Persistent medical disclaimer; frame as "informed conversation with your doctor," not self-treatment.

*(Content stub — populate per-lever with graded citations during build; do not overstate supplement claims.)*
