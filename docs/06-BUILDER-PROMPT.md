# Copy-Paste Builder Prompt

Paste this into Cursor (or any AI app builder) to scaffold TrueHealth. It references the detailed docs in this repo; if your builder can read the repo, point it here — otherwise this prompt is self-contained.

---

**PROMPT:**

Build a full-scale, production-quality mobile app called **TrueHealth** — a science-backed health-optimization app that helps users maximize healthspan (hormones, disease/sickness prevention, longevity). It must be a **daily-use tool**, not an information dump, with a stunning, fluid, attention-grabbing UI. Build every feature true to scale; do not ship a stripped-down demo.

**Stack:** React Native (Expo), Reanimated 3 (spring-physics motion), Skia (custom graphics: score rings, sun arc, aurora background), Rive/Lottie (animated tab icons), expo-camera + ML Kit text recognition (barcode + label OCR). Backend: Postgres + thin API for the ingredient-risk DB, science content, product cache, and user profiles/logs. HealthKit (iOS) / Health Connect (Android) via a unified wrapper for sleep/activity/HRV.

**Build in this exact order:**

1. **Design system "Biolume" (first).** Dark-first palette: bg `#0A0E14`, cards `#131A24`, borders white@8%; primary teal `#2DD4BF` (clean/health data); sun/circadian amber gradient `#F5A623`→`#FF6B35`; danger coral `#FF5C5C`, warning honey `#FFC554`, success mint `#4ADE80`; text `#F2F5F7`/`#8B98A5`. Fonts: Space Grotesk (headers), Inter (body), oversized numerals. Signature: a **time-of-day aurora** mesh-gradient background (Skia) that shifts hue with local time (blue night → amber sunrise → teal midday). Build the animated component library: PrimaryButton (0.96 press-scale + haptic; shimmer on main CTA only), CleanScoreRing (counts up, color morphs coral→honey→teal, haptic tick), IngredientRow (40ms staggered cascade, pop-in flag pill, accordion expand), ActivityRings (concentric, particle burst on close), SunArc (glows amber during UVB window), FloatingTabBar (pill w/ liquid indicator, animated icons), Odometer (rolling digits), ResultCard/BottomSheet (spring, detent snap), EvidenceChip (strong/moderate/emerging/contested), HypeCheckCard. Spring physics everywhere (damping ~15, stiffness ~150), 60fps, respect Reduced Motion.

2. **Ingredient Scanner (flagship).** Scan barcode or photograph a label. Resolve via **Open Food Facts API v3** (`GET https://world.openfoodfacts.org/api/v3/product/{barcode}?fields=product_name,brands,ingredients_text,nova_group,nutriments,additives_tags`; send a unique User-Agent; attribute OFF per OdBL), enrich nutrients with **USDA FoodData Central**, fall back to **on-device OCR** of the ingredient list. Compute a **transparent, dose- and evidence-aware 0–100 clean score** where **NOVA processing level is the biggest lever** — do NOT copy Yuka's binary "one red additive caps the score" rule, and do NOT penalize natural fat/sugar in whole foods. Show per-ingredient red/yellow/green flags, each with "what it is," "what it does in your body," an evidence-strength grade, US-vs-EU regulatory status, and a citation. Always render a **"Why this score" breakdown**. Suggest 2–3 cleaner swaps.

3. **Home** — aurora background, three ActivityRings (Sun / Protein / Clean-eating), today's sun window (SunArc), quick-scan FAB, "today" cards.

4. **Daily Protocol Engine** — personalized from onboarding profile (age, sex, location, Fitzpatrick skin type, goals) + live data. Sun calculator: recommended unprotected-sun minutes today from a **UV index API** (currentuvindex.com, keyless) combined with **solar-elevation** (only UVB makes vitamin D; enforce UV≥3 and shadow-shorter-than-height), with a "don't burn" ceiling by skin type. Morning-light/circadian guidance. Protein & amino-acid targets (g/kg + per-meal leucine ~2.5–3g / 20–40g protein) with built-in education. Sleep/movement tracking. Hormone-support modules (testosterone, estrogen, thyroid, insulin, cortisol) with graded lifestyle levers + which blood panels to request.

5. **Real Food Finder** — dark custom map. Farmers markets/farms/CSAs (seed from USDA Local Food Directories), pastured eggs, grass-fed beef, wild-caught fish, clean grocers, and **raw-milk sources with state-by-state legality tier** (retail/on-farm/herd-share/pet-food/illegal) plus an honest benefit-vs-pathogen-risk panel (federal law bans interstate raw-milk sale; drinking is legal everywhere). Community reviews + verification badges. Pins spring-drop; tap → BottomSheet.

6. **Learn Hub + Health News/Trends Feed** — layered explainers (30-sec → 5-min → citations) on fructose vs glucose, seed oils/linoleic acid, amino acids & MPS, insulin resistance, circadian biology, cholesterol (honest), ultra-processed foods/NOVA, vitamin D, and the GRAS loophole. News feed: curated studies/recalls/regulatory changes (PubMed E-utilities, openFDA recalls), each with a **Hype Check** (headline vs. what the study actually showed vs. evidence grade). Pull-to-refresh = sun rising over horizon.

7. **Food & Symptom Log** — fast capture (scan/photo/voice); daily check-ins (energy, sleep, digestion, skin, mood); surface **personal correlations** over time (labeled correlational, not medical).

**Science & trust standards (non-negotiable, appear throughout):**
- Every health claim carries an **evidence grade** (strong/moderate/emerging/contested) and a **primary citation** (name the study type + sample size).
- On **contested** topics, show mainstream (CDC/FDA/USDA) guidance AND newer/dissenting research **side-by-side** with each side's evidence. Never blindly defer to institutions; never blindly contradict them.
- **Be honest even when it's inconvenient:** the current weight of published evidence finds seed oils / linoleic acid neutral-to-beneficial for cardiometabolic health. So flag seed oils as an **ultra-processing marker (yellow, context note)**, NOT as a toxin (not red), and separately flag **repeatedly-heated/oxidized frying oils** (well-supported concern). This honesty is what makes the app credible and app-store-safe.
- Dose and context matter; no fear-mongering; rank risks by real effect size.
- Persistent "educational, not medical advice" disclaimer; extra care on hormone/blood-panel and raw-milk content.

**Monetization/retention:** free tier = limited daily scans + basic protocol; onboarding paywall with trial → push **annual "TrueHealth Pro"** (unlimited scans, full protocol engine, correlations, offline history, blood-panel guides). Streaks are celebratory, never guilt-based. Onboarding completes in ≤90 seconds.

Start now by scaffolding the Expo project, the Biolume design-system component library, the ingredient-risk database schema, and the scanner flow end-to-end.

---

*Full detail for each section lives in the sibling docs (`00`–`05`, `07`). Have the builder read them if it can access the repo.*
