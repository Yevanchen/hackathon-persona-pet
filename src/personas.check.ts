import assert from "node:assert/strict";
import { accessSync, closeSync, openSync, readSync } from "node:fs";
import { personaIds, personas } from "./personas.ts";
import {
  createEmptyPersonaTotals,
  parseQuestionnaireDocument,
  questionnaire,
  questionnaireVersion,
  scoreColumnPersonaIds,
  scoreQuestionnaire,
  selectHighestScoringPersona,
  type ScoredQuestion,
} from "./questionnaire.ts";

assert.equal(personaIds.length, 8);
assert.equal(new Set(personaIds).size, 8);
assert.deepEqual(Object.keys(personas).sort(), [...personaIds].sort());
assert.equal(new Set(personaIds.map((id) => personas[id].artwork)).size, 8);
assert.equal(new Set(personaIds.map((id) => personas[id].petSprite)).size, 8);
assert.equal(new Set(personaIds.map((id) => personas[id].petArchive)).size, 8);
assert.match(questionnaireVersion, /^\d{4}-\d{2}-\d{2}/);
assert.deepEqual(scoreColumnPersonaIds, personaIds);
assert.equal(questionnaire.length, 8);

for (const question of questionnaire) {
  assert.ok(question.choices.length >= 2, `${question.id} must have at least two choices`);
  assert.equal(
    new Set(question.choices.map((choice) => choice.id)).size,
    question.choices.length,
  );

  for (const choice of question.choices) {
    assert.equal(choice.scores.length, 8, `${question.id}/${choice.id} must score eight personas`);
    assert.ok(choice.scores.every((score) => Number.isFinite(score) && score >= 0));
    assert.ok(
      choice.scores.some((score) => score > 0),
      `${question.id}/${choice.id} must score at least one persona`,
    );
  }
}

for (const id of personaIds) {
  const persona = personas[id];
  assert.equal(persona.id, id);
  assert.equal(persona.stats.length, 4);
  assert.equal(new Set(persona.stats.map(({ label }) => label)).size, 4);
  assert.ok(persona.stats.some(({ value }) => value === 100), `${id} must have a signature stat`);
  assert.ok(
    persona.stats.every(({ value }) => Number.isInteger(value) && value >= 0 && value <= 100),
  );
  accessSync(new URL(`../public${persona.artwork}`, import.meta.url));
  accessSync(new URL(`../public${persona.petSprite}`, import.meta.url));
  const archive = new URL(`../public${persona.petArchive}`, import.meta.url);
  accessSync(archive);
  const file = openSync(archive, "r");
  const signature = Buffer.alloc(2);
  readSync(file, signature, 0, signature.length, 0);
  closeSync(file);
  assert.equal(signature.toString("ascii"), "PK", `${id} pet archive must be a ZIP file`);
}

const poopScoreIndex = scoreColumnPersonaIds.indexOf("poop");
const poopScoringChoices = questionnaire.flatMap((question) =>
  question.choices
    .filter((choice) => choice.scores[poopScoreIndex] > 0)
    .map((choice) => `${question.id}/${choice.id}`),
);
assert.deepEqual(poopScoringChoices, ["motivation/f", "legacy/g"]);

const structuralWinCounts = createEmptyPersonaTotals();
let structuralCombinationCount = 0;

function countStructuralWinners(questionIndex: number, totals: ReturnType<typeof createEmptyPersonaTotals>) {
  if (questionIndex === questionnaire.length) {
    structuralCombinationCount += 1;
    structuralWinCounts[selectHighestScoringPersona(totals)] += 1;
    return;
  }

  for (const choice of questionnaire[questionIndex].choices) {
    const nextTotals = { ...totals };
    for (const [personaIndex, personaId] of personaIds.entries()) {
      nextTotals[personaId] += choice.scores[personaIndex];
    }
    countStructuralWinners(questionIndex + 1, nextTotals);
  }
}

countStructuralWinners(0, createEmptyPersonaTotals());
const regularStructuralShares = personaIds
  .filter((personaId) => personaId !== "poop")
  .map((personaId) => structuralWinCounts[personaId] / structuralCombinationCount);
assert.ok(
  Math.max(...regularStructuralShares) - Math.min(...regularStructuralShares) <= 0.05,
  "non-easter-egg persona result shares must stay within five percentage points",
);

const twoChoiceQuestion = {
  ...questionnaire[0],
  choices: [questionnaire[0].choices[0], questionnaire[0].choices[1]],
} satisfies ScoredQuestion;
assert.equal(twoChoiceQuestion.choices.length, 2);

const firstChoices = questionnaire.map((question) => question.choices[0].id);
const firstChoiceResult = scoreQuestionnaire(firstChoices);

for (const [personaIndex, personaId] of personaIds.entries()) {
  const expectedTotal = questionnaire.reduce(
    (total, question) => total + question.choices[0].scores[personaIndex],
    0,
  );
  assert.equal(firstChoiceResult.totals[personaId], expectedTotal);
}

assert.equal(
  firstChoiceResult.highestScore,
  Math.max(...Object.values(firstChoiceResult.totals)),
);
assert.equal(firstChoiceResult.personaId, firstChoiceResult.tiedPersonaIds[0]);

const tiedTotals = createEmptyPersonaTotals();
assert.equal(selectHighestScoringPersona(tiedTotals), personaIds[0]);

for (const personaId of personaIds) {
  const totals = createEmptyPersonaTotals();
  totals[personaId] = 1;
  assert.equal(selectHighestScoringPersona(totals), personaId);
}

assert.throws(() => scoreQuestionnaire(firstChoices.slice(0, 7)), RangeError);
const answersWithUnknownChoice = [...firstChoices];
answersWithUnknownChoice[3] = "not-a-choice";
assert.throws(
  () => scoreQuestionnaire(answersWithUnknownChoice),
  /unknown choice "not-a-choice"/,
);

const documentWithOneChoice = {
  version: questionnaireVersion,
  scoreColumnPersonaIds,
  questions: questionnaire.map((question, index) =>
    index === 0 ? { ...question, choices: [question.choices[0]] } : question,
  ),
};
assert.throws(
  () => parseQuestionnaireDocument(documentWithOneChoice),
  /choices must contain at least two choices/,
);

const documentWithWrongColumns = {
  ...documentWithOneChoice,
  scoreColumnPersonaIds: [...scoreColumnPersonaIds].reverse(),
  questions: questionnaire,
};
assert.throws(
  () => parseQuestionnaireDocument(documentWithWrongColumns),
  /must match the canonical persona order/,
);

const documentWithAllZeroChoice = {
  version: questionnaireVersion,
  scoreColumnPersonaIds,
  questions: questionnaire.map((question, questionIndex) =>
    questionIndex === 0
      ? {
          ...question,
          choices: question.choices.map((choice, choiceIndex) =>
            choiceIndex === 0
              ? { ...choice, scores: [0, 0, 0, 0, 0, 0, 0, 0] }
              : choice,
          ),
        }
      : question,
  ),
};
assert.throws(
  () => parseQuestionnaireDocument(documentWithAllZeroChoice),
  /must give positive evidence to at least one persona/,
);

console.log(
  "persona check passed: 8 scored personas with artwork, pet downloads, and static meme stats",
);
