/**
 * 生成 6 位随机绑定码
 * 格式：大写字母 + 数字，易于用户输入
 * 例如：A1B2C3, X9Z8Y7
 */
export function generateBindCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * 验证绑定码格式
 */
export function validateBindCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}

/**
 * 生成设备令牌
 * 用于唯一标识 Daemon 实例
 */
export function generateDeviceToken(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${random}`;
}
