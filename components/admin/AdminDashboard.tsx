'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X, Plus, Edit2, Trash2, Lock, Unlock, Settings, Mail,
  Sparkles, Save, LogOut, Download, Upload, Check, AlertCircle, RefreshCw, Eye
} from 'lucide-react';
import { Char, Recipient, Letter, SiteSettings, FloralSymbol, PastelPalette } from '@/types';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onRefreshData: () => void;
}

const FLORAL_SYMBOLS: FloralSymbol[] = ['🌸', '🌹', '🪻', '🌼', '🪷', '🦋', '🌿', '🎀', '✨'];
const PALETTES: PastelPalette[] = ['sakura', 'rose', 'lavender', 'daisy', 'sage', 'peach'];

export default function AdminDashboard({
  token,
  onLogout,
  onRefreshData,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'chars' | 'mailbox' | 'settings'>('chars');

  // Data states
  const [chars, setChars] = useState<Char[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Notification / Feedback
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Char Form State
  const [isEditingChar, setIsEditingChar] = useState<boolean>(false);
  const [editingCharId, setEditingCharId] = useState<string | null>(null);
  const [charForm, setCharForm] = useState({
    name: '',
    tags: '',
    slogan: '',
    backstory: '',
    firstMessage: '',
    googleAIStudioURL: 'https://aistudio.google.com/',
    locked: false,
    lockQuestion: '',
    lockHint: '',
    lockPass: '',
    floralSymbol: '🌸' as FloralSymbol,
    accentColor: 'sakura' as PastelPalette,
  });

  // Recipient Form State
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [recipientForm, setRecipientForm] = useState({
    name: '',
    description: '',
    status: 'available' as 'available' | 'busy' | 'resting',
    symbol: '🌸' as FloralSymbol,
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [newAdminPass, setNewAdminPass] = useState('');

  // Backup Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  // Selected Letter Preview Modal
  const [previewLetter, setPreviewLetter] = useState<Letter | null>(null);

  // Fetch initial admin data
  const fetchAllAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch full chars
      const resChars = await fetch('/api/chars?admin=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataChars = await resChars.json();
      if (dataChars.success) setChars(dataChars.chars || []);

      // 2. Fetch recipients
      const resRec = await fetch('/api/recipients');
      const dataRec = await resRec.json();
      if (dataRec.success) setRecipients(dataRec.recipients || []);

      // 3. Fetch full letters
      const resLet = await fetch('/api/letters', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataLet = await resLet.json();
      if (dataLet.success) setLetters(dataLet.letters || []);

      // 4. Fetch full settings
      const resSet = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataSet = await resSet.json();
      if (dataSet.success) {
        setSettings(dataSet.settings);
        setSettingsForm(dataSet.settings);
      }
    } catch (e) {
      showToast('error', 'Lỗi tải dữ liệu quản trị.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, [token]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // --- CHAR ACTIONS ---
  const handleOpenNewCharForm = () => {
    setIsEditingChar(true);
    setEditingCharId(null);
    setCharForm({
      name: '',
      tags: '#Boylove, #CổTrang',
      slogan: '',
      backstory: '',
      firstMessage: '',
      googleAIStudioURL: 'https://aistudio.google.com/',
      locked: false,
      lockQuestion: '',
      lockHint: '',
      lockPass: '',
      floralSymbol: '🌸',
      accentColor: 'sakura',
    });
  };

  const handleEditChar = (c: Char) => {
    setIsEditingChar(true);
    setEditingCharId(c.id);
    setCharForm({
      name: c.name,
      tags: Array.isArray(c.tags) ? c.tags.join(', ') : '',
      slogan: c.slogan,
      backstory: c.backstory,
      firstMessage: c.firstMessage,
      googleAIStudioURL: c.googleAIStudioURL || 'https://aistudio.google.com/',
      locked: c.locked,
      lockQuestion: c.lockQuestion || '',
      lockHint: c.lockHint || '',
      lockPass: c.lockPass || '',
      floralSymbol: c.floralSymbol || '🌸',
      accentColor: c.accentColor || 'sakura',
    });
  };

  const handleSaveChar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charForm.name || !charForm.slogan || !charForm.backstory || !charForm.firstMessage) {
      showToast('error', 'Vui lòng điền đủ các mục bắt buộc.');
      return;
    }

    try {
      const url = editingCharId ? `/api/chars/${editingCharId}` : '/api/chars';
      const method = editingCharId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(charForm),
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', editingCharId ? 'Đã cập nhật Char!' : 'Đã thêm Char mới vào vườn!');
        setIsEditingChar(false);
        fetchAllAdminData();
        onRefreshData();
      } else {
        showToast('error', data.message || 'Lỗi lưu Char.');
      }
    } catch (err) {
      showToast('error', 'Lỗi kết nối máy chủ.');
    }
  };

  const handleDeleteChar = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân vật này khỏi vườn hoa?')) return;
    try {
      const res = await fetch(`/api/chars/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Đã xóa Char.');
        fetchAllAdminData();
        onRefreshData();
      } else {
        showToast('error', data.message || 'Lỗi xóa Char.');
      }
    } catch (e) {
      showToast('error', 'Lỗi xóa Char.');
    }
  };

  const handleToggleLock = async (c: Char) => {
    try {
      const res = await fetch(`/api/chars/${c.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ locked: !c.locked }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', !c.locked ? 'Đã khóa Char' : 'Đã mở khóa Char');
        fetchAllAdminData();
        onRefreshData();
      }
    } catch (e) {
      showToast('error', 'Lỗi cập nhật trạng thái khóa.');
    }
  };

  // --- RECIPIENT ACTIONS ---
  const handleSaveRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientForm.name || !recipientForm.description) {
      showToast('error', 'Vui lòng nhập tên và mô tả người nhận.');
      return;
    }
    try {
      const res = await fetch('/api/recipients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipientForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Đã thêm người nhận thư mới!');
        setShowAddRecipient(false);
        setRecipientForm({ name: '', description: '', status: 'available', symbol: '🌸' });
        fetchAllAdminData();
        onRefreshData();
      }
    } catch (e) {
      showToast('error', 'Lỗi thêm người nhận.');
    }
  };

  const handleDeleteRecipient = async (id: string) => {
    if (!confirm('Xóa người nhận này?')) return;
    try {
      const res = await fetch(`/api/recipients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Đã xóa người nhận.');
        fetchAllAdminData();
        onRefreshData();
      }
    } catch (e) {
      showToast('error', 'Lỗi xóa.');
    }
  };

  // --- LETTER ACTIONS ---
  const handleMarkLetterRead = async (id: string) => {
    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Đã đánh dấu đã đọc!');
        fetchAllAdminData();
      }
    } catch (e) {
      showToast('error', 'Lỗi cập nhật.');
    }
  };

  const handleDeleteLetter = async (id: string) => {
    if (!confirm('Xóa lá thư này?')) return;
    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Đã xóa lá thư.');
        if (previewLetter?.id === id) setPreviewLetter(null);
        fetchAllAdminData();
      }
    } catch (e) {
      showToast('error', 'Lỗi xóa thư.');
    }
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    const payload: any = { ...settingsForm };
    if (newAdminPass.trim()) {
      payload.adminPass = newAdminPass.trim();
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Đã lưu cấu hình website thành công!');
        setSettings(data.settings);
        setSettingsForm(data.settings);
        setNewAdminPass('');
        onRefreshData();
      }
    } catch (e) {
      showToast('error', 'Lỗi cập nhật cấu hình.');
    }
  };

  // --- BACKUP ACTIONS ---
  const handleExportBackup = async () => {
    try {
      const res = await fetch('/api/backup', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const jsonStr = JSON.stringify(data.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `love_haven_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('success', 'Đã tải xuống file sao lưu JSON!');
      }
    } catch (e) {
      showToast('error', 'Lỗi xuất sao lưu.');
    }
  };

  const handleImportBackup = async () => {
    if (!importJsonText.trim()) {
      showToast('error', 'Vui lòng dán chuỗi JSON hợp lệ.');
      return;
    }
    try {
      const parsed = JSON.parse(importJsonText);
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: parsed }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Khôi phục dữ liệu thành công!');
        setShowImportBox(false);
        setImportJsonText('');
        fetchAllAdminData();
        onRefreshData();
      }
    } catch (e) {
      showToast('error', 'JSON không hợp lệ hoặc lỗi máy chủ.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Toast Alert */}
      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between border shadow-md ${
            statusMsg.type === 'success'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-rose-100 text-rose-900 border-rose-300'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Header bar */}
      <div className="pastel-glass rounded-3xl p-5 border border-pink-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-200 to-rose-300 flex items-center justify-center text-xl shadow-xs">
            ⚙️
          </div>
          <div>
            <h2
              className="text-xl font-serif font-bold text-[#4e2e3d]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Bảng Điều Khiển Quản Trị
            </h2>
            <p className="text-xs text-[#8c7380]">
              Quản lý Char, đọc thư tình và tinh chỉnh khu vườn
            </p>
          </div>
        </div>

        {/* Action Tabs & Logout */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('chars')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chars'
                ? 'bg-pink-200 text-[#4c2d3c] shadow-xs'
                : 'bg-white/70 text-[#7a5d6e] hover:bg-pink-100'
            }`}
          >
            <span>🌸</span>
            <span>Quản Lý Char ({chars.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mailbox')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mailbox'
                ? 'bg-pink-200 text-[#4c2d3c] shadow-xs'
                : 'bg-white/70 text-[#7a5d6e] hover:bg-pink-100'
            }`}
          >
            <span>💌</span>
            <span>Hộp Thư ({letters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-pink-200 text-[#4c2d3c] shadow-xs'
                : 'bg-white/70 text-[#7a5d6e] hover:bg-pink-100'
            }`}
          >
            <span>⚙️</span>
            <span>Cài Đặt Website</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-100/70 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
            title="Đăng xuất quản trị"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* TAB 1: QUẢN LÝ CHAR */}
      {activeTab === 'chars' && (
        <div className="space-y-6">
          
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#4d2f3d] flex items-center gap-2">
              <span>🌸</span>
              <span>Danh Sách Nhân Vật AI ({chars.length})</span>
            </h3>

            {!isEditingChar && (
              <button
                onClick={handleOpenNewCharForm}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-[#4a2b3b] bg-gradient-to-r from-pink-200 to-rose-200 hover:scale-105 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Char Mới</span>
              </button>
            )}
          </div>

          {/* Form Create / Edit Char */}
          {isEditingChar ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pastel-glass-card rounded-3xl p-6 sm:p-8 border-2 border-pink-200 space-y-6 vintage-paper"
            >
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <h4 className="text-base font-bold text-[#4e2e3d] flex items-center gap-2">
                  <span>{editingCharId ? '✏️ Sửa Nhân Vật' : '🌸 Thêm Nhân Vật Mới'}</span>
                </h4>
                <button
                  onClick={() => setIsEditingChar(false)}
                  className="p-1.5 rounded-full hover:bg-pink-100 text-[#7a5c6d]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveChar} className="space-y-4">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1">
                      Tên Char: *
                    </label>
                    <input
                      type="text"
                      required
                      value={charForm.name}
                      onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                      placeholder="Ví dụ: Tạ Thư Nhược"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1">
                      Tag (cách nhau bằng dấu phẩy):
                    </label>
                    <input
                      type="text"
                      value={charForm.tags}
                      onChange={(e) => setCharForm({ ...charForm, tags: e.target.value })}
                      placeholder="#Boylove, #CổTrang, #ChiếmHữu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                {/* Slogan */}
                <div>
                  <label className="text-xs font-semibold text-[#543644] block mb-1">
                    Slogan / Câu châm ngôn đại diện: *
                  </label>
                  <input
                    type="text"
                    required
                    value={charForm.slogan}
                    onChange={(e) => setCharForm({ ...charForm, slogan: e.target.value })}
                    placeholder="Một câu trích dẫn ngắn thể hiện tính cách nhân vật..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400"
                  />
                </div>

                {/* Plot: Backstory & First Message */}
                <div className="space-y-3 pt-2 border-t border-pink-100">
                  <h5 className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                    📜 PLOT & LỜI MỞ ĐẦU
                  </h5>

                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1">
                      Backstory / Cốt truyện nền: *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={charForm.backstory}
                      onChange={(e) => setCharForm({ ...charForm, backstory: e.target.value })}
                      placeholder="Mô tả bối cảnh thế giới, thân phận, tính cách và mối quan hệ với người dùng..."
                      className="w-full p-3.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400 leading-relaxed font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1">
                      First Message / Lời chào đầu: *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={charForm.firstMessage}
                      onChange={(e) => setCharForm({ ...charForm, firstMessage: e.target.value })}
                      placeholder="*Hành động và lời thoại đầu tiên khi bắt đầu phiên trò chuyện...*"
                      className="w-full p-3.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400 leading-relaxed font-serif italic"
                    />
                  </div>
                </div>

                {/* Google Studio AI Link */}
                <div className="pt-2 border-t border-pink-100">
                  <label className="text-xs font-semibold text-[#543644] block mb-1">
                    Google Studio AI Link:
                  </label>
                  <input
                    type="url"
                    value={charForm.googleAIStudioURL}
                    onChange={(e) => setCharForm({ ...charForm, googleAIStudioURL: e.target.value })}
                    placeholder="https://aistudio.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400"
                  />
                  <p className="text-[11px] text-[#937887] mt-0.5">
                    Link mở phòng chat AI trên Google Studio khi người dùng bấm 「✦ Mở GG AI ✦」.
                  </p>
                </div>

                {/* Lock Char Options */}
                <div className="pt-3 border-t border-pink-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="lockCharCheck"
                      checked={charForm.locked}
                      onChange={(e) => setCharForm({ ...charForm, locked: e.target.checked })}
                      className="w-4 h-4 text-rose-500 rounded-md border-pink-300 focus:ring-rose-300 cursor-pointer accent-rose-500"
                    />
                    <label htmlFor="lockCharCheck" className="text-xs font-bold text-[#4d2e3c] cursor-pointer flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>☑ Khóa Char (Người dùng phải nhập đúng mật mã mới được mở Plot)</span>
                    </label>
                  </div>

                  {charForm.locked && (
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-[#543644] block mb-1">
                          Câu hỏi mở khóa:
                        </label>
                        <input
                          type="text"
                          value={charForm.lockQuestion}
                          onChange={(e) => setCharForm({ ...charForm, lockQuestion: e.target.value })}
                          placeholder="Ví dụ: Món ăn đầu tiên bạn tặng cho nhân vật là gì?"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-[#543644] block mb-1">
                            Gợi ý:
                          </label>
                          <input
                            type="text"
                            value={charForm.lockHint}
                            onChange={(e) => setCharForm({ ...charForm, lockHint: e.target.value })}
                            placeholder="Gợi ý đáp án..."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#543644] block mb-1">
                            Đáp án / Mật mã mở khóa: *
                          </label>
                          <input
                            type="text"
                            value={charForm.lockPass}
                            onChange={(e) => setCharForm({ ...charForm, lockPass: e.target.value })}
                            placeholder="Mật mã chính xác..."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Emblem & Color Selector */}
                <div className="pt-2 border-t border-pink-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1.5">
                      Biểu tượng hoa đại diện (Thay thế avatar):
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {FLORAL_SYMBOLS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setCharForm({ ...charForm, floralSymbol: s })}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg border transition-transform ${
                            charForm.floralSymbol === s
                              ? 'bg-pink-200 border-rose-400 scale-110 shadow-xs'
                              : 'bg-white border-pink-200 hover:bg-pink-50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1.5">
                      Tông màu pastel:
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {PALETTES.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCharForm({ ...charForm, accentColor: p })}
                          className={`px-2.5 py-1 rounded-xl text-xs capitalize border ${
                            charForm.accentColor === p
                              ? 'bg-rose-200 border-rose-400 font-bold'
                              : 'bg-white border-pink-200 text-[#694d5b]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 flex justify-end gap-2 border-t border-pink-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingChar(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#664e5c] bg-white hover:bg-pink-50 border border-pink-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-[#4a2b3b] bg-gradient-to-r from-pink-200 to-rose-200 border border-pink-300 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Nhân Vật</span>
                  </button>
                </div>

              </form>
            </motion.div>
          ) : (
            /* Char List Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chars.map((c) => (
                <div
                  key={c.id}
                  className="pastel-glass-card rounded-3xl p-5 border border-pink-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{c.floralSymbol || '🌸'}</span>
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#4c2d3c]">
                            {c.name}
                          </h4>
                          <p className="text-[11px] text-[#8e7583]">
                            {c.tags.join(', ')}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleLock(c)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium border flex items-center gap-1 ${
                          c.locked
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                        title="Bấm để đổi khóa/mở"
                      >
                        {c.locked ? <Lock className="w-3 h-3 text-amber-600" /> : <Unlock className="w-3 h-3 text-emerald-600" />}
                        <span>{c.locked ? 'Đang khóa' : 'Đang mở'}</span>
                      </button>
                    </div>

                    <p className="text-xs font-serif italic text-[#634857] line-clamp-2 bg-pink-50/60 p-2 rounded-xl">
                      "{c.slogan}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
                    <span className="text-[10px] text-[#9a828f]">
                      Cập nhật: {new Date(c.updatedAt).toLocaleDateString('vi-VN')}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditChar(c)}
                        className="p-1.5 rounded-xl bg-white hover:bg-pink-100 border border-pink-200 text-[#543644] transition-colors"
                        title="Sửa nhân vật"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteChar(c.id)}
                        className="p-1.5 rounded-xl bg-white hover:bg-rose-100 border border-pink-200 text-rose-600 transition-colors"
                        title="Xóa nhân vật"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: QUẢN LÝ HỘP THƯ */}
      {activeTab === 'mailbox' && (
        <div className="space-y-6">
          
          {/* Recipient Management Section */}
          <div className="pastel-glass-card rounded-3xl p-5 border border-pink-200 space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h4 className="text-sm font-bold text-[#4e2e3d] flex items-center gap-2">
                <span>🌿</span>
                <span>Danh Sách Người Nhận Thư ({recipients.length})</span>
              </h4>

              <button
                onClick={() => setShowAddRecipient(!showAddRecipient)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#4a2b3b] bg-pink-100 hover:bg-pink-200 border border-pink-300 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm người nhận</span>
              </button>
            </div>

            {showAddRecipient && (
              <form onSubmit={handleSaveRecipient} className="p-4 rounded-2xl bg-white/80 border border-pink-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1">Tên người nhận: *</label>
                    <input
                      type="text"
                      required
                      value={recipientForm.name}
                      onChange={(e) => setRecipientForm({ ...recipientForm, name: e.target.value })}
                      placeholder="Ví dụ: Người Làm Vườn"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1">Mô tả ngắn: *</label>
                    <input
                      type="text"
                      required
                      value={recipientForm.description}
                      onChange={(e) => setRecipientForm({ ...recipientForm, description: e.target.value })}
                      placeholder="Ví dụ: Nhận thư góp ý chăm hoa"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#543644] block mb-1">Trạng thái:</label>
                    <select
                      value={recipientForm.status}
                      onChange={(e: any) => setRecipientForm({ ...recipientForm, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d]"
                    >
                      <option value="available">Sẵn sàng nhận thư</option>
                      <option value="busy">Bận rộn</option>
                      <option value="resting">Đang nghỉ ngơi</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddRecipient(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-[#664e5c]"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#4a2b3b] bg-pink-200 border border-pink-300"
                  >
                    Thêm Người Nhận
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {recipients.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-white/70 border border-pink-100 flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-base">{r.symbol || '🌸'}</span>
                      <button
                        onClick={() => handleDeleteRecipient(r.id)}
                        className="text-rose-500 hover:text-rose-700 p-0.5"
                        title="Xóa người nhận"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-[#4d2f3d]">{r.name}</p>
                    <p className="text-[11px] text-[#7d6573] line-clamp-2">{r.description}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full text-center border ${
                      r.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {r.status === 'available' ? 'Sẵn sàng' : 'Nghỉ ngơi'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Letter List */}
          <div className="pastel-glass-card rounded-3xl p-5 border border-pink-200 space-y-4">
            <h4 className="text-sm font-bold text-[#4e2e3d] flex items-center gap-2 border-b border-pink-100 pb-3">
              <span>💌</span>
              <span>Tất Cả Thư Đã Nhận ({letters.length})</span>
            </h4>

            {letters.length === 0 ? (
              <p className="text-center py-6 text-xs text-[#8c7482]">
                Chưa có lá thư nào trong hộp thư.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {letters.map((l) => (
                  <div
                    key={l.id}
                    className="p-4 rounded-2xl bg-white/80 border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-pink-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{l.stamp || '🌸'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-[#4e2e3d]">
                            {l.title}
                          </h5>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full ${
                              l.status === 'read'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-100 text-rose-800 font-bold'
                            }`}
                          >
                            {l.status === 'read' ? 'Đã đọc' : 'Thư mới'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7d6573]">
                          Gửi đến: <b>{l.recipientName}</b> • Người gửi: {l.senderName} • {new Date(l.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setPreviewLetter(l);
                          if (l.status !== 'read') handleMarkLetterRead(l.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-xs text-[#523342] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Đọc Thư</span>
                      </button>

                      <button
                        onClick={() => handleDeleteLetter(l.id)}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-100 transition-colors"
                        title="Xóa thư"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: CÀI ĐẶT WEBSITE & GIAO DIỆN */}
      {activeTab === 'settings' && settingsForm && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="pastel-glass-card rounded-3xl p-6 sm:p-8 border border-pink-200 space-y-6 vintage-paper">
            
            <div className="border-b border-pink-100 pb-3">
              <h4 className="text-base font-bold text-[#4e2e3d] flex items-center gap-2">
                <span>🌸</span>
                <span>Thông Tin & Giao Diện Website</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#543644] block mb-1">
                  Tên Website:
                </label>
                <input
                  type="text"
                  value={settingsForm.siteName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#543644] block mb-1">
                  Slogan:
                </label>
                <input
                  type="text"
                  value={settingsForm.slogan}
                  onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#543644] block mb-1">
                Lời giới thiệu khu vườn:
              </label>
              <textarea
                rows={3}
                value={settingsForm.aboutText}
                onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400 leading-relaxed"
              />
            </div>

            {/* Background Music Configuration */}
            <div className="pt-3 border-t border-pink-100 space-y-3">
              <h5 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>🎵</span>
                <span>CẤU HÌNH NHẠC NỀN YOUTUBE</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#543644] block mb-1">
                    YouTube Video URL:
                  </label>
                  <input
                    type="url"
                    value={settingsForm.youtubeUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] focus:outline-none focus:border-rose-400"
                  />
                  <p className="text-[11px] text-[#8e7482] mt-0.5">
                    Hệ thống tự động trích xuất ID video để phát nhạc nền êm dịu.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="musicEnabledCheck"
                      checked={settingsForm.musicEnabled}
                      onChange={(e) => setSettingsForm({ ...settingsForm, musicEnabled: e.target.checked })}
                      className="w-4 h-4 text-rose-500 rounded-md accent-rose-500 cursor-pointer"
                    />
                    <label htmlFor="musicEnabledCheck" className="text-xs font-semibold text-[#543644] cursor-pointer">
                      Bật nhạc nền tự động
                    </label>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#7d6573] block mb-0.5">
                      Âm lượng mặc định: {settingsForm.musicVolume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settingsForm.musicVolume}
                      onChange={(e) => setSettingsForm({ ...settingsForm, musicVolume: Number(e.target.value) })}
                      className="w-full h-1.5 bg-pink-100 rounded-lg cursor-pointer accent-rose-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual & Particle Configuration */}
            <div className="pt-3 border-t border-pink-100 space-y-3">
              <h5 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>🌸</span>
                <span>HIỆU ỨNG HOA & LÁ RƠI</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#543644] block mb-1">
                    Tốc độ lá rơi:
                  </label>
                  <select
                    value={settingsForm.fallingLeavesSpeed}
                    onChange={(e: any) => setSettingsForm({ ...settingsForm, fallingLeavesSpeed: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d]"
                  >
                    <option value="slow">Chậm rãi, êm ái (Khuyên dùng)</option>
                    <option value="normal">Bình thường</option>
                    <option value="paused">Tạm dừng hiệu ứng</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="butterfliesCheck"
                    checked={settingsForm.butterfliesEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, butterfliesEnabled: e.target.checked })}
                    className="w-4 h-4 text-rose-500 rounded-md accent-rose-500 cursor-pointer"
                  />
                  <label htmlFor="butterfliesCheck" className="text-xs font-semibold text-[#543644] cursor-pointer">
                    🦋 Hiển thị bướm bay
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="petalsCheck"
                    checked={settingsForm.petalsEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, petalsEnabled: e.target.checked })}
                    className="w-4 h-4 text-rose-500 rounded-md accent-rose-500 cursor-pointer"
                  />
                  <label htmlFor="petalsCheck" className="text-xs font-semibold text-[#543644] cursor-pointer">
                    🌸 Hiển thị cánh hoa rơi
                  </label>
                </div>
              </div>
            </div>

            {/* Change Admin Password */}
            <div className="pt-3 border-t border-pink-100 space-y-2">
              <label className="text-xs font-semibold text-[#543644] block">
                Đổi mật mã Admin (Để trống nếu giữ nguyên):
              </label>
              <input
                type="text"
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                placeholder="Mật mã mới..."
                className="max-w-xs w-full px-3.5 py-2.5 rounded-xl bg-white border border-pink-200 text-xs text-[#4c2f3d] font-mono"
              />
            </div>

            {/* Submit Settings */}
            <div className="pt-4 flex justify-end border-t border-pink-100">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full text-xs font-bold text-[#4a2b3b] bg-gradient-to-r from-pink-200 to-rose-200 border border-pink-300 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Tất Cả Cài Đặt</span>
              </button>
            </div>

          </form>

          {/* Backup & Export / Import JSON Box */}
          <div className="pastel-glass-card rounded-3xl p-6 border border-pink-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#4e2e3d] flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-rose-500" />
                  <span>Sao Lưu & Khôi Phục Dữ Liệu Toàn Diện (JSON)</span>
                </h4>
                <p className="text-[11px] text-[#8e7482]">
                  Lưu trữ toàn bộ Chars, Hộp thư và Cài đặt thành file JSON an toàn.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#4a2b3b] bg-white hover:bg-pink-50 border border-pink-200 shadow-2xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-rose-500" />
                  <span>Xuất File Sao Lưu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowImportBox(!showImportBox)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#4a2b3b] bg-pink-100 hover:bg-pink-200 border border-pink-300 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-rose-500" />
                  <span>Nhập JSON</span>
                </button>
              </div>
            </div>

            {showImportBox && (
              <div className="p-4 rounded-2xl bg-white/90 border border-pink-200 space-y-3">
                <label className="text-xs font-semibold text-[#543644] block">
                  Dán nội dung JSON đã sao lưu:
                </label>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Dán mã JSON tại đây..."
                  className="w-full p-3 rounded-xl bg-pink-50/50 border border-pink-200 text-xs font-mono"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImportBox(false)}
                    className="px-3 py-1.5 text-xs text-[#7e6573]"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    onClick={handleImportBackup}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-200 text-[#4c2d3c] border border-rose-300"
                  >
                    Khôi Phục Dữ Liệu
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Letter Reading Modal */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setPreviewLetter(null)}
            className="fixed inset-0 bg-[#3a2530]/40 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-lg w-full pastel-glass-card rounded-3xl border-2 border-pink-200 shadow-2xl p-6 sm:p-8 z-10 vintage-paper space-y-4"
          >
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{previewLetter.stamp || '🌸'}</span>
                <div>
                  <h4 className="text-base font-bold text-[#4d2f3d]">
                    {previewLetter.title}
                  </h4>
                  <p className="text-[11px] text-[#8e7482]">
                    Gửi: {previewLetter.recipientName} • Từ: {previewLetter.senderName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewLetter(null)}
                className="p-1 rounded-full hover:bg-pink-100 text-[#7a5c6d]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-pink-200 text-sm text-[#4c2f3d] leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto italic font-serif" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {previewLetter.content}
            </div>

            <div className="flex items-center justify-between text-xs text-[#9a808e] pt-2 border-t border-pink-100">
              <span>{new Date(previewLetter.createdAt).toLocaleString('vi-VN')}</span>
              <button
                onClick={() => setPreviewLetter(null)}
                className="px-4 py-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-[#4c2d3c] font-semibold"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
