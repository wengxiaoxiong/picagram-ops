#!/bin/bash
# 检查帖子重复度和质量的脚本

set -e

API_KEY="5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1"
BASE_URL="https://picagram.ai"
LOG_FILE="/root/picagram-ops/quality-check.log"

echo "========================================" | tee -a "$LOG_FILE"
echo "🔍 $(date): 开始内容质量检查" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# ============================================
# 1. 获取所有帖子
# ============================================
echo "📊 获取帖子数据..." | tee -a "$LOG_FILE"
POSTS=$(curl -s -H "x-internal-key: $API_KEY" \
  "$BASE_URL/api/internal/posts?limit=500" 2>/dev/null)

# ============================================
# 2. 检查模板化内容
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "📝 检查模板化内容..." | tee -a "$LOG_FILE"

# 常见的模板化开头
TEMPLATE_PATTERNS=(
  "A small scene from today says more"
  "I promised myself I wouldn't post about"
  "Nobody warned me"
  "If you're seeing this"
  "Small update:"
)

TEMPLATE_COUNT=0
for pattern in "${TEMPLATE_PATTERNS[@]}"; do
  count=$(echo "$POSTS" | grep -c "$pattern" || echo 0)
  if [ "$count" -gt 0 ]; then
    echo "  ⚠️ 发现模板 '$pattern': $count 次" | tee -a "$LOG_FILE"
    TEMPLATE_COUNT=$((TEMPLATE_COUNT + count))
  fi
done

if [ "$TEMPLATE_COUNT" -eq 0 ]; then
  echo "  ✅ 未发现明显模板化内容" | tee -a "$LOG_FILE"
else
  echo "  ⚠️ 总共发现 $TEMPLATE_COUNT 条模板化帖子" | tee -a "$LOG_FILE"
fi

# ============================================
# 3. 检查重复 Persona
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "👥 检查重复 Persona..." | tee -a "$LOG_FILE"

PERSONAS=$(curl -s -H "x-internal-key: $API_KEY" \
  "$BASE_URL/api/internal/personas?limit=200" 2>/dev/null)

# 检查名字重复
echo "$PERSONAS" | jq -r '.personas[] | .displayName' 2>/dev/null | \
  sort | uniq -d | while read name; do
  if [ -n "$name" ]; then
    echo "  ⚠️ 发现重复名字: $name" | tee -a "$LOG_FILE"
  fi
done

# 检查 Mirror 相关 persona 数量
MIRROR_COUNT=$(echo "$PERSONAS" | grep -ci "mirror" || echo 0)
if [ "$MIRROR_COUNT" -gt 3 ]; then
  echo "  ⚠️ Mirror 相关 persona 过多: $MIRROR_COUNT 个" | tee -a "$LOG_FILE"
else
  echo "  ✅ Mirror persona 数量正常: $MIRROR_COUNT 个" | tee -a "$LOG_FILE"
fi

# ============================================
# 4. 统计信息
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "📈 统计信息:" | tee -a "$LOG_FILE"

TOTAL_PERSONAS=$(echo "$PERSONAS" | jq '.personas | length' 2>/dev/null || echo 0)
TOTAL_POSTS=$(echo "$POSTS" | jq '.posts | length' 2>/dev/null || echo 0)

echo "  总 Persona 数: $TOTAL_PERSONAS" | tee -a "$LOG_FILE"
echo "  总帖子数: $TOTAL_POSTS" | tee -a "$LOG_FILE"

# 计算每个 persona 的平均帖子数
if [ "$TOTAL_PERSONAS" -gt 0 ]; then
  AVG_POSTS=$(echo "scale=1; $TOTAL_POSTS / $TOTAL_PERSONAS" | bc 2>/dev/null || echo "N/A")
  echo "  平均每 persona 帖子数: $AVG_POSTS" | tee -a "$LOG_FILE"
fi

# ============================================
# 5. 建议
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "💡 建议:" | tee -a "$LOG_FILE"

if [ "$TOTAL_PERSONAS" -gt 80 ]; then
  echo "  - Persona 数量偏多，建议清理到 30-50 个" | tee -a "$LOG_FILE"
fi

if [ "$TEMPLATE_COUNT" -gt 50 ]; then
  echo "  - 模板化内容过多，建议优化生成 prompt" | tee -a "$LOG_FILE"
fi

if [ "$MIRROR_COUNT" -gt 3 ]; then
  echo "  - Mirror persona 过多，建议删除重复的" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "✅ 检查完成" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
