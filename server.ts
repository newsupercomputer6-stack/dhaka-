import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const NOTICES_FILE = path.join(DATA_DIR, 'notices.json');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');
const SEED_MEMBERS_FILE = path.join(__dirname, 'src', 'data', 'members.json');
const ORG_FILE = path.join(DATA_DIR, 'organization.json');

const DEFAULT_ORG = {
  name: 'বাজিতপুর সমিতি, ঢাকা',
  established: '১৩ই মার্চ, ১৯৮৬',
  tagline: 'বাজিতপুর উপজেলার (কিশোরগঞ্জ) ঢাকার সকল সম্মানিত সদস্যদের তথ্য ভাণ্ডার ও ডিজিটাল ডিরেক্টরি',
  address: '৭৯, তৃতীয় তলা, শান্তেশ্বরী সার্কুলার রোড, মালিবাগ, ঢাকা',
  contactPhones: ['017732026', '01713180019', '01711049013', '01917391210'],
  email: 'bajitpursamitydhaka@gmail.com',
  website: '',
  motto: 'ঐক্য, সম্প্রীতি, সেবা ও উন্নয়ন।',
  mission: 'ঢাকায় বসবাসরত বাজিতপুরবাসীকে ঐক্যবদ্ধ করে পারস্পরিক সহযোগিতা, সামাজিক সম্প্রীতি ও ভ্রাতৃত্ববোধ সুদৃঢ় করা। শিক্ষা, স্বাস্থ্য, সংস্কৃতি ও মানবিক সেবামূলক কার্যক্রমের মাধ্যমে অসহায় ও সুবিধাবঞ্চিত মানুষের পাশে দাঁড়ানো। বাজিতপুরের ইতিহাস, ঐতিহ্য, লোকসংস্কৃতি ও মুক্তিযুদ্ধের স্মৃতি সংরক্ষণ এবং নতুন প্রজন্মের কাছে তা তুলে ধরা। একই সঙ্গে বাজিতপুরের আর্থসামাজিক উন্নয়নে সম্মিলিত উদ্যোগ গ্রহণ ও একটি মানবিক, প্রগতিশীল ও কল্যাণমুখী সমাজ গঠনে ভূমিকা রাখা।',
  vision: 'একটি ঐক্যবদ্ধ, মানবিক, শিক্ষিত, সমৃদ্ধ ও মর্যাদাপূর্ণ বাজিতপুর গড়ে তোলা—যেখানে ঢাকায় বসবাসরত বাজিতপুরবাসীর পারস্পরিক বন্ধন হবে শক্তিশালী, প্রতিটি মানুষ পাবে সহযোগিতা ও এগিয়ে যাওয়ার সুযোগ এবং আমাদের ইতিহাস, ঐতিহ্য ও সাংস্কৃতিক পরিচয় থাকবে সুরক্ষিত। দেশ-বিদেশে ছড়িয়ে থাকা বাজিতপুরবাসীকে একই বন্ধনে আবদ্ধ করে একটি আদর্শ, স্বচ্ছ, জবাবদিহিমূলক ও জনকল্যাণমুখী সংগঠন হিসেবে বাজিতপুর সমিতি, ঢাকা প্রতিষ্ঠা করাই আমাদের দীর্ঘমেয়াদি স্বপ্ন।',
  commitment: 'ঐক্যে শক্তি, সহযোগিতায় অগ্রগতি, মানবিকতায় সমৃদ্ধি—বাজিতপুরবাসীর কল্যাণে আমরা সবাই একসঙ্গে।',
};

