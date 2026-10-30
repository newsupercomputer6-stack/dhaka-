import React, { useState, useEffect } from 'react';
import { X, Building2, Phone, MapPin, Calendar, Mail, Globe, Save, RotateCcw, Plus, Trash2, Camera, Shield, Target, Sparkles, HeartHandshake, Palette } from 'lucide-react';
import { OrgProfile } from '../types';
import { DEFAULT_ORG_PROFILE } from '../data/initialOrgProfile';

interface OrgProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgProfile: OrgProfile;
  onSaveOrgProfile: (profile: OrgProfile) => void;
  onOpenLogoModal: () => void;
  onOpenThemeModal?: () => void;
  logo: string | null;
}

export const OrgProfileModal: React.FC<OrgProfileModalProps> = ({
  isOpen,
  onClose,
  orgProfile,
  onSaveOrgProfile,
  onOpenLogoModal,
  onOpenThemeModal,
  logo,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'missionVision'>('general');
  const [name, setName] = useState(orgProfile.name);
  const [established, setEstablished] = useState(orgProfile.established);
  const [tagline, setTagline] = useState(orgProfile.tagline);
  const [address, setAddress] = useState(orgProfile.address);
  const [phones, setPhones] = useState<string[]>(orgProfile.contactPhones || []);
  const [newPhone, setNewPhone] = useState('');
  const [email, setEmail] = useState(orgProfile.email || '');
  const [website, setWebsite] = useState(orgProfile.website || '');
  
  // Mission & Vision states
  const [motto, setMotto] = useState(orgProfile.motto || DEFAULT_ORG_PROFILE.motto || '');
  const [mission, setMission] = useState(orgProfile.mission || DEFAULT_ORG_PROFILE.mission || '');
  const [vision, setVision] = useState(orgProfile.vision || DEFAULT_ORG_PROFILE.vision || '');
  const [commitment, setCommitment] = useState(orgProfile.commitment || DEFAULT_ORG_PROFILE.commitment || '');

  useEffect(() => {
    setName(orgProfile.name);
    setEstablished(orgProfile.established);
    setTagline(orgProfile.tagline);
    setAddress(orgProfile.address);
    setPhones(orgProfile.contactPhones || []);
    setEmail(orgProfile.email || '');
    setWebsite(orgProfile.website || '');
    setMotto(orgProfile.motto || DEFAULT_ORG_PROFILE.motto || '');
    setMission(orgProfile.mission || DEFAULT_ORG_PROFILE.mission || '');
    setVision(orgProfile.vision || DEFAULT_ORG_PROFILE.vision || '');
    setCommitment(orgProfile.commitment || DEFAULT_ORG_PROFILE.commitment || '');
  }, [orgProfile, isOpen]);

  if (!isOpen) return null;

  const handleAddPhone = () => {
    if (newPhone.trim() && !phones.includes(newPhone.trim())) {
      setPhones([...phones, newPhone.trim()]);
      setNewPhone('');
    }
  };

  const handleRemovePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedProfile: OrgProfile = {
      name: name.trim(),
      established: established.trim() || 'প্রতিষ্ঠিতঃ ১৯৮৬',
      tagline: tagline.trim(),
      address: address.trim(),
      contactPhones: phones.length > 0 ? phones : ['01713180019'],
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      motto: motto.trim(),
      mission: mission.trim(),
      vision: vision.trim(),
      commitment: commitment.trim(),
    };

    onSaveOrgProfile(updatedProfile);
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('আপনি কি সমিতির নাম, ঠিকানা এবং মিশন-ভিশন মূল তথ্যে ফিরিয়ে নিতে চান?')) {
      setName(DEFAULT_ORG_PROFILE.name);
      setEstablished(DEFAULT_ORG_PROFILE.established);
      setTagline(DEFAULT_ORG_PROFILE.tagline);
      setAddress(DEFAULT_ORG_PROFILE.address);
      setPhones(DEFAULT_ORG_PROFILE.contactPhones);
      setEmail(DEFAULT_ORG_PROFILE.email || '');
      setWebsite(DEFAULT_ORG_PROFILE.website || '');
      setMotto(DEFAULT_ORG_PROFILE.motto || '');
      setMission(DEFAULT_ORG_PROFILE.mission || '');
      setVision(DEFAULT_ORG_PROFILE.vision || '');
      setCommitment(DEFAULT_ORG_PROFILE.commitment || '');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif">
                সমিতি / কোম্পানী তথ্য ও মিশন-ভিশন সম্পাদনা
              </h2>
              <p className="text-xs text-emerald-200">
                নাম, ঠিকানা, যোগাযোগ এবং সংগঠনের মিশন ও ভিশন পরিবর্তন করুন
              </p>
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>সাধারণ তথ্য ও নাম</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('missionVision')}
            className={`pb-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'missionVision'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4 text-amber-500" />
            <span>মিশন, ভিশন ও মূলমন্ত্র</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-700 overflow-y-auto flex-1">
          
          {activeTab === 'general' ? (
            <>
              {/* Logo Strip with button */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xs border border-amber-300 overflow-hidden shrink-0">
                    {logo ? (
                      <img src={logo} alt="লোগো" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Shield className="w-7 h-7 text-slate-950" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">প্রতিষ্ঠানের অফিসিয়াল লোগো</div>
                    <div className="text-[11px] text-slate-500">লোগো ছবি পরিবর্তন বা যুক্ত করুন</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLogoModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>লোগো পরিবর্তন</span>
                </button>
              </div>

              {/* Theme & Color Strip */}
              {onOpenThemeModal && (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xs border border-indigo-300 text-white shrink-0">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">সাইটের কালার ও থিম কাস্টমাইজেশন</div>
                      <div className="text-[11px] text-slate-500">হেডার গ্রেডিয়েন্ট, বাটন ও হাইলাইট রঙ পরিবর্তন করুন</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenThemeModal();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-xs"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>কালার কাস্টমাইজ</span>
                  </button>
                </div>
              )}

              {/* Organization Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  কোম্পানী / সমিতি / প্রতিষ্ঠানের নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="উদাঃ বাজিতপুর সমিতি, ঢাকা"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900 text-base"
                />
              </div>

              {/* Established & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    স্থাপিত / প্রতিষ্ঠার তারিখ বা সাল
                  </label>
                  <input
                    type="text"
                    value={established}
                    onChange={(e) => setEstablished(e.target.value)}
                    placeholder="উদাঃ ১৩ই মার্চ, ১৯৮৬"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    অফিসিয়াল ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  স্লোগান / সংক্ষিপ্ত পরিচিতি বাক্য
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="উদাঃ সকল সম্মানিত সদস্যদের তথ্য ভাণ্ডার ও ডিজিটাল ডিরেক্টরি"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  অফিস / কার্যালয়ের ঠিকানা
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="উদাঃ ৭৯, তৃতীয় তলা, শান্তেশ্বরী সার্কুলার রোড, মালিবাগ, ঢাকা"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                />
              </div>

              {/* Contact Hotline Phones */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  জরুরি যোগাযোগের ফোন নম্বরসমূহ (হটলাইন)
                </label>
                
                {/* Added Phone Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  {phones.map((phone, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-300 text-xs font-mono font-semibold text-slate-800"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{phone}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(index)}
                        className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                        title="এই নম্বরটি মুছুন"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Phone Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPhone();
                      }
                    }}
                    placeholder="নতুন ফোন নম্বর (উদাঃ 01712345678)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নম্বর যোগ</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              
              {/* Motto */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>আমাদের মূলমন্ত্র (Core Motto)</span>
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="উদাঃ ঐক্য, সম্প্রীতি, সেবা ও উন্নয়ন।"
                  className="w-full px-3.5 py-2 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50/40 font-semibold text-slate-900 text-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  এই মূলমন্ত্রটি হেডার, ব্যানার ও অনলাইন নিবন্ধন ফরমে প্রদর্শিত হয়।
                </p>
              </div>

              {/* Mission */}
              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🎯 আমাদের মিশন (Mission)</span>
                </label>
                <textarea
                  rows={4}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="মিশনের বিস্তারিত বক্তব্য..."
                  className="w-full px-3.5 py-2 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/20 text-slate-800 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* Vision */}
              <div>
                <label className="block text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>🌟 আমাদের ভিশন (Vision)</span>
                </label>
                <textarea
                  rows={4}
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="ভিশনের বিস্তারিত বক্তব্য..."
                  className="w-full px-3.5 py-2 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50/20 text-slate-800 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* Commitment */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                  <span>আমাদের অঙ্গীকার (Our Commitment)</span>
                </label>
                <textarea
                  rows={2}
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                  placeholder="উদাঃ ঐক্যে শক্তি, সহযোগিতায় অগ্রগতি, মানবিকতায় সমৃদ্ধি..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-800 text-xs sm:text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>মূল তথ্যে ফিরিয়ে নিন</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
