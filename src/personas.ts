export const personaIds = [
  "laoda",
  "bigdog",
  "maodie",
  "mowan",
  "gugugaga",
  "shitter",
  "nailong",
  "jiahao",
] as const;

export type PersonaId = (typeof personaIds)[number];

export type Persona = {
  id: PersonaId;
  english: string;
  chinese: string;
  description: string;
  strengths: [string, string, string];
  warning: string;
  color: string;
  artwork: string;
  stats: Record<PersonaId, number>;
};

export const personaStatDefinitions: ReadonlyArray<{ id: PersonaId; label: string }> = [
  { id: "laoda", label: "深夜续航" },
  { id: "bigdog", label: "开麦分贝" },
  { id: "maodie", label: "哈气指数" },
  { id: "mowan", label: "搞事概率" },
  { id: "gugugaga", label: "群聊浓度" },
  { id: "shitter", label: "屎山适应" },
  { id: "nailong", label: "爆笑含量" },
  { id: "jiahao", label: "登场气场" },
];

export const personas: Record<PersonaId, Persona> = {
  laoda: {
    id: "laoda",
    english: "Laoda",
    chinese: "牢大",
    description: "越接近 deadline 手速越快；你愿意扛下最难的主程任务，把核心链路熬到真正能跑。",
    strengths: ["核心攻坚", "高压冲刺", "主程担当"],
    warning: "熬夜不是勋章，提前暴露风险比最后通宵更可靠。",
    color: "oklch(67% 0.18 63)",
    artwork: "/characters/01-kobe-laoda.png",
    stats: { laoda: 100, bigdog: 65, maodie: 58, mowan: 72, gugugaga: 42, shitter: 88, nailong: 38, jiahao: 80 },
  },
  bigdog: {
    id: "bigdog",
    english: "Big Dog",
    chinese: "大狗叫",
    description: "进度、风险和亮点都不会憋着；你会主动开麦，让全队和评委知道项目走到了哪一步。",
    strengths: ["项目播报", "气氛带动", "现场表达"],
    warning: "声量不是领导力；每次开麦都要带来信息或行动。",
    color: "oklch(53% 0.17 251)",
    artwork: "/characters/03-big-dog-bark.png",
    stats: { laoda: 82, bigdog: 100, maodie: 62, mowan: 70, gugugaga: 94, shitter: 64, nailong: 78, jiahao: 91 },
  },
  maodie: {
    id: "maodie",
    english: "Maodie",
    chinese: "耄耋",
    description: "一眼看到不对劲就会哈气；你对 Bug、体验断点和模糊需求异常敏感，习惯直接指出问题。",
    strengths: ["异常侦测", "直接反馈", "根因追踪"],
    warning: "先说证据再哈气，锋利的判断也需要让队友接得住。",
    color: "oklch(49% 0.18 286)",
    artwork: "/characters/02-maodie.png",
    stats: { laoda: 76, bigdog: 88, maodie: 100, mowan: 64, gugugaga: 45, shitter: 86, nailong: 22, jiahao: 61 },
  },
  mowan: {
    id: "mowan",
    english: "Mowan",
    chinese: "魔丸",
    description: "不认命也不认限制；你会把 AI、API 和硬件混在一起，用小实验撞开一条新路。",
    strengths: ["破框实验", "快速试错", "逆风翻盘"],
    warning: "实验要小步、可逆；删库关服只适合留在梗里。",
    color: "oklch(67% 0.18 121)",
    artwork: "/characters/05-mowan.png",
    stats: { laoda: 85, bigdog: 73, maodie: 79, mowan: 100, gugugaga: 48, shitter: 96, nailong: 66, jiahao: 84 },
  },
  gugugaga: {
    id: "gugugaga",
    english: "Gugugaga",
    chinese: "咕咕嘎嘎",
    description: "群聊贡献百分百不是刷屏，而是持续同步、追问和接话，让团队信息始终在线。",
    strengths: ["进度同步", "队友响应", "协作维持"],
    warning: "消息量不等于交付，记得认领一个真正属于你的结果。",
    color: "oklch(57% 0.14 143)",
    artwork: "/characters/04-gugugaga.png",
    stats: { laoda: 68, bigdog: 85, maodie: 57, mowan: 61, gugugaga: 100, shitter: 72, nailong: 74, jiahao: 59 },
  },
  shitter: {
    id: "shitter",
    english: "Shitter",
    chinese: "码仓铲屎官",
    description: "代码仓里总会留下你的抽象艺术；你擅长用非常规补丁，让已经失控的现场先跑起来。",
    strengths: ["野路子补丁", "现场续命", "混沌灵感"],
    warning: "临时补丁必须可回滚、能交接；别让队友替你收拾残局。",
    color: "oklch(70% 0.2 49)",
    artwork: "/characters/07-poop.png",
    stats: { laoda: 94, bigdog: 63, maodie: 81, mowan: 98, gugugaga: 36, shitter: 100, nailong: 51, jiahao: 49 },
  },
  nailong: {
    id: "nailong",
    english: "Nailong",
    chinese: "奶蛙",
    description: "压力越大笑得越响；你会让复杂体验变得亲切，也能在全队紧绷时提供恰到好处的捧场。",
    strengths: ["体验亲和", "压力缓冲", "爆笑捧场"],
    warning: "气氛之外也要认领明确贡献，别让笑声替代交付。",
    color: "oklch(64% 0.2 18)",
    artwork: "/characters/08-nailong-daxiao.png",
    stats: { laoda: 66, bigdog: 80, maodie: 24, mowan: 68, gugugaga: 89, shitter: 44, nailong: 100, jiahao: 77 },
  },
  jiahao: {
    id: "jiahao",
    english: "Jiahao",
    chinese: "嘉豪",
    description: "把每次 Demo 都当成主舞台；敢秀、敢表达、全情投入，哪怕只是一个小功能。",
    strengths: ["现场表现", "情绪感染", "记忆点制造"],
    warning: "舞台感要为产品服务，别让姿态盖过真正的成果。",
    color: "oklch(54% 0.24 328)",
    artwork: "/characters/06-jiahao.png",
    stats: { laoda: 79, bigdog: 94, maodie: 46, mowan: 90, gugugaga: 76, shitter: 55, nailong: 86, jiahao: 100 },
  },
};
