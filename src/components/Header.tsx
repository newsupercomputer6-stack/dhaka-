import React, { useState } from 'react';
import { Phone, MapPin, Calendar, FileSpreadsheet, Printer, UserPlus, Check, Copy, Shield, RotateCcw, Camera, Image as ImageIcon, Bell, Share2, Building2, Edit3, Target, Sparkles, Palette } from 'lucide-react';
import { formatBnNumber } from '../utils/exportExcel';
import { OrgProfile, ThemeConfig } from '../types';

interface HeaderProps {
  totalMembers: number;
  filteredCount: number;
  onExportExcel: () => void;
  onPrint: () => void;
  onOpenAddMember: () => void;
  onOpenLogoModal: () => void;
  onOpenOrgProfileModal: () => void;
  onOpenMissionVisionModal?: () => void;
  onOpenNoticeBoard?: () => void;
  onOpenShareLinkModal?: () => void;
  onOpenThemeModal?: () => void;
  noticeCount?: number;
  logo: string | null;
  orgProfile: OrgProfile;
  theme: ThemeConfig;
  onResetData?: () => void;
  isModified?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalMembers,
  filteredCount,
  onExportExcel,
  onPrint,
  onOpenAddMember,
  onOpenLogoModal,
  onOpenOrgProfileModal,
  onOpenMissionVisionModal,
  onOpenNoticeBoard,
  onOpenShareLinkModal,
  onOpenThemeModal,
  noticeCount = 0,
  logo,
  orgProfile,
  theme,
  onResetData,
  isModified = false,
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const contactPhones = orgProfile.contactPhones && orgProfile.contactPhones.length > 0 
    ? orgProfile.contactPhones 
    : ['01713180019'];

  const motto = orgProfile.motto || 'ঐক্য, সম্প্রীতি, সেবা ও উন্নয়ন।';

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <header 
      className="text-white shadow-lg border-b transition-colors duration-300"
      style={{ background: theme.headerGradient, borderColor: theme.headerBorder }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Brand & Organization Title */}
          <div className="flex items-start gap-4">
            
