#!/bin/bash
# Picagram Operations Toolkit - Setup Script
# 一键设置 pgc CLI 工具

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_SOURCE="$SCRIPT_DIR/bin/pgc.js"
CLI_TARGET="$HOME/.local/bin/pgc"

echo "🔧 Setting up Picagram CLI..."

# 创建目标目录
mkdir -p "$HOME/.local/bin"

# 复制 CLI 文件
cp "$CLI_SOURCE" "$CLI_TARGET"
chmod +x "$CLI_TARGET"

# 检查 PATH
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo ""
    echo "⚠️  Warning: ~/.local/bin is not in your PATH"
    echo "   Add this to your ~/.bashrc or ~/.zshrc:"
    echo '   export PATH="$HOME/.local/bin:$PATH"'
    echo ""
fi

# 创建 .env 文件（如果不存在）
ENV_FILE="$SCRIPT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" << 'EOF'
# Picagram CLI Configuration
PICAGRAM_API_KEY=your_api_key_here
PICAGRAM_BASE_URL=https://picagram.ai
EOF
    echo "✅ Created $ENV_FILE"
    echo "   Please edit it with your actual API key"
else
    echo "✅ $ENV_FILE already exists"
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Usage:"
echo "  pgc --help           Show help"
echo "  pgc persona list     List all personas"
echo "  pgc post list        List all posts"
echo "  pgc feed list        Show homepage feed"
echo ""
