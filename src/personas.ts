export const personaIds = [
  "kobe-laoda",
  "maodie",
  "big-dog-bark",
  "gugugaga",
  "mowan",
  "jiahao",
  "poop",
  "nailong-daxiao",
] as const;

export type PersonaId = (typeof personaIds)[number];

export interface Persona {
  id: PersonaId;
  english: string;
  chinese: string;
  description: string;
  strengths: readonly [string, string, string];
  warning: string;
  color: string;
  sigil: string;
}

export const personas = {
  "kobe-laoda": {
    id: "kobe-laoda",
    english: "Kobe Laoda",
    chinese: "科比牢大（熬夜哥）",
    description: "白天看似没动静，深夜却会进入主程巅峰；越接近 deadline，手速越快。",
    strengths: ["深夜爆发", "极限冲刺", "主程担当"],
    warning: "别把所有进度都留到凌晨，队友的心率也是项目资源。",
    color: "oklch(66% 0.18 62)",
    sigil: "24",
  },
  maodie: {
    id: "maodie",
    english: "Maodie",
    chinese: "耄耋",
    description: "敏感易怒者。很容易把一句不同意见听成针对自己，一上头就哈气、开喷、攻击队友。",
    strengths: ["高度敏感", "瞬间急眼", "主动开喷"],
    warning: "感到被冒犯，不等于别人真的在攻击你。先停一下，再决定要不要还击。",
    color: "oklch(58% 0.18 22)",
    sigil: "!",
  },
  "big-dog-bark": {
    id: "big-dog-bark",
    english: "Big Dog Bark",
    chinese: "大狗叫",
    description: "扩音器汇报官。擅长激情解说和现场表演，确保全场都听见项目的存在。",
    strengths: ["激情汇报", "现场控场", "音量压制"],
    warning: "音量能吸引注意力，但清楚的故事才能留下记忆。",
    color: "oklch(72% 0.17 77)",
    sigil: ")))",
  },
  gugugaga: {
    id: "gugugaga",
    english: "Gugugaga",
    chinese: "咕咕嘎嘎（高松灯）",
    description: "群聊搬运工。项目进度未必领先，但抽象视频库存和群聊活跃度无人能敌。",
    strengths: ["抽象搬运", "群聊续命", "素材储备"],
    warning: "转发不是 commit，偶尔也要让进度条动一下。",
    color: "oklch(67% 0.15 191)",
    sigil: "咕",
  },
  mowan: {
    id: "mowan",
    english: "Mowan",
    chinese: "魔丸",
    description: "混沌捣乱者。强推、关服务、乱改环境变量，制造事故后还能装作无事发生。",
    strengths: ["打破秩序", "意外实验", "极速跑路"],
    warning: "混沌是节目效果，不是跳过备份和 code review 的理由。",
    color: "oklch(61% 0.23 25)",
    sigil: "丸",
  },
  jiahao: {
    id: "jiahao",
    english: "Jiahao",
    chinese: "嘉豪",
    description: "术语型伪专家。专业名词张口就来，追问现在具体做什么，却只会换个更大的概念。",
    strengths: ["术语连发", "概念升维", "回避落地"],
    warning: "专业词不是烟雾弹。能说清怎么做、真正做出来，才算技术方案。",
    color: "oklch(54% 0.24 328)",
    sigil: "〽",
  },
  poop: {
    id: "poop",
    english: "Poop",
    chinese: "💩",
    description: "只按字面理解：真的在找厕所、上厕所，或者随地大小便。其他添乱行为都不算。",
    strengths: ["寻找厕所", "物理排泄", "留下实物"],
    warning: "公共卫生不是抽象行为，真的需要上厕所就去正确的地方。",
    color: "oklch(49% 0.1 57)",
    sigil: "💩",
  },
  "nailong-daxiao": {
    id: "nailong-daxiao",
    english: "Nailong Laugh",
    chinese: "奶龙大笑",
    description: "爆笑气氛组。无论别人说什么先捧腹大笑，用魔性笑声打断严肃讨论。",
    strengths: ["爆笑捧场", "气氛解冻", "压力释放"],
    warning: "笑声能救场，也要给认真说话的人留出完整的一分钟。",
    color: "oklch(78% 0.17 91)",
    sigil: "哈",
  },
} satisfies Record<PersonaId, Persona>;
