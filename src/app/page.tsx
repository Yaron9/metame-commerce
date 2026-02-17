'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [textIndex, setTextIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const content = {
    zh: {
      about: "关于我",
      contact: "联系我",
      macos: "MacOS 客户端",
      download: "点击下载",
      invite: "邀请码",
      getInvite: "点击获取",
      greeting: "🧧 过年好！新年大吉，万事如意！",
      rotatingText: [
        "24小时随时待命，我是您的全天候数字助手",
        "支持定时任务，让繁琐工作自动化运行",
        "具备自我成长能力，随着使用越来越懂你",
        "支持手机远程指挥，随时随地掌控全局",
        "本地化隐私安全，您的数据完全掌握在自己手中",
        "基于 OpenCode 强力驱动，无限扩展的技能生态"
      ],
      modalTitle: "获取邀请码 & 安装指南",
      modalGreeting: "🧧 新年快乐！MetaMe 给大家拜年啦，祝各位马年大吉、万事如意！",
      steps: [
        "1. 下载 MetaMe-Install.pkg → 双击打开 → 系统提示「无法验证开发者」→ 点击「取消」（不要点删除！）",
        "2. 打开「系统设置」→「隐私与安全性」→ 页面下拉找到「MetaMe-Install.pkg 已被阻止」→ 点击「仍要打开」",
        "3. 再次双击 pkg → 点击「打开」→ 输入电脑密码 → 按提示完成安装",
        "⚠️ 这不是病毒！目前处于内测阶段，尚未购买 Apple 开发者证书，正式版会解决。",
        "4. 扫码添加飞书机器人 → 自动收到邀请码（仅首次）→ 在电脑上输入邀请码",
        "5. 给机器人发送「绑定」→ 收到绑定码 → 在电脑上输入绑定码 → 绑定成功"
      ]
    },
    en: {
      about: "About Me",
      contact: "Contact",
      macos: "MacOS",
      download: "Click to Download",
      invite: "Invite Code",
      getInvite: "Click to Get",
      greeting: "🧧 Happy New Year!",
      rotatingText: [
        "24/7 Standby, your all-weather digital assistant",
        "Supports scheduled tasks, automating tedious work",
        "Self-growing, understanding you better over time",
        "Remote mobile command, control everything from anywhere",
        "Local privacy security, your data is in your hands",
        "Powered by OpenCode, infinite skill ecosystem extension"
      ],
      modalTitle: "Get Invite Code & Install Guide",
      modalGreeting: "🧧 Happy New Year from MetaMe! Wishing you all the best!",
      steps: [
        "1. Download MetaMe-Install.pkg → Double-click → macOS warns \"cannot verify developer\" → Click \"Cancel\" (do NOT click Delete!)",
        "2. Open System Settings → Privacy & Security → Scroll down to find \"MetaMe-Install.pkg was blocked\" → Click \"Open Anyway\"",
        "3. Double-click the pkg again → Click \"Open\" → Enter your Mac password → Follow prompts to complete installation",
        "⚠️ This is NOT malware! We're in beta and haven't purchased an Apple Developer certificate yet. The official release will be signed.",
        "4. Scan the QR code to add the Feishu bot → You'll receive an invite code (first time only) → Enter it on your computer",
        "5. Send \"Bind\" to the bot → Receive a binding code → Enter it on your computer → Binding complete"
      ]
    }
  };

  const t = content[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % t.rotatingText.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [lang, t.rotatingText.length]);

  return (
    <main className="min-h-screen flex flex-col justify-between p-8 bg-[#f9f9f9] text-[#111] font-sans relative overflow-hidden">

      {/* Nav - Top Left */}
      <div className="fixed top-10 left-8 md:left-12 flex flex-col gap-3 z-20">
        <a href="#" onClick={(e) => { e.preventDefault(); alert(lang === 'zh' ? '准备个人简介中...' : 'Personal bio coming soon...'); }} className="text-[13px] font-semibold tracking-wide text-gray-400 hover:text-black transition-colors">{t.about}</a>
        <a href="mailto:yaron999999@gmail.com" className="text-[13px] font-semibold tracking-wide text-gray-400 hover:text-black transition-colors">{t.contact}</a>
      </div>

      {/* Nav - Top Right */}
      <div className="fixed top-10 right-8 md:right-12 z-20 flex gap-4">
        <button onClick={() => setLang('zh')} className={`text-[13px] font-semibold tracking-wide transition-colors ${lang === 'zh' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>中文</button>
        <button onClick={() => setLang('en')} className={`text-[13px] font-semibold tracking-wide transition-colors ${lang === 'en' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>English</button>
      </div>

      {/* Hero - Golden ratio: logo at ~38% from top */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-4xl mx-auto" style={{ paddingBottom: '10vh' }}>

        {/* Logo */}
        <img src="/metame-high-resolution-logo-grayscale-transparent.png" alt="MetaMe Logo" className="w-52 md:w-64 mb-5 opacity-90" />

        {/* Greeting */}
        <p className="text-lg md:text-xl text-red-500 font-semibold mb-8">{t.greeting}</p>

        {/* Rotating tagline */}
        <div className="h-8 flex items-center justify-center mb-12 px-4">
          <p className={`text-base md:text-lg text-gray-500 text-center transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {t.rotatingText[textIndex]}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <a
            href="https://github.com/Yaron9/metame-releases/releases/latest/download/MetaMe-Install.pkg"
            className="group relative flex items-center gap-3 px-8 py-3.5 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.36-1.15 1.5.15 2.76.71 3.51 1.76-2.99 1.77-2.61 5.91.56 7.28-.48 1.4-1.16 2.82-3.51 4.34zM13.03 5.37c.75-1.07.69-2.31.54-3.37-1.17.07-2.58.74-3.26 1.76-.63 1.01-.52 2.37.56 2.37.15 0 1.25.13 2.16-.76z" />
            </svg>
            <span className="text-[15px] font-semibold tracking-wide">{t.macos}</span>
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{t.download}</span>
          </a>

          <button
            onClick={() => setShowInviteModal(true)}
            className="group relative flex items-center gap-3 px-8 py-3.5 border-2 border-gray-300 rounded-full hover:border-black hover:bg-black hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="text-[15px] font-semibold tracking-wide">{t.invite}</span>
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{t.getInvite}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 left-8 md:left-12 z-20">
        <p className="text-[13px] font-semibold text-gray-400 tracking-wide mb-1">
          Based on <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">OpenCode</a>
        </p>
        <a href="https://github.com/Yaron9/MetaMe" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-black hover:text-gray-500 transition-colors">
          MetaMe v1.0
        </a>
      </div>

      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-gradient-to-tr from-gray-50 to-transparent z-0 pointer-events-none opacity-50" />

      {/* Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button onClick={() => setShowInviteModal(false)} className="absolute top-5 right-5 text-gray-300 hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-bold text-center mb-2">{t.modalTitle}</h3>
            <p className="text-center text-base text-red-500 mb-8">{t.modalGreeting}</p>

            {/* QR Codes */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-44 h-44 rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-3">
                  <img src="/QR.jpg" alt="Feishu QR" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-medium text-gray-600">飞书扫码添加</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-44 h-44 rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-3">
                  <img src="/wechat-qr.png" alt="WeChat QR" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-medium text-gray-600">微信内测群</span>
                <span className="text-xs text-gray-400 mt-0.5">欢迎加入反馈意见</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-44 h-44 rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-3">
                  <img src="/tip-qr.jpg" alt="Tip QR" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-medium text-gray-600">赞赏码</span>
                <span className="text-xs text-gray-400 mt-0.5">给MetaMe捐个服务器钱</span>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-xl p-5 mb-4">
              <div className="space-y-2.5">
                {t.steps.map((step, i) => (
                  <p key={i} className={`text-[14px] leading-relaxed ${step.startsWith('⚠') ? 'text-amber-600 font-medium' : 'text-gray-600'}`}>{step}</p>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="bg-red-50 rounded-xl p-5">
              <p className="text-[15px] font-bold text-red-500 mb-1.5">🔒 安全提醒</p>
              <p className="text-[14px] text-red-400 leading-relaxed">MetaMe 可以通过手机远程操控您的电脑、访问电脑上的文件。请务必保护好您的飞书账号安全，不要将账号借给他人使用，避免造成隐私泄露。</p>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
