import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getBindCode,
  verifyBindCode,
  getAccountById,
  updateAccountDeviceToken,
  createBindCode
} from '../db.js';

const router = express.Router();

/**
 * POST /api/bind/qrcode
 * 生成绑定用的二维码数据
 *
 * Body:
 * {
 *   account_id: string,    // 账户ID
 *   device_name?: string   // 设备名称（可选）
 * }
 *
 * Response:
 * {
 *   qrcode_data: string,   // 二维码包含的 JSON 数据（base64 编码）
 *   qrcode_text: string    // 人类可读的绑定码（备用）
 *   expires_in: number     // 有效期（秒）
 * }
 */
router.post('/qrcode', async (req, res) => {
  try {
    const { account_id, device_name } = req.body;

    if (!account_id) {
      return res.status(400).json({ error: 'Missing account_id' });
    }

    // 生成绑定码（6位数字，更容易输入）
    const bindCode = Math.floor(100000 + Math.random() * 900000).toString();
    const deviceToken = `dev_${uuidv4()}`;

    // 二维码包含的数据
    const qrcodeData = {
      account_id,
      device_token: deviceToken,
      bind_code: bindCode,
      timestamp: Date.now(),
      expires_at: Date.now() + 10 * 60 * 1000 // 10分钟有效
    };

    // 保存到数据库
    createBindCode(bindCode, account_id, deviceToken);

    console.log(`✅ 生成绑定二维码: ${bindCode} → ${account_id}`);

    res.json({
      qrcode_data: Buffer.from(JSON.stringify(qrcodeData)).toString('base64'),
      qrcode_text: bindCode,
      expires_in: 600 // 10分钟
    });
  } catch (error) {
    console.error('Error in /api/bind/qrcode:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

/**
 * POST /api/bind/verify
 * Daemon 验证绑定码（Desktop App 输入后调用）
 *
 * Body:
 * {
 *   bind_code: string,      // 绑定码（6位）
 *   device_token?: string   // 设备令牌（可选，如果没有会生成新的）
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   message?: string,
 *   feishu_user_id?: string,
 *   device_token?: string
 * }
 */
router.post('/verify', async (req, res) => {
  try {
    const { bind_code, device_token } = req.body;

    if (!bind_code) {
      return res.status(400).json({
        success: false,
        message: 'Missing bind_code'
      });
    }

    console.log(`🔗 验证绑定码: ${bind_code}`);

    // 验证绑定码（会自动标记为已使用）
    const result = verifyBindCode(bind_code);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }

    // 获取账户信息
    const account = getAccountById(result.accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // 更新设备令牌（如果提供了新的）
    const finalDeviceToken = device_token || result.deviceToken || `dev_${uuidv4()}`;
    updateAccountDeviceToken(result.accountId, finalDeviceToken);

    console.log(`✅ 绑定成功: ${account.feishu_user_id} → ${finalDeviceToken}`);

    res.json({
      success: true,
      feishu_user_id: account.feishu_user_id,
      device_token: finalDeviceToken
    });
  } catch (error) {
    console.error('Error in /api/bind/verify:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify binding'
    });
  }
});

export { router as bindRoutes };
