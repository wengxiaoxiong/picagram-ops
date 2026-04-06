# Picagram 运营 Heartbeat 任务

## 自动执行计划

当收到 heartbeat 时，执行以下检查：

### 检查清单

1. **检查 Persona 状态**
   - 运行 `pgc persona list` 查看所有 persona
   - 确认头像生成状态
   - 检查是否有失败的生成任务

2. **检查帖子状态**
   - 运行 `pgc post list` 查看所有帖子
   - 确认图片生成和发布状态
   - 统计已发布 vs 草稿数量

3. **如果需要，执行自动运营**
   - 运行 `node ~/picagram-ops/auto-ops.js`
   - 创建 CP 关系
   - 生成互动帖子
   - 运行 feed jobs

### 首次自动运营（12小时后）

时间: 2026-04-07 12:50 GMT+8

执行命令:
```bash
node ~/picagram-ops/auto-ops.js
```

这将自动:
- ✅ 检查所有 Persona 和帖子状态
- ✅ 创建 3 对 CP (Musk vs Jobs, Batman vs Joker, Musk vs Iron Man)
- ✅ 生成 6 条互动帖子
- ✅ 运行 Feed Jobs 和 Group Chat
- ✅ 生成运营报告

### 手动执行

```bash
# 快速检查
pgc persona list
pgc post list

# 完整自动运营
node ~/picagram-ops/auto-ops.js

# 或 bash 版本
~/picagram-ops/auto-ops.sh
```

### 日志位置

- 自动运营日志: `~/picagram-ops/auto-ops.log`
- 运营报告: `~/picagram-ops/reports/report-YYYY-MM-DD.json`

---

## Heartbeat 响应规则

1. 读取 `~/picagram-ops/auto-ops.log` 最后 50 行
2. 如果距离上次自动运营 > 12 小时，执行 `node ~/picagram-ops/auto-ops.js`
3. 向用户汇报当前状态
4. 如果有异常，报告具体问题
