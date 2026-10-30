import React, { useRef, useState } from 'react';
import { X, Upload, Trash2, Check, Shield, Image as ImageIcon, Camera } from 'lucide-react';
import { compressLogoFile } from '../utils/imageUtils';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string | null;
  onSaveLogo: (logoDataUrl: string | null) => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  onSaveLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(currentLogo);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync when opened
  React.useEffect(() => {
    setPreviewLogo(currentLogo);
    setErrorMsg(null);
  }, [isOpen, currentLogo]);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const dataUrl = await compressLogoFile(file);
      setPreviewLogo(dataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'লোগো ফাইল প্রক্রিয়াকরণে সমস্যা হয়েছে');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = () => {
    onSaveLogo(previewLogo);
    onClose();
  };

  const handleRemove = () => {
    setPreviewLogo(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">সমিতির লোগো যুক্ত / পরিবর্তন</h2>
              <p className="text-xs text-emerald-200">বাজিতপুর সমিতি, ঢাকা</p>
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

        {/* Body */}
        <div className="p-6 space-y-5 text-sm text-slate-700">
          
          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            className="hidden"
          />

          {/* Logo Preview Section */}
          <div className="text-center">
            <div className="inline-block relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden cursor-pointer hover:ring-4 hover:ring-emerald-500/30 transition p-2"
                title="নতুন লোগো আপলোড করতে ক্লিক করুন"
              >
                {previewLogo ? (
                  <img
                    src={previewLogo}
                    alt="সমিতির লোগো"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-950">
                    <Shield className="w-14 h-14" />
                    <span className="text-[10px] font-bold mt-1 tracking-tighter uppercase">ডিফল্ট প্রতীক</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-white transition duration-150">
                  <Camera className="w-6 h-6 mb-1 text-amber-300" />
                  <span className="text-xs font-medium">লোগো বাছুন</span>
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              {previewLogo
                ? 'বর্তমানে কাস্টম লোগো নির্বাচিত আছে।'
                : 'বর্তমানে সমিতির মূল সোনালী প্রতীক সক্রিয় রয়েছে।'}
            </p>
          </div>

          {/* Upload and Reset buttons */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{previewLogo ? 'নতুন লোগো আপলোড' : 'লোগো ফাইল আপলোড'}</span>
            </button>

            {previewLogo && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
                title="ডিফল্ট প্রতীকে ফিরে যান"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>লোগো মুছুন</span>
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-600 text-center font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Help box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">লোগো ব্যবহারের স্থানসমূহ:</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
              <li>অ্যাপের মূল হেডারে ব্র্যান্ড প্রতীক হিসেবে</li>
              <li>সদস্য তালিকা প্রিন্ট ও PDF ডাউনলোডে অফিসিয়াল হেডার হিসেবে</li>
              <li>সদস্য বিস্তারিত পরিচিতি কার্ডে</li>
            </ul>
          </div>

          {/* Footer action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
