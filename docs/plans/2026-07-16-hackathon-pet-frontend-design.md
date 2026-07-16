# Hackathon Persona Pet Frontend — Design

## Goal

Build a booth-ready React mock that lets a visitor complete six scenario questions and one optional free-text answer, then receive one of eight regular Hackathon personas or the 4% `Shitter` easter egg. The mock proves the interaction and Pet presentation before Mosoo, persistence, and production asset work.

## Audience and tone

The audience is technology-interested visitors aged roughly 16–26 at a Hackathon booth. The interface should feel like an anime-adjacent RPG recruitment dossier crossed with an event credential: energetic, collectible, and confident without relying on generic dark-neon “hacker” styling.

Use a warm paper base, cobalt ink, safety orange, sharp dividers, oversized bilingual role names, and restrained stamp-like motion. The memorable moment is the result opening like a classified character file.

## Scope

- Welcome screen with a clear 60–90 second promise and no-login message.
- Six progressive single-choice questions.
- One optional free-text prompt, limited to 80 Chinese characters.
- Short hatching transition.
- Result screen with bilingual persona name, description, strengths, warning, session UUID, and restart action.
- Exact mock distribution: `Shitter` 4%; each regular persona 12%.
- Real Jiahao spritesheet preview; coherent CSS silhouettes for the other eight results.
- Responsive and keyboard-accessible from 360px mobile through booth laptop displays.

Not included: Mosoo calls, authentication, database storage, stable shared result URLs, QR codes, analytics, or downloadable packages for personas without approved assets.

## Architecture

Use React + TypeScript + Vite with the official Cloudflare Vite plugin and Workers Static Assets. Keep one top-level application state with three screens: intro, quiz, and result. Persona and question content live in plain TypeScript data. No router, state library, component library, or backend Worker is needed for this mock.

Cloudflare's Vite plugin builds and deploys the SPA as Worker static assets. A Worker API can be added later when Mosoo and result persistence become real requirements.

## Interaction and data flow

1. Start creates an in-memory answer set.
2. Each question requires one selection before advancing; answers can be changed by going back.
3. Free text is optional and capped at 80 characters.
4. Submission creates a native `crypto.randomUUID()` and draws with `crypto.getRandomValues()`.
5. Values below `0.04` map to Shitter. The remaining range is divided into eight equal `0.12` buckets.
6. The result remains stable until the visitor explicitly starts over.

The mock intentionally ignores answer semantics. The UI labels the result as a prototype draw so it does not imply that a classifier ran.

## Accessibility and failure behavior

Use semantic headings, fieldsets, legends, radio inputs, visible focus rings, 44px minimum touch targets, and `aria-live` for validation/result status. Respect reduced-motion preferences. The only expected input error is advancing without choosing an answer; keep the current screen and show a specific inline message.

The Jiahao ZIP is not fetched or unpacked in the browser. A checked-in preview copy of its spritesheet is used for display, while the original ZIP remains unchanged in the candidate-assets folder.

## Verification

- Unit check for routing boundaries and representative draws.
- TypeScript build.
- Production Vite build through the Cloudflare plugin.
- Local browser smoke at mobile and desktop sizes, including keyboard flow and reduced motion.

## Platform reference

- [Cloudflare React + Vite guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/)
- [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)

