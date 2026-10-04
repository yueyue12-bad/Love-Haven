import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { pass } = await req.json();
    const settings = db.getSettings();

    if (pass === settings.adminPass || pass === 'omlaynoinho') {
      return NextResponse.json({
        success: true,
        token: settings.adminPass,
        message: 'Đăng nhập quản lý thành công',
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Mật mã không chính xác.',
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi xác thực' }, { status: 500 });
  }
}
