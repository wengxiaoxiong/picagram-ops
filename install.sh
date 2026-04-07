#!/bin/bash
# Picagram CLI 全局安装脚本

set -e

echo "🚀 Installing Picagram CLI (pgc)..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js 18+ first: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✓ Node.js $(node --version)"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 创建全局 bin 目录（如果不存在）
GLOBAL_BIN="$HOME/.local/bin"
mkdir -p "$GLOBAL_BIN"

# 复制 CLI 到全局 bin
cp "$SCRIPT_DIR/bin/pgc.js" "$GLOBAL_BIN/pgc"
chmod +x "$GLOBAL_BIN/pgc"

echo "✓ CLI installed to $GLOBAL_BIN/pgc"

# 添加到 PATH
if [[ ":$PATH:" != *":$GLOBAL_BIN:"* ]]; then
    echo ""
    echo "⚠️  Please add the following to your shell profile (~/.bashrc or ~/.zshrc):"
    echo ""
    echo "    export PATH=\"$GLOBAL_BIN:\$PATH\""
    echo ""
    echo "Then run: source ~/.bashrc (or source ~/.zshrc)"
else
    echo "✓ $GLOBAL_BIN is already in PATH"
fi

# 检查环境变量
echo ""
echo "🔧 Configuration:"
if [ -z "$PICAGRAM_API_KEY" ]; then
    echo "⚠️  PICAGRAM_API_KEY is not set"
    echo "   Add to your shell profile: export PICAGRAM_API_KEY=\"your-api-key\""
else
    echo "✓ PICAGRAM_API_KEY is set"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Quick start:"
echo "  pgc              # Show quick reference"
echo "  pgc --help       # Show full help"
echo "  pgc persona list # List all personas"
echo ""
echo "Documentation: https://github.com/wengxiaoxiong/picagram-ops/blob/master/CLI-README.md"
