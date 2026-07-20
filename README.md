# Hackathon Persona Pet

React prototype for a Hackathon booth experience: eight scored scenario questions produce one of eight Codex Pet personas.

## Run

```bash
pnpm install
pnpm dev
```

```bash
pnpm check
pnpm run deploy
```

`pnpm check` runs the questionnaire boundary check, TypeScript, and the Cloudflare Vite production build. `pnpm run deploy` publishes the built SPA as Cloudflare Workers Static Assets.

Production targets the `WH-2099` Cloudflare account at `https://hackathon-pet.mosoo.ai`.

## Current prototype boundary

- The questionnaire contains exactly eight questions. Each question may have a different number of choices, with a minimum of two.
- Every choice scores all eight personas. The highest accumulated score wins; ties use canonical persona order.
- [`src/questionnaire.json`](src/questionnaire.json) is the single editable source for all question text, choice text, weights, and questionnaire version.
- Question copy, choice copy, and score matrices remain draft configuration.
- Persona meanings and scoring boundaries are documented in [`docs/personas.md`](docs/personas.md).
- Jiahao uses the supplied candidate spritesheet. Other personas use visual placeholders.
- Stable result URLs, QR codes, storage, and production asset downloads are not implemented.
