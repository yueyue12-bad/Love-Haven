'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, CheckCircle, Clock, Heart, Sparkles, User, Feather, Flower2 } from 'lucide-react';
import { Recipient, Letter } from '@/types';

interface MailboxSectionProps {
  recipients: Recipient[];
  onLetterSent?: () => void;
}

const STAMPS = [
  { id: '🌸', name: 'Hoa Anh Đào', symbol: '🌸' },
  { id: '💌', name: 'Thư Tình', symbol: '💌' },
  { id: '🦋', name: 'Bướm Xanh', symbol: '🦋' },
  { id: '🎀', name: 'Nơ Lụa Hồng', symbol: '🎀' },
  { id: '🌿', name: 'Nhành Lá Xanh', symbol: '🌿' },
  { id: '🪻', name: 'Hoa Oải Hương', symbol: '🪻' },
];

export default function MailboxSection({
  recipients = [],
  onLetterSent,
}: MailboxSectionProps) {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [senderName, setSenderName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedStamp, setSelectedStamp] = useState('🌸');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');
  const [sentLetters, setSentLetters] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (recipients.length > 0 && !selectedRecipientId) {
      const firstAvailable = recipients.find((r) => r.status === 'available') || recipients[0];
      setSelectedRecipientId(firstAvailable.id);
    }
  }, [recipients, selectedRecipientId]);

  const fetchSentLetters = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/letters');
      const data = await res.json();
      if (data.success) {
        setSentLetters(data.letters || []);
      }
    } catch (e) {
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipientId || !title.trim() || !content.trim()) {
      setErrorMessage('Vui lòng điền đủ người nhận, tiêu đề và nội dung thư.');
      return;
    }

    const currentRec = recipients.find((r) => r.id === selectedRecipientId);
    if (!currentRec) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: currentRec.id,
          recipientName: currentRec.name,
          senderName: senderName.trim() || 'Lữ khách qua đường',
          title: title.trim(),
          content: content.trim(),
          stamp: selectedStamp,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
        setTitle('');
        setContent('');
        if (onLetterSent) onLetterSent();
      } else {
        setErrorMessage(data.message || 'Lỗi gửi thư.');
      }
    } catch (err) {
      setErrorMessage('Không thể kết nối đến hộp thư.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRecipient = recipients.find((r) => r.id === selectedRecipientId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-semibold text-[#543343]">
          <span>💌</span>
          <span>HỘP THƯ VƯỜN HOA</span>
          <span>🌸</span>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-serif font-bold text-[#482b3a]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Gửi Một Nhành Tâm Tư
        </h2>
        <p className="text-xs sm:text-sm text-[#7e6472] max-w-lg mx-auto">
          Những lá thư gửi gắm tâm tình, góp ý hoặc lời chào thân ái đến những người chăm sóc và các nhân vật trong khu vườn.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('write')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'write'
              ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-[#4c2d3c] shadow-xs scale-105'
              : 'bg-white/70 text-[#795d6d] hover:bg-pink-100/60'
          }`}
        >
          <span>✍️</span>
          <span>Viết Thư Mới</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('history');
            fetchSentLetters();
          }}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-pink-200 to-rose-200 text-[#4c2d3c] shadow-xs scale-105'
              : 'bg-white/70 text-[#795d6d] hover:bg-pink-100/60'
          }`}
        >
          <span>📮</span>
          <span>Hộp Thư Công Khai</span>
        </button>
      </div>

      {activeTab === 'write' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Recipient Picker Card */}
          <div className="md:col-span-1 pastel-glass-card rounded-3xl p-5 border border-pink-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-pink-100 pb-2">
              <span className="text-lg">🌿</span>
              <h3 className="text-sm font-bold text-[#4e2e3d]">Người Nhận Thư</h3>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {recipients.map((r) => {
                const isSelected = selectedRecipientId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRecipientId(r.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-100 to-rose-50 border-rose-300 shadow-xs'
                        : 'bg-white/60 hover:bg-pink-50/70 border-pink-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{r.symbol || '🌸'}</span>
                        <span className="text-xs font-bold text-[#4c2d3c]">
                          {r.name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          r.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : r.status === 'busy'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {r.status === 'available' ? 'Sẵn sàng' : r.status === 'busy' ? 'Bận rộn' : 'Nghỉ ngơi'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7d6573] line-clamp-2 italic">
                      {r.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Writing Desk */}
          <div className="md:col-span-2 pastel-glass-card rounded-3xl p-6 sm:p-8 border-2 border-pink-200/90 shadow-lg vintage-paper relative">
            
            {sentSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-pink-100 text-rose-500 mx-auto flex items-center justify-center text-3xl shadow-xs animate-bounce">
                  💌
                </div>
                <h3
                  className="text-2xl font-serif font-bold text-[#4d2f3d]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Lá Thư Đã Được Gửi Đi!
                </h3>
                <p className="text-xs sm:text-sm text-[#7d6472] max-w-sm mx-auto">
                  Cánh thư đã được niêm phong bằng sáp thơm và gửi đến hòm thư của {selectedRecipient?.name}.
                </p>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-[#4e2e3d] bg-pink-100 hover:bg-pink-200 border border-pink-300 transition-colors cursor-pointer"
                >
                  Viết thêm một lá thư khác 🌸
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                
                {/* Stamp & Wax Seal Picker */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-[#543644] block">
                      Tem Thư & Ấn Niêm Phong:
                    </span>
                    <span className="text-[11px] text-[#8e7482]">Chọn một biểu tượng gửi gắm</span>
                  </div>

                  <div className="flex gap-1.5">
                    {STAMPS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedStamp(s.id)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-base border transition-transform cursor-pointer ${
                          selectedStamp === s.id
                            ? 'bg-rose-100 border-rose-400 scale-110 shadow-xs'
                            : 'bg-white/70 border-pink-100 hover:bg-pink-50'
                        }`}
                        title={s.name}
                      >
                        {s.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sender Name & Title inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#543644] mb-1 block">
                      Tên người gửi (Tùy chọn):
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Lữ khách qua đường..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#543644] mb-1 block">
                      Tiêu đề bức thư: *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Gửi một đóa hoa..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="text-xs font-semibold text-[#543644] mb-1 block">
                    Nội dung tâm tư gửi đến {selectedRecipient?.name || 'người nhận'}: *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết những lời muốn nói tại đây..."
                    className="w-full p-4 rounded-2xl bg-white/90 border border-pink-200 text-xs sm:text-sm text-[#4c2f3d] focus:outline-none focus:border-rose-400 leading-relaxed shadow-inner"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-600 font-medium">
                    {errorMessage}
                  </p>
                )}

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-[#4a2b3b] bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 border border-pink-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-60 cursor-pointer flex items-center gap-2"
                  >
                    <span>{selectedStamp}</span>
                    <span>{isSubmitting ? 'Đang gửi thư...' : 'GỬI THƯ ĐI'}</span>
                    <Send className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>

              </form>
            )}

            {/* Decorative letter stamps */}
            <div className="absolute top-4 right-4 text-xs opacity-50 select-none">
              ✉️ 🌸
            </div>
          </div>

        </div>
      ) : (
        /* Sent Letters History */
        <div className="pastel-glass-card rounded-3xl p-6 border border-pink-200 space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <h3 className="text-sm font-bold text-[#4d2f3d] flex items-center gap-2">
              <span>📮</span>
              <span>Những lá thư đang bay trong vườn hoa</span>
            </h3>
            <span className="text-xs text-[#8a7280]">
              {sentLetters.length} bức thư
            </span>
          </div>

          {isLoadingHistory ? (
            <p className="text-center py-8 text-xs text-[#8c7482]">
              Đang mở hòm thư...
            </p>
          ) : sentLetters.length === 0 ? (
            <p className="text-center py-8 text-xs text-[#8c7482] italic">
              🌸 Chưa có bức thư nào trong hòm thư chung. Hãy là người đầu tiên gửi thư nhé!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {sentLetters.map((l) => (
                <div
                  key={l.id}
                  className="p-4 rounded-2xl bg-white/70 border border-pink-100 space-y-2 hover:border-pink-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg">{l.stamp || '🌸'}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        l.status === 'read'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-pink-50 text-pink-700 border border-pink-200'
                      }`}
                    >
                      {l.status === 'read' ? 'Đã nhận & đọc' : 'Đã chuyển đến hòm thư'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#4e2e3d] truncate">
                    {l.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-[#846b7a]">
                    <span>Gửi: {l.recipientName}</span>
                    <span>Từ: {l.senderName}</span>
                  </div>
                  <p className="text-[10px] text-[#a18a97] text-right">
                    {new Date(l.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
