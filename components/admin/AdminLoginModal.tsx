'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Key, ShieldCheck, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Vui lòng nhập mật mã quản lý.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pass: password }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        onLoginSuccess(data.token);
        setPassword('');
      } else {
        setErrorMessage(data.message || 'Mật mã không chính xác.');
      }
    } catch (err) {
      setErrorMessage('Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#3a2530]/40 backdrop-blur-xs"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative max-w-md w-full pastel-glass-card rounded-3xl border-2 border-pink-200 shadow-2xl p-6 sm:p-8 z-10 vintage-paper"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-pink-100 text-[#7a5c6d] hover:text-[#4a2b3b] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ornament */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-200 border border-pink-300 mx-auto flex items-center justify-center text-2xl shadow-xs">
            🌸
          </div>

          <h2
            className="text-2xl font-serif font-bold text-[#4e2e3d]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            🌸 KHU VỰC QUẢN LÝ 🌸
          </h2>

          <p className="text-xs text-[#806775]">
            Đăng nhập để quản lý danh sách Char, hòm thư và cấu hình vườn hoa.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#543644] block">
              Mật mã quản lý:
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Nhập mật mã quản lý..."
                className="w-full px-4 py-3 rounded-2xl bg-white border border-pink-200 text-sm text-[#4c2d3b] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 shadow-inner"
              />
              <Key className="w-4 h-4 text-pink-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-600 font-medium text-center"
            >
              {errorMessage}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl font-bold text-sm text-[#4c2d3c] bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 border border-pink-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Đang xác thực...' : 'ENTER'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
