# Hackathon Persona Pet — Product Context

> Status: living design context  
> Updated: 2026-07-21
> Audience: Hackathon booth visitors, primarily tech-interested people aged 16–26

## Product thesis

A no-login web experience that turns eight Hackathon scenario answers into one of eight scored personas and a matching Codex Pet.

The frontend prototype uses a deterministic score matrix: every answer adds a score to every persona, and the highest total wins. Question copy, answer copy, and weights remain draft configuration.

## Current priority: prove the asset-to-Mock loop

The immediate milestone is a complete visual prototype using eight coherent Pet concepts:

1. **Reference intake:** use `hackathon-pet-personas-2026-07-17.zip` as the source roster and asset reference package.
2. **Static identity art:** validate or produce one coherent Pet identity for each of the eight personas.
3. **Pet production:** run each approved base image through the Codex Pet pipeline to produce eight installable packages.
4. **Frontend scoring:** present eight questions with at least two choices each, add every selected score row, and assign the highest-scoring persona.

### Reference filtering rules

The source galleries are inspiration libraries, not an asset allowlist. A reference may inform silhouette, palette, material, proportion, or prop language without being copied as a character.

Keep references that are:

- compact, whole-body, and readable at 192×208;
- cute, friendly, rounded, and approachable;
- visually coherent with a shared chibi or mascot family;
- simple enough to animate consistently across eight personas;
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

The shortlist does not need equal popularity per persona. A small set of highly popular, cohesive style anchors should govern all eight Pets; lower-popularity references may contribute only a persona cue, prop, or silhouette.

## Locked decisions

- No registration or login.
- Exactly eight scored questions; each question has at least two choices and may use a different choice count.
- Exactly eight result personas, all selected through the same score calculation.
- Every choice provides one numeric score for every persona: an n × 8 matrix per question, where n ≥ 2.
- `src/questionnaire.json` is the single source of truth for question text, choice text, score rows, and questionnaire version. Edit the JSON before changing questionnaire content anywhere else.
- Submission sums the selected rows across all questions; the highest persona total wins.
- Ties resolve deterministically by canonical persona order. There is no random tie-breaker.
- Question copy, choice copy, and score values are draft configuration to be calibrated separately.
- Score strength is coverage-aware: broad personas use smaller increments, while personas with fewer natural answer opportunities may use larger increments. The two literal physical-defecation choices are the only `poop` signals and each scores 10 as an easter egg. Exhaustive equal-choice enumeration must keep the seven non-easter-egg result shares within five percentage points of one another.
- Persona coverage is a questionnaire-level calibration goal, not a per-question requirement. Write plausible answers first, then score only the personas supported by the behavior. Sparse score rows are expected; never invent an unnatural answer merely to give a persona representation.
- Every retained choice must provide positive evidence for at least one persona. An all-zero row adds no classification information, so remove that choice instead of forcing a mapping. If a recurring natural behavior maps to no persona, reconsider the roster rather than inventing scores.
- There is no target choice count per question. Keep only plausible, meaningfully distinct answers; if an option exists mainly to fill a persona column, remove it. The `n ≥ 2` rule is a schema boundary, not a writing template.
- Do not sanitize every answer into good team practice. When the scenario naturally supports it, include plausible selfish, biased, avoidant, or irresponsible behavior so the quiz is not a set of obvious socially desirable answers; do not add a mandatory “bad option” template to every question.
- Pre-existing content in an unapproved question slot is legacy placeholder data, not an ideation source. Generate each new scenario from the confirmed Hackathon flow and persona definitions; do not reuse the placeholder's premise, wording, choices, or weights unless the user explicitly approves them.
- Pets are made in-house or created from explicitly authorized Remix sources. Petdex and Awesome Codex Pet are references, not the production asset pool.
- MVP pet packages use the Codex v1 package profile: `pet.json` plus `spritesheet.webp`, 8×9 atlas, 192×208 per cell, 1536×1872 total.
- Each persona has one prebuilt Pet ZIP. ZIPs are not generated per user.
- A successful result receives a stable UUID URL and QR code. Revisiting it does not rerun classification.

## Persona roster

| ID | Display name | Hackathon persona |
|---|---|---|
| `kobe-laoda` | 科比牢大（熬夜哥） | 熬夜主程 |
| `maodie` | 耄耋 | 敏感易怒者 |
| `big-dog-bark` | 大狗叫 | 扩音器汇报官 |
| `gugugaga` | 咕咕嘎嘎（高松灯） | 群聊搬运工 |
| `mowan` | 魔丸 | 混沌捣乱者 |
| `jiahao` | 嘉豪 | 术语型伪专家 |
| `poop` | 💩 | 随地大小便的人 |
| `nailong-daxiao` | 奶龙大笑 | 爆笑气氛组 |

