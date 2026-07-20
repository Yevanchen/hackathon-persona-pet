import { useRef, useState, type CSSProperties } from "react";
import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from "motion/react";
import { personaIds, personas, type Persona } from "./personas.ts";
import { PetVisual } from "./PetVisual.tsx";
import { questionnaire as questions, scoreQuestionnaire } from "./questionnaire.ts";

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

type Phase = "intro" | "quiz" | "hatching" | "result";

// Hand-drawn geometric guild familiars (original sparkles.dev-style SVG art in
// /public/familiars). Decorative stickers: static, aria-hidden, never interactive.
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

// Decorative watchers repeat when the eight-question sequence is longer than the cast.
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
        <span>NO LOGIN · 8 QUESTIONS</span>
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
              黑客松人格
            </h1>
            <p className="intro-lead">
              八个现场选择，一套人格加分矩阵。无需登录，看看会把哪只 Codex Pet 交给你。
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
  step: number;
  answers: string[];
  onChoose: (choice: string) => void;
  onBack: () => void;
};

function Quiz({
  step,
  answers,
  onChoose,
  onBack,
}: QuizProps) {
  const total = questions.length;
  const progress = ((step + 1) / total) * 100;
  const question = questions[step];

  return (
    <main id="main-content" className="screen quiz-screen">
      <aside className="quiz-progress" aria-label={`进度 ${step + 1} / ${total}`}>
        <span className="progress-number">{String(step + 1).padStart(2, "0")}</span>
        <div
          className="progress-track"
          aria-hidden="true"
          style={{ "--progress": progress / 100 } as CSSProperties}
        >
          <span />
        </div>
        <span className="progress-total">/{String(total).padStart(2, "0")}</span>
        <Familiar name={quizCast[step % quizCast.length]} className="familiar--rail" />
      </aside>

      <section className="question-panel">
        <div className="question-content" key={step}>
          <p className="kicker">{question.eyebrow}</p>
          <h1>{question.title}</h1>

          <fieldset className="choices" disabled={Boolean(answers[step])}>
            <legend className="sr-only">选择最像你的做法</legend>
            <Familiar name={quizCast[step % quizCast.length]} className="familiar--quiz" />
            {question.choices.map((choice, index) => {
              const checked = answers[step] === choice.id;
              return (
                <label
                  className="choice"
                  key={choice.id}
                  style={{ "--i": index } as CSSProperties}
                >
                  <input
                    type="radio"
                    name={question.id}
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
        </div>

        <div className="quiz-actions">
          <button className="text-button" type="button" onClick={onBack}>
            ← 上一题
          </button>
        </div>
      </section>
    </main>
  );
}

function Hatching() {
  return (
    <main id="main-content" className="screen hatching-screen" aria-live="polite">
      <Familiar name="wedge" className="familiar--hatch-left" />
      <Familiar name="squish" className="familiar--hatch-right" />
      <div className="hatch-seal" aria-hidden="true">
        <span>?</span>
      </div>
      <p className="kicker">MATCHING YOUR GUILD SIGNAL</p>
      <h1>正在汇总你的人格分数…</h1>
      <p>逐题累加八列分值，最高分就是本次结果。</p>
    </main>
  );
}

function Result({
  persona,
  sessionId,
  onRestart,
}: {
  persona: Persona;
  sessionId: string;
  onRestart: () => void;
}) {
  const classNumber = personaIds.indexOf(persona.id) + 1;

  return (
    <main id="main-content" className="screen result-screen">
      <section className="result-visual">
        <p className="kicker">YOUR HACKATHON PERSONA / SCORE RESULT</p>
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

        <m.section
          className="persona-stats"
          variants={cascadeItem}
          aria-labelledby="persona-stats-title"
        >
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
          <button className="text-button" type="button" onClick={onRestart}>
            再测一次 ↻
          </button>
        </m.div>

        <m.div className="mosoo-credit mosoo-credit--result" variants={cascadeItem}>
          <span>POWERED BY</span>
          <img src="/mosoo-logo.svg" alt="Mosoo" />
        </m.div>
      </m.section>
    </main>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<{ persona: Persona; sessionId: string } | null>(null);
  const advanceTimer = useRef<number | null>(null);

  function clearAdvanceTimer() {
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }

  function start() {
    clearAdvanceTimer();
    setPhase("quiz");
    setStep(0);
    setAnswers([]);
    setResult(null);
  }

  function choose(choice: string) {
    if (advanceTimer.current !== null) return;

    const nextAnswers = [...answers];
    nextAnswers[step] = choice;
    setAnswers(nextAnswers);

    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      if (step < questions.length - 1) {
        setStep(step + 1);
        return;
      }

      const scoringResult = scoreQuestionnaire(nextAnswers);
      const persona = personas[scoringResult.personaId];
      setResult({ persona, sessionId: crypto.randomUUID() });
      setPhase("hatching");
      window.setTimeout(() => setPhase("result"), 1100);
    }, 320);
  }

  function back() {
    clearAdvanceTimer();
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setAnswers((current) => current.slice(0, step - 1));
    setStep(step - 1);
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className={`app app--${phase}`}>
          <Header compact={phase !== "intro"} />
          {phase === "intro" && <Intro onStart={start} />}
          {phase === "quiz" && (
            <Quiz
              step={step}
              answers={answers}
              onChoose={choose}
              onBack={back}
            />
          )}
          {phase === "hatching" && <Hatching />}
          {phase === "result" && result && (
            <Result persona={result.persona} sessionId={result.sessionId} onRestart={start} />
          )}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
