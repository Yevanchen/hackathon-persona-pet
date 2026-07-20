# AGENTS.md

Guide for AI agents working in this repo. Product context lives in `context.md`; read it before changing product behavior.

## Project

React 19 + Vite SPA deployed as Cloudflare Workers Static Assets. A no-login hackathon booth quiz: seven adaptive scenario questions + one optional free-text answer → one of eight equally weighted meme-persona results (local signal scoring for now; Mosoo classification later).

- `src/App.tsx` — all screens (intro → quiz → hatching → result)
- `src/personas.ts` — persona data + draw routing (`pnpm check:routing` guards the boundary)
- `src/styles.css` — the entire design system: neo-brutalist print/paper aesthetic (oklch palette, hard 2px ink borders, offset solid shadows, rotated stamps). No CSS framework; keep it that way.

## Commands

```bash
pnpm dev          # local dev
pnpm check        # routing check + tsc + production build — run before committing
pnpm run deploy   # production deploy (WH-2099 account, hackathon-pet.mosoo.ai)
```

## Motion / interaction conventions

Animations use the [motion](https://motion.dev) library via `LazyMotion features={domAnimation} strict` + `m.*` components (never `motion.*` — keeps the bundle on the small feature set), plus the CSS custom properties already in `styles.css` (`--ease-out`). House rules, distilled from the skills below:

- Motion personality is **print-shop physics**: elements are paper (small hard slides) or rubber stamps (one crisp punch, no residual wobble).
- One shared ease everywhere: `[0.16, 1, 0.3, 1]` (= CSS `--ease-out`). UI animations stay **under 300ms**; press feedback 100–160ms; never `ease-in`.
- **Exactly one spring in the app** — the pet reveal on the result screen (`{ type: "spring", duration: 0.5, bounce: 0.2 }`). Do not add a second spring or any bounce elsewhere.
- Animate `transform` and `opacity` only. Enter from `scale(0.9–0.97)` + fade, never `scale(0)`. Hard shadows stay hard; static rotations (brand mark, poster, stamps) are load-bearing — never let a Motion transform clobber them.
- The **delight budget** lives at rare moments only (the result reveal). High-frequency interactions get near-imperceptible motion or none; selection feedback is a 180ms stamp punch on the index box, not a spring.
- Respect `prefers-reduced-motion`: the app wraps in `MotionConfig reducedMotion="user"` (strips JS transforms, keeps opacity); the CSS reduce block at the bottom of `styles.css` covers all CSS animations.

## Skills index (`.agents/skills/`)

Installed via `npx skills add`; sources pinned in `skills-lock.json`. Organized by role in the design workflow:

### Core workflow — use these in order

| Skill | Source | Role |
| --- | --- | --- |
| `design-taste-frontend` | Leonxlnx/taste-skill | **Tone-setter.** Brainstorm and lock the theme/visual direction before any redesign or new surface. Anti-slop frontend taste; run it first. |
| `find-animation-opportunities` | emilkowalski/skills | **Scanner.** Read-only sweep for places that should (and should NOT) animate, with exact motion recipes. Run before adding any animation. |
| `emil-design-eng` | emilkowalski/skills | **Animation philosophy.** Emil Kowalski's rules for durations, easing, springs, and restraint. The implementation reference while writing motion code; pair with [transitions.dev](https://transitions.dev) for subtle transition patterns. |
| `brand` | nextlevelbuilder/ui-ux-pro-max-skill | **Brand guardian.** Keeps interaction/visual work coherent with the brand identity. |
| `impeccable` | pbakaus/impeccable | **Anti AI-slop gate.** Final veto pass: kills gratuitous motion, generic patterns, and over-animation before shipping. |

### Auxiliary (installed with Leonxlnx/taste-skill bundle)

| Skill | Role |
| --- | --- |
| `design-taste-frontend-v1` | Preserved v1 of the tone-setter, for reproducing its exact behavior. |
| `redesign-existing-projects` | Structured audit + upgrade path for existing UI without breaking function. |
| `high-end-visual-design` | Agency-grade defaults: fonts, spacing, shadows, card structure. |
| `minimalist-ui` | Clean editorial style preset. |
| `industrial-brutalist-ui` | Swiss/terminal brutalist preset — closest to this repo's aesthetic. |
| `gpt-taste` | GSAP-oriented motion/layout variance taste. |
| `brandkit` | Brand-guidelines board / logo-system image generation. |
| `image-to-code` | Design-image-first workflow for visually critical builds. |
| `imagegen-frontend-web` / `imagegen-frontend-mobile` | Premium design-reference image generation (web / mobile). |
| `stitch-design-taste` | Generates DESIGN.md system files (Google Stitch). |
| `full-output-enforcement` | Bans truncation/placeholder output on large generations. |
