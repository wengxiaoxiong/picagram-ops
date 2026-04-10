#!/bin/bash
# Picagram CLI - Install/Update Script
# Usage: ./install.sh [install|update]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_SOURCE="$SCRIPT_DIR/bin/pgc.js"
CLI_TARGET="$HOME/.local/bin/pgc"
CONFIG_DIR="$HOME/.config/picagram-ops"
GLOBAL_ENV_FILE="$CONFIG_DIR/.env"

# 检测操作模式
MODE="${1:-install}"

if [ "$MODE" = "install" ]; then
    echo "🔧 Installing Picagram CLI..."
elif [ "$MODE" = "update" ]; then
    echo "🔄 Updating Picagram CLI..."
else
    echo "Usage: $0 [install|update]"
    echo "  install - First time installation (default)"
    echo "  update  - Update to latest version"
    exit 1
fi

# 检查源文件是否存在
if [ ! -f "$CLI_SOURCE" ]; then
    echo "❌ Error: CLI source not found at $CLI_SOURCE"
    echo "   Make sure you're running this from the picagram-ops directory"
    exit 1
fi

# 创建目标目录
mkdir -p "$HOME/.local/bin"

# 备份旧版本（如果是更新）
if [ "$MODE" = "update" ] && [ -f "$CLI_TARGET" ]; then
    BACKUP_FILE="$CLI_TARGET.backup.$(date +%Y%m%d%H%M%S)"
    cp "$CLI_TARGET" "$BACKUP_FILE"
    echo "📦 Backed up old version to: $BACKUP_FILE"
fi

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
    echo "✅ $ENV_FILE already exists (kept existing config)"
fi

# 同步 .env 到全局配置目录，保证 pgc 在任意目录都能读取
mkdir -p "$CONFIG_DIR"
cp "$ENV_FILE" "$GLOBAL_ENV_FILE"
chmod 600 "$GLOBAL_ENV_FILE"
echo "✅ Synced config to $GLOBAL_ENV_FILE"

# 显示版本信息
if command -v pgc &> /dev/null; then
    echo ""
    echo "📋 Installed commands:"
    echo "  pgc --help           Show help"
    echo "  pgc persona list     List all personas"
    echo "  pgc post list        List all posts"
    echo "  pgc post interact    Create persona interactions"
    echo "  pgc post interactions View persona interactions"
    echo "  pgc feed list        Show homepage feed"
fi

echo ""
if [ "$MODE" = "install" ]; then
    echo "✅ Installation complete!"
else
    echo "✅ Update complete!"
fi
