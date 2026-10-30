import React from 'react';
import { Member, OrgProfile } from '../types';
import { formatBnNumber } from '../utils/exportExcel';
import { DEFAULT_ORG_PROFILE } from '../data/initialOrgProfile';

interface PrintRosterProps {
  members: Member[];
  title?: string;
  logo?: string | null;
  orgProfile?: OrgProfile;
}

export const PrintRoster: React.FC<PrintRosterProps> = ({
  members,
  title = 'সদস্য তালিকা ও তথ্যাবলী',
  logo,
  orgProfile = DEFAULT_ORG_PROFILE,
}) => {
  const contactPhones = orgProfile.contactPhones?.join(', ') || '01713180019';

  return (
    <div className="hidden print-only p-6 bg-white text-black font-serif">
      
      {/* Official Header */}
      <div className="text-center pb-4 border-b-2 border-black mb-4">
        {logo && (
          <div className="flex justify-center mb-2">
            <img
              src={logo}
              alt={orgProfile.name}
              className="h-16 w-auto object-contain"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-wide">{orgProfile.name}</h1>
        <p className="text-xs mt-1">{orgProfile.established}</p>
        {orgProfile.motto && (
          <p className="text-xs font-bold mt-0.5 text-slate-800">
            আমাদের মূলমন্ত্র: {orgProfile.motto}
          </p>
        )}
        <p className="text-xs text-slate-700 mt-0.5">
          কার্যালয়ঃ {orgProfile.address}
        </p>
        <p className="text-xs text-slate-700 mt-0.5">
          জরুরি যোগাযোগ: {contactPhones}
        </p>
        <h2 className="text-sm font-semibold uppercase mt-3 tracking-wider underline">
          {title} (মোট সদস্য: {formatBnNumber(members.length)} জন)
        </h2>
      </div>

      {/* Roster Table */}
      <table className="w-full text-left text-xs border border-black border-collapse">
        <thead>
          <tr className="bg-slate-100 font-bold border-b border-black">
            <th className="p-1.5 border border-black text-center w-12">ক্র.নং</th>
            <th className="p-1.5 border border-black min-w-[120px]">সদস্যের নাম</th>
            <th className="p-1.5 border border-black min-w-[100px]">পিতা / স্বামী</th>
            <th className="p-1.5 border border-black min-w-[90px]">ফোন নম্বর</th>
            <th className="p-1.5 border border-black">স্থায়ী ঠিকানা</th>
            <th className="p-1.5 border border-black">বর্তমান ঠিকানা</th>
            <th className="p-1.5 border border-black w-16 text-center">পেশা</th>
            <th className="p-1.5 border border-black w-16 text-right">ফি</th>
            <th className="p-1.5 border border-black">ইউনিয়ন</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.sl} className="border-b border-black">
              <td className="p-1 border border-black text-center font-mono">
                {formatBnNumber(m.sl)}
              </td>
              <td className="p-1 border border-black font-semibold">
                <div className="flex items-center gap-1.5">
                  {m.photo && (
                    <img
                      src={m.photo}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-300"
                    />
                  )}
                  <span>{m.name}</span>
                </div>
              </td>
              <td className="p-1 border border-black text-slate-700">
                {m.fatherOrSpouse}
              </td>
              <td className="p-1 border border-black font-mono">
                {m.phone}
              </td>
              <td className="p-1 border border-black">
                {m.permanentAddress}
              </td>
              <td className="p-1 border border-black">
                {m.presentAddress}
              </td>
              <td className="p-1 border border-black text-center">
                {m.profession}
              </td>
              <td className="p-1 border border-black text-right font-mono">
                ৳{formatBnNumber(m.fee)}
              </td>
              <td className="p-1 border border-black">
                {m.union}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Official Signatures */}
      <div className="mt-16 flex items-center justify-between px-10 text-xs">
        <div className="text-center">
          <div className="w-36 border-t border-black mb-1"></div>
          <div>সাধারণ সম্পাদক</div>
          <div className="text-[10px] text-slate-600">{orgProfile.name}</div>
        </div>

        <div className="text-center">
          <div className="w-36 border-t border-black mb-1"></div>
          <div>সভাপতি</div>
          <div className="text-[10px] text-slate-600">{orgProfile.name}</div>
        </div>
      </div>

    </div>
  );
};
