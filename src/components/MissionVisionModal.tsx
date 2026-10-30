import React, { useState } from 'react';
import { X, Target, Sparkles, HeartHandshake, Shield, Copy, Check, Printer, Edit3 } from 'lucide-react';
import { OrgProfile, ThemeConfig } from '../types';

interface MissionVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgProfile: OrgProfile;
  logo: string | null;
  onOpenOrgProfileModal?: () => void;
  theme?: ThemeConfig;
}

export const MissionVisionModal: React.FC<MissionVisionModalProps> = ({
  isOpen,
  onClose,
  orgProfile,
  logo,
  onOpenOrgProfileModal,
  theme,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const motto = orgProfile.motto || 'ঐক্য, সম্প্রীতি, সেবা ও উন্নয়ন।';
  const mission = orgProfile.mission || 'ঢাকায় বসবাসরত বাজিতপুরবাসীকে ঐক্যবদ্ধ করে পারস্পরিক সহযোগিতা, সামাজিক সম্প্রীতি ও ভ্রাতৃত্ববোধ সুদৃঢ় করা। শিক্ষা, স্বাস্থ্য, সংস্কৃতি ও মানবিক সেবামূলক কার্যক্রমের মাধ্যমে অসহায় ও সুবিধাবঞ্চিত মানুষের পাশে দাঁড়ানো। বাজিতপুরের ইতিহাস, ঐতিহ্য, লোকসংস্কৃতি ও মুক্তিযুদ্ধের স্মৃতি সংরক্ষণ এবং নতুন প্রজন্মের কাছে তা তুলে ধরা। একই সঙ্গে বাজিতপুরের আর্থসামাজিক উন্নয়নে সম্মিলিত উদ্যোগ গ্রহণ ও একটি মানবিক, প্রগতিশীল ও কল্যাণমুখী সমাজ গঠনে ভূমিকা রাখা।';
  const vision = orgProfile.vision || 'একটি ঐক্যবদ্ধ, মানবিক, শিক্ষিত, সমৃদ্ধ ও মর্যাদাপূর্ণ বাজিতপুর গড়ে তোলা—যেখানে ঢাকায় বসবাসরত বাজিতপুরবাসীর পারস্পরিক বন্ধন হবে শক্তিশালী, প্রতিটি মানুষ পাবে সহযোগিতা ও এগিয়ে যাওয়ার সুযোগ এবং আমাদের ইতিহাস, ঐতিহ্য ও সাংস্কৃতিক পরিচয় থাকবে সুরক্ষিত। দেশ-বিদেশে ছড়িয়ে থাকা বাজিতপুরবাসীকে একই বন্ধনে আবদ্ধ করে একটি আদর্শ, স্বচ্ছ, জবাবদিহিমূলক ও জনকল্যাণমুখী সংগঠন হিসেবে বাজিতপুর সমিতি, ঢাকা প্রতিষ্ঠা করাই আমাদের দীর্ঘমেয়াদি স্বপ্ন।';
  const commitment = orgProfile.commitment || 'ঐক্যে শক্তি, সহযোগিতায় অগ্রগতি, মানবিকতায় সমৃদ্ধি—বাজিতপুরবাসীর কল্যাণে আমরা সবাই একসঙ্গে।';

  const handleCopy = () => {
    const text = `${orgProfile.name}
মিশন (Mission) ও ভিশন (Vision)

আমাদের মূলমন্ত্র: ${motto}

🎯 আমাদের মিশন (Mission):
${mission}

🌟 আমাদের ভিশন (Vision):
${vision}

আমাদের অঙ্গীকার:
${commitment}

অফিস: ${orgProfile.address}
যোগাযোগ: ${orgProfile.contactPhones?.join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ceremonial Header */}
        <div 
          style={{ background: theme?.headerGradient }}
          className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 relative overflow-hidden"
        >
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg border border-amber-300/40 shrink-0 overflow-hidden">
              {logo ? (
                <img src={logo} alt={orgProfile.name} className="w-full h-full object-contain p-1" />
              ) : (
                <Shield className="w-8 h-8 text-slate-950" />
              )}
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                প্রতিষ্ঠানের আদর্শ ও লক্ষ্য
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
                {orgProfile.name}
              </h2>
              <p className="text-xs text-emerald-200">
                মিশন (Mission) ও ভিশন (Vision) দলিল
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition cursor-pointer relative z-10"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* Core Motto Golden Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-md border border-amber-300 text-center relative overflow-hidden">
            <div className="text-[11px] uppercase tracking-wider font-bold text-amber-950/80 mb-0.5">
              আমাদের মূলমন্ত্র (Core Motto)
            </div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-slate-950">
              {motto}
            </div>
          </div>

          {/* Mission Card (🎯) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-900 font-serif flex items-center gap-2">
                  <span>🎯 আমাদের মিশন (Mission)</span>
                </h3>
                <span className="text-xs text-emerald-600 font-medium">আমরা যা বাস্তবায়নে নিবেদিতপ্রাণ</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify sm:text-left">
              {mission}
            </p>

            {/* Quick Pillars of Mission */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200/60">
                🤝 ঐক্য ও ভ্রাতৃত্ববোধ
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200/60">
                🩺 শিক্ষা ও স্বাস্থ্যসেবা
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200/60">
                🏛️ ঐতিহ্য ও মুক্তিযুদ্ধ স্মৃতি
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-lg border border-emerald-200/60">
                🌱 সামাজিক কল্যাণ ও উন্নয়ন
              </span>
            </div>
          </div>

          {/* Vision Card (🌟) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-amber-950 font-serif flex items-center gap-2">
                  <span>🌟 আমাদের ভিশন (Vision)</span>
                </h3>
                <span className="text-xs text-amber-700 font-medium">আগামীর স্বপ্ন ও দীর্ঘমেয়াদি পথচলা</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify sm:text-left">
              {vision}
            </p>

            {/* Quick Pillars of Vision */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-medium rounded-lg border border-amber-200/60">
                ✨ মানবিক ও শিক্ষিত সমাজ
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-medium rounded-lg border border-amber-200/60">
                🌏 বিশ্বময় বাজিতপুরীদের মেলবন্ধন
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-medium rounded-lg border border-amber-200/60">
                ⚖️ স্বচ্ছ ও জবাবদিহিমূলক নেতৃত্ব
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-medium rounded-lg border border-amber-200/60">
                🛡️ সাংস্কৃতিক পরিচয় সুরক্ষা
              </span>
            </div>
          </div>

          {/* Commitment Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-700 shadow-sm text-center relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center mb-2">
              <HeartHandshake className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-300 mb-1">
              আমাদের অঙ্গীকার
            </div>
            <p className="text-base sm:text-lg font-serif font-medium text-amber-200 leading-relaxed max-w-xl mx-auto">
              &ldquo;{commitment}&rdquo;
            </p>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-white border-t border-slate-200 p-4 px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition cursor-pointer"
              title="মিশন ও ভিশন এর সম্পূর্ণ বক্তব্য কপি করুন"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">কপি করা হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>কপি করুন</span>
                </>
              )}
            </button>

            {onOpenOrgProfileModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenOrgProfileModal();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold transition cursor-pointer border border-emerald-200"
                title="মিশন বা ভিশনের টেক্সট সম্পাদনা করুন"
              >
                <Edit3 className="w-4 h-4 text-emerald-700" />
                <span>সম্পাদনা</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-medium transition cursor-pointer"
              title="প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
