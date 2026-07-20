import { useState, type CSSProperties } from "react";
import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from "motion/react";
import {
  personas,
  pickPersonaId,
  regularPersonaIds,
  secureDraw,
  type Persona,
} from "./personas";

const questions = [
  {
    eyebrow: "00 / 开局",
    title: "比赛刚开始，你最先做什么？",
    choices: [
      "把目标、时间和风险画成一张路线图",
      "先让最难的核心能力跑起来",
      "从用户和评委的体验倒推功能",
      "打开画布，让产品先长出一个样子",
    ],
  },
  {
    eyebrow: "01 / 认领",
    title: "团队让你选择一个主战场。",
    choices: [
      "模型、后端、硬件或核心系统",
      "前端、交互和最终视觉",
      "模块连接、部署和交付链路",
      "测试、日志和最诡异的 Bug",
    ],
  },
  {
    eyebrow: "02 / 分歧",
    title: "产品想法和技术现实撞车了。",
    choices: [
      "砍到一个能按时交付的清晰目标",
      "换一种组合方式，快速试三个小实验",
      "回到用户真正需要完成的那一步",
      "先做可点击版本，让争论变成可见体验",
    ],
  },
  {
    eyebrow: "03 / 队友",
    title: "凌晨一点，队友卡住了。",
    choices: [
      "接过断点，把两个模块先缝起来",
      "和他一起追日志，直到找到根因",
      "重排优先级，保护整队的交付节奏",
      "用一个离谱但可验证的新方案绕过去",
    ],
  },
  {
    eyebrow: "04 / 深夜",
    title: "凌晨三点，Demo 突然坏了。",
    choices: [
      "锁定最后一个稳定版本，不再加需求",
      "打开监控和控制台，从异常开始追",
      "做一条足够顺畅的备用体验路径",
      "保住核心效果，其余现场讲成故事",
    ],
  },
  {
    eyebrow: "05 / 上台",
    title: "距离评委到桌前还有三分钟。",
    choices: [
      "再确认一次目标、时间和演示顺序",
      "检查接口、网络和最后一条关键链路",
      "把屏幕收干净，让第一眼就看懂",
      "戴上耳机：现在这里就是主舞台",
    ],
  },
] as const;

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

// One watcher per quiz step (6 questions + the free-text confession).
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
        <span>NO LOGIN · 8+1 CLASSES</span>
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
              六个现场选择，一段凌晨三点的自白。无需登录，看看会把哪只 Codex Pet 交给你。
            </p>

            <div className="intro-actions">
              <button className="primary-button" type="button" onClick={onStart}>
                开始匹配 <span aria-hidden="true">→</span>
              </button>
              <span className="time-note">约 60–90 秒</span>
            </div>
          </div>

          <div className="ticket-perf" aria-hidden="true" />

          <div className="ticket-stub" aria-label="八种黑客松角色和一个隐藏职业">
            <p className="ticket-stub-title">本处签发以下职业 · GUILD ROSTER</p>
            <ol className="ticket-roster">
              {introRoster.map(({ name, tagline }, index) => (
                <li key={name} style={{ "--i": index } as CSSProperties}>
                  <span className="num">{String(index + 1).padStart(2, "0")}</span>
                  <b>{name}</b>
                  <small>{tagline}</small>
                </li>
              ))}
              <li className="classified" style={{ "--i": 8 } as CSSProperties}>
                <span className="num">+1</span>
                <b>CLASSIFIED</b>
                <small>档案封存</small>
              </li>
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
  freeText: string;
  error: string;
  onChoose: (choice: string) => void;
  onText: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

