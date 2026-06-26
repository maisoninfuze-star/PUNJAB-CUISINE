# DESIGN.md: Balky Studio → Punjabi Cuisine (layout clone)

## Source
- URL: https://www.balky.studio/
- Capture date: 2026-06-23
- Evidence: WebFetch (rendered markdown + structure). Firecrawl CLI/key unavailable in this environment, so colors/motion are inferred from structure + the user's pasted CSS and labelled as such.
- Target: `/Users/inder/Claude/Projects/p cuisine 2` (Next.js 14, App Router)

## Design Summary
Balky is a type-forward creative-studio site. Its premium feel comes from **oversized ALL-CAPS display type, prominent index numbers (01–04), airy whitespace, a centered full-bleed hero with a single huge line + "SCROLL", an indexed 2×2 work grid, a big-caps section header over an image mosaic, and a footer with a live timestamp + repeated taglines.** We clone this *layout & motion* and re-skin it to a **white / gold / black** kit on the existing dark base (black surface, near-white text, single gold accent).

## Design Tokens

### Colors (white / gold / black kit)
- Black surface: `#0A0A0A` / warm panel `#141414`
- Near-white (text / "white"): `#F5F2EC` → pure `#FFFFFF` for high-emphasis
- Gold accent (single): `#C9A84C`, light `#E8C96D`, deep `#A07830`
- Optional light section surface: warm paper `#F5F2EC` with black text (use sparingly for contrast)
- Hairlines: `rgba(255,255,255,0.10)`

### Typography
- Display: keep `Playfair Display` for editorial warmth BUT adopt balky's treatment — **oversized, often UPPERCASE, tight tracking (`-0.02em`), leading ~0.9**. Use `clamp()` up to ~12–16vw for hero.
- Eyebrows / nav / labels: `Inter`, UPPERCASE, tracked `0.2–0.35em`, small.
- Index numerals: large Playfair, gold at 40–60% opacity, brightening on hover.

### Spacing And Layout
- Airy: section padding `py-32 → py-48`. Generous gaps (`gap-16 → gap-24`).
- Container `max-w-[1320px]`, gutter `px-6 md:px-10`.
- Prefer **hairline dividers (`divide-y`) and index numbers over boxed cards.** No 3-equal-card rows.

## Components / Patterns to clone
1. **Nav** — minimal, UPPERCASE, tracked: `MENU · STORY · VISIT` + a `ORDER PICKUP` CTA + phone. Sticky, blur on scroll.
2. **Hero** — full-bleed dark video, **centered** oversized UPPERCASE headline, a thin horizontal rule, and a `SCROLL` cue. Scroll-scrubbed clip retained.
3. **Tagline beat** — one centered statement line ("Since … crafting …"), big, airy.
4. **Editorial split** — statement left (sticky), numbered hairline list right (01/02/03). (Already applied to `Experience`.)
5. **Indexed work grid** — `SIGNATURES (06)` 2-col grid; each item = big index `01–06` + image + name + price; hover reveals. CTA `VIEW FULL MENU (60+)`.
6. **Big-caps + mosaic** — full-width UPPERCASE header over a mixed-aspect image mosaic (clip reveals).
7. **Stacked list** — simple hairline-divided text list (offerings / recognition / hours).
8. **Footer** — multi-column, repeated brand taglines, **live Montréal timestamp**, ©year, socials, large enquiry CTA (`RESERVE` / `ORDER`).

## Motion
- Lenis smooth scroll (retain). Masked line reveals for headings. Clip/scale image reveals.
- View Transitions (`view-transition-name: root`) for route changes.
- Index numbers + links: gold underline wipe / brighten on hover. Footer live clock ticks each second.

## Content Style
- UPPERCASE, confident, few words. Index everything countable. Warm but spare copy.
- CTAs: `ORDER PICKUP`, `RESERVE A TABLE`, `VIEW FULL MENU`, `SEND ENQUIRY`→`hello@…`.

## Agent Build Instructions
1. Re-skin tokens: brighten `cream` → near-white `#F5F2EC`; keep black + gold. Optionally add a `paper` light surface.
2. Hero: center the headline, UPPERCASE, add horizontal rule + SCROLL; keep the scrubbed video.
3. Convert Signatures to an **indexed 2-col grid** (big 01–06 numerals).
4. Give Gallery a full-width UPPERCASE header.
5. Rebuild Footer with a live local clock + repeated taglines + big CTA.
6. Make nav + section eyebrows UPPERCASE/tracked; lean on hairlines + index numbers, not boxed cards.

## Rerun Inputs
workflow: firecrawl-website-design-clone
source_url: https://www.balky.studio/
target_stack: Next.js 14 (App Router) + Tailwind + Framer Motion + GSAP + Lenis
output: DESIGN.md
