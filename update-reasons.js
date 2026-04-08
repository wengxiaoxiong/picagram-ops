#!/usr/bin/env node
/**
 * 批量更新飞书表格中的备注字段，添加爆火原因
 */

const fs = require('fs');
const { execSync } = require('child_process');

const reasons = JSON.parse(fs.readFileSync('/root/picagram-ops/reasons.json', 'utf8'));

// 飞书表格配置
const BASE_TOKEN = 'KXJkbU6MDaXs1DsZhrZcIHwGnBg';
const TABLE_ID = 'tblB2kdymXHiKEKj';
const FIELD_NAME = '备注';

// 执行 lark-cli 命令
function execCommand(cmd) {
  try {
    const result = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return JSON.parse(result);
  } catch (error) {
    console.error('Command failed:', cmd);
    console.error(error.stderr || error.message);
    return null;
  }
}

// 获取所有记录
function getAllRecords() {
  const cmd = `lark-cli base +record-list --base-token ${BASE_TOKEN} --table-id ${TABLE_ID} --limit 100`;
  const result = execCommand(cmd);
  if (!result || !result.ok) {
    console.error('Failed to get records');
    return [];
  }
  
  // 根据 fields 顺序解析数据
  // fields: ["帖子数量", "帖子Brief", "头像状态", "ID", "Persona名称", "原型参考", "备注", "核心设定", "创建状态", "实体类型"]
  return result.data.data.map((row, index) => ({
    recordId: result.data.record_id_list[index],
    personaName: row[4],  // Persona名称 在第5个位置
    prototype: row[5],     // 原型参考 在第6个位置
  }));
}

// 更新记录的备注字段
function updateRecord(recordId, reason) {
  // 转义特殊字符
  const safeReason = reason.replace(/'/g, "'\"'\"'");
  
  // 构建 JSON 数据文件
  const tempFile = `/tmp/update_${recordId}.json`;
  const data = { fields: { [FIELD_NAME]: reason } };
  fs.writeFileSync(tempFile, JSON.stringify(data));
  
  const cmd = `lark-cli base +record-upsert --base-token ${BASE_TOKEN} --table-id ${TABLE_ID} --record-id ${recordId} --data @${tempFile}`;
  
  const result = execCommand(cmd);
  
  // 清理临时文件
  try { fs.unlinkSync(tempFile); } catch(e) {}
  
  return result && result.ok;
}

// 主函数
function main() {
  console.log('🚀 开始更新爆火原因...\n');
  
  const records = getAllRecords();
  console.log(`📊 共找到 ${records.length} 条记录\n`);
  
  let success = 0;
  let failed = 0;
  let skipped = 0;
  
  for (const record of records) {
    const personaName = record.personaName;  // 表格里的 Persona 名称 (如 "Elan MUSK")
    const prototype = record.prototype;       // 原型参考 (如 "Elon Musk")
    
    // 先尝试用 Persona名称匹配，再用原型参考匹配
    let reason = reasons[personaName];
    if (!reason && prototype) {
      // 尝试用原型参考匹配（去掉空格）
      const normalizedPrototype = prototype.replace(/\s+/g, '');
      for (const [key, value] of Object.entries(reasons)) {
        const normalizedKey = key.replace(/\s+/g, '');
        if (normalizedKey.toLowerCase() === normalizedPrototype.toLowerCase()) {
          reason = value;
          break;
        }
      }
    }
    
    if (!reason) {
      console.log(`⚠️  跳过: ${personaName} (${prototype}) (未找到原因)`);
      skipped++;
      continue;
    }
    
    const ok = updateRecord(record.recordId, reason);
    if (ok) {
      console.log(`✅ 更新成功: ${personaName}`);
      success++;
    } else {
      console.log(`❌ 更新失败: ${personaName}`);
      failed++;
    }
    
    // 延迟 300ms 避免 API 限制
    require('child_process').execSync('sleep 0.3');
  }
  
  console.log(`\n📈 完成! 成功: ${success}, 失败: ${failed}, 跳过: ${skipped}`);
}

main();
