'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Feather, BookOpen, Send, Compass } from 'lucide-react';

interface HeroSectionProps {
  siteName: string;
  slogan: string;
  onExploreChars: () => void;
  onOpenMailbox: () => void;
}

const FLOWERS_OF_DAY = [
  { name: 'Hoa Anh Đào (Sakura)', symbol: '🌸', meaning: 'Sự khởi đầu thanh khiết và những lời hứa dịu êm' },
  { name: 'Hoa Hồng Trắng (White Rose)', symbol: '🌹', meaning: 'Tình yêu thuần khiết và nỗi nhớ thầm kín' },
  { name: 'Hoa Oải Hương (Lavender)', symbol: '🪻', meaning: 'Sự bình yên và lòng thủy chung son sắt' },
  { name: 'Hoa Cúc Họa Mi (Daisy)', symbol: '🌼', meaning: 'Niềm vui trong trẻo và trái tim chân thành' },
  { name: 'Hoa Sen Tuyết (Lotus)', symbol: '🪷', meaning: 'Vẻ đẹp thanh tao thoát tục giữa thế gian' },
];

export default function HeroSection({
  siteName = 'LOVE HAVEN',
  slogan,
  onExploreChars,
  onOpenMailbox,
}: HeroSectionProps) {
  const [flowerOfDay, setFlowerOfDay] = useState(FLOWERS_OF_DAY[0]);

  useEffect(() => {
    // Pick random flower per load
    const rand = Math.floor(Math.random() * FLOWERS_OF_DAY.length);
    setFlowerOfDay(FLOWERS_OF_DAY[rand]);
  }, []);

  return (
    <section className="relative pt-6 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200/80 shadow-xs mb-6 text-xs text-[#6e4e5e]"
        >
          <span className="text-sm animate-pulse">{flowerOfDay.symbol}</span>
          <span className="font-medium">Đóa hoa hôm nay: {flowerOfDay.name}</span>
          <span className="text-rose-300">✦</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-serif font-bold text-[#4c2d3c] tracking-wider mb-4 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {siteName}
        </motion.h1>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg sm:text-2xl font-serif italic text-[#705261] mb-6 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          「 {slogan} 」
        </motion.p>

        {/* Story Intro description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm sm:text-base text-[#806774] max-w-xl mx-auto mb-8 leading-relaxed font-sans"
        >
          Một không gian lưu giữ những cốt truyện AI đặc sắc, nơi mỗi nhân vật đều mang một mảnh tâm tư riêng. Hãy mở từng phong bao, giải những mật mã bí ẩn và trò chuyện cùng họ qua Google AI Studio.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={onExploreChars}
            className="px-6 py-3 rounded-full text-sm sm:text-base font-semibold text-[#4e2d3b] bg-gradient-to-r from-pink-100 via-rose-100 to-pink-200 border border-pink-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>🌸</span>
            <span>Khám phá Nhân Vật</span>
            <Sparkles className="w-4 h-4 text-rose-400" />
          </button>

          <button
            onClick={onOpenMailbox}
            className="px-6 py-3 rounded-full text-sm sm:text-base font-semibold text-[#5a3e4c] bg-white/80 hover:bg-white border border-pink-200 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>💌</span>
            <span>Gửi Thư Vườn Hoa</span>
          </button>
        </motion.div>

        {/* Flower meaning snippet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 p-4 max-w-lg mx-auto rounded-2xl pastel-glass border border-pink-100/90 text-xs text-[#7e6672] flex items-center justify-center gap-3"
        >
          <span className="text-xl">🦋</span>
          <span className="italic font-serif">
            "{flowerOfDay.meaning}"
          </span>
          <span className="text-xl">🌿</span>
        </motion.div>

      </div>
    </section>
  );
}
