# Hackathon Persona Pet — Product Context

> Status: living design context  
> Updated: 2026-07-16  
> Audience: Hackathon booth visitors, primarily tech-interested people aged 16–26

## Product thesis

A no-login web experience that turns a short set of Hackathon scenario answers into a role-playing-style Hackathon persona and a matching Codex Pet.

Mosoo is the classification runtime. It judges which persona best matches the input; it does not generate pets, own sessions, package assets, or render results.

## Current priority: prove the asset-to-Mock loop

The immediate milestone is not the production classifier. It is a complete visual prototype using nine coherent Pet concepts:

1. **Reference discovery:** coarse-filter Petdex and Awesome Codex Pet for friendly, appealing style references that fit the nine professions.
2. **Static identity art:** remix the selected visual language into nine original or explicitly authorized base Pet images.
3. **Pet production:** run each approved base image through the Codex Pet pipeline to produce nine installable packages.
4. **Frontend Mock:** present the questionnaire and optional free text, then assign a Pet without Mosoo so the end-to-end interaction can be tested first.

For the Mock, reuse the already-approved distribution as a weighted random router: `Shitter` 4%; each regular Pet 12%. This is temporary. Production replaces random regular routing with Mosoo input matching while retaining the 4% Shitter override.

### Reference filtering rules

The source galleries are inspiration libraries, not an asset allowlist. A reference may inform silhouette, palette, material, proportion, or prop language without being copied as a character.

Keep references that are:

- compact, whole-body, and readable at 192×208;
- cute, friendly, rounded, and approachable;
- visually coherent with a shared chibi or mascot family;
- simple enough to animate consistently across nine states;
- distinct through color, silhouette, costume, or one stable prop;
- suitable for a technology-interested, anime-friendly 16–26 audience.

Reject references with:

- exposed brains, organs, wounds, gore, body horror, or medical imagery;
- realistic insects, parasites, teeth, flesh, or uncanny human faces;
- grotesque, threatening, sexualized, or deliberately repulsive presentation;
- excessive micro-detail, scenery, text, logos, detached effects, or props that will not survive at Pet scale;
- a rendering style that is an obvious outlier from the chosen family;
- recognizable third-party character identity that cannot be safely abstracted during remix.

The first shortlist should contain roughly 3–5 references per persona. It is intentionally coarse: the goal is to choose a coherent visual family and useful design cues before generating original base art.

### Popularity as a reference weight

Popularity is a primary coarse-ranking signal because it approximates how much visitors like an IP or visual form. For Petdex, use install count first, then likes and ZIP downloads as supporting signals.

Popularity is not a safety or originality gate. A famous third-party character may be popular because of the underlying IP rather than the Pet design. Therefore:

1. apply friendliness and disgust/uncanny exclusions first;
2. rank the remaining pool heavily by popularity;
3. separate **global style anchors** from **persona-specific semantic references**;
4. treat recognizable-IP popularity as evidence about shape, color, and emotional appeal only;
5. remix into a new identity instead of preserving recognizable character features.

The shortlist does not need equal popularity per persona. A small set of highly popular, cohesive style anchors should govern all nine Pets; lower-popularity references may contribute only a profession cue, prop, or silhouette.

## Locked decisions

- No registration or login.
- Nine personas: eight input-driven roles plus one 4% random easter egg.
- English persona names are one word. Chinese names remain descriptive RPG-style professions.
- The eight regular roles are classified primarily from user input.
- `Shitter / 捣乱者` is independent of input and has a fixed 4% chance per new session.
- The other eight roles each have a target weight of about 12% of all results, but this is a balancing prior, not a hard quota.
- Pets are made in-house or created from explicitly authorized Remix sources. Petdex and Awesome Codex Pet are references, not the production asset pool.
- MVP pet packages use the Codex v1 package profile: `pet.json` plus `spritesheet.webp`, 8×9 atlas, 192×208 per cell, 1536×1872 total.
- Each persona has one prebuilt Pet ZIP. ZIPs are not generated per user.
- A successful result receives a stable UUID URL and QR code. Revisiting it does not rerun classification.

## Persona roster

