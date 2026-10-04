import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();
    if (authHeader !== `Bearer ${settings.adminPass}`) {
      return NextResponse.json({ success: false, message: 'Bạn không có quyền' }, { status: 401 });
    }

    const dump = db.getFullDatabase();
    return NextResponse.json({ success: true, data: dump });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi sao lưu dữ liệu' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();
    if (authHeader !== `Bearer ${settings.adminPass}`) {
      return NextResponse.json({ success: false, message: 'Bạn không có quyền' }, { status: 401 });
    }

    const { data } = await req.json();
    if (!data) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    db.importDatabase(data);
    return NextResponse.json({ success: true, message: 'Khôi phục dữ liệu thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi nhập dữ liệu' }, { status: 500 });
  }
}
