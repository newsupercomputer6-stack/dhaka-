const fs = require('fs');

const text = fs.readFileSync('scripts/pdf_extracted.txt', 'utf-8');
const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const bnToEnMap = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
const enToBnMap = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };

function bnToEnDigits(str) {
  if (!str) return '';
  return str.replace(/[০-৯]/g, d => bnToEnMap[d] !== undefined ? bnToEnMap[d] : d);
}

function enToBnDigits(str) {
  if (!str) return '';
  return String(str).replace(/[0-9]/g, d => enToBnMap[d] !== undefined ? enToBnMap[d] : d);
}

function cleanBangla(text) {
  if (!text) return '';
  return text
    .replace(/বান্দ\s*জতপুর|বা\s*েন্দ\s*জা\s*ততপ\s*বুর|বা\s*ন্দ\s*াজ-১\/৪|বান্দ\s*জতপলুর/g, 'বাজিতপুর')
    .replace(/বান্দ\s*জফতারুপিুর|বাােন্দজিত\s*প\s*ুরীিহুলপৌইরেেলভাো|হপা\s*ৌরকরেয়ভারা|হহপেৌকরলেেভআা|হপৌরিেুলভালা/g, 'বাজিতপুর পৌরসভা')
    .replace(/কিস\s*ারগঞ্জ|কিস\s*ারগেঞ্জ|কিস\s*ারিগেঞ্জ|কিস\s*ােরাগঞ্জ|কিস\s*াারগঞ্জ|কিস\s*ার৩গঞ্জ|কিস\s*ার৫গঞ্জ|কি\s*স\s*১\s*ার\/৫গ,ঞ্জ|কি\s*সে\s*ধারযপগঞ্জাড়া|কিস\s*ার/g, 'কিশোরগঞ্জ')
    .replace(/হ\s*াসেন/g, 'হোসেন')
    .replace(/হতাফাজ্জ\s*ল/g, 'তোফাজ্জল')
    .replace(/হ\s*লালউন্দ\s*িন/g, 'হেলালউদ্দিন')
    .replace(/ােে\s*ুন্দ\s*িন|ােছুন্দ\s*িন|ােেন্দু\s*িন|শামছুন্দিন|শামসুন্দিন/g, 'শামছুদ্দিন')
    .replace(/উন্দ\s*িন/g, 'উদ্দিন')
    .replace(/আ\s*সেি|আ\s*সেদ|আ\s*সে(?=\s|$)/g, 'আহমেদ')
    .replace(/চািুরীজীবী|চািকরজীবী|চািুকরজীবী|চািুরীজীকব|চািকরজীকব|চািুরীবী|চািু\s*ুরী/g, 'চাকুরীজীবী')
    .replace(/চািুরী|চািকর/g, 'চাকুরী')
    .replace(/বযবো|বযবোয়ী/g, 'ব্যবসা')
    .replace(/বযাংিার/g, 'ব্যাংকার')
    .replace(/বযাংি/g, 'ব্যাংক')
    .replace(/গকৃ\s*নী|গকৃ\s*হিনী/g, 'গৃহিণী')
    .replace(/োংবাকিিতা/g, 'সাংবাদিকতা')
    .replace(/োংবাকিি/g, 'সাংবাদিক')
    .replace(/ঢািা/g, 'ঢাকা')
    .replace(/হরাড/g, 'রোড')
    .replace(/েকতন্দ\s*িল|কেকতন্দ\s*িল/g, 'মতিঝিল')
    .replace(/ধানেন্দি|ধানেিী/g, 'ধানমন্ডি')
    .replace(/েিেয/g, 'সদস্য')
    .replace(/েংখ্\s*যা|েংখ্যা/g, 'সংখ্যা')
    .replace(/তাকরিখ্|তাকরখ্/g, 'তারিখ')
    .replace(/েব\s*বস\s*ষ|েবসব\s*ষ|েবস\s*ষ/g, 'সর্বশেষ')
    .replace(/ক\s*লকচয়া|ক\s*সলাকচয়া|ক\s*লকছয়া/g, 'হিলচিয়া')
    .replace(/কিলফালারুপিুর|কিলালপুর/g, 'দিলালপুর')
    .replace(/েরারচর|েফরারারুচির/g, 'সরারচর')
    .replace(/কপকরজপুর|কপকফরজারুপিুর/g, 'পিরিজপুর')
    .replace(/হালিমপুর|াকলেপুর/g, 'হালিমপুর')
    .replace(/বকলয়ারকি|বকলয়ারিী|বকলফয়ারুারিকি/g, 'বলিয়ারদী')
    .replace(/গাজীরচর|গান্দজরচর/g, 'গাজীরচর')
    .replace(/হুোইপুর/g, 'হুমাইপুর')
    .replace(/মাইজচর|োইজচর/g, 'মাইজচর')
    .replace(/কিঘীরপাড়|কিকঘরপাড়/g, 'দিঘীরপাড়')
    .replace(/ইেলাে/g, 'ইসলাম')
    .replace(/আব্দলু/g, 'আব্দুল')
    .replace(/েতৃ|েৃত/g, 'মৃত')
    .replace(/হোোঃ/g, 'মোঃ')
    .replace(/ডাোঃ|ডোঃ/g, 'ডাঃ')
    .replace(/ে\s*ুােি|হো\s*ােি/g, 'মোহাম্মদ')
    .replace(/র\s*োন/g, 'রহমান')
    .replace(/রক\s*ি/g, 'রফিক')
    .replace(/ব্ল\s*ি/g, 'ব্লক')
    .replace(/লযাট/g, 'ফ্ল্যাট')
    .replace(/িযান্টনসেন্ট/g, 'ক্যান্টনমেন্ট')
    .replace(/ইিাকিয়াল/g, 'ইন্ডাস্ট্রিয়াল')
    .replace(/এন্দজকব|এন্দ\s*জকব/g, 'এজিবি')
    .replace(/েগু\s*িা/g, 'বগুড়া')
    .replace(/কেরপুর/g, 'মিরপুর')
    .replace(/োকলবাগ/g, 'মালিবাগ')
    .replace(/িেলাপুর/g, 'কমলাপুর')
    .replace(/কখ্লগাওূঁ|খ্\s*লগাও/g, 'খিলগাঁও')
    .replace(/কখ্লসখ্ত/g, 'খিলক্ষেত')
    .replace(/েবজু\s*বাগ/g, 'সবুজবাগ')
    .replace(/রােপুরা/g, 'রামপুরা')
    .replace(/আন্দজেপুর|আন্দ\s*জেপুর/g, 'আজিমপুর')
    .replace(/নবাবপুর/g, 'নবাবপুর')
    .replace(/বাোসবা/g, 'বাসাবো')
    .replace(/আগাোেী|আগােকন/g, 'আগামসী')
    .replace(/কনেতলী/g, 'নিমতলী')
    .replace(/বং\s*াল/g, 'বংশাল')
    .replace(/চাসেকনবাগ|চাসেকলবাগ/g, 'চামেলীবাগ')
    .replace(/\s+/g, ' ')
    .trim();
}

