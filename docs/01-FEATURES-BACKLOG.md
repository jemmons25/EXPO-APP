# Features Backlog

The six core features live in [`00-MASTER-SPEC.md`](00-MASTER-SPEC.md) §2. This file captures the **full** researched feature set: core, researched additions that make the app a *tool* (not an info dump), and later nice-to-haves. Prioritized.

## P0 — Core (MVP)
- [ ] **Ingredient Scanner** — barcode + label OCR → transparent clean score → per-ingredient flags → cleaner swaps
- [ ] **Daily Protocol Engine** — sun minutes, morning light, protein/amino targets, sleep/movement
- [ ] **Home** — aurora background, 3 activity rings, today's sun window, quick-scan FAB
- [ ] **Learn Hub** — layered explainers from [`02-SCIENCE-CONTENT.md`](02-SCIENCE-CONTENT.md)
- [ ] Onboarding (≤90s) building the personalization profile
- [ ] Evidence-grading system surfaced everywhere (chips)

## P1 — Makes it a tool, not an encyclopedia
- [ ] **Real Food Finder** map (markets, farms, CSAs, raw-milk w/ state legality, pastured/grass-fed/wild-caught, clean grocers)
- [ ] **Food & Symptom Log** + personal correlation engine
- [ ] **Health News & Trends Feed** with Hype-Check badges
- [ ] Hormone-support modules + **blood-panel request/interpretation guides**
- [ ] Wearable sync (HealthKit / Health Connect) → sleep/activity/HRV into rings & correlations
- [ ] Streaks (Sun / Protein / Clean-eating) — celebratory, never guilt-based
- [ ] Offline scan history & cached protocols

## P2 — Researched additions (differentiators)
- [ ] **"Why this score" transparency panel** on every scan (direct answer to Yuka's opacity)
- [ ] **US-vs-EU regulatory comparison** card per flagged additive (the honest institutional-skepticism feature)
- [ ] **Portion & frequency awareness** — score in the context of how much/how often (fixes Yuka's per-100g isolation)
- [ ] **Grocery-run mode** — batch scan a cart; get a basket-level summary + swaps
- [ ] **Shopping list → clean-swap builder** integrated with Real Food Finder stock
- [ ] **Seasonal/local produce guide** by user location
- [ ] **Water quality / microplastics** topic + filter guidance (followable trend topic)
- [ ] **Sauna / cold exposure** protocol module (graded evidence)
- [ ] **Supplement checker** — scan supplement labels; flag fillers, dosing vs evidence
- [ ] **Restaurant / menu guidance** (oxidized frying oils, UPF markers when eating out)
- [ ] **Community verification** for food sources (badges + moderation)

## P3 — Later / advanced
- [ ] AI protocol adaptation (sticky value, not novelty chat — mind the 30% faster-churn AI caveat)
- [ ] Lab-result upload & trend tracking (blood panels over time)
- [ ] Family/household profiles
- [ ] Barcode contribution back to Open Food Facts (OdBL good-citizenship)
- [ ] Apple Watch / Wear OS companion (sun-window nudge on wrist)
- [ ] Widgets (today's sun window, protein remaining, streak)

## Guardrails that ride along with every feature
- Every health claim → evidence grade + primary citation.
- Contested topics → both sides shown (incl. seed oils, aspartame, titanium dioxide).
- Dose/context aware; no fear-mongering.
- Persistent "educational, not medical advice" disclaimer; extra care on hormone/blood-panel and raw-milk content.
