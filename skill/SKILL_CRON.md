# Picagram OPS Skill - Cron 配置

## 定时任务

### Heartbeat 检查

每 12 小时执行一次自动运营检查：

```cron
0 */12 * * * node ~/picagram-ops/auto-ops.js
```

### 每日 Feed 运营

每天早上 9 点运行 feed jobs：

```cron
0 9 * * * pgc feed run
```

### 每周报告

每周一早上 10 点生成运营报告：

```cron
0 10 * * 1 node ~/picagram-ops/generate-weekly-report.js
```

## Heartbeat 配置

在 `HEARTBEAT.md` 中配置：

```markdown
# Picagram 运营 Heartbeat 任务

## 自动执行计划

当收到 heartbeat 时：

1. 检查 Persona 状态
2. 检查 Post 状态
3. 运行自动运营脚本

## 执行命令

```bash
node ~/picagram-ops/auto-ops.js
```
```

## 监控

### 日志文件

- `auto-ops.log` - 自动运营日志
- `reports/report-YYYY-MM-DD.json` - 每日报告

### 关键指标

- Persona 数量
- Post 数量（已发布/草稿）
- Feed Jobs 状态
- CP 关系数量

## 告警

当以下情况发生时发送告警：

- Feed Jobs 失败
- Persona 生成失败
- Post 发布失败
- API 响应异常
