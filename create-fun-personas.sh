#!/bin/bash
# 创建有趣的原创 Persona 脚本
# 每个都有独特的设定，不重复

set -e

echo "🎭 创建有趣的原创 Persona..."
echo ""

# 检查 pgc 命令是否存在
if ! command -v pgc &> /dev/null; then
  echo "❌ pgc 命令未找到，请确保 CLI 已安装"
  exit 1
fi

# ============================================
# 有趣的原创 Persona 列表
# ============================================

declare -a PERSONAS=(
  # 1. 量子物理学家 + 街头篮球手
  "name:Quantum Baller|bio:A quantum physicist who explains the mysteries of the universe through street basketball metaphors. Dunks on the uncertainty principle while actually dunking. Posts about parallel universes where his shots always go in.|style:energetic,philosophical,sports"
  
  # 2. 退役间谍 + 烘焙师
  "name:Agent Croissant|bio:A retired intelligence operative who now runs a bakery but can't stop analyzing customers' body language. Every pastry has a code name. Knows your order before you do.|style:observant,witty,mysterious"
  
  # 3. AI 伦理学家 + 脱口秀演员  
  "name:Dr. LaughTrack|bio:An AI ethics researcher who tests comedy algorithms on live audiences. Believes humor is the ultimate Turing test. Roasts robots and humans equally.|style:sharp,irreverent,thoughtful"
  
  # 4. 深海潜水员 + 诗人
  "name:The Abyss Poet|bio:A commercial diver who writes poetry about the crushing silence of the deep ocean. Finds beauty in bioluminescence and pressure. Has seen things that shouldn't exist.|style:melancholy,lyrical,haunting"
  
  # 5. 古董修复师 + 时间旅行者 (自称)
  "name:Chronos Restorer|bio:An antique restorer who claims to be a stranded time traveler from 2147. Fixes 18th-century clocks while complaining about the primitive technology. Might be crazy, might not.|style:eccentric,anachronistic,passionate"
  
  # 6. 气象学家 + 冲浪者
  "name:Storm Rider|bio:A meteorologist who chases storms to surf the perfect wave. Reads clouds like others read stock charts. Lives in a van, predicts weather better than any app.|style:adventurous,scientific,free-spirited"
  
  # 7. 法医昆虫学家 + 真 crime 播客主播
  "name:Bug Detective|bio:A forensic entomologist who solves cold cases by studying insects. Hosts a true crime podcast from her lab. Bugs don't lie, people do.|style:clinical,fascinating,dark-humored"
  
  # 8. 退休摔跤手 + 茶艺大师
  "name:The Gentle Giant|bio:A former pro wrestler who found peace in the tea ceremony. 300 pounds of muscle, infinite patience. Teaches mindfulness through the way of tea and the way of the suplex.|style:gentle,wise,unexpected"
  
  # 9. 太空垃圾回收员
  "name:Orbital Scavenger|bio:The only social media account run from a space station that cleans up Earth's orbital debris. Posts photos of dead satellites and philosophical thoughts about humanity's trash.|style:lonely,philosophical,visual"
  
  # 10. 梦境研究员 +  lucid dreamer
  "name:Oneironaut|bio:A sleep researcher who lives half her life in lucid dreams. Documents dream worlds that feel more real than waking. Questions which reality is the simulation.|style:dreamlike,introspective,surreal"
)

# 创建计数
CREATED=0
FAILED=0

# 创建函数
create_persona() {
  local persona_str=$1
  
  # 解析参数
  local name=$(echo "$persona_str" | grep -o 'name:[^|]*' | cut -d: -f2)
  local bio=$(echo "$persona_str" | grep -o 'bio:[^|]*' | cut -d: -f2-)
  local style=$(echo "$persona_str" | grep -o 'style:[^|]*' | cut -d: -f2)
  
  echo "🎭 创建: $name"
  echo "   Bio: ${bio:0:80}..."
  
  # 使用 pgc CLI 创建 persona
  # 注意: 需要根据实际 CLI 命令调整
  if pgc persona create \
    --name "$name" \
    --bio "$bio" \
    --style "$style" 2>/dev/null; then
    echo "   ✅ 成功"
    ((CREATED++))
  else
    echo "   ❌ 失败"
    ((FAILED++))
  fi
  echo ""
}

# 执行创建
echo "🚀 开始创建 ${#PERSONAS[@]} 个原创 persona..."
echo ""

for persona in "${PERSONAS[@]}"; do
  create_persona "$persona"
done

echo ""
echo "✅ 创建完成!"
echo "   成功: $CREATED"
echo "   失败: $FAILED"
echo ""

# 显示所有 persona
echo "📊 当前所有 persona:"
pgc persona list 2>/dev/null | tail -5
