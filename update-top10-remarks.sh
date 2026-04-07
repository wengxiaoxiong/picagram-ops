#!/bin/bash
# 更新飞书表格前10个 persona 的备注

BASE_TOKEN="KXJkbU6MDaXs1DsZhrZcIHwGnBg"
TABLE_ID="tblB2kdymXHiKEKj"

# 定义爆火原因（前10个）
declare -A REASONS=(
    ["Elan MUSK"]="马斯克是全球科技圈最具争议和话题性的人物，他的每条推文都能引发市场波动和全网讨论。其'疯狂科学家'人设和'火星殖民'愿景具有极强的传播力。"
    ["Sam ALtman"]="OpenAI CEO，ChatGPT 的幕后推手，AI 时代的代言人。AI 是当下最热话题，他的言论直接影响行业走向。"
    ["Mark ZUCKERburg"]="Meta CEO，元宇宙概念的推动者。'蜥蜴人'梗和元宇宙争议让他始终保持话题度。"
    ["Jeff BEZOs"]="亚马逊创始人，太空探索公司 Blue Origin 老板。'太空牛仔'人设和天价离婚案让他长期占据头条。"
    ["Bill GATEs"]="微软创始人，慈善家。'疫苗阴谋论'和'5G 控制'梗让他成为网络迷因的常客。"
    ["Tim COOk"]="苹果 CEO，乔布斯的接班人。苹果产品的每一次发布都是全球盛事，他的低调与苹果的辉煌形成反差。"
    ["Satya NADELLa"]="微软 CEO，成功带领微软转型云计算。'云端的诗人'人设和印度裔 CEO 的成功故事具有励志色彩。"
    ["Linus TORvalds"]="Linux 之父，开源运动的领袖。'暴脾气程序员'人设和创造世界最大开源项目的传奇经历。"
    ["Richard STALLman"]="自由软件运动创始人，GNU 项目发起人。极端的自由软件理念和行为艺术式的抗议让他成为话题人物。"
    ["Steve WOZNIAK"]="苹果联合创始人，真正的技术天才。与乔布斯的'双雄故事'和朴实的技术宅形象形成反差萌。"
)

echo "🚀 开始更新前10个 persona 的备注..."

# 获取记录列表
echo "📊 获取表格记录..."
lark-cli base +record-list --base-token "$BASE_TOKEN" --table-id "$TABLE_ID" --limit 15 > /tmp/bitable_records.json 2>&1

# 检查是否成功
if ! jq -e '.ok' /tmp/bitable_records.json >/dev/null 2>&1; then
    echo "❌ 获取记录失败"
    cat /tmp/bitable_records.json
    exit 1
fi

# 获取字段顺序
FIELDS=$(jq -r '.data.fields | @csv' /tmp/bitable_records.json | tr ',' '\n' | tr -d '"')

# 找到 Persona名称 和 备注 的索引
PERSONA_NAME_INDEX=$(echo "$FIELDS" | grep -n "Persona名称" | cut -d: -f1)
REMARK_INDEX=$(echo "$FIELDS" | grep -n "备注" | cut -d: -f1)

# 转换为 0-based 索引
PERSONA_NAME_INDEX=$((PERSONA_NAME_INDEX - 1))
REMARK_INDEX=$((REMARK_INDEX - 1))

echo "  Persona名称 字段索引: $PERSONA_NAME_INDEX"
echo "  备注 字段索引: $REMARK_INDEX"

# 遍历前10条记录并更新
echo ""
echo "📝 更新记录..."

jq -r --arg idx "$PERSONA_NAME_INDEX" '.data | [.["record_id_list"][0:10], .data[0:10]] | transpose | .[] | @base64' /tmp/bitable_records.json | while read -r record; do
    # 解码记录
    DECODED=$(echo "$record" | base64 -d)
    RECORD_ID=$(echo "$DECODED" | jq -r '.[0]')
    
    # 获取 Persona名称（使用动态索引）
    PERSONA_NAME=$(echo "$DECODED" | jq -r ".[1][$PERSONA_NAME_INDEX]")
    
    # 获取备注
    REASON="${REASONS[$PERSONA_NAME]}"
    
    if [ -z "$REASON" ]; then
        echo "⚠️  跳过: $PERSONA_NAME (未找到原因)"
        continue
    fi
    
    echo "📝 更新: $PERSONA_NAME"
    
    # 构建 JSON 数据（直接使用字段名作为 key）
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