Detailed persona meanings, scoring signals, and pairwise boundaries are maintained in [`docs/personas.md`](docs/personas.md).

## Scoring algorithm

1. Keep the eight persona IDs in one canonical column order.
2. Each question has its own choice count, with a minimum of two choices.
3. Each choice stores an eight-number score row aligned with the canonical persona columns.
4. Store selected choice IDs rather than answer text.
5. On submission, add the eight selected rows into one persona-total record.
6. Return the persona with the highest total.
7. If multiple totals tie, return the earliest persona in canonical order and retain the complete tie list for future policy changes.
8. Reject incomplete submissions and unknown choice IDs instead of silently producing a result.

## Jiahao satire rule

`Jiahao / 嘉豪` is intentionally a negative, satirical Hackathon persona: someone who keeps escalating to impressive-sounding terminology, but does not understand the concepts well enough to explain or implement the promised system. The decisive signal is not clothing, stage presence, confidence, or ordinary use of technical vocabulary. It is the combination of jargon density, evasiveness under concrete follow-up, and inability to deliver.

Scoring must not award Jiahao points merely for pitching, presenting, naming a concept, or choosing an ambitious technology. Award high scores only when the option shows fake comprehension or a gap between language and implementation. `Big Dog Bark / 大狗叫` may be loud and theatrical, but communicates real project content; Jiahao obscures the absence of content. Result copy may use words such as “装懂” and “不会实现” because the satire depends on that criticism, while making clear that this is a fictional behavior archetype rather than a claim about every real person named 嘉豪. Do not reproduce a real person's face or imply that a real individual has these traits.

Examples supplied while defining this persona describe the behavior boundary; they are not required vocabulary for questionnaire copy. Every Jiahao option must first answer its scenario, then reveal evasion or inability to implement through that scenario's concrete action.

## Scoring boundary

`src/questionnaire.json` owns the questionnaire version, persona column order, question IDs, choice IDs, display copy, and score rows. `src/questionnaire.ts` loads and validates that document, then owns accumulation, highest-score selection, and deterministic ties. The UI owns navigation and selected choice IDs; it must not duplicate score logic or embed questionnaire copy.

Mosoo is not part of the current score-matrix prototype. Any later runtime integration must preserve the same allowlisted persona IDs and deterministic application-side validation.

## Working experience flow

This flow is directionally agreed but the exact copy is still open:

1. Landing page promises a roughly 60–90 second, no-login experience.
2. Eight progressive Hackathon scenario cards each present at least two choices.
3. Submission enters a short Pet-hatching transition while score rows are accumulated.
4. The result page shows the highest-scoring persona, role statement, strengths, warning, and Pet preview.
5. Invalid or incomplete answers never produce a fallback result.

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

The selected choice IDs and scoring-config version are sufficient to reproduce a result. Their retention policy must be decided before launch.

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

On 2026-07-20, the questionnaire architecture pivoted to eight scored questions and eight result personas from `hackathon-pet-personas-2026-07-17.zip`. Each question has at least two choices and may use a different choice count; every choice contains one score for each persona. `src/questionnaire.json` is the directly loadable content source, while `src/questionnaire.ts` validates it and performs scoring. Submission sums the eight persona columns and returns the highest-scoring persona. Ties resolve deterministically by the canonical persona order. The current question copy and weights are draft configuration and will be calibrated separately; this scoring architecture supersedes the earlier weighted-random 8+1 Mock routing for the frontend prototype.

Mosoo CLI `v0.1.2` is installed. On 2026-07-16, `mosoo doctor --json` resolved the local target at `http://127.0.0.1:8787` but reported the API as unreachable because the local service was not running. Runtime target and credentials must be resolved before integration work.

The frontend prototype is implemented in React + TypeScript + Vite using the official Cloudflare Vite plugin and Workers Static Assets. It includes the intro, eight scored questions, a hatching transition, deterministic highest-score results, responsive layout, a Jiahao spritesheet preview, and CSS placeholders for the remaining Pets.

Production is deployed to the `WH-2099` Cloudflare account as Worker `hackathon-persona-pet-production`, with the custom domain `https://hackathon-pet.mosoo.ai`. Initial production version: `e0b7e062-1a1e-48b9-a343-0bdb81aea523`.

## Open decisions

- Final eight questions, answer choices, and score matrices.
- Questions 4–8 must be regenerated from scratch. Their older questionnaire entries are temporary runtime placeholders and carry no product intent.
- Detailed result copy, complementary-role pairs, and overload warnings.
- Visual brief and animation personality for each of the eight Pets.
- Final tie policy after score calibration; canonical-order resolution is the current deterministic default.
- Data retention, abuse controls, result lifetime, and deletion policy.
- Hosting, database, object storage, analytics, and event-day operations.
