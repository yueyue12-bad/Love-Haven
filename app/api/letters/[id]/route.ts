import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();
    if (authHeader !== `Bearer ${settings.adminPass}`) {
      return NextResponse.json({ success: false, message: 'Bạn không có quyền' }, { status: 401 });
    }

    const { id } = await context.params;
    const ok = db.markLetterRead(id);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy thư' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã đánh dấu đã đọc' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi cập nhật trạng thái thư' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();
    if (authHeader !== `Bearer ${settings.adminPass}`) {
      return NextResponse.json({ success: false, message: 'Bạn không có quyền' }, { status: 401 });
    }

    const { id } = await context.params;
    const ok = db.deleteLetter(id);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy thư để xóa' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa thư' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi xóa thư' }, { status: 500 });
  }
}
