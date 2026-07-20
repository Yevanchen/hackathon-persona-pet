import { useState, type CSSProperties } from "react";
import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from "motion/react";
import { personaIds, personas, type Persona } from "./personas";
import { PetVisual } from "./PetVisual";
import {
  FREE_TEXT_PROMPT,
  START_QUESTION_ID,
  TOTAL_QUIZ_STEPS,
  buildQuizContext,
  classifyQuizAnswers,
  createPersonaScores,
  getNextQuestionId,
  questionBank,
  type QuizAnswer,
  type QuizContext,
  type QuizQuestion,
  type QuizQuestionId,
  type PersonaScores,
} from "./quiz";

const introRoster = [
  { name: "牢大", tagline: "熬夜当主程" },
  { name: "大狗叫", tagline: "为项目激情开麦" },
  { name: "耄耋", tagline: "一言不合就哈气" },
  { name: "魔丸", tagline: "删库关服就跑路" },
  { name: "咕咕嘎嘎", tagline: "群聊贡献百分百" },
  { name: "Shitter", tagline: "在码仓拉屎" },
  { name: "奶蛙", tagline: "全程爆笑捧场" },
  { name: "嘉豪", tagline: "重新定义小功能" },
] as const;

const RESULT_COUNTS_KEY = "hackathon-persona-counts-v2";

function loadPersonaCounts(): PersonaScores {
  const counts = createPersonaScores();
  try {
    const stored = localStorage.getItem(RESULT_COUNTS_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    if (!parsed || typeof parsed !== "object") return counts;

    for (const id of personaIds) {
      const value = (parsed as Record<string, unknown>)[id];
      if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) counts[id] = value;
    }
  } catch {
    return counts;
  }
  return counts;
}

function savePersonaCounts(counts: PersonaScores) {
  try {
    localStorage.setItem(RESULT_COUNTS_KEY, JSON.stringify(counts));
  } catch {
    // The quiz still works when storage is unavailable; only the local balancing history resets.
  }
}

type Phase = "intro" | "quiz" | "hatching" | "result";

type FamiliarName = "squish" | "rondo" | "wedge" | "brick" | "archie" | "elbow" | "zap";

function Familiar({ name, className }: { name: FamiliarName; className: string }) {
  return (
    <img
      src={`/familiars/${name}.svg`}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`familiar ${className}`}
    />
  );
}

const quizCast: FamiliarName[] = ["squish", "wedge", "elbow", "rondo", "zap", "brick", "archie"];

const easeOut = [0.16, 1, 0.3, 1] as const;

const cascade: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const cascadeItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } },
};

