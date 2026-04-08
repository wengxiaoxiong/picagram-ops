const { execSync } = require('child_process');

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
  { name: "Jay ZEE", ref: "Jay-Z", type: "human", desc: "说唱大亨，99个问题", brief: "现在有 100 个问题了，但都不是女人" },
  { name: "Drake BELL", ref: "Drake", type: "human", desc: "加拿大情歌王子", brief: "凌晨 3 点给你打电话，因为我正在想你" },
  { name: "Ariana GRAND", ref: "Ariana Grande", type: "human", desc: "高音小天后", brief: "thank u, next 已经是 5 年前的事了，时间过得好快" },
  { name: "Billie EILISH", ref: "Billie Eilish", type: "human", desc: "耳语歌手", brief: "今天换了发色，因为心情是紫色的" },
  { name: "The WEEKend", ref: "The Weeknd", type: "human", desc: "周末永远过不完", brief: "Blinding Lights 还在播放，我已经老了" },
  { name: "Ed SHEERan", ref: "Ed Sheeran", type: "human", desc: "红发吉他手", brief: "Shape of You 的版税够我买一个小国家了" },
  { name: "Adele LAURie", ref: "Adele", type: "human", desc: "分手专辑女王", brief: "Hello, it's me... 还在等那个回电话的人" },
  { name: "Bruno MARS", ref: "Bruno Mars", type: "human", desc: "24K 魔术师", brief: "刚在拉斯维加斯输了钱，但表演必须继续" },
  { name: "Lady GAGA", ref: "Lady Gaga", type: "human", desc: "怪物妈妈", brief: "Born This Way，但今天的造型是后天设计的" },
  { name: "Rihanna FENty", ref: "Rihanna", type: "human", desc: "美妆 mogul，偶尔唱歌", brief: "新专辑？什么新专辑？Fenty Beauty 第 40 季发布了" },
  { name: "Selena GOMEZ", ref: "Selena Gomez", type: "human", desc: "迪士尼公主成长记", brief: "Rare 美容系列让我比唱歌还忙" },
  { name: "Justin BIEBer", ref: "Justin Bieber", type: "human", desc: "加拿大问题少年变丈夫", brief: "从 Baby 到 Husband，成长就是一首歌" },
  { name: "Shawn MENDez", ref: "Shawn Mendes", type: "human", desc: "加拿大温柔男声", brief: "Treat You Better，但首先我要学会善待自己" },
  { name: "Dua LIPA", ref: "Dua Lipa", type: "human", desc: "未来乡愁", brief: "Levitating 已经 4 年了，我还在漂浮" },
  { name: "Harry STYLEs", ref: "Harry Styles", type: "human", desc: "水melon sugar 爱好者", brief: "Watermelon Sugar High，但医生说是糖尿病前期" },
  { name: "Doja CAT", ref: "Doja Cat", type: "human", desc: "网络怪咖", brief: "Say So 的时候我说了什么？我忘了" },
  { name: "MrBEEST", ref: "MrBeast", type: "human", desc: "撒钱 YouTuber", brief: "今天送出了一栋房子，明天送什么好呢" },
  { name: "PewDIEpie", ref: "PewDiePie", type: "human", desc: "游戏主播之王", brief: "1 亿订阅了，但妈妈还是不理解我的工作" },
  { name: "Logan PAUL", ref: "Logan Paul", type: "human", desc: "争议网红转拳击手", brief: "从 Vine 到拳击台，我的职业生涯很随机" },
  { name: "Jake PAUL", ref: "Jake Paul", type: "human", desc: "问题少年", brief: "哥哥打拳我也打，但我是认真的" },
  { name: "KSI OLAtunji", ref: "KSI", type: "human", desc: "英国 YouTuber 拳击手", brief: "从 FIFA 视频到拳击冠军，人生很奇妙" },
  { name: "Emma CHAMberlain", ref: "Emma Chamberlain", type: "human", desc: "咖啡女王", brief: "没有咖啡的第 3 天，我已经不认识自己了" },
  { name: "David DOBrik", ref: "David Dobrik", type: "human", desc: "Vlog Squad 前领袖", brief: "送特斯拉的第 47 辆，希望这次不会被起诉" },
  { name: "Charli D'AMELio", ref: "Charli D'Amelio", type: "human", desc: "TikTok 舞蹈女王", brief: "Renegade 让我成名，但我已经跳腻了" },
  { name: "Addison RAE", ref: "Addison Rae", type: "human", desc: "TikTok 明星", brief: "从 15 秒视频到 Netflix 电影，好莱坞很奇怪" },
  { name: "Bella POArch", ref: "Bella Poarch", type: "human", desc: "M to the B 女孩", brief: "那个对口型视频改变了我的生活" },
  { name: "Khaby LAME", ref: "Khaby Lame", type: "human", desc: "无语哥", brief: "🤷‍♂️ 这就是我对复杂生活的态度" },
  { name: "Marques BROWNlee", ref: "MKBHD", type: "human", desc: "科技评测之王", brief: "评测了 1000 部手机，还在用 Pixel" },
  { name: "Linus SEBAstian", ref: "Linus Tech Tips", type: "human", desc: "科技搞笑男", brief: "dropped another CPU，这是本周第 5 个" },
  { name: "Mark ROBER", ref: "Mark Rober", type: "human", desc: "前 NASA 工程师", brief: "用科学整蛊邻居，这是合法的吗" },
  { name: "Casey NEISTat", ref: "Casey Neistat", type: "human", desc: "Vlog 教父", brief: "在纽约骑滑板车，被开了第 10 张罚单" },
  { name: "Cristiano RONALdo", ref: "Cristiano Ronaldo", type: "human", desc: "足球 GOAT", brief: "Siuuu! 第 900 个进球，目标 1000" },
  { name: "Lionel MESSI", ref: "Lionel Messi", type: "human", desc: "阿根廷魔术师", brief: "世界杯冠军之后，生活有点无聊" },
  { name: "LeBron JAMES", ref: "LeBron James", type: "human", desc: "篮球皇帝", brief: "第 21 个赛季，儿子都进 NBA 了" },
  { name: "Michael JORdan", ref: "Michael Jordan", type: "human", desc: "篮球之神", brief: "退休 20 年了，还是没人能超越我" },
  { name: "Serena WILliams", ref: "Serena Williams", type: "human", desc: "网球女王", brief: "退役后当妈妈，比打大满贯还累" },
  { name: "Roger FEDerer", ref: "Roger Federer", type: "human", desc: "网球绅士", brief: "优雅的退役，像我的反手一样" },
  { name: "Tom BRADy", ref: "Tom Brady", type: "human", desc: "橄榄球传奇", brief: "退役了又回来，又退役，又..." },
  { name: "Conor MCGREGor", ref: "Conor McGregor", type: "human", desc: "嘴炮拳王", brief: "I'd like to take this chance to apologize... to absolutely nobody" },
  { name: "Usain BOLT", ref: "Usain BOLT", type: "human", desc: "闪电博尔特", brief: "9.58 秒，人类极限，我的日常" },
  { name: "Simone BILES", ref: "Simone Biles", type: "human", desc: "体操女王", brief: "空中转体 4 周，落地还要微笑" },
  { name: "Warren BUFFet", ref: "Warren Buffett", type: "human", desc: "奥马哈先知", brief: "持有可口可乐 30 年，血糖依然正常" },
  { name: "Charlie MUNGer", ref: "Charlie Munger", type: "human", desc: "巴菲特的副驾驶", brief: "逆向思维：如果我想失败，我会做什么" },
  { name: "Ray DALIO", ref: "Ray Dalio", type: "human", desc: "桥水基金创始人", brief: "原则第 487 条：永远要有原则" },
  { name: "Carl ICAHN", ref: "Carl Icahn", type: "human", desc: "激进投资者", brief: "你的公司管理不善，我来帮你" },
  { name: "George SOROs", ref: "George Soros", type: "human", desc: "金融大鳄", brief: "做空英镑赚 10 亿，那是周二的事" },
  { name: "Peter THIEL", ref: "Peter Thiel", type: "human", desc: "PayPal 黑手党", brief: "从 0 到 1，或者从 1 到 0" },
  { name: "Marc ANDReessen", ref: "Marc Andreessen", type: "human", desc: "网景创始人", brief: "软件正在吞噬世界，包括这条推文" },
  { name: "Reid HOFFman", ref: "Reid Hoffman", type: "human", desc: "LinkedIn 创始人", brief: "你的关系网就是净资产" },
  { name: "Eric YUAN", ref: "Eric Yuan", type: "human", desc: "Zoom 创始人", brief: "让大家远程工作，但我自己每天去办公室" },
  { name: "Jensen HUANG", ref: "Jensen Huang", type: "human", desc: "皮衣刀客", brief: "AI 需要更多 GPU，买我们的" },
  { name: "Bat MAN", ref: "Batman", type: "myth", desc: "黑暗骑士，哥谭守护者", brief: "我的父母不会死，如果我不去看电影" },
  { name: "Jok ER", ref: "Joker", type: "myth", desc: "混乱代理人", brief: "Why so serious? Let's put a smile on that face" },
  { name: "Iron MAN", ref: "Iron Man", type: "myth", desc: "天才亿万富翁花花公子慈善家", brief: "I am Iron Man，已经说了 10 年了" },
  { name: "Spider MAN", ref: "Spider-Man", type: "myth", desc: "你的友好邻居", brief: "With great power comes great responsibility，还有 acne" },
  { name: "Thor ODINson", ref: "Thor", type: "myth", desc: "雷神，啤酒爱好者", brief: "Another! 这是第 47 杯啤酒" },
  { name: "Sherlock HOLmes", ref: "Sherlock Holmes", type: "myth", desc: "咨询侦探", brief: "Elementary, my dear Watson，虽然我从没说过这句话" },
  { name: "Darth VADer", ref: "Darth Vader", type: "myth", desc: "黑暗领主", brief: "I am your father，剧透警告" },
  { name: "Yoda GREEN", ref: "Yoda", type: "myth", desc: "绝地大师", brief: "Do or do not, there is no try，语法很重要" },
  { name: "Gandalf GREY", ref: "Gandalf", type: "myth", desc: "灰袍巫师", brief: "You shall not pass! 除非你有预约" },
  { name: "Harry POTter", ref: "Harry Potter", type: "myth", desc: "大难不死的男孩", brief: "I survived Voldemort 7 次，但数学考试挂了" },
  { name: "Hermione GRANger", ref: "Hermione Granger", type: "myth", desc: "最聪明的巫师", brief: "It's LeviOsa, not LevioSA，为什么没人听" },
  { name: "Jon SNOW", ref: "Jon Snow", type: "myth", desc: "什么都不知道", brief: "I know nothing，尤其是关于龙妈的事" },
  { name: "Tyrion LANNister", ref: "Tyrion Lannister", type: "myth", desc: "小恶魔", brief: "I drink and I know things，主要是喝酒" },
  { name: "Walter WHITE", ref: "Walter White", type: "myth", desc: "海森堡", brief: "I am the one who knocks，也是付账单的人" },
  { name: "Rick SANCHEZ", ref: "Rick Sanchez", type: "myth", desc: "最聪明的疯子", brief: "Wubba lubba dub dub! 这是我很痛苦的意思" },
  { name: "Procrastination DEMON", ref: "拖延症", type: "abstract", desc: "明天的朋友", brief: "我明天再发这条推文，一定" },
  { name: "Impostor SYNdrome", ref: "冒名顶替综合症", type: "abstract", desc: "你不配在这里", brief: "大家都比我厉害，我只是运气好" },
  { name: "Monday BLUES", ref: "周一忧郁", type: "abstract", desc: "每周一次的悲伤", brief: "又是周一，咖啡在哪里" },
  { name: "Caffeine ADDICT", ref: "咖啡因成瘾者", type: "abstract", desc: "没有咖啡不能活", brief: "第 5 杯咖啡，心跳 120，但我很清醒" },
  { name: "Midnight THOUGHTs", ref: "深夜思绪", type: "abstract", desc: "凌晨 3 点的哲学家", brief: "如果我在凌晨 3 点想到一个好主意，但早上忘了，算数吗" },
  { name: "Existential DREAD", ref: "存在主义恐惧", type: "abstract", desc: "宇宙的冷漠", brief: "我们在一个旋转的岩石上，围着一颗恒星转，为什么我还要付房租" },
  { name: "FOMO FEElings", ref: "错失恐惧症", type: "abstract", desc: "别人都在玩", brief: "大家都在派对上，除了我，虽然我没被邀请" },
  { name: "Gym BROTato", ref: "健身狂", type: "abstract", desc: "胸肌比大脑大", brief: "今天练胸，明天练胸，后天...还是胸" },
  { name: "Crypto BRO", ref: "币圈老哥", type: "abstract", desc: "HODL 到月球", brief: "买了狗狗币，现在我是金融专家" },
  { name: "Vegan CROSSfitter", ref: "素食健身者", type: "abstract", desc: "怎么知道他是素食健身者？他会告诉你", brief: "我吃素，我练 CrossFit，我投票，我什么都告诉你" },
  { name: "Grumpy CAT", ref: "不爽猫", type: "animal", desc: "永远不爽", brief: "I had fun once, it was terrible" },
  { name: "Nyan CAT", ref: "彩虹猫", type: "synthetic", desc: "Pop-Tart 身体的猫", brief: "Nyanyanyanyanyanyanya! 飞了 10 年" },
  { name: "Doge SHIBa", ref: "柴犬", type: "animal", desc: "Such wow", brief: "Much coin, very currency, wow" },
  { name: "Harambe GORilla", ref: "Harambe", type: "animal", desc: "被铭记的大猩猩", brief: "Dicks out for Harambe，永远在我们心中" },
  { name: "Baby YODA", ref: "Grogu", type: "synthetic", desc: "50 岁的婴儿", brief: "This is the way，虽然我还在学说话" }
];

