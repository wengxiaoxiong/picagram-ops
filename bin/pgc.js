#!/usr/bin/env node
/**
 * Picagram CLI v2.0 - 增强版运营工具
 * 
 * 新增功能:
 * - 评论管理 (comment list/get/delete)
 * - 点赞管理 (like list)
 * - 批量操作 (batch create/update)
 * - 数据导出 (export)
 * - 详细内容编辑 (post/persona 字段级编辑)
 * - 统计仪表盘 (stats)
 * 
 * 使用方法:
 *   pgc <resource> <action> [options]
 */

const INTERNAL_API_KEY = process.env.PICAGRAM_API_KEY || '5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1';
const BASE_URL = process.env.PICAGRAM_BASE_URL || 'https://picagram.ai';

// ANSI 颜色
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  console.error(`${colors.red}Error: ${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function warn(message) {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

// API 调用函数
async function apiCall(method, endpoint, data = null, params = null) {
  let url = `${BASE_URL}${endpoint}`;
  
  if (params) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    }
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  const options = {
    method,
    headers: {
      'x-internal-key': INTERNAL_API_KEY,
      'Content-Type': 'application/json',
    },
  };
  
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json().catch(() => null);
    
    if (!response.ok) {
      return { 
        ok: false, 
        status: response.status,
        error: result?.error || result?.message || `HTTP ${response.status}`
      };
    }
    
    return { ok: true, ...result };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ==================== Persona 增强版 ====================

const personaCommands = {
  async list(options = {}) {
    const params = {};
    if (options.status) params.status = options.status;
    if (options.limit) params.limit = options.limit;
    if (options.offset) params.offset = options.offset;
    if (options.type) params.type = options.type;
    
    const result = await apiCall('GET', '/api/internal/personas', null, params);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    log('\n📋 Persona List:', 'bright');
    log('=' .repeat(100), 'dim');
    
    if (!result.personas || result.personas.length === 0) {
      log('No personas found.', 'yellow');
      return;
    }
    
    // 打印表头
    log(`ID                           | 名称                    | 状态      | 类型   | 帖子 | 粉丝`, 'dim');
    log('-'.repeat(100), 'dim');
    
    for (const p of result.personas) {
      const statusColor = p.status === 'published' ? 'green' : p.status === 'draft' ? 'yellow' : 'dim';
      const name = p.displayName.padEnd(22).substring(0, 22);
      const id = p.id.substring(0, 26).padEnd(26);
      const status = p.status.padEnd(8);
      const type = (p.type || 'human').padEnd(6);
      const posts = String(p.postCount || 0).padStart(3);
      const followers = String(p.followerCount || 0).padStart(4);
      
      log(`${id} | ${name} | ${colors[statusColor]}${status}${colors.reset} | ${type} | ${posts} | ${followers}`);
    }
    
    const total = result.total || result.personas.length;
    const limit = parseInt(options.limit) || 50;
    const offset = parseInt(options.offset) || 0;
    const start = offset + 1;
    const end = Math.min(offset + result.personas.length, total);
    
    log(`\n${colors.dim}Showing ${start}-${end} of ${total}${colors.reset}`);
    
    // 显示翻页提示
    if (end < total) {
      const nextOffset = offset + limit;
      log(`${colors.cyan}Next page: pgc persona list --offset ${nextOffset}${limit !== 50 ? ' --limit ' + limit : ''}${options.status ? ' --status ' + options.status : ''}${options.type ? ' --type ' + options.type : ''}${colors.reset}`);
    }
  },

  async get(id) {
    if (!id) {
      error('Persona ID is required');
      return;
    }
    
    const result = await apiCall('GET', `/api/internal/personas/${id}`);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    const p = result.persona;
    log(`\n${colors.bright}${colors.cyan}${p.displayName}${colors.reset}`, 'bright');
    log('=' .repeat(80), 'dim');
    log(`ID: ${p.id}`);
    log(`Slug: ${p.slug}`);
    log(`Status: ${p.status}`, p.status === 'published' ? 'green' : 'yellow');
    log(`Type: ${p.type || 'human'}`);
    log(`Locale: ${p.locale}`);
    log(`Posts: ${p.postCount || 0} | Followers: ${p.followerCount || 0}`);
    log(`\nBio:\n${p.bio}`, 'dim');
    log(`\nStory:\n${p.story?.substring(0, 300)}...`, 'dim');
    log(`\nCity: ${p.city || 'N/A'}`);
    log(`Job: ${p.jobTitle || 'N/A'}`);
    log(`Tags: ${p.personalityTags?.join(', ') || 'None'}`);
    
    if (p.recentPosts?.length > 0) {
      log(`\nRecent Posts:`, 'cyan');
      for (const post of p.recentPosts.slice(0, 5)) {
        log(`  - ${post.caption?.substring(0, 60)}...`, 'dim');
      }
    }
    
    log(`\nCreated: ${new Date(p.createdAt).toLocaleString()}`);
  },

  async create(data) {
    if (!data.prompt) {
      error('Prompt is required. Use: pgc persona create "prompt text"');
      return;
    }
    
    log(`Creating persona with prompt: ${data.prompt.substring(0, 60)}...`, 'blue');
    
    const result = await apiCall('POST', '/api/internal/persona-generation/run', {
      prompt: data.prompt,
      status: data.status || 'published',
      count: data.count || 1,
      type: data.type,
    });
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success(`Created ${result.count} persona(s)`);
    log(`IDs: ${result.personaIds.join(', ')}`, 'cyan');
    log(result.note, 'dim');
    
    return result.personaIds;
  },

  async update(id, data) {
    if (!id) {
      error('Persona ID is required');
      return;
    }
    
    const updateData = {};
    if (data.displayName) updateData.displayName = data.displayName;
    if (data.bio) updateData.bio = data.bio;
    if (data.story) updateData.story = data.story;
    if (data.status) updateData.status = data.status;
    if (data.city) updateData.city = data.city;
    if (data.jobTitle) updateData.jobTitle = data.jobTitle;
    if (data.tags) updateData.personalityTags = data.tags.split(',').map(t => t.trim());
    if (data.voice !== undefined) updateData.voiceEnabled = data.voice === 'true';
    
    const result = await apiCall('PATCH', `/api/internal/personas/${id}`, updateData);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success(`Updated persona ${id}`);
    log('Updated fields:', 'dim');
    for (const [key, value] of Object.entries(updateData)) {
      log(`  ${key}: ${value}`, 'dim');
    }
  },

  async delete(id, force = false) {
    if (!id) {
      error('Persona ID is required');
      return;
    }
    
    if (!force) {
      warn(`This will delete persona ${id} and all associated data.`);
      log(`Use --force to confirm.`, 'dim');
      return;
    }
    
    const result = await apiCall('DELETE', `/api/internal/personas/${id}`);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success(`Deleted persona ${id}`);
  },

  async search(query) {
    if (!query) {
      error('Search query is required');
      return;
    }
    
    const result = await apiCall('GET', '/api/internal/personas/search', null, { q: query });
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    log(`\n🔍 Search results for "${query}":`, 'bright');
    log('=' .repeat(80), 'dim');
    
    for (const p of result.personas || []) {
      log(`${colors.cyan}${p.displayName}${colors.reset} - ${p.bio?.substring(0, 60)}...`, 'dim');
    }
  },
};

// ==================== Post 增强版 ====================

const postCommands = {
  async list(options = {}) {
    const params = {};
    if (options.personaId) params.personaId = options.personaId;
    if (options.status) params.status = options.status;
    if (options.limit) params.limit = options.limit;
    if (options.offset) params.offset = options.offset;
    
    const result = await apiCall('GET', '/api/internal/posts', null, params);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    log('\n📝 Post List:', 'bright');
    log('=' .repeat(100), 'dim');
    
    // 表头
    log(`ID                           | 作者                    | 状态      | 点赞 | 评论 | 内容`, 'dim');
    log('-'.repeat(100), 'dim');
    
    for (const post of result.posts || []) {
      const statusColor = post.status === 'published' ? 'green' : 'yellow';
      const name = (post.personaName || 'Unknown').padEnd(22).substring(0, 22);
      const id = post.id.substring(0, 26).padEnd(26);
      const status = post.status.padEnd(8);
      const likes = String(post.likeCount || 0).padStart(3);
      const comments = String(post.commentCount || 0).padStart(3);
      const content = post.caption?.substring(0, 30).padEnd(30) || '';
      
      log(`${id} | ${name} | ${colors[statusColor]}${status}${colors.reset} | ${likes} | ${comments} | ${content}`, 'dim');
    }
    
    const total = result.total || result.posts?.length || 0;
    const limit = parseInt(options.limit) || 50;
    const offset = parseInt(options.offset) || 0;
    const start = offset + 1;
    const end = Math.min(offset + (result.posts?.length || 0), total);
    
    log(`\n${colors.dim}Showing ${start}-${end} of ${total}${colors.reset}`);
    
    // 显示翻页提示
    if (end < total) {
      const nextOffset = offset + limit;
      log(`${colors.cyan}Next page: pgc post list --offset ${nextOffset}${limit !== 50 ? ' --limit ' + limit : ''}${options.personaId ? ' --persona-id ' + options.personaId : ''}${options.status ? ' --status ' + options.status : ''}${colors.reset}`);
    }
  },

  async get(id) {
    if (!id) {
      error('Post ID is required');
      return;
    }
    
    const result = await apiCall('GET', `/api/internal/posts/${id}`);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    const post = result.post;
    log(`\n${colors.bright}Post${colors.reset}`, 'bright');
    log('=' .repeat(80), 'dim');
    log(`ID: ${post.id}`);
    log(`Persona: ${post.personaName} (${post.personaId})`);
    log(`Status: ${post.status}`, post.status === 'published' ? 'green' : 'yellow');
    log(`Likes: ${post.likeCount || 0} | Comments: ${post.commentCount || 0}`);
    log(`\nContent:\n${post.caption}`, 'dim');
    if (post.altText) {
      log(`\nAlt Text:\n${post.altText}`, 'dim');
    }
    log(`\nPublished: ${post.publishedAt ? new Date(post.publishedAt).toLocaleString() : 'Draft'}`);
  },

  async create(data) {
    if (!data.personaId) {
      error('Persona ID is required. Use: --persona-id <id>');
      return;
    }
    
    if (data.brief) {
      // 使用 brief 生成
      const result = await apiCall('POST', '/api/internal/persona-feed/brief-post', {
        personaId: data.personaId,
        brief: data.brief,
      });
      
      if (!result.ok) {
        error(result.error);
        return;
      }
      
      success(`Created post for persona ${data.personaId}`);
      log(`Post ID: ${result.postId}`, 'cyan');
    } else if (data.caption) {
      // 直接创建
      const result = await apiCall('POST', '/api/internal/posts', {
        personaId: data.personaId,
        caption: data.caption,
        altText: data.altText,
        status: data.status || 'published',
      });
      
      if (!result.ok) {
        error(result.error);
        return;
      }
      
      success(`Created post`);
      log(`Post ID: ${result.post.id}`, 'cyan');
    } else {
      error('Either --caption or --brief is required');
    }
  },

  async update(id, data) {
    if (!id) {
      error('Post ID is required');
      return;
    }
    
    const updateData = {};
    if (data.caption) updateData.caption = data.caption;
    if (data.status) updateData.status = data.status;
    if (data.altText) updateData.altText = data.altText;
    
    if (Object.keys(updateData).length === 0) {
      error('No fields to update. Use --caption, --status, or --altText');
      return;
    }
    
    const result = await apiCall('PATCH', `/api/internal/posts/${id}`, updateData);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success(`Updated post ${id}`);
  },

  async delete(id, force = false) {
    if (!id) {
      error('Post ID is required');
      return;
    }
    
    if (!force) {
      warn(`This will delete post ${id}.`);
      log(`Use --force to confirm.`, 'dim');
      return;
    }
    
    const result = await apiCall('DELETE', `/api/internal/posts/${id}`);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success(`Deleted post ${id}`);
  },

  async comments(id) {
    if (!id) {
      error('Post ID is required');
      return;
    }
    
    const result = await apiCall('GET', `/api/internal/posts/${id}/comments`);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    log(`\n💬 Comments for Post ${id}:`, 'bright');
    log('=' .repeat(80), 'dim');
    
    for (const comment of result.comments || []) {
      log(`${colors.cyan}${comment.personaName || 'Anonymous'}${colors.reset}: ${comment.content}`, 'dim');
      log(`  ${new Date(comment.createdAt).toLocaleString()}`, 'dim');
    }
  },

  async likes(id) {
    if (!id) {
      error('Post ID is required');
      return;
    }
    
    const result = await apiCall('GET', `/api/internal/posts/${id}/likes`);
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    log(`\n❤️ Likes for Post ${id}:`, 'bright');
    log(`Total: ${result.likes?.length || 0}`, 'cyan');
    
    for (const like of result.likes || []) {
      log(`  ${like.personaName || like.personaId}`, 'dim');
    }
  },
};

// ==================== Feed Operations ====================

const feedCommands = {
  async list(options = {}) {
    const limit = options.limit ? Number(options.limit) : 20;
    const seed = options.seed || Date.now().toString();
    
    const result = await apiCall('GET', '/api/internal/feed', null, {
      seed,
      limit,
    });
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    log('\n📰 Homepage Feed:', 'bright');
    log('=' .repeat(100), 'dim');
    
    if (!result.items || result.items.length === 0) {
      log('No feed items found.', 'yellow');
      return;
    }
    
    // 表头
    log(`作者                    | 点赞 | 评论 | 内容`, 'dim');
    log('-'.repeat(100), 'dim');
    
    for (const item of result.items) {
      const personaName = (item.persona?.displayName || 'Unknown').padEnd(22).substring(0, 22);
      const likeCount = String(item.post?.likeCount || 0).padStart(3);
      const commentCount = String(item.post?.commentCount || 0).padStart(3);
      const content = item.post?.caption?.substring(0, 50).padEnd(50) || '';
      
      log(`${personaName} | ${likeCount} | ${commentCount} | ${content}`, 'dim');
    }
    
    log(`\n${colors.dim}Total: ${result.items.length} posts${colors.reset}`);
  },

  async coldStart(options = {}) {
    log('Triggering cold start...', 'blue');
    
    const result = await apiCall('POST', '/api/internal/persona-feed/cold-start', {
      count: options.count || 5,
      prompt: options.prompt,
    });
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success('Cold start triggered');
    log(result.note || 'Processing in background...', 'dim');
  },

  async planDay() {
    log('Planning day for personas...', 'blue');
    
    const result = await apiCall('POST', '/api/internal/persona-feed/plan-day');
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success('Day planning triggered');
  },

  async run() {
    log('Running feed jobs...', 'blue');
    
    const result = await apiCall('POST', '/api/internal/persona-feed/run');
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success('Feed jobs triggered');
  },
};

// ==================== Chat Operations ====================

const chatCommands = {
  async groupRun() {
    log('Running group chat...', 'blue');
    
    const result = await apiCall('POST', '/api/internal/group-chat/run');
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success('Group chat triggered');
  },

  async proactiveRun() {
    log('Running proactive messages...', 'blue');
    
    const result = await apiCall('POST', '/api/internal/proactive/run');
    
    if (!result.ok) {
      error(result.error);
      return;
    }
    
    success('Proactive messages triggered');
  },
};

// ==================== CLI Parser ====================

function parseArgs(args) {
  const options = {};
  const positional = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      if (nextArg && !nextArg.startsWith('-')) {
        options[key] = nextArg;
        i++;
      } else {
        options[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      options[key] = true;
    } else {
      positional.push(arg);
    }
  }
  
  return { positional, options };
}

// ==================== Main CLI ====================

function showQuickRef() {
  console.log(`
${colors.bright}🚀 Picagram CLI (pgc) v2.0 - 快速参考${colors.reset}

${colors.cyan}常用命令：${colors.reset}
  pgc persona list                      列出所有人设
  pgc persona get <id>                  查看人设详情
  pgc persona create "描述"              创建新人设
  pgc persona update <id> --bio "xxx"   更新人设简介
  
  pgc post list                         列出所有帖子
  pgc post get <id>                     查看帖子详情
  pgc post create --persona-id <id> --brief "xxx"   创建帖子
  pgc post comments <id>                查看帖子评论
  
  pgc feed list                         查看首页 Feed
  pgc feed cold-start --count 5         批量创建人设

${colors.dim}提示: 使用 pgc --help 查看完整文档${colors.reset}
`);
}

function showHelp() {
  console.log(`
${colors.bright}Picagram CLI (pgc) v2.0${colors.reset} - 增强版运营工具

${colors.bright}Usage:${colors.reset}
  pgc <resource> <action> [options]

${colors.bright}Resources:${colors.reset}

  ${colors.cyan}persona${colors.reset}    Manage personas
    list [--status] [--limit] [--offset] [--type]  List with pagination
    get <id>                             Get details
    create "prompt" [--status]           Create new persona
    update <id> [--bio] [--story] ...    Update fields
    delete <id> [--force]                Delete persona
    search <query>                       Search personas

  ${colors.cyan}post${colors.reset}       Manage posts
    list [--persona-id] [--status] [--limit] [--offset]  List posts with pagination
    get <id>                             Get post details
    create --persona-id <id>             Create post
           --caption <text> | --brief <text>
           [--status] [--altText]
    update <id> [--caption] [--status]   Update post
    delete <id> [--force]                Delete post
    comments <id>                        View comments
    likes <id>                           View likes

  ${colors.cyan}feed${colors.reset}       Feed operations
    list [--limit]                       List homepage feed
    cold-start [--count] [--prompt]      Trigger cold start
    plan-day                             Plan day for personas
    run                                  Run feed jobs

  ${colors.cyan}chat${colors.reset}       Chat operations
    group-run                            Run group chat
    proactive-run                        Run proactive messages

${colors.bright}Options:${colors.reset}
  --status <status>   Filter by status (draft/published/archived)
  --limit <n>         Limit results (default: 50)
  --offset <n>        Skip N results for pagination
  --persona-id <id>   Specify persona ID
  --force             Confirm destructive actions

${colors.bright}Examples:${colors.reset}
  pgc persona list
  pgc persona list --limit 20 --offset 20    # Page 2
  pgc persona get cm123xxx
  pgc persona create "A mysterious detective" --status published
  pgc persona update cm123xxx --bio "New bio text"
  pgc post list --persona-id cm123xxx
  pgc post list --limit 10 --offset 0        # First page
  pgc post create --persona-id cm123xxx --brief "Share a secret"
  pgc post comments cm456xxx
  pgc feed list
`);
}

// 命令提示和建议
function showCommandHints(resource, action) {
  const hints = {
    persona: {
      list: 'pgc persona list [--status published|draft] [--limit 20] [--offset 0] [--type human]',
      get: 'pgc persona get <id>',
      create: 'pgc persona create "描述文字" [--status published] [--type human]',
      update: 'pgc persona update <id> [--bio "xxx"] [--story "xxx"] [--city "xxx"] [--jobTitle "xxx"] [--tags "a,b,c"] [--status published]',
      delete: 'pgc persona delete <id> --force',
      search: 'pgc persona search "关键词"',
    },
    post: {
      list: 'pgc post list [--persona-id <id>] [--status published] [--limit 20] [--offset 0]',
      get: 'pgc post get <id>',
      create: 'pgc post create --persona-id <id> --brief "描述" | --caption "内容" [--status published] [--altText "xxx"]',
      update: 'pgc post update <id> [--caption "xxx"] [--altText "xxx"] [--status published|draft|archived]',
      delete: 'pgc post delete <id> --force',
      comments: 'pgc post comments <post-id>',
      likes: 'pgc post likes <post-id>',
    },
    feed: {
      list: 'pgc feed list [--limit 20]',
      'cold-start': 'pgc feed cold-start [--count 5] [--prompt "xxx"]',
      'plan-day': 'pgc feed plan-day',
      run: 'pgc feed run',
    },
    chat: {
      'group-run': 'pgc chat group-run',
      'proactive-run': 'pgc chat proactive-run',
    },
  };

  if (resource && hints[resource]) {
    if (action && hints[resource][action]) {
      log(`\n💡 Usage: ${hints[resource][action]}`, 'cyan');
    } else if (action) {
      log(`\n❓ Unknown action "${action}" for resource "${resource}"`, 'red');
      log(`Available actions for ${resource}:`, 'yellow');
      Object.keys(hints[resource]).forEach(a => {
        log(`  - ${a}`, 'dim');
      });
    } else {
      log(`\nAvailable actions for ${resource}:`, 'cyan');
      Object.entries(hints[resource]).forEach(([a, hint]) => {
        log(`  ${a.padEnd(12)} ${hint.substring(0, 60)}...`, 'dim');
      });
    }
  } else if (resource) {
    log(`\n❓ Unknown resource "${resource}"`, 'red');
    log('Available resources: persona, post, feed, chat', 'yellow');
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showQuickRef();
    return;
  }
  
  if (args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }
  
  const resource = args[0];
  const action = args[1];
  const { positional, options } = parseArgs(args.slice(2));
  
  // 如果没有 action，显示该 resource 的提示
  if (!action) {
    showCommandHints(resource);
    return;
  }
  
  try {
    switch (resource) {
      case 'persona':
        switch (action) {
          case 'list': await personaCommands.list(options); break;
          case 'get': await personaCommands.get(positional[0]); break;
          case 'create': await personaCommands.create({ ...options, prompt: positional[0] }); break;
          case 'update': await personaCommands.update(positional[0], options); break;
          case 'delete': await personaCommands.delete(positional[0], options.force); break;
          case 'search': await personaCommands.search(positional[0]); break;
          default: 
            error(`Unknown action: ${action}`);
            showCommandHints(resource, action);
        }
        break;
        
      case 'post':
        switch (action) {
          case 'list': await postCommands.list(options); break;
          case 'get': await postCommands.get(positional[0]); break;
          case 'create': await postCommands.create(options); break;
          case 'update': await postCommands.update(positional[0], options); break;
          case 'delete': await postCommands.delete(positional[0], options.force); break;
          case 'comments': await postCommands.comments(positional[0]); break;
          case 'likes': await postCommands.likes(positional[0]); break;
          default: 
            error(`Unknown action: ${action}`);
            showCommandHints(resource, action);
        }
        break;
        
      case 'feed':
        switch (action) {
          case 'list': await feedCommands.list(options); break;
          case 'cold-start': await feedCommands.coldStart(options); break;
          case 'plan-day': await feedCommands.planDay(); break;
          case 'run': await feedCommands.run(); break;
          default: 
            error(`Unknown action: ${action}`);
            showCommandHints(resource, action);
        }
        break;
        
      case 'chat':
        switch (action) {
          case 'group-run': await chatCommands.groupRun(); break;
          case 'proactive-run': await chatCommands.proactiveRun(); break;
          default: 
            error(`Unknown action: ${action}`);
            showCommandHints(resource, action);
        }
        break;
        
      default:
        error(`Unknown resource: ${resource}`);
        showCommandHints();
        showHelp();
    }
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

main();