            {/* Interactive Logo Badge */}
            <div 
              onClick={onOpenLogoModal}
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})` }}
              className="relative group cursor-pointer w-16 h-16 rounded-xl flex items-center justify-center shadow-md border border-white/40 shrink-0 overflow-hidden hover:scale-105 transition duration-150"
              title="লোগো যুক্ত বা পরিবর্তন করতে ক্লিক করুন"
            >
              {logo ? (
                <img
                  src={logo}
                  alt={orgProfile.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <Shield className="w-9 h-9 text-slate-950" />
              )}

              {/* Hover Camera Overlay */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-amber-300 transition duration-150">
                <Camera className="w-4 h-4" />
                <span className="text-[9px] font-bold mt-0.5 text-white">লোগো</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
                  {orgProfile.name}
                </h1>
                
                {/* Quick Edit Profile Icon */}
                <button
                  onClick={onOpenOrgProfileModal}
                  className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition cursor-pointer"
                  title="কোম্পানী / সমিতির নাম ও প্রোফাইল পরিবর্তন করুন"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-600/50">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  {orgProfile.established}
                </span>
              </div>

              {/* Core Motto Strip (Clickable to open Mission & Vision) */}
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <button
                  onClick={onOpenMissionVisionModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-medium cursor-pointer transition"
                  title="আমাদের মিশন ও ভিশন দেখতে ক্লিক করুন"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span className="font-bold">মূলমন্ত্র:</span>
                  <span>{motto}</span>
                </button>
              </div>
              
              <p className="text-emerald-100/90 text-sm mt-1">
                {orgProfile.tagline}
              </p>

              {/* Office Address */}
              <div className="flex items-center gap-2 mt-2 text-xs text-emerald-200/80">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-white font-medium">অফিস / কার্যালয়:</strong> {orgProfile.address}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-end lg:self-center">
            
            {/* Mission & Vision Button */}
            {onOpenMissionVisionModal && (
              <button
                onClick={onOpenMissionVisionModal}
                style={{ 
                  background: `linear-gradient(to right, ${theme.accent}, ${theme.accentHover})`,
                  color: '#0f172a'
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg hover:brightness-105 text-xs sm:text-sm font-bold transition shadow-md border border-white/30 cursor-pointer"
                title="বাজিতপুর সমিতি ঢাকা-এর মিশন, ভিশন ও মূলমন্ত্র দেখুন"
              >
                <Target className="w-4 h-4 text-slate-950" />
                <span>মিশন ও ভিশন</span>
              </button>
            )}

            {/* Color Customizer Button */}
            {onOpenThemeModal && (
              <button
                onClick={onOpenThemeModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition shadow-sm border border-white/25 cursor-pointer"
                title="সাইটের কালার ও থিম পরিবর্তন করুন"
              >
                <Palette className="w-4 h-4 text-amber-300" />
                <span>কালার থিম</span>
              </button>
            )}

            {/* Edit Org Profile Button */}
            <button
              onClick={onOpenOrgProfileModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition shadow-sm border border-white/20 cursor-pointer"
              title="কোম্পানী / সমিতির নাম ও তথ্য সম্পাদনা করুন"
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>নাম পরিবর্তন</span>
            </button>

            {/* Share Registration Link Button */}
            {onOpenShareLinkModal && (
              <button
                onClick={onOpenShareLinkModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold transition shadow-md border border-white/30 cursor-pointer animate-in fade-in"
                title="সদস্য তথ্য সংগ্রহের অনলাইন ফরম লিংক কপি ও শেয়ার করুন"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>নিবন্ধন লিংক</span>
              </button>
            )}

            {/* Notice Board Button */}
            {onOpenNoticeBoard && (
              <button
                onClick={onOpenNoticeBoard}
                className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition shadow-sm border border-white/20 cursor-pointer animate-in fade-in"
                title="সমিতির নোটিশ বোর্ড ও জরুরি বিজ্ঞপ্তি দেখুন"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                <span>নোটিশ বোর্ড</span>
                {noticeCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ml-0.5">
                    {formatBnNumber(noticeCount)}
                  </span>
                )}
              </button>
            )}

            {/* Logo Settings Button */}
            <button
              onClick={onOpenLogoModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition shadow-sm border border-white/20 cursor-pointer"
              title="অফিসিয়াল লোগো যুক্ত বা পরিবর্তন করুন"
            >
              <ImageIcon className="w-4 h-4 text-amber-300" />
              <span>লোগো</span>
            </button>

            {isModified && onResetData && (
              <button
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium transition border border-amber-400/40 cursor-pointer"
                title="পরিবর্তন বাতিল করে মূল তালিকায় ফিরে যান"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
                <span>মূল তালিকা পুনরুদ্ধার</span>
              </button>
            )}

            <button
              onClick={onOpenAddMember}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium transition shadow-sm border border-emerald-600/60 cursor-pointer"
              title="অ্যাডমিন হিসেবে নতুন সদস্য যুক্ত করুন"
            >
              <UserPlus className="w-4 h-4 text-emerald-200" />
              <span>নতুন সদস্য</span>
            </button>

            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium transition shadow-sm border border-emerald-600/60 cursor-pointer"
              title="Excel (CSV) ফাইল ডাউনলোড করুন"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Excel ডাউনলোড</span>
            </button>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-medium transition shadow-sm border border-slate-700 cursor-pointer"
              title="সদস্য তালিকা প্রিন্ট বা PDF হিসেবে সেভ করুন"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>প্রিন্ট / PDF</span>
            </button>
          </div>
        </div>

        {/* Hotlines & Contact Strip */}
        <div className="mt-5 pt-4 border-t border-emerald-800/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              জরুরি যোগাযোগ:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {contactPhones.map(phone => (
                <button
                  key={phone}
                  onClick={() => handleCopyPhone(phone)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/50 transition font-mono cursor-pointer"
                  title="ক্লিক করে ফোন নম্বর কপি করুন"
                >
                  <span>{phone}</span>
                  {copiedPhone === phone ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-emerald-400/70" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="text-emerald-200/90 font-medium">
            তালিকায় মোট সদস্য: <span className="text-amber-400 font-bold">{formatBnNumber(totalMembers)}</span> জন
            {filteredCount !== totalMembers && (
              <span className="ml-2 text-white bg-emerald-800/90 px-2 py-0.5 rounded">
                (ফিল্টারকৃত: {formatBnNumber(filteredCount)} জন)
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
