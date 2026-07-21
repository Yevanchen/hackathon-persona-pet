import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { personaIds, personas, type Persona } from "./personas.ts";
import { PetVisual } from "./PetVisual.tsx";
import { questionnaire as questions, scoreQuestionnaire } from "./questionnaire.ts";
import { createResultPath, parseResultLink } from "./resultLink.ts";

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

type ResultState = {
  persona: Persona;
  sessionId: string;
};

const wait = (durationMs: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, durationMs));

function preloadPetSprite(src: string) {
  const image = new Image();
  image.src = src;
  // ponytail: Stop gating the result after five seconds; the CSS background
  // keeps loading if venue Wi-Fi is unusually slow.
  return Promise.race([image.decode().catch(() => undefined), wait(5000)]);
}

const sharedResultLink = parseResultLink(window.location.search);
const initialResult: ResultState | null = sharedResultLink
  ? {
      persona: personas[sharedResultLink.personaId],
      sessionId: sharedResultLink.sessionId,
    }
  : null;
const initialSpriteReady = initialResult
  ? preloadPetSprite(initialResult.persona.petSprite)
  : null;

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

const questionTransition: Variants = {
  enter: { opacity: 0, y: 12, scale: 0.985 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.24, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.992,
    transition: { duration: 0.14, ease: [0.7, 0, 0.84, 0] },
  },
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

      <section className="question-panel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            className="question-content"
            key={question.id}
            variants={questionTransition}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <p className="kicker">{question.eyebrow}</p>
            <h1>{question.title}</h1>

            <fieldset className="choices" disabled={Boolean(answers[step])}>
              <legend className="sr-only">选择最像你的做法</legend>
              <Familiar name={quizCast[step % quizCast.length]} className="familiar--quiz" />
              {question.choices.map((choice, index) => {
                const checked = answers[step] === choice.id;
                return (
                  <label className="choice" key={choice.id}>
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
                    <svg
                      className="choice-arrow"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M3 13 13 3M6 3h7v7" />
                    </svg>
                  </label>
                );
              })}
            </fieldset>
          </m.div>
        </AnimatePresence>

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
      <p className="kicker">PREPARING YOUR FAMILIAR</p>
      <h1>人格已锁定，正在召唤你的 Pet…</h1>
      <p>马上就见面。</p>
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
  const resultUrl = new URL(
    createResultPath({ personaId: persona.id, sessionId }),
    window.location.origin,
  ).toString();
  const canShare = typeof navigator.share === "function";
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  const [shareStatus, setShareStatus] = useState("");

  async function shareResult() {
    setShareStatus("");

    if (canShare) {
      try {
        await navigator.share({
          title: `我的黑客松人格：${persona.chinese}`,
          text: `我是「${persona.chinese}」——${persona.description}`,
          url: resultUrl,
        });
        setShareStatus("结果已分享");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(resultUrl);
      setShareStatus("结果链接已复制");
    } catch {
      setShareStatus("请使用浏览器菜单分享当前页面");
    }
  }

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

        <m.section
          className="result-handoff"
          variants={cascadeItem}
          aria-labelledby="result-handoff-title"
        >
          <div className="result-handoff-copy">
            <p className="kicker">TAKE IT WITH YOU</p>
            <h2 id="result-handoff-title">把这只 Pet 带走</h2>
            <p className="result-handoff-intro">
              扫码或分享链接，随时回到这只「{persona.chinese}」，不用重答。
            </p>
            <div className="result-actions result-handoff-actions">
              <button className="primary-button" type="button" onClick={shareResult}>
                {canShare ? "分享结果" : "复制结果链接"} <span aria-hidden="true">→</span>
              </button>
              <a className="text-button pet-download" href={persona.petArchive} download>
                保存 Pet ZIP ↓
              </a>
            </div>
            {isWeChat && (
              <p className="download-note">
                微信内无法保存 ZIP 时，请点右上角“在浏览器打开”。
              </p>
            )}
            <p className="share-status" aria-live="polite">
              {shareStatus}
            </p>
          </div>
          <figure className="result-qr">
            <QRCodeSVG
              value={resultUrl}
              size={168}
              level="M"
              marginSize={4}
              title={`打开${persona.chinese}结果页`}
            />
            <figcaption>扫码打开同一结果</figcaption>
          </figure>
        </m.section>

        <m.div className="result-restart" variants={cascadeItem}>
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
  const [phase, setPhase] = useState<Phase>(initialResult ? "hatching" : "intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ResultState | null>(initialResult);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!initialSpriteReady) return;
    let active = true;
    void initialSpriteReady.then(() => {
      if (active) setPhase("result");
    });
    return () => {
      active = false;
    };
  }, []);

  function clearAdvanceTimer() {
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }

  function start() {
    clearAdvanceTimer();
    window.history.replaceState(null, "", "/");
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
      const sessionId = crypto.randomUUID();
      // ponytail: Public event results live in the URL; use server persistence if
      // tamper-proof history becomes a product requirement.
      window.history.replaceState(
        null,
        "",
        createResultPath({ personaId: persona.id, sessionId }),
      );
      setResult({ persona, sessionId });
      setPhase("hatching");
      void Promise.all([preloadPetSprite(persona.petSprite), wait(1100)]).then(() =>
        setPhase("result"),
      );
    }, 280);
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
