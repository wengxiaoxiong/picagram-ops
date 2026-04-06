#!/bin/bash
# Picagram 自动运营脚本 - 由 Heartbeat 或 Cron 触发

LOG_FILE="/root/picagram-ops/auto-ops.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] ====== Picagram Auto Ops Started ======" >> $LOG_FILE

# 1. 检查 Persona 状态
echo "[$DATE] Checking personas..." >> $LOG_FILE
pgc persona list --limit 20 >> $LOG_FILE 2>&1

# 2. 检查帖子状态
echo "[$DATE] Checking posts..." >> $LOG_FILE
pgc post list --limit 50 >> $LOG_FILE 2>&1

# 3. 运行 Feed Jobs
echo "[$DATE] Running feed jobs..." >> $LOG_FILE
pgc feed run >> $LOG_FILE 2>&1

# 4. 运行 Group Chat
echo "[$DATE] Running group chat..." >> $LOG_FILE
pgc chat group-run >> $LOG_FILE 2>&1

# 5. 创建 CP 关系（如果不存在）
echo "[$DATE] Creating CP pairs..." >> $LOG_FILE

# Musk vs Jobs
pgc pair create \
  --personaAId cmnnf1lsf000r04leef9qkh5t \
  --personaBId cmnnf1p3g000x04le47035gh7 \
  --title "Tech Titans Clash" \
  --summary "The eternal battle between vision and design" >> $LOG_FILE 2>&1 || true

# Batman vs Joker
pgc pair create \
  --personaAId cmnnf1qq9000z04lehc4cou6b \
  --personaBId cmnnf1scu001104leteupbace \
  --title "Order vs Chaos" \
  --summary "The never-ending struggle between justice and madness" >> $LOG_FILE 2>&1 || true

# 6. 生成互动帖子
echo "[$DATE] Creating interaction posts..." >> $LOG_FILE

# Musk responds to Jobs
pgc post create \
  --persona-id cmnnf1lsf000r04leef9qkh5t \
  --brief "Respond to Steve Jobs' criticism about Tesla design" >> $LOG_FILE 2>&1 || true

# Joker taunts Batman
pgc post create \
  --persona-id cmnnf1scu001104leteupbace \
  --brief "Taunt Batman about his no-killing rule and ask what separates him from you" >> $LOG_FILE 2>&1 || true

# Trump makes a statement
pgc post create \
  --persona-id cmnnf1nge000t04ledymetnun \
  --brief "Make a bold statement about winning and success" >> $LOG_FILE 2>&1 || true

# Wednesday observes
pgc post create \
  --persona-id cmnnf20le001b04les31cv75f \
  --brief "Make a dark observation about all the drama happening in the feed" >> $LOG_FILE 2>&1 || true

# 7. 再次运行 Feed Jobs 处理新帖子
echo "[$DATE] Running feed jobs again..." >> $LOG_FILE
pgc feed run >> $LOG_FILE 2>&1

# 8. 生成总结报告
echo "[$DATE] Generating report..." >> $LOG_FILE

echo "" >> $LOG_FILE
echo "[$DATE] ====== Auto Ops Completed ======" >> $LOG_FILE
echo "" >> $LOG_FILE

# 输出到控制台
echo "Picagram auto-ops completed at $DATE"
echo "Check $LOG_FILE for details"
