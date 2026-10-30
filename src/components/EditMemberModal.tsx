import React, { useState, useEffect } from 'react';
import { X, Edit3, Save } from 'lucide-react';
import { Member } from '../types';
import { formatBnNumber } from '../utils/exportExcel';
import { PhotoUploader } from './PhotoUploader';

interface EditMemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMember: Member) => void;
  unions: string[];
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
  unions,
}) => {
  const [name, setName] = useState('');
  const [fatherOrSpouse, setFatherOrSpouse] = useState('');
  const [phone, setPhone] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [profession, setProfession] = useState('');
  const [fee, setFee] = useState<number>(500);
  const [union, setUnion] = useState<string>('');
  const [reference, setReference] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setFatherOrSpouse(member.fatherOrSpouse === '-' ? '' : member.fatherOrSpouse || '');
      setPhone(member.phone === '-' ? '' : member.phone || '');
      setPermanentAddress(member.permanentAddress || '');
      setPresentAddress(member.presentAddress || '');
      setProfession(member.profession || '');
      setFee(member.fee || 500);
      setUnion(member.union || (unions[0] || 'বাজিতপুর পৌরসভা'));
      setReference(member.reference || '');
      setPhoto(member.photo);
    }
  }, [member, unions]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Member = {
      ...member,
      name: name.trim(),
      fatherOrSpouse: fatherOrSpouse.trim() || '-',
      phone: phone.trim() || '-',
      permanentAddress: permanentAddress.trim() || 'বাজিতপুর, কিশোরগঞ্জ',
      presentAddress: presentAddress.trim() || 'ঢাকা',
      profession: profession.trim() || 'অন্যান্য',
      fee: Number(fee) || 0,
      union: union.trim() || 'বাজিতপুর পৌরসভা',
      reference: reference.trim() || member.reference || '',
      photo: photo || undefined,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">সদস্য তথ্য সংশোধন / সম্পাদন</h2>
              <p className="text-xs text-emerald-200">
                ক্রমিক নং #{formatBnNumber(member.sl)} ({member.sl}) — {member.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition cursor-pointer"
            title="বাতিল করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm text-slate-700 max-h-[80vh] overflow-y-auto">
          
          {/* Member Photo Uploader */}
          <PhotoUploader
            currentPhoto={photo}
            onPhotoChange={setPhoto}
            memberName={name || member.name}
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
              placeholder="সদস্যের পূর্ণ নাম"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                পিতা / স্বামীর নাম
              </label>
              <input
                type="text"
                value={fatherOrSpouse}
                onChange={(e) => setFatherOrSpouse(e.target.value)}
                placeholder="পিতা অথবা স্বামীর নাম"
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
                placeholder="01xxxxxxxxx"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ইউনিয়ন / পৌরসভা
              </label>
              <select
                value={union}
                onChange={(e) => setUnion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {unions.map((u) => (
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
                placeholder="উদাঃ চাকুরী / ব্যবসা / ডাক্তার"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                রেফারেন্স / নোট
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="তালিকা বা রেফারেন্স সংক্রান্ত তথ্য"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              স্থায়ী ঠিকানা (বাজিতপুর)
            </label>
            <textarea
              rows={2}
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
              placeholder="গ্রাম, ডাকঘর, ইউনিয়ন, বাজিতপুর, কিশোরগঞ্জ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              বর্তমান ঠিকানা (ঢাকা বা বর্তমান অবস্থান)
            </label>
            <textarea
              rows={2}
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
              placeholder="বাসা/রোড, এলাকা, ঢাকা"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition text-xs font-medium cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition text-xs font-medium shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
