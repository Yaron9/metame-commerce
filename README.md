# MetaMe Commerce

MetaMe 桌面应用的商业化项目，包括账户系统、订阅管理和支付集成。

## 项目结构

```
metame-commerce/
├── website/                  # Next.js 前端网站
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React 组件
│   │   ├── lib/             # 工具函数
│   │   └── types/           # TypeScript 类型
│   ├── public/              # 静态资源
│   ├── package.json
│   └── tsconfig.json
│
├── api/                     # Express 后端 API
│   ├── src/
│   │   ├── index.ts         # 服务器入口
│   │   ├── routes/
│   │   │   ├── auth.ts      # 飞书 OAuth
│   │   │   ├── bind.ts      # 绑定码验证
│   │   │   ├── subscription.ts  # 订阅查询
│   │   │   └── webhooks.ts  # Stripe + Feishu webhooks
│   │   ├── models/          # 数据库模型
│   │   ├── middleware/      # 中间件
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── tsconfig.json
│
├── database/                # 数据库
│   ├── schema.sql          # 表结构定义
│   ├── init.sql            # 初始化脚本
│   └── migrations/         # 迁移脚本（待添加）
│
└── README.md               # 本文件
```

## 快速开始

### 前置要求

- Node.js 20+
- PostgreSQL 或 SQLite
- Stripe 账户（收费功能）
- Feishu Bot 已部署

### 安装依赖

```bash
# 网站
cd website && npm install

# API
cd ../api && npm install
```

### 数据库初始化

```bash
# PostgreSQL
createdb metame-commerce
psql metame-commerce < database/schema.sql

# SQLite
sqlite3 metame-commerce.db < database/schema.sql
```

### 环境配置

创建 `.env` 文件（在 `api/` 目录）：

```env
# Server
PORT=3001
NODE_ENV=development

# Feishu
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=postgresql://user:password@localhost/metame-commerce
# 或 SQLite: DATABASE_URL=sqlite:./metame-commerce.db

# NextJS
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 启动开发服务器

```bash
# 终端 1: 网站
cd website
npm run dev
# 访问 http://localhost:3000

# 终端 2: API
cd api
npm run dev
# 访问 http://localhost:3001
```

## 数据库表说明

### accounts（账户表）
- `id`: UUID，账户唯一ID
- `feishu_user_id`: 飞书 User ID（唯一）
- `subscription_status`: 订阅状态（trial/active/expired）
- `subscription_plan`: 套餐（free/pro/team）
- `device_token`: Daemon 的设备令牌

### bind_codes（绑定码表）
- `code`: 6位随机绑定码
- `account_id`: 关联账户
- `expires_at`: 过期时间（通常 10 分钟）
- `status`: 状态（pending/confirmed/expired）

### subscriptions（订阅历史表）
- `id`: UUID
- `account_id`: 关联账户
- `stripe_subscription_id`: Stripe 订阅ID
- `plan`: 套餐
- `status`: 状态
- `expires_at`: 过期时间

### webhook_logs（webhook 日志表）
用于调试和审计

### feature_logs（功能使用日志表）
用于统计和分析

## API 文档

### 认证

#### 飞书 OAuth 回调
```
POST /api/auth/feishu
Body: { code: string, device_token?: string }
Response: { account_id, bind_code, subscription_status }
```

### 绑定

#### 验证绑定码
```
POST /api/bind/verify
Body: { feishu_user_id, bind_code, device_token }
Response: { success, account_id, subscription_status }
```

### 订阅

#### 检查订阅状态（Daemon 用）
```
GET /api/subscription/check/:feishu_user_id
Response: { subscription_status, plan, features_enabled }
```

#### 获取账户订阅信息（网站用）
```
GET /api/subscription/status/:account_id
Response: { subscription_status, plan, expires_at }
```

### Webhooks

#### Stripe Webhook
```
POST /api/webhooks/stripe
处理：subscription.created | updated | deleted
```

#### Feishu Webhook
```
POST /api/webhooks/feishu
处理：消息接收、事件回调
```

## 工作流

### 用户注册流程

1. 用户访问网站 → 点"Sign in with Feishu"
2. Feishu OAuth 回调 → 获得 `feishu_user_id`
3. API 创建 account，生成 `bind_code`（6位，10分钟有效）
4. 前端显示 bind_code，引导用户在飞书中绑定
5. 用户在飞书 Bot 中发送 `/bind <bind_code>`
6. Daemon 验证 bind_code → 激活账户

### 订阅流程

1. 用户在网站升级到 Pro 套餐
2. 前端重定向到 Stripe Checkout
3. 支付成功 → Stripe 发送 webhook
4. API 更新 subscriptions 表
5. Daemon 定期检查 `/api/subscription/check`
6. 如果订阅已激活，启用高级功能

## 开发备注

### TODO 列表

- [ ] 连接真实数据库（PostgreSQL）
- [ ] 实现 Feishu OAuth（当前为占位符）
- [ ] 实现 Stripe 集成（当前为占位符）
- [ ] 实现飞书 Bot 命令处理
- [ ] 网站前端界面（登录、管理、续费）
- [ ] Daemon 的订阅检查集成
- [ ] 单元测试
- [ ] API 文档（OpenAPI/Swagger）
- [ ] Docker 部署配置

### 注意事项

1. **独立项目**: metame-commerce 完全独立于 metame-desktop，不影响上游同步
2. **最小改动**: metame-desktop 中对 Daemon 的改动应该非常小（< 50 行）
3. **API 优先**: 所有商业化逻辑都通过 HTTP API，不修改核心代码
4. **幂等性**: 所有 API 端点应该支持重试

## 相关项目

- `metame-desktop`: 桌面应用（Daemon + Tauri）
- `opencode`: 上游开源项目

## 联系方式

- 文档: 见 `/Users/yaron/AGI/metame-desktop/CLAUDE.md`
- 服务器: 101.200.96.18:3100 (HTTP) / 3101 (WebSocket)