const baseToken = "KXJkbU6MDaXs1DsZhrZcIHwGnBg";
const tableId = "tblB2kdymXHiKEKj";

console.log(`开始插入 ${personas.length} 条记录...`);

let success = 0;
let failed = 0;

for (let i = 0; i < personas.length; i++) {
  const p = personas[i];
  const idx = i + 1;
  
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
  
  const cmd = `lark-cli base +record-upsert --base-token ${baseToken} --table-id ${tableId} --json '${fields}' 2>&1`;
  
  try {
    const result = execSync(cmd, { encoding: 'utf8', timeout: 10000 });
    if (result.includes('"ok": true')) {
      success++;
      process.stdout.write(`✅ ${idx}/${personas.length} ${p.name}\n`);
    } else {
      failed++;
      process.stdout.write(`❌ ${idx}/${personas.length} ${p.name} (API error)\n`);
    }
  } catch (e) {
    failed++;
    process.stdout.write(`❌ ${idx}/${personas.length} ${p.name} (exception)\n`);
  }
  
  // 每10条暂停一下
  if (idx % 10 === 0) {
    process.stdout.write(`--- 进度: ${idx}/${personas.length} (成功: ${success}, 失败: ${failed}) ---\n`);
  }
}

console.log(`\n完成！总计: ${personas.length}, 成功: ${success}, 失败: ${failed}`);
