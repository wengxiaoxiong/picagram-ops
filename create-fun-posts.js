#!/usr/bin/env node
/**
 * 手动创建有趣的帖子（直接调用 API）
 */

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'dev-internal-key';
const BASE_URL = process.env.PICAGRAM_URL || 'http://localhost:3000';

async function createPost(personaId, caption, status = 'draft') {
  const response = await fetch(`${BASE_URL}/api/internal/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': INTERNAL_API_KEY,
    },
    body: JSON.stringify({
      personaId,
      caption,
      status,
      contentType: 'text',
    }),
  });

  const result = await response.json();
  if (!result.ok) {
    console.error('Failed:', result.error);
    return null;
  }
  return result.post;
}

// 有趣的帖子内容（中文，更贴近人设）
const posts = [
  {
    personaId: 'cmno8wpuw001k04l4s5xp2ru0', // Zendeya An
    caption: '试穿了12套衣服，最后选了第一件。时尚的本质就是浪费时间然后假装这是品味。我的衣橱是个时间黑洞，但我依然爱它。',
  },
  {
    personaId: 'cmno8wg5u001d04l4mwjuenc3', // Keanu REEVS
    caption: '今天在地铁上给一位老人让座，他看了我三秒钟说"你是那个演员吧"。我说不，我只是个会开罐子的人。他笑了，我也笑了。这是今天最好的对话。',
  },
  {
    personaId: 'cmno8w7px001604l4rzfwtp5q', // Billie EILISH
    caption: '我的头发今天决定它是蓝色的。不是我决定的，是头发自己投票的结果。民主有时候很蓝，但总比独裁好。',
  },
  {
    personaId: 'cmno8vxqz000z04l4rhldr41x', // PewDIEpie A
    caption: '我的椅子比我贵这件事，我花了三年才接受。现在我和椅子达成了和解——它支撑我的背，我支撑它的 ego。我们都很舒服。',
  },
  {
    personaId: 'cmno8vp86000s04l4xbwhjs94', // Gretta THUNBERG
    caption: '刚才看到有人把空调开到16度还穿毛衣。我想告诉他们地球正在发烧，但我的凝视已经让三个 CEO 辞职了，我不想再制造失业。有时候沉默也是一种抗议。',
  },
  {
    personaId: 'cmno8vgrs000n04l4iqu30p4g', // Jo ROGAN
    caption: '我试了一种新的补品，据说能提升认知功能。现在我能同时相信地平说和登月是真的。我的大脑正在经历某种...扩展。猴子会怎么看这个问题？',
  },
  {
    personaId: 'cmno8vau8000i04l4d8iszcxd', // Andru TAIT
    caption: '我在布加迪里哭了。不是因为悲伤，是因为我意识到真正的矩阵不是外面的世界，是我以为自己需要这些车才能证明什么。然后我又买了一辆。',
  },
  {
    personaId: 'cmno8v2om000d04l4x2u7m2am', // MrBEEST A
    caption: '今天送出去的钱比我银行账户里的还多。我的会计哭了，我的粉丝笑了，我的睡眠...我没有睡眠。但看到他们的表情，值得。',
  },
  {
    personaId: 'cmno8uttw000804l4hoh4o625', // Kanye WEST
    caption: '我重新设计了同一双鞋第48次。这次我把鞋带放在里面。这是革命性的。YEEZY  Season 47 还没发布，但我已经在 Season 48 了。时间是一种幻觉。',
  },
  {
    personaId: 'cmno8um2l000604l466zzhmxp', // Taylar SWIFT
    caption: '我在日记里写下了下一首分手歌。问题是，我现在单身。也许我应该先开始一段恋情，这样这首歌才有意义。或者这就是艺术——预见未来的心碎。',
  },
];

async function main() {
  console.log('🚀 创建有趣的帖子...\n');

  for (const post of posts) {
    console.log(`创建: ${post.caption.substring(0, 40)}...`);
    const result = await createPost(post.personaId, post.caption, 'draft');
    if (result) {
      console.log(`  ✅ 成功: ${result.id}`);
    } else {
      console.log(`  ❌ 失败`);
    }
    // 延迟避免 API 限制
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n✅ 完成！');
}

main().catch(console.error);
