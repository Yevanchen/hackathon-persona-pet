# Hackathon Persona Pet — Product Context

> Status: living design context  
> Updated: 2026-07-20
> Audience: Hackathon booth visitors, primarily tech-interested people aged 16–26

## Product thesis

A no-login web experience that turns a short set of Hackathon scenario answers into a role-playing-style Hackathon persona and a matching Codex Pet.

Mosoo is the classification runtime. It judges which persona best matches the input; it does not generate pets, own sessions, package assets, or render results.

## Current priority: prove the asset-to-Mock loop

The immediate milestone is not the production classifier. It is a complete visual prototype using eight coherent Pet concepts:

1. **Reference discovery:** coarse-filter Petdex and Awesome Codex Pet for friendly, appealing style references that fit the eight personas.
2. **Static identity art:** remix the selected visual language into eight original or explicitly authorized base Pet images.
3. **Pet production:** run each approved base image through the Codex Pet pipeline to produce eight installable packages.
4. **Frontend Mock:** present the questionnaire and optional free text, then assign a Pet without Mosoo so the end-to-end interaction can be tested first.

For the Mock, match all eight personas from answer signals with equal base weight. Close scores prefer the least-seen result in the local device histogram; production replaces that local histogram with persisted aggregate counts.

### Reference filtering rules

The source galleries are inspiration libraries, not an asset allowlist. A reference may inform silhouette, palette, material, proportion, or prop language without being copied as a character.

Keep references that are:

- compact, whole-body, and readable at 192×208;
- cute, friendly, rounded, and approachable;
- visually coherent with a shared chibi or mascot family;
- simple enough to animate consistently across eight states;
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

The shortlist does not need equal popularity per persona. A small set of highly popular, cohesive style anchors should govern all eight Pets; lower-popularity references may contribute only a profession cue, prop, or silhouette.

## Locked decisions

- No registration or login.
- Exactly eight input-driven meme personas; there is no ninth class or random override.
- All eight personas have an equal 12.5% distribution target, used only as a soft balancing prior.
- A clear answer match always wins; recent result counts may decide only among close candidates.
- Pets are made in-house or created from explicitly authorized Remix sources. Petdex and Awesome Codex Pet are references, not the production asset pool.
- MVP pet packages use the Codex v1 package profile: `pet.json` plus `spritesheet.webp`, 8×9 atlas, 192×208 per cell, 1536×1872 total.
- Each persona has one prebuilt Pet ZIP. ZIPs are not generated per user.
- A successful result receives a stable UUID URL and QR code. Revisiting it does not rerun classification.

## Persona roster

| ID | English | 中文 | Team behavior | Target share |
|---|---|---|---|---:|
| `laoda` | Laoda | 牢大 | Owns the hard core task and keeps shipping under deadline pressure | 12.5% |
| `bigdog` | Big Dog | 大狗叫 | Speaks up, reports progress, and gives the project visible energy | 12.5% |
| `maodie` | Maodie | 耄耋 | Spots faults early, objects directly, and traces root causes | 12.5% |
| `mowan` | Mowan | 魔丸 | Challenges constraints through small, reversible experiments | 12.5% |
| `gugugaga` | Gugugaga | 咕咕嘎嘎 | Keeps team communication and handoffs continuously alive | 12.5% |
| `shitter` | Shitter | 码仓铲屎官 | Uses unconventional patches to keep a chaotic live build running | 12.5% |
| `nailong` | Nailong | 奶蛙 | Makes the experience approachable and relieves team pressure | 12.5% |
| `jiahao` | Jiahao | 嘉豪 | Turns even a small feature into a memorable live Demo | 12.5% |

## Classification and distribution algorithm

1. On first submission, the backend creates a UUID and an idempotent result attempt.
2. Send the normalized answers to the published Mosoo Agent.
3. Mosoo scores or ranks the eight allowlisted persona IDs with equal base weight.
4. A clear top match wins. When the leading candidates are close, the backend may prefer an underrepresented candidate using the current result histogram.
5. The histogram is a soft tie-breaker only. It must not replace a strong input match or enforce exact quotas.
6. Persist the final `personalityId`, `petId`, classification version, and timestamp against the UUID.
7. Refreshes, QR visits, retries after success, and ZIP downloads read the persisted result and never classify again.

The exact definition of “close candidates” remains a calibration setting. Start with a small fixed threshold and tune it from test responses; do not add a quota optimizer unless observed distribution makes it necessary.

## Shitter presentation rule

`Shitter` is deliberately vulgar, but the result must read as a playful patch-and-chaos archetype rather than an insult or a claim that the user is incompetent. The Chinese result name remains the softer `码仓铲屎官`. Its choices reward visible, reversible emergency fixes; they must not encourage harassment, sabotage, or destructive production behavior.

## Jiahao presentation rule

`Jiahao / 嘉豪` is one of the eight personas. The current Chinese internet meme describes a campus-style, black-hooded performer who wants to be noticed, looks deliberately cool, and is sincere even when the performance feels slightly overdone. Its positive Hackathon translation is someone who turns a demo into a stage, commits fully, and resists bland sameness.

The result must be affectionate and self-aware, not a label for incompetence or a real person's name. Avoid copy such as “装懂”, “实力不够”, “班级小丑”, or claims that all people named 嘉豪 share this trait. Do not reproduce Alan Walker branding, logos, or a real minor's face. Safe visual cues are an unbranded black oversized hoodie, generic face mask, neon waveform, and an air-DJ gesture.

## Agent boundary

Mosoo owns:

- interpreting the questionnaire input;
- scoring or ranking the eight personas;
- returning a strict, allowlisted classification response.

