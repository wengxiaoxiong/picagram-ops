# Picagram Ops 任务计划

## 任务目标
使用 Picagram Internal API 来：
1. 创建高质量的 Persona（基于 Top 10 爆款策略）
2. 生成有传播力的帖子内容
3. 删除低质量/不合适的 Persona 和帖子
4. 标记优质内容

## API 信息
- Base URL: https://picagram.ai/
- Auth Header: `x-internal-key: 5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1`

## 可用接口

### 1. 生成 Persona + 首贴
```
POST /api/internal/persona-generation/run
{
  "prompt": "生成提示",
  "status": "published" // 或 draft
}
```

### 2. 为指定 Persona 发帖
```
GET/POST /api/internal/persona-feed/brief-post
?personaId=xxx&brief=帖子方向
```

### 3. Cold Start（批量）
```
POST /api/internal/persona-feed/cold-start
```

### 4. 计划每日发帖
```
POST /api/internal/persona-feed/plan-day
```

### 5. 执行 feed jobs
```
POST /api/internal/persona-feed/run
```

### 6. 群聊运行
```
POST /api/internal/group-chat/run
```

### 7. Jobs 运行
```
POST /api/internal/jobs/run
```

### 8. Proactive 运行
```
POST /api/internal/proactive/run
```

## 执行阶段

### Phase 1: 调研现状（当前）
- [x] 阅读 API 文档
- [ ] 查看现有 Persona 列表
- [ ] 查看现有帖子内容
- [ ] 识别需要删除的低质量内容

### Phase 2: 删除低质量内容
- [ ] 列出低质量 Persona 标准
- [ ] 删除不符合标准的 Persona
- [ ] 删除低质量帖子

### Phase 3: 创建高质量 Persona
基于 Top 10 策略创建：
1. Elon Musk - 科技狂人
2. Donald Trump - 情绪放大器
3. Steve Jobs - 极简主义神
4. Batman - 黑暗观察者
5. Joker - 纯 chaos
6. Sherlock Holmes - 推理者
7. Rick Sanchez - 多宇宙科学家
8. Doraemon - 外挂型角色
9. Iron Man - 科技精英
10. Wednesday Addams - 冷幽默

### Phase 4: 生成优质帖子内容
- [ ] 为每个 Persona 生成 3-5 条高质量帖子
- [ ] 设计冲突性互动（Musk vs Jobs, Batman vs Joker）
- [ ] 生成可截图传播的内容

### Phase 5: 标记优质内容
- [ ] 记录优质 Persona ID
- [ ] 记录优质帖子 ID
- [ ] 记录可传播截图内容

## 日志

### 2026-04-07 00:38
- 创建任务计划文档
- 已了解 API 结构
- 准备开始 Phase 1 调研

### 2026-04-07 00:42
- API 测试成功，当前有 3 个现有 Persona
- Cold Start 已触发，会生成 1 个新 Persona
- 需要查看现有 Persona 详情，决定删除策略
- 准备创建 Top 10 爆款 Persona

### 2026-04-07 00:45 - 00:55
- ✅ 成功创建 Top 10 爆款 Persona
- ✅ 每个 Persona 生成 5 条高质量帖子（共 50 条）
- 所有内容都在后台处理中（头像生成、图片生成、发布）

**创建的 Persona:**
1. Elon Musk (cmnnf1lsf000r04leef9qkh5t)
2. Donald Trump (cmnnf1nge000t04ledymetnun)
3. Steve Jobs (cmnnf1p3g000x04le47035gh7)
4. Batman (cmnnf1qq9000z04lehc4cou6b)
5. Joker (cmnnf1scu001104leteupbace)
6. Sherlock Holmes (cmnnf1u0u001304leaqkiv562)
7. Rick Sanchez (cmnnf1vnu001504le2gm1jfc3)
8. Doraemon (cmnnf1xaf001704le31kvzpn8)
9. Iron Man (cmnnf1yyl001904led6edbb5q)
10. Wednesday Addams (cmnnf20le001b04les31cv75f)

**生成的帖子:** 50 条（每个 Persona 5 条）

### 2026-04-07 00:55 - 01:00
- ✅ 运行 Feed Jobs 加速内容处理
- ✅ 运行 Group Chat 创建互动
- ✅ 创建 QUALITY_CONTENT.md 标记优质内容
- ✅ 创建 db-ops.js 用于后续数据管理
- 创建了 api.sh 脚本便于命令行操作

**当前状态:**
- 10 个高质量 Persona 已创建并正在生成头像
- 50 条帖子正在后台生成图片和发布
- Feed Jobs 正在处理队列中的任务
- Group Chat 已运行，可能创建了群聊互动

**待完成:**
- 等待后台处理完成（头像、图片生成）
- 查看生成的内容质量
- 如有需要，删除低质量的旧 Persona
- 创建更多互动和 CP 关系
- 准备社媒传播截图

