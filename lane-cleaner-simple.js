#!/usr/bin/env node
/**
 * 直接更新 Persona 名称 - 移除 Lane 后缀
 * 输出 SQL 语句
 */

const { execSync } = require('child_process');

// 颜色代码
const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

// 获取带 Lane 的 persona
function getLanePersonas() {
  try {
    const output = execSync('pgc persona list 2>&1', { encoding: 'utf8', timeout: 30000 });
    const lines = output.split('\n');
    const personas = [];
    
    let currentPersona = null;
    for (const line of lines) {
      const nameMatch = line.match(/\[36m(.+?)\[0m \((.+?)\)/);
      if (nameMatch && nameMatch[1].includes('Lane')) {
        currentPersona = {
          displayName: nameMatch[1].replace(/\x1b$/, ''),
          slug: nameMatch[2].replace(/\x1b$/, ''),
          id: null,
          createdAt: null
        };
      }
      
      if (currentPersona && line.includes('ID:')) {
        const idMatch = line.match(/ID: ([a-z0-9]+)/);
        if (idMatch) currentPersona.id = idMatch[1];
      }
      
      if (currentPersona && line.includes('Created:')) {
        const dateMatch = line.match(/Created: (.+)/);
        if (dateMatch) {
          currentPersona.createdAt = dateMatch[1].trim();
          personas.push(currentPersona);
          currentPersona = null;
        }
      }
    }
    
    return personas;
  } catch (error) {
    console.error(`${c.red}Error: ${error.message}${c.reset}`);
    return [];
  }
}

// 生成新名字
function cleanName(name) {
  return name.replace(/\s+Lane$/i, '').trim();
}

// 主函数
async function main() {
  console.log(`${c.cyan}${c.bright}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Picagram Persona Lane Cleaner');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`${c.reset}\n`);
  
  const personas = getLanePersonas();
  
  console.log(`${c.yellow}发现 ${personas.length} 个带 "Lane" 的 Persona:${c.reset}\n`);
  
  const toUpdate = [];
  personas.forEach((p, i) => {
    const newName = cleanName(p.displayName);
    if (newName !== p.displayName && newName.length > 0) {
      toUpdate.push({ ...p, newName });
      console.log(`  ${c.dim}${i + 1}.${c.reset} ${c.red}${p.displayName}${c.reset} ${c.green}→ ${newName}${c.reset}`);
    }
  });
  
  if (toUpdate.length === 0) {
    console.log(`${c.yellow}没有需要修改的 Persona${c.reset}`);
    return;
  }
  
  console.log(`\n${c.bright}准备修改 ${toUpdate.length} 个 Persona${c.reset}\n`);
  
  // 由于没有直接的 CLI 命令更新 persona 名字，我们需要输出 SQL
  console.log(`${c.cyan}请执行以下 SQL 来更新数据库:${c.reset}\n`);
  console.log(`${c.dim}-- 更新 Persona 名称（移除 Lane 后缀）${c.reset}`);
  
  toUpdate.forEach(p => {
    console.log(`\n-- ${p.displayName} → ${p.newName}`);
    console.log(`UPDATE persona_localization SET display_name = '${p.newName}' WHERE persona_id = '${p.id}' AND locale = 'en';`);
    console.log(`UPDATE persona_localization SET display_name = '${p.newName}' WHERE persona_id = '${p.id}' AND locale = 'zh';`);
  });
  
  console.log(`\n${c.yellow}注意：需要连接到数据库执行这些 SQL 语句${c.reset}`);
}

main();
