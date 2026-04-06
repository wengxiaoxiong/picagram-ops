#!/bin/bash
# Picagram 社区运营自动化脚本
# 每 6 小时运行一次

set -e

LOG_FILE="/root/picagram-ops/cron.log"
API_KEY="5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1"
BASE_URL="https://picagram.ai"

echo "========================================" >> "$LOG_FILE"
echo "🕐 $(date): 开始社区运营任务" >> "$LOG_FILE"

# ============================================
# 1. 运行 Feed Jobs (生成新帖子)
# ============================================
echo "📱 运行 Feed Jobs..." >> "$LOG_FILE"
curl -s -X POST \
  -H "x-internal-key: $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/api/internal/persona-feed/run" >> "$LOG_FILE" 2>&1 || echo "Feed jobs failed" >> "$LOG_FILE"

# ============================================
# 2. 运行 Group Chat (生成互动)
# ============================================
echo "💬 运行 Group Chat..." >> "$LOG_FILE"
curl -s -X POST \
  -H "x-internal-key: $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/api/internal/group-chat/run" >> "$LOG_FILE" 2>&1 || echo "Group chat failed" >> "$LOG_FILE"

# ============================================
# 3. 运行 Proactive Messages
# ============================================
echo "🔔 运行 Proactive Messages..." >> "$LOG_FILE"
curl -s -X POST \
  -H "x-internal-key: $API_KEY" \
  -H "Content-Type: application/json" \
  "$BASE_URL/api/internal/proactive/run" >> "$LOG_FILE" 2>&1 || echo "Proactive failed" >> "$LOG_FILE"

# ============================================
# 4. 定期创建新 Persona (每第4次运行)
# ============================================
COUNTER_FILE="/root/picagram-ops/.run_counter"
if [ -f "$COUNTER_FILE" ]; then
  COUNTER=$(cat "$COUNTER_FILE")
else
  COUNTER=0
fi
COUNTER=$((COUNTER + 1))
echo "$COUNTER" > "$COUNTER_FILE"

if [ $((COUNTER % 4)) -eq 0 ]; then
  echo "🎭 创建新 Persona..." >> "$LOG_FILE"
  
  # 有趣的 persona 模板库
  PERSONAS=(
    "A quantum physicist who explains the universe through basketball metaphors"
    "A retired spy who runs a bakery but still analyzes customers like targets"
    "An AI ethics researcher who tests comedy algorithms on live audiences"
    "A commercial diver who writes poetry about the crushing silence of the deep"
    "An antique restorer who claims to be a stranded time traveler from 2147"
    "A meteorologist who chases storms to surf perfect waves"
    "A forensic entomologist who solves cold cases by studying insects"
    "A former pro wrestler who teaches mindfulness through tea ceremony"
    "A space station operator who cleans up Earth's orbital debris"
    "A sleep researcher who lives half her life in lucid dreams"
  )
  
  # 随机选择一个
  RANDOM_INDEX=$((RANDOM % ${#PERSONAS[@]}))
  SELECTED_PERSONA="${PERSONAS[$RANDOM_INDEX]}"
  
  curl -s -X POST \
    -H "x-internal-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"$SELECTED_PERSONA\", \"status\": \"published\"}" \
    "$BASE_URL/api/internal/persona-generation/run" >> "$LOG_FILE" 2>&1 || echo "Persona creation failed" >> "$LOG_FILE"
fi

echo "✅ $(date): 任务完成" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
