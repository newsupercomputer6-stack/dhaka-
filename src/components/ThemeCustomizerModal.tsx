import React, { useState, useEffect } from 'react';
import { X, Palette, Check, Sparkles, RotateCcw, Sliders, Shield, Sun, Eye } from 'lucide-react';
import { ThemeConfig } from '../types';
import { THEME_PRESETS, DEFAULT_THEME, createCustomTheme } from '../utils/theme';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onApplyTheme: (theme: ThemeConfig, saveToServer?: boolean) => void;
  orgName?: string;
  logo?: string | null;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onApplyTheme,
  orgName = 'বাজিতপুর সমিতি, ঢাকা',
  logo,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(currentTheme);
  const [mode, setMode] = useState<'presets' | 'custom'>('presets');
  
  // Custom mode states
  const [customPrimary, setCustomPrimary] = useState<string>(currentTheme.primary || '#047857');
  const [customAccent, setCustomAccent] = useState<string>(currentTheme.accent || '#f59e0b');
  const [saveAsOrgDefault, setSaveAsOrgDefault] = useState(true);

  useEffect(() => {
    setSelectedTheme(currentTheme);
    setCustomPrimary(currentTheme.primary || '#047857');
    setCustomAccent(currentTheme.accent || '#f59e0b');
    if (currentTheme.isCustom) {
      setMode('custom');
    } else {
      setMode('presets');
    }
  }, [currentTheme, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: ThemeConfig) => {
    setSelectedTheme(preset);
  };

  const handleCustomColorChange = (primary: string, accent: string) => {
    setCustomPrimary(primary);
    setCustomAccent(accent);
    const newCustom = createCustomTheme(primary, accent);
    setSelectedTheme(newCustom);
  };

  const handleResetToDefault = () => {
    setSelectedTheme(DEFAULT_THEME);
    setCustomPrimary(DEFAULT_THEME.primary);
    setCustomAccent(DEFAULT_THEME.accent);
    setMode('presets');
  };

  const handleSaveAndApply = () => {
    onApplyTheme(selectedTheme, saveAsOrgDefault);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Dynamic Modal Header using Selected Theme */}
        <div 
          className="p-5 text-white flex items-center justify-between shrink-0 shadow-sm transition-all duration-300"
          style={{ background: selectedTheme.headerGradient, borderColor: selectedTheme.headerBorder }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-white/20 shrink-0"
              style={{ backgroundColor: selectedTheme.accent, color: '#0f172a' }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <span>সাইটের কালার ও থিম কাস্টমাইজেশন</span>
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                সমিতির সাইটের হেডার, বাটন, কার্ড ও ব্যাকগ্রাউন্ড কালার পরিবর্তন করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setMode('presets')}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition cursor-pointer ${
              mode === 'presets'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>প্রস্তুতকৃত কালার প্যালেট ({THEME_PRESETS.length}টি)</span>
          </button>

          <button
            onClick={() => {
              setMode('custom');
              const custom = createCustomTheme(customPrimary, customAccent);
              setSelectedTheme(custom);
            }}
            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition cursor-pointer ${
              mode === 'custom'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>কাস্টম কালার নির্বাচন</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Live Preview Card */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                লাইভ প্রিভিউ (কেমন দেখাবে)
              </span>
              <span className="text-xs font-medium text-slate-600">
                বর্তমান পছন্দ: <strong className="text-slate-900">{selectedTheme.name}</strong>
              </span>
            </div>

            {/* Simulated Mini Header */}
            <div 
              className="rounded-xl p-3.5 text-white shadow-sm transition-all duration-300"
              style={{ background: selectedTheme.headerGradient }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/20"
                    style={{ backgroundColor: selectedTheme.accent, color: '#0f172a' }}
                  >
                    {logo ? (
                      <img src={logo} alt="লোগো" className="w-6 h-6 object-contain" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm tracking-tight">{orgName}</div>
                    <div className="text-[10px] text-white/80">ঐক্য, সম্প্রীতি, সেবা ও উন্নয়ন</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: selectedTheme.accent, color: '#0f172a' }}
                  >
                    মিশন ও ভিশন
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] text-white border border-white/20"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    নিবন্ধন লিংক
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Mini Stats & Button */}
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: selectedTheme.primaryLight, color: selectedTheme.primary }}
                >
                  স
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">মোট সদস্য</div>
                  <div className="text-xs font-bold text-slate-800">৯০০+ জন</div>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: selectedTheme.accentLight, color: selectedTheme.accentHover }}
                >
                  ফি
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">সদস্য ফি</div>
                  <div className="text-xs font-bold text-slate-800">৳ ৪,৫০,০০০</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mode 1: Theme Presets */}
          {mode === 'presets' && (
            <div>
              <div className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-between">
                <span>পছন্দের থিম নির্বাচন করুন:</span>
                <span className="text-xs font-normal text-slate-500">ক্লিক করে নির্বাচন করুন</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = selectedTheme.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                      }`}
                    >
                      {/* Gradient Bar Preview */}
                      <div 
                        className="h-10 rounded-lg w-full mb-2.5 flex items-center justify-between px-3 text-white shadow-inner"
                        style={{ background: preset.headerGradient }}
                      >
                        <span className="text-xs font-semibold drop-shadow-xs">{preset.name.split(' ')[0]}</span>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-4 h-4 rounded-full border border-white shadow-xs" 
                            style={{ backgroundColor: preset.accent }}
                            title="অ্যাকসেন্ট কালার"
                          />
                          <span 
                            className="w-4 h-4 rounded-full border border-white shadow-xs" 
                            style={{ backgroundColor: preset.primary }}
                            title="প্রাইমারি কালার"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{preset.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <span>প্রাইমারি: {preset.primary}</span>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Custom Color Mode */}
          {mode === 'custom' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Sun className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  আপনার পছন্দের যেকোনো প্রাইমারি ও অ্যাকসেন্ট রঙ বেছে নিন। সিস্টেম স্বয়ংক্রিয়ভাবে হেডার গ্রেডিয়েন্ট ও কন্ট্রাস্ট সামঞ্জস্য করে দেবে।
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Primary Color Picker */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    ১. প্রধান / হেডার কালার (Primary Color):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customPrimary}
                      onChange={(e) => handleCustomColorChange(e.target.value, customAccent)}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900 uppercase">{customPrimary}</div>
                      <div className="text-[11px] text-slate-500">হেডার, বাটন ও প্রধান হাইলাইটের জন্য</div>
                    </div>
                  </div>
                  
                  {/* Quick Color Swatches */}
                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    {['#047857', '#1d4ed8', '#0f766e', '#881337', '#15803d', '#6d28d9', '#1e293b', '#b91c1c'].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => handleCustomColorChange(hex, customAccent)}
                        className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer hover:scale-110 transition"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    ২. হাইলাইট / গোল্ডেন কালার (Accent Color):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customAccent}
                      onChange={(e) => handleCustomColorChange(customPrimary, e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900 uppercase">{customAccent}</div>
                      <div className="text-[11px] text-slate-500">মিশন বাটন, গোল্ড ব্যাজ ও নোটিশ বর্ডারের জন্য</div>
                    </div>
                  </div>

                  {/* Quick Accent Swatches */}
                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    {['#f59e0b', '#eab308', '#ca8a04', '#06b6d4', '#f97316', '#10b981', '#ec4899', '#38bdf8'].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => handleCustomColorChange(customPrimary, hex)}
                        className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer hover:scale-110 transition"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sync / Persistence Option */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsOrgDefault}
                onChange={(e) => setSaveAsOrgDefault(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <span className="font-medium">
                সমিতির কেন্দ্রীয় থিম হিসেবে সেভ করুন (যাতে সবার জন্য এই কালার স্থায়ী হয়)
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট কালার পুনরুদ্ধার (সবুজ ও সোনালী)</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              বাতিল
            </button>

            <button
              onClick={handleSaveAndApply}
              style={{ backgroundColor: selectedTheme.primary }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>কালার পরিবর্তন প্রয়োগ করুন</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
