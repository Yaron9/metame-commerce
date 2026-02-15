import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler
 *
 * 事件类型：
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 */
router.post('/stripe', async (req, res) => {
  try {
    const { type, data } = req.body;

    // TODO: 验证 Stripe signature
    // const sig = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(
    //   req.rawBody,
    //   sig,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // );

    console.log(`📨 Stripe webhook: ${type}`);

    // 记录 webhook
    const logId = uuidv4();
    // await db.createWebhookLog({
    //   id: logId,
    //   event_type: type,
    //   payload: data,
    //   status: 'received'
    // });

    // 处理不同的事件
    switch (type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(data);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(data);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(data);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(data);
        break;

      default:
        console.log(`⚠️  Unknown webhook type: ${type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error in /api/webhooks/stripe:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleSubscriptionUpdate(data: any) {
  // TODO: 从 data.object 中获取 stripe_subscription_id 和 customer_id
  // 更新 subscriptions 表
  // const subscription = data.object;
  // await db.updateSubscription({
  //   stripe_subscription_id: subscription.id,
  //   status: subscription.status,
  //   expires_at: new Date(subscription.current_period_end * 1000)
  // });

  console.log('✅ Subscription updated');
}

async function handleSubscriptionCanceled(data: any) {
  // TODO: 标记为已取消
  console.log('❌ Subscription canceled');
}

async function handlePaymentSucceeded(data: any) {
  // TODO: 更新支付状态
  console.log('💰 Payment succeeded');
}

async function handlePaymentFailed(data: any) {
  // TODO: 发送通知
  console.log('⚠️  Payment failed');
}

/**
 * POST /api/webhooks/feishu
 * Feishu event callback
 *
 * 事件类型：
 * - im.message.receive_v1
 */
router.post('/feishu', async (req, res) => {
  try {
    // 🔑 关键：立即返回，不要让飞书等待
    res.json({ code: 0 });

    // 异步处理（不阻塞响应）
    setImmediate(() => {
      try {
        const fullPayload = req.body;

        // 打印完整的 webhook 内容用于测试
        console.log('\n========== 🔔 FEISHU WEBHOOK RECEIVED ==========');
        console.log('Full payload:', JSON.stringify(fullPayload, null, 2));

        // 提取关键字段
        const eventType = fullPayload.type;
        const eventData = fullPayload.data || {};
        const messageData = eventData.message || {};

        console.log('\n📝 Extracted fields:');
        console.log('  - Event type:', eventType);
        console.log('  - User ID:', messageData.user_id);
        console.log('  - Chat ID:', messageData.chat_id);
        console.log('  - Message text:', messageData.text);
        console.log('  - Message ID:', messageData.message_id);
        console.log('  - Create time:', messageData.create_time);

        // 打印所有顶层字段
        console.log('\n📊 All top-level keys in message:');
        Object.keys(messageData).forEach(key => {
          console.log(`    ${key}: ${JSON.stringify(messageData[key])}`);
        });

        console.log('=============================================\n');
      } catch (error) {
        console.error('Error processing webhook:', error);
      }
    });
  } catch (error) {
    console.error('Error in /api/webhooks/feishu:', error);
    res.status(500).json({ code: -1, msg: 'Internal error' });
  }
});

export { router as webhookRoutes };
