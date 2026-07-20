# Petdex animation research

Reviewed 2026-07-20 against Petdex commit `1dad63495a13264be46fd22ed7aea960fc8d1d7d`.

## Findings

- Petdex renders a `1536×1872` atlas as an `8×9` CSS background grid; each frame is `192×208`.
- The web renderer uses `background-position` with `steps()` rather than Canvas, so the same files work in this React/Vite app without another dependency.
- The canonical rows are idle, run right, run left, wave, jump, fail, wait, generic running, and review. Their frame counts and timings live in [`pet-states.ts`](https://github.com/crafter-station/petdex/blob/1dad63495a13264be46fd22ed7aea960fc8d1d7d/src/lib/pet-states.ts).
- Petdex's detail-page floater uses Pointer Events, clamps the pet inside a rectangular stage, switches directional running rows while dragging, and adds release inertia. See [`pet-floater.tsx`](https://github.com/crafter-station/petdex/blob/1dad63495a13264be46fd22ed7aea960fc8d1d7d/src/components/pets/pet-floater.tsx).

## Product adaptation

The result page keeps the same atlas contract but uses a smaller interaction set: animated idle by default, waving on hover, jumping on click, and bounded left/right/generic running while dragging. Arrow keys move the focused pet. Release inertia is intentionally deferred so the first version stays predictable on booth touchscreens.

Reduced-motion users keep direct dragging and state feedback while CSS animation collapses to a static frame.

## Rights boundary

Petdex source code is MIT licensed, but its README states that submitted pet artwork remains owned by each contributor. This project does not copy gallery artwork as a general asset pool; downloadable files must remain tied to user-provided or project-produced sources and the separate asset manifest.
