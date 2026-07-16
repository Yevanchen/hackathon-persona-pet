import assert from "node:assert/strict";
import { pickPersonaId, regularPersonaIds } from "./personas.ts";

assert.equal(pickPersonaId(0), "shitter");
assert.equal(pickPersonaId(0.039999), "shitter");

for (const [index, id] of regularPersonaIds.entries()) {
  const lower = 0.04 + index * 0.12;
  const midpoint = lower + 0.06;
  assert.equal(pickPersonaId(lower + Number.EPSILON), id);
  assert.equal(pickPersonaId(midpoint), id);
}

assert.equal(pickPersonaId(0.999999), "alchemist");
assert.throws(() => pickPersonaId(-0.1), RangeError);
assert.throws(() => pickPersonaId(1), RangeError);

console.log("routing check passed: Shitter 4%, eight regular buckets 12% each");

