import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { Member } from '../types';
import { formatBnNumber } from '../utils/exportExcel';
import { PhotoUploader } from './PhotoUploader';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (newMember: Member) => void;
  nextSl: number;
  unions: string[];
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  nextSl,
  unions,
}) => {
  const [name, setName] = useState('');
  const [fatherOrSpouse, setFatherOrSpouse] = useState('');
  const [phone, setPhone] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [profession, setProfession] = useState('চাকুরী');
  const [fee, setFee] = useState<number>(500);
  const [union, setUnion] = useState<string>(unions[0] || 'বাজিতপুর পৌরসভা');
  const [reference, setReference] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: Member = {
      sl: nextSl,
      name: name.trim(),
      fatherOrSpouse: fatherOrSpouse.trim() || '-',
      phone: phone.trim() || '-',
      permanentAddress: permanentAddress.trim() || 'বাজিতপুর, কিশোরগঞ্জ',
      presentAddress: presentAddress.trim() || 'ঢাকা',
      profession: profession.trim() || 'ব্যবসা',
      fee: Number(fee) || 500,
      union: union || 'বাজিতপুর পৌরসভা',
      reference: reference.trim() || 'বাজিতপুর সমিতি ঢাকা',
      photo: photo || undefined,
    };

    onAddMember(newMember);
    // Reset fields
    setName('');
    setFatherOrSpouse('');
    setPhone('');
    setPermanentAddress('');
    setPresentAddress('');
    setPhoto(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">নতুন সদস্য অন্তর্ভুক্তি (ক্রমিক নং #{formatBnNumber(nextSl)})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm text-slate-700 max-h-[80vh] overflow-y-auto">
          
          {/* Photo Uploader */}
          <PhotoUploader
            currentPhoto={photo}
            onPhotoChange={setPhoto}
            memberName={name}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              সদস্যের নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="উদাঃ মোঃ আনিসুর রহমান"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                পিতা / স্বামীর নাম
              </label>
              <input
                type="text"
                value={fatherOrSpouse}
                onChange={(e) => setFatherOrSpouse(e.target.value)}
                placeholder="উদাঃ মোঃ নূরুল ইসলাম"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                মোবাইল নম্বর
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="উদাঃ 01712345678"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ইউনিয়ন / পৌরসভা
              </label>
              <select
                value={union}
                onChange={(e) => setUnion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {unions.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                পেশা
              </label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="উদাঃ চাকুরী / ব্যবসা"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                সদস্য ফি (টাকা)
              </label>
              <select
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value={500}>৳৫০০ (সাধারণ ফি)</option>
                <option value={100}>৳১০০ (বিশেষ ফি)</option>
                <option value={0}>৳০ (কোনো ফি নেই)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                রেফারেন্স নাম
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="উদাঃ শামীম / দলগত তালিকা"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              স্থায়ী ঠিকানা (গ্রাম/মহল্লা, বাজিতপুর, কিশোরগঞ্জ)
            </label>
            <input
              type="text"
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
              placeholder="উদাঃ দিলালপুর, বাজিতপুর, কিশোরগঞ্জ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              বর্তমান ঠিকানা (ঢাকা বা কর্মস্থল)
            </label>
            <input
              type="text"
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
              placeholder="উদাঃ শান্তিবাগ, মালিবাগ, ঢাকা"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
