import React, { useState } from 'react';
import { Phone, Copy, Check, MapPin, Building, Briefcase, Eye, User, Edit3, Trash2 } from 'lucide-react';
import { Member } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface MemberCardsProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
  onEditMember?: (member: Member) => void;
  onDeleteMember?: (member: Member) => void;
}

export const MemberCards: React.FC<MemberCardsProps> = ({
  members,
  onSelectMember,
  onEditMember,
  onDeleteMember,
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    if (!phone || phone === '-') return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
        <p className="text-base font-medium">কোন সদস্য খুঁজে পাওয়া যায়নি</p>
        <p className="text-xs text-slate-400 mt-1">অনুসন্ধান বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <div
          key={member.sl}
          onClick={() => onSelectMember(member)}
          className="bg-white rounded-xl border border-slate-200 hover:border-emerald-500/80 hover:shadow-md transition p-4 flex flex-col justify-between cursor-pointer group"
        >
          {/* Card Top */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {/* Photo / Avatar */}
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100 group-hover:border-emerald-400 transition shadow-xs">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-emerald-800 transition line-clamp-1">
                    {member.name}
                  </h3>
                  <div className="text-xs text-slate-500 line-clamp-1">
                    {member.fatherOrSpouse && member.fatherOrSpouse !== '-' ? member.fatherOrSpouse : 'পিতা/স্বামী: অনুল্লিখিত'}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  #{formatBnNumber(member.sl)}
                </span>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  ৳{formatBnNumber(member.fee)}
                </div>
              </div>
            </div>

            {/* Badges strip */}
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 flex-wrap">
              <span className="font-medium text-emerald-800">{member.union}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                {member.profession}
              </span>
            </div>

            {/* Addresses */}
            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  <strong className="text-slate-700 font-medium">স্থায়ী:</strong> {member.permanentAddress}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  <strong className="text-slate-700 font-medium">বর্তমান:</strong> {member.presentAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Card Bottom / Footer Actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {member.phone && member.phone !== '-' ? (
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${member.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition"
                  title="কল করুন"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>{member.phone}</span>
                </a>

                <button
                  onClick={(e) => handleCopyPhone(e, member.phone)}
                  className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition cursor-pointer"
                  title="ফোন নম্বর কপি করুন"
                >
                  {copiedPhone === member.phone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">ফোন নম্বর নেই</span>
            )}

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onSelectMember(member)}
                className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:bg-emerald-50 font-medium px-2 py-1 rounded transition cursor-pointer"
                title="বিস্তারিত দেখুন"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>বিস্তারিত</span>
              </button>

              {onEditMember && (
                <button
                  onClick={() => onEditMember(member)}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                  title="নাম, ছবি বা তথ্য সংশোধন করুন"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}

              {onDeleteMember && (
                <button
                  onClick={() => onDeleteMember(member)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                  title="সদস্য মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};
