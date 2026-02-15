import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateBindCode } from '../utils/bind-code.js';
import { createAccount, getAccountByFeishuUserId, createBindCode } from '../db.js';

const router = express.Router();

const FEISHU_APP_ID = 'cli_a902d5b1e578dbb3';
const FEISHU_APP_SECRET = 'lcq6T5VpfsUXU1wzYgvyvGkUhWGS2b4E';

/**
 * POST /api/auth/feishu
 * 飞书 OAuth 回调处理
 *
 * Body:
 * {
 *   code: string,              // Feishu OAuth code
 *   device_token?: string      // Daemon device ID (optional)
 * }
 *
 * Response:
 * {
 *   account_id: string,
 *   bind_code: string,
 *   subscription_status: string,
 *   message: string
 * }
 */
router.post('/feishu', async (req, res) => {
  try {
    const { code, device_token } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing code parameter' });
    }

    // Step 1: 用 code 换取 access_token
    // 从 header 中获取 referer，提取基础 URL
    const referer = req.headers.referer;
    // CRITICAL: This must match EXACTLY what was used in the authorization request
    // and what is registered in Feishu Console.
    const redirectUri = 'http://101.200.96.18/callback';

    console.log(`Using redirect_uri: ${redirectUri} (Referer was: ${referer})`);

    const tokenResponse = await fetch('https://open.feishu.cn/open-apis/authen/v2/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: FEISHU_APP_ID,
        client_secret: FEISHU_APP_SECRET,
        code: code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenResponse.json();

    console.log('Feishu token response:', JSON.stringify(tokenData, null, 2));

    // 飞书返回格式：{ access_token: "...", token_type: "Bearer", expires_in: 7200, scope: "...", code: 0 }
    if (tokenData.code !== 0 || !tokenData.access_token) {
      console.error('Feishu token error:', tokenData);
      return res.status(400).json({ error: `Failed to get access token: ${tokenData.error || JSON.stringify(tokenData)}` });
    }

    const accessToken = tokenData.access_token;

    // Step 2: 用 access_token 获取用户信息
    const userResponse = await fetch('https://passport.feishu.cn/suite/passport/oauth/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const userData = await userResponse.json();

    console.log('Feishu user info:', userData);

    // 飞书 userinfo 返回 OpenID Connect 格式，顶层直接是字段
    // { sub: "ou_xxx", open_id: "ou_xxx", union_id: "on_xxx", name, picture, ... }
    const feishuUserId = userData.sub || userData.open_id;  // ou_xxx

    if (!feishuUserId) {
      console.error('Invalid user info response:', userData);
      return res.status(400).json({ error: 'Failed to extract user ID from Feishu response' });
    }

    // 检查是否已经有账户
    let account = getAccountByFeishuUserId(feishuUserId);
    let accountId: string;

    if (account) {
      accountId = account.id;
      console.log(`✅ Account already exists: ${accountId} (Feishu: ${feishuUserId})`);
    } else {
      accountId = uuidv4();
      createAccount(accountId, feishuUserId, userData.name, userData.picture);
    }

    const bindCode = generateBindCode();
    createBindCode(bindCode, accountId);

    console.log(`✅ Account: ${accountId} (Feishu: ${feishuUserId})`);
    console.log(`📝 Bind code: ${bindCode}`);

    res.json({
      account_id: accountId,
      bind_code: bindCode,
      subscription_status: 'trial',
      subscription_plan: 'free',
      feishu_user_id: feishuUserId,
      message: 'Account created. Use bind_code to link your Daemon.'
    });
  } catch (error) {
    console.error('Error in /api/auth/feishu:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

export { router as authRoutes };
