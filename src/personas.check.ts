import assert from "node:assert/strict";
import { accessSync } from "node:fs";
import { personaIds, personas } from "./personas.ts";

assert.equal(personaIds.length, 8);
assert.equal(new Set(personaIds).size, 8);
assert.deepEqual(Object.keys(personas).sort(), [...personaIds].sort());
assert.equal(new Set(personaIds.map((id) => personas[id].artwork)).size, 8);

for (const id of personaIds) {
  assert.equal(personas[id].id, id);
  assert.equal(personas[id].stats.length, 4);
  assert.equal(new Set(personas[id].stats.map(({ label }) => label)).size, 4);
  assert.ok(personas[id].stats.some(({ value }) => value === 100), `${id} must have a signature stat`);
  assert.ok(personas[id].stats.every(({ value }) => Number.isInteger(value) && value >= 0 && value <= 100));
  accessSync(new URL(`../public${personas[id].artwork}`, import.meta.url));
}

console.log("persona check passed: 8 equal-weight classes with artwork and static meme stats");
