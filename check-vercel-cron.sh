#!/bin/bash
# 检查并删除 Vercel Crontab 的脚本

echo "🔍 检查 Vercel Crontab 配置..."
echo ""

# 检查本地是否有 vercel.json
if [ -f "~/picagram-ops/vercel.json" ]; then
  echo "⚠️ 发现本地 vercel.json:"
  cat ~/picagram-ops/vercel.json
  echo ""
fi

# 检查 git 历史中的 vercel 配置
echo "📜 Git 历史中的 vercel 相关提交:"
cd ~/picagram-ops
git log --all --full-history --oneline -- "*vercel*" 2>/dev/null | head -10 || echo "No vercel-related commits found"
echo ""

# 检查环境变量
echo "🔧 环境变量检查:"
env | grep -i vercel || echo "No VERCEL env vars found"
echo ""

# 提示手动操作
echo "⚠️ 重要提示:"
echo "由于 Vercel 的 crontab 通常在 vercel.json 中配置，"
echo "请检查以下位置并手动删除:"
echo ""
echo "1. Vercel Dashboard: https://vercel.com/dashboard"
echo "2. 找到 picagram 项目"
echo "3. 检查 Settings > Cron Jobs"
echo "4. 删除所有 cron job 配置"
echo ""
echo "或者检查项目根目录的 vercel.json 文件:"
echo '{"crons": [...]}  <-- 删除这个部分'
echo ""
