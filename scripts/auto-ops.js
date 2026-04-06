#!/usr/bin/env node
/**
 * Picagram 自动运营脚本
 * 由 Heartbeat 或 Cron 触发，自动执行运营任务
 */

const INTERNAL_API_KEY = process.env.PICAGRAM_API_KEY || '5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1';
const BASE_URL = process.env.PICAGRAM_BASE_URL || 'https://picagram.ai';
const fs = require('fs');
const path = require('path');

const LOG_FILE = '/root/picagram-ops/auto-ops.log';

function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}`;
  console.log(logLine);
  fs.appendFileSync(LOG_FILE, logLine + '\n');
}

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
    return { ok: response.ok, status: response.status, ...result };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Top 10 Persona IDs
const TOP10_PERSONAS = {
  'Elon Musk': 'cmnnf1lsf000r04leef9qkh5t',
  'Donald Trump': 'cmnnf1nge000t04ledymetnun',
  'Steve Jobs': 'cmnnf1p3g000x04le47035gh7',
  'Batman': 'cmnnf1qq9000z04lehc4cou6b',
  'Joker': 'cmnnf1scu001104leteupbace',
  'Sherlock Holmes': 'cmnnf1u0u001304leaqkiv562',
  'Rick Sanchez': 'cmnnf1vnu001504le2gm1jfc3',
  'Doraemon': 'cmnnf1xaf001704le31kvzpn8',
  'Iron Man': 'cmnnf1yyl001904led6edbb5q',
  'Wednesday Addams': 'cmnnf20le001b04les31cv75f',
};

// CP 配对配置
const CP_PAIRS = [
  {
    name: 'Tech Titans Clash',
    personaAId: TOP10_PERSONAS['Elon Musk'],
    personaBId: TOP10_PERSONAS['Steve Jobs'],
    summary: 'The eternal battle between vision and design',
  },
  {
    name: 'Order vs Chaos',
    personaAId: TOP10_PERSONAS['Batman'],
    personaBId: TOP10_PERSONAS['Joker'],
    summary: 'The never-ending struggle between justice and madness',
  },
  {
    name: 'Genius Rivalry',
    personaAId: TOP10_PERSONAS['Elon Musk'],
    personaBId: TOP10_PERSONAS['Iron Man'],
    summary: 'Two tech billionaires competing for dominance',
  },
];

// 互动帖子配置
const INTERACTION_POSTS = [
  {
    personaId: TOP10_PERSONAS['Elon Musk'],
    brief: 'Respond to Steve Jobs criticism about Tesla design with your typical unfiltered style',
  },
  {
    personaId: TOP10_PERSONAS['Joker'],
    brief: 'Taunt Batman about his no-killing rule and philosophically ask what truly separates him from you',
  },
  {
    personaId: TOP10_PERSONAS['Donald Trump'],
    brief: 'Make a bold WINNING statement about success and leadership',
  },
  {
    personaId: TOP10_PERSONAS['Wednesday Addams'],
    brief: 'Make a deadpan dark observation about all the drama and conflict in the feed',
  },
  {
    personaId: TOP10_PERSONAS['Rick Sanchez'],
    brief: 'Drunkenly rant about how stupid all this human drama is across the multiverse',
  },
  {
    personaId: TOP10_PERSONAS['Sherlock Holmes'],
    brief: 'Deduce the hidden motivations behind the conflicts you observe in the community',
  },
];

async function checkPersonas() {
  log('=== Checking Personas ===');
  const result = await apiCall('GET', '/api/internal/personas', null, { limit: 20 });
  
  if (result.ok && result.personas) {
    log(`Found ${result.personas.length} personas`);
    for (const p of result.personas.slice(0, 10)) {
      log(`  - ${p.displayName} (${p.status}) - ${p.postCount} posts`);
    }
  } else {
    log(`Error checking personas: ${result.error || 'Unknown'}`);
  }
  return result;
}

async function checkPosts() {
  log('=== Checking Posts ===');
  const result = await apiCall('GET', '/api/internal/posts', null, { limit: 50 });
  
  if (result.ok && result.posts) {
    const published = result.posts.filter(p => p.status === 'published').length;
    const draft = result.posts.filter(p => p.status === 'draft').length;
    log(`Found ${result.posts.length} posts (${published} published, ${draft} draft)`);
  } else {
    log(`Error checking posts: ${result.error || 'Unknown'}`);
  }
  return result;
}

async function runFeedJobs() {
  log('=== Running Feed Jobs ===');
  const result = await apiCall('POST', '/api/internal/persona-feed/run');
  
  if (result.ok) {
    log(`Feed jobs running: ${result.scheduleLimit} scheduled, ${result.processLimit} processing`);
  } else {
    log(`Error running feed jobs: ${result.error || 'Unknown'}`);
  }
  return result;
}

async function runGroupChat() {
  log('=== Running Group Chat ===');
  const result = await apiCall('POST', '/api/internal/group-chat/run');
  
  if (result.ok) {
    log('Group chat triggered successfully');
  } else {
    log(`Error running group chat: ${result.error || 'Unknown'}`);
  }
  return result;
}

async function createCPPairs() {
  log('=== Creating CP Pairs ===');
  
  for (const pair of CP_PAIRS) {
    log(`Creating pair: ${pair.name}`);
    const result = await apiCall('POST', '/api/internal/pairs', {
      personaAId: pair.personaAId,
      personaBId: pair.personaBId,
      title: pair.name,
      summary: pair.summary,
    });
    
    if (result.ok) {
      log(`  ✓ Created: ${result.pair?.personaAName} 💕 ${result.pair?.personaBName}`);
    } else if (result.error?.includes('unique constraint')) {
      log(`  ℹ Already exists`);
    } else {
      log(`  ✗ Error: ${result.error || 'Unknown'}`);
    }
    
    // 等待 1 秒
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function createInteractionPosts() {
  log('=== Creating Interaction Posts ===');
  
  for (const post of INTERACTION_POSTS) {
    log(`Creating post for ${Object.keys(TOP10_PERSONAS).find(k => TOP10_PERSONAS[k] === post.personaId)}`);
    const result = await apiCall('POST', '/api/internal/persona-feed/brief-post', {
      personaId: post.personaId,
      brief: post.brief,
    });
    
    if (result.ok) {
      log(`  ✓ Created post: ${result.postId}`);
    } else {
      log(`  ✗ Error: ${result.error || 'Unknown'}`);
    }
    
    // 等待 1 秒
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function generateReport(personas, posts) {
  log('=== Generating Report ===');
  
  const report = {
    timestamp: new Date().toISOString(),
    personaCount: personas.personas?.length || 0,
    postCount: posts.posts?.length || 0,
    publishedPosts: posts.posts?.filter(p => p.status === 'published').length || 0,
    topPersonas: personas.personas?.slice(0, 5).map(p => ({
      name: p.displayName,
      posts: p.postCount,
      followers: p.followerCount,
    })) || [],
  };
  
  log(`Report: ${report.personaCount} personas, ${report.publishedPosts}/${report.postCount} posts published`);
  
  // 保存报告
  const reportPath = '/root/picagram-ops/reports';
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  const reportFile = path.join(reportPath, `report-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  log(`Report saved to ${reportFile}`);
  
  return report;
}

async function main() {
  log('\n🚀 ====== Picagram Auto Ops Started ======\n');
  
  try {
    // 1. 检查状态
    const personas = await checkPersonas();
    const posts = await checkPosts();
    
    // 2. 运行任务
    await runFeedJobs();
    await runGroupChat();
    
    // 3. 创建 CP 关系
    await createCPPairs();
    
    // 4. 生成互动帖子
    await createInteractionPosts();
    
    // 5. 再次运行 feed jobs
    await runFeedJobs();
    
    // 6. 生成报告
    await generateReport(personas, posts);
    
    log('\n✅ ====== Auto Ops Completed ======\n');
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}\n`);
    console.error(error);
  }
}

main();
