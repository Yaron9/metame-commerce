-- MetaMe Commerce Database Initialization
-- 运行此脚本以初始化数据库

-- 导入 schema
\i schema.sql

-- 插入测试数据（可选）
INSERT INTO accounts (
  id,
  feishu_user_id,
  email,
  subscription_status,
  subscription_plan,
  created_at
) VALUES (
  'acc_test_001',
  'ou_test_user_001',
  'test@example.com',
  'trial',
  'free',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- 验证
SELECT COUNT(*) as account_count FROM accounts;
SELECT COUNT(*) as bind_code_count FROM bind_codes;
SELECT COUNT(*) as subscription_count FROM subscriptions;
