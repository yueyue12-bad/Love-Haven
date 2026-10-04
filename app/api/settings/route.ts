import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const fullSettings = db.getSettings();

    // If admin, return all including password
    if (authHeader === `Bearer ${fullSettings.adminPass}`) {
      return NextResponse.json({ success: true, settings: fullSettings });
    }

    // For public visitors, hide adminPass
    const publicSettings = {
      siteName: fullSettings.siteName,
      slogan: fullSettings.slogan,
      aboutText: fullSettings.aboutText,
      youtubeUrl: fullSettings.youtubeUrl,
      musicEnabled: fullSettings.musicEnabled,
      musicVolume: fullSettings.musicVolume,
      activeTheme: fullSettings.activeTheme,
      fallingLeavesSpeed: fullSettings.fallingLeavesSpeed,
      butterfliesEnabled: fullSettings.butterfliesEnabled,
      petalsEnabled: fullSettings.petalsEnabled,
    };

    return NextResponse.json({ success: true, settings: publicSettings });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải cấu hình website' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const settings = db.getSettings();
    if (authHeader !== `Bearer ${settings.adminPass}`) {
      return NextResponse.json({ success: false, message: 'Bạn không có quyền' }, { status: 401 });
    }

    const body = await req.json();
    const updated = db.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi cập nhật cấu hình' }, { status: 500 });
  }
}
