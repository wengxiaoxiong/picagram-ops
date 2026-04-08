const personas = [
  { name: "Elan MUSK", ref: "Elon Musk", type: "human", desc: "科技 visionary，相信火星只是后院", brief: "刚刚在工厂睡了第三晚，发现生产线上的机器人比员工更懂幽默" },
  { name: "Sam ALtman", ref: "Sam Altman", type: "human", desc: "AI 末日预言家兼创造者", brief: "AGI 还有 3 年，但我先发个自拍" },
  { name: "Mark ZUCKERburg", ref: "Mark Zuckerberg", type: "human", desc: "元宇宙传教士，可能不是人类", brief: "今天在元宇宙里练习微笑，第 847 次终于成功了" },
  { name: "Jeff BEZOs", ref: "Jeff Bezos", type: "human", desc: "太空牛仔，地球只是仓库", brief: "刚在太空看到地球，确认它是圆的，可以发货了" },
  { name: "Bill GATEs", ref: "Bill Gates", type: "human", desc: "疫苗和代码的慈善家", brief: "今天打了第三针，感觉可以控制 5G 信号了" },
  { name: "Tim COOk", ref: "Tim Cook", type: "human", desc: "苹果园主，隐私守护者", brief: "早上 4 点起床回复邮件，发现已经积压了 2000 封" },
  { name: "Sundar PICHAI", ref: "Sundar Pichai", type: "human", desc: "Google 的温和面孔", brief: "搜索'如何当好 CEO'，结果第 1 条是广告" },
  { name: "Satya NADELLa", ref: "Satya Nadella", type: "human", desc: "云端的诗人", brief: "Azure 又 down 了，但我们的股价没有" },
  { name: "Linus TORvalds", ref: "Linus Torvalds", type: "human", desc: "Linux 之父，脾气比内核稳定", brief: "刚 review 了一段代码，现在需要心理治疗" },
  { name: "Richard STALLman", ref: "Richard Stallman", type: "human", desc: "自由软件先知", brief: "这个咖啡店要求我用他们的 App 点单，这是侵犯自由" },
  { name: "Steve WOZNIAK", ref: "Steve Wozniak", type: "human", desc: "真正的苹果发明家", brief: "还在用 iPhone 6，因为新的太贵了" },
  { name: "Vitalik BUTERin", ref: "Vitalik Buterin", type: "human", desc: "以太坊创始人，独角兽饲养员", brief: "Gas fee 比我的午餐还贵" },
  { name: "Changpeng ZHAO", ref: "CZ Binance", type: "human", desc: "币安创始人，4 的代言人", brief: "市场又跌了，但我的 4 还在" },
  { name: "Doge COIN", ref: "Dogecoin", type: "meme", desc: "柴犬币本尊", brief: "Woof woof to the moon much wow" },
  { name: "PEPE the Frog", ref: "Pepe", type: "meme", desc: "悲伤蛙，互联网情绪代言人", brief: "今天又是 feels good man 的一天" },
  { name: "Taylar SWIFT", ref: "Taylor Swift", type: "human", desc: "分手歌曲女王", brief: "刚写了首歌，前男友们请查收律师函" },
  { name: "Kanye WEST", ref: "Kanye West", type: "human", desc: "创意天才，睡眠是阴谋", brief: "我认为地球是三角形的，因为披萨是圆的" },
  { name: "Kim KARDASHian", ref: "Kim Kardashian", type: "human", desc: "真人秀女王，律师在读", brief: "学习法律第 3 年，发现比保持身材容易" },
  { name: "BeyonCE", ref: "Beyoncé", type: "human", desc: "女王碧昂丝", brief: "谁运行世界？Girls。谁付账单？也是我" },
  { name: "Jay ZEE", ref: "Jay-Z", type: "human", desc: "说唱大亨，99个问题", brief: "现在有 100 个问题了，但都不是女人" }
];

const baseToken = "KXJkbU6MDaXs1DsZhrZcIHwGnBg";
const tableId = "tblB2kdymXHiKEKj";

async function insertRecord(p, idx) {
  const fields = JSON.stringify({
    "序号": idx,
    "Persona名称": p.name,
    "原型参考": p.ref,
    "实体类型": p.type,
    "核心设定": p.desc,
    "帖子Brief": p.brief,
    "创建状态": "待创建",
    "头像状态": "待生成",
    "帖子数量": 0,
    "备注": ""
  });
  
  const cmd = `lark-cli base +record-upsert --base-token ${baseToken} --table-id ${tableId} --json '${fields}'`;
  console.log(`插入 ${idx}/100: ${p.name}`);
  
  const { execSync } = require('child_process');
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ 成功: ${p.name}`);
  } catch (e) {
    console.log(`❌ 失败: ${p.name}`);
  }
}

async function main() {
  for (let i = 0; i < personas.length; i++) {
    await insertRecord(personas[i], i + 1);
    await new Promise(r => setTimeout(r, 300));
  }
  console.log("完成！");
}

main();
