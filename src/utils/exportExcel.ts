import { Member } from '../types';

export function exportToCSV(members: Member[], filename: string = 'বাজিতপুর_সমিতি_ঢাকা_সদস্য_তালিকা.csv') {
  const headers = [
    'ক্র.নং',
    'নাম',
    'পিতা / স্বামীর নাম',
    'মোবাইল নম্বর',
    'স্থায়ী ঠিকানা',
    'বর্তমান ঠিকানা',
    'পেশা',
    'সদস্য ফি (টাকা)',
    'ইউনিয়ন / পৌরসভা',
    'রেফারেন্স / মন্তব্য'
  ];

  const escapeCSV = (value: string | number) => {
    const str = String(value ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = members.map(m => [
    m.sl,
    escapeCSV(m.name),
    escapeCSV(m.fatherOrSpouse),
    escapeCSV(m.phone),
    escapeCSV(m.permanentAddress),
    escapeCSV(m.presentAddress),
    escapeCSV(m.profession),
    m.fee,
    escapeCSV(m.union),
    escapeCSV(m.reference)
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatBnNumber(num: number | string): string {
  const bnDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).replace(/[0-9]/g, d => bnDigits[d] || d);
}
