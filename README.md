# Hackathon Persona Pet

React mock for a Hackathon booth experience: six scenario questions, one optional free-text answer, and an 8+1 Codex Pet result.

## Run

```bash
pnpm install
pnpm dev
```

```bash
pnpm check
pnpm deploy
```

`pnpm check` runs the routing boundary check, TypeScript, and the Cloudflare Vite production build. `pnpm deploy` publishes the built SPA as Cloudflare Workers Static Assets.

Production targets the `WH-2099` Cloudflare account at `https://hackathon-pet.mosoo.ai`.

## Current mock boundary

- `Shitter` receives 4%; each regular persona receives 12%.
- Answers are collected but intentionally do not affect the mock draw yet.
- Jiahao uses the supplied candidate spritesheet. Other personas use visual placeholders.
- Mosoo classification, stable result URLs, QR codes, storage, and production asset downloads are not implemented.
