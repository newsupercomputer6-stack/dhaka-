import React, { useState } from 'react';
import { Shield, CheckCircle2, UserPlus, Phone, MapPin, Building, Briefcase, Award, ArrowLeft, ArrowRight, Share2, Copy, Check, Sparkles, Target, ChevronDown, ChevronUp, HeartHandshake } from 'lucide-react';
import { Member, OrgProfile, ThemeConfig } from '../types';
import { formatBnNumber } from '../utils/exportExcel';
import { DEFAULT_ORG_PROFILE } from '../data/initialOrgProfile';
import { DEFAULT_THEME } from '../utils/theme';
import { PhotoUploader } from './PhotoUploader';

interface PublicRegistrationPageProps {
  onRegister: (memberData: Omit<Member, 'sl'>) => Promise<Member>;
  unions: string[];
  logo: string | null;
  onGoToDirectory: () => void;
  orgProfile?: OrgProfile;
  theme?: ThemeConfig;
}

export const PublicRegistrationPage: React.FC<PublicRegistrationPageProps> = ({
  onRegister,
  unions,
  logo,
  onGoToDirectory,
  orgProfile = DEFAULT_ORG_PROFILE,
  theme,
}) => {
  const activeTheme = theme || orgProfile.themeConfig || DEFAULT_THEME;
  const [name, setName] = useState('');
  const [fatherOrSpouse, setFatherOrSpouse] = useState('');
  const [phone, setPhone] = useState('');
  const [union, setUnion] = useState(unions[0] || 'বাজিতপুর পৌরসভা');
  const [profession, setProfession] = useState('চাকুরী');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [fee, setFee] = useState<number>(500);
  const [reference, setReference] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMissionVision, setShowMissionVision] = useState(false);

  const motto = orgProfile.motto || DEFAULT_ORG_PROFILE.motto || 'ঐক্য, সম্প্রীতি, সেবা ও উন্নয়ন।';
  const mission = orgProfile.mission || DEFAULT_ORG_PROFILE.mission || '';
  const vision = orgProfile.vision || DEFAULT_ORG_PROFILE.vision || '';
  const commitment = orgProfile.commitment || DEFAULT_ORG_PROFILE.commitment || '';

  const defaultUnions = unions.length > 0 ? unions : [
    'বাজিতপুর পৌরসভা',
    'দিলালপুর ইউনিয়ন',
    'সরারচর ইউনিয়ন',
    'বলিয়ার্দী ইউনিয়ন',
    'গাজীরচর ইউনিয়ন',
    'পিরিজপুর ইউনিয়ন',
    'হালিমপুর ইউনিয়ন',
    'মাইজচর ইউনিয়ন',
    'হিলচিয়া ইউনিয়ন',
    'কৈলাগ ইউনিয়ন',
    'হুমায়ুনপুর ইউনিয়ন'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    try {
      setIsSubmitting(true);
      const newMember = await onRegister({
        name: name.trim(),
        fatherOrSpouse: fatherOrSpouse.trim() || '-',
        phone: phone.trim() || '-',
        permanentAddress: permanentAddress.trim() || 'বাজিতপুর, কিশোরগঞ্জ',
        presentAddress: presentAddress.trim() || 'ঢাকা',
        profession: profession.trim() || 'অন্যান্য',
        fee: Number(fee) || 500,
        union: union || 'বাজিতপুর পৌরসভা',
        reference: reference.trim() || 'অনলাইন নিবন্ধন ফরম',
        photo: photo || undefined,
      });

      setRegisteredMember(newMember);
    } catch (err) {
      console.error('Registration error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setFatherOrSpouse('');
    setPhone('');
    setPermanentAddress('');
    setPresentAddress('');
    setProfession('চাকুরী');
    setFee(500);
    setReference('');
    setPhoto(undefined);
    setRegisteredMember(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-800 flex flex-col py-6 px-4 sm:px-6 lg:px-8">
      
      {/* Top Navbar */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between mb-5">
        <button
          onClick={onGoToDirectory}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>মূল সদস্য তালিকায় যান</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-white px-3 py-2 rounded-xl shadow-xs border border-slate-200 transition cursor-pointer"
          title="এই ফরমের লিংক কপি করে বন্ধুদের সাথে শেয়ার করুন"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-emerald-600" />}
          <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'ফরমের লিংক কপি'}</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header Banner */}
        <div 
          style={{ background: activeTheme.headerGradient }}
          className="text-white p-6 sm:p-8 text-center relative"
        >
          <div className="flex justify-center mb-3">
            <div 
              style={{ background: `linear-gradient(135deg, ${activeTheme.accent}, ${activeTheme.accentHover})` }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50 overflow-hidden p-1.5"
            >
              {logo ? (
                <img src={logo} alt={orgProfile.name} className="w-full h-full object-contain" />
              ) : (
                <Shield className="w-12 h-12 text-slate-950" />
              )}
            </div>
          </div>

          <div 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.25)' }}
            className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-white border mb-2"
          >
            {orgProfile.established}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
            {orgProfile.name}
          </h1>
          <p 
            style={{ color: activeTheme.accentGlow }}
            className="font-medium text-sm mt-1"
          >
            সদস্য তথ্য সংগ্রহ ও অনলাইন নিবন্ধন ফরম
          </p>
          <p className="text-white/80 text-xs mt-2 max-w-lg mx-auto leading-relaxed">
            {orgProfile.tagline}। তথ্যাবলী নির্ভুলভাবে সংরক্ষণের জন্য নিচের ফরমটি পূরণ করুন। তথ্য প্রদানের পর তা স্বয়ংক্রিয়ভাবে সদস্য তালিকায় যুক্ত হয়ে যাবে।
          </p>
        </div>

        {/* Core Motto Strip with Mission/Vision expander */}
        <div 
          style={{ background: `linear-gradient(to right, ${activeTheme.accent}, ${activeTheme.accentHover})` }}
          className="text-slate-950 px-4 py-2.5 border-b border-black/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
        >
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              <strong className="font-bold">আমাদের মূলমন্ত্র:</strong> {motto}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMissionVision(!showMissionVision)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 hover:bg-slate-800 font-semibold text-[11px] transition cursor-pointer shrink-0"
          >
            <Target className="w-3.5 h-3.5" />
            <span>{showMissionVision ? 'মিশন ও ভিশন লুকান' : 'মিশন ও ভিশন পড়ুন'}</span>
            {showMissionVision ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Mission & Vision Box */}
        {showMissionVision && (
          <div className="p-5 bg-emerald-950 text-white border-b border-emerald-800 space-y-4 animate-in fade-in duration-150">
            {/* Mission */}
            <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/60">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1.5 font-serif">
                <Target className="w-4 h-4" />
                <span>🎯 আমাদের মিশন (Mission)</span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed text-justify">
                {mission}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-teal-900/60 p-4 rounded-xl border border-teal-700/60">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1.5 font-serif">
                <Sparkles className="w-4 h-4" />
                <span>🌟 আমাদের ভিশন (Vision)</span>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed text-justify">
                {vision}
              </p>
            </div>

            {/* Commitment */}
            {commitment && (
              <div className="bg-slate-900/70 p-3 rounded-xl border border-amber-400/30 text-center">
                <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block mb-0.5">
                  আমাদের অঙ্গীকার
                </span>
                <p className="text-xs font-serif italic text-amber-100">
                  &ldquo;{commitment}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Content Section: Form or Success */}
        {registeredMember ? (
          <div className="p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                নিবন্ধন সফল হয়েছে!
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                ধন্যবাদ <strong>{registeredMember.name}</strong>, আপনার তথ্য সফলভাবে {orgProfile.name}-এর সদস্য তালিকায় অন্তর্ভুক্ত হয়েছে।
              </p>
            </div>

            {/* Member Badge Card */}
            <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs text-slate-500">আপনার সদস্য ক্রমিক নম্বর:</span>
                <span className="text-lg font-mono font-extrabold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-md">
                  #{formatBnNumber(registeredMember.sl)}
                </span>
              </div>

              <div className="text-sm">
                <span className="text-slate-500">নাম:</span> <strong className="text-slate-900">{registeredMember.name}</strong>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">মোবাইল:</span> <strong className="font-mono text-slate-900">{registeredMember.phone}</strong>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">ইউনিয়ন:</span> <strong className="text-slate-900">{registeredMember.union}</strong>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">পেশা:</span> <strong className="text-slate-900">{registeredMember.profession}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={onGoToDirectory}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer"
              >
                <span>সদস্য তালিকায় নিজের নাম দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition cursor-pointer"
              >
                আরেকজনের তথ্য জমা দিন
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-sm text-slate-700">
            
            {/* Photo Uploader */}
            <div className="pb-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                আপনার ছবি যুক্ত করুন (ঐচ্ছিক)
              </label>
              <div className="flex items-center gap-4">
                <PhotoUploader
                  currentPhoto={photo}
                  onPhotoChange={setPhoto}
                  memberName={name || 'সদস্য ছবি'}
                />
                <div className="text-xs text-slate-500">
                  <p className="font-medium text-slate-700">পাসপোর্ট সাইজ বা স্পষ্ট ছবি দিন</p>
                  <p>ক্যামেরা দিয়ে ছবি তুলুন বা গ্যালারি থেকে আপলোড করুন</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সদস্যের পুরো নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="উদাঃ মোঃ আনিসুর রহমান"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Father / Husband Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                পিতা / স্বামীর নাম
              </label>
              <input
                type="text"
                value={fatherOrSpouse}
                onChange={(e) => setFatherOrSpouse(e.target.value)}
                placeholder="উদাঃ মৃত আব্দুর রশিদ"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Phone & Union */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বাজিতপুরের ইউনিয়ন <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <select
                    value={union}
                    onChange={(e) => setUnion(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    {defaultUnions.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Profession & Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পেশা / কর্মসংস্থান
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="উদাঃ চাকুরী, ব্যবসা, শিক্ষকতা, ডাক্তার"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সদস্য ফি (টাকা)
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Present Address in Dhaka */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                বর্তমান ঠিকানা (ঢাকা)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  value={presentAddress}
                  onChange={(e) => setPresentAddress(e.target.value)}
                  placeholder="উদাঃ বাসা নং-১২, রোড নং-৪, ধানমন্ডি, ঢাকা"
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Permanent Address in Bajitpur */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                স্থায়ী ঠিকানা (বাজিতপুর)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  placeholder="উদাঃ গ্রামঃ ভাগলপুর, ডাকঘরঃ বাজিতপুর, কিশোরগঞ্জ"
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Reference */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                রেফারেন্স / পরিচয় করিয়ে দেওয়া সদস্য (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="উদাঃ সাধারণ সম্পাদক / জীবন সদস্য নাম"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: activeTheme.primary }}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 hover:brightness-110 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition disabled:opacity-50 cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                <span>{isSubmitting ? 'তথ্য সংরক্ষণ করা হচ্ছে...' : 'সদস্য তথ্য জমা দিন (অটো যোগ হবে)'}</span>
              </button>
              <p className="text-center text-xs text-slate-500 mt-2">
                ফরম জমা দেওয়ার সাথে সাথেই আপনার তথ্য বাজিতপুর সমিতি ঢাকা-এর তালিকায় নিবন্ধিত হয়ে যাবে।
              </p>
            </div>

          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-2xl mx-auto w-full text-center text-xs text-slate-500 mt-6 pb-6">
        <p className="font-semibold text-slate-700">{orgProfile.name}</p>
        <p>{orgProfile.address}</p>
        <p className="mt-1 text-slate-400">
          যোগাযোগঃ {orgProfile.contactPhones?.join(', ')}
        </p>
      </div>

    </div>
  );
};
