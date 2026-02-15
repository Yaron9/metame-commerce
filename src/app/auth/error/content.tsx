'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Unknown error';

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 text-white flex items-center justify-center p-6">
      <div className="bg-red-700 p-12 rounded-lg max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">❌ 登录失败</h2>

        <div className="bg-red-800 p-8 rounded-lg mb-8">
          <p className="text-center text-red-100 mb-4">发生错误：</p>
          <p className="text-center text-white font-mono bg-red-900 p-4 rounded">
            {decodeURIComponent(error)}
          </p>
        </div>

        <a
          href="/"
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          返回首页
        </a>
      </div>
    </main>
  );
}
