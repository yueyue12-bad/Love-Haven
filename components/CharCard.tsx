'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Sparkles, ArrowRight, Bookmark } from 'lucide-react';
import { PublicCharView } from '@/types';

interface CharCardProps {
  char: PublicCharView;
  onSelect: (char: PublicCharView) => void;
  onTagClick?: (tag: string) => void;
  isUnlockedInSession?: boolean;
}

export default function CharCard({
  char,
  onSelect,
  onTagClick,
  isUnlockedInSession = false,
}: CharCardProps) {
  const isLocked = char.locked && !isUnlockedInSession;

  // Background gradient based on theme
  const getEmblemGradient = (color?: string) => {
    switch (color) {
      case 'rose':
        return 'from-rose-100 to-pink-200 border-rose-300 text-rose-600';
      case 'lavender':
        return 'from-purple-100 to-indigo-100 border-purple-200 text-purple-600';
      case 'daisy':
        return 'from-amber-100 to-yellow-100 border-amber-200 text-amber-600';
      case 'sage':
        return 'from-emerald-100 to-teal-100 border-emerald-200 text-emerald-600';
      case 'peach':
        return 'from-orange-100 to-rose-100 border-orange-200 text-orange-600';
      case 'sakura':
      default:
        return 'from-pink-100 to-rose-100 border-pink-200 text-pink-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="pastel-glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group border border-pink-200/80"
    >
      {/* Delicate corner ribbon accent */}
      <div className="absolute -top-6 -right-6 w-14 h-14 bg-gradient-to-br from-pink-200/60 to-rose-200/60 rounded-full blur-xs pointer-events-none" />

      <div>
        {/* Header with Botanical Emblem and Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          
          {/* Flower Seal / Emblem (NO human avatar) */}
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${getEmblemGradient(
                char.accentColor
              )} border flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform duration-300`}
            >
              <span>{char.floralSymbol || '🌸'}</span>
            </div>

            <div>
              <h3
                className="font-serif font-bold text-lg sm:text-xl text-[#4a2e3b] tracking-wide group-hover:text-rose-700 transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {char.name}
              </h3>
              <p className="text-[11px] text-[#937b88] flex items-center gap-1">
                <span>Vườn hoa AI</span>
                <span>•</span>
                <span>{new Date(char.createdAt).toLocaleDateString('vi-VN')}</span>
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 border shadow-2xs ${
              isLocked
                ? 'bg-amber-50/90 text-amber-800 border-amber-200'
                : 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Đã khóa</span>
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 text-emerald-600" />
                <span>Mở</span>
              </>
            )}
          </div>
        </div>

        {/* Slogan */}
        <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100/80 mb-4">
          <p
            className="text-xs sm:text-sm font-serif italic text-[#634552] line-clamp-2 leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            "{char.slogan}"
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {char.tags.map((tag, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(tag);
              }}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/80 hover:bg-pink-100 text-[#735564] border border-pink-200/60 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Card Action */}
      <div className="pt-3 border-t border-pink-100/80 flex items-center justify-between">
        <span className="text-[11px] text-[#99818e] italic">
          {isLocked ? 'Cần mật mã mở khóa 🔑' : 'Sẵn sàng tương tác ✦'}
        </span>

        <button
          onClick={() => onSelect(char)}
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#543343] bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 border border-pink-300 shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isLocked ? 'Giải Khóa' : 'Xem Char'}</span>
          <ArrowRight className="w-3 h-3 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