const lineBySl = new Map();
lines.forEach(l => {
  let m = l.match(/^([0-9]{1,3})\s*(.+)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= 570) lineBySl.set(n, m[2]);
  } else {
    m = l.match(/[^\d]*([0-9]{1,3})[^\d]+(.+)/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n >= 1 && n <= 570 && !lineBySl.has(n)) lineBySl.set(n, m[2]);
    }
  }
});

function parseRowDetailed(sl, rawText) {
  let text = cleanBangla(rawText);

  // Extract phone
  let phone = '';
  // match phone: 11 digits bn or en starting with 01 or 1, or 10 digits starting with 1
  let phoneMatch = text.match(/(?:[^\d]|^)(০[০-৯]{10}|01[0-9]{9}|1[3-9][0-9]{8}|০[০-৯]{9})(?:[^\d]|$)/);
  let beforePhone = '';
  let afterPhone = '';

  if (phoneMatch) {
    phone = bnToEnDigits(phoneMatch[1]);
    if (phone.length === 10 && phone.startsWith('1')) phone = '0' + phone;
    const pIdx = text.indexOf(phoneMatch[1]);
    beforePhone = text.substring(0, pIdx).trim();
    afterPhone = text.substring(pIdx + phoneMatch[1].length).trim();
  } else {
    // Find Kishorganj / Bajitpur
    const idx = text.indexOf('কিশোরগঞ্জ') !== -1 ? text.indexOf('কিশোরগঞ্জ') : text.indexOf('বাজিতপুর');
    if (idx > 5) {
      beforePhone = text.substring(0, idx).trim();
      afterPhone = text.substring(idx).trim();
    } else {
      beforePhone = text;
      afterPhone = '';
    }
  }

  // Name & Father
  let name = '';
  let father = '-';
  const fatherKw = ['মৃত :', 'মৃত:', 'মৃত', 'পিতা-মৃত', 'পিতা- মৃত', 'পিতা-', 'পিতা:', 'স্বামী:', 'স্বামী-', 'স্বামী', 'স্বাঃ', 'স্বােী:', 'স্বােী-'];
  let kwIdx = -1;
  let kwFound = '';
  for (const kw of fatherKw) {
    const idx = beforePhone.indexOf(kw);
    if (idx !== -1 && (kwIdx === -1 || idx < kwIdx)) {
      kwIdx = idx;
      kwFound = kw;
    }
  }

  if (kwIdx > 2) {
    name = beforePhone.substring(0, kwIdx).trim();
    father = beforePhone.substring(kwIdx).trim();
  } else {
    const words = beforePhone.split(' ').filter(w => w.length > 0);
    if (words.length <= 2) {
      name = words.join(' ');
      father = '-';
    } else {
      const mid = Math.ceil(words.length / 2);
      name = words.slice(0, mid).join(' ');
      father = words.slice(mid).join(' ');
    }
  }

  // Fee (500 or 100)
  let fee = 500;
  let feeIdx = -1;
  let feeLen = 0;
  const fMatch = afterPhone.match(/(?:^|\s)(৫০০|১০০|500|100)(?:\s*টাকা)?(?:\s|$)/);
  if (fMatch) {
    const feeStr = bnToEnDigits(fMatch[1]);
    fee = parseInt(feeStr, 10);
    feeIdx = afterPhone.indexOf(fMatch[0]);
    feeLen = fMatch[0].length;
  }

  let preFee = feeIdx !== -1 ? afterPhone.substring(0, feeIdx).trim() : afterPhone;
  let postFee = feeIdx !== -1 ? afterPhone.substring(feeIdx + feeLen).trim() : '';

  // Union
  let union = 'বাজিতপুর পৌরসভা';
  if (text.includes('দিলালপুর')) union = 'দিলালপুর ইউনিয়ন';
  else if (text.includes('সরারচর')) union = 'সরারচর ইউনিয়ন';
  else if (text.includes('হিলচিয়া') || text.includes('হিলচিয়া')) union = 'হিলচিয়া ইউনিয়ন';
  else if (text.includes('দিঘীরপাড়') || text.includes('দিঘীরপাড়')) union = 'দিঘীরপাড় ইউনিয়ন';
  else if (text.includes('হালিমপুর')) union = 'হালিমপুর ইউনিয়ন';
  else if (text.includes('পিরিজপুর')) union = 'পিরিজপুর ইউনিয়ন';
  else if (text.includes('বলিয়ারদী') || text.includes('বলিয়ারদী')) union = 'বলিয়ারদী ইউনিয়ন';
  else if (text.includes('মাইজচর')) union = 'মাইজচর ইউনিয়ন';
  else if (text.includes('গাজীরচর')) union = 'গাজীরচর ইউনিয়ন';
  else if (text.includes('হুমাইপুর')) union = 'হুমাইপুর ইউনিয়ন';
  else if (text.includes('কৈলাগ')) union = 'কৈলাগ ইউনিয়ন';
  else if (text.includes('পৌরসভা') || text.includes('পৌর')) union = 'বাজিতপুর পৌরসভা';

  // Profession
  let profession = 'ব্যবসা';
  const profList = [
    { key: 'সাংবাদিকতা', label: 'সাংবাদিকতা' },
    { key: 'সাংবাদিক', label: 'সাংবাদিকতা' },
    { key: 'আইনজীবী', label: 'আইনজীবী' },
    { key: 'ডাক্তার', label: 'ডাক্তার' },
    { key: 'চিকিৎসক', label: 'ডাক্তার' },
    { key: 'শিক্ষকতা', label: 'শিক্ষকতা' },
    { key: 'শিক্ষক', label: 'শিক্ষক' },
    { key: 'ব্যাংকার', label: 'ব্যাংকার' },
    { key: 'ব্যাংক', label: 'ব্যাংকার' },
    { key: 'গৃহিণী', label: 'গৃহিণী' },
    { key: 'শিক্ষার্থী', label: 'শিক্ষার্থী' },
    { key: 'ছাত্র', label: 'শিক্ষার্থী' },
    { key: 'ছাত্রী', label: 'শিক্ষার্থী' },
    { key: 'প্রকৌশলী', label: 'প্রকৌশলী' },
    { key: 'চাকুরীজীবী', label: 'চাকুরীজীবী' },
    { key: 'চাকুরী', label: 'চাকুরী' },
    { key: 'ব্যবসায়ী', label: 'ব্যবসায়ী' },
    { key: 'ব্যবসা', label: 'ব্যবসা' },
    { key: 'ড্রাইভার', label: 'ড্রাইভার' },
    { key: 'ফটোগ্রাফার', label: 'ফটোগ্রাফার' },
    { key: 'অবসরপ্রাপ্ত', label: 'অবসরপ্রাপ্ত' },
  ];

  let profFound = null;
  let profIdx = -1;
  for (const p of profList) {
    const idx = preFee.indexOf(p.key);
    if (idx !== -1 && (profIdx === -1 || idx < profIdx)) {
      profIdx = idx;
      profFound = p.label;
    }
  }

  let addressPart = preFee;
  if (profIdx !== -1) {
    profession = profFound;
    addressPart = preFee.substring(0, profIdx).trim();
  }

  // AddressPart: split into permanent & present address
  let perm = '';
  let pres = '';
  const kgIdx = addressPart.indexOf('কিশোরগঞ্জ');
  if (kgIdx !== -1) {
    perm = addressPart.substring(0, kgIdx + 9).trim();
    pres = addressPart.substring(kgIdx + 9).trim();
  } else {
    const bjIdx = addressPart.indexOf('বাজিতপুর');
    if (bjIdx !== -1) {
      perm = addressPart.substring(0, bjIdx + 8).trim();
      pres = addressPart.substring(bjIdx + 8).trim();
    } else {
      perm = addressPart;
      pres = '-';
    }
  }

  // clean pres
  pres = pres.replace(/^[,.\s-]+/, '').trim();
  if (!pres) pres = 'ঢাকা';

  // Reference is in postFee
  let reference = postFee.trim();
  reference = reference.replace(/দিলালপুর ইউকনয়ন|দিলালপুর ইউনিয়ন|বাজিতপুর পৌরসভা|সরারচর ইউকনয়ন|সরারচর ইউনিয়ন|হিলচিয়া ইউনিয়ন|দিঘীরপাড় ইউনিয়ন|হালিমপুর ইউনিয়ন|পিরিজপুর ইউনিয়ন|বলিয়ারদী ইউনিয়ন|মাইজচর ইউনিয়ন|গাজীরচর ইউনিয়ন|হুমাইপুর ইউনিয়ন/g, '').trim();
  reference = reference.replace(/^[,.\s-]+/, '').trim();
  if (!reference) reference = 'বাজিতপুর সমিতি ঢাকা';

  return {
    sl,
    name: name || `সদস্য #${sl}`,
    fatherOrSpouse: father || '-',
    phone: phone || '-',
    permanentAddress: perm || 'বাজিতপুর, কিশোরগঞ্জ',
    presentAddress: pres,
    profession,
    fee: isNaN(fee) ? 500 : fee,
    union,
    reference
  };
}

const members = [];
for (let sl = 1; sl <= 570; sl++) {
  const raw = lineBySl.get(sl) || '';
  const parsed = parseRowDetailed(sl, raw);
  members.push(parsed);
}

console.log('Total members processed:', members.length);
console.log('Sample parsed member #1:');
console.log(members[0]);
console.log('Sample parsed member #50:');
console.log(members[49]);
console.log('Sample parsed member #570:');
console.log(members[569]);

// Save to src/data/members.json
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/members.json', JSON.stringify(members, null, 2), 'utf-8');

// Also write TypeScript file
const tsContent = `// বাজিতপুর সমিতি ঢাকা - সকল সদস্যদের ডাটাবেজ (মোট ৫৭০ জন সদস্য)
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
}

export const ALL_MEMBERS: Member[] = ${JSON.stringify(members, null, 2)};
`;
fs.writeFileSync('src/data/members.ts', tsContent, 'utf-8');
console.log('Successfully wrote src/data/members.json and src/data/members.ts');
