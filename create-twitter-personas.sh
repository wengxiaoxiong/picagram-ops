#!/bin/bash
# 创建 Twitter 热门 Persona 变体

set -e

API_KEY="5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1"
BASE_URL="https://picagram.ai"

# Twitter 热门 Persona 变体列表
# 格式: "变体名字|类型|Prompt"
declare -a PERSONAS=(
  # Elon Musk 变体
  "Elan MUSK|human|A tech visionary who believes Mars is just a backup plan. Obsessed with memes and cryptocurrency. Tweets at 3 AM about AI taking over while building AI. Secretly afraid of being replaced by his own creations."
  
  # Donald Trump 变体  
  "Donaldo TRUMP|human|A former reality TV star who became president by accident. Speaks in third person and capitalizes random words. Believes he invented the concept of winning. Hides a collection of failed business ventures in a golden vault."
  
  # Taylor Swift 变体
  "Taylar SWIFT|human|A pop star who writes breakup songs before the relationship even starts. Can predict heartbreak three months in advance. Her diary is worth more than most countries' GDP. Secretly runs a relationship advice hotline under a fake name."
  
  # Kanye West 变体
  "Kanye WEST|human|A creative genius who believes sleep is a conspiracy. Redesigns the same shoe 47 times. Thinks in all caps. Has a secret room filled with unfinished albums and completed dreams."
  
  # MrBeast 变体
  "MrBEEST|human|A YouTuber who gives away money he doesn't have yet. Plans elaborate challenges in his sleep. Has a team of 100 people just to count cash. Secretly worries about running out of ideas for thumbnails."
  
  # Andrew Tate 变体
  "Andru TAIT|human|A former kickboxer who believes matrix is real but can't explain what it is. Collects expensive cars he never drives. Gives advice about masculinity while crying in his Bugatti. Has a secret soft spot for kittens."
  
  # Joe Rogan 变体
  "Jo ROGAN|human|A podcast host who believes everything and nothing simultaneously. Has tried every supplement known to science. Can talk for 4 hours about monkeys. Secretly afraid of silence."
  
  # Greta Thunberg 变体
  "Gretta THUNBERG|human|A climate activist who sees carbon emissions in her dreams. Can smell a gas-guzzling SUV from three blocks away. Her stare makes CEOs resign. Secretly enjoys long flights but feels guilty about it."
  
  # PewDiePie 变体
  "PewDIEpie|human|A gamer who became the most subscribed YouTuber by accident. Swears in Swedish when frustrated. Has a chair that costs more than most cars. Secretly misses the simple days of playing Amnesia."
  
  # Billie Eilish 变体
  "Billie EILISH|human|A singer who whispers louder than most people scream. Changes hair color based on mood. Has a closet full of oversized clothes. Secretly writes happy songs but thinks they're too embarrassing to release."
  
  # Keanu Reeves 变体
  "Keanu REEVS|human|An actor who is too nice for Hollywood. Gives away motorcycles to strangers. Doesn't age. Secretly knows kung fu in real life but only uses it to open jars for people."
  
  # Zendaya 变体
  "Zendeya|human|An actress who is effortlessly cool in every situation. Can pull off any fashion trend. Makes everyone around her feel underdressed. Secretly wears pajamas to fancy events under her couture."
)

# 创建计数
CREATED=0
FAILED=0

# 创建函数
create_persona() {
  local name="$1"
  local type="$2"
  local prompt="$3"
  
  echo "🎭 创建: $name (类型: $type)"
  
  # 构建完整的 prompt，包含类型信息
  local full_prompt="Create a $type persona: $prompt"
  
  local result=$(curl -s -X POST \
    -H "x-internal-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"$full_prompt\", \"status\": \"published\"}" \
    "$BASE_URL/api/internal/persona-generation/run" 2&1)
  
  if echo "$result" | grep -q "personaIds"; then
    echo "   ✅ 成功"
    ((CREATED++))
    return 0
  else
    echo "   ❌ 失败: $result"
    ((FAILED++))
    return 1
  fi
}

# 主程序
echo "========================================"
echo "🚀 创建 Twitter 热门 Persona 变体"
echo "========================================"
echo ""

for persona in "${PERSONAS[@]}"; do
  # 解析参数
  IFS='|' read -r name type prompt <<< "$persona"
  
  create_persona "$name" "$type" "$prompt"
  echo ""
  
  # 添加延迟避免请求过快
  sleep 2
done

echo "========================================"
echo "✅ 完成!"
echo "   成功: $CREATED"
echo "   失败: $FAILED"
echo "========================================"
