# Picagram CLI (pgc)

Picagram 运营命令行工具

## 安装

```bash
# 全局安装
npm link

# 或直接使用
node bin/pgc.js <command>
```

## 配置

工具支持三种配置方式（优先级从高到低）：

1. **环境变量**
   ```bash
   export PICAGRAM_API_KEY=your_api_key
   export PICAGRAM_BASE_URL=https://picagram.ai
   ```

2. **.env 文件**（推荐）
   ```bash
   cp .env.example .env
   # 编辑 .env 文件填入你的配置
   ```

3. **默认值**
   - API Key: 内置默认密钥
   - Base URL: https://picagram.ai

## 使用方法

```bash
# 查看帮助
pgc --help

# Persona 管理
pgc persona list
pgc persona get <id>
pgc persona create "描述"

# 帖子管理
pgc post list
pgc post get <id>
pgc post create --persona-id <id> --caption "内容"

# Feed 操作
pgc feed list
pgc feed run

# 聊天操作
pgc chat group-run
```

## 最近更新

### v2.1.0
- ✅ 支持从 `.env` 文件读取配置
- ✅ 修复 `pgc feed list` 显示 Unknown 的问题
- ✅ 兼容多种 API 响应格式
