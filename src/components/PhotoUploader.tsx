import React, { useRef, useState } from 'react';
import { Camera, Trash2, User, Upload, Check } from 'lucide-react';
import { compressImageFile } from '../utils/imageUtils';

interface PhotoUploaderProps {
  currentPhoto?: string;
  onPhotoChange: (photoDataUrl?: string) => void;
  memberName?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentPhoto,
  onPhotoChange,
  memberName = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const compressedDataUrl = await compressImageFile(file);
      onPhotoChange(compressedDataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setIsProcessing(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(undefined);
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/webp, image/jpg"
        className="hidden"
      />

      {/* Avatar Preview */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-emerald-600/40 shadow-sm shrink-0 flex items-center justify-center hover:border-emerald-600 transition"
        title="ছবি যুক্ত বা পরিবর্তন করতে ক্লিক করুন"
      >
        {currentPhoto ? (
          <img
            src={currentPhoto}
            alt={memberName || 'সদস্যের ছবি'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-700 transition">
            <User className="w-9 h-9" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition duration-150">
          <Camera className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">পরিবর্তন</span>
        </div>

        {/* Processing Spinner */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Controls & Description */}
      <div className="flex-1 text-center sm:text-left">
        <div className="text-xs font-semibold text-slate-800">
          সদস্যের ছবি (ঐচ্ছিক)
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
          পাসপোর্ট সাইজ বা যেকোনো সাধারণ ছবি নির্বাচন করুন। স্বয়ংক্রিয়ভাবে অপ্টিমাইজ হয়ে যাবে।
        </p>

        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-700" />
            <span>{currentPhoto ? 'ছবি পরিবর্তন করুন' : 'ছবি নির্বাচন করুন'}</span>
          </button>

          {currentPhoto && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
              title="বর্তমান ছবি মুছে ফেলুন"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ছবি মুছুন</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
