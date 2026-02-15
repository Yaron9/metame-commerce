# MetaMe Commerce - 快速开始

## 📁 项目结构一览

```
metame-commerce/
├── website/                      # Next.js 网站（用户登录、管理、续费）
│   ├── src/app/
│   │   ├── page.tsx             # 首页
│   │   ├── layout.tsx           # 布局
│   │   └── globals.css          # 全局样式
│   ├── package.json
│   └── tsconfig.json
│
├── api/                         # Express API（账户、支付、绑定）
│   ├── src/
│   │   ├── index.ts            # 服务器入口
│   │   ├── routes/
│   │   │   ├── auth.ts         # 飞书 OAuth → 账户创建
│   │   │   ├── bind.ts         # 验证绑定码 (Daemon 调用)
│   │   │   ├── subscription.ts # 查询订阅 (Daemon + 网站调用)
│   │   │   └── webhooks.ts     # Stripe + Feishu webhooks
│   │   └── utils/bind-code.ts  # 生成 6位绑定码
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example            # 环境变量示例
│
├── database/                    # 数据库
│   ├── schema.sql              # 表结构（5张表）
│   └── init.sql                # 初始化脚本
│
├── README.md                   # 完整文档
├── DAEMON_INTEGRATION.md       # Daemon 集成指南
├── QUICKSTART.md               # 本文件
└── .gitignore
```

## 🚀 快速开始（5分钟）

### 第 1 步：安装依赖

```bash
# 网站
cd ~/AGI/metame-commerce/website
npm install

# API
cd ~/AGI/metame-commerce/api
npm install
```

### 第 2 步：初始化数据库

选择一个：

**A. 使用 SQLite（最简单，推荐开发）**

```bash
sqlite3 ~/AGI/metame-commerce/metame-commerce.db < ~/AGI/metame-commerce/database/schema.sql
```

**B. 使用 PostgreSQL**

```bash
createdb metame-commerce
psql metame-commerce < ~/AGI/metame-commerce/database/schema.sql
```

### 第 3 步：配置环境变量

```bash
cd ~/AGI/metame-commerce/api
cp .env.example .env
```

编辑 `.env`，最少需要：

```env
PORT=3001
NODE_ENV=development
FEISHU_APP_ID=cli_a902d5b1e578dbb3
FEISHU_APP_SECRET=your_secret
STRIPE_SECRET_KEY=sk_test_xxx
DATABASE_URL=sqlite:~/AGI/metame-commerce/metame-commerce.db
```

### 第 4 步：启动服务（两个终端）

**终端 1：API 服务**

```bash
cd ~/AGI/metame-commerce/api
npm run dev
# 输出: 🚀 MetaMe API running on port 3001
```

**终端 2：网站**

```bash
cd ~/AGI/metame-commerce/website
npm run dev
# 输出: ▲ Next.js started on http://localhost:3000
```

### 第 5 步：测试

访问 http://localhost:3000，你应该看到：
- ✅ 首页（MetaMe Desktop 介绍）
- ✅ "Sign in with Feishu" 按钮
- ✅ 功能列表

## 🔌 API 端点快速参考

| 用途 | 方法 | 端点 | 谁调用 |
|------|------|------|--------|
| 飞书登录 | POST | `/api/auth/feishu` | 网站 |
| 验证绑定码 | POST | `/api/bind/verify` | Daemon |
| 检查订阅 | GET | `/api/subscription/check/:id` | Daemon |
| 获取状态 | GET | `/api/subscription/status/:id` | 网站 |
| Stripe webhook | POST | `/api/webhooks/stripe` | Stripe |
| Feishu webhook | POST | `/api/webhooks/feishu` | Feishu |
| 健康检查 | GET | `/health` | 监控 |

## 📝 核心概念

### 三个核心对象

**1. 账户 (Account)**
```
{
  id: "acc_uuid",
  feishu_user_id: "ou_xxx",
  subscription_status: "trial" | "active" | "expired",
  subscription_plan: "free" | "pro" | "team",
  device_token: "device_xxx"
}
```

