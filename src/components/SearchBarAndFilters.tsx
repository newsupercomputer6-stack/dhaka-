import React from 'react';
import { Search, X, RotateCcw, Filter, TableProperties, Grid, LayoutList } from 'lucide-react';
import { FilterState, ViewMode } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface SearchBarAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  unions: string[];
  professions: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  unions,
  professions,
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  const hasActiveFilters = 
    Boolean(filters.searchQuery) || 
    Boolean(filters.selectedUnion) || 
    Boolean(filters.selectedProfession) || 
    Boolean(filters.selectedFee);

  const topUnions = [
    'সকল ইউনিয়ন',
    'বাজিতপুর পৌরসভা',
    'দিলালপুর ইউনিয়ন',
    'সরারচর ইউনিয়ন',
    'হিলচিয়া ইউনিয়ন',
    'দিঘীরপাড় ইউনিয়ন',
    'হালিমপুর ইউনিয়ন',
    'পিরিজপুর ইউনিয়ন',
    'বলিয়ারদী ইউনিয়ন',
    'মাইজচর ইউনিয়ন',
    'গাজীরচর ইউনিয়ন',
    'হুমাইপুর ইউনিয়ন',
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-5 space-y-4">
      
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-emerald-600" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="সদস্যের নাম, পিতার নাম, মোবাইল নম্বর, বা এলাকা দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-10 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition placeholder:text-slate-400"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              title="অনুসন্ধান মুছুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto shrink-0">
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
              viewMode === 'table'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="সাধারণ টেবিল ভিউ"
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>টেবিল</span>
          </button>

          <button
            onClick={() => onViewModeChange('compact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
              viewMode === 'compact'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="কমপ্যাক্ট এক্সেল ভিউ"
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>এক্সেল মোড</span>
          </button>

          <button
            onClick={() => onViewModeChange('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
              viewMode === 'cards'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="কার্ড ভিউ"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>কার্ড</span>
          </button>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        
        {/* Union Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            ইউনিয়ন / পৌরসভা
          </label>
          <select
            value={filters.selectedUnion}
            onChange={(e) => onFilterChange({ selectedUnion: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">সকল অঞ্চল ও ইউনিয়ন ({formatBnNumber(unions.length)})</option>
            {unions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Profession Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            পেশা অনুযায়ী ফিল্টার
          </label>
          <select
            value={filters.selectedProfession}
            onChange={(e) => onFilterChange({ selectedProfession: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">সকল পেশা ({formatBnNumber(professions.length)})</option>
            {professions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Fee Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            সদস্য ফি
          </label>
          <select
            value={filters.selectedFee}
            onChange={(e) => onFilterChange({ selectedFee: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">সকল ফি</option>
            <option value="500">৳৫০০ (সাধারণ ফি)</option>
            <option value="100">৳১০০ (বিশেষ ফি)</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            সাজানোর ক্রম
          </label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
              onFilterChange({ sortBy, sortOrder });
            }}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="sl-asc">ক্র.নং (১ থেকে ৫৭০)</option>
            <option value="sl-desc">ক্র.নং (৫৭০ থেকে ১)</option>
            <option value="name-asc">সদস্যের নাম (অ - হ)</option>
            <option value="union-asc">ইউনিয়ন অনুযায়ী</option>
            <option value="fee-desc">ফি (বেশি থেকে কম)</option>
            <option value="profession-asc">পেশা অনুযায়ী</option>
          </select>
        </div>

      </div>

      {/* Quick Union Selector Tabs */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-600" />
            দ্রুত নির্বাচন:
          </span>
          {topUnions.map((u) => {
            const isAll = u === 'সকল ইউনিয়ন';
            const isSelected = isAll ? !filters.selectedUnion : filters.selectedUnion === u;
            return (
              <button
                key={u}
                onClick={() => onFilterChange({ selectedUnion: isAll ? '' : u })}
                className={`text-xs px-2.5 py-1 rounded-md transition ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-medium shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {u}
              </button>
            );
          })}
        </div>

        {/* Reset filter button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>ফিল্টার রিসেট করুন</span>
          </button>
        )}
      </div>

    </div>
  );
};
