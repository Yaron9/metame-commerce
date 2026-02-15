-- MetaMe Commerce Database Schema
-- Supports: PostgreSQL, SQLite

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,                    -- UUID v4
  feishu_user_id TEXT UNIQUE NOT NULL,   -- 飞书 User ID (ou_xxx)
  feishu_open_id TEXT,                   -- 飞书 Open ID (for OAuth)
  email TEXT,                             -- 邮箱（可选）
  subscription_status TEXT NOT NULL DEFAULT 'trial',  -- 'trial' | 'active' | 'expired' | 'cancelled'
  subscription_plan TEXT DEFAULT 'free',  -- 'free' | 'pro' | 'team'
  subscription_expires_at TIMESTAMP,      -- 订阅过期时间
  device_token TEXT,                      -- Daemon 的设备令牌
  device_name TEXT,                       -- 设备名称（可选）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bind codes table (用于飞书绑定)
CREATE TABLE IF NOT EXISTS bind_codes (
  code TEXT PRIMARY KEY,                  -- 6位随机码 (e.g., "A1B2C3")
  account_id TEXT NOT NULL,               -- 关联的账户 ID
  device_token TEXT,                      -- Daemon 的设备 ID
  feishu_user_id TEXT,                    -- 飞书 User ID
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'confirmed' | 'expired'
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,          -- 通常是 created_at + 10分钟
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Subscriptions table (历史记录)
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,                    -- UUID v4
  account_id TEXT NOT NULL,               -- 关联的账户 ID
  plan TEXT NOT NULL,                     -- 'free' | 'pro' | 'team'
  billing_cycle TEXT,                     -- 'monthly' | 'yearly'
  stripe_subscription_id TEXT,            -- Stripe subscription ID
  stripe_customer_id TEXT,                -- Stripe customer ID
  status TEXT NOT NULL,                   -- 'active' | 'past_due' | 'canceled' | 'unpaid'
  amount_cents INTEGER,                   -- 金额（美分）
  currency TEXT DEFAULT 'usd',            -- 货币
  started_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Webhook logs (用于调试)
CREATE TABLE IF NOT EXISTS webhook_logs (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,               -- 'stripe.customer.subscription.updated' 等
  payload JSONB,                          -- 完整的 webhook 数据
  status TEXT DEFAULT 'received',         -- 'received' | 'processed' | 'error'
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Feature usage (用于统计)
CREATE TABLE IF NOT EXISTS feature_logs (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  feature TEXT NOT NULL,                  -- 'daemon_started' | 'message_sent' | 'api_call' 等
  metadata JSONB,                         -- 额外数据（可选）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_feishu_user_id ON accounts(feishu_user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_device_token ON accounts(device_token);
CREATE INDEX IF NOT EXISTS idx_bind_codes_account_id ON bind_codes(account_id);
CREATE INDEX IF NOT EXISTS idx_bind_codes_expires_at ON bind_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_account_id ON subscriptions(account_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_feature_logs_account_id ON feature_logs(account_id);
CREATE INDEX IF NOT EXISTS idx_feature_logs_created_at ON feature_logs(created_at);
