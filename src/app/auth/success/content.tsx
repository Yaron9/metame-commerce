'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SuccessPageContent() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get('account_id');

  useEffect(() => {
    if (accountId) {
      localStorage.setItem('account_id', accountId);
    }
  }, [accountId]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#f9f9f9] text-[#111]">
      <div className="bg-white p-10 rounded-sm max-w-4xl w-full relative z-10 shadow-xl border border-gray-100">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-black text-white rounded-sm flex items-center justify-center text-2xl mb-6 shadow-lg">
            ✓
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-black">
            Success
          </h2>
          <p className="text-gray-500 tracking-wide uppercase text-xs font-bold">Account Linked Successfully</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white rounded-sm mb-6 border border-gray-200 shadow-sm">
              <img
                src="/feishu-bot-qr.jpg"
                alt="Feishu Bot QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400">
              Scan with Feishu App
            </p>
          </div>

          {/* Instructions & Download Section */}
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-8">
              <div className="flex gap-4">
                <span className="font-mono text-gray-300">01</span>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Add Bot</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Scan the QR code to add the MetaMe bot to your Feishu contacts.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="font-mono text-gray-300">02</span>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Download App</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Install MetaMe Daemon on your macOS device to enable control.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-gray-100">
              <a
                href="/MetaMe-Installer.dmg"
                download
                className="group flex items-center justify-center w-full bg-black text-white font-bold text-sm tracking-widest uppercase py-4 px-6 rounded-sm transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                Download for macOS
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </a>

              <div className="mt-4 text-center">
                <a href="/" className="text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
