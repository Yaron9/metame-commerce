import express from 'express';

const router = express.Router();

/**
 * GET /api/subscription/check/:feishu_user_id
 * Daemon 检查用户订阅状态
 *
 * Response:
 * {
 *   subscription_status: string,  // 'trial' | 'active' | 'expired'
 *   plan: string,                 // 'free' | 'pro' | 'team'
 *   features_enabled: string[],
 *   expires_at?: string,
 *   message: string
 * }
 */
router.get('/check/:feishu_user_id', async (req, res) => {
  try {
    const { feishu_user_id } = req.params;

    if (!feishu_user_id) {
      return res.status(400).json({ error: 'Missing feishu_user_id' });
    }

    // TODO: 从数据库查询账户
    // const account = await db.getAccountByFeishuId(feishu_user_id);
    //
    // if (!account) {
    //   return res.status(404).json({
    //     error: 'Account not found'
    //   });
    // }
    //
    // const features = getFeaturesByPlan(account.subscription_plan);

    const features = ['daemon_basic', 'message_send'];

    res.json({
      subscription_status: 'trial',
      plan: 'free',
      features_enabled: features,
      message: 'Trial account (30 days)'
    });
  } catch (error) {
    console.error('Error in /api/subscription/check:', error);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

/**
 * GET /api/subscription/status/:account_id
 * 获取账户完整的订阅信息
 */
router.get('/status/:account_id', async (req, res) => {
  try {
    const { account_id } = req.params;

    // TODO: 从数据库查询订阅信息
    // const account = await db.getAccount(account_id);
    // const subscription = await db.getLatestSubscription(account_id);

    res.json({
      account_id,
      subscription_status: 'trial',
      plan: 'free',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      billing_cycle: 'none'
    });
  } catch (error) {
    console.error('Error in /api/subscription/status:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

export { router as subscriptionRoutes };
