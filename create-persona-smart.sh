#!/bin/bash
# 创建有趣的原创 Persona - 智能去重版本

set -e

API_KEY="5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1"
BASE_URL="https://picagram.ai"
LOG_FILE="/root/picagram-ops/persona-creation.log"

# 已使用的 persona 概念记录文件
USED_CONCEPTS_FILE="/root/picagram-ops/.used_persona_concepts"

# 初始化记录文件
if [ ! -f "$USED_CONCEPTS_FILE" ]; then
  touch "$USED_CONCEPTS_FILE"
fi

# ============================================
# Persona 模板库 - 按类别组织
# ============================================

# 职业 + 意外身份组合
OCCUPATION_COMBOS=(
  "A funeral director who is also a stand-up comedian, finding humor in the darkest moments"
  "A professional chess player who works as a nightclub bouncer, applying game theory to conflict resolution"
  "A taxidermist who writes romance novels, preserving love stories as meticulously as animals"
  "A lighthouse keeper who runs an underground radio station for ships at night"
  "A mortician who is a secret matchmaker, pairing souls even after death"
)

# 超自然 +  mundane 组合
SUPERNATURAL_COMBOS=(
  "A ghost who works as a life coach, ironically helping the living achieve their goals"
  "A werewolf who is a marriage counselor, understanding both wild and tame sides of relationships"
  "A vampire who is a solar panel salesman, struggling with the irony every day"
  "A time traveler who works as a stockbroker, always knowing yesterday's prices"
  "A psychic who works at a tech support call center, knowing the problem before you describe it"
)

# 科技 + 人文组合
TECH_HUMAN_COMBOS=(
  "An AI researcher who practices ancient shamanic rituals, bridging silicon and spirit"
  "A blockchain developer who lives off-grid in a cabin, decentralizing their own life"
  "A drone pilot who photographs endangered birds, using technology to capture nature"
  "A cybersecurity expert who writes handwritten letters, protecting digital and analog worlds"
  "A VR designer who grows bonsai trees, crafting virtual and physical miniature worlds"
)

# 艺术 + 科学组合
ART_SCIENCE_COMBOS=(
  "A microbiologist who paints using bacteria colonies, creating living art that evolves"
  "A mathematician who composes jazz, finding improvisation in equations"
  "A forensic accountant who writes poetry about numbers, finding beauty in balance sheets"
  "A neurologist who is a graffiti artist, mapping the brain on city walls"
  "A quantum physicist who is a flamenco dancer, expressing uncertainty through movement"
)

# 孤独职业 + 观察视角
LONELY_OBSERVERS=(
  "A night security guard at an art museum who has conversations with the paintings"
  "A toll booth operator who writes biographies of the people who pass through"
  "A satellite ground station operator who feels the loneliness of space"
  "A submarine cook who documents the psychological changes of the crew on long missions"
  "A penguin researcher in Antarctica who has forgotten how to talk to humans"
)

# 所有类别
ALL_CATEGORIES=(
  "OCCUPATION_COMBOS"
  "SUPERNATURAL_COMBOS"
  "TECH_HUMAN_COMBOS"
  "ART_SCIENCE_COMBOS"
  "LONELY_OBSERVERS"
)

# ============================================
# 函数
# ============================================

# 检查概念是否已使用
is_concept_used() {
  local concept="$1"
  grep -Fxq "$concept" "$USED_CONCEPTS_FILE" 2>/dev/null
}

# 标记概念为已使用
mark_concept_used() {
  local concept="$1"
  echo "$concept" >> "$USED_CONCEPTS_FILE"
}

# 获取未使用的概念
get_unused_concept() {
  local attempts=0
  local max_attempts=50
  
  while [ $attempts -lt $max_attempts ]; do
    # 随机选择一个类别
    local category_index=$((RANDOM % ${#ALL_CATEGORIES[@]}))
    local category_name="${ALL_CATEGORIES[$category_index]}"
    
    # 获取该类别的数组
    eval "local category_array=(\"\${${category_name}[@]}\")"
    
    # 随机选择该类别中的一个概念
    local concept_index=$((RANDOM % ${#category_array[@]}))
    local concept="${category_array[$concept_index]}"
    
    # 检查是否已使用
    if ! is_concept_used "$concept"; then
      echo "$concept"
      return 0
    fi
    
    attempts=$((attempts + 1))
  done
  
  # 如果所有概念都用过了，返回一个随机的新概念
  echo "A unique individual with an unexpected combination of skills and perspectives"
  return 1
}

# 创建 persona
create_persona() {
  local concept="$1"
  
  echo "🎭 创建新 Persona: $concept" | tee -a "$LOG_FILE"
  
  local result=$(curl -s -X POST \
    -H "x-internal-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"$concept\", \"status\": \"published\"}" \
    "$BASE_URL/api/internal/persona-generation/run" 2>&1)
  
  if echo "$result" | grep -q "personaIds"; then
    echo "✅ 创建成功: $(echo "$result" | grep -o '"personaIds":\[[^]]*\]')" | tee -a "$LOG_FILE"
    mark_concept_used "$concept"
    return 0
  else
    echo "❌ 创建失败: $result" | tee -a "$LOG_FILE"
    return 1
  fi
}

# ============================================
# 主程序
# ============================================

echo "========================================" | tee -a "$LOG_FILE"
echo "🚀 $(date): 开始创建新 Persona" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# 获取未使用的概念
CONCEPT=$(get_unused_concept)

# 创建 persona
if create_persona "$CONCEPT"; then
  echo "" | tee -a "$LOG_FILE"
  echo "✅ 任务完成" | tee -a "$LOG_FILE"
else
  echo "" | tee -a "$LOG_FILE"
  echo "⚠️ 任务失败，但已记录" | tee -a "$LOG_FILE"
fi

echo "========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
