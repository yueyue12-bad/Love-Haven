import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();

    // If admin is reading, return all letters with full content
    if (authHeader === `Bearer ${settings.adminPass}`) {
      const letters = db.getLetters();
      return NextResponse.json({ success: true, letters });
    }

    // If public user is reading, return recent letters with preview
    const letters = db.getLetters().map((l) => ({
      id: l.id,
      recipientName: l.recipientName,
      senderName: l.senderName || 'Lữ khách vô danh',
      title: l.title,
      stamp: l.stamp,
      status: l.status,
      createdAt: l.createdAt,
    }));
    return NextResponse.json({ success: true, letters });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải danh sách thư' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientId, recipientName, senderName, title, content, stamp } = body;

    if (!recipientId || !recipientName || !title || !content) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đủ thông tin thư' }, { status: 400 });
    }

    const created = db.createLetter({
      recipientId,
      recipientName,
      senderName: senderName || 'Lữ khách qua đường',
      title,
      content,
      stamp: stamp || '🌸',
    });

    return NextResponse.json({ success: true, letter: created });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi gửi thư' }, { status: 500 });
  }
}
