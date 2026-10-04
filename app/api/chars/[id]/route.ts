import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const char = db.getCharById(id);
    if (!char) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy char' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();

    if (isAdmin && authHeader === `Bearer ${settings.adminPass}`) {
      return NextResponse.json({ success: true, char });
    }

    if (char.locked) {
      return NextResponse.json({
        success: true,
        char: {
          id: char.id,
          name: char.name,
          tags: char.tags,
          slogan: char.slogan,
          locked: true,
          lockQuestion: char.lockQuestion,
          lockHint: char.lockHint,
          floralSymbol: char.floralSymbol,
          accentColor: char.accentColor,
          createdAt: char.createdAt,
          updatedAt: char.updatedAt,
        },
      });
    }

    return NextResponse.json({ success: true, char });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải char' }, { status: 500 });
  }
}

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
    const body = await req.json();

    if (body.tags && !Array.isArray(body.tags) && typeof body.tags === 'string') {
      body.tags = body.tags
        .split(/[\s,]+/)
        .map((t: string) => t.trim())
        .filter(Boolean)
        .map((t: string) => (t.startsWith('#') ? t : `#${t}`));
    }

    const updated = db.updateChar(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy char để cập nhật' }, { status: 404 });
    }

    return NextResponse.json({ success: true, char: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi cập nhật char' }, { status: 500 });
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
    const deleted = db.deleteChar(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy char' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa char thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi xóa char' }, { status: 500 });
  }
}
