import assert from "node:assert/strict";
import { personaIds } from "./personas.ts";
import {
  BALANCE_SCORE_THRESHOLD,
  MAX_CHOICE_QUESTIONS,
  START_QUESTION_ID,
  TOTAL_QUIZ_STEPS,
  buildQuizContext,
  classifyQuizAnswers,
  createPersonaScores,
  questionBank,
  questionIds,
  quizQuestionDimensions,
  selectBalancedPersona,
  type QuizAnswer,
  type QuizQuestionId,
} from "./quiz.ts";

assert.ok(questionIds.length > MAX_CHOICE_QUESTIONS, "the bank must be larger than one quiz path");

const reachableQuestions = new Set<QuizQuestionId>();
const coveredPersonas = new Set<string>();
const classifiedPersonas = new Set<string>();
const classificationCounts = createPersonaScores();
let completePathCount = 0;
let examplePath: QuizAnswer[] | undefined;

function walk(
  questionId: QuizQuestionId,
  answers: QuizAnswer[],
  questionsOnPath: ReadonlySet<QuizQuestionId>,
) {
  assert.ok(!questionsOnPath.has(questionId), `cycle detected at ${questionId}`);
  assert.ok(answers.length < MAX_CHOICE_QUESTIONS, `path exceeded ${MAX_CHOICE_QUESTIONS} choices`);

  const question = questionBank[questionId];
  reachableQuestions.add(questionId);
  assert.equal(question.id, questionId);
  assert.equal(question.choices.length, 4, `${questionId} must have four choices`);
  assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 4, `${questionId} choice IDs`);

  const nextQuestionsOnPath = new Set(questionsOnPath).add(questionId);
  for (const choice of question.choices) {
    choice.signals.forEach((personaId) => coveredPersonas.add(personaId));
    const nextAnswers = [...answers, { questionId, choiceId: choice.id }];

    if (choice.next === "complete") {
      assert.equal(nextAnswers.length, MAX_CHOICE_QUESTIONS, "all paths must end after seven choices");
      assert.deepEqual(
        nextAnswers.map((answer) => questionBank[answer.questionId].dimension),
        quizQuestionDimensions,
        "every path must cover the evidence dimensions in order",
      );
      completePathCount += 1;
      examplePath ??= nextAnswers;
      const personaId = classifyQuizAnswers(nextAnswers, classificationCounts);
      classifiedPersonas.add(personaId);
      classificationCounts[personaId] += 1;
      continue;
    }

    assert.ok(questionBank[choice.next], `${questionId}/${choice.id} references ${choice.next}`);
    walk(choice.next, nextAnswers, nextQuestionsOnPath);
  }
}

walk(START_QUESTION_ID, [], new Set());

assert.deepEqual([...reachableQuestions].sort(), [...questionIds].sort(), "every bank question is reachable");
assert.deepEqual([...coveredPersonas].sort(), [...personaIds].sort(), "every persona has signals");
assert.deepEqual(
  [...classifiedPersonas].sort(),
  [...personaIds].sort(),
  "every persona can be a final result",
);
assert.ok(completePathCount > 1, "the graph must expose multiple complete paths");
assert.ok(examplePath);

const resultCounts = Object.values(classificationCounts);
assert.ok(
  Math.max(...resultCounts) - Math.min(...resultCounts) <= completePathCount * 0.01,
  "soft balancing should keep exhaustive-path results within a 1% spread",
);

const context = buildQuizContext(examplePath, "还在把主链路跑通");
assert.equal(context.responses.length, TOTAL_QUIZ_STEPS);
assert.deepEqual(
  context.responses.map((response) => response.number),
  [1, 2, 3, 4, 5, 6, 7, 8],
);
assert.ok(!JSON.stringify(context).includes("questionId"), "internal IDs must not leak into model context");

const strongScores = createPersonaScores();
strongScores.bigdog = 5;
strongScores.laoda = 2;
const skewedCounts = createPersonaScores();
skewedCounts.bigdog = 20;
assert.equal(
  selectBalancedPersona(strongScores, skewedCounts, BALANCE_SCORE_THRESHOLD),
  "bigdog",
  "balancing must not override a clear match",
);

const closeScores = createPersonaScores();
closeScores.bigdog = 5;
closeScores.laoda = 4;
assert.equal(
  selectBalancedPersona(closeScores, skewedCounts, BALANCE_SCORE_THRESHOLD),
  "laoda",
  "an underrepresented close candidate should win the tie-break",
);

console.log(
  `quiz check passed: ${questionIds.length} fixed questions, ${completePathCount} paths, ${TOTAL_QUIZ_STEPS} visible steps; ${JSON.stringify(classificationCounts)}`,
);
