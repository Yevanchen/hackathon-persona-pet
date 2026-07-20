# Hackathon Persona Pet

React mock for a Hackathon booth experience: seven adaptive scenario questions, one optional free-text answer, and one of eight meme-persona results.

## Run

```bash
pnpm install
pnpm dev
```

```bash
pnpm check
pnpm run deploy
```

`pnpm check` validates the 17-question decision graph and result routing, then runs TypeScript and the Cloudflare Vite production build. `pnpm run deploy` publishes the built SPA as Cloudflare Workers Static Assets.

Production targets the `WH-2099` Cloudflare account at `https://hackathon-pet.mosoo.ai`.

## Current mock boundary

- All eight personas are matched from answer signals with equal base weight; close scores prefer the least-seen result on the current device.
- Everyone starts with the same question. Internal branch IDs stay hidden while the UI always shows steps 1–8.
- The question bank is grounded in two authoring contexts: [Chinese meme translation and real Hackathon self-positioning](docs/research/persona-quiz-contexts.md).
- Soft distribution balancing is implemented as a close-score tie-breaker, but it needs backend result counts before the frontend can use it.
- Every result uses its corresponding supplied pixel-character artwork; the original SVG familiars remain decorative page assets.
- Mosoo classification, stable result URLs, QR codes, storage, and production asset downloads are not implemented.
