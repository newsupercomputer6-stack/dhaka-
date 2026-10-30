/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ALL_MEMBERS } from './data/members';
import { Member, FilterState, ViewMode, Notice, OrgProfile, ThemeConfig } from './types';
import { Header } from './components/Header';
import { NoticeBanner } from './components/NoticeBanner';
import { NoticeBoardModal } from './components/NoticeBoardModal';
import { PublishNoticeModal } from './components/PublishNoticeModal';
import { PublicRegistrationPage } from './components/PublicRegistrationPage';
import { ShareLinkModal } from './components/ShareLinkModal';
import { OrgProfileModal } from './components/OrgProfileModal';
import { MissionVisionModal } from './components/MissionVisionModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { StatsCards } from './components/StatsCards';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { MemberTable } from './components/MemberTable';
import { MemberCards } from './components/MemberCards';
import { MemberDetailModal } from './components/MemberDetailModal';
import { EditMemberModal } from './components/EditMemberModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AddMemberModal } from './components/AddMemberModal';
import { LogoModal } from './components/LogoModal';
import { PrintRoster } from './components/PrintRoster';
import { Pagination } from './components/Pagination';
import { exportToCSV, formatBnNumber } from './utils/exportExcel';
import { fetchNotices, saveNewNotice, updateNotice, deleteNoticeApi, getCachedNotices, cacheNotices } from './utils/noticesApi';
import { getCachedMembers, cacheMembers, fetchMembersFromServer, registerNewMemberApi } from './utils/membersApi';
import { getCachedOrgProfile, fetchOrgProfile, saveOrgProfileApi } from './utils/orgProfileApi';
import { getCachedTheme, cacheTheme, applyThemeToDocument, DEFAULT_THEME } from './utils/theme';
import { DEFAULT_ORG_PROFILE } from './data/initialOrgProfile';
import { Check, Info, FileSpreadsheet, Download, Bell, Share2, Sparkles, UserCheck, Building2, Target, Palette } from 'lucide-react';

const STORAGE_KEY = 'bajitpur_samity_members_v1';
const LOGO_STORAGE_KEY = 'bajitpur_samity_logo_v1';

