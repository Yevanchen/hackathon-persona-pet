import { personaIds, type PersonaId } from "./personas.ts";

export const MAX_CHOICE_QUESTIONS = 7;
export const TOTAL_QUIZ_STEPS = MAX_CHOICE_QUESTIONS + 1;
export const START_QUESTION_ID = "start";
export const FREE_TEXT_PROMPT = "凌晨三点，队伍最希望你还在做什么？";
export const BALANCE_SCORE_THRESHOLD = 2;

export const quizQuestionDimensions = [
  "self-positioning",
  "ownership",
  "proof",
  "pressure",
  "collaboration",
  "finish",
  "demo",
] as const;

export type QuizQuestionDimension = (typeof quizQuestionDimensions)[number];

export const questionIds = [
  START_QUESTION_ID,
  "core-ownership",
  "experience-ownership",
  "team-ownership",
  "demo-ownership",
  "prototype-proof",
  "user-proof",
  "failure-proof",
  "story-proof",
  "scope-pressure",
  "integration-pressure",
  "bug-pressure",
  "novelty-pressure",
  "teammate-blocked",
  "unclear-feedback",
  "night-shift",
  "final-three-minutes",
] as const;

export type QuizQuestionId = (typeof questionIds)[number];
export type QuizChoice = {
  id: string;
  label: string;
  signals: readonly [PersonaId, ...PersonaId[]];
  next: QuizQuestionId | "complete";
};

export type QuizQuestion = {
  id: QuizQuestionId;
  dimension: QuizQuestionDimension;
  eyebrow: string;
  title: string;
  choices: readonly QuizChoice[];
};

export type QuizAnswer = {
  questionId: QuizQuestionId;
  choiceId: string;
};

export type PersonaScores = Record<PersonaId, number>;

export type QuizContext = {
  version: "adaptive-v2";
  responses: Array<{
    number: number;
    question: string;
    answer: string;
  }>;
};

