import questionnaireConfig from "./questionnaire.json" with { type: "json" };
import { personaIds, type PersonaId } from "./personas.ts";

export type ScoreRow = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export interface ScoredChoice {
  id: string;
  label: string;
  scores: ScoreRow;
}

export type AtLeastTwo<T> = readonly [T, T, ...T[]];

export interface ScoredQuestion {
  id: string;
  eyebrow: string;
  title: string;
  choices: AtLeastTwo<ScoredChoice>;
}

export type Questionnaire = readonly [
  ScoredQuestion,
  ScoredQuestion,
  ScoredQuestion,
  ScoredQuestion,
  ScoredQuestion,
  ScoredQuestion,
  ScoredQuestion,
  ScoredQuestion,
];

export interface QuestionnaireDocument {
  version: string;
  scoreColumnPersonaIds: readonly PersonaId[];
  questions: Questionnaire;
}

export type PersonaTotals = Record<PersonaId, number>;

export interface QuestionnaireResult {
  personaId: PersonaId;
  totals: PersonaTotals;
  highestScore: number;
  tiedPersonaIds: readonly PersonaId[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${path} must be a non-empty string`);
  }
  return value;
}

function readScoreRow(value: unknown, path: string): ScoreRow {
  if (
    !Array.isArray(value) ||
    value.length !== personaIds.length ||
    !value.every((score) => typeof score === "number" && Number.isFinite(score) && score >= 0)
  ) {
    throw new TypeError(`${path} must contain ${personaIds.length} non-negative scores`);
  }

  if (value.every((score) => score === 0)) {
    throw new TypeError(`${path} must give positive evidence to at least one persona`);
  }

  return [
    value[0],
    value[1],
    value[2],
    value[3],
    value[4],
    value[5],
    value[6],
    value[7],
  ];
}

function readChoice(value: unknown, path: string): ScoredChoice {
  if (!isRecord(value)) {
    throw new TypeError(`${path} must be an object`);
  }

  return {
    id: readString(value.id, `${path}.id`),
    label: readString(value.label, `${path}.label`),
    scores: readScoreRow(value.scores, `${path}.scores`),
  };
}

function readQuestion(value: unknown, path: string): ScoredQuestion {
  if (!isRecord(value)) {
    throw new TypeError(`${path} must be an object`);
  }
  if (!Array.isArray(value.choices) || value.choices.length < 2) {
    throw new TypeError(`${path}.choices must contain at least two choices`);
  }

  const choices = value.choices.map((choice, index) =>
    readChoice(choice, `${path}.choices[${index}]`),
  );
  const choiceIds = choices.map((choice) => choice.id);
  if (new Set(choiceIds).size !== choiceIds.length) {
    throw new TypeError(`${path}.choices must use unique ids`);
  }

  return {
    id: readString(value.id, `${path}.id`),
    eyebrow: readString(value.eyebrow, `${path}.eyebrow`),
    title: readString(value.title, `${path}.title`),
    choices: [choices[0], choices[1], ...choices.slice(2)],
  };
}

function readScoreColumns(value: unknown): readonly PersonaId[] {
  if (
    !Array.isArray(value) ||
    value.length !== personaIds.length ||
    value.some((personaId, index) => personaId !== personaIds[index])
  ) {
    throw new TypeError("scoreColumnPersonaIds must match the canonical persona order");
  }
  return personaIds;
}

export function parseQuestionnaireDocument(value: unknown): QuestionnaireDocument {
  if (!isRecord(value)) {
    throw new TypeError("questionnaire document must be an object");
  }
  if (!Array.isArray(value.questions) || value.questions.length !== 8) {
    throw new TypeError("questions must contain exactly eight questions");
  }

  const parsedQuestions = value.questions.map((question, index) =>
    readQuestion(question, `questions[${index}]`),
  );
  const questionIds = parsedQuestions.map((question) => question.id);
  if (new Set(questionIds).size !== questionIds.length) {
    throw new TypeError("questions must use unique ids");
  }

  return {
    version: readString(value.version, "version"),
    scoreColumnPersonaIds: readScoreColumns(value.scoreColumnPersonaIds),
    questions: [
      parsedQuestions[0],
      parsedQuestions[1],
      parsedQuestions[2],
      parsedQuestions[3],
      parsedQuestions[4],
      parsedQuestions[5],
      parsedQuestions[6],
      parsedQuestions[7],
    ],
  };
}

const parsedQuestionnaireDocument = parseQuestionnaireDocument(questionnaireConfig);

export const questionnaireVersion = parsedQuestionnaireDocument.version;
export const scoreColumnPersonaIds = parsedQuestionnaireDocument.scoreColumnPersonaIds;
export const questionnaire = parsedQuestionnaireDocument.questions;

export function createEmptyPersonaTotals(): PersonaTotals {
  return Object.fromEntries(personaIds.map((personaId) => [personaId, 0])) as PersonaTotals;
}

export function selectHighestScoringPersona(totals: PersonaTotals): PersonaId {
  return personaIds.reduce((winner, personaId) =>
    totals[personaId] > totals[winner] ? personaId : winner,
  );
}

export function scoreQuestionnaire(answerIds: readonly string[]): QuestionnaireResult {
  if (answerIds.length !== questionnaire.length) {
    throw new RangeError(`expected ${questionnaire.length} answers, received ${answerIds.length}`);
  }

  const totals = createEmptyPersonaTotals();

  questionnaire.forEach((question, questionIndex) => {
    const answerId = answerIds[questionIndex];
    const choice = question.choices.find((candidate) => candidate.id === answerId);

    if (!choice) {
      throw new RangeError(`unknown choice "${answerId}" for question "${question.id}"`);
    }

    scoreColumnPersonaIds.forEach((personaId, personaIndex) => {
      totals[personaId] += choice.scores[personaIndex];
    });
  });

  const personaId = selectHighestScoringPersona(totals);
  const highestScore = totals[personaId];
  const tiedPersonaIds = personaIds.filter((candidateId) => totals[candidateId] === highestScore);

  return { personaId, totals, highestScore, tiedPersonaIds };
}
