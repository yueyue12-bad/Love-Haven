'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Feather } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
  siteName?: string;
  slogan?: string;
}

export default function IntroScreen({
  onEnter,
  siteName = 'LOVE HAVEN',
  slogan = 'Một khu vườn nhỏ dành cho những câu chuyện chưa kể...',
}: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#fcf9f5] px-4 overflow-hidden"
    >
      {/* Background soft ambient orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-rose-100/40 rounded-full blur-3xl" />

      {/* Floating gentle decorations */}
      <div className="absolute top-12 left-12 text-3xl opacity-60 animate-bounce" style={{ animationDuration: '4s' }}>
        🌸
      </div>
      <div className="absolute top-20 right-16 text-3xl opacity-60 animate-bounce" style={{ animationDuration: '5s' }}>
        🦋
      </div>
      <div className="absolute bottom-16 left-20 text-3xl opacity-60 animate-bounce" style={{ animationDuration: '4.5s' }}>
        🌿
      </div>
      <div className="absolute bottom-20 right-20 text-3xl opacity-60 animate-bounce" style={{ animationDuration: '5.5s' }}>
        🎀
      </div>

      {/* Main vintage letter invitation card */}
      <motion.div
        initial={{ y: 25, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative max-w-lg w-full text-center p-8 sm:p-12 rounded-3xl pastel-glass-card border-2 border-pink-200/80 shadow-2xl vintage-paper"
      >
        {/* Top ribbon ornament */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <span className="text-xl text-rose-300">✦</span>
          <div className="h-[1px] w-12 bg-pink-200" />
          <span className="text-2xl">🎀</span>
          <div className="h-[1px] w-12 bg-pink-200" />
          <span className="text-xl text-rose-300">✦</span>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl sm:text-4xl font-serif tracking-widest text-[#5c3d4e] font-semibold mb-3 uppercase"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {siteName}
        </motion.h1>

        {/* Poetic description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-sm sm:text-base text-[#826a76] italic font-serif mb-8 max-w-sm mx-auto leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          「{slogan}」
        </motion.p>

        {/* Central Entrance Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base sm:text-lg font-medium text-[#5c3a4a] bg-gradient-to-r from-pink-100 via-rose-100 to-purple-100 border border-pink-300/80 shadow-md hover:shadow-xl hover:border-pink-400 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Soft glimmer on hover */}
            <span className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <span className="relative z-10 text-xl group-hover:rotate-12 transition-transform duration-300">
              🎀
            </span>
            <span className="relative z-10 font-serif tracking-wider font-semibold">
              GỬI THƯ
            </span>
            <span className="relative z-10 text-xl group-hover:-rotate-12 transition-transform duration-300">
              🦋
            </span>
          </button>
        </motion.div>

        {/* Micro hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-xs text-[#a08b96] flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Nhấp để bước vào khu vườn yên tĩnh</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '8s' }} />
        </motion.div>

        {/* Vintage corner accents */}
        <div className="absolute top-3 left-3 text-xs text-pink-300">❦</div>
        <div className="absolute top-3 right-3 text-xs text-pink-300">❧</div>
        <div className="absolute bottom-3 left-3 text-xs text-pink-300">❧</div>
        <div className="absolute bottom-3 right-3 text-xs text-pink-300">❦</div>
      </motion.div>
    </motion.div>
  );
}