export const questionBank: Record<QuizQuestionId, QuizQuestion> = {
  start: {
    id: "start",
    dimension: "self-positioning",
    eyebrow: "组队 / 自我定位",
    title: "刚进组队区，轮到你用一句话介绍自己。",
    choices: [
      {
        id: "core",
        label: "我能啃核心技术，也会把范围拆到今天能交付。",
        signals: ["laoda", "bigdog"],
        next: "core-ownership",
      },
      {
        id: "experience",
        label: "我会从用户路径开始，把功能做得一眼就懂。",
        signals: ["nailong", "bigdog"],
        next: "experience-ownership",
      },
      {
        id: "delivery",
        label: "我擅长补位、联调和排错，最后交付我会守住。",
        signals: ["gugugaga", "maodie"],
        next: "team-ownership",
      },
      {
        id: "spark",
        label: "我敢试新东西，也能把 Demo 讲出记忆点。",
        signals: ["mowan", "shitter"],
        next: "demo-ownership",
      },
    ],
  },
  "core-ownership": {
    id: "core-ownership",
    dimension: "ownership",
    eyebrow: "认领 / 核心构建",
    title: "队伍把最难的一块交给你，你会怎样认领？",
    choices: [
      {
        id: "architecture",
        label: "先定边界和最小架构，再独立把主链路跑通。",
        signals: ["laoda", "bigdog"],
        next: "prototype-proof",
      },
      {
        id: "new-stack",
        label: "先用陌生 API 做小实验，能跑再扩大。",
        signals: ["mowan", "laoda"],
        next: "prototype-proof",
      },
      {
        id: "stable-core",
        label: "先补日志、契约和回滚点，别让核心变黑盒。",
        signals: ["gugugaga", "maodie"],
        next: "failure-proof",
      },
      {
        id: "demo-first",
        label: "先确认它如何进入演示，技术要服务最终体验。",
        signals: ["jiahao", "nailong"],
        next: "story-proof",
      },
    ],
  },
  "experience-ownership": {
    id: "experience-ownership",
    dimension: "ownership",
    eyebrow: "认领 / 用户体验",
    title: "你说自己负责“体验”，具体会先交付什么？",
    choices: [
      {
        id: "journey",
        label: "一条从问题到结果的完整用户路径。",
        signals: ["bigdog", "nailong"],
        next: "user-proof",
      },
      {
        id: "interface",
        label: "一套清楚、顺手、能建立信任的界面。",
        signals: ["nailong", "gugugaga"],
        next: "user-proof",
      },
      {
        id: "real-data",
        label: "先把前后端和真实数据接起来，拒绝假按钮。",
        signals: ["gugugaga", "laoda"],
        next: "failure-proof",
      },
      {
        id: "wow-moment",
        label: "先做评委三秒能记住的核心画面。",
        signals: ["jiahao", "nailong"],
        next: "story-proof",
      },
    ],
  },
  "team-ownership": {
    id: "team-ownership",
    dimension: "ownership",
    eyebrow: "认领 / 交付保障",
    title: "你说自己能“兜底”，队友会具体看到什么？",
    choices: [
      {
        id: "contracts",
        label: "接口、环境、部署都有明确主人和检查点。",
        signals: ["gugugaga", "bigdog"],
        next: "failure-proof",
      },
      {
        id: "root-cause",
        label: "异常出现时，我会沿日志追到真正根因。",
        signals: ["maodie", "laoda"],
        next: "failure-proof",
      },
      {
        id: "cut-scope",
        label: "及时重排优先级，保护所有人能完成的版本。",
        signals: ["bigdog", "nailong"],
        next: "user-proof",
      },
      {
        id: "detour",
        label: "原路堵死时，我会试一条可验证的绕行方案。",
        signals: ["shitter", "mowan"],
        next: "prototype-proof",
      },
    ],
  },
  "demo-ownership": {
    id: "demo-ownership",
    dimension: "ownership",
    eyebrow: "认领 / 现场表达",
    title: "你说自己能让项目被记住，靠的是什么？",
    choices: [
      {
        id: "narrative",
        label: "把问题、转折和价值讲成一条有起伏的故事。",
        signals: ["jiahao", "nailong"],
        next: "story-proof",
      },
      {
        id: "polish",
        label: "把屏幕和动线收干净，让第一眼替我说话。",
        signals: ["nailong", "jiahao"],
        next: "user-proof",
      },
      {
        id: "surprise",
        label: "把 AI、API 或硬件拼成一个没见过的效果。",
        signals: ["mowan", "shitter"],
        next: "prototype-proof",
      },
      {
        id: "rehearsal",
        label: "准备稳定主路径和备用路线，现场不靠运气。",
        signals: ["gugugaga", "bigdog"],
        next: "failure-proof",
      },
    ],
  },
  "prototype-proof": {
    id: "prototype-proof",
    dimension: "proof",
    eyebrow: "验证 / 新想法",
    title: "一个新方案很酷，但没人知道能不能成。",
    choices: [
      {
        id: "smallest-test",
        label: "做最小实验，只验证最危险的假设。",
        signals: ["mowan", "bigdog"],
        next: "novelty-pressure",
      },
      {
        id: "build-spike",
        label: "写一条技术尖刺，先证明关键调用能跑。",
        signals: ["laoda", "maodie"],
        next: "bug-pressure",
      },
      {
        id: "user-value",
        label: "先问它替用户省了哪一步，再决定值不值得做。",
        signals: ["maodie", "nailong"],
        next: "scope-pressure",
      },
      {
        id: "show-test",
        label: "先 hardcode 一个十秒现场，能把效果演出来再说。",
        signals: ["shitter", "jiahao"],
        next: "novelty-pressure",
      },
    ],
  },
  "user-proof": {
    id: "user-proof",
    dimension: "proof",
    eyebrow: "验证 / 用户路径",
    title: "第一位试玩者说：“我不知道下一步点哪里。”",
    choices: [
      {
        id: "observe",
        label: "让他继续操作，记录真正卡住的那一刻。",
        signals: ["maodie", "nailong"],
        next: "scope-pressure",
      },
      {
        id: "hierarchy",
        label: "重做信息层级和反馈，让主动作自己浮出来。",
        signals: ["nailong", "maodie"],
        next: "integration-pressure",
      },
      {
        id: "simplify",
        label: "砍掉支线，把一次成功路径缩到最短。",
        signals: ["bigdog", "gugugaga"],
        next: "scope-pressure",
      },
      {
        id: "guided-demo",
        label: "先做一段引导式体验，让价值在十秒内出现。",
        signals: ["jiahao", "nailong"],
        next: "integration-pressure",
      },
    ],
  },
  "failure-proof": {
    id: "failure-proof",
    dimension: "proof",
    eyebrow: "验证 / 交付链路",
    title: "本机没问题，一到队友电脑就坏。",
    choices: [
      {
        id: "reproduce",
        label: "先稳定复现，再从环境差异一路缩小范围。",
        signals: ["maodie", "laoda"],
        next: "bug-pressure",
      },
      {
        id: "standardize",
        label: "统一启动方式、环境变量和依赖版本。",
        signals: ["gugugaga", "bigdog"],
        next: "integration-pressure",
      },
      {
        id: "fallback",
        label: "保留真实主链路，同时准备能解释清楚的降级方案。",
        signals: ["shitter", "gugugaga"],
        next: "scope-pressure",
      },
      {
        id: "swap-part",
        label: "换掉最不稳定的组件，用更小方案绕过去。",
        signals: ["shitter", "mowan"],
        next: "novelty-pressure",
      },
    ],
  },
  "story-proof": {
    id: "story-proof",
    dimension: "proof",
    eyebrow: "验证 / 演示叙事",
    title: "队友说：“功能很多，但我记不住你们做了什么。”",
    choices: [
      {
        id: "one-line",
        label: "把价值压成一句话，所有功能都围着它排队。",
        signals: ["bigdog", "nailong"],
        next: "scope-pressure",
      },
      {
        id: "live-moment",
        label: "设计一个现场转折，让结果在台上真正发生。",
        signals: ["jiahao", "mowan"],
        next: "novelty-pressure",
      },
      {
        id: "visual-anchor",
        label: "做一个贯穿全程的视觉锚点，减少解释。",
        signals: ["nailong", "jiahao"],
        next: "integration-pressure",
      },
      {
        id: "proof",
        label: "把最硬的技术证据放到价值之后，证明不是空壳。",
        signals: ["laoda", "nailong"],
        next: "bug-pressure",
      },
    ],
  },
  "scope-pressure": {
    id: "scope-pressure",
    dimension: "pressure",
    eyebrow: "取舍 / 时间压力",
    title: "只剩四小时，需求还在增加。",
    choices: [
      {
        id: "freeze",
        label: "冻结目标，按演示价值重排唯一剩余清单。",
        signals: ["bigdog", "gugugaga"],
        next: "teammate-blocked",
      },
      {
        id: "journey-cut",
        label: "保住用户必须走通的路径，其余先拿掉。",
        signals: ["bigdog", "nailong"],
        next: "unclear-feedback",
      },
      {
        id: "core-only",
        label: "保住真正有技术含量的核心，其余用薄壳承接。",
        signals: ["laoda", "gugugaga"],
        next: "teammate-blocked",
      },
      {
        id: "stage-cut",
        label: "只留下最能制造记忆点的一次完整展示。",
        signals: ["jiahao", "nailong"],
        next: "unclear-feedback",
      },
    ],
  },
  "integration-pressure": {
    id: "integration-pressure",
    dimension: "pressure",
    eyebrow: "取舍 / 模块碰撞",
    title: "两个模块各自都能跑，一接起来就互相拖垮。",
    choices: [
      {
        id: "contract-first",
        label: "先钉死输入输出和失败语义，再逐段接回去。",
        signals: ["gugugaga", "bigdog"],
        next: "teammate-blocked",
      },
      {
        id: "trace-boundary",
        label: "沿边界加观测，找出状态从哪里开始不一致。",
        signals: ["maodie", "laoda"],
        next: "teammate-blocked",
      },
      {
        id: "smooth-shell",
        label: "先让用户侧反馈完整，内部慢慢替换为真实链路。",
        signals: ["nailong", "gugugaga"],
        next: "unclear-feedback",
      },
      {
        id: "alternate-join",
        label: "试一个更轻的连接方式，快速比较两条路线。",
        signals: ["mowan", "maodie"],
        next: "unclear-feedback",
      },
    ],
  },
  "bug-pressure": {
    id: "bug-pressure",
    dimension: "pressure",
    eyebrow: "取舍 / 故障现场",
    title: "一个偶发 Bug 每五次才出现一次。",
    choices: [
      {
        id: "instrument",
        label: "补足日志和最小复现，让偶发变成可追踪。",
        signals: ["maodie", "laoda"],
        next: "teammate-blocked",
      },
      {
        id: "contain",
        label: "先隔离影响面和恢复动作，确保它拖不垮 Demo。",
        signals: ["gugugaga", "bigdog"],
        next: "teammate-blocked",
      },
      {
        id: "remove-trigger",
        label: "调整用户路径，暂时避开不创造价值的触发条件。",
        signals: ["maodie", "nailong"],
        next: "unclear-feedback",
      },
      {
        id: "replace",
        label: "换成更小的新实现，给旧方案设一道停止线。",
        signals: ["mowan", "maodie"],
        next: "unclear-feedback",
      },
    ],
  },
  "novelty-pressure": {
    id: "novelty-pressure",
    dimension: "pressure",
    eyebrow: "取舍 / 实验失控",
    title: "最吸睛的新效果开始吞掉整队时间。",
    choices: [
      {
        id: "time-box",
        label: "给它最后一个小实验窗口，到点用证据决定去留。",
        signals: ["mowan", "bigdog"],
        next: "unclear-feedback",
      },
      {
        id: "stabilize",
        label: "把效果收缩成可控组件，先守住主链路。",
        signals: ["laoda", "gugugaga"],
        next: "teammate-blocked",
      },
      {
        id: "stage-illusion",
        label: "观众只看那一秒，其余先用临时补丁接上。",
        signals: ["shitter", "jiahao"],
        next: "unclear-feedback",
      },
      {
        id: "value-check",
        label: "回到用户问题；没有改变结果，就果断拿掉。",
        signals: ["maodie", "nailong"],
        next: "teammate-blocked",
      },
    ],
  },
  "teammate-blocked": {
    id: "teammate-blocked",
    dimension: "collaboration",
    eyebrow: "协作 / 队友卡住",
    title: "凌晨一点，队友说：“我这块可能赶不上了。”",
    choices: [
      {
        id: "pair-debug",
        label: "和他并肩复现问题，先找到最小阻塞点。",
        signals: ["maodie", "gugugaga"],
        next: "night-shift",
      },
      {
        id: "take-boundary",
        label: "接过清晰的一段边界，让两边还能并行。",
        signals: ["gugugaga", "laoda"],
        next: "night-shift",
      },
      {
        id: "rescope-team",
        label: "召集大家重排范围，不让一个人静默扛完。",
        signals: ["bigdog", "nailong"],
        next: "night-shift",
      },
      {
        id: "prototype-detour",
        label: "给他一个能马上验证的替代方案，一起试十分钟。",
        signals: ["mowan", "laoda"],
        next: "night-shift",
      },
    ],
  },
  "unclear-feedback": {
    id: "unclear-feedback",
    dimension: "collaboration",
    eyebrow: "协作 / 意见冲突",
    title: "队友说“感觉不对”，但讲不出哪里不对。",
    choices: [
      {
        id: "criteria",
        label: "把判断标准写出来，用目标和时间结束空转。",
        signals: ["bigdog", "gugugaga"],
        next: "night-shift",
      },
      {
        id: "watch-use",
        label: "让他现场走一遍，我观察是哪一步失去信心。",
        signals: ["nailong", "maodie"],
        next: "night-shift",
      },
      {
        id: "two-versions",
        label: "先搓两个临时版本，能结束争论的那个留下。",
        signals: ["shitter", "mowan"],
        next: "night-shift",
      },
      {
        id: "pitch-back",
        label: "请他用一句话复述价值，再重组我们的表达。",
        signals: ["jiahao", "nailong"],
        next: "night-shift",
      },
    ],
  },
  "night-shift": {
    id: "night-shift",
    dimension: "finish",
    eyebrow: "深夜 / 最后冲刺",
    title: "凌晨三点，整队只够再做好一件事。",
    choices: [
      {
        id: "critical-path",
        label: "守着控制台边跑边补，哪里冒烟就先按下去。",
        signals: ["shitter", "maodie"],
        next: "final-three-minutes",
      },
      {
        id: "core-capability",
        label: "让核心能力真实完成一次，不靠截图和口头承诺。",
        signals: ["laoda", "mowan"],
        next: "final-three-minutes",
      },
      {
        id: "first-use",
        label: "把第一次使用磨顺，让陌生人也能走到结果。",
        signals: ["nailong", "gugugaga"],
        next: "final-three-minutes",
      },
      {
        id: "rehearse",
        label: "完整彩排一次，把最有力量的时刻打准。",
        signals: ["jiahao", "bigdog"],
        next: "final-three-minutes",
      },
    ],
  },
  "final-three-minutes": {
    id: "final-three-minutes",
    dimension: "demo",
    eyebrow: "上台 / 三分钟前",
    title: "评委三分钟后到桌前，你自然会站到哪里？",
    choices: [
      {
        id: "control-room",
        label: "蹲在控制台手动续命，出错就当场打补丁。",
        signals: ["shitter", "gugugaga"],
        next: "complete",
      },
      {
        id: "engine-room",
        label: "守着核心系统，随时解释最硬的技术选择。",
        signals: ["laoda", "mowan"],
        next: "complete",
      },
      {
        id: "user-seat",
        label: "站在屏幕旁，确保路径、文字和画面都清楚。",
        signals: ["nailong", "jiahao"],
        next: "complete",
      },
      {
        id: "center-stage",
        label: "站到最前面，把全队成果讲成一个现场。",
        signals: ["jiahao", "bigdog"],
        next: "complete",
      },
    ],
  },
};

