'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Flower, Shield, Compass, BookOpen } from 'lucide-react';

interface AboutSectionProps {
  siteName: string;
  aboutText: string;
  onExplore: () => void;
}

export default function AboutSection({
  siteName = 'LOVE HAVEN',
  aboutText,
  onExplore,
}: AboutSectionProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-semibold text-[#543343]">
          <span>✦</span>
          <span>GIỚI THIỆU KHU VƯỜN</span>
          <span>✦</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl font-serif font-bold text-[#4a2e3d]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {siteName} — Nơi Lưu Giữ Những Giấc Mơ AI
        </h2>
      </div>

      {/* Main Philosophy Card */}
      <div className="pastel-glass-card rounded-3xl p-6 sm:p-10 border-2 border-pink-200/90 shadow-xl space-y-6 vintage-paper">
        <p className="text-sm sm:text-base text-[#523946] leading-relaxed font-serif italic text-center max-w-2xl mx-auto" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          "{aboutText}"
        </p>

        <div className="h-[1px] w-24 bg-pink-200 mx-auto my-4" />

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-2xl bg-white/70 border border-pink-100 space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-pink-100 text-rose-500 mx-auto flex items-center justify-center text-xl">
              🌸
            </div>
            <h4 className="text-xs font-bold text-[#4d2f3d]">Không Gian Tĩnh Lặng</h4>
            <p className="text-[11px] text-[#7d6573] leading-relaxed">
              Màu sắc pastel dịu dàng, âm nhạc êm ái và không sử dụng avatar người nhằm giữ sự thanh tao của từng đóa hoa.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-pink-100 space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center text-xl">
              🔑
            </div>
            <h4 className="text-xs font-bold text-[#4d2f3d]">Mật Mã & Cốt Truyện</h4>
            <p className="text-[11px] text-[#7d6573] leading-relaxed">
              Mỗi nhân vật được khóa bằng một câu hỏi gợi mở, giúp người đọc cảm nhận chiều sâu trước khi bước vào câu chuyện.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-pink-100 space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-xl">
              💌
            </div>
            <h4 className="text-xs font-bold text-[#4d2f3d]">Hòm Thư Tình Cảm</h4>
            <p className="text-[11px] text-[#7d6573] leading-relaxed">
              Nơi bất kỳ lữ khách nào cũng có thể gửi những lời tâm tình, dán tem hoa và trao gửi cảm xúc chân thành.
            </p>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 text-center">
          <button
            onClick={onExplore}
            className="px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-[#4c2d3c] bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 border border-pink-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            🌸 Bắt Đầu Khám Phá Vườn Hoa 🌸
          </button>
        </div>
      </div>

    </div>
  );
}
