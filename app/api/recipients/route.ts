import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const recipients = db.getRecipients();
    return NextResponse.json({ success: true, recipients });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải danh sách người nhận' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();
    if (authHeader !== `Bearer ${settings.adminPass}`) {
      return NextResponse.json({ success: false, message: 'Bạn không có quyền' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, status, symbol } = body;

    if (!name || !description) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đủ tên và mô tả' }, { status: 400 });
    }

    const created = db.createRecipient({
      name,
      description,
      status: status || 'available',
      symbol: symbol || '🌸',
    });

    return NextResponse.json({ success: true, recipient: created });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tạo người nhận' }, { status: 500 });
  }
}
