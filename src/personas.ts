export const regularPersonaIds = [
  "tactician",
  "artificer",
  "cartographer",
  "weaver",
  "warden",
  "ranger",
  "jiahao",
  "alchemist",
] as const;

export type RegularPersonaId = (typeof regularPersonaIds)[number];
export type PersonaId = RegularPersonaId | "shitter";

export type Persona = {
  id: PersonaId;
  english: string;
  chinese: string;
  description: string;
  strengths: [string, string, string];
  warning: string;
  color: string;
  sigil: string;
};

export const personas: Record<PersonaId, Persona> = {
  tactician: {
    id: "tactician",
    english: "Tactician",
    chinese: "蓝图策士",
    description: "先定义目标、拆解路线、安排优先级，让团队始终朝着可交付成果推进。",
    strengths: ["路线拆解", "节奏控制", "关键取舍"],
    warning: "别把所有变量都规划完才允许团队出发。",
    color: "oklch(53% 0.17 251)",
    sigil: "△",
  },
  artificer: {
    id: "artificer",
    english: "Artificer",
    chinese: "技栈奇械师",
    description: "喜欢独立攻克核心技术，把模型、后端、硬件或复杂系统真正做出来。",
    strengths: ["核心构建", "技术攻坚", "原型落地"],
    warning: "真正能被体验的功能，比完美但孤立的技术更重要。",
    color: "oklch(67% 0.18 63)",
    sigil: "⌘",
  },
  cartographer: {
    id: "cartographer",
    english: "Cartographer",
    chinese: "体验绘界师",
    description: "从用户旅程和评委视角倒推产品，决定功能如何组合成完整体验。",
    strengths: ["用户视角", "体验编排", "目标校准"],
    warning: "地图不是领地，尽早让真实用户踩一遍路线。",
    color: "oklch(63% 0.13 180)",
    sigil: "◎",
  },
  weaver: {
    id: "weaver",
    english: "Weaver",
    chinese: "像素织师",
    description: "把粗糙能力织成清晰、易用、有质感的界面，尤其在意交互与视觉细节。",
    strengths: ["界面表达", "交互打磨", "视觉统一"],
    warning: "先让主路径成立，再处理只有设计师会发现的一像素。",
    color: "oklch(64% 0.2 18)",
    sigil: "✦",
  },
  warden: {
    id: "warden",
    english: "Warden",
    chinese: "热修守望者",
    description: "哪里缺人就补哪里，负责连接模块、修复断点，守住项目最后交付。",
    strengths: ["模块整合", "风险兜底", "可靠交付"],
    warning: "持续救火会掩盖边界不清，记得让责任回到主人手里。",
    color: "oklch(57% 0.14 143)",
    sigil: "⬡",
  },
  ranger: {
    id: "ranger",
    english: "Ranger",
    chinese: "故障巡猎者",
    description: "对异常极其敏感，擅长追踪 Bug、定位根因、排除隐藏风险。",
    strengths: ["异常侦测", "根因定位", "压力排障"],
    warning: "不要因为还能找到 Bug，就忘了项目也需要停止线。",
    color: "oklch(49% 0.18 286)",
    sigil: "⌖",
  },
  jiahao: {
    id: "jiahao",
    english: "Jiahao",
    chinese: "嘉豪",
    description: "把每次 Demo 都当成主舞台；敢秀、敢表达、全情投入，哪怕稍微用力过猛。",
    strengths: ["现场表现", "情绪感染", "记忆点制造"],
    warning: "舞台感要为产品服务，别让姿态盖过真正的成果。",
    color: "oklch(54% 0.24 328)",
    sigil: "〽",
  },
  alchemist: {
    id: "alchemist",
    english: "Alchemist",
    chinese: "灵感炼金师",
    description: "喜欢把 AI、API、硬件和新奇想法快速混合，用实验炼出意外的产品可能。",
    strengths: ["跨界组合", "快速实验", "概念突破"],
    warning: "每多一种原料，就多一个可能在凌晨三点爆炸的接口。",
    color: "oklch(67% 0.18 121)",
    sigil: "◇",
  },
  shitter: {
    id: "shitter",
    english: "Shitter",
    chinese: "捣乱者",
    description: "稀有混沌职业：总能让计划偏航，却也常常撞出全场最难忘的意外。",
    strengths: ["打破惯性", "意外喜剧", "混沌灵感"],
    warning: "捣乱是彩蛋，不是伤害队友或破坏交付的通行证。",
    color: "oklch(70% 0.2 49)",
    sigil: "?!",
  },
};

export function pickPersonaId(draw: number): PersonaId {
  if (!Number.isFinite(draw) || draw < 0 || draw >= 1) {
    throw new RangeError("draw must be a finite number in [0, 1)");
  }
  if (draw < 0.04) return "shitter";
  return regularPersonaIds[Math.min(7, Math.floor((draw - 0.04) / 0.12))];
}

export function secureDraw(): number {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] / 0x1_0000_0000;
}

