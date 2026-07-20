import assert from "node:assert/strict";
import { accessSync } from "node:fs";
import { personaIds, personas } from "./personas.ts";

assert.equal(personaIds.length, 8);
assert.equal(new Set(personaIds).size, 8);
assert.deepEqual(Object.keys(personas).sort(), [...personaIds].sort());
assert.equal(new Set(personaIds.map((id) => personas[id].artwork)).size, 8);

for (const id of personaIds) {
  assert.equal(personas[id].id, id);
  accessSync(new URL(`../public${personas[id].artwork}`, import.meta.url));
}

console.log("persona check passed: 8 equal-weight classes with 8 result artworks");