| ID | English | 中文 | Team behavior | Target share |
|---|---|---|---|---:|
| `tactician` | Tactician | 蓝图策士 | Narrows the goal, maps the route, and protects delivery rhythm | ~12% |
| `artificer` | Artificer | 技栈奇械师 | Independently builds the backend, model, hardware, or core system | ~12% |
| `cartographer` | Cartographer | 体验绘界师 | Works backward from user journeys and judging goals | ~12% |
| `weaver` | Weaver | 像素织师 | Turns rough capability into a clear, usable, polished interface | ~12% |
| `warden` | Warden | 热修守望者 | Connects modules, fills gaps, and protects the final submission | ~12% |
| `ranger` | Ranger | 故障巡猎者 | Tracks anomalies, finds root causes, and clears hidden failures | ~12% |
| `jiahao` | Jiahao | 嘉豪 | Treats every demo like a main stage: visibly expressive, immersive, and unafraid to perform | ~12% |
| `alchemist` | Alchemist | 灵感炼金师 | Combines new APIs, AI, and hardware into fast experiments | ~12% |
| `shitter` | Shitter | 捣乱者 | Rare chaos-class easter egg, not an evaluation of the answers | 4% |

The eight regular targets total 96%. Conditional on not hitting Shitter, their neutral prior is 12.5% each.

## Classification and distribution algorithm

1. On first submission, the backend creates a UUID and an idempotent result attempt.
2. The backend performs one server-side random draw for that UUID.
3. If the draw lands in the 4% bucket, assign `shitter`, skip Mosoo, persist the result, and return it.
4. Otherwise, send the normalized answers to the published Mosoo Agent.
5. Mosoo scores or ranks only the eight regular persona IDs. It must not return `shitter`.
6. A clear top match wins. When the leading candidates are close, the backend may prefer an underrepresented candidate using the current result histogram.
7. The histogram is a soft tie-breaker only. It must not replace a strong input match or enforce exact quotas.
8. Persist the final `personalityId`, `petId`, classification version, and timestamp against the UUID.
9. Refreshes, QR visits, retries after success, and ZIP downloads read the persisted result and never draw again.

The exact definition of “close candidates” remains a calibration setting. Start with a small fixed threshold and tune it from test responses; do not add a quota optimizer unless observed distribution makes it necessary.

## Shitter presentation rule

`Shitter` is deliberately vulgar, but the result must read as a rare, playful chaos class rather than an insult or a claim that the user is incompetent. The Chinese name remains the softer `捣乱者`. Its result copy and Pet should celebrate unpredictable energy and accidental comedy without encouraging harassment or sabotage.

## Jiahao presentation rule

`Jiahao / 嘉豪` replaces `Bard / 路演吟游者` as one of the eight regular personas. The current Chinese internet meme describes a campus-style, black-hooded performer who wants to be noticed, looks deliberately cool, and is sincere even when the performance feels slightly overdone. Its positive Hackathon translation is someone who turns a demo into a stage, commits fully, and resists bland sameness.

The result must be affectionate and self-aware, not a label for incompetence or a real person's name. Avoid copy such as “装懂”, “实力不够”, “班级小丑”, or claims that all people named 嘉豪 share this trait. Do not reproduce Alan Walker branding, logos, or a real minor's face. Safe visual cues are an unbranded black oversized hoodie, generic face mask, neon waveform, and an air-DJ gesture.

## Agent boundary

Mosoo owns:

- interpreting the questionnaire input;
- scoring or ranking the eight regular personas;
- returning a strict, allowlisted classification response.

The application owns:

- the 4% Shitter draw;
- histogram-based tie-breaking;
- UUID/session persistence and idempotency;
- persona-to-Pet mapping;
- asset preview, ZIP download, result URL, and QR code;
- validating Agent output and handling retries.

No Mosoo token may be exposed in browser code. The web backend calls the published Agent through the Mosoo Thread API.

## Working experience flow

This flow is directionally agreed but the exact copy is still open:

1. Landing page promises a roughly 60–90 second, no-login experience.
2. Six progressive Hackathon scenario cards cover starting direction, role ownership, technical/product trade-offs, helping a blocked teammate, late-night failure, and the final demo.
3. One optional free-text prompt: “凌晨 3 点，队伍最希望你还在做什么？” Suggested limit: 80 Chinese characters.
4. Submission enters a short Pet-hatching transition while routing runs.
5. The result page shows the bilingual role, role statement, team strengths, overload warning, complementary teammate, animated Pet, ZIP download, stable URL, and QR code.
6. A failed classification keeps the answers and offers retry. It never assigns a random regular persona as fallback.

## Asset contract

Each production Pet is an allowlisted, versioned package:

