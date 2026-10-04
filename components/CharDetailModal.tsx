'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Unlock, Copy, Check, ExternalLink, HelpCircle, Key, Sparkles, Heart } from 'lucide-react';
import { PublicCharView } from '@/types';

interface CharDetailModalProps {
  char: PublicCharView | null;
  onClose: () => void;
  onUnlockSuccess: (charId: string, plotData: { backstory: string; firstMessage: string; googleAIStudioURL: string }) => void;
  unlockedData?: {
    backstory: string;
    firstMessage: string;
    googleAIStudioURL: string;
  } | null;
}

export default function CharDetailModal({
  char,
  onClose,
  onUnlockSuccess,
  unlockedData,
}: CharDetailModalProps) {
  const [passInput, setPassInput] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [copiedFirstMsg, setCopiedFirstMsg] = useState(false);
  const [copiedBackstory, setCopiedBackstory] = useState(false);

  if (!char) return null;

  const isActuallyUnlocked = !char.locked || Boolean(unlockedData) || Boolean(char.backstory);

  const activeBackstory = unlockedData?.backstory || char.backstory;
  const activeFirstMessage = unlockedData?.firstMessage || char.firstMessage;
  const activeGoogleUrl = unlockedData?.googleAIStudioURL || char.googleAIStudioURL || 'https://aistudio.google.com/';

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passInput.trim()) {
      setErrorMessage('Vui lòng nhập mật mã mở khóa.');
      return;
    }

    setIsUnlocking(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/chars/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charId: char.id, pass: passInput.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        onUnlockSuccess(char.id, {
          backstory: data.backstory,
          firstMessage: data.firstMessage,
          googleAIStudioURL: data.googleAIStudioURL,
        });
      } else {
        setErrorMessage(data.message || '🦋 Có vẻ như chìa khóa chưa đúng...');
      }
    } catch (err) {
      setErrorMessage('Có lỗi xảy ra khi kết nối máy chủ.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const copyToClipboard = (text: string, type: 'first' | 'backstory') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'first') {
      setCopiedFirstMsg(true);
      setTimeout(() => setCopiedFirstMsg(false), 2000);
    } else {
      setCopiedBackstory(true);
      setTimeout(() => setCopiedBackstory(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#402b37]/30 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-2xl w-full max-h-[90vh] flex flex-col pastel-glass-card rounded-3xl border-2 border-pink-200/90 shadow-2xl overflow-hidden vintage-paper z-10 my-auto"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-pink-100/80 flex items-start justify-between gap-4 bg-white/70">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-200 border border-pink-300 flex items-center justify-center text-2xl shadow-xs">
                {char.floralSymbol || '🌸'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="text-xl sm:text-2xl font-serif font-bold text-[#4c2d3b]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {char.name}
                  </h2>
                  <span className="text-xs text-rose-400">🎀</span>
                </div>
                <p className="text-xs font-serif italic text-[#7c6370]">
                  "{char.slogan}"
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-pink-100/70 text-[#7a5c6d] hover:text-[#4a2b3b] transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {char.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-pink-100/80 text-[#694b59] border border-pink-200/70"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* UNLOCKED VIEW */}
            {isActuallyUnlocked ? (
              <div className="space-y-6">
                
                {/* Backstory */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#543442] flex items-center gap-1.5 uppercase tracking-wider">
                      <span>📜</span>
                      <span>Backstory / Cốt truyện</span>
                    </h3>
                    <button
                      onClick={() => copyToClipboard(activeBackstory || '', 'backstory')}
                      className="text-xs text-[#7e6270] hover:text-[#4e2b3b] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-pink-100/60 transition-colors cursor-pointer"
                    >
                      {copiedBackstory ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/70 border border-pink-200/70 text-sm text-[#4c3742] leading-relaxed whitespace-pre-line shadow-xs">
                    {activeBackstory || 'Chưa có thông tin cốt truyện.'}
                  </div>
                </div>

                {/* First Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#543442] flex items-center gap-1.5 uppercase tracking-wider">
                      <span>💬</span>
                      <span>First Message / Lời chào đầu</span>
                    </h3>
                    <button
                      onClick={() => copyToClipboard(activeFirstMessage || '', 'first')}
                      className="text-xs text-[#7e6270] hover:text-[#4e2b3b] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-pink-100/60 transition-colors cursor-pointer"
                    >
                      {copiedFirstMsg ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/80 to-rose-50/50 border border-pink-200 text-sm text-[#4a3440] leading-relaxed whitespace-pre-line italic font-serif shadow-xs" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {activeFirstMessage || 'Chưa có lời chào đầu.'}
                  </div>
                </div>

                {/* Google Studio AI Link CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-purple-100 border border-pink-300">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold text-[#523342]">
                      Trò chuyện trực tiếp cùng {char.name}
                    </p>
                    <p className="text-[11px] text-[#7d6370]">
                      Mở phiên làm việc tại Google AI Studio
                    </p>
                  </div>

                  <a
                    href={activeGoogleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-[#4a2c3a] bg-white/90 hover:bg-white border border-pink-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>✦ Mở GG AI ✦</span>
                    <ExternalLink className="w-4 h-4 text-rose-500" />
                  </a>
                </div>

              </div>
            ) : (
              /* LOCKED VIEW */
              <div className="py-6 px-4 text-center space-y-6">
                
                {/* Lock icon with blooming petals */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center shadow-inner">
                    <Lock className="w-8 h-8 text-rose-500 animate-pulse" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xl">🌸</span>
                  <span className="absolute -bottom-2 -left-2 text-xl">🦋</span>
                </div>

                <div>
                  <h3
                    className="text-xl sm:text-2xl font-serif font-bold text-[#503140] mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    🌸 Một cánh cửa đang được khóa...
                  </h3>
                  <p className="text-xs text-[#806775] max-w-md mx-auto">
                    Nhân vật này được cất giữ cẩn thận trong ngăn kéo bí mật. Hãy trả lời câu hỏi dưới đây để mở khóa toàn bộ cốt truyện và lời mở đầu.
                  </p>
                </div>

                {/* Question Box */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#543544]">
                    <span>❓</span>
                    <span>Câu hỏi của {char.name}:</span>
                  </div>
                  <p className="text-sm font-serif italic text-[#4a2e3c] pl-5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    "{char.lockQuestion || 'Mật mã mở khóa nhân vật?'}"
                  </p>

                  {/* Hint */}
                  {char.lockHint && (
                    <div className="pt-2 border-t border-pink-100">
                      {showHint ? (
                        <p className="text-xs text-rose-600 bg-rose-50/80 p-2 rounded-lg border border-rose-100 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>Gợi ý: {char.lockHint}</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowHint(true)}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Xem gợi ý bí mật</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Password Input Form */}
                <form onSubmit={handleUnlockSubmit} className="max-w-md mx-auto space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={passInput}
                      onChange={(e) => {
                        setPassInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Nhập pass để mở khóa..."
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-pink-200 text-sm text-[#4c2d3b] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 shadow-inner"
                    />
                    <Key className="w-4 h-4 text-pink-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-600 font-medium"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isUnlocking}
                    className="w-full py-3 rounded-2xl font-semibold text-sm text-[#4c2d3c] bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 border border-pink-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔑</span>
                    <span>{isUnlocking ? 'Đang kiểm tra chìa khóa...' : 'MỞ KHÓA'}</span>
                  </button>
                </form>

              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-5 sm:px-6 py-3 border-t border-pink-100 bg-white/50 flex items-center justify-between text-xs text-[#8c7481]">
            <span>LOVE HAVEN • Vườn AI Thơ Mộng</span>
            <button
              onClick={onClose}
              className="hover:text-[#4c2d3b] transition-colors cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