export function getQuizChoice(questionId: QuizQuestionId, choiceId: string): QuizChoice {
  const choice = questionBank[questionId].choices.find((candidate) => candidate.id === choiceId);
  if (!choice) {
    throw new RangeError(`Unknown choice "${choiceId}" for question "${questionId}"`);
  }
  return choice;
}

export function getNextQuestionId(
  questionId: QuizQuestionId,
  choiceId: string,
): QuizQuestionId | "complete" {
  return getQuizChoice(questionId, choiceId).next;
}

export function createPersonaScores(): PersonaScores {
  return {
    laoda: 0,
    bigdog: 0,
    maodie: 0,
    mowan: 0,
    gugugaga: 0,
    shitter: 0,
    nailong: 0,
    jiahao: 0,
  };
}

export function scoreQuizAnswers(answers: readonly QuizAnswer[]): PersonaScores {
  const scores = createPersonaScores();

  for (const answer of answers) {
    const choice = getQuizChoice(answer.questionId, answer.choiceId);
    choice.signals.forEach((personaId, index) => {
      scores[personaId] += index === 0 ? 2 : 1;
    });
  }

  return scores;
}

export function selectBalancedPersona(
  scores: Readonly<PersonaScores>,
  recentCounts?: Readonly<PersonaScores>,
  threshold = BALANCE_SCORE_THRESHOLD,
): PersonaId {
  if (!Number.isFinite(threshold) || threshold < 0) {
    throw new RangeError("threshold must be a finite number greater than or equal to 0");
  }

  const ranked = [...personaIds].sort(
    (left, right) =>
      scores[right] - scores[left] ||
      personaIds.indexOf(left) - personaIds.indexOf(right),
  );
  const topScore = scores[ranked[0]];
  const closeCandidates = ranked.filter((personaId) => topScore - scores[personaId] <= threshold);

  if (!recentCounts) return closeCandidates[0];

  return closeCandidates.sort(
    (left, right) =>
      recentCounts[left] - recentCounts[right] ||
      scores[right] - scores[left] ||
      personaIds.indexOf(left) - personaIds.indexOf(right),
  )[0];
}

