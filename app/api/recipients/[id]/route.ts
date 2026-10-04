import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    const deleted = db.deleteRecipient(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy người nhận' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa người nhận' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi xóa người nhận' }, { status: 500 });
  }
}
