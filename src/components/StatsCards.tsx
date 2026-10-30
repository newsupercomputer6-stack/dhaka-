import React from 'react';
import { Users, Banknote, MapPin, Briefcase } from 'lucide-react';
import { Member } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface StatsCardsProps {
  members: Member[];
  onSelectUnion?: (union: string) => void;
  onSelectProfession?: (prof: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  members,
}) => {
  const totalCount = members.length;
  const totalFee = members.reduce((sum, m) => sum + (m.fee || 0), 0);

  // Unions count
  const unionSet = new Set(members.map(m => m.union));

  // Top professions
  const profCount: { [key: string]: number } = {};
  members.forEach(m => {
    const p = m.profession || 'অন্যান্য';
    profCount[p] = (profCount[p] || 0) + 1;
  });

  const topProf = Object.entries(profCount).sort((a, b) => b[1] - a[1])[0] || ['চাকুরী', 0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-4">
      
      {/* Total Members */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">মোট সদস্য</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            {formatBnNumber(totalCount)} <span className="text-xs font-normal text-slate-500">জন</span>
          </div>
        </div>
      </div>

      {/* Total Subscription */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
          <Banknote className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">মোট সদস্য ফি</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            ৳{formatBnNumber(totalFee.toLocaleString('en-US'))}
          </div>
        </div>
      </div>

      {/* Unions Covered */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">অঞ্চল ও ইউনিয়ন</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            {formatBnNumber(unionSet.size)} <span className="text-xs font-normal text-slate-500">টি অঞ্চল</span>
          </div>
        </div>
      </div>

      {/* Top Profession */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium">শীর্ষ পেশা</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 truncate max-w-[130px]">
            {topProf[0]} <span className="text-xs font-normal text-slate-500">({formatBnNumber(topProf[1])})</span>
          </div>
        </div>
      </div>

    </div>
  );
};
