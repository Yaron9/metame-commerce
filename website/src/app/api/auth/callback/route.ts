import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
    }

    // 调用后端 API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/feishu`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, device_token: '' })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.redirect(
        new URL(`/auth/error?message=${encodeURIComponent(data.error || 'Authentication failed')}`, request.url)
      );
    }

    // 重定向到成功页面，携带绑定码
    return NextResponse.redirect(
      new URL(`/auth/success?bind_code=${data.bind_code}&account_id=${data.account_id}`, request.url)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent(error instanceof Error ? error.message : 'An error occurred')}`,
        request.url
      )
    );
  }
}