function Quiz({
  step,
  answers,
  freeText,
  error,
  onChoose,
  onText,
  onBack,
  onNext,
}: QuizProps) {
  const isTextStep = step === questions.length;
  const total = questions.length + 1;
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
          <p className="kicker">{isTextStep ? "06 / 自白" : question.eyebrow}</p>
          <h1>{isTextStep ? "凌晨三点，队伍最希望你还在做什么？" : question.title}</h1>

          {isTextStep ? (
            <div className="text-answer">
              <Familiar name={quizCast[step % quizCast.length]} className="familiar--quiz" />
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
              <Familiar name={quizCast[step % quizCast.length]} className="familiar--quiz" />
              {question.choices.map((choice, index) => {
                const checked = answers[step] === choice;
                return (
                  <label
                    className="choice"
                    key={choice}
                    style={{ "--i": index } as CSSProperties}
                  >
                    <input
                      type="radio"
                      name={`question-${step}`}
                      value={choice}
                      checked={checked}
                      onChange={() => onChoose(choice)}
                    />
                    <m.span
                      className="choice-index"
                      initial={false}
                      animate={checked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                      transition={{ duration: 0.18, times: [0, 0.4, 1], ease: easeOut }}
                    >
                      {String.fromCharCode(65 + index)}
                    </m.span>
                    <span>{choice}</span>
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

function Hatching() {
  return (
    <main id="main-content" className="screen hatching-screen" aria-live="polite">
      <Familiar name="wedge" className="familiar--hatch-left" />
      <Familiar name="squish" className="familiar--hatch-right" />
      <div className="hatch-seal" aria-hidden="true">
        <span>?</span>
      </div>
      <p className="kicker">MATCHING YOUR GUILD SIGNAL</p>
      <h1>正在翻找你的职业档案…</h1>
      <p>当前为 Mock 随机抽取，正式版将由 Mosoo 判断输入。</p>
    </main>
  );
}

function PetVisual({ persona }: { persona: Persona }) {
  if (persona.id === "jiahao") {
    return (
      <div className="pet-stage pet-stage--jiahao">
        <div className="jiahao-sprite" role="img" aria-label="嘉豪 Codex Pet 动画预览" />
        <span>候选资产预览</span>
      </div>
    );
  }

  const style = { "--pet-color": persona.color } as CSSProperties;
  return (
    <div className="pet-stage" style={style}>
      <div className="placeholder-pet" role="img" aria-label={`${persona.chinese}宠物风格占位符`}>
        <i className="pet-ear pet-ear--left" />
        <i className="pet-ear pet-ear--right" />
        <div className="pet-head">
          <i className="pet-eye pet-eye--left" />
          <i className="pet-eye pet-eye--right" />
        </div>
        <div className="pet-body">
          <b>{persona.sigil}</b>
        </div>
      </div>
      <span>正式 Pet 制作中</span>
    </div>
  );
}

function Result({ persona, sessionId, onRestart }: { persona: Persona; sessionId: string; onRestart: () => void }) {
  const classNumber =
    persona.id === "shitter"
      ? 9
      : regularPersonaIds.indexOf(persona.id as (typeof regularPersonaIds)[number]) + 1;

  return (
    <main id="main-content" className="screen result-screen">
      <section className="result-visual">
        <p className="kicker">YOUR HACKATHON CLASS / MOCK DRAW</p>
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
          <button className="primary-button" type="button" onClick={onRestart}>
            再测一次 <span aria-hidden="true">↻</span>
          </button>
          <span className="mock-note">Shitter 4% · 常规职业各 12%</span>
        </m.div>
      </m.section>
    </main>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ persona: Persona; sessionId: string } | null>(null);

  function start() {
    setPhase("quiz");
    setStep(0);
    setAnswers([]);
    setFreeText("");
    setError("");
    setResult(null);
  }

  function choose(choice: string) {
    setAnswers((current) => {
      const next = [...current];
      next[step] = choice;
      return next;
    });
    setError("");
  }

  function back() {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep((current) => current - 1);
    setError("");
  }

  function next() {
    if (step < questions.length && !answers[step]) {
      setError("先选一个最像你的做法，再继续。");
      return;
    }
    if (step < questions.length) {
      setStep((current) => current + 1);
      setError("");
      return;
    }

    const persona = personas[pickPersonaId(secureDraw())];
    const sessionId = crypto.randomUUID();
    setResult({ persona, sessionId });
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
              step={step}
              answers={answers}
              freeText={freeText}
              error={error}
              onChoose={choose}
              onText={setFreeText}
              onBack={back}
              onNext={next}
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