**2. 绑定码 (Bind Code)**
- 6位随机码：`A1B2C3`
- 有效期：10分钟
- 用途：链接账户和 Daemon

**3. 订阅 (Subscription)**
- 跟踪支付历史
- 连接到 Stripe customer
- 记录过期时间

### 用户流程

```
用户在网站登录
  ↓ (Feishu OAuth)
创建账户 + 生成绑定码
  ↓
前端显示绑定码（6位）
  ↓
用户在飞书 Bot 发 /bind <bind_code>
  ↓ (Daemon 调用 /api/bind/verify)
账户激活，绑定到设备
  ↓
用户升级订阅
  ↓ (Stripe Checkout)
Daemon 定期检查 /api/subscription/check
  ↓
高级功能解锁
```

## 🔧 常见任务

### 查看数据库内容

```bash
# SQLite
sqlite3 ~/AGI/metame-commerce/metame-commerce.db
> SELECT * FROM accounts;
> .quit

# PostgreSQL
psql metame-commerce
metame-commerce=# SELECT * FROM accounts;
metame-commerce=# \q
```

### 测试 API

```bash
# 测试健康状态
curl http://localhost:3001/health

# 测试绑定码验证（需要真实 account_id）
curl -X POST http://localhost:3001/api/bind/verify \
  -H "Content-Type: application/json" \
  -d '{
    "feishu_user_id": "ou_test",
    "bind_code": "A1B2C3",
    "device_token": "device_test"
  }'

# 查看 API 日志
tail -f ~/.metame/api.log
```

### 清空测试数据

```bash
# SQLite
rm ~/AGI/metame-commerce/metame-commerce.db
sqlite3 ~/AGI/metame-commerce/metame-commerce.db < database/schema.sql

# PostgreSQL
dropdb metame-commerce
createdb metame-commerce
psql metame-commerce < database/schema.sql
```

## 🚨 常见问题

### Q: API 启动失败 "Cannot find module"

**A:** 运行 `npm install`

```bash
cd ~/AGI/metame-commerce/api && npm install
```

### Q: 数据库连接失败

**A:** 检查 `.env` 中的 `DATABASE_URL`

```bash
# SQLite - 确保路径正确
DATABASE_URL=sqlite:~/AGI/metame-commerce/metame-commerce.db

# PostgreSQL - 确保数据库存在
psql metame-commerce -c "SELECT 1"
```

### Q: 网站无法连接 API

**A:** 确保两个服务都在运行，检查 CORS 配置

```bash
# 检查 API 是否运行
curl http://localhost:3001/health

# 检查网站是否在 3000
curl http://localhost:3000
```

## 📚 下一步

1. **实现飞书 OAuth** → 修改 `api/src/routes/auth.ts`
2. **集成 Stripe** → 修改 `api/src/routes/webhooks.ts`
3. **集成 Daemon** → 按 `DAEMON_INTEGRATION.md` 修改 metame-desktop
4. **部署** → Docker + 云服务器

## 📖 详细文档

- 📘 [完整 API 文档](./README.md)
- 📗 [Daemon 集成指南](./DAEMON_INTEGRATION.md)
- 📙 [数据库 Schema](./database/schema.sql)
- 📕 [环境配置](./api/.env.example)

## 🎯 当前状态

- ✅ 项目结构完整
- ✅ API 框架完成（占位符）
- ✅ 数据库 Schema 完成
- ✅ 网站骨架完成
- ⏳ TODO: 飞书 OAuth 实现
- ⏳ TODO: Stripe 集成
- ⏳ TODO: 网站前端界面
- ⏳ TODO: Daemon 集成

## 🤝 需要帮助？

检查日志：
```bash
# API
tail -f ~/AGI/metame-commerce/api.log

# 网站
tail -f ~/AGI/metame-commerce/website.log
```

问我：
```bash
# 生成架构图
# 帮我实现飞书 OAuth
# 帮我连接真实数据库
```

---

**准备好了吗？** 运行 `npm install` 开始！🚀
