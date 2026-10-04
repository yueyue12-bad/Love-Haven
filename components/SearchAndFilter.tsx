'use client';

import React from 'react';
import { Search, X, Tag as TagIcon, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { PublicCharView } from '@/types';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  statusFilter: 'all' | 'unlocked' | 'locked';
  onStatusFilterChange: (status: 'all' | 'unlocked' | 'locked') => void;
  allTags: { tag: string; count: number }[];
  totalResults: number;
}

export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedTag,
  onSelectTag,
  statusFilter,
  onStatusFilterChange,
  allTags,
  totalResults,
}: SearchAndFilterProps) {
  const isFiltered = Boolean(searchTerm || selectedTag || statusFilter !== 'all');

  const handleReset = () => {
    onSearchChange('');
    onSelectTag(null);
    onStatusFilterChange('all');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Main Search Bar & Filter Controls */}
      <div className="pastel-glass rounded-3xl p-4 sm:p-5 border border-pink-200/80 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="🔎 Tìm kiếm theo tên nhân vật, slogan, tag..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/90 border border-pink-200 text-sm text-[#4d2f3d] placeholder:text-[#9e8794] focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-[#8f7583] hover:text-[#523342] absolute right-3 top-1/2 -translate-y-1/2 rounded-full hover:bg-pink-100/60"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 border border-pink-200/80 shrink-0 w-full sm:w-auto justify-center">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-pink-100 text-[#4d2e3c] font-semibold shadow-2xs'
                  : 'text-[#7e6473] hover:bg-pink-50'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => onStatusFilterChange('unlocked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'unlocked'
                  ? 'bg-emerald-100 text-emerald-900 font-semibold shadow-2xs'
                  : 'text-[#7e6473] hover:bg-pink-50'
              }`}
            >
              🔓 Đã mở
            </button>
            <button
              onClick={() => onStatusFilterChange('locked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'locked'
                  ? 'bg-amber-100 text-amber-900 font-semibold shadow-2xs'
                  : 'text-[#7e6473] hover:bg-pink-50'
              }`}
            >
              🔒 Đang khóa
            </button>
          </div>

        </div>

        {/* Dynamic Tag Cloud */}
        {allTags.length > 0 && (
          <div className="pt-2 border-t border-pink-100/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-[#7a6170] flex items-center gap-1">
                <TagIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>Tags nổi bật trong vườn hoa:</span>
              </span>
              {selectedTag && (
                <button
                  onClick={() => onSelectTag(null)}
                  className="text-[11px] text-rose-500 hover:text-rose-700 underline cursor-pointer"
                >
                  Xóa chọn tag
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {allTags.map(({ tag, count }) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => onSelectTag(isSelected ? null : tag)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-400 text-white border-rose-500 shadow-xs font-semibold scale-105'
                        : 'bg-white/80 hover:bg-pink-100/80 text-[#694e5c] border-pink-200/80'
                    }`}
                  >
                    <span>{tag}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-rose-500 text-white' : 'bg-pink-100 text-[#816574]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Filter status summary & Reset */}
      {isFiltered && (
        <div className="flex items-center justify-between text-xs px-2 text-[#7d6573]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Tìm thấy <b>{totalResults}</b> nhân vật phù hợp</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-medium hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      )}

    </div>
  );
}
