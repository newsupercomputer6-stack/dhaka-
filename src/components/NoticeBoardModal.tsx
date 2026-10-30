import React, { useState } from 'react';
import { X, Bell, Pin, PlusCircle, Edit3, Trash2, Phone, Calendar, UserCheck, Search, Filter } from 'lucide-react';
import { Notice } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface NoticeBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: Notice[];
  onOpenPublishNotice: () => void;
  onEditNotice: (notice: Notice) => void;
  onDeleteNotice: (noticeId: string) => void;
  selectedNoticeId?: string | null;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'জরুরি': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'সভা': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'সদস্য সংগ্রহ': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'কল্যাণ তহবিল': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'সাধারণ': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  'অন্যান্য': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

export const NoticeBoardModal: React.FC<NoticeBoardModalProps> = ({
  isOpen,
  onClose,
  notices,
  onOpenPublishNotice,
  onEditNotice,
  onDeleteNotice,
  selectedNoticeId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = ['সকল', 'জরুরি', 'সভা', 'সদস্য সংগ্রহ', 'কল্যাণ তহবিল', 'সাধারণ'];

  const filteredNotices = notices
    .filter((n) => {
      if (selectedCategory !== 'সকল' && n.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchContent = n.content.toLowerCase().includes(q);
        const matchPub = n.publishedBy?.toLowerCase().includes(q);
        return matchTitle || matchContent || matchPub;
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned notices come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${title}" বিজ্ঞপ্তিটি মুছে ফেলতে চান?`)) {
      onDeleteNotice(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-semibold tracking-wider uppercase">
                বাজিতপুর সমিতি, ঢাকা
              </div>
              <h2 className="text-xl font-bold font-serif">
                ডিজিটাল নোটিশ বোর্ড ও বিজ্ঞপ্তি কেন্দ্র
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPublishNotice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              title="নতুন নোটিশ লিখুন ও প্রকাশ করুন"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন নোটিশ</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar and search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোটিশ অনুসন্ধান করুন..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Notice List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {filteredNotices.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">কোন বিজ্ঞপ্তি পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400 mt-0.5">নতুন কোনো নোটিশ প্রকাশ করতে ওপরের বোতাম ব্যবহার করুন।</p>
            </div>
          ) : (
            filteredNotices.map((notice) => {
              const color = CATEGORY_COLORS[notice.category] || CATEGORY_COLORS['সাধারণ'];
              const isSelected = selectedNoticeId === notice.id;

              return (
                <div
                  key={notice.id}
                  className={`bg-white rounded-xl border p-4 transition shadow-xs ${
                    isSelected ? 'ring-2 ring-emerald-500 border-emerald-400' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Notice Card Top */}
                  <div className="flex flex-wrap items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      {notice.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Pin className="w-3 h-3 rotate-45" />
                          <span>পিন করা</span>
                        </span>
                      )}

                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${color.bg} ${color.text} ${color.border}`}>
                        {notice.category}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{notice.date}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditNotice(notice)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        title="বিজ্ঞপ্তি সংশোধন করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(notice.id, notice.title)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="বিজ্ঞপ্তি মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div className="mt-3">
                    <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">
                      {notice.title}
                    </h3>

                    <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>
                  </div>

                  {/* Card Bottom / Contact & Publisher */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{notice.publishedBy || 'বাজিতপুর সমিতি, ঢাকা'}</span>
                    </div>

                    {notice.phone && (
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${notice.phone}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[11px] font-semibold border border-emerald-200 transition"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{notice.phone}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            মোট প্রকাশিত বিজ্ঞপ্তি: <strong className="text-slate-800">{formatBnNumber(notices.length)}</strong> টি
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
