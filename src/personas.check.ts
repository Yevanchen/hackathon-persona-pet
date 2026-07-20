import assert from "node:assert/strict";
import { accessSync } from "node:fs";
import { personaIds, personas, personaStatDefinitions } from "./personas.ts";

assert.equal(personaIds.length, 8);
assert.equal(new Set(personaIds).size, 8);
assert.deepEqual(Object.keys(personas).sort(), [...personaIds].sort());
assert.equal(new Set(personaIds.map((id) => personas[id].artwork)).size, 8);
assert.deepEqual(
  personaStatDefinitions.map(({ id }) => id).sort(),
  [...personaIds].sort(),
);

for (const id of personaIds) {
  assert.equal(personas[id].id, id);
  assert.deepEqual(Object.keys(personas[id].stats).sort(), [...personaIds].sort());
  assert.equal(personas[id].stats[id], 100, `${id} must max its signature stat`);
  assert.ok(Object.values(personas[id].stats).every((score) => Number.isInteger(score) && score >= 0 && score <= 100));
  accessSync(new URL(`../public${personas[id].artwork}`, import.meta.url));
}

console.log("persona check passed: 8 equal-weight classes with artwork and static meme stats");
