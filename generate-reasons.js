#!/usr/bin/env node
/**
 * 为每个 Persona 生成爆火原因并更新到飞书表格
 */

const reasons = {
  // 科技大佬类
  "Elan MUSK": "马斯克是全球科技圈最具争议和话题性的人物，他的每条推文都能引发市场波动和全网讨论。其'疯狂科学家'人设和'火星殖民'愿景具有极强的传播力。",
  "Sam ALtman": "OpenAI CEO，ChatGPT 的幕后推手，AI 时代的代言人。AI 是当下最热话题，他的言论直接影响行业走向。",
  "Mark ZUCKERburg": "Meta CEO，元宇宙概念的推动者。'蜥蜴人'梗和元宇宙争议让他始终保持话题度。",
  "Jeff BEZOs": "亚马逊创始人，太空探索公司 Blue Origin 老板。'太空牛仔'人设和天价离婚案让他长期占据头条。",
  "Bill GATEs": "微软创始人，慈善家。'疫苗阴谋论'和'5G 控制'梗让他成为网络迷因的常客。",
  "Tim COOk": "苹果 CEO，乔布斯的接班人。苹果产品的每一次发布都是全球盛事，他的低调与苹果的辉煌形成反差。",
  "Satya NADELLa": "微软 CEO，成功带领微软转型云计算。'云端的诗人'人设和印度裔 CEO 的成功故事具有励志色彩。",
  "Linus TORvalds": "Linux 之父，开源运动的领袖。'暴脾气程序员'人设和创造世界最大开源项目的传奇经历。",
  "Richard STALLman": "自由软件运动创始人，GNU 项目发起人。极端的自由软件理念和行为艺术式的抗议让他成为话题人物。",
  "Steve WOZNIAK": "苹果联合创始人，真正的技术天才。与乔布斯的'双雄故事'和朴实的技术宅形象形成反差萌。",
  "Vitalik BUTERin": "以太坊创始人，加密货币世界的'神童'。年轻、聪明、理想主义，是 Web3 精神的代表。",
  "Changpeng ZHAO": "币安创始人，加密货币交易所之王。'4' 的梗和币圈影响力让他拥有庞大的追随者。",
  "Sundar PICHAI": "Google CEO，温和的管理者形象。作为科技巨头的掌舵人，他的决策影响全球互联网生态。",
  
  // Meme/加密货币类
  "Doge COIN": "狗狗币是 Meme 币之王，马斯克多次站台让它成为现象级加密货币。柴犬形象极具亲和力。",
  "PEPE the Frog": "Pepe 是互联网文化的标志性符号，从 4chan 到全球流行，承载了无数网络情绪。",
  
  // 音乐明星类
  "Taylar SWIFT": "霉霉是当代流行音乐女王，拥有最忠实的粉丝群体'Swifties'。每段恋情都能写出 Billboard 冠军单曲。",
  "Kanye WEST": "侃爷是音乐天才与争议制造机的完美结合。从格莱美到总统竞选，他永远知道如何占据头条。",
  "Kim KARDASHian": "卡戴珊家族的核心人物，从真人秀明星到企业家再到律师在读，她的转型故事激励了无数人。",
  "BeyonCE": "碧昂丝是活着的传奇，'女王'人设和女权主义立场让她成为文化偶像。",
  "Jay ZEE": "Jay-Z 是说唱界的商业大亨，从街头到董事会，他的成功故事是 Hip-hop 文化的缩影。",
  "Drake BELL": "Drake 是流媒体时代的王者，'伤感情歌'人设和加拿大温柔形象深入人心。",
  "Ariana GRAND": "A妹是 Vocal 技术的标杆，从童星到流行天后的成长历程和'高马尾'造型成为标志。",
  "Billie EILISH": "碧梨代表了 Z 世代的审美和态度，'怪诞少女'形象和环保立场吸引了大量年轻粉丝。",
  "The WEEKend": "盆栽哥的'暗黑 R&B'风格独树一帜，蒙面形象和神秘人设增加了话题性。",
  "Ed SHEERan": "黄老板是'邻家男孩'式的创作歌手，简单的吉他伴奏和真挚的歌词打动全球听众。",
  "Bruno MARS": "火星哥的复古放克风格和舞台魅力无人能敌，'24K Magic'成为派对必备。",
  "Lady GAGA": "Gaga 是流行文化的变革者，从'生肉片装'到《一个明星的诞生》，她不断重塑自己。",
  "Rihanna FENty": "蕾哈娜从歌手转型美妆 mogul，Fenty Beauty 的包容性理念改变了美妆行业。",
  "Selena GOMEZ": "傻脸娜从迪士尼童星成功转型，与比伯的恋情和心理健康倡导让她备受关注。",
  "Justin BIEBer": "比伯是 YouTube 时代的第一个超级明星，从问题少年到成熟丈夫的成长故事引人入胜。",
  "Shawn MENDez": "萌德是新一代情歌王子，与卡妹的恋情和温柔形象让他成为少女偶像。",
  "Dua LIPA": "啪姐的'未来乡愁'风格引领了复古迪斯科潮流，' levitating'成为疫情期间的全球热单。",
  "Harry STYLEs": "哈卷从 One Direction 成员成功单飞，'无性别时尚'倡导者和水melon sugar 的夏日 vibe。",
  "Doja CAT": "豆荚猫的'网络怪咖'人设和多变的音乐风格让她在 TikTok 时代如鱼得水。",
  "Adele LAURie": "阿黛尔是'分手专辑'的代名词，她的每一张专辑都是全球音乐盛事。",
  
  // YouTuber/网红类
  "MrBEEST": "MrBeast 是 YouTube 的'撒钱之王'，极限挑战和慈善行为让他拥有最忠实的粉丝群体。",
  "PewDIEpie": "PewDiePie 是 YouTube 订阅数之王，游戏解说和 Meme 评论定义了一个时代。",
  "Logan PAUL": "Logan Paul 从争议网红成功转型为拳击手和企业家，他的转型故事充满戏剧性。",
  "Jake PAUL": "Jake Paul 是'问题少年'的代表，从 Vine 到 YouTube 再到拳击台，争议不断。",
  "KSI OLAtunji": "KSI 是英国 YouTube 文化的代表，从 FIFA 游戏视频到拳击冠军，多才多艺。",
  "Emma CHAMberlain": "Emma 是'Z 世代的声音'，咖啡文化和真实不做作的风格让她成为年轻人的偶像。",
  "David DOBrik": "David Dobrik 是 Vlog Squad 的前领袖，送特斯拉和快节奏剪辑风格定义了 Vlog 2.0。",
  "Addison RAE": "Addison Rae 是 TikTok 舞蹈明星的代表，从 15 秒视频到 Netflix 电影的跨界成功。",
  "Bella POArch": "Bella Poarch 凭借'M to the B'对口型视频成为 TikTok 史上点赞最多的视频创作者。",
  "Khaby LAME": "Khaby Lame 用无语的表情和简单的手势成为全球粉丝最多的 TikToker，'🤷♂️'成为标志。",
  "Marques BROWNlee": "MKBHD 是科技评测界的标杆，专业、客观、高质量的制作让他成为'科技界的奥普拉'。",
  "Linus SEBAstian": "Linus Tech Tips 是科技 YouTube 的搞笑担当，'摔 CPU'和诚实评测让他备受喜爱。",
  "Mark ROBER": "Mark Rober 是前 NASA 工程师，用科学整蛊和松鼠迷宫视频让科普变得有趣。",
  "Casey NEISTat": "Casey Neistat 是 Vlog 教父，纽约街头滑板和电影级制作重新定义了 Vlog。",
  "Charli DAMELio": "Charli D'Amelio 是 TikTok 舞蹈女王，Renegade 舞蹈让她成为平台第一人。",
  
  // 体育明星类
  "Cristiano RONALdo": "C罗是足球界的自律典范，'Siuuu!'庆祝动作和完美身材让他成为品牌代言人的首选。",
  "Lionel MESSI": "梅西是足球天才的代名词，从巴萨到迈阿密的转会和世界杯夺冠完成了传奇生涯。",
  "LeBron JAMES": "詹姆斯是篮球界的'皇帝'，从高中天才到父子同场，他的职业生涯就是一部史诗。",
  "Michael JORdan": "乔丹是篮球之神，Air Jordan 品牌和《最后之舞》纪录片让他跨越世代。",
  "Serena WILliams": "小威是网球界的女王，力量型打法和时尚态度打破了网球的传统形象。",
  "Roger FEDerer": "费德勒是网球绅士，优雅的打法和完美的形象让他成为品牌宠儿。",
  "Tom BRADy": "布雷迪是橄榄球传奇，'退役-复出-退役'的反复让他成为话题人物。",
  "Usain BOLT": "博尔特是地球上最快的人，'闪电'庆祝动作和 9.58 秒的传奇成绩无人能及。",
  "Simone BILES": "拜尔斯是体操女王，空中转体四周的难度和心理健康倡导让她成为榜样。",
  
  // 投资/商业类
  "Warren BUFFet": "巴菲特是'奥马哈先知'，价值投资理念和每年致股东信是投资界的圣经。",
  "Charlie MUNGer": "芒格是巴菲特的副驾驶，'逆向思维'和跨学科智慧让他备受尊敬。",
  "Ray DALIO": "达里奥是桥水基金创始人，《原则》一书影响了无数管理者和投资者。",
  "Carl ICAHN": "伊坎是激进投资者的代表，'你的公司管理不善，我来帮你'的强硬作风让人印象深刻。",
  "George SOROs": "索罗斯是'金融大鳄'，做空英镑赚取 10 亿美元的交易成为传奇。",
  "Peter THIEL": "彼得·蒂尔是 PayPal 黑手党的核心，《从 0 到 1》是创业者的必读书。",
  "Marc ANDReessen": "安德森是网景创始人，'软件正在吞噬世界'的预言正在一一实现。",
  "Reid HOFFman": "霍夫曼是 LinkedIn 创始人，《联盟》和'闪电式扩张'理论影响了硅谷。",
  "Eric YUAN": "袁征是 Zoom 创始人，疫情期间让全球远程工作成为可能。",
  "Jensen HUANG": "黄仁勋是'皮衣刀客'，英伟达在 AI 时代的统治地位让他成为科技界焦点。",
  
  // 虚构角色类
  "Bat MAN": "蝙蝠侠是 DC 的招牌英雄，'黑暗骑士'的复杂人性和哥谭守护者身份让他成为文化符号。",
  "Iron MAN": "钢铁侠是漫威电影宇宙的起点，小罗伯特·唐尼的演绎让'天才亿万富翁花花公子慈善家'成为经典。",
  "Spider MAN": "蜘蛛侠是最接地气的超级英雄，'能力越大责任越大'的座右铭影响了几代人。",
  "Thor ODINson": "雷神是北欧神话与现代英雄的完美结合，'Another!'和啤酒梗让他充满喜剧色彩。",
  "Sherlock HOLmes": "福尔摩斯是侦探小说的代名词，'基本演绎法'和与华生的搭档关系成为经典。",
  "Darth VADer": "达斯·维达是影史最经典的反派，'我是你父亲'的剧透成为流行文化的一部分。",
  "Yoda GREEN": "尤达大师是绝地智慧的象征，倒装句和'Do or do not'成为经典台词。",
  "Gandalf GREY": "甘道夫是《指环王》的智者，'You shall not pass!'是中土世界最燃的时刻。",
  "Harry POTter": "哈利·波特是千禧一代的共同记忆，魔法世界和与伏地魔的对抗是成长寓言。",
  "Jon SNOW": "琼恩·雪诺是《权游》的道德中心，'我什么都不知道'成为最讽刺的台词。",
  "Tyrion LANNister": "小恶魔是《权游》的智慧担当，'我喝酒我知道事情'定义了他的生存哲学。",
  "Walter WHITE": "老白是电视史上最复杂的角色之一，从化学老师到毒枭的转变令人震撼。",
  "Rick SANCHEZ": "瑞克是成人动画的标杆角色，'Wubba lubba dub dub'和疯狂科学家人设极具魅力。",
  
  // 抽象概念类
  "Procrastination DEMON": "拖延症是现代人最大的敌人，'我明天再做'的共鸣感极强。",
  "Impostor SYNdrome": "冒名顶替综合症是高成就者的通病，'我不配在这里'的心理让人产生强烈共鸣。",
  "Monday BLUES": "周一忧郁是打工人的共同情绪，每周一的'不想上班'是全球通用语言。",
  "Caffeine ADDICT": "咖啡因成瘾者是现代都市人的写照，'没有咖啡不能活'是无数人的真实状态。",
  "Midnight THOUGHTs": "深夜思绪是凌晨 3 点的哲学时刻，那些睡不着的思考往往最深刻。",
  "Existential DREAD": "存在主义恐惧是当代青年的精神困境，'宇宙的冷漠'与个人的焦虑形成对比。",
  "FOMO FEElings": "错失恐惧症是社交媒体时代的产物，'别人都在玩'的焦虑无处不在。",
  "Gym BROTato": "健身狂是健身房里的典型形象，'练胸日'和蛋白粉是他们的标志。",
  "Crypto BRO": "币圈老哥是加密货币狂热的代表，'HODL'和'To the moon'是他们的口头禅。",
  "Vegan CROSSfitter": "素食健身者是'如何知道他是素食健身者？他会告诉你'这个经典笑话的主角。",
  
  // 动物/迷因类
  "Grumpy CAT": "不爽猫是互联网最著名的猫，'I had fun once, it was terrible'的厌世脸成为经典。",
  "Nyan CAT": "彩虹猫是早期互联网迷因的代表，Pop-Tart 身体和彩虹轨迹是像素艺术的巅峰。",
  "Doge SHIBa": "柴犬是狗狗币的吉祥物，'Such wow'和'Much coin'的语法成为独特的网络语言。",
  "Harambe GORilla": "Harambe 是被射杀的大猩猩，'Dicks out for Harambe'成为互联网悼念文化的代表。",
  "Baby YODA": "Grogu（宝宝尤达）是《曼达洛人》的萌物担当，50 岁的婴儿设定反差萌十足。",
};

// 输出为 JSON 格式供后续使用
console.log(JSON.stringify(reasons, null, 2));
