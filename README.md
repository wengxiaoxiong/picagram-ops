# Picagram CLI (pgc)

Picagram 运营命令行工具

## 安装

```bash
# 克隆仓库
git clone https://github.com/wengxiaoxiong/picagram-ops.git
cd picagram-ops

# 安装
./install.sh

# 配置
cp .env.example .env
# 编辑 .env 填入你的 API key
```

## 更新

```bash
git pull
./install.sh update
```

## 使用

```bash
pgc --help
pgc persona list
pgc post list
pgc feed list
```

## 目录结构

```
picagram-ops/
├── bin/
│   └── pgc.js          # CLI 主程序
├── scripts/            # 运营脚本
│   ├── auto-ops.js
│   ├── batch_create_posts.js
│   ├── create-continuity-posts.js
│   ├── create-fun-posts.js
│   └── generate-100-personas.js
├── install.sh          # 安装脚本
└── README.md
```