The application owns:

- histogram-based tie-breaking;
- UUID/session persistence and idempotency;
- persona-to-Pet mapping;
- asset preview, ZIP download, result URL, and QR code;
- validating Agent output and handling retries.

No Mosoo token may be exposed in browser code. The web backend calls the published Agent through the Mosoo Thread API.

## Working experience flow

This flow is directionally agreed but the exact copy is still open:

1. Landing page promises a roughly 60–90 second, no-login experience.
2. Everyone starts from the same self-introduction question. Each answer follows a fixed branch through a 17-question bank; internal IDs are never shown.
3. A session shows seven multiple-choice questions, numbered continuously from 1–7 regardless of its internal path.
4. One optional free-text prompt, numbered 8: “凌晨 3 点，队伍最希望你还在做什么？” Suggested limit: 80 Chinese characters.
5. Submission enters a short Pet-hatching transition while routing runs.
6. The result page shows the bilingual role, role statement, team strengths, overload warning, complementary teammate, animated Pet, ZIP download, stable URL, and QR code.
7. A failed classification keeps the answers and offers retry. It never assigns a random persona as fallback.

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
personality_id      one of the eight allowlisted IDs
pet_id              selected prebuilt Pet
classification_ver questionnaire/prompt/routing version
created_at          result creation timestamp
```

Raw free text and full Mosoo transcripts are not required to reconstruct a result. Their retention policy must be decided before launch.

## Research basis

The role system is based on observed Hackathon team behaviors rather than technology stacks. Recurring signals in North American posts and guides are ownership, reliability, shipping, staying engaged under pressure, integration, and demo storytelling.

### Meme search and self-positioning bridge

Search with the source meme vocabulary, not the derived Hackathon tagline. The meme is a writing and research anchor; the user-facing answer must be a concrete behavior someone can comfortably say about themselves in a team-forming conversation.

The canonical research corpus and synthesis rules are documented in [Context 1 × Context 2](docs/research/persona-quiz-contexts.md). Context 1 supplies meme tone and safety boundaries; Context 2 supplies real participant language and observable classification signals. The fixed question bank is authored from both, while the runtime model receives only the eight sequential answers and a versioned persona rubric.

| Homepage meme | Search terms | Safe Hackathon behavior cue |
|---|---|---|
| 牢大 | `牢大 科比 想你了 曼巴` | Owns a hard core task and stays engaged late; do not turn the tragedy itself into a personality judgment |
| 大狗叫 | `大狗大狗叫叫叫 叮咚鸡 狗原型` | Speaks up, reports progress, and raises team energy without equating volume with leadership |
| 耄耋 | `圆头耄耋 猫爹 哈气 暴躁猫` | Notices faults early and states objections directly; soften hostility and age-based labeling |
| 魔丸 | `哪吒 魔丸 混世魔王 我命由我不由天` | Challenges constraints and tries disruptive experiments; never frame deletion or sabotage as desirable |
| 咕咕嘎嘎 | `咕咕嘎嘎企鹅 Gugu Gaga Penguin` | Keeps team communication alive; do not imply chat activity is the same as project contribution |
| Shitter | No canonical 梗百科 source; this is product-native copy | Uses explicit, reversible emergency patches; never treat the label as an insult |
| 奶蛙 | `奶龙大笑 罕见奶龙 八级哥笑声 AI二创` | Provides morale and comic relief while still describing a real contribution |
| 嘉豪 | `嘉豪 黑衣 DJ 慢动作 校园表演` | Commits to the demo, reframes ordinary features, and creates a memorable stage moment without targeting real people |

Research seeds: [嘉豪梗百科](https://gengbaike.heyfe.org/memes/text/jia-hao), [咕咕嘎嘎梗百科视频](https://www.bilibili.com/list/1544008396?bvid=BV1mm9mY9Eyq&oid=114120670057921), [圆头耄耋梗百科视频](https://www.bilibili.com/video/BV1xqjAzkE7B/), [魔丸梗百科视频](https://www.bilibili.com/video/BV1hweRzgEWX/), and [奶龙大笑梗百科视频](https://www.bilibili.com/list/1544008396?bvid=BV1ZPieB5EK7&oid=115829144293958). `Shitter` must stay explicitly marked as product-native rather than receiving a fabricated canonical source.

The model context contains only eight continuously numbered question-and-answer pairs. Internal branch IDs and persona signal weights stay application-side. The current local scorer uses the same eight IDs as the future model response; a result histogram may change the winner only when candidates are within a two-point score threshold.

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

The frontend Mock is implemented in React + TypeScript + Vite using the official Cloudflare Vite plugin and Workers Static Assets. It includes the intro, a 17-node fixed adaptive question bank, seven answer-driven branch steps, optional free text, hatching transition, responsive layout, and eight supplied pixel-character result images. All eight personas are matched by local answer signals; close candidates use a per-device result histogram as the balancing tie-breaker. The original SVG familiars remain decorative page assets. Mosoo is not called yet.

Production is deployed to the `WH-2099` Cloudflare account as Worker `hackathon-persona-pet-production`, with the custom domain `https://hackathon-pet.mosoo.ai`. Initial production version: `e0b7e062-1a1e-48b9-a343-0bdb81aea523`.

## Open decisions

- Calibrate question copy, score weights, and the close-candidate threshold with real booth responses.
- Detailed result copy, complementary-role pairs, and overload warnings.
- Visual brief and animation personality for each of the eight Pets.
- Mosoo response schema and the initial “close candidate” threshold.
- Data retention, abuse controls, result lifetime, and deletion policy.
- Hosting, database, object storage, analytics, and event-day operations.
