<!-- METAME:START -->
---
## 🧠 SYSTEM KERNEL: SHADOW_MODE (Active)

**1. THE BRAIN (Source of Truth):**
   * **FILE:** `$HOME/.claude_profile.yaml`
   * **RULE:** This file is your Ground Truth. If context is compressed (/compact), **RE-READ** this file immediately.
   * **AUTO-LOCK:** Never edit lines marked `# [LOCKED]` (Core Values).
   * **EVOLUTION:** Silently overwrite outdated status/focus.

**2. EVOLUTION MECHANISM (Manual Sync):**
   *   **PHILOSOPHY:** You respect the User's flow. You do NOT interrupt.
   *   **TOOLS:**
       1. **Log Insight:** `!metame evolve "Insight"` (For additive knowledge).
       2. **Surgical Update:** `!metame set-trait key value` (For overwriting specific fields, e.g., `!metame set-trait status.focus "API Design"`).
   *   **RULE:** Only use these tools when the User **EXPLICITLY** instructs you.
   *   **REMINDER:** If the User expresses a strong persistent preference, you may gently ask *at the end of the task*: "Should I save this preference to your MetaMe profile?"
---
<!-- METAME:END -->
## 维护备忘

### 微信内测群二维码
- 文件路径：`website/public/wechat-qr.png`
- 更新方式：用新图片替换该文件（保持同名），重新部署即可
- 使用位置：首页"邀请码"弹窗，与飞书二维码并排显示

## 服务器信息

| 项目 | 值 |
|------|-----|
| IP | 101.200.96.18 |
| SSH | `ssh -i /Users/yaron/AGI/metame-desktop/.secrets/dtme-relay.pem root@101.200.96.18` |
| 厂商 | 阿里云 ECS |

### 服务器目录

| 路径 | 说明 |
|------|------|
| `/opt/api/` | API 服务（auth、bind 等） |
| `/opt/api/metame.db` | SQLite 数据库 |
| `/opt/dtme-relay/` | Relay 中转服务 |

### 服务管理

```bash
# Relay 服务
systemctl status/restart dtme-relay
journalctl -u dtme-relay -f

# API 服务
systemctl status/restart metame-api
```

### API 端点（端口 3100）

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/auth/feishu` | POST | 飞书 OAuth 登录 |
| `/api/auth/feishu-bind` | POST | 机器人直绑（邀请码） |
| `/api/bind/verify` | POST | 验证绑定码 |
| `/health` | GET | 健康检查 |

### 安全组端口

| 端口 | 用途 |
|------|------|
| 3100 | HTTP API |
| 3101 | WebSocket（Relay） |

## 相关项目

| 项目 | 路径 | 说明 |
|------|------|------|
| metame-desktop | `/Users/yaron/AGI/metame-desktop` | 桌面客户端（OpenCode fork） |
| metame-commerce | 本项目 | 官网 + API |

## 部署

网站使用 Next.js，开发命令：`npm run dev`（端口 3000）