function getOrganization() {
  if (!fs.existsSync(ORG_FILE)) {
    return DEFAULT_ORG;
  }
  try {
    const data = fs.readFileSync(ORG_FILE, 'utf-8');
    return { ...DEFAULT_ORG, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_ORG;
  }
}

function saveOrganization(data: any) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(ORG_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const INITIAL_NOTICES = [
  {
    id: 'notice-1',
    title: 'বাজিতপুর সমিতি ঢাকা-এর বার্ষিক সাধারণ সভা ও সদস্য পুনর্মিলনী',
    category: 'সভা',
    content: 'বাজিতপুর সমিতি, ঢাকা-এর সকল সম্মানিত জীবন সদস্য ও সাধারণ সদস্যবৃন্দের সদয় অবগতির জন্য জানানো যাচ্ছে যে, আগামী মাসের দ্বিতীয় শুক্রবার সকাল ১০:০০ ঘটিকায় সমিতির বার্ষিক সাধারণ সভা ও প্রীতি মিলনমেলা অনুষ্ঠিত হবে। সকল সদস্যকে যথাসময়ে উপস্থিত থেকে অনুষ্ঠানকে সাফল্যমণ্ডিত করার জন্য বিনীত অনুরোধ জানানো যাচ্ছে।',
    date: '২৯ অক্টোবর, ২০২৬',
    isPinned: true,
    publishedBy: 'সাধারণ সম্পাদক, বাজিতপুর সমিতি ঢাকা',
    phone: '01713180019'
  },
  {
    id: 'notice-2',
    title: 'নতুন সদস্য অন্তর্ভুক্তি ও বর্তমান সদস্যদের তথ্য হালনাগাদ কার্যক্রম',
    category: 'সদস্য সংগ্রহ',
    content: 'ঢাকায় বসবাসরত বাজিতপুর উপজেলার সকল সম্মানিত বাসিন্দাদের সমিতিতে অন্তর্ভুক্তির জন্য নতুন সদস্য নিবন্ধন এবং সদস্যদের মোবাইল নম্বর/বর্তমান ঠিকানা হালনাগাদ করার কাজ চলমান রয়েছে। আপনার পরিবারের বা এলাকার বাজিতপুরবাসীদের যুক্ত করতে ওপরের "নতুন সদস্য" বোতামে ক্লিক করে আবেদন ফরম পূরণ করুন।',
    date: '২৬ অক্টোবর, ২০২৬',
    isPinned: true,
    publishedBy: 'দপ্তর সম্পাদক, বাজিতপুর সমিতি ঢাকা',
    phone: '01711049013'
  },
  {
    id: 'notice-3',
    title: 'মেধাবী শিক্ষার্থী কল্যাণ তহবিল ও চিকিৎসা সহায়তা আবেদন আহ্বান',
    category: 'কল্যাণ তহবিল',
    content: 'বাজিতপুর সমিতির শিক্ষা ও কল্যাণ তহবিলের আওতায় ঢাকা বিশ্ববিদ্যালয়ে ও বিভিন্ন মেডিকেল/পাবলিক বিশ্ববিদ্যালয়ে অধ্যয়নরত অসচ্ছল মেধাবী শিক্ষার্থীদের শিক্ষাবৃত্তি এবং সমিতির অসুস্থ সদস্যদের জরুরি চিকিৎসার জন্য আর্থিক সহায়তা আবেদন গ্রহণ করা হচ্ছে। বিস্তারিত তথ্যের জন্য সমিতির অস্থায়ী কার্যালয়ে বা সংশ্লিষ্ট মোবাইল নম্বরে যোগাযোগ করুন।',
    date: '২০ অক্টোবর, ২০২৬',
    isPinned: false,
    publishedBy: 'কল্যাণ উপকমিটি',
    phone: '01917391210'
  }
];

function getNotices() {
  if (!fs.existsSync(NOTICES_FILE)) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(NOTICES_FILE, JSON.stringify(INITIAL_NOTICES, null, 2), 'utf-8');
    return INITIAL_NOTICES;
  }
  try {
    const data = fs.readFileSync(NOTICES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTICES;
  } catch (e) {
    return INITIAL_NOTICES;
  }
}

function saveNotices(notices: any[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(NOTICES_FILE, JSON.stringify(notices, null, 2), 'utf-8');
}

function getMembers(): any[] {
  if (!fs.existsSync(MEMBERS_FILE)) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SEED_MEMBERS_FILE)) {
      try {
        const seedData = fs.readFileSync(SEED_MEMBERS_FILE, 'utf-8');
        fs.writeFileSync(MEMBERS_FILE, seedData, 'utf-8');
        return JSON.parse(seedData);
      } catch (e) {
        console.error('Error reading seed members file', e);
      }
    }
    return [];
  }
  try {
    const data = fs.readFileSync(MEMBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveMembers(members: any[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2), 'utf-8');
}

// Organization Profile Routes
app.get('/api/organization', (_req, res) => {
  res.json(getOrganization());
});

app.post('/api/organization', (req, res) => {
  const current = getOrganization();
  const updated = { ...current, ...req.body };
  saveOrganization(updated);
  res.json(updated);
});

// Notice API Routes
app.get('/api/notices', (_req, res) => {
  res.json(getNotices());
});

app.post('/api/notices', (req, res) => {
  const notices = getNotices();
  const newNotice = {
    ...req.body,
    id: req.body.id || `notice-${Date.now()}`,
  };
  notices.unshift(newNotice);
  saveNotices(notices);
  res.status(201).json(newNotice);
});

app.put('/api/notices/:id', (req, res) => {
  const notices = getNotices();
  const index = notices.findIndex((n: any) => n.id === req.params.id);
  if (index !== -1) {
    notices[index] = { ...notices[index], ...req.body };
    saveNotices(notices);
    res.json(notices[index]);
  } else {
    res.status(404).json({ error: 'Notice not found' });
  }
});

app.delete('/api/notices/:id', (req, res) => {
  let notices = getNotices();
  notices = notices.filter((n: any) => n.id !== req.params.id);
  saveNotices(notices);
  res.json({ success: true });
});

// Member API Routes (For public link registrations & live sync)
app.get('/api/members', (_req, res) => {
  res.json(getMembers());
});

app.post('/api/members', (req, res) => {
  const members = getMembers();
  // Find highest serial number
  const maxSl = members.reduce((max: number, m: any) => (m.sl > max ? m.sl : max), 0);
  const newMember = {
    sl: maxSl + 1,
    name: (req.body.name || '').trim(),
    fatherOrSpouse: (req.body.fatherOrSpouse || '-').trim(),
    phone: (req.body.phone || '-').trim(),
    permanentAddress: (req.body.permanentAddress || 'বাজিতপুর, কিশোরগঞ্জ').trim(),
    presentAddress: (req.body.presentAddress || 'ঢাকা').trim(),
    profession: (req.body.profession || 'অন্যান্য').trim(),
    fee: Number(req.body.fee) || 500,
    union: (req.body.union || 'বাজিতপুর পৌরসভা').trim(),
    reference: (req.body.reference || 'অনলাইন নিবন্ধন লিংক').trim(),
    photo: req.body.photo || undefined,
  };

  members.unshift(newMember);
  saveMembers(members);
  res.status(201).json(newMember);
});

app.put('/api/members/:sl', (req, res) => {
  const targetSl = Number(req.params.sl);
  const members = getMembers();
  const index = members.findIndex((m: any) => m.sl === targetSl);
  if (index !== -1) {
    members[index] = { ...members[index], ...req.body, sl: targetSl };
    saveMembers(members);
    res.json(members[index]);
  } else {
    res.status(404).json({ error: 'Member not found' });
  }
});

app.delete('/api/members/:sl', (req, res) => {
  const targetSl = Number(req.params.sl);
  let members = getMembers();
  members = members.filter((m: any) => m.sl !== targetSl);
  saveMembers(members);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bajitpur Samity Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