const getInitialLogo = (): string | null => {
  try {
    return localStorage.getItem(LOGO_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to load logo from localStorage', e);
    return null;
  }
};

export default function App() {
  // Check URL parameter on load to support public registration view
  const [currentView, setCurrentView] = useState<'directory' | 'register'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'register' || window.location.hash === '#register') {
        return 'register';
      }
    }
    return 'directory';
  });

  const [members, setMembers] = useState<Member[]>(getCachedMembers);
  const [logo, setLogo] = useState<string | null>(getInitialLogo);
  const [orgProfile, setOrgProfile] = useState<OrgProfile>(getCachedOrgProfile);

  // Site Color & Theme State
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const cached = getCachedTheme();
    applyThemeToDocument(cached);
    return cached;
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isOrgProfileModalOpen, setIsOrgProfileModalOpen] = useState(false);
  const [isMissionVisionModalOpen, setIsMissionVisionModalOpen] = useState(false);
  
  // Notice Board states
  const [notices, setNotices] = useState<Notice[]>(getCachedNotices);
  const [isNoticeBoardOpen, setIsNoticeBoardOpen] = useState(false);
  const [isPublishNoticeOpen, setIsPublishNoticeOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync document title with current org name
  useEffect(() => {
    if (typeof document !== 'undefined' && orgProfile.name) {
      document.title = `${orgProfile.name} - সদস্য তালিকা ও ডিরেক্টরি`;
    }
  }, [orgProfile.name]);

  // Load organization profile and theme from server
  useEffect(() => {
    fetchOrgProfile().then((profile) => {
      if (profile && profile.name) {
        setOrgProfile(profile);
        if (profile.themeConfig) {
          setTheme(profile.themeConfig);
          cacheTheme(profile.themeConfig);
          applyThemeToDocument(profile.themeConfig);
        }
      }
    });
  }, []);

  // Sync members with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [members]);

  // Load notices from server on mount
  useEffect(() => {
    fetchNotices().then((data) => {
      if (data && data.length > 0) {
        setNotices(data);
      }
    });
  }, []);

  // Sync members with server & Live polling for automatic updates ("অটু যোগ হয়ে যাবে")
  useEffect(() => {
    fetchMembersFromServer().then((serverMembers) => {
      if (serverMembers && serverMembers.length > 0) {
        setMembers(serverMembers);
      }
    });

    const interval = setInterval(async () => {
      const latest = await fetchMembersFromServer();
      if (latest && latest.length > 0) {
        setMembers((prev) => {
          if (latest.length > prev.length) {
            const added = latest.length - prev.length;
            showToast(`অনলাইনে নতুন ${formatBnNumber(added)} জন সদস্য যুক্ত হয়েছেন!`);
            return latest;
          }
          return prev;
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Listen to popstate URL changes
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'register' || window.location.hash === '#register') {
        setCurrentView('register');
      } else {
        setCurrentView('directory');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: 'directory' | 'register') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (view === 'register') {
        url.searchParams.set('view', 'register');
      } else {
        url.searchParams.delete('view');
        url.hash = '';
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  const isModified = useMemo(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, [members]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedUnion: '',
    selectedProfession: '',
    selectedFee: '',
    sortBy: 'sl',
    sortOrder: 'asc',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Extract unique unions and professions
  const unions = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.union && m.union.trim()) set.add(m.union.trim());
    });
    return Array.from(set).sort();
  }, [members]);

  const professions = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.profession && m.profession.trim()) set.add(m.profession.trim());
    });
    return Array.from(set).sort();
  }, [members]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page upon filter change
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedUnion: '',
      selectedProfession: '',
      selectedFee: '',
      sortBy: 'sl',
      sortOrder: 'asc',
    });
    setCurrentPage(1);
    showToast('ফিল্টার রিসেট করা হয়েছে');
  };

  // Filtered & Sorted Members
  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        // Search Query Filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchName = m.name.toLowerCase().includes(q);
          const matchFather = m.fatherOrSpouse.toLowerCase().includes(q);
          const matchPhone = m.phone.includes(q);
          const matchPerm = m.permanentAddress.toLowerCase().includes(q);
          const matchPres = m.presentAddress.toLowerCase().includes(q);
          const matchUnion = m.union.toLowerCase().includes(q);
          const matchProf = m.profession.toLowerCase().includes(q);
          const matchRef = m.reference.toLowerCase().includes(q);
          const matchSl = String(m.sl) === q || formatBnNumber(m.sl) === q;

          if (!matchName && !matchFather && !matchPhone && !matchPerm && !matchPres && !matchUnion && !matchProf && !matchRef && !matchSl) {
            return false;
          }
        }

        // Union Filter
        if (filters.selectedUnion && m.union !== filters.selectedUnion) {
          return false;
        }

        // Profession Filter
        if (filters.selectedProfession && m.profession !== filters.selectedProfession) {
          return false;
        }

        // Fee Filter
        if (filters.selectedFee && String(m.fee) !== filters.selectedFee) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (filters.sortBy === 'sl') {
          cmp = a.sl - b.sl;
        } else if (filters.sortBy === 'name') {
          cmp = a.name.localeCompare(b.name, 'bn');
        } else if (filters.sortBy === 'union') {
          cmp = a.union.localeCompare(b.union, 'bn');
        } else if (filters.sortBy === 'fee') {
          cmp = a.fee - b.fee;
        } else if (filters.sortBy === 'profession') {
          cmp = a.profession.localeCompare(b.profession, 'bn');
        }
        return filters.sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [members, filters]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  // Member Handlers
  const handleExportExcel = () => {
    const filename = filters.selectedUnion
      ? `${orgProfile.name.replace(/\s+/g, '_')}_${filters.selectedUnion.replace(/\s+/g, '_')}_সদস্য_তালিকা.csv`
      : `${orgProfile.name.replace(/\s+/g, '_')}_সম্পূর্ণ_সদস্য_তালিকা.csv`;
    exportToCSV(filteredMembers, filename);
    showToast(`Excel ফাইল ডাউনলোড হয়েছে (${formatBnNumber(filteredMembers.length)} জন সদস্য)`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddMember = async (newMember: Member) => {
    const created = await registerNewMemberApi(newMember);
    setMembers((prev) => [created, ...prev.filter(m => m.sl !== created.sl)]);
    showToast(`নতুন সদস্য #${formatBnNumber(created.sl)} (${created.name}) তালিকায় যোগ করা হয়েছে`);
  };

  const handlePublicRegister = async (memberData: Omit<Member, 'sl'>): Promise<Member> => {
    const created = await registerNewMemberApi(memberData);
    setMembers((prev) => [created, ...prev.filter(m => m.sl !== created.sl)]);
    showToast(`ধন্যবাদ! নতুন সদস্য #${formatBnNumber(created.sl)} (${created.name}) স্বয়ংক্রিয়ভাবে তালিকায় যুক্ত হয়েছেন`);
    return created;
  };

  const handleSaveEditMember = (updated: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.sl === updated.sl ? updated : m))
    );
    if (selectedMember && selectedMember.sl === updated.sl) {
      setSelectedMember(updated);
    }
    showToast(`সদস্য #${formatBnNumber(updated.sl)} (${updated.name})-এর নাম ও তথ্য সংশোধন করা হয়েছে`);
  };

  const handleDeleteMember = (memberToDelete: Member) => {
    setMembers((prev) => prev.filter((m) => m.sl !== memberToDelete.sl));
    if (selectedMember && selectedMember.sl === memberToDelete.sl) {
      setSelectedMember(null);
    }
    showToast(`সদস্য #${formatBnNumber(memberToDelete.sl)} (${memberToDelete.name}) তালিকা থেকে মুছে ফেলা হয়েছে`);
  };

  const handleSaveLogo = (newLogo: string | null) => {
    setLogo(newLogo);
    try {
      if (newLogo) {
        localStorage.setItem(LOGO_STORAGE_KEY, newLogo);
        showToast('সমিতির লোগো সফলভাবে যুক্ত করা হয়েছে');
      } else {
        localStorage.removeItem(LOGO_STORAGE_KEY);
        showToast('ডিফল্ট প্রতীকে ফিরে যাওয়া হয়েছে');
      }
    } catch (e) {
      console.error('Failed to save logo to localStorage', e);
    }
  };

  const handleSaveOrgProfile = async (newProfile: OrgProfile) => {
    setOrgProfile(newProfile);
    await saveOrgProfileApi(newProfile);
    showToast(`প্রতিষ্ঠানের নাম ও প্রোফাইল সফলভাবে আপডেট করা হয়েছে (${newProfile.name})`);
  };

  const handleResetDatabase = () => {
    const confirmReset = window.confirm(
      'আপনি কি মূল ডাটাবেজে ফিরে যেতে চান? আপনার যোগ করা বা সংশোধিত তথ্য মুছে যাবে।'
    );
    if (confirmReset) {
      localStorage.removeItem(STORAGE_KEY);
      setMembers(ALL_MEMBERS);
      showToast('মূল তালিকা সফলভাবে ফিরিয়ে আনা হয়েছে');
    }
  };

  // Notice Handlers
  const handleSaveNotice = async (notice: Notice) => {
    const isEditing = notices.some((n) => n.id === notice.id);
    let updatedList: Notice[];

    if (isEditing) {
      updatedList = notices.map((n) => (n.id === notice.id ? notice : n));
      updateNotice(notice);
      showToast('বিজ্ঞপ্তি সফলভাবে সংশোধন ও আপডেট করা হয়েছে');
    } else {
      updatedList = [notice, ...notices];
      saveNewNotice(notice);
      showToast('নতুন নোটিশ সফলভাবে প্রকাশ করা হয়েছে');
    }

    setNotices(updatedList);
    cacheNotices(updatedList);
    setEditingNotice(null);
  };

  const handleDeleteNotice = async (noticeId: string) => {
    const updatedList = notices.filter((n) => n.id !== noticeId);
    setNotices(updatedList);
    cacheNotices(updatedList);
    deleteNoticeApi(noticeId);
    showToast('বিজ্ঞপ্তিটি তালিকা থেকে মুছে ফেলা হয়েছে');
  };

  const handleOpenNoticeDetail = (notice: Notice) => {
    setSelectedNoticeId(notice.id);
    setIsNoticeBoardOpen(true);
  };

  // Site Color & Theme Customization Handler
  const handleApplyTheme = async (newTheme: ThemeConfig, saveToServer = true) => {
    setTheme(newTheme);
    cacheTheme(newTheme);
    applyThemeToDocument(newTheme);
    showToast(`সাইটের থিম "${newTheme.name}" সফলভাবে প্রয়োগ করা হয়েছে`);

    if (saveToServer) {
      const updatedProfile: OrgProfile = { ...orgProfile, themeConfig: newTheme };
      setOrgProfile(updatedProfile);
      await saveOrgProfileApi(updatedProfile);
    }
  };

  // If public registration view is active, render dedicated registration portal
  if (currentView === 'register') {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
        <PublicRegistrationPage
          onRegister={handlePublicRegister}
          unions={unions}
          logo={logo}
          orgProfile={orgProfile}
          theme={theme}
          onGoToDirectory={() => navigateTo('directory')}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <div className="no-print">
        <Header
          totalMembers={members.length}
          filteredCount={filteredMembers.length}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onOpenAddMember={() => setIsAddModalOpen(true)}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
          onOpenOrgProfileModal={() => setIsOrgProfileModalOpen(true)}
          onOpenMissionVisionModal={() => setIsMissionVisionModalOpen(true)}
          onOpenShareLinkModal={() => setIsShareModalOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onOpenNoticeBoard={() => {
            setSelectedNoticeId(null);
            setIsNoticeBoardOpen(true);
          }}
          noticeCount={notices.length}
          logo={logo}
          orgProfile={orgProfile}
          theme={theme}
          onResetData={handleResetDatabase}
          isModified={isModified}
        />

        {/* Live Announcement & Notice Banner */}
        <NoticeBanner
          notices={notices}
          onOpenNoticeBoard={() => {
            setSelectedNoticeId(null);
            setIsNoticeBoardOpen(true);
          }}
          onOpenNoticeDetail={handleOpenNoticeDetail}
          onOpenPublishNotice={() => {
            setEditingNotice(null);
            setIsPublishNoticeOpen(true);
          }}
        />

        {/* Online Registration Invitation Banner */}
        <div 
          style={{ background: theme.primaryDark, borderColor: theme.headerBorder }}
          className="text-white py-2 px-4 border-b text-xs transition-colors duration-200"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 shrink-0" style={{ color: theme.accentGlow }} />
              <span>
                <strong>অনলাইন সদস্য নিবন্ধন:</strong> লিংক পাঠিয়ে সদস্যদের দিয়ে ফরম পূরণ করান। তথ্য দেওয়ার সাথে সাথেই এই তালিকায় অটো যোগ হয়ে যাবে!
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsShareModalOpen(true)}
                style={{ backgroundColor: theme.accent, color: '#0f172a' }}
                className="inline-flex items-center gap-1.5 px-3 py-1 font-bold text-xs rounded-lg shadow-xs hover:brightness-110 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>ফরম লিংক কপি ও শেয়ার</span>
              </button>

              <button
                onClick={() => navigateTo('register')}
                className="text-white/80 hover:text-white underline text-xs cursor-pointer ml-1"
              >
                নিবন্ধন ফরম দেখুন
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 no-print">
        
        {/* Mission, Vision & Motto Hero Highlight Strip */}
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50/70 to-teal-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xs shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300/60">
                  আমাদের মূলমন্ত্র
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-950 font-serif">
                  &ldquo;{orgProfile.motto || 'ঐক্য, সম্প্রীতি, সেবা ও উন্নয়ন।'}&rdquo;
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-1 max-w-2xl">
                <strong>মিশন ও ভিশন:</strong> {orgProfile.mission || 'ঢাকায় বসবাসরত বাজিতপুরবাসীকে ঐক্যবদ্ধ করে পারস্পরিক সহযোগিতা, সামাজিক সম্প্রীতি ও ভ্রাতৃত্ববোধ সুদৃঢ় করা...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsMissionVisionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>সম্পূর্ণ মিশন ও ভিশন পড়ুন</span>
            </button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <StatsCards
          members={filteredMembers}
          onSelectUnion={(u) => handleFilterChange({ selectedUnion: u })}
          onSelectProfession={(p) => handleFilterChange({ selectedProfession: p })}
        />

        {/* Search Bar & Multi-Filter Controls */}
        <SearchBarAndFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          unions={unions}
          professions={professions}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFiltered={filteredMembers.length}
        />

        {/* Content View: Table / Compact Excel / Cards */}
        {viewMode === 'cards' ? (
          <MemberCards
            members={paginatedMembers}
            onSelectMember={setSelectedMember}
            onEditMember={(m) => setEditingMember(m)}
            onDeleteMember={(m) => setDeletingMember(m)}
          />
        ) : (
          <MemberTable
            members={paginatedMembers}
            isCompact={viewMode === 'compact'}
            onSelectMember={setSelectedMember}
            onEditMember={(m) => setEditingMember(m)}
            onDeleteMember={(m) => setDeletingMember(m)}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredMembers.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />

      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-200">{orgProfile.name}</span> — {orgProfile.established}
            <div className="text-slate-500 mt-0.5">
              {orgProfile.address}
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-400 flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => setIsOrgProfileModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              কোম্পানীর নাম / প্রোফাইল পরিবর্তন
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              নিবন্ধন লিংক
            </button>
            <button
              onClick={() => {
                setSelectedNoticeId(null);
                setIsNoticeBoardOpen(true);
              }}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              নোটিশ বোর্ড
            </button>
            {isModified && (
              <button
                onClick={handleResetDatabase}
                className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                মূল তালিকা ফিরিয়ে আনুন
              </button>
            )}
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              লোগো
            </button>
          </div>
        </div>
      </footer>

      {/* Member Details Modal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onEdit={(m) => setEditingMember(m)}
        onDelete={(m) => setDeletingMember(m)}
        logo={logo}
        orgName={orgProfile.name}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        member={editingMember}
        isOpen={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveEditMember}
        unions={unions}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        member={deletingMember}
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleDeleteMember}
      />

      {/* Add New Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMember={handleAddMember}
        nextSl={members.length + 1}
        unions={unions}
      />

      {/* Organization / Company Profile Edit Modal */}
      <OrgProfileModal
        isOpen={isOrgProfileModalOpen}
        onClose={() => setIsOrgProfileModalOpen(false)}
        orgProfile={orgProfile}
        onSaveOrgProfile={handleSaveOrgProfile}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        logo={logo}
      />

      {/* Site Color & Theme Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onApplyTheme={handleApplyTheme}
        orgName={orgProfile.name}
        logo={logo}
      />

      {/* Official Mission & Vision Modal */}
      <MissionVisionModal
        isOpen={isMissionVisionModalOpen}
        onClose={() => setIsMissionVisionModalOpen(false)}
        orgProfile={orgProfile}
        logo={logo}
        theme={theme}
        onOpenOrgProfileModal={() => setIsOrgProfileModalOpen(true)}
      />

      {/* Organization Logo Management Modal */}
      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogo={logo}
        onSaveLogo={handleSaveLogo}
      />

      {/* Share Registration Link Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenRegisterView={() => navigateTo('register')}
      />

      {/* Notice Board Modal */}
      <NoticeBoardModal
        isOpen={isNoticeBoardOpen}
        onClose={() => {
          setIsNoticeBoardOpen(false);
          setSelectedNoticeId(null);
        }}
        notices={notices}
        onOpenPublishNotice={() => {
          setEditingNotice(null);
          setIsPublishNoticeOpen(true);
        }}
        onEditNotice={(notice) => {
          setEditingNotice(notice);
          setIsPublishNoticeOpen(true);
        }}
        onDeleteNotice={handleDeleteNotice}
        selectedNoticeId={selectedNoticeId}
      />

      {/* Publish / Edit Notice Modal */}
      <PublishNoticeModal
        isOpen={isPublishNoticeOpen}
        onClose={() => {
          setIsPublishNoticeOpen(false);
          setEditingNotice(null);
        }}
        onSaveNotice={handleSaveNotice}
        editingNotice={editingNotice}
      />

      {/* Printable Roster View (Hidden on screen, visible during Print / Save as PDF) */}
      <PrintRoster
        members={filteredMembers}
        title={filters.selectedUnion ? `${filters.selectedUnion} সদস্য তালিকা` : `${orgProfile.name} - সদস্য তালিকা`}
        logo={logo}
        orgProfile={orgProfile}
      />

    </div>
  );
}
