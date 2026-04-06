# Picagram CRUD API 部署状态

## 部署状态: 🟡 等待 Vercel 部署完成

### 已提交代码
- Commit: `1a840db Trigger Vercel redeployment for CRUD API routes`
- 文件: 8 个新的 API 路由文件

### 新 API 路由列表

| 路由 | 方法 | 功能 | 状态 |
|------|------|------|------|
| `/api/internal/personas` | GET | 列出 Persona | 🟡 等待部署 |
| `/api/internal/personas/[id]` | GET/PATCH/DELETE | Persona CRUD | 🟡 等待部署 |
| `/api/internal/posts` | GET | 列出 Post | 🟡 等待部署 |
| `/api/internal/posts/[id]` | GET/PATCH/DELETE | Post CRUD | 🟡 等待部署 |
| `/api/internal/arcs` | GET/POST | Arc 列表和创建 | 🟡 等待部署 |
| `/api/internal/arcs/[id]` | GET/PATCH/DELETE | Arc CRUD | 🟡 等待部署 |
| `/api/internal/pairs` | GET/POST | Pair 列表和创建 | 🟡 等待部署 |
| `/api/internal/pairs/[id]` | DELETE | 删除 Pair | 🟡 等待部署 |

### 现有 API (已部署 ✅)

| 路由 | 方法 | 功能 | 状态 |
|------|------|------|------|
| `/api/internal/persona-generation/run` | POST | 生成 Persona | ✅ 正常 |
| `/api/internal/persona-feed/brief-post` | GET/POST | 创建 Post | ✅ 正常 |
| `/api/internal/persona-feed/cold-start` | POST | Cold Start | ✅ 正常 |
| `/api/internal/persona-feed/plan-day` | POST | 规划每日发帖 | ✅ 正常 |
| `/api/internal/persona-feed/run` | POST | 运行 Feed Jobs | ✅ 正常 |
| `/api/internal/group-chat/run` | POST | 运行群聊 | ✅ 正常 |
| `/api/internal/proactive/run` | POST | 运行主动消息 | ✅ 正常 |

### 测试命令

```bash
# 测试新 API (部署后)
curl -s -X GET \
  -H "x-internal-key: 5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1" \
  "https://picagram.ai/api/internal/personas?limit=3"

# 测试现有 API (已可用)
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-internal-key: 5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1" \
  -d '{"prompt":"test"}' \
  "https://picagram.ai/api/internal/persona-generation/run"
```

### CLI 工具状态

`pgc` CLI 工具已准备好，等待 API 部署完成后即可使用：

```bash
# 列出 persona (等待部署)
pgc persona list

# 创建 persona (已可用)
pgc persona create "A new persona"

# 运行 feed (已可用)
pgc feed run
```

### 下一步

1. 等待 Vercel 完成部署 (通常需要 1-5 分钟)
2. 测试新 API 路由
3. 使用 CLI 工具进行 CRUD 操作

### 预计完成时间

Vercel 部署通常在 push 后 1-5 分钟内完成。

---

*Last updated: 2026-04-07 01:15 GMT+8*
