# Hackathon Persona Quiz — Context 1 × Context 2

> Status: question-bank authoring context | Research date: 2026-07-20 | Method: AnySearch discovery and page extraction, followed by source-level review

## Root problem

The product is not trying to ask “which meme do you recognize?” or “which technology do you use?”. It connects two different vocabularies:

- **Context 1 — Chinese internet meme language:** supplies recognizable tone, rhythm, and emotional energy.
- **Context 2 — Hackathon self-positioning language:** supplies observable claims about what a participant can own, prove, and do with a team.

The bridge is a fixed adaptive question bank. A meme may inspire the voice of an option, but only a concrete Hackathon behavior may affect classification.

```text
Context 1: meme motif + safety boundary
                  ↓ authoring only
       fixed 17-node adaptive question bank
                  ↑ authoring only
Context 2: real self-introduction + team behavior
                  ↓ runtime
 eight sequential question/answer pairs → persona rubric → one of eight personas
```

The source corpus is not sent with every model call. At runtime the application sends only the eight visible question-and-answer pairs; the versioned system prompt owns the persona rubric. This keeps the classifier input short enough for the intended 3–5 second result flow.

## Research method and limits

AnySearch was used across four source classes:

1. participant-authored introductions on GitHub and Reddit;
2. team-formation templates from Devpost and HackHQ;
3. organizer guidance from Garage48 and reflective Hackathon discussion on Hacker News;
4. Hack House products that explicitly match complementary builder archetypes.

This is a qualitative product corpus, not a statistically representative survey. It is strong enough to define the first question bank and weak enough that copy, weights, and distribution still require calibration with real booth responses.

## Context 1 — meme vocabulary and safe translation

Search the source vocabulary rather than the derived homepage tagline. The source motif is an authoring cue; the safe translation is the only part allowed to reach classification copy.

| Homepage term | Search vocabulary | Motif retained for the product | Safe Hackathon translation | Boundary |
|---|---|---|---|---|
| 牢大 | `牢大 科比 想你了 曼巴` | extreme commitment and carrying a hard task | “I can own the difficult core and stay engaged until it works.” | Do not turn a death-related black-humor meme or sleep deprivation into a judgment of character. |
| 大狗叫 | `大狗大狗叫叫叫 叮咚鸡 狗原型` | loud, contagious expression | speaks up, reports progress, pitches, and raises energy | Volume alone is not leadership or contribution. |
| 圆头耄耋 | `圆头耄耋 猫爹 哈气 暴躁猫` | instant suspicion and visible objection | notices inconsistencies early and states a concrete concern | Remove hostility and age-based labeling. |
| 魔丸 | `哪吒 魔丸 混世魔王 我命由我不由天` | refusal to accept a fixed constraint | runs a small, reversible experiment against the constraint | Never reward deletion, sabotage, or unsafe production behavior. |
| 咕咕嘎嘎 | `咕咕嘎嘎企鹅 Gugu Gaga Penguin` | persistent social noise and presence | keeps the team informed and makes coordination visible | Chat activity is not evidence of delivery by itself. |
| Shitter | no canonical 梗百科 source; product-native copy | chaotic emergency patching | uses explicit, reversible shortcuts to keep a live build moving | Never use it as an insult or reward destructive production behavior. |
| 奶蛙 | `奶龙大笑 罕见奶龙 八级哥笑声 AI二创` | contagious laughter and morale | reduces tension while still owning a useful task | Morale support must not erase or fake contribution. |
| 嘉豪 | `嘉豪 黑衣 DJ 慢动作 校园表演` | sincere, slightly overcommitted stage presence | turns a small feature into a memorable, rehearsed Demo moment | Do not target a real person, minor, name, face, or third-party branding. |

Context 1 source seeds:

