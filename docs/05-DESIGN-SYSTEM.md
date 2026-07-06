# Design System — "Biolume"

The UI is the retention moat. Everything animates with spring physics; nothing snaps. Build this component library **first** so all six features feel like one cohesive, alive app.

## 1. Color palette — "Biolume"

Dark-first, biological, premium. Teal owns "clean/health data," amber owns "sun/energy/circadian."

```
# Surfaces
bg.base        #0A0E14   deep space black (navy undertone)
bg.elevated    #131A24   card charcoal
border.subtle  rgba(255,255,255,0.08)  1px translucent card border

# Accents
teal.primary   #2DD4BF   clean scores, progress rings, active/selected
amber.start    #F5A623   sun / circadian / streaks (gradient start)
amber.end      #FF6B35   sun / energy (gradient end)

# Semantic
danger.coral   #FF5C5C   red flags
warning.honey  #FFC554   yellow flags / "fair"
success.mint   #4ADE80   green flags / "good"

# Text
text.primary   #F2F5F7   off-white
text.secondary #8B98A5   cool gray
```

**Signature element — time-of-day aurora:** an animated gradient-mesh background on Home that slowly shifts hue with the user's local time and circadian guidance: cool blue at night → warm amber near sunrise → bright teal midday → amber again at sunset. Render with **Skia** (animated shader/mesh gradient). This is the "app feels alive the moment it opens" moment.

## 2. Typography

- **Headers:** Space Grotesk (geometric, confident).
- **Body:** Inter.
- **Numerals:** oversized for scores/stats (score ring center, protein grams, streak counts).
- Scale (suggested): display 40 / h1 30 / h2 24 / h3 20 / body 16 / caption 13.

## 3. Motion principles

- **Spring physics everywhere** (Reanimated 3): approx `damping 15, stiffness 150`. Never linear easing for entrances/transitions.
- **60fps minimum**; use the native driver / Reanimated worklets. Custom graphics (rings, arcs, aurora) via **Skia**; animated icons via **Rive/Lottie**.
- **Haptics** on meaningful moments: button press, score-ring settle, ring-close.
- **Respect Reduced Motion**: provide graceful crossfade fallbacks; never block core function on animation.

## 4. Component library (build these first)

| Component | Behavior |
|---|---|
| **PrimaryButton** | Scale to 0.96 on press + haptic; idle gradient shimmer **on the main CTA only** (not every button). |
| **CleanScoreRing** | Circular progress; counts up on reveal; color morphs coral→honey→teal as it fills; haptic tick at final value; center shows big numeral + band label. |
| **IngredientRow** | Staggered entrance (40ms cascade); flag pill scale-pops; tap → fluid accordion expand with crossfading detail text. |
| **ActivityRings** | Apple-Watch-style concentric rings (Sun / Protein / Clean-eating); animated gradient fill; **particle burst** when a ring closes. |
| **SunArc** | Live sun traversing a horizon line; arc **glows amber during the UVB/vitamin-D window**; marks solar noon. |
| **AuroraBackground** | Skia mesh gradient; hue driven by local time; very slow drift. |
| **FloatingTabBar** | Pill-shaped; **liquid indicator** morphs between tabs; Rive/Lottie icons play a micro-animation on select. |
| **Odometer** | Rolling-digit animation for any changing number (scores, streaks, grams). |
| **ResultCard / BottomSheet** | Spring slide-up; detent snap points; shared-element expansion from the triggering control. |
| **HypeCheckCard** | News item with headline / what-it-showed / evidence-grade chip / bottom-line. |
| **EvidenceChip** | Small pill: strong (teal) / moderate (mint) / emerging (honey) / contested (gray-outline). Used everywhere claims appear. |

## 5. Signature animated flows

- **Scanner:** scan button → camera **shared-element expansion**; teal **laser-line sweep** over barcode; on success, ResultCard springs up; CleanScoreRing counts up + haptic; IngredientRows cascade in.
- **Home:** AuroraBackground live; three ActivityRings; SunArc showing today's window; quick-scan FAB.
- **Map (Find):** custom dark map style; pins **spring-drop** and pulse; tap → BottomSheet detent snap.
- **Feed:** cards **parallax** on scroll; **pull-to-refresh = sun rising over a horizon**.
- **Onboarding:** full-screen animated sequence, fluid page transitions, animated illustrations, progress dots; completable in **≤ 90 seconds**.

## 6. Accessibility

- Reduced-motion fallbacks (crossfades).
- Color is never the only signal — flags pair color with icon + label (colorblind-safe).
- Minimum contrast AA on text over surfaces; dynamic type support.
- Dark mode is default/primary; optional light mode later.
