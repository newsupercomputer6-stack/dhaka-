import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Member } from '../types';
import { formatBnNumber } from '../utils/exportExcel';

interface DeleteConfirmModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (member: Member) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  member,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-700/80 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">সদস্য মুছে ফেলা নিশ্চিতকরণ</h2>
              <p className="text-xs text-rose-100">এই কাজটি সতর্কতার সাথে করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-700">
          <p className="text-slate-600">
            আপনি কি নিশ্চিত যে নিচের সদস্যকে তালিকা থেকে মুছে ফেলতে চান?
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">সদস্য ক্রমিক</span>
              <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded font-mono">
                #{formatBnNumber(member.sl)}
              </span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {member.name}
            </div>
            {member.fatherOrSpouse && member.fatherOrSpouse !== '-' && (
              <div className="text-xs text-slate-500">
                পিতা/স্বামী: {member.fatherOrSpouse}
              </div>
            )}
            <div className="text-xs text-slate-500">
              ইউনিয়ন: {member.union} | পেশা: {member.profession}
            </div>
            {member.phone && member.phone !== '-' && (
              <div className="text-xs font-mono text-slate-600">
                মোবাইল: {member.phone}
              </div>
            )}
          </div>

          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3 leading-relaxed">
            সতর্কতা: ডিলিট করলে এই সদস্যের নাম বর্তমান তালিকা ও ডাউনলোড করা এক্সেলে অন্তর্ভুক্ত থাকবে না। তবে প্রয়োজন হলে পরবর্তীতে "ডাটাবেজ পুনরুদ্ধার" দিয়ে মূল তালিকায় ফিরে যেতে পারবেন।
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition text-xs font-medium"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(member);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition text-xs font-medium shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>হ্যাঁ, মুছে ফেলুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