- [牢大梗百科视频](https://www.bilibili.com/video/BV1ha4y1A7RJ/)
- [大狗叫梗百科视频](https://www.bilibili.com/video/BV1ysME67Em9/)
- [圆头耄耋梗百科视频](https://www.bilibili.com/video/BV1xqjAzkE7B/)
- [魔丸梗百科视频](https://www.bilibili.com/video/BV1hweRzgEWX/)
- [咕咕嘎嘎梗百科视频](https://www.bilibili.com/list/1544008396?bvid=BV1mm9mY9Eyq&oid=114120670057921)
- [奶龙大笑梗百科视频](https://www.bilibili.com/list/1544008396?bvid=BV1ZPieB5EK7&oid=115829144293958)
- [嘉豪梗百科](https://gengbaike.heyfe.org/memes/text/jia-hao)

## Context 2 — how Hackathon participants position themselves

### What the sources actually ask people to say

| Source | Observed self-positioning fields | Product implication |
|---|---|---|
| [Devpost team formation](https://help.devpost.com/article/75-participants-page-forming-a-team) | introduction, project ideas, and the kinds of teammates sought | A useful introduction states both what one brings and what the team still needs. |
| [HackHQ team formation](https://hackhq.io/planning-guide/team-formation) | role/skills, desired teammates, interests, experience level, and a personal detail; someone must own design and story/presentation | Role labels are useful for matching, but ownership is more diagnostic than a title. |
| [Microsoft AI Agents Hackathon team thread](https://github.com/microsoft/AI_Agents_Hackathon/discussions/4) | skills, timezone/availability, communication channel, experience, projects, learning intent, and desired complementary roles | Real introductions combine capability, evidence, commitment, constraints, and complementarity. |
| [A detailed GitHub teammate post](https://github.com/microsoft/AI_Agents_Hackathon/discussions/56) | stack, project evidence, quantified experience, who is needed, commitment to shipping/learning, availability, and communication preferences | “What I built” and “what I can own now” are stronger signals than self-applied adjectives. |
| [Reddit: Bangalore teammate search](https://www.reddit.com/r/hackathon/comments/1unj7y1/looking_for_hackathon_teammates_bangalore/) | location, stack, AI/ML interests, openness to other stacks, and willingness to continue after the event | Participants use flexibility and commitment as identity signals alongside technical labels. |
| [Reddit: role-specific teammate search](https://www.reddit.com/r/hackathon/comments/1taw4wn/looking_for_teammates_to_participate_in/) | requested developers, designer, research/documentation ownership, seriousness, and portfolio evidence | Research, documentation, design, and presentation are real contributions, not secondary “non-builder” traits. |
| [Hacker News: leading a Hackathon team](https://news.ycombinator.com/item?id=24593074) | agree on the finish line, finish something complete, fill gaps, scope an MVP, communicate, help proactively, and rehearse the pitch | Time-pressure behavior separates personas better than a technology-stack question. |
| [Garage48 Tech for Humanity](https://garage48.org/events/garage48-tech-for-humanity) | engineers, designers, marketers, field experts, team lead/project manager, product vision, customer journey, timekeeping, and pitch practice | A working team needs complementary ownership across build, user, delivery, and story. |
| [Hacker House Protocol](https://hackerhouse.app/) | Visionary, Strategist, and Builder archetypes; verified skills; complementary rather than duplicate matching | An archetype should answer “what do you bring?” and “who complements you?”, not merely repeat a job title. |

### Canonical Context 2 schema

| Field | Example meaning | Classifier use |
|---|---|---|
| `capability_claim` | backend, UI/UX, research, pitch, product, AI, hardware | Weak alone; technology and title are supporting context. |
| `experience_evidence` | shipped project, working prototype, user observation, reproduced failure, rehearsed Demo | Strong signal when it proves a claimed behavior. |
| `role_ownership` | the part the participant can independently deliver for this team | Primary signal. |
| `working_mode` | plans, experiments, polishes, integrates, debugs, facilitates, or performs | Primary signal. |
| `pressure_behavior` | what they protect, cut, or repair as time runs out | Primary signal because it reveals priorities. |
| `goal` | learn, win, ship, validate, meet collaborators, or continue after the event | Contextual signal; it changes trade-offs but should not label competence. |
| `desired_complement` | the missing role or behavior they want from a teammate | Useful for team matching, but not scored directly: people often seek their opposite. |
| `constraints` | timezone, location, availability, event eligibility | Logistics only; never a persona signal. |
| `identity_context` | name, school, age, gender, nationality, seniority | Excluded from classification. Experience evidence may be used; identity itself may not. |

## Context 1 × Context 2 synthesis rules

1. **Behavior decides; meme tone decorates.** “I will trace the failure to its source” is classifiable. “I hiss at bad code” is only flavor.
2. **Evidence beats adjectives.** Prefer an action a teammate could verify over “creative”, “serious”, “passionate”, or “full-stack”.
3. **Every option must be socially selectable.** All four choices describe a useful contribution; there is no obvious “good person” answer.
4. **Technology is not personality.** A React developer may be 牢大、耄耋、奶蛙 or another persona depending on what they own and how they work.
5. **Complement is not identity.** Wanting a designer describes the current team gap, not the participant's own persona.
6. **Pressure reveals priority without glorifying harm.** Questions may use deadline scenarios, but never reward sabotage, harassment, unsafe deployment, or performative sleep deprivation.
7. **Meme knowledge is optional.** A visitor can answer every question without recognizing any source meme.
8. **All eight personas use the same rubric.** `Shitter` has no random override; only explicit, reversible patch-oriented answers may contribute to it.

## Persona signal matrix

Each result is now one of the eight homepage meme personas; the safe Hackathon behavior remains the evidence boundary.

| Persona | Natural Hackathon self-positioning | Decisive observable signals |
|---|---|---|
| 牢大 | “I can own the difficult core and stay engaged until it works.” | core ownership, end-to-end proof, deadline commitment |
| 大狗叫 | “I keep scope, progress, and the Demo story audible to the team.” | explicit criteria, progress reporting, coordination, pitch support |
| 耄耋 | “I spot the inconsistency early and trace it to evidence.” | observation, instrumentation, reproduction, root cause |
| 魔丸 | “I challenge the constraint with a small, reversible experiment.” | technical spikes, unfamiliar-tool combinations, timeboxed novelty |
| 咕咕嘎嘎 | “I keep handoffs and team state visible until delivery.” | integration, contracts, unblock help, continuous synchronization |
| Shitter | “I can keep a live build moving with a clearly temporary patch.” | hardcoded Demo slices, reversible workarounds, visible emergency fixes |
| 奶蛙 | “I make the first-use experience approachable and lower team pressure.” | user clarity, interface feedback, morale paired with owned delivery |
| 嘉豪 | “I turn the team’s real work into a memorable live Demo.” | narrative, rehearsal, visual anchor, pitch ownership, stage presence |

## Composite question-bank structure

Every visitor starts at the same node. Their answer selects the next internal node, but the interface always shows a continuous sequence from 1 to 8.

| Visible step | Signal dimension | Context 2 evidence used | Current internal nodes |
|---:|---|---|---|
| 1 | self-positioning | capability claim + role ownership | `start` |
| 2 | concrete ownership | what the participant will deliver first | four `*-ownership` nodes |
| 3 | proof strategy | how the participant makes a claim testable | four `*-proof` nodes |
| 4 | pressure trade-off | what they protect or cut under deadline | four `*-pressure` nodes |
| 5 | collaboration behavior | gap filling, feedback, conflict, and unblock style | `teammate-blocked`, `unclear-feedback` |
| 6 | finish behavior | the last useful thing they choose to complete | `night-shift` |
| 7 | Demo position | the responsibility they naturally take at judging time | `final-three-minutes` |
| 8 | own words | free-text role ownership in the participant’s language | no internal branch ID |

This structure intentionally does not ask directly for `desired_complement`, `constraints`, or identity context. Those are useful for teammate matching but can misclassify personality. The free-text answer lets the future model recover phrasing that fixed options miss without delaying the seven branch decisions.

## Scoring and balancing boundary

- Each selected option supplies one primary persona signal and, where useful, one secondary signal.
- The current local mock scores primary signals as 2 and secondary signals as 1.
- All eight personas participate in answer scoring with equal base weight.
- A result histogram may prefer an underrepresented candidate only when its score is within two points of the leader.
- A clear match always wins; balancing is not a quota optimizer.
- The browser mock persists a per-device histogram for booth testing; production distribution balancing still requires backend aggregate counts.

The graph check must continue to prove that all 17 internal questions are reachable, every path contains seven choices plus one free-text response, every persona is reachable, internal IDs do not leak into model context, exhaustive-path results stay within a 1% spread under soft balancing, and close-score balancing cannot override a strong match.

## Calibration questions still open

- Do real participants understand every option without knowing the source memes?
- Are any options socially more desirable, causing answer bias?
- Does the score distribution remain acceptably close after real responses rather than uniform simulated clicks?
- Does the model agree with human reviewers on the top two personas?
- Should the two-point close-candidate threshold change after collecting a labeled validation set?
