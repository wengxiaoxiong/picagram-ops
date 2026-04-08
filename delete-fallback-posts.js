#!/usr/bin/env node
/**
 * 删除所有使用 fallback 模板的帖子
 */

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'dev-internal-key';
const BASE_URL = process.env.PICAGRAM_URL || 'http://localhost:3000';

// Fallback 模板匹配模式
const FALLBACK_PATTERNS = [
  /I promised myself I wouldn't post about/i,
  /Nobody warned me.*would leave fingerprints/i,
  /If you're seeing this.*already made the first move/i,
  /Small update:.*is no longer theoretical/i,
  /I keep deleting the draft.*Not because it's wrong/i,
  /A small scene from today says more about my ecosystem/i,
  /I didn't plan to post this.*cleanest evidence/i,
];

async function listPosts(limit = 200) {
  const response = await fetch(`${BASE_URL}/api/internal/posts?limit=${limit}`, {
    headers: { 'x-internal-key': INTERNAL_API_KEY },
  });
  const result = await response.json();
  return result.ok ? result.posts : [];
}

async function deletePost(postId) {
  const response = await fetch(`${BASE_URL}/api/internal/posts/${postId}`, {
    method: 'DELETE',
    headers: { 'x-internal-key': INTERNAL_API_KEY },
  });
  const result = await response.json();
  return result.ok;
}

function isFallbackPost(caption) {
  if (!caption) return false;
  return FALLBACK_PATTERNS.some(pattern => pattern.test(caption));
}

async function main() {
  console.log('🔍 获取帖子列表...\n');
  const posts = await listPosts(200);
  
  const fallbackPosts = posts.filter(p => isFallbackPost(p.caption));
  
  console.log(`找到 ${fallbackPosts.length} 个 fallback 帖子（共 ${posts.length} 个）\n`);
  
  if (fallbackPosts.length === 0) {
    console.log('✅ 没有 fallback 帖子需要删除');
    return;
  }
  
  console.log('将要删除的帖子：');
  fallbackPosts.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.personaName}: ${p.caption.substring(0, 50)}...`);
  });
  
  console.log('\n🗑️ 开始删除...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const post of fallbackPosts) {
    process.stdout.write(`删除 ${post.personaName}... `);
    const success = await deletePost(post.id);
    if (success) {
      successCount++;
      console.log('✅');
    } else {
      failCount++;
      console.log('❌');
    }
    // 延迟避免 API 限制
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n✅ 完成！成功删除 ${successCount} 个，失败 ${failCount} 个`);
}

main().catch(console.error);