```text
pets/<pet-id>/
├── pet.json
└── spritesheet.webp
```

Each downloadable ZIP contains the installable package plus any required attribution outside the Pet folder. Track source, creator, license or Remix permission, source commit, asset hash, persona ID, and takedown/replacement status in a separate asset manifest.

The wider ecosystem now contains both 8×9 v1 and 8×11 v2 packages. This project intentionally locks MVP output to v1 for one rendering and download contract; it should not silently crop v2 assets.

### Candidate asset: Jiahao

The user-provided ZIP is archived unchanged at `assets/candidate-pets/jiahao/jiahao.zip`. It contains `pet.json` and a Codex v1 `spritesheet.webp`, and is a direct visual candidate for the Jiahao persona; no remix is required for candidate testing. SHA-256: `ca4529e033e3eccd178a73da5ecdc77cfd93b21d676fa7c5eb6bacf1df1094f4`.

The package is safe to retain and preview: both ZIP members pass CRC, paths are clean, atlas geometry is 1536×1872, and all 57 used / 15 empty v1 cells are in the expected positions. The current atlas carries non-zero hidden RGB under fully transparent pixels, so the strict Hatch Pet validator will reject it. If promoted from candidate to release, normalize those transparent pixels and repackage without changing the visible design; this is cleanup, not a remix.

The package matches the Petdex entry [Jiahao（嘉豪）](https://petdex.dev/pets/jiahao), submitted by `quantai1314`. Candidate status does not imply production rights clearance; creator permission or the asset's specific reuse license must be recorded before public distribution.

## Minimal persisted result

```text
id                  UUID, public result identifier
personality_id      one of the nine allowlisted IDs
pet_id              selected prebuilt Pet
classification_ver questionnaire/prompt/routing version
created_at          result creation timestamp
```

Raw free text and full Mosoo transcripts are not required to reconstruct a result. Their retention policy must be decided before launch.

## Research basis

The role system is based on observed Hackathon team behaviors rather than technology stacks. Recurring signals in North American posts and guides are ownership, reliability, shipping, staying engaged under pressure, integration, and demo storytelling.

- [MLH: What makes a winning Hackathon team](https://blog.mlh.com/what-makes-a-winning-hackathon-team-not-what-you-think-07-07-2015)
- [Devpost: How to present a successful Hackathon demo](https://info.devpost.com/blog/how-to-present-a-successful-hackathon-demo)
- [Devpost: Submission and judging criteria](https://info.devpost.com/blog/understanding-hackathon-submission-and-judging-criteria)
- [Georgia Tech HackerHouse](https://www.gthackerhouse.com/)
- [Reddit Hackathon teammate sample](https://www.reddit.com/r/hackathon/comments/1t7w04o/looking_for_teammates/)
- [Petdex](https://github.com/crafter-station/petdex)
- [Awesome Codex Pet](https://github.com/legeling/awesome-codex-pet)
- [36Kr / New Weekly: the Jiahao meme and its overuse](https://www.36kr.com/p/3818712744805511)
- [Tencent Zhizhu: Jiahao as a sincere search for recognition](https://news.qq.com/rain/a/20250913A09ZUE00)
- [Bilibili: Alan Walker searches for the campus performer](https://www.bilibili.com/video/BV1SX1FYiEpi/)
- [Guangzhou Daily: risk of the label becoming verbal bullying](https://news.dayoo.com/guangzhou/202605/25/153828_54963379.htm)

## Current implementation note

Mosoo CLI `v0.1.2` is installed. On 2026-07-16, `mosoo doctor --json` resolved the local target at `http://127.0.0.1:8787` but reported the API as unreachable because the local service was not running. Runtime target and credentials must be resolved before integration work.

The first frontend Mock is implemented in React + TypeScript + Vite using the official Cloudflare Vite plugin and Workers Static Assets. It includes the intro, six scenario questions, optional free text, hatching transition, weighted 8+1 result, responsive layout, Jiahao spritesheet preview, and CSS placeholders for the remaining Pets. The Mock explicitly labels routing as random; Mosoo is not called yet.

## Open decisions

- Final six questions and answer choices.
- Detailed result copy, complementary-role pairs, and overload warnings.
- Visual brief and animation personality for each of the nine Pets.
- Mosoo response schema and the initial “close candidate” threshold.
- Data retention, abuse controls, result lifetime, and deletion policy.
- Hosting, database, object storage, analytics, and event-day operations.