export function classifyQuizAnswers(
  answers: readonly QuizAnswer[],
  recentCounts?: Readonly<PersonaScores>,
): PersonaId {
  return selectBalancedPersona(scoreQuizAnswers(answers), recentCounts);
}

export function buildQuizContext(answers: readonly QuizAnswer[], freeText: string): QuizContext {
  if (answers.length !== MAX_CHOICE_QUESTIONS) {
    throw new RangeError(`Expected ${MAX_CHOICE_QUESTIONS} choice answers, received ${answers.length}`);
  }

  let expectedQuestionId: QuizQuestionId | "complete" = START_QUESTION_ID;
  const responses: QuizContext["responses"] = [];
  for (const [index, answer] of answers.entries()) {
    if (answer.questionId !== expectedQuestionId) {
      throw new Error(
        `Invalid quiz path at answer ${index + 1}: expected "${expectedQuestionId}", received "${answer.questionId}"`,
      );
    }

    const question = questionBank[answer.questionId];
    const choice = getQuizChoice(answer.questionId, answer.choiceId);
    expectedQuestionId = choice.next;

    responses.push({
      number: index + 1,
      question: question.title,
      answer: choice.label,
    });
  }

  if (expectedQuestionId !== "complete") {
    throw new Error(`Quiz path ended at "${expectedQuestionId}" instead of "complete"`);
  }

  responses.push({
    number: TOTAL_QUIZ_STEPS,
    question: FREE_TEXT_PROMPT,
    answer: freeText.trim() || "未填写",
  });

  return { version: "adaptive-v2", responses };
}
