'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GardenBackground from '@/components/GardenBackground';
import IntroScreen from '@/components/IntroScreen';
import MusicPlayer from '@/components/MusicPlayer';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CharCard from '@/components/CharCard';
import CharDetailModal from '@/components/CharDetailModal';
import SearchAndFilter from '@/components/SearchAndFilter';
import MailboxSection from '@/components/MailboxSection';
import AboutSection from '@/components/AboutSection';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { PublicCharView, Recipient, SiteSettings } from '@/types';
import { Sparkles, Heart, Flower2, Key, Send, Search, BookOpen, Tag as TagIcon } from 'lucide-react';

export default function Home() {
  // Splash Screen state
  const [hasEntered, setHasEntered] = useState(false);
  const [musicAutoplayTrigger, setMusicAutoplayTrigger] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Database states
  const [chars, setChars] = useState<PublicCharView[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'LOVE HAVEN',
    slogan: 'Một khu vườn nhỏ dành cho những câu chuyện chưa kể...',
    aboutText: 'Không gian thơ mộng để ngắm hoa, đọc thư tình và khám phá những nhân vật AI đặc sắc.',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    musicEnabled: true,
    musicVolume: 40,
    activeTheme: 'random',
    fallingLeavesSpeed: 'slow',
    butterfliesEnabled: true,
    petalsEnabled: true,
    adminPass: 'omlaynoinho',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Selected Char for Detail/Unlock Modal
  const [selectedChar, setSelectedChar] = useState<PublicCharView | null>(null);
  
  // Unlocked characters cache in current session: { [charId]: { backstory, firstMessage, googleAIStudioURL } }
  const [unlockedCache, setUnlockedCache] = useState<Record<string, { backstory: string; firstMessage: string; googleAIStudioURL: string }>>({});

  // Search & Tag Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Admin States
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Check sessionStorage for previous entrance & token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const enteredSession = sessionStorage.getItem('love_haven_entered');
      if (enteredSession === 'true') {
        setHasEntered(true);
      }
      const savedToken = sessionStorage.getItem('love_haven_admin_token');
      if (savedToken) {
        setAdminToken(savedToken);
      }
      const savedUnlocked = sessionStorage.getItem('love_haven_unlocked_cache');
      if (savedUnlocked) {
        try {
          setUnlockedCache(JSON.parse(savedUnlocked));
        } catch (e) {}
      }
    }
  }, []);

  // Fetch Public Data
  const fetchData = async () => {
    try {
      // 1. Fetch public chars
      const resChars = await fetch('/api/chars');
      const dataChars = await resChars.json();
      if (dataChars.success) {
        setChars(dataChars.chars || []);
      }

      // 2. Fetch recipients
      const resRec = await fetch('/api/recipients');
      const dataRec = await resRec.json();
      if (dataRec.success) {
        setRecipients(dataRec.recipients || []);
      }

      // 3. Fetch public settings
      const resSet = await fetch('/api/settings');
      const dataSet = await resSet.json();
      if (dataSet.success) {
        setSettings((prev) => ({ ...prev, ...dataSet.settings }));
      }
    } catch (error) {
      console.error('Lỗi nạp dữ liệu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnterGarden = () => {
    setHasEntered(true);
    setMusicAutoplayTrigger(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('love_haven_entered', 'true');
    }
  };

  const handleUnlockSuccess = (
    charId: string,
    plotData: { backstory: string; firstMessage: string; googleAIStudioURL: string }
  ) => {
    const updated = {
      ...unlockedCache,
      [charId]: plotData,
    };
    setUnlockedCache(updated);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('love_haven_unlocked_cache', JSON.stringify(updated));
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('love_haven_admin_token', token);
    }
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setIsAdminDashboardOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('love_haven_admin_token');
    }
  };

  // Compute all unique tags with count
  const allTagsWithCount = useMemo(() => {
    const map = new Map<string, number>();
    chars.forEach((c) => {
      c.tags.forEach((t) => {
        const cleanTag = t.trim();
        if (cleanTag) {
          map.set(cleanTag, (map.get(cleanTag) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [chars]);

  // Filtered chars based on search, tag, status
  const filteredChars = useMemo(() => {
    return chars.filter((c) => {
      // 1. Search term (Name, Slogan, Tag, or unlocked Backstory)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const nameMatch = c.name.toLowerCase().includes(term);
        const sloganMatch = c.slogan.toLowerCase().includes(term);
        const tagMatch = c.tags.some((t) => t.toLowerCase().includes(term));
        if (!nameMatch && !sloganMatch && !tagMatch) return false;
      }

      // 2. Tag filter
      if (selectedTag) {
        if (!c.tags.includes(selectedTag)) return false;
      }

      // 3. Status filter
      const isCharUnlocked = !c.locked || Boolean(unlockedCache[c.id]);
      if (statusFilter === 'unlocked' && !isCharUnlocked) return false;
      if (statusFilter === 'locked' && isCharUnlocked) return false;

      return true;
    });
  }, [chars, searchTerm, selectedTag, statusFilter, unlockedCache]);

  const handleSelectTagFromCard = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('chars');
  };

  return (
    <div className="min-h-screen relative text-[#4a2e3c] flex flex-col justify-between selection:bg-pink-200">
      
      {/* Dynamic Botanical Animated Background */}
      <GardenBackground
        palette={settings.activeTheme}
        speed={settings.fallingLeavesSpeed}
        butterflies={settings.butterfliesEnabled}
      />

      {/* Background YouTube Music Player */}
      <MusicPlayer
        youtubeUrl={settings.youtubeUrl}
        enabled={settings.musicEnabled}
        defaultVolume={settings.musicVolume}
        triggerPlay={musicAutoplayTrigger}
      />

      {/* Intro Splash Screen */}
      <AnimatePresence>
        {!hasEntered && (
          <IntroScreen
            onEnter={handleEnterGarden}
            siteName={settings.siteName}
            slogan={settings.slogan}
          />
        )}
      </AnimatePresence>

      {/* Main Website Structure */}
      {hasEntered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          
          {/* Header & Navbar */}
          <Navbar
            siteName={settings.siteName}
            activeTab={isAdminDashboardOpen ? 'admin' : activeTab}
            onSelectTab={(tab) => {
              setIsAdminDashboardOpen(false);
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmin={() => {
              if (adminToken) {
                setIsAdminDashboardOpen(true);
              } else {
                setIsAdminLoginOpen(true);
              }
            }}
          />

          {/* Main Content Areas */}
          <main className="flex-1 pb-16">
            
            {/* If Admin Dashboard is open */}
            {isAdminDashboardOpen && adminToken ? (
              <AdminDashboard
                token={adminToken}
                onLogout={handleAdminLogout}
                onRefreshData={fetchData}
              />
            ) : (
              <>
                {/* 1. HOME VIEW */}
                {activeTab === 'home' && (
                  <div className="space-y-12">
                    {/* Hero */}
                    <HeroSection
                      siteName={settings.siteName}
                      slogan={settings.slogan}
                      onExploreChars={() => {
                        setActiveTab('chars');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onOpenMailbox={() => {
                        setActiveTab('mailbox');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />

                    {/* Quick Search & Filter bar */}
                    <SearchAndFilter
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      selectedTag={selectedTag}
                      onSelectTag={setSelectedTag}
                      statusFilter={statusFilter}
                      onStatusFilterChange={setStatusFilter}
                      allTags={allTagsWithCount}
                      totalResults={filteredChars.length}
                    />

                    {/* Featured Characters Showcase */}
                    <section className="max-w-6xl mx-auto px-4 sm:px-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌸</span>
                          <h2
                            className="text-xl sm:text-2xl font-serif font-bold text-[#4c2d3b]"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                          >
                            Những Đóa Hoa AI Đang Nở ({filteredChars.length})
                          </h2>
                        </div>

                        {chars.length > 6 && (
                          <button
                            onClick={() => setActiveTab('chars')}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                          >
                            Xem tất cả ({chars.length}) ✦
                          </button>
                        )}
                      </div>

                      {filteredChars.length === 0 ? (
                        <div className="text-center py-16 p-8 rounded-3xl pastel-glass border border-pink-200 space-y-3">
                          <span className="text-4xl">🌸</span>
                          <h3 className="text-base font-serif font-bold text-[#5c3c4a]">
                            Không tìm thấy nhân vật phù hợp...
                          </h3>
                          <p className="text-xs text-[#8d7582] max-w-sm mx-auto">
                            Có vẻ như chưa có đóa hoa nào khớp với từ khóa tìm kiếm. Hãy thử từ khóa khác hoặc xóa bộ lọc.
                          </p>
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setSelectedTag(null);
                              setStatusFilter('all');
                            }}
                            className="px-5 py-2 rounded-full text-xs font-semibold text-[#4e2d3b] bg-pink-100 hover:bg-pink-200 border border-pink-300 transition-colors"
                          >
                            Xóa bộ lọc 🌸
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {filteredChars.map((char) => (
                            <CharCard
                              key={char.id}
                              char={char}
                              onSelect={setSelectedChar}
                              onTagClick={handleSelectTagFromCard}
                              isUnlockedInSession={Boolean(unlockedCache[char.id])}
                            />
                          ))}
                        </div>
                      )}
                    </section>

                    {/* Mailbox Teaser on Homepage */}
                    <section className="max-w-4xl mx-auto px-4 sm:px-6">
                      <div className="pastel-glass-card rounded-3xl p-6 sm:p-8 border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left vintage-paper">
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
                            <span>💌</span>
                            <span>HỘP THƯ BÍ MẬT</span>
                          </span>
                          <h3
                            className="text-xl sm:text-2xl font-serif font-bold text-[#4c2d3b]"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                          >
                            Bạn Muốn Gửi Một Lá Thư Đến Vườn Hoa?
                          </h3>
                          <p className="text-xs text-[#806774] max-w-md">
                            Gửi những lời chúc, cảm nghĩ hoặc lời thì thầm đến các nhân vật AI và người chăm sóc khu vườn.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setActiveTab('mailbox');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-[#4e2e3d] bg-gradient-to-r from-pink-200 to-rose-200 border border-pink-300 shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
                        >
                          <span>Gửi Thư Ngay</span>
                          <Send className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    </section>
                  </div>
                )}

                {/* 2. SEARCH TAB */}
                {activeTab === 'search' && (
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                    <div className="text-center space-y-2 mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-xs font-semibold text-[#543343]">
                        <span>🔎</span>
                        <span>TÌM KIẾM NHÂN VẬT</span>
                        <span>🌸</span>
                      </div>
                      <h2
                        className="text-2xl sm:text-3xl font-serif font-bold text-[#482b3a]"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        Tra Cứu Nhân Vật AI
                      </h2>
                    </div>

                    <SearchAndFilter
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      selectedTag={selectedTag}
                      onSelectTag={setSelectedTag}
                      statusFilter={statusFilter}
                      onStatusFilterChange={setStatusFilter}
                      allTags={allTagsWithCount}
                      totalResults={filteredChars.length}
                    />

                    {/* Results */}
                    <div className="pt-4">
                      {filteredChars.length === 0 ? (
                        <div className="text-center py-16 p-8 rounded-3xl pastel-glass border border-pink-200 space-y-3">
                          <span className="text-4xl">🌸</span>
                          <h3 className="text-base font-serif font-bold text-[#5c3c4a]">
                            Không tìm thấy nhân vật phù hợp...
                          </h3>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {filteredChars.map((char) => (
                            <CharCard
                              key={char.id}
                              char={char}
                              onSelect={setSelectedChar}
                              onTagClick={handleSelectTagFromCard}
                              isUnlockedInSession={Boolean(unlockedCache[char.id])}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. TAGS TAB */}
                {activeTab === 'tags' && (
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                    <div className="text-center space-y-2 mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-xs font-semibold text-[#543343]">
                        <span>🏷️</span>
                        <span>DANH SÁCH TAGS</span>
                        <span>🌸</span>
                      </div>
                      <h2
                        className="text-2xl sm:text-3xl font-serif font-bold text-[#482b3a]"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        Khám Phá Theo Chủ Đề
                      </h2>
                    </div>

                    {/* Tag Cloud Big Card */}
                    <div className="pastel-glass-card rounded-3xl p-6 sm:p-8 border border-pink-200 space-y-4">
                      <div className="flex flex-wrap gap-2.5 justify-center">
                        {allTagsWithCount.map(({ tag, count }) => {
                          const isSelected = selectedTag === tag;
                          return (
                            <button
                              key={tag}
                              onClick={() => {
                                setSelectedTag(isSelected ? null : tag);
                              }}
                              className={`text-sm px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-rose-400 text-white border-rose-500 shadow-md font-bold scale-105'
                                  : 'bg-white/80 hover:bg-pink-100 text-[#694e5c] border-pink-200'
                              }`}
                            >
                              <span>{tag}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isSelected ? 'bg-rose-500 text-white' : 'bg-pink-100 text-[#7a5f6e]'
                                }`}
                              >
                                {count} nhân vật
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Char Results for Selected Tag */}
                    {selectedTag && (
                      <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#4e2e3d]">
                            Các nhân vật thuộc tag: <span className="text-rose-600">{selectedTag}</span> ({filteredChars.length})
                          </h3>
                          <button
                            onClick={() => setSelectedTag(null)}
                            className="text-xs text-rose-500 hover:underline"
                          >
                            Xem tất cả tag
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {filteredChars.map((char) => (
                            <CharCard
                              key={char.id}
                              char={char}
                              onSelect={setSelectedChar}
                              onTagClick={handleSelectTagFromCard}
                              isUnlockedInSession={Boolean(unlockedCache[char.id])}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. CHARS TAB */}
                {activeTab === 'chars' && (
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                    <div className="text-center space-y-2 mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-xs font-semibold text-[#543343]">
                        <span>🌸</span>
                        <span>BỘ SƯU TẬP CHAR AI</span>
                        <span>🦋</span>
                      </div>
                      <h2
                        className="text-2xl sm:text-3xl font-serif font-bold text-[#482b3a]"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        Tất Cả Nhân Vật Trong Vườn ({chars.length})
                      </h2>
                    </div>

                    <SearchAndFilter
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      selectedTag={selectedTag}
                      onSelectTag={setSelectedTag}
                      statusFilter={statusFilter}
                      onStatusFilterChange={setStatusFilter}
                      allTags={allTagsWithCount}
                      totalResults={filteredChars.length}
                    />

                    <div className="pt-4">
                      {filteredChars.length === 0 ? (
                        <div className="text-center py-16 p-8 rounded-3xl pastel-glass border border-pink-200 space-y-3">
                          <span className="text-4xl">🌸</span>
                          <h3 className="text-base font-serif font-bold text-[#5c3c4a]">
                            Không tìm thấy nhân vật phù hợp...
                          </h3>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {filteredChars.map((char) => (
                            <CharCard
                              key={char.id}
                              char={char}
                              onSelect={setSelectedChar}
                              onTagClick={handleSelectTagFromCard}
                              isUnlockedInSession={Boolean(unlockedCache[char.id])}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. MAILBOX TAB */}
                {activeTab === 'mailbox' && (
                  <MailboxSection
                    recipients={recipients}
                    onLetterSent={fetchData}
                  />
                )}

                {/* 6. ABOUT TAB */}
                {activeTab === 'about' && (
                  <AboutSection
                    siteName={settings.siteName}
                    aboutText={settings.aboutText}
                    onExplore={() => {
                      setActiveTab('chars');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}
              </>
            )}

          </main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-pink-200/80 bg-white/40 backdrop-blur-xs py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c7381]">
              <div className="flex items-center gap-2">
                <span>🌸</span>
                <span className="font-serif font-bold text-[#523342]">
                  {settings.siteName}
                </span>
                <span>•</span>
                <span>Một khu vườn nhỏ cho những câu chuyện AI</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    sessionStorage.removeItem('love_haven_entered');
                    setHasEntered(false);
                  }}
                  className="hover:text-[#523342] transition-colors cursor-pointer"
                >
                  Xem lại màn hình mở đầu
                </button>

                <span>•</span>

                <button
                  onClick={() => {
                    if (adminToken) {
                      setIsAdminDashboardOpen(true);
                    } else {
                      setIsAdminLoginOpen(true);
                    }
                  }}
                  className="flex items-center gap-1 hover:text-[#523342] transition-colors cursor-pointer"
                >
                  <Key className="w-3 h-3 text-pink-400" />
                  <span>⚙ Quản lý</span>
                </button>
              </div>
            </div>
          </footer>

        </motion.div>
      )}

      {/* Char Detail / Unlock Modal */}
      {selectedChar && (
        <CharDetailModal
          char={selectedChar}
          onClose={() => setSelectedChar(null)}
          onUnlockSuccess={handleUnlockSuccess}
          unlockedData={unlockedCache[selectedChar.id] || null}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
