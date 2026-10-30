export interface Member {
  sl: number;
  name: string;
  fatherOrSpouse: string;
  phone: string;
  permanentAddress: string;
  presentAddress: string;
  profession: string;
  fee: number;
  union: string;
  reference: string;
  photo?: string; // base64 or URL
}

export type ViewMode = 'table' | 'cards' | 'compact';

export interface FilterState {
  searchQuery: string;
  selectedUnion: string;
  selectedProfession: string;
  selectedFee: string;
  sortBy: 'sl' | 'name' | 'union' | 'fee' | 'profession';
  sortOrder: 'asc' | 'desc';
}

export interface Notice {
  id: string;
  title: string;
  category: 'জরুরি' | 'সভা' | 'সদস্য সংগ্রহ' | 'কল্যাণ তহবিল' | 'সাধারণ' | 'অন্যান্য';
  content: string;
  date: string; // e.g. "২৯ অক্টোবর, ২০২৬"
  isPinned?: boolean;
  publishedBy?: string; // e.g. "সাধারণ সম্পাদক, বাজিতপুর সমিতি ঢাকা"
  phone?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryBorder: string;
  accent: string;
  accentGlow: string;
  accentHover: string;
  accentLight: string;
  headerGradient: string;
  headerBorder: string;
  isCustom?: boolean;
}

export interface OrgProfile {
  name: string;
  established: string;
  tagline: string;
  address: string;
  contactPhones: string[];
  email?: string;
  website?: string;
  motto?: string;
  mission?: string;
  vision?: string;
  commitment?: string;
  themeConfig?: ThemeConfig;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank';
export type PaymentPurpose = 'মাসিক চাঁদা' | 'আজীবন সদস্য ফি' | 'কল্যাণ তহবিল' | 'নতুন সদস্য ফি' | 'অন্যান্য অনুদান';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentRecord {
  id: string;
  memberSl?: number;
  memberName: string;
  phone: string;
  purpose: PaymentPurpose;
  method: PaymentMethod;
  amount: number;
  transactionId: string;
  senderPhone: string;
  receiptPhoto?: string;
  date: string;
  status: PaymentStatus;
  notes?: string;
  approvedAt?: string;
}

export interface PaymentNumbers {
  bkash: string;
  bkashType: 'পার্সোনাল' | 'মার্চেন্ট';
  nagad: string;
  nagadType: 'পার্সোনাল' | 'মার্চেন্ট';
  rocket: string;
  rocketType: 'পার্সোনাল' | 'মার্চেন্ট';
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankRouting?: string;
}

export interface AppSettings {
  adminPassword: string; // default: 'admin123'
  allowMemberLedgerView: boolean; // Admin permission to allow members to view individual financial ledger
  allowPublicRegistration: boolean;
  paymentNumbers: PaymentNumbers;
}

export interface MemberAuthCredential {
  sl: number;
  phone: string;
  passwordHashOrPlain: string;
  updatedAt?: string;
}

