import React, { useState, useEffect } from 'react';
import { X, Bell, Pin, Check, Save } from 'lucide-react';
import { Notice } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface PublishNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNotice: (notice: Notice) => void;
  editingNotice?: Notice | null;
}

export function getTodayBnDate(): string {
  const date = new Date();
  const day = formatBnNumber(date.getDate());
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const month = months[date.getMonth()];
  const year = formatBnNumber(date.getFullYear());
  return `${day} ${month}, ${year}`;
}

export const PublishNoticeModal: React.FC<PublishNoticeModalProps> = ({
  isOpen,
  onClose,
  onSaveNotice,
  editingNotice,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Notice['category']>('জরুরি');
  const [content, setContent] = useState('');
  const [publishedBy, setPublishedBy] = useState('কার্যনির্বাহী কমিটি, বাজিতপুর সমিতি ঢাকা');
  const [phone, setPhone] = useState('01713180019');
  const [isPinned, setIsPinned] = useState(true);

  useEffect(() => {
    if (editingNotice) {
      setTitle(editingNotice.title || '');
      setCategory(editingNotice.category || 'জরুরি');
      setContent(editingNotice.content || '');
      setPublishedBy(editingNotice.publishedBy || 'কার্যনির্বাহী কমিটি, বাজিতপুর সমিতি ঢাকা');
      setPhone(editingNotice.phone || '');
      setIsPinned(Boolean(editingNotice.isPinned));
    } else {
      setTitle('');
      setCategory('জরুরি');
      setContent('');
      setPublishedBy('কার্যনির্বাহী কমিটি, বাজিতপুর সমিতি ঢাকা');
      setPhone('01713180019');
      setIsPinned(true);
    }
  }, [editingNotice, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const notice: Notice = {
      id: editingNotice ? editingNotice.id : `notice-${Date.now()}`,
      title: title.trim(),
      category,
      content: content.trim(),
      date: editingNotice ? editingNotice.date : getTodayBnDate(),
      publishedBy: publishedBy.trim() || 'বাজিতপুর সমিতি, ঢাকা',
      phone: phone.trim() || undefined,
      isPinned,
    };

    onSaveNotice(notice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingNotice ? 'বিজ্ঞপ্তি সংশোধন' : 'নতুন নোটিশ / বিজ্ঞপ্তি প্রকাশ'}
              </h2>
              <p className="text-xs text-emerald-200">সকল ভিজিটর ও সদস্যদের জন্য নোটিশ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-700 max-h-[82vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              বিজ্ঞপ্তির শিরোনাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="উদাঃ বাজিতপুর সমিতির সাধারণ সভা ও মিলনমেলা"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                বিজ্ঞপ্তির বিভাগ / বিষয়
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="জরুরি">জরুরি বিজ্ঞপ্তি</option>
                <option value="সভা">সাধারণ সভা / মিটিং</option>
                <option value="সদস্য সংগ্রহ">সদস্য সংগ্রহ ও নিবন্ধন</option>
                <option value="কল্যাণ তহবিল">কল্যাণ তহবিল ও বৃত্তি</option>
                <option value="সাধারণ">সাধারণ নোটিশ</option>
                <option value="অন্যান্য">অন্যান্য তথ্য</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                জরুরি যোগাযোগের মোবাইল (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              প্রকাশক / অনুমোদনে
            </label>
            <input
              type="text"
              value={publishedBy}
              onChange={(e) => setPublishedBy(e.target.value)}
              placeholder="উদাঃ সাধারণ সম্পাদক / কার্যনির্বাহী কমিটি"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              বিজ্ঞপ্তির বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="সকল সম্মানিত সদস্যদের অবগতির জন্য বিস্তারিত লিখুন..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
            />
          </div>

          {/* Pin to Top Checkbox */}
          <div className="flex items-center gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="isPinned" className="text-xs text-slate-700 font-medium cursor-pointer">
              শীর্ষে পিন করে রাখুন (হেডারের নিচে জরুরি নোটিশ ব্যানারে প্রধানভাবে প্রদর্শিত হবে)
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingNotice ? 'আপডেট করুন' : 'নোটিশ প্রকাশ করুন'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
