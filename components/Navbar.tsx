'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X, Settings, Heart, Flower } from 'lucide-react';

interface NavbarProps {
  siteName: string;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export default function Navbar({
  siteName = 'LOVE HAVEN',
  activeTab,
  onSelectTab,
  onOpenAdmin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: '🏡' },
    { id: 'search', label: 'Tìm kiếm', icon: '🔎' },
    { id: 'tags', label: 'Tags', icon: '🏷️' },
    { id: 'chars', label: 'Danh sách Char', icon: '🌸' },
    { id: 'mailbox', label: 'Hộp thư', icon: '💌' },
    { id: 'about', label: 'Giới thiệu', icon: '✦' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="pastel-glass rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-sm border border-pink-200/70">
          
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-200 to-rose-200 flex items-center justify-center text-sm shadow-xs group-hover:rotate-12 transition-transform">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className="font-serif font-bold text-lg sm:text-xl tracking-wider text-[#543544]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {siteName}
                </span>
                <span className="text-xs text-rose-400">🎀</span>
              </div>
              <p className="text-[10px] text-[#8e7683] hidden sm:block tracking-wide">
                Vườn Chatbot AI & Thư Tình
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-[#4e2d3b] bg-pink-100/90 shadow-xs font-semibold'
                      : 'text-[#745a68] hover:text-[#4e2d3b] hover:bg-pink-50/60'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-400"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Admin trigger button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-full text-[#8a707e] hover:text-[#523342] hover:bg-pink-100/60 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Khu vực quản lý"
            >
              <Settings className="w-4 h-4 text-pink-400 hover:rotate-90 transition-transform duration-300" />
              <span className="hidden lg:inline text-[11px] font-medium text-[#7d6573]">
                Quản lý
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#6d4f5e] hover:bg-pink-100/60 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 p-3 rounded-2xl pastel-glass border border-pink-200 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors ${
                        isActive
                          ? 'bg-pink-100 text-[#4c2d3b] font-semibold'
                          : 'text-[#6c515f] hover:bg-pink-50'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
