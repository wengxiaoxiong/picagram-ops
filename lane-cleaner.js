#!/usr/bin/env node
/**
 * Picagram Persona Lane Cleaner
 * 批量替换 persona 名称中的 "Lane" 后缀
 * 带 TUI 交互界面
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// 获取所有带 Lane 的 persona
function getLanePersonas() {
  try {
    const output = execSync('pgc persona list 2>&1', { encoding: 'utf8', timeout: 30000 });
    const lines = output.split('\n');
    const personas = [];
    
    let currentPersona = null;
    for (const line of lines) {
      // 匹配名字行: [36mName[0m (slug)[0m
      const nameMatch = line.match(/\[36m(.+?)\[0m \((.+?)\)/);
      if (nameMatch && nameMatch[1].includes('Lane')) {
        currentPersona = {
          displayName: nameMatch[1].replace(/\[0m$/, ''),
          slug: nameMatch[2].replace(/\[0m$/, ''),
          id: null,
          createdAt: null
        };
      }
      
      // 匹配 ID 行
      if (currentPersona && line.includes('ID:')) {
        const idMatch = line.match(/ID: ([a-z0-9]+)/);
        if (idMatch) currentPersona.id = idMatch[1];
      }
      
      // 匹配创建时间
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
    console.error(`${colors.red}Error fetching personas: ${error.message}${colors.reset}`);
    return [];
  }
}

// 生成新的名字（移除 Lane）
function generateNewName(oldName) {
  // 移除 " Lane" 后缀
  let newName = oldName.replace(/\s+Lane$/i, '');
  
  // 特殊处理：如果名字变成空或太短，添加默认后缀
  if (!newName || newName.length < 2) {
    newName = 'Unknown';
  }
  
  return newName;
}

// 生成新的 slug
function generateNewSlug(oldSlug) {
  return oldSlug.replace(/-lane$/i, '');
}

// 更新 persona
function updatePersona(persona, newName, dryRun = true) {
  const newSlug = generateNewSlug(persona.slug);
  
  if (dryRun) {
    return { success: true, newName, newSlug };
  }
  
  try {
    // 使用 pgc CLI 更新 persona
    // 注意：pgc 可能没有直接更新名字的命令，我们需要调用 API
    const cmd = `cd ~/picagram && npx tsx scripts/update-persona-name.ts "${persona.id}" "${newName}" "${newSlug}"`;
    const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    return { success: true, newName, newSlug, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 打印标题
function printHeader() {
  console.clear();
  console.log(`${colors.cyan}${colors.bright}`);
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║          Picagram Persona Lane Cleaner                       ║');
  console.log('║          批量移除 Persona 名称中的 "Lane" 后缀               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}\n`);
}

// 主菜单
function showMainMenu(personas) {
  printHeader();
  
  console.log(`${colors.yellow}发现 ${personas.length} 个带 "Lane" 的 Persona:${colors.reset}\n`);
  
  personas.forEach((p, i) => {
    const newName = generateNewName(p.displayName);
    const status = p.displayName === newName ? `${colors.red}⚠ 无需修改` : `${colors.green}→ ${newName}`;
    console.log(`  ${colors.dim}${i + 1}.${colors.reset} ${colors.cyan}${p.displayName}${colors.reset} ${status}${colors.reset}`);
    console.log(`     ${colors.dim}ID: ${p.id} | 创建于: ${p.createdAt}${colors.reset}\n`);
  });
  
  console.log(`${colors.bright}操作选项:${colors.reset}\n`);
  console.log(`  ${colors.green}[1]${colors.reset} 预览修改 (Dry Run)`);
  console.log(`  ${colors.green}[2]${colors.reset} 执行修改`);
  console.log(`  ${colors.green}[3]${colors.reset} 查看最新 10 个 Persona`);
  console.log(`  ${colors.red}[0]${colors.reset} 退出\n`);
  
  return new Promise((resolve) => {
    rl.question(`${colors.bright}请选择操作 [0-3]: ${colors.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 预览模式
function previewChanges(personas) {
  printHeader();
  console.log(`${colors.yellow}${colors.bright}📋 修改预览 (Dry Run)${colors.reset}\n`);
  
  let changeCount = 0;
  personas.forEach((p, i) => {
    const newName = generateNewName(p.displayName);
    const newSlug = generateNewSlug(p.slug);
    
    if (p.displayName !== newName) {
      changeCount++;
      console.log(`${colors.dim}${i + 1}.${colors.reset} ${colors.red}${p.displayName}${colors.reset}`);
      console.log(`   ${colors.green}→ ${newName}${colors.reset}`);
      console.log(`   ${colors.dim}Slug: ${p.slug} → ${newSlug}${colors.reset}\n`);
    }
  });
  
  if (changeCount === 0) {
    console.log(`${colors.yellow}没有找到需要修改的 Persona${colors.reset}\n`);
  } else {
    console.log(`${colors.green}共 ${changeCount} 个 Persona 将被修改${colors.reset}\n`);
  }
  
  return new Promise((resolve) => {
    rl.question(`${colors.dim}按回车键返回主菜单...${colors.reset}`, () => {
      resolve();
    });
  });
}

// 执行修改
async function executeChanges(personas) {
  printHeader();
  console.log(`${colors.red}${colors.bright}⚠️  即将执行修改${colors.reset}\n`);
  
  const toUpdate = personas.filter(p => {
    const newName = generateNewName(p.displayName);
    return p.displayName !== newName;
  });
  
  if (toUpdate.length === 0) {
    console.log(`${colors.yellow}没有需要修改的 Persona${colors.reset}\n`);
    await new Promise(r => rl.question(`${colors.dim}按回车键返回...${colors.reset}`, r));
    return;
  }
  
  console.log(`将修改以下 ${toUpdate.length} 个 Persona:\n`);
  toUpdate.forEach((p, i) => {
    const newName = generateNewName(p.displayName);
    console.log(`  ${i + 1}. ${colors.red}${p.displayName}${colors.reset} → ${colors.green}${newName}${colors.reset}`);
  });
  
  console.log('');
  const confirm = await new Promise((resolve) => {
    rl.question(`${colors.red}确认执行? (yes/no): ${colors.reset}`, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
  
  if (confirm !== 'yes') {
    console.log(`\n${colors.yellow}已取消操作${colors.reset}`);
    await new Promise(r => rl.question(`${colors.dim}按回车键返回...${colors.reset}`, r));
    return;
  }
  
  console.log(`\n${colors.bright}开始执行...${colors.reset}\n`);
  
  // 这里我们需要创建更新脚本
  const fs = require('fs');
  const updateScript = `
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updatePersona(personaId, newName, newSlug) {
  try {
    await prisma.persona.update({
      where: { id: personaId },
      data: { slug: newSlug }
    });
    
    await prisma.personaLocalization.updateMany({
      where: { personaId: personaId },
      data: { displayName: newName }
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const [,, personaId, newName, newSlug] = process.argv;
updatePersona(personaId, newName, newSlug).then(result => {
  console.log(JSON.stringify(result));
  process.exit(result.success ? 0 : 1);
});
`;
  
  fs.writeFileSync('/root/picagram/scripts/update-persona-name.ts', updateScript);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const p of toUpdate) {
    const newName = generateNewName(p.displayName);
    const newSlug = generateNewSlug(p.slug);
    
    process.stdout.write(`  更新 ${p.displayName}... `);
    
    try {
      const result = updatePersona(p, newName, false);
      if (result.success) {
        console.log(`${colors.green}✓${colors.reset}`);
        successCount++;
      } else {
        console.log(`${colors.red}✗ ${result.error}${colors.reset}`);
        failCount++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ ${error.message}${colors.reset}`);
      failCount++;
    }
  }
  
  console.log(`\n${colors.bright}执行完成:${colors.reset}`);
  console.log(`  ${colors.green}成功: ${successCount}${colors.reset}`);
  console.log(`  ${colors.red}失败: ${failCount}${colors.reset}\n`);
  
  await new Promise(r => rl.question(`${colors.dim}按回车键返回...${colors.reset}`, r));
}

// 查看最新 10 个 persona
function showLatestPersonas() {
  printHeader();
  console.log(`${colors.cyan}${colors.bright}📅 最新 10 个 Persona${colors.reset}\n`);
  
  try {
    const output = execSync('pgc persona list 2>&1', { encoding: 'utf8', timeout: 30000 });
    const lines = output.split('\n');
    const personas = [];
    
    let currentPersona = null;
    for (const line of lines) {
      const nameMatch = line.match(/\[36m(.+?)\[0m \((.+?)\)/);
      if (nameMatch) {
        currentPersona = {
          displayName: nameMatch[1].replace(/\[0m$/, ''),
          slug: nameMatch[2].replace(/\[0m$/, ''),
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
    
    // 按创建时间排序（最新的在前）
    const latest = personas.slice(0, 10);
    
    latest.forEach((p, i) => {
      const hasLane = p.displayName.includes('Lane') ? `${colors.yellow} [Lane]` : '';
      console.log(`  ${colors.dim}${i + 1}.${colors.reset} ${colors.cyan}${p.displayName}${colors.reset}${hasLane}${colors.reset}`);
      console.log(`     ${colors.dim}ID: ${p.id}${colors.reset}`);
      console.log(`     ${colors.dim}创建于: ${p.createdAt}${colors.reset}\n`);
    });
    
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}\n`);
  }
  
  return new Promise((resolve) => {
    rl.question(`${colors.dim}按回车键返回主菜单...${colors.reset}`, () => {
      resolve();
    });
  });
}

// 主循环
async function main() {
  const personas = getLanePersonas();
  
  while (true) {
    const choice = await showMainMenu(personas);
    
    switch (choice) {
      case '1':
        await previewChanges(personas);
        break;
      case '2':
        await executeChanges(personas);
        // 刷新列表
        const updatedPersonas = getLanePersonas();
        personas.length = 0;
        personas.push(...updatedPersonas);
        break;
      case '3':
        await showLatestPersonas();
        break;
      case '0':
        console.log(`\n${colors.green}再见!${colors.reset}\n`);
        rl.close();
        return;
      default:
        console.log(`\n${colors.red}无效选项${colors.reset}`);
        await new Promise(r => setTimeout(r, 1000));
    }
  }
}

main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  rl.close();
  process.exit(1);
});
