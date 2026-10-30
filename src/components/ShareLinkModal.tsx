import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Send, Users, Sparkles } from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterView: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  onOpenRegisterView,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  // Compute share URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const registrationUrl = `${origin}${pathname}?view=register`;

  const shareText = `আসসালামু আলাইকুম,
বাজিতপুর সমিতি, ঢাকা-এর সম্মানিত সদস্য তথ্য ভাণ্ডার ও ডিজিটাল ডিরেক্টরিতে নাম ও মোবাইল নম্বর অন্তর্ভুক্তির কার্যক্রম চলছে।

ঢাকায় অবস্থানরত বাজিতপুর উপজেলার সকল সম্মানিত সদস্যদের নিচের লিংকে ক্লিক করে ফরমটি পূরণ করার জন্য বিনীত অনুরোধ জানানো হচ্ছে। ফরম পূরণ করার সাথে সাথে স্বয়ংক্রিয়ভাবে সদস্য তালিকায় আপনার নাম যুক্ত হয়ে যাবে:

🔗 অনলাইন ফরম লিংক:
${registrationUrl}

— বাজিতপুর সমিতি, ঢাকা`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">অনলাইন সদস্য নিবন্ধন লিংক</h2>
              <p className="text-xs text-emerald-200">সবার সাথে শেয়ার করার জন্য প্রস্তুত লিংক</p>
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm text-slate-700">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-900 leading-relaxed">
              এই লিংকটি হোয়াটসঅ্যাপ, ফেসবুক বা এসএমএসে পাঠিয়ে দিন। যে কেউ লিংকে ঢুকে নিজের বা পরিবারের সদস্যদের নাম ও মোবাইল নম্বর পূরণ করলেই তা <strong>স্বয়ংক্রিয়ভাবে এই ডিরেক্টরিতে যুক্ত হয়ে যাবে</strong>।
            </p>
          </div>

          {/* Shareable Link Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              সরাসরি অনলাইন ফরম লিংক:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={registrationUrl}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
              </button>
            </div>
          </div>

          {/* One-click Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে শেয়ার করুন</span>
            </button>

            <button
              onClick={handleCopyMessage}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition cursor-pointer"
            >
              {copiedMessage ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedMessage ? 'বার্তা কপি হয়েছে!' : 'সম্পূর্ণ মেসেজ কপি করুন'}</span>
            </button>
          </div>

          {/* Test Link Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onOpenRegisterView();
              }}
              className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>নিজে ফরমটি দেখতে বা পূরণ করতে চান? ক্লিক করুন</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
