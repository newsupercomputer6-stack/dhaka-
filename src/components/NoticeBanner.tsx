import React from 'react';
import { Bell, ChevronRight, Pin, PlusCircle, Volume2, ArrowRight } from 'lucide-react';
import { Notice } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface NoticeBannerProps {
  notices: Notice[];
  onOpenNoticeBoard: () => void;
  onOpenNoticeDetail: (notice: Notice) => void;
  onOpenPublishNotice: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({
  notices,
  onOpenNoticeBoard,
  onOpenNoticeDetail,
  onOpenPublishNotice,
}) => {
  if (notices.length === 0) return null;

  // Prioritize pinned notice, else latest
  const featuredNotice = notices.find((n) => n.isPinned) || notices[0];

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border-b border-amber-300/40 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
        
        {/* Left: Speaker Badge + Title */}
        <div 
          onClick={() => onOpenNoticeDetail(featuredNotice)}
          className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
          title="বিজ্ঞপ্তিটি বিস্তারিত দেখতে ক্লিক করুন"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] shrink-0 shadow-xs animate-pulse">
            <Volume2 className="w-3.5 h-3.5" />
            <span>জরুরি বিজ্ঞপ্তি</span>
          </span>

          <div className="flex items-center gap-2 truncate">
            {featuredNotice.isPinned && (
              <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0 rotate-45" />
            )}
            <span className="font-semibold text-slate-900 group-hover:text-emerald-800 transition truncate">
              {featuredNotice.title}
            </span>
            <span className="hidden sm:inline-block text-slate-400 text-[11px] shrink-0">
              ({featuredNotice.date})
            </span>
          </div>

          <span className="hidden lg:inline-flex items-center text-emerald-700 font-medium text-[11px] group-hover:underline shrink-0">
            বিস্তারিত পড়ুন <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          <button
            onClick={onOpenNoticeBoard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-300 shadow-2xs transition cursor-pointer text-[11px]"
            title="সমিতির সকল বিজ্ঞপ্তি দেখতে ক্লিক করুন"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-700" />
            <span>সকল নোটিশ ({formatBnNumber(notices.length)})</span>
          </button>

          <button
            onClick={onOpenPublishNotice}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-2xs transition cursor-pointer text-[11px]"
            title="নতুন কোনো নোটিশ প্রকাশ করুন"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>নোটিশ প্রকাশ</span>
          </button>
        </div>

      </div>
    </div>
  );
};
