import React, { useState } from 'react';
import { X, Phone, Copy, Check, MapPin, Building, Briefcase, Award, Shield, User, Edit3, Trash2 } from 'lucide-react';
import { Member } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  logo?: string | null;
  orgName?: string;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
  onEdit,
  onDelete,
  logo,
  orgName = 'বাজিতপুর সমিতি, ঢাকা',
}) => {
  const [copied, setCopied] = useState(false);

  if (!member) return null;

  const handleCopyAll = () => {
    const text = `${orgName} - সদস্য বিবরণী
ক্রমিক নং: ${member.sl} (${formatBnNumber(member.sl)})
নাম: ${member.name}
পিতা/স্বামী: ${member.fatherOrSpouse}
মোবাইল: ${member.phone}
পেশা: ${member.profession}
ফি: ৳${member.fee}
ইউনিয়ন: ${member.union}
স্থায়ী ঠিকানা: ${member.permanentAddress}
বর্তমান ঠিকানা: ${member.presentAddress}
রেফারেন্স: ${member.reference}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm border border-amber-300 overflow-hidden">
              {logo ? (
                <img src={logo} alt="লোগো" className="w-full h-full object-contain p-0.5" />
              ) : (
                <Shield className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="text-xs text-amber-300 font-semibold tracking-wider uppercase">
                {orgName}
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5 font-serif">
                সদস্য পরিচিতি ও তথ্য
              </h2>
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

        {/* Member Card Body */}
        <div className="p-6 space-y-5">
          
          {/* Main Info Strip with Photo */}
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            {/* Photo Avatar */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-600/30 shadow-xs shrink-0 flex items-center justify-center">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif truncate">
                {member.name}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5 truncate">
                {member.fatherOrSpouse && member.fatherOrSpouse !== '-' ? member.fatherOrSpouse : 'পিতা/স্বামী: অনুল্লিখিত'}
              </p>
              <div className="inline-block mt-1 text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {member.union}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] text-slate-400 uppercase font-mono">সদস্য নম্বর</div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 font-mono">
                #{formatBnNumber(member.sl)}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>পেশা</span>
              </div>
              <div className="font-semibold text-slate-800">
                {member.profession}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>সদস্য ফি</span>
              </div>
              <div className="font-semibold text-slate-800">
                ৳{formatBnNumber(member.fee)}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2">
              <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>মোবাইল নম্বর</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-mono text-base font-semibold text-slate-900">
                  {member.phone && member.phone !== '-' ? member.phone : 'কোন নম্বর নেই'}
                </div>
                {member.phone && member.phone !== '-' && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${member.phone}`}
                      className="px-2.5 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
                    >
                      কল করুন
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2">
              <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>ইউনিয়ন ও স্থায়ী ঠিকানা</span>
              </div>
              <div className="font-medium text-slate-900">
                {member.union}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {member.permanentAddress}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2">
              <div className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>বর্তমান ঠিকানা</span>
              </div>
              <div className="text-xs text-slate-700 font-medium leading-relaxed">
                {member.presentAddress}
              </div>
            </div>

            {member.reference && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 col-span-2">
                <div className="text-xs text-slate-500 mb-1">
                  রেফারেন্স / তালিকা সংক্রান্ত তথ্য
                </div>
                <div className="text-xs text-slate-600">
                  {member.reference}
                </div>
              </div>
            )}

          </div>

          {/* Modal Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="সকল তথ্য ক্লিপবোর্ডে কপি করুন"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>

              {onEdit && (
                <button
                  onClick={() => onEdit(member)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
                  title="ছবি, নাম বা অন্যান্য তথ্য সংশোধন করুন"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>তথ্য / ছবি সংশোধন</span>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(member)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
                  title="এই সদস্যকে তালিকা থেকে মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>মুছে ফেলুন</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition shadow-xs cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
