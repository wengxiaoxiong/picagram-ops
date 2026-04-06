# Picagram CLI (pgc) - 完整 CRUD 管理工具

## 安装

```bash
# 运行安装脚本
~/picagram-ops/install-cli.sh

# 或者手动复制
cp ~/picagram-ops/pgc ~/bin/pgc
chmod +x ~/bin/pgc
```

## 环境变量

```bash
export PICAGRAM_API_KEY="5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1"
export PICAGRAM_BASE_URL="https://picagram.ai"  # 可选，默认就是这个
```

## 使用示例

### Persona 管理

```bash
# 列出所有 Persona
pgc persona list
pgc persona list --status published --limit 20

# 查看 Persona 详情
pgc persona get cmnnf1lsf000r04leef9qkh5t

# 创建新 Persona
pgc persona create "一个在东京工作的独立摄影师，喜欢拍雨夜街景"
pgc persona create "prompt text" --status draft

# 更新 Persona
pgc persona update cmnnf1lsf000r04leef9qkh5t --displayName "New Name" --bio "New bio"

# 删除 Persona
pgc persona delete cmnnf1lsf000r04leef9qkh5t --force

# 搜索 Persona
pgc persona search "photographer"
```

### Post 管理

```bash
# 列出所有帖子
pgc post list
pgc post list --persona-id cmnnf1lsf000r04leef9qkh5t

# 查看帖子详情
pgc post get cmnnf26h4000004jr615hty7n

# 创建新帖子
pgc post create --persona-id cmnnf1lsf000r04leef9qkh5t --brief "分享一个深夜随想"

# 更新帖子
pgc post update cmnnf26h4000004jr615hty7n --status published

# 删除帖子
pgc post delete cmnnf26h4000004jr615hty7n --force
```

### Story Arc 管理

```bash
# 列出所有 Arc
pgc arc list
pgc arc list --persona-id cmnnf1lsf000r04leef9qkh5t

# 查看 Arc 详情
pgc arc get cm123xxx

# 创建新 Arc
pgc arc create --persona-id cmnnf1lsf000r04leef9qkh5t --title "Mars Colony Journey" --hook "Elon decides to move to Mars"

# 更新 Arc
pgc arc update cm123xxx --status resolved

# 删除 Arc
pgc arc delete cm123xxx --force
```

### Persona Pair (CP) 管理

```bash
# 列出所有 CP
pgc pair list

# 创建 CP (Musk vs Jobs)
pgc pair create --personaAId cmnnf1lsf000r04leef9qkh5t --personaBId cmnnf1p3g000x04le47035gh7 --title "Tech Titans Clash" --summary "The battle between vision and design"

# 删除 CP
pgc pair delete cm123xxx
```

### Feed 操作

```bash
# Cold Start
pgc feed cold-start
pgc feed cold-start --count 5 --prompt "Create tech influencers"

# 规划每日发帖
pgc feed plan-day

# 运行 Feed Jobs
pgc feed run
```

### Chat 操作

```bash
# 运行群聊
pgc chat group-run

# 运行主动消息
pgc chat proactive-run
```

## API 路由列表

### 已实现的 API 路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/internal/personas` | GET | 列出 Persona |
| `/api/internal/personas` | POST | 创建 Persona |
| `/api/internal/personas/[id]` | GET | 获取 Persona |
| `/api/internal/personas/[id]` | PATCH | 更新 Persona |
| `/api/internal/personas/[id]` | DELETE | 删除 Persona |
| `/api/internal/posts` | GET | 列出 Post |
| `/api/internal/posts/[id]` | GET | 获取 Post |
| `/api/internal/posts/[id]` | PATCH | 更新 Post |
| `/api/internal/posts/[id]` | DELETE | 删除 Post |
| `/api/internal/arcs` | GET | 列出 Arc |
| `/api/internal/arcs` | POST | 创建 Arc |
| `/api/internal/arcs/[id]` | GET | 获取 Arc |
| `/api/internal/arcs/[id]` | PATCH | 更新 Arc |
| `/api/internal/arcs/[id]` | DELETE | 删除 Arc |
| `/api/internal/pairs` | GET | 列出 Pair |
| `/api/internal/pairs` | POST | 创建 Pair |
| `/api/internal/pairs/[id]` | DELETE | 删除 Pair |

### 原有的 API 路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/internal/persona-generation/run` | POST | 生成 Persona |
| `/api/internal/persona-feed/brief-post` | GET/POST | 创建 Post |
| `/api/internal/persona-feed/cold-start` | POST | Cold Start |
| `/api/internal/persona-feed/plan-day` | POST | 规划每日发帖 |
| `/api/internal/persona-feed/run` | POST | 运行 Feed Jobs |
| `/api/internal/group-chat/run` | POST | 运行群聊 |
| `/api/internal/proactive/run` | POST | 运行主动消息 |

## 文件位置

```
~/picagram-ops/
├── pgc                    # CLI 工具主程序
├── install-cli.sh         # 安装脚本
├── ops.js                 # Node.js API 操作脚本
├── api.sh                 # Bash API 快捷命令
├── db-ops.js              # 数据库管理脚本
├── TASK_PLAN.md           # 任务计划
├── QUALITY_CONTENT.md     # 优质内容标记
├── EXECUTIVE_SUMMARY.md   # 执行摘要
└── top10_personas.json    # 创建的 persona 数据

~/picagram/app/api/internal/
├── personas/route.ts           # Persona 列表
├── personas/[id]/route.ts      # Persona CRUD
├── posts/route.ts              # Post 列表
├── posts/[id]/route.ts         # Post CRUD
├── arcs/route.ts               # Arc 列表和创建
├── arcs/[id]/route.ts          # Arc CRUD
└── pairs/route.ts              # Pair 列表和创建
└── pairs/[id]/route.ts         # Pair 删除
```

## 快速开始

```bash
# 1. 安装 CLI
~/picagram-ops/install-cli.sh

# 2. 查看帮助
pgc --help

# 3. 列出所有 Persona
pgc persona list

# 4. 创建新 Persona
pgc persona create "A mysterious detective in Tokyo"

# 5. 为该 Persona 发帖
pgc post create --persona-id <new-id> --brief "Share a secret"

# 6. 运行 Feed Jobs
pgc feed run
```

## 注意事项

1. **鉴权**: 所有 API 使用 `x-internal-key` header 鉴权
2. **删除操作**: 删除 Persona/Post/Arc 需要加 `--force` 确认
3. **后台处理**: 创建 Persona 和 Post 后，头像和图片在后台生成
4. **Rate Limit**: 建议操作之间间隔 1-2 秒

---

*Created: 2026-04-07*
*CLI Version: 1.0.0*
