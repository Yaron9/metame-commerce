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
      footer: "Based on OpenCode",
      rotatingText: [
        "24小时随时待命，我是您的全天候数字助手",
        "支持定时任务，让繁琐工作自动化运行",
        "具备自我成长能力，随着使用越来越懂你",
        "支持手机远程指挥，随时随地掌控全局",
        "本地化隐私安全，您的数据完全掌握在自己手中",
        "基于 OpenCode 强力驱动，无限扩展的技能生态"
      ],
      modalTitle: "获取邀请码 & 安装指南",
      steps: [
        "1. 点击上方按钮下载安装包（.dmg 文件）",
        "2. 双击打开 .dmg，将 MetaMe 拖入「应用程序」文件夹",
        "3. 打开 MetaMe，系统会提示「无法验证开发者」→ 点击「取消」",
        "4. 打开「系统设置」→「隐私与安全性」→ 页面下拉找到「MetaMe 已被阻止」→ 点击「仍要打开」",
        "⚠️ 这不是病毒！目前处于内测阶段，尚未购买 Apple 开发者证书，正式版会解决。如仍无法打开，请打开「终端」输入：xattr -cr /Applications/MetaMe.app",
        "5. 扫码添加飞书机器人 → 自动收到邀请码（仅首次）→ 在电脑上输入邀请码",
        "6. 给机器人发送「绑定」→ 收到绑定码 → 在电脑上输入绑定码 → 绑定成功"
      ]
    },
    en: {
      about: "About Me",
      contact: "Contact",
      macos: "MacOS",
      download: "Click to Download",
      invite: "Invite Code",
      getInvite: "Click to Get",
      footer: "Based on OpenCode",
      rotatingText: [
        "24/7 Standby, your all-weather digital assistant",
        "Supports scheduled tasks, automating tedious work",
        "Self-growing, understanding you better over time",
        "Remote mobile command, control everything from anywhere",
        "Local privacy security, your data is in your hands",
        "Powered by OpenCode, infinite skill ecosystem extension"
      ],
      modalTitle: "Get Invite Code & Install Guide",
      steps: [
        "1. Click the button above to download the installer (.dmg file)",
        "2. Open the .dmg and drag MetaMe into the Applications folder",
        "3. Open MetaMe — macOS will warn \"cannot verify developer\" → Click \"Cancel\"",
        "4. Go to System Settings → Privacy & Security → Scroll down to find \"MetaMe was blocked\" → Click \"Open Anyway\"",
        "⚠️ This is NOT malware! We're in beta and haven't purchased an Apple Developer certificate yet. The official release will be signed. If it still won't open, run in Terminal: xattr -cr /Applications/MetaMe.app",
        "5. Scan the QR code to add the Feishu bot → You'll receive an invite code (first time only) → Enter it on your computer",
        "6. Send \"Bind\" to the bot → Receive a binding code → Enter it on your computer → Binding complete"
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
      }, 500); // Wait for fade out
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval);
  }, [lang, t.rotatingText.length]);

  return (
    <main className="min-h-screen flex flex-col justify-between p-8 bg-[#f9f9f9] text-[#111] font-sans relative overflow-hidden">

      {/* Top Left Links */}
      <div className="fixed top-12 left-8 md:left-12 flex flex-col gap-2 text-[10px] font-bold tracking-widest uppercase z-20 text-gray-500">
        <a href="#" onClick={(e) => { e.preventDefault(); alert(lang === 'zh' ? '准备个人简介中...' : 'Personal bio coming soon...'); }} className="hover:text-black transition-colors">{t.about}</a>
        <a href="mailto:yaron999999@gmail.com" className="hover:text-black transition-colors">{t.contact}</a>
      </div>

      {/* Top Right Language Switcher */}
      <div className="fixed top-12 right-8 md:right-12 z-20 flex gap-4">
        <button
          onClick={() => setLang('zh')}
          className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${lang === 'zh' ? 'text-black opacity-100' : 'text-gray-400 opacity-60 hover:text-black hover:opacity-100'}`}
        >
          中文
        </button>
        <button
          onClick={() => setLang('en')}
          className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${lang === 'en' ? 'text-black opacity-100' : 'text-gray-400 opacity-60 hover:text-black hover:opacity-100'}`}
        >
          English
        </button>
      </div>

      {/* Main Content - Centered with Golden Ratio Spacing */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-8 relative z-10 w-full max-w-5xl mx-auto">

        {/* Logo - Adjusted Size */}
        <div className="mb-[5vh]">
          <img src="/metame-high-resolution-logo-grayscale-transparent.png" alt="MetaMe Logo" className="w-48 md:w-64 opacity-90" />
        </div>

        {/* Dynamic Subtitle - Refined Typography */}
        <div className="h-12 flex items-center justify-center mb-[8vh] px-4">
          <p
            className={`text-base md:text-lg font-medium text-gray-600 tracking-wide text-center transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
          >
            {t.rotatingText[textIndex]}
          </p>
        </div>

        {/* Action Buttons - Smaller, Cleaner */}
        <div className="flex flex-col md:flex-row gap-6 items-center">

          {/* Button 1: MacOS (Download) */}
          <a
            href="https://github.com/Yaron9/MetaMe/releases/download/MetaMe_DeskTop/MetaMe.dmg"
            className="group relative flex items-center justify-center px-8 py-3 bg-transparent border border-black rounded-full min-w-[200px] hover:bg-black hover:text-white transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              {/* Apple Logo SVG - Smaller */}
              <svg className="w-4 h-4 mb-0.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.36-1.15 1.5.15 2.76.71 3.51 1.76-2.99 1.77-2.61 5.91.56 7.28-.48 1.4-1.16 2.82-3.51 4.34zM13.03 5.37c.75-1.07.69-2.31.54-3.37-1.17.07-2.58.74-3.26 1.76-.63 1.01-.52 2.37.56 2.37.15 0 1.25.13 2.16-.76z" />
              </svg>
              <span className="font-medium tracking-wider text-sm">{t.macos}</span>
            </div>
            <span className="absolute -bottom-8 text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
              {t.download}
            </span>
          </a>

          {/* Button 2: Invite Code - Trigger Modal */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="group relative flex items-center justify-center px-8 py-3 bg-transparent border border-gray-300 rounded-full min-w-[200px] hover:border-black hover:bg-black hover:text-white transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              {/* Ticket Icon - Smaller */}
              <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="font-medium tracking-wider text-sm">{t.invite}</span>
            </div>
            <span className="absolute -bottom-8 text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
              {t.getInvite}
            </span>
          </button>

        </div>

      </div>

      {/* Footer / Signature */}
      <div className="fixed bottom-8 left-8 md:left-12 text-[10px] font-bold text-gray-400 z-20 tracking-wider">
        <p className="mb-1 uppercase">
          Based on <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">OpenCode</a>
        </p>
        <a href="https://github.com/Yaron9/MetaMe" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600 transition-colors">
          MetaMe v1.0
        </a>
      </div>

      {/* Background Decorative Element (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-gradient-to-tr from-gray-50 to-transparent z-0 pointer-events-none opacity-50" />

      {/* Invite Code Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowInviteModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold mb-1 text-center">{t.modalTitle}</h3>
            <p className="text-center text-sm text-red-500 mb-4">🧧 新年快乐！MetaMe 给大家拜年啦，祝各位马年大吉、万事如意！</p>

            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <img src="/QR.jpg" alt="Feishu QR Code" className="w-40 h-40 object-contain" />
                  <span className="text-[11px] text-gray-400 font-medium">飞书扫码添加</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <img src="/wechat-qr.png" alt="WeChat QR Code" className="w-40 h-40 object-contain" />
                  <span className="text-[11px] text-gray-400 font-medium">微信内测群</span>
                  <span className="text-[10px] text-gray-500">欢迎加入内测群反馈意见</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <img src="/tip-qr.jpg" alt="Tip QR Code" className="w-40 h-40 object-contain" />
                  <span className="text-[11px] text-gray-400 font-medium">赞赏码</span>
                  <span className="text-[10px] text-gray-500">给MetaMe捐个买房(服务器)钱</span>
                </div>
              </div>

              <div className="text-[13px] text-gray-600 space-y-1.5 text-left w-full bg-gray-50 p-3 rounded-md leading-snug">
                {t.steps.map((step, index) => (
                  <p key={index}>{step}</p>
                ))}
              </div>

              <div className="text-sm text-red-500 text-left w-full bg-red-50 p-3 rounded-md leading-relaxed">
                <p className="font-bold mb-1">🔒 安全提醒</p>
                <p>MetaMe 可以通过手机远程操控您的电脑、访问电脑上的文件。请务必保护好您的飞书账号安全，不要将账号借给他人使用，避免造成隐私泄露。</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
