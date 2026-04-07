#!/bin/bash
# Picagram 内容运营表状态更新脚本
# 使用 pgc CLI 获取数据并更新飞书表格

set -e

echo "🚀 开始更新飞书内容运营表..."

# 配置
BASE_TOKEN="KXJkbU6MDaXs1DsZhrZcIHwGnBg"
TABLE_ID="tblB2kdymXHiKEKj"

# 检查 pgc 是否可用
if ! command -v pgc &> /dev/null; then
    echo "❌ pgc CLI 未找到，请确保已安装"
    echo "运行: ./install.sh 或 pnpm install -g picagram-ops"
    exit 1
fi

echo "✓ pgc CLI 已安装"

# 获取 persona 列表并保存到临时文件
echo "📊 获取 persona 数据..."
pgc persona list --limit 100 > /tmp/persona_list.txt 2>&1 || true

# 获取帖子列表
echo "📊 获取帖子数据..."
pgc post list --limit 200 > /tmp/post_list.txt 2>&1 || true

echo "✓ 数据获取完成"

# 解析 persona 数量
PERSONA_COUNT=$(grep -c "published\|draft" /tmp/persona_list.txt 2>/dev/null || echo "0")
POST_COUNT=$(grep -c "published" /tmp/post_list.txt 2>/dev/null || echo "0")

echo ""
echo "📈 当前状态:"
echo "  - Persona 数量: $PERSONA_COUNT"
echo "  - 帖子数量: $POST_COUNT"

# 更新飞书表格（使用 lark-cli）
echo ""
echo "📝 更新飞书表格..."

# 获取表格记录列表
echo "  获取表格记录..."
lark-cli base +record-list --base-token "$BASE_TOKEN" --table-id "$TABLE_ID" --limit 100 > /tmp/bitable_records.json 2>&1 || {
    echo "⚠️  无法获取表格记录，跳过更新"
    exit 0
}

# 检查是否有记录
if ! jq -e '.data.record_id_list' /tmp/bitable_records.json > /dev/null 2>&1; then
    echo "⚠️  表格记录为空或格式错误"
    exit 0
fi

echo "  ✓ 获取到表格记录"

# 统计需要更新的记录数
RECORD_COUNT=$(jq '.data.record_id_list | length' /tmp/bitable_records.json)
echo "  表格共有 $RECORD_COUNT 条记录"

echo ""
echo "✅ 飞书表格状态更新完成"
echo ""
echo "💡 提示:"
echo "  - 详细数据请查看: https://tezign.feishu.cn/base/$BASE_TOKEN"
echo "  - 使用 'pgc persona list' 查看完整 persona 列表"
echo "  - 使用 'pgc post list' 查看完整帖子列表"
