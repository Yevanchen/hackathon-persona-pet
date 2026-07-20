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
  petSprite: string;
  petArchive: string;
  stats: readonly [PersonaStat, PersonaStat, PersonaStat, PersonaStat];
};

export type PersonaStat = { label: string; value: number };

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
    petSprite: "/pets/laoda/spritesheet.webp",
    petArchive: "/downloads/pets/hackathon-pet-laoda.zip",
    stats: [
      { label: "深夜续航", value: 100 },
      { label: "手速爆发", value: 98 },
      { label: "主程执念", value: 96 },
      { label: "下班概率", value: 8 },
    ],
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
    petSprite: "/pets/bigdog/spritesheet.webp",
    petArchive: "/downloads/pets/hackathon-pet-bigdog.zip",
    stats: [
      { label: "开麦分贝", value: 100 },
      { label: "汇报欲望", value: 95 },
      { label: "气氛带动", value: 92 },
      { label: "静音时长", value: 6 },
    ],
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
    petSprite: "/pets/maodie/spritesheet.webp",
    petArchive: "/downloads/pets/hackathon-pet-maodie.zip",
    stats: [
      { label: "哈气指数", value: 100 },
      { label: "Bug 嗅觉", value: 96 },
      { label: "根因追踪", value: 92 },
      { label: "忍耐余额", value: 12 },
    ],
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
    petSprite: "/pets/mowan/spritesheet.webp",
    petArchive: "/downloads/pets/hackathon-pet-mowan.zip",
    stats: [
      { label: "搞事概率", value: 100 },
      { label: "脑洞浓度", value: 97 },
      { label: "逃跑速度", value: 95 },
      { label: "规则服从", value: 9 },
    ],
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
    petSprite: "/pets/gugugaga/spritesheet.webp",
    petArchive: "/downloads/pets/hackathon-pet-gugugaga.zip",
    stats: [
      { label: "群聊浓度", value: 100 },
      { label: "已读秒回", value: 96 },
      { label: "表情包库存", value: 94 },
      { label: "潜水概率", value: 5 },
    ],
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
    petSprite: "/pets/shitter/spritesheet.webp",
    petArchive: "/downloads/pets/hackathon-pet-shitter.zip",
    stats: [
      { label: "屎山适应", value: 100 },
      { label: "补丁速度", value: 98 },
      { label: "现场续命", value: 96 },
      { label: "代码洁癖", value: 7 },
    ],
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
    petSprite: "/pets/nailong/spritesheet.webp",
    petArchive: "/downloads/pets/hackathon-pet-nailong.zip",
    stats: [
      { label: "爆笑含量", value: 100 },
      { label: "捧场强度", value: 97 },
      { label: "压力消解", value: 95 },
      { label: "严肃时长", value: 4 },
    ],
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
    petSprite: "/pets/jiahao/spritesheet.webp",
    petArchive: "/downloads/pets/hackathon-pet-jiahao.zip",
    stats: [
      { label: "登场气场", value: 100 },
      { label: "功能包装", value: 99 },
      { label: "慢动作含量", value: 93 },
      { label: "低调指数", value: 3 },
    ],
  },
};
