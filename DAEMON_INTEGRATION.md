# Daemon 与商业化 API 的集成指南

本文档说明如何在 metame-desktop 的 Daemon 中集成 metame-commerce API。

## 集成点

### 1. 启动时：验证账户绑定

**Daemon 启动时，检查是否已绑定账户。**

**文件**: `packages/opencode/src/metame/daemon/config.ts`

```typescript
import { fetch } from 'bun';

interface BoundAccount {
  account_id: string;
  feishu_user_id: string;
  subscription_status: 'trial' | 'active' | 'expired';
  subscription_plan: 'free' | 'pro' | 'team';
}

// 从配置读取已保存的绑定信息
export async function loadBoundAccount(): Promise<BoundAccount | null> {
  const config = await readConfig();

  if (!config.account_id) {
    logger.info('No account bound. User needs to bind first.');
    return null;
  }

  // 验证绑定是否仍然有效
  try {
    const response = await fetch(
      `${process.env.COMMERCE_API_URL}/api/subscription/status/${config.account_id}`
    );
    const account = await response.json();
    return account;
  } catch (error) {
    logger.error('Failed to verify bound account:', error);
    return null;
  }
}
```

### 2. 首次绑定：验证绑定码

**用户在飞书 Bot 中发送 `/bind <bind_code>` 时调用。**

**文件**: `packages/opencode/src/metame/daemon/feishu.ts` 或 `index.ts`

```typescript
async function handleBindCommand(bindCode: string): Promise<void> {
  const commerceAPI = process.env.COMMERCE_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(`${commerceAPI}/api/bind/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feishu_user_id: currentUser.id,
        bind_code: bindCode,
        device_token: getDeviceToken() // 生成或读取设备令牌
      })
    });

    const result = await response.json();

    if (result.success) {
      // 保存账户信息到配置
      await saveConfig({
        account_id: result.account_id,
        feishu_user_id: currentUser.id,
        subscription_status: result.subscription_status,
        subscription_plan: result.subscription_plan
      });

      sendMessage(`✅ Binding successful! Account: ${result.account_id}`);
    } else {
      sendMessage(`❌ Binding failed: ${result.message}`);
    }
  } catch (error) {
    logger.error('Bind command failed:', error);
    sendMessage('⚠️ Error during binding. Please try again later.');
  }
}
```

### 3. 定期检查：订阅状态验证

**Daemon 启动后，每小时检查一次订阅状态。**

**文件**: `packages/opencode/src/metame/daemon/heartbeat.ts`

```typescript
export function setupSubscriptionCheck(): void {
  // 每小时检查一次
  setInterval(async () => {
    await checkSubscriptionStatus();
  }, 60 * 60 * 1000);
}

async function checkSubscriptionStatus(): Promise<void> {
  const config = await readConfig();

  if (!config.feishu_user_id) {
    logger.info('No bound account. Skipping subscription check.');
    return;
  }

  const commerceAPI = process.env.COMMERCE_API_URL || 'http://localhost:3001';

  try {
    const response = await fetch(
      `${commerceAPI}/api/subscription/check/${config.feishu_user_id}`
    );
    const subscription = await response.json();

    logger.info(`Subscription status: ${subscription.subscription_status}`);

    // 根据订阅状态控制功能
    config.subscription_status = subscription.subscription_status;
    config.subscription_plan = subscription.plan;
    config.features_enabled = subscription.features_enabled || [];

    await saveConfig(config);

    // 如果订阅已过期，可以选择禁用某些功能
    if (subscription.subscription_status === 'expired') {
      logger.warn('Subscription expired. Some features may be disabled.');
      notifyUser('Your subscription has expired. Please renew to continue.');
    }
  } catch (error) {
    logger.error('Subscription check failed:', error);
    // 继续运行，但标记为离线
  }
}
```

### 4. 功能控制：根据订阅级别限制功能

**在 Daemon 中检查功能是否可用。**

```typescript
function isFeatureEnabled(feature: string): boolean {
  const config = readConfigSync();

  // 不同套餐的功能列表
  const featuresByPlan = {
    free: ['daemon_basic', 'message_send'],
    pro: ['daemon_basic', 'message_send', 'file_upload', 'advanced_ai'],
    team: ['daemon_basic', 'message_send', 'file_upload', 'advanced_ai', 'team_management']
  };

  const enabledFeatures = featuresByPlan[config.subscription_plan || 'free'] || [];
  return enabledFeatures.includes(feature);
}

// 使用示例
if (!isFeatureEnabled('file_upload')) {
  return { error: 'File upload requires Pro plan' };
}
```

## 配置文件位置

**Daemon 配置文件**: `~/.metame/daemon-desktop.yaml`

添加以下字段来存储账户信息：

```yaml
# 商业化相关
account_id: "acc_xxx"
feishu_user_id: "ou_xxx"
subscription_status: "trial"  # trial | active | expired
subscription_plan: "free"     # free | pro | team
features_enabled:
  - daemon_basic
  - message_send

# API 配置
commerce_api_url: "http://localhost:3001"  # 或生产服务器地址
```

## 环境变量

在启动 Daemon 时设置：

```bash
export COMMERCE_API_URL="http://localhost:3001"
export FEISHU_USER_ID="ou_xxx"

bun run dev -- metame daemon --sub start
```

## 错误处理

所有 API 调用应该有适当的错误处理：

```typescript
try {
  const response = await fetch(...);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
} catch (error) {
  logger.error('API call failed:', error);
  // 降级处理：继续运行，但某些功能可能不可用
  return null;
}
```

## 开发流程

### 本地开发

1. 启动 metame-commerce API
```bash
cd ~/AGI/metame-commerce/api
npm run dev
```

2. 设置 Daemon 连接到本地 API
```bash
export COMMERCE_API_URL="http://localhost:3001"
```

3. 启动 Daemon
```bash
cd ~/AGI/metame-desktop
bun run dev -- metame daemon --sub start
```

### 生产部署

在生产环境，`COMMERCE_API_URL` 应该指向部署的 API 服务器：

```
COMMERCE_API_URL=https://api.metame.ai
```

## 改动最小化

为了保持 Daemon 代码的简洁性，遵循以下原则：

1. ✅ **允许的**: 添加 API 调用（< 50 行）
2. ✅ **允许的**: 读写配置文件中新增的字段
3. ✅ **允许的**: 根据 `features_enabled` 控制功能
4. ❌ **禁止的**: 修改 Daemon 的核心消息协议
5. ❌ **禁止的**: 修改 Claude 交互逻辑
6. ❌ **禁止的**: 大规模重构代码

## 相关文档

- [API 文档](./README.md)
- [数据库 Schema](./database/schema.sql)
- [环境配置](./api/.env.example)
