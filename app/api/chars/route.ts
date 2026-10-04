import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PublicCharView, Char } from '@/types';

// Helper to mask sensitive fields for public view
function toPublicChar(c: Char): PublicCharView {
  if (c.locked) {
    return {
      id: c.id,
      name: c.name,
      tags: c.tags,
      slogan: c.slogan,
      locked: true,
      lockQuestion: c.lockQuestion,
      lockHint: c.lockHint,
      floralSymbol: c.floralSymbol,
      accentColor: c.accentColor,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }
  return {
    id: c.id,
    name: c.name,
    tags: c.tags,
    slogan: c.slogan,
    locked: false,
    floralSymbol: c.floralSymbol,
    accentColor: c.accentColor,
    backstory: c.backstory,
    firstMessage: c.firstMessage,
    googleAIStudioURL: c.googleAIStudioURL,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();

    // If requesting full admin view, verify admin pass
    if (isAdmin && authHeader === `Bearer ${settings.adminPass}`) {
      const allChars = db.getChars();
      return NextResponse.json({ success: true, chars: allChars });
    }

    // Public view
    const allChars = db.getChars();
    const publicChars = allChars.map(toPublicChar);
    return NextResponse.json({ success: true, chars: publicChars });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải danh sách char' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();
    if (authHeader !== `Bearer ${settings.adminPass}`) {
      return NextResponse.json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      tags,
      slogan,
      backstory,
      firstMessage,
      googleAIStudioURL,
      locked,
      lockQuestion,
      lockHint,
      lockPass,
      floralSymbol,
      accentColor,
    } = body;

    if (!name || !slogan || !backstory || !firstMessage) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' }, { status: 400 });
    }

    const created = db.createChar({
      name,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : []),
      slogan,
      backstory,
      firstMessage,
      googleAIStudioURL: googleAIStudioURL || 'https://aistudio.google.com/',
      locked: Boolean(locked),
      lockQuestion: locked ? (lockQuestion || 'Mật mã mở khóa nhân vật?') : '',
      lockHint: locked ? (lockHint || '') : '',
      lockPass: locked ? (lockPass || 'love') : '',
      floralSymbol: floralSymbol || '🌸',
      accentColor: accentColor || 'sakura',
    });

    return NextResponse.json({ success: true, char: created });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tạo char mới' }, { status: 500 });
  }
}