function Header({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`topbar ${compact ? "topbar--compact" : ""}`}>
      <div className="brand-mark" aria-label="Hackathon Familiar">
        <span>HACK</span>
        <b>FAMILIAR</b>
      </div>
      <div className="event-code">
        TECHNOLOGY FESTIVAL
        <span>NO LOGIN · 8 CLASSES</span>
      </div>
    </header>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main id="main-content" className="screen intro-screen">
      <Familiar name="rondo" className="familiar--page-1" />
      <Familiar name="brick" className="familiar--page-2" />
      <Familiar name="elbow" className="familiar--page-3" />

      <div className="ticket-wrap">
        <Familiar name="archie" className="familiar--ticket-peek" />
        <Familiar name="zap" className="familiar--ticket-corner" />
        <Familiar name="squish" className="familiar--ticket-left" />
        <Familiar name="wedge" className="familiar--ticket-bottom" />

        <section className="ticket" aria-labelledby="intro-title">
          <div className="ticket-main">
            <div className="ticket-head">
              <div className="ticket-stamp" aria-hidden="true">
                黑客松分类办公室
                <span>CLASSIFICATION OFFICE · 2026</span>
              </div>
              <div className="ticket-no" aria-hidden="true">
                ADMIT ONE
                <br />
                NO. 0847
              </div>
            </div>

            <h1 id="intro-title">
              领取你的
              <br />
              黑客松职业
            </h1>
            <p className="intro-lead">
              最多八问；你的现场选择会改变后续题目。无需登录，看看会把哪只 Codex Pet 交给你。
            </p>

            <div className="intro-actions">
              <button className="primary-button" type="button" onClick={onStart}>
                开始匹配 <span aria-hidden="true">→</span>
              </button>
              <span className="time-note">约 60–90 秒</span>
            </div>
          </div>

          <div className="ticket-perf" aria-hidden="true" />

          <div className="ticket-stub" aria-label="八种黑客松人格">
            <p className="ticket-stub-title">本处签发以下职业 · GUILD ROSTER</p>
            <ol className="ticket-roster">
              {introRoster.map(({ name, tagline }, index) => (
                <li key={name} style={{ "--i": index } as CSSProperties}>
                  <span className="num">{String(index + 1).padStart(2, "0")}</span>
                  <b>{name}</b>
                  <small>{tagline}</small>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="mosoo-credit">
          <span>POWERED BY</span>
          <img src="/mosoo-logo.svg" alt="Mosoo" />
        </div>
      </div>
    </main>
  );
}

type QuizProps = {
  isTextStep: boolean;
  question: QuizQuestion;
  selectedChoiceId: string;
  visibleStep: number;
  freeText: string;
  error: string;
  onChoose: (choiceId: string) => void;
  onText: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

function Quiz({
  isTextStep,
  question,
  selectedChoiceId,
  visibleStep,
  freeText,
  error,
  onChoose,
  onText,
  onBack,
  onNext,
}: QuizProps) {
  const progress = (visibleStep / TOTAL_QUIZ_STEPS) * 100;
  const watcher = quizCast[(visibleStep - 1) % quizCast.length];

  return (
    <main id="main-content" className="screen quiz-screen">
      <aside className="quiz-progress" aria-label={`进度 ${visibleStep} / ${TOTAL_QUIZ_STEPS}`}>
        <span className="progress-number">{String(visibleStep).padStart(2, "0")}</span>
        <div
          className="progress-track"
          aria-hidden="true"
          style={{ "--progress": progress / 100 } as CSSProperties}
        >
          <span />
        </div>
        <span className="progress-total">/{String(TOTAL_QUIZ_STEPS).padStart(2, "0")}</span>
        <Familiar name={watcher} className="familiar--rail" />
      </aside>

      <section className="question-panel">
        <div className="question-content" key={isTextStep ? "free-text" : question.id}>
          <p className="kicker">{isTextStep ? "自白 / 补充信号" : question.eyebrow}</p>
          <h1>{isTextStep ? FREE_TEXT_PROMPT : question.title}</h1>

          {isTextStep ? (
            <div className="text-answer">
              <Familiar name={watcher} className="familiar--quiz" />
              <label htmlFor="night-answer">选填，不需要认真得像周报。</label>
              <textarea
                id="night-answer"
                value={freeText}
                maxLength={80}
                rows={4}
                placeholder="例如：还在和最后一个 500 错误谈判……"
                onChange={(event) => onText(event.target.value)}
              />
              <span>{freeText.length}/80</span>
            </div>
          ) : (
            <fieldset className="choices" aria-describedby={error ? "choice-error" : undefined}>
              <legend className="sr-only">选择最像你的做法</legend>
              <Familiar name={watcher} className="familiar--quiz" />
              {question.choices.map((choice, index) => {
                const checked = selectedChoiceId === choice.id;
                return (
                  <label
                    className="choice"
                    key={choice.id}
                    style={{ "--i": index } as CSSProperties}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={choice.id}
                      checked={checked}
                      onChange={() => onChoose(choice.id)}
                    />
                    <m.span
                      className="choice-index"
                      initial={false}
                      animate={checked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                      transition={{ duration: 0.18, times: [0, 0.4, 1], ease: easeOut }}
                    >
                      {String.fromCharCode(65 + index)}
                    </m.span>
                    <span>{choice.label}</span>
                    <i aria-hidden="true">↗</i>
                  </label>
                );
              })}
            </fieldset>
          )}
        </div>

        <p className="form-error" id="choice-error" aria-live="polite">
          {error}
        </p>

        <div className="quiz-actions">
          <button className="text-button" type="button" onClick={onBack}>
            ← 返回
          </button>
          <button className="primary-button" type="button" onClick={onNext}>
            {isTextStep ? "孵化我的职业" : "下一题"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function Hatching({ responseCount }: { responseCount: number }) {
  return (
    <main id="main-content" className="screen hatching-screen" aria-live="polite">
      <Familiar name="wedge" className="familiar--hatch-left" />
      <Familiar name="squish" className="familiar--hatch-right" />
      <div className="hatch-seal" aria-hidden="true">
        <span>?</span>
      </div>
      <p className="kicker">MATCHING YOUR GUILD SIGNAL</p>
      <h1>正在翻找你的职业档案…</h1>
      <p>已整理 {responseCount} 段现场信号；当前为本地匹配，正式版将一次提交给模型。</p>
    </main>
  );
}

function Result({ persona, sessionId, onRestart }: { persona: Persona; sessionId: string; onRestart: () => void }) {
  const classNumber = personaIds.indexOf(persona.id) + 1;

  return (
    <main id="main-content" className="screen result-screen">
      <section className="result-visual">
        <p className="kicker">YOUR HACKATHON CLASS / ADAPTIVE MOCK</p>
        <m.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.2,
            opacity: { duration: 0.2, ease: easeOut },
          }}
        >
          <PetVisual persona={persona} />
        </m.div>
        <div className="session-ticket">
          <span>SESSION</span>
          <code>{sessionId}</code>
        </div>
        <Familiar name="rondo" className="familiar--result" />
      </section>

      <m.section
        className="result-copy"
        aria-labelledby="result-title"
        variants={cascade}
        initial="hidden"
        animate="show"
      >
        <m.div className="result-number" variants={cascadeItem}>
          CLASS / {String(classNumber).padStart(2, "0")}
        </m.div>
        <m.h1 id="result-title" variants={cascadeItem}>
          <span>{persona.english}</span>
          {persona.chinese}
        </m.h1>
        <m.p className="result-description" variants={cascadeItem}>
          {persona.description}
        </m.p>

        <m.section className="persona-stats" variants={cascadeItem} aria-labelledby="persona-stats-title">
          <div className="persona-stats-head">
            <h2 id="persona-stats-title">角色梗值</h2>
            <span>STATIC BUILD / 100</span>
          </div>
          <ul>
            {persona.stats.map(({ label, value }) => (
              <li key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <meter
                  min="0"
                  max="100"
                  value={value}
                  aria-label={`${label} ${value} 分`}
                  style={{ "--meter-color": persona.color } as CSSProperties}
                />
              </li>
            ))}
          </ul>
          <p>固定人设值，仅供玩梗，不代表能力排名。</p>
        </m.section>

        <m.div className="result-facts" variants={cascadeItem}>
          <div>
            <h2>你的被动技能</h2>
            <ul>
              {persona.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>过载警告</h2>
            <p>{persona.warning}</p>
          </div>
        </m.div>

        <m.div className="result-actions" variants={cascadeItem}>
          <a className="primary-button pet-download" href={persona.petArchive} download>
            下载这只 Pet <span aria-hidden="true">↓</span>
          </a>
          <button className="text-button" type="button" onClick={onRestart}>再测一次 ↻</button>
        </m.div>
      </m.section>
    </main>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionId, setQuestionId] = useState<QuizQuestionId>(START_QUESTION_ID);
  const [history, setHistory] = useState<QuizAnswer[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState("");
  const [isTextStep, setIsTextStep] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [error, setError] = useState("");
  const [resultCounts, setResultCounts] = useState(loadPersonaCounts);
  const [result, setResult] = useState<{
    persona: Persona;
    sessionId: string;
    context: QuizContext;
  } | null>(null);

  function start() {
    setPhase("quiz");
    setQuestionId(START_QUESTION_ID);
    setHistory([]);
    setSelectedChoiceId("");
    setIsTextStep(false);
    setFreeText("");
    setError("");
    setResult(null);
  }

  function choose(choiceId: string) {
    setSelectedChoiceId(choiceId);
    setError("");
  }

  function back() {
    const previousAnswer = history.at(-1);
    if (!previousAnswer) {
      setPhase("intro");
      return;
    }

    setHistory((current) => current.slice(0, -1));
    setQuestionId(previousAnswer.questionId);
    setSelectedChoiceId(previousAnswer.choiceId);
    setIsTextStep(false);
    setError("");
  }

  function next() {
    if (!isTextStep && !selectedChoiceId) {
      setError("先选一个最像你的做法，再继续。");
      return;
    }

    if (!isTextStep) {
      const answer = { questionId, choiceId: selectedChoiceId };
      const nextHistory = [...history, answer];
      const nextQuestionId = getNextQuestionId(questionId, selectedChoiceId);
      setHistory(nextHistory);
      setSelectedChoiceId("");
      if (nextQuestionId === "complete") {
        setIsTextStep(true);
      } else {
        setQuestionId(nextQuestionId);
      }
      setError("");
      return;
    }

    const context = buildQuizContext(history, freeText);
    const personaId = classifyQuizAnswers(history, resultCounts);
    const persona = personas[personaId];
    const sessionId = crypto.randomUUID();
    setResultCounts((current) => {
      const updated = { ...current, [personaId]: current[personaId] + 1 };
      savePersonaCounts(updated);
      return updated;
    });
    setResult({ persona, sessionId, context });
    setPhase("hatching");
    window.setTimeout(() => setPhase("result"), 1100);
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className={`app app--${phase}`}>
          <Header compact={phase !== "intro"} />
          {phase === "intro" && <Intro onStart={start} />}
          {phase === "quiz" && (
            <Quiz
              isTextStep={isTextStep}
              question={questionBank[questionId]}
              selectedChoiceId={selectedChoiceId}
              visibleStep={isTextStep ? TOTAL_QUIZ_STEPS : history.length + 1}
              freeText={freeText}
              error={error}
              onChoose={choose}
              onText={setFreeText}
              onBack={back}
              onNext={next}
            />
          )}
          {phase === "hatching" && (
            <Hatching responseCount={result?.context.responses.length ?? TOTAL_QUIZ_STEPS} />
          )}
          {phase === "result" && result && (
            <Result persona={result.persona} sessionId={result.sessionId} onRestart={start} />
          )}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
