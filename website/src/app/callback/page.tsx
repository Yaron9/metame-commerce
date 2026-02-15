'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setError('Missing authorization code');
      setLoading(false);
      return;
    }

    const exchangeCode = async () => {
      try {
        console.log('Exchanging code:', code);

        // Use relative URL - Nginx will proxy to backend
        // Note: This relies on Nginx proxying /api to the backend port
        const response = await fetch('/api/auth/feishu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ code })
        });

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        let data;
        try {
          data = await response.json();
          console.log('Response data:', data);
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          // If JSON parse fails, read text to see what happened (e.g. HTML error page)
          const text = await response.text().catch(() => 'No text content');
          throw new Error(`Invalid server response (${response.status}): ${text.substring(0, 100)}...`);
        }

        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        if (data.error) {
          throw new Error(data.error);
        }

        localStorage.setItem('account_id', data.account_id);
        localStorage.setItem('bind_code', data.bind_code);
        localStorage.setItem('feishu_user_id', data.feishu_user_id);

        router.push(`/auth/success?account_id=${data.account_id}&bind_code=${data.bind_code}`);
      } catch (err) {
        console.error('OAuth processing error:', err);
        setError(err instanceof Error ? err.message : 'Unknown network error');
        setLoading(false);
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="glass p-12 rounded-3xl text-center max-w-md w-full mx-4 border-blue-500/20">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Connecting to Feishu...</h2>
          <p className="text-slate-400">Verifying your identity securely</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="glass p-10 rounded-3xl text-center max-w-md w-full mx-4 border-red-500/30">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
            ⚠️
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white">Authorization Failed</h1>
          <div className="bg-black/30 p-4 rounded-lg mb-6 text-left overflow-auto max-h-40 border border-white/5">
            <p className="text-red-400 font-mono text-sm break-all">{error}</p>
          </div>
          <p className="text-slate-400 text-sm mb-8">Please try again or contact support if the issue persists.</p>
          <a href="/" className="inline-block px-8 py-3 bg-white text-black hover:bg-slate-200 rounded-full font-bold transition-all hover:scale-105">
            Return Home
          </a>
        </div>
      </main>
    );
  }

  return null;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl">Loading...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </main>
    }>
      <CallbackContent />
    </Suspense>
  );
}
