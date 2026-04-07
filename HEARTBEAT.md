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

3. **更新飞书内容运营表**
   - 使用 `pgc` CLI 获取最新数据
   - 更新表格中的创建状态、帖子数量、头像状态等字段
   - 表格链接: https://tezign.feishu.cn/base/KXJkbU6MDaXs1DsZhrZcIHwGnBg?table=tblB2kdymXHiKEKj

4. **如果需要，执行自动运营**
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

# 更新飞书表格状态
~/picagram-ops/update-bitable-status.sh

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
2. 运行 `pgc persona list` 和 `pgc post list` 获取当前状态
3. 执行 `~/picagram-ops/update-bitable-status.sh` 更新飞书表格
4. 如果距离上次自动运营 > 12 小时，执行 `node ~/picagram-ops/auto-ops.js`
5. 向用户汇报当前状态
6. 如果有异常，报告具体问题

---

## 飞书表格更新流程

### 使用 pgc CLI 获取数据

```bash
# 获取 persona 列表（JSON 格式）
pgc persona list --limit 100

# 获取帖子列表
pgc post list --limit 200
```

### 更新表格字段

- **创建状态**: 根据 persona 是否存在更新为「已创建」或「待创建」
- **头像状态**: 检查 avatarAssetId 是否存在
- **帖子数量**: 统计该 persona 的帖子数
- **备注**: 添加爆火原因分析

### 表格信息

- **Base Token**: `KXJkbU6MDaXs1DsZhrZcIHwGnBg`
- **Table ID**: `tblB2kdymXHiKEKj`
- **View ID**: `vewwT9Jurh`
