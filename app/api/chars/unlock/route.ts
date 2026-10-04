import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { charId, pass } = await req.json();

    if (!charId || pass === undefined) {
      return NextResponse.json({ success: false, message: 'Thiếu thông tin mở khóa' }, { status: 400 });
    }

    const char = db.getCharById(charId);
    if (!char) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy nhân vật' }, { status: 404 });
    }

    if (!char.locked) {
      return NextResponse.json({
        success: true,
        backstory: char.backstory,
        firstMessage: char.firstMessage,
        googleAIStudioURL: char.googleAIStudioURL,
      });
    }

    const cleanInput = String(pass).trim().toLowerCase();
    const cleanPass = String(char.lockPass || '').trim().toLowerCase();

    // Check pass match
    if (cleanInput === cleanPass) {
      return NextResponse.json({
        success: true,
        backstory: char.backstory,
        firstMessage: char.firstMessage,
        googleAIStudioURL: char.googleAIStudioURL,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '🦋 Có vẻ như chìa khóa chưa đúng...',
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ khi mở khóa' }, { status: 500 });
  }
}
