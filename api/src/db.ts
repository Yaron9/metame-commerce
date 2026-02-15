import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../metame.db');

let db: Database.Database | null = null;

export function initDatabase() {
  if (db) return db;

  db = new Database(DB_PATH);
  
  // 创建表
  db.exec(`
    -- 账户表
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      feishu_user_id TEXT UNIQUE NOT NULL,
      feishu_name TEXT,
      feishu_avatar TEXT,
      subscription_status TEXT DEFAULT 'trial',
      subscription_plan TEXT DEFAULT 'free',
      subscription_expires_at DATETIME,
      device_token TEXT,
      device_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 绑定码表（6位数字，10分钟有效期）
    CREATE TABLE IF NOT EXISTS bind_codes (
      code TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      device_token TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_accounts_feishu_user_id ON accounts(feishu_user_id);
    CREATE INDEX IF NOT EXISTS idx_bind_codes_account_id ON bind_codes(account_id);
  `);

  console.log(`[DB] Initialized at ${DB_PATH}`);
  return db;
}

export function getDatabase() {
  if (!db) {
    initDatabase();
  }
  return db!;
}

// 账户操作
export function createAccount(accountId: string, feishuUserId: string, name?: string, avatar?: string) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO accounts (id, feishu_user_id, feishu_name, feishu_avatar)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(accountId, feishuUserId, name || '', avatar || '');
  console.log(`[DB] Account created: ${accountId} (feishu: ${feishuUserId})`);
  return accountId;
}

export function getAccountByFeishuUserId(feishuUserId: string) {
  const db = getDatabase();
  const stmt = db.prepare(`SELECT * FROM accounts WHERE feishu_user_id = ?`);
  return stmt.get(feishuUserId) as any;
}

export function getAccountById(accountId: string) {
  const db = getDatabase();
  const stmt = db.prepare(`SELECT * FROM accounts WHERE id = ?`);
  return stmt.get(accountId) as any;
}

export function updateAccountDeviceToken(accountId: string, deviceToken: string) {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE accounts 
    SET device_token = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(deviceToken, accountId);
}

// 绑定码操作
export function createBindCode(code: string, accountId: string, deviceToken?: string) {
  const db = getDatabase();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟
  const stmt = db.prepare(`
    INSERT INTO bind_codes (code, account_id, device_token, expires_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(code, accountId, deviceToken || null, expiresAt.toISOString());
  console.log(`[DB] Bind code created: ${code} → ${accountId}`);
  return code;
}

export function getBindCode(code: string) {
  const db = getDatabase();
  const stmt = db.prepare(`SELECT * FROM bind_codes WHERE code = ?`);
  return stmt.get(code) as any;
}

export function verifyBindCode(code: string) {
  const db = getDatabase();
  const bindCode = getBindCode(code);

  if (!bindCode) {
    return { valid: false, error: 'Bind code not found' };
  }

  if (bindCode.status !== 'pending') {
    return { valid: false, error: 'Bind code already used' };
  }

  const now = new Date();
  if (now > new Date(bindCode.expires_at)) {
    return { valid: false, error: 'Bind code expired' };
  }

  // 标记为已使用
  const stmt = db.prepare(`UPDATE bind_codes SET status = 'confirmed' WHERE code = ?`);
  stmt.run(code);

  return { valid: true, accountId: bindCode.account_id, deviceToken: bindCode.device_token };
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
