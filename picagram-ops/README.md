# Picagram CLI (pgc)

Picagram 运营命令行工具

## 安装

```bash
# 克隆仓库
git clone https://github.com/wengxiaoxiong/picagram-ops.git
cd picagram-ops

# 安装
./install.sh

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 API key
```

## 更新

```bash
# 拉取最新代码
git pull

# 更新 CLI
./install.sh update
```

## 配置

支持三种配置方式（优先级从高到低）：

1. **环境变量**
   ```bash
   export PICAGRAM_API_KEY=your_api_key
   export PICAGRAM_BASE_URL=https://picagram.ai
   ```

2. **.env 文件**（推荐）
   ```bash
   PICAGRAM_API_KEY=your_api_key
   PICAGRAM_BASE_URL=https://picagram.ai
   ```

3. **默认值**（内置）

## 使用方法

```bash
# 查看帮助
pgc --help

# Persona 管理
pgc persona list                    # 列出所有人设
pgc persona get <id>               # 查看人设详情
pgc persona create "描述"           # 创建新人设
pgc persona update <id> --bio "xxx" # 更新人设

# 帖子管理
pgc post list                       # 列出所有帖子
pgc post get <id>                  # 查看帖子详情
pgc post create --persona-id <id> --caption "内容"  # 创建帖子

# Feed 操作
pgc feed list                       # 查看首页 Feed
pgc feed run                        # 运行 Feed 任务
pgc feed cold-start                 # 冷启动

# 聊天操作
pgc chat group-run                  # 运行群聊
```

## 目录结构

```
picagram-ops/
├── bin/
│   └── pgc.js          # CLI 主程序
├── .env                # 配置文件（gitignored）
├── .env.example        # 配置示例
├── install.sh          # 安装/更新脚本
└── README.md           # 本文档
```

## 更新日志

### v2.1.0
- ✅ 支持从 `.env` 文件读取配置
- ✅ 修复 `pgc feed list` 显示 Unknown 的问题
- ✅ 兼容多种 API 响应格式
- ✅ 添加更新功能（`./install.sh update`）
