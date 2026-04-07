#!/bin/bash
# 更新飞书表格第11-20个 persona 的备注

BASE_TOKEN="KXJkbU6MDaXs1DsZhrZcIHwGnBg"
TABLE_ID="tblB2kdymXHiKEKj"

# 定义爆火原因（第11-20个）
declare -A REASONS=(
    ["Taylar SWIFT"]="流行天后，以写分手歌闻名。她的恋情和分手都是全球媒体关注的焦点，粉丝群体极其忠诚。"
    ["Donaldo TRUMP"]="前美国总统，争议性政治人物。他的每条推文都能引发全球政治地震，话题性极强。"
    ["Elan MUSK"]="科技 visionary，特斯拉和 SpaceX CEO。火星殖民计划和疯狂推文让他成为科技圈的流量担当。"
    ["Nova"]="都市创意生活的代表，神秘的都市 persona。适合探索现代城市生活的各种面向。"
    ["Nova Lane"]="Nova 的变体，更强调个人品牌和生活方式。适合展示都市创意人群的生活状态。"
    ["A VR Lane"]="VR 设计师，虚拟与现实的跨界者。结合科技与自然的独特人设，具有未来感。"
    ["Oneironaut A Lane"]="清醒梦研究者，生活在梦境与现实之间。神秘、超现实的人设吸引特定受众。"
    ["Orbital Scavenger Lane"]="太空拾荒者，唯一从空间站运营社交账号的 persona。科幻感与真实性的完美结合。"
    ["The Gentle Lane"]="前职业摔跤手转行茶道大师。力量与平静的反差，展现男性气质的新定义。"
    ["Bug Detective Lane"]="法医昆虫学家，通过昆虫解决悬案。独特的职业背景，适合犯罪悬疑内容。"
)

echo "🚀 开始更新第11-20个 persona 的备注..."

# 获取记录列表
echo "📊 获取表格记录..."
lark-cli base +record-list --base-token "$BASE_TOKEN" --table-id "$TABLE_ID" --limit 25 > /tmp/bitable_records.json 2>&1

# 检查是否成功
if ! jq -e '.ok' /tmp/bitable_records.json >/dev/null 2>&1; then
    echo "❌ 获取记录失败"
    cat /tmp/bitable_records.json
    exit 1
fi

# 获取字段顺序
FIELDS=$(jq -r '.data.fields | @csv' /tmp/bitable_records.json | tr ',' '\n' | tr -d '"')

# 找到 Persona名称 的索引
PERSONA_NAME_INDEX=$(echo "$FIELDS" | grep -n "Persona名称" | cut -d: -f1)
PERSONA_NAME_INDEX=$((PERSONA_NAME_INDEX - 1))

echo "  Persona名称 字段索引: $PERSONA_NAME_INDEX"

# 遍历第11-20条记录（索引10-19）
echo ""
echo "📝 更新记录..."

jq -r --arg idx "$PERSONA_NAME_INDEX" '.data | [.["record_id_list"][10:20], .data[10:20]] | transpose | .[] | @base64' /tmp/bitable_records.json | while read -r record; do
    # 解码记录
    DECODED=$(echo "$record" | base64 -d)
    RECORD_ID=$(echo "$DECODED" | jq -r '.[0]')
    
    # 获取 Persona名称
    PERSONA_NAME=$(echo "$DECODED" | jq -r ".[1][$PERSONA_NAME_INDEX]")
    
    # 获取备注
    REASON="${REASONS[$PERSONA_NAME]}"
    
    if [ -z "$REASON" ]; then
        echo "⚠️  跳过: $PERSONA_NAME (未找到原因)"
        continue
    fi
    
    echo "📝 更新: $PERSONA_NAME"
    
    # 构建 JSON 数据
    JSON_DATA=$(jq -n --arg remark "$REASON" '{"备注": $remark}')
    
    # 更新记录
    RESULT=$(lark-cli base +record-upsert --base-token "$BASE_TOKEN" --table-id "$TABLE_ID" --record-id "$RECORD_ID" --json "$JSON_DATA" 2>&1)
    
    if echo "$RESULT" | jq -e '.ok' >/dev/null 2>&1; then
        echo "  ✅ 更新成功"
    else
        echo "  ❌ 更新失败: $(echo "$RESULT" | jq -r '.error // "未知错误"')"
    fi
    
    # 延迟避免 API 限制
    sleep 0.3
done

echo ""
echo "✅ 完成！"
