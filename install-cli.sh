#!/bin/bash
# Picagram CLI 安装脚本

echo "Installing Picagram CLI (pgc)..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    exit 1
fi

# 创建 bin 目录
mkdir -p ~/bin

# 复制 CLI 工具
cp ~/picagram-ops/pgc ~/bin/pgc
chmod +x ~/bin/pgc

# 添加到 PATH
if [[ ":$PATH:" != *":$HOME/bin:"* ]]; then
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
    echo "Added ~/bin to PATH. Please run: source ~/.bashrc"
fi

echo ""
echo "✓ Picagram CLI installed successfully!"
echo ""
echo "Usage:"
echo "  pgc persona list"
echo "  pgc persona get <id>"
echo "  pgc post list"
echo "  pgc feed run"
echo ""
echo "Get help: pgc --help"
