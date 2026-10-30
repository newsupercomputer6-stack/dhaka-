import React, { useState } from 'react';
import { Phone, Copy, Check, Eye, ArrowUpDown, MapPin, Building, Briefcase, Edit3, Trash2, User } from 'lucide-react';
import { Member, FilterState } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface MemberTableProps {
  members: Member[];
  isCompact?: boolean;
  onSelectMember: (member: Member) => void;
  onEditMember?: (member: Member) => void;
  onDeleteMember?: (member: Member) => void;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  isCompact = false,
  onSelectMember,
  onEditMember,
  onDeleteMember,
  filters,
  onFilterChange,
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    if (!phone || phone === '-') return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleSort = (field: FilterState['sortBy']) => {
    if (filters.sortBy === field) {
      onFilterChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      onFilterChange({ sortBy: field, sortOrder: 'asc' });
    }
  };

  const py = isCompact ? 'py-1.5' : 'py-3';
  const px = isCompact ? 'px-2.5' : 'px-3.5';
  const textSize = isCompact ? 'text-xs' : 'text-sm';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-100 text-xs uppercase tracking-wider select-none font-medium border-b border-slate-700">
              
              {/* SL */}
              <th 
                onClick={() => handleSort('sl')}
                className={`${px} py-3 cursor-pointer hover:bg-slate-700 transition w-16 text-center`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>ক্র.নং</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Name & Father */}
              <th 
                onClick={() => handleSort('name')}
                className={`${px} py-3 cursor-pointer hover:bg-slate-700 transition min-w-[220px]`}
              >
                <div className="flex items-center gap-1">
                  <span>নাম ও পিতা / স্বামী</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Phone */}
              <th className={`${px} py-3 min-w-[140px]`}>
                <span>ফোন নম্বর</span>
              </th>

              {/* Permanent Address */}
              <th className={`${px} py-3 min-w-[170px]`}>
                <span>স্থায়ী ঠিকানা</span>
              </th>

              {/* Present Address */}
              <th className={`${px} py-3 min-w-[190px]`}>
                <span>বর্তমান ঠিকানা</span>
              </th>

              {/* Profession */}
              <th 
                onClick={() => handleSort('profession')}
                className={`${px} py-3 cursor-pointer hover:bg-slate-700 transition min-w-[110px]`}
              >
                <div className="flex items-center gap-1">
                  <span>পেশা</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Fee */}
              <th 
                onClick={() => handleSort('fee')}
                className={`${px} py-3 cursor-pointer hover:bg-slate-700 transition w-24 text-right`}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>ফি</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Union */}
              <th 
                onClick={() => handleSort('union')}
                className={`${px} py-3 cursor-pointer hover:bg-slate-700 transition min-w-[130px]`}
              >
                <div className="flex items-center gap-1">
                  <span>ইউনিয়ন / অঞ্চল</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Actions */}
              <th className={`${px} py-3 w-28 text-center`}>
                <span>অ্যাকশন</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {members.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-400">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <p className="text-base font-medium text-slate-600">কোন সদস্য পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-400">অন্য শব্দ দিয়ে অনুসন্ধান করুন অথবা ফিল্টার রিসেট করুন।</p>
                  </div>
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.sl}
                  onClick={() => onSelectMember(member)}
                  className="hover:bg-emerald-50/60 transition cursor-pointer group"
                >
                  
                  {/* SL */}
                  <td className={`${px} ${py} ${textSize} text-center font-mono text-slate-500 font-semibold group-hover:text-emerald-700`}>
                    {formatBnNumber(member.sl)}
                  </td>

                  {/* Name & Father with Avatar */}
                  <td className={`${px} ${py} ${textSize}`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400 shadow-2xs">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-800 transition truncate">
                          {member.name}
                        </div>
                        {member.fatherOrSpouse && member.fatherOrSpouse !== '-' && (
                          <div className="text-xs text-slate-500 mt-0.5 truncate">
                            {member.fatherOrSpouse}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className={`${px} ${py} ${textSize}`}>
                    {member.phone && member.phone !== '-' ? (
                      <div className="inline-flex items-center gap-1.5 font-mono text-slate-800 bg-slate-50 hover:bg-emerald-100/70 px-2 py-1 rounded border border-slate-200 transition">
                        <a
                          href={`tel:${member.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-emerald-700 hover:underline flex items-center gap-1"
                          title="কল করুন"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{member.phone}</span>
                        </a>

                        <button
                          onClick={(e) => handleCopyPhone(e, member.phone)}
                          className="text-slate-400 hover:text-emerald-700 p-0.5 ml-0.5 cursor-pointer"
                          title="কপি করুন"
                        >
                          {copiedPhone === member.phone ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">-</span>
                    )}
                  </td>

                  {/* Permanent Address */}
                  <td className={`${px} ${py} ${textSize} text-slate-600 max-w-[220px] truncate`} title={member.permanentAddress}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{member.permanentAddress}</span>
                    </div>
                  </td>

                  {/* Present Address */}
                  <td className={`${px} ${py} ${textSize} text-slate-600 max-w-[250px] truncate`} title={member.presentAddress}>
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{member.presentAddress}</span>
                    </div>
                  </td>

                  {/* Profession */}
                  <td className={`${px} ${py} ${textSize}`}>
                    <span className="inline-block text-xs font-medium text-slate-700">
                      {member.profession}
                    </span>
                  </td>

                  {/* Fee */}
                  <td className={`${px} ${py} ${textSize} text-right font-semibold text-slate-800`}>
                    ৳{formatBnNumber(member.fee)}
                  </td>

                  {/* Union */}
                  <td className={`${px} ${py} ${textSize}`}>
                    <span className="text-xs text-slate-600">
                      {member.union}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className={`${px} ${py} text-center`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onSelectMember(member)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                        title="বিস্তারিত দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {onEditMember && (
                        <button
                          onClick={() => onEditMember(member)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="নাম, ছবি ও তথ্য সংশোধন করুন"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {onDeleteMember && (
                        <button
                          onClick={() => onDeleteMember(member)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="সদস্য মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
