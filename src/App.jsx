import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  MapPin, Phone, Mail, Building, Sparkles,
  ClipboardList, UserCheck, History, Send, RefreshCw, ExternalLink,
  AlertTriangle, LayoutDashboard, Menu, X,
  Upload, Lock, User, Image as ImageIcon, Link2, Newspaper,
  Shield, CheckCircle, LogIn, School, MessageSquare, Calendar as CalendarIcon,
  ChevronRight, Printer, Search, Eye, Download, Users, LogOut, Bell,
  Plus, Edit, Trash2
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// ============================================================================
// 1. INITIAL REALISTIC SEED DATA & CONSTANTS (SDN MERJOSARI 2 - MALANG)
// ============================================================================

const STORAGE_KEY = 'sdn_merjosari_2_sim_v2';

const SCHOOL_INFO = {
  name: 'SDN Merjosari 2',
  npsn: '20534039',
  address: 'Jl. Joyo Utomo I, Kec. Lowokwaru, Kota Malang, Prov. Jawa Timur',
  phone: '(0341) 554020',
  email: 'sdnmerjo_sari02@gmail.com',
  visi: 'Peserta Didik Cerdas, Terampil dan Berkepribadian Baik Yang Dilandasi IMTAQ.',
  misi: 'Melaksanakan Pembelajaran Secara Efektif Agar Siswa Berkembang Optimal Sesuai Dengan Potensi Yang Dimiliki.',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=Jl.%20Joyo%20Utomo%20I,%20Lowokwaru,%20Kota%20Malang,%20Jawa%20Timur&t=&z=16&ie=UTF8&iwloc=&output=embed',
  mapsExternalUrl: 'https://www.google.com/maps/search/?api=1&query=Jl.+Joyo+Utomo+I,+Kec.+Lowokwaru,+Kota+Malang,+Prov.+Jawa+Timur'
};

const INITIAL_USERS = [
  {
    id: 'usr-kepsek',
    username: 'kepsek',
    password: '123',
    role: 'kepala_sekolah',
    roleLabel: 'Kepala Sekolah',
    phone: '(0341) 554020',
    email: 'sdnmerjo_sari02@gmail.com',
    avatar: 'KS',
    photoUrl: ''
  },
  {
    id: 'usr-guru',
    username: 'guru',
    password: '123',
    role: 'guru',
    roleLabel: 'Guru',
    phone: '(0341) 554020',
    email: 'sdnmerjo_sari02@gmail.com',
    avatar: 'GR',
    photoUrl: ''
  }
];

const INITIAL_GUESTBOOK = [
  {
    id: 'gb-1',
    regNumber: 'GT-2026-1041',
    name: 'Drs. Hendra Gunawan',
    institution: 'Dinas Pendidikan Kota Malang',
    phone: '0812-3300-1188',
    purpose: 'Kunjungan Dinas',
    destination: 'Bertemu Kepala Sekolah terkait monitoring ANBK',
    notes: 'Monitoring kesiapan Asesmen Nasional Berbasis Komputer (ANBK)',
    date: '2026-11-16',
    time: '09:15',
    verified: true
  },
  {
    id: 'gb-2',
    regNumber: 'GT-2026-1042',
    name: 'Ratna Sari Dewi',
    institution: 'Wali Murid Kelas III-B',
    phone: '0857-9088-2211',
    purpose: 'Wali Murid',
    destination: 'Konsultasi dengan Wali Kelas III-B',
    notes: 'Konsultasi perkembangan literasi dan administrasi mutasi alamat',
    date: '2026-11-17',
    time: '08:30',
    verified: false
  },
  {
    id: 'gb-3',
    regNumber: 'GT-2026-1043',
    name: 'M. Rizky Pratama',
    institution: 'Universitas Negeri Malang (UM)',
    phone: '0813-5566-7788',
    purpose: 'Penelitian/Magang',
    destination: 'Pengajuan surat izin observasi kelas IV',
    notes: 'Pengajuan izin observasi media pembelajaran digital kelas IV',
    date: '2026-11-17',
    time: '10:40',
    verified: false
  }
];

const INITIAL_ASPIRASI = [
  {
    id: 'asp-1',
    ticketNumber: 'ASP-2026-8821',
    senderName: 'Bapak Sutrisno (Wali Murid)',
    contact: '0812-9988-7766',
    category: 'Sarana & Prasarana',
    subject: 'Penambahan Kanopi Area Tunggu Penjemputan Siswa',
    content: 'Mohon dipertimbangkan penambahan kanopi di area gerbang depan agar siswa tidak kehujanan saat menunggu penjemputan di musim hujan.',
    attachment: 'foto_area_gerbang.jpg',
    status: 'Dalam Tindak Lanjut',
    priority: 'Tinggi',
    createdAt: '2026-11-10',
    publicNote: 'Terima kasih atas masukannya. Usulan telah diverifikasi dan masuk dalam rencana pemeliharaan sarana bulan ini.',
    internalNote: 'Sudah disurvei oleh bagian sarpras, estimasi anggaran diajukan ke komite sekolah.',
    linkedFollowUpId: 'fu-1',
    history: [
      { date: '2026-11-10 08:20', status: 'Baru Masuk', note: 'Aspirasi diterima melalui portal publik.' },
      { date: '2026-11-11 10:00', status: 'Diverifikasi', note: 'Diverifikasi dan diteruskan ke tindak lanjut sekolah.' },
      { date: '2026-11-12 14:15', status: 'Dalam Tindak Lanjut', note: 'Dihubungkan ke modul Tindak Lanjut (TL-2026-001).' }
    ]
  },
  {
    id: 'asp-2',
    ticketNumber: 'ASP-2026-8822',
    senderName: 'Ibu Melati Kusuma',
    contact: 'melati.k@email.com',
    category: 'Akademik & Pembelajaran',
    subject: 'Apresiasi Kelas Literasi Pagi & Usulan Klub Coding Anak',
    content: 'Program baca 15 menit sebelum pelajaran sangat positif. Kami mengusulkan ekstrakurikuler pengenalan logika & coding dasar untuk kelas IV-VI.',
    attachment: '',
    status: 'Diverifikasi',
    priority: 'Sedang',
    createdAt: '2026-11-14',
    publicNote: 'Terima kasih atas apresiasi dan ide inovatifnya. Sedang dikaji oleh tim kurikulum dan kesiswaan.',
    internalNote: 'Cocok disinergikan dengan program Lab Komputer semester genap.',
    linkedFollowUpId: 'fu-2',
    history: [
      { date: '2026-11-14 13:10', status: 'Baru Masuk', note: 'Aspirasi dikirimkan melalui formulir online.' },
      { date: '2026-11-15 09:30', status: 'Diverifikasi', note: 'Diterima dan dijadwalkan pembahasan kurikulum.' }
    ]
  },
  {
    id: 'asp-3',
    ticketNumber: 'ASP-2026-8823',
    senderName: 'Anonim',
    contact: '-',
    category: 'Lainnya',
    subject: 'Perbaikan Keran Air Wastafel Dekat Kelas II',
    content: 'Keran wastafel nomor 2 di depan kelas II agak bocor sehingga air terus menetes.',
    attachment: '',
    status: 'Selesai',
    priority: 'Sedang',
    createdAt: '2026-11-05',
    publicNote: 'Keran wastafel telah diganti dengan unit baru oleh petugas kebersihan & sarpras pada 6 November 2026.',
    internalNote: 'Selesai diganti, sudah dicek berfungsi normal.',
    linkedFollowUpId: null,
    history: [
      { date: '2026-11-05 11:00', status: 'Baru Masuk', note: 'Laporan diterima.' },
      { date: '2026-11-06 08:45', status: 'Selesai', note: 'Perbaikan selesai dilakukan.' }
    ]
  }
];

const INITIAL_DOKUMENTASI = [
  {
    id: 'dok-1',
    title: 'Upacara Peringatan Hari Pahlawan & Lomba Kostum Pejuang',
    category: 'Kesiswaan',
    date: '2026-11-10',
    year: '2026',
    status: 'Terbit',
    mediaType: 'Foto',
    fileName: 'upacara_hari_pahlawan_2026.jpg',
    fileUrl: '',
    description: 'Seluruh siswa kelas I hingga VI mengikuti upacara bendera dengan khidmat dilanjutkan parade busana pahlawan nasional untuk menanamkan nilai patriotisme sejak dini.'
  },
  {
    id: 'dok-2',
    title: 'Workshop Implementasi Pembelajaran Interaktif Berbasis TIK',
    category: 'Akademik',
    date: '2026-10-24',
    year: '2026',
    status: 'Terbit',
    mediaType: 'Foto',
    fileName: 'workshop_tik_guru.jpg',
    fileUrl: '',
    description: 'Pelatihan internal guru-guru SDN Merjosari 2 dalam memanfaatkan papan interaktif dan asesmen digital guna meningkatkan keterlibatan siswa di kelas.'
  },
  {
    id: 'dok-3',
    title: 'Gerakan Sekolah Sehat & Senam Pagi Bersama',
    category: 'Ekstrakurikuler',
    date: '2026-11-01',
    year: '2026',
    status: 'Terbit',
    mediaType: 'Video',
    fileName: 'senam_jumat_sehat.mp4',
    fileUrl: '',
    description: 'Kegiatan rutin Jumat Sehat meliputi senam bersama, pemeriksaan kebersihan kuku dan gigi oleh tim UKS cilik, serta sarapan bergizi bersama.'
  }
];

const INITIAL_PENGUMUMAN = [
  {
    id: 'pg-1',
    title: 'Penerimaan Bantuan 250 Eksemplar Buku Pengayaan Perpustakaan Sekolah',
    date: '2026-11-04',
    category: 'Pengumuman Sekolah',
    visibility: 'Publik',
    photoUrl: '',
    photoName: 'penyerahan_buku_perpustakaan.jpg',
    content: 'SDN Merjosari 2 telah menerima 250 eksemplar buku bacaan literasi anak hasil kolaborasi program Gerakan Literasi Sekolah Kota Malang. Seluruh buku telah dicatat pada katalog perpustakaan dan mulai dapat dipinjam oleh seluruh siswa kelas I sampai VI pada jam istirahat maupun jam kunjung literasi.'
  },
  {
    id: 'pg-2',
    title: 'Jadwal Pelaksanaan Sumatif Akhir Semester (SAS) Ganjil Tahun Ajaran 2026/2027',
    date: '2026-11-12',
    category: 'Informasi Akademik',
    visibility: 'Publik',
    photoUrl: '',
    photoName: 'rapat_persiapan_sas.jpg',
    content: 'Diberitahukan kepada seluruh orang tua/wali murid bahwa pelaksanaan Sumatif Akhir Semester (SAS) Ganjil akan dilaksanakan mulai tanggal 1 Desember hingga 8 Desember 2026. Mohon pendampingan belajar di rumah serta menjaga kesehatan putra-putri selama masa ujian berlangsung.'
  },
  {
    id: 'pg-3',
    title: 'Himbauan Gerakan Jumat Bersih & Bawa Botol Minum Tumbler',
    date: '2026-11-15',
    category: 'Kegiatan Sekolah',
    visibility: 'Publik',
    photoUrl: '',
    photoName: 'gerakan_jumat_bersih.jpg',
    content: 'Dalam rangka mendukung budaya sekolah sehat dan pengurangan sampah plastik, seluruh siswa dihimbau membawa botol minum (tumbler) dan tempat bekal masing-masing setiap hari sekolah.'
  }
];

const INITIAL_AGENDAS = [
  {
    id: 'ag-1',
    title: 'Rapat Dinas Evaluasi Kurikulum Merdeka',
    date: '2026-11-18',
    startTime: '13:00',
    endTime: '15:00',
    location: 'Ruang Guru',
    category: 'Rapat & Dinas',
    color: 'blue',
    priority: 'Tinggi',
    recurrence: 'Sekali',
    description: 'Evaluasi capaian pembelajaran tengah semester dan persiapan rapor digital.',
    status: 'Disetujui',
    submittedBy: 'Kepala Sekolah',
    submitterId: 'usr-kepsek',
    revisionNote: '',
    attachment: 'undangan_rapat_nov.pdf'
  },
  {
    id: 'ag-2',
    title: 'Outing Class Edukasi Lingkungan & Urban Farming',
    date: '2026-11-21',
    startTime: '08:00',
    endTime: '11:30',
    location: 'Taman Edukasi Merjosari',
    category: 'Akademik',
    color: 'emerald',
    description: 'Praktik langsung pembelajaran IPAS kelas V mengenai ekosistem dan hidroponik.',
    status: 'Disetujui',
    submittedBy: 'Guru',
    submitterId: 'usr-guru',
    revisionNote: '',
    attachment: 'proposal_outing_kelas5.pdf'
  },
  {
    id: 'ag-3',
    title: 'Lomba Cerdas Cermat Antar Kelas (Class Meeting)',
    date: '2026-12-10',
    startTime: '08:00',
    endTime: '12:00',
    location: 'Aula & Lapangan Utama',
    category: 'Kesiswaan',
    color: 'amber',
    description: 'Kegiatan pasca ujian untuk mengasah sportivitas, literasi, dan kerja sama tim siswa.',
    status: 'Menunggu Persetujuan',
    submittedBy: 'Guru',
    submitterId: 'usr-guru',
    revisionNote: '',
    attachment: 'juknis_lomba_desember.pdf'
  },
  {
    id: 'ag-4',
    title: 'Sumatif Akhir Semester (SAS) Ganjil 2026/2027',
    date: '2026-12-01',
    startTime: '07:30',
    endTime: '11:00',
    location: 'Seluruh Ruang Kelas',
    category: 'Akademik',
    color: 'purple',
    description: 'Pelaksanaan penilaian akhir semester ganjil untuk kelas I sampai VI.',
    status: 'Disetujui',
    submittedBy: 'Kepala Sekolah',
    submitterId: 'usr-kepsek',
    revisionNote: '',
    attachment: 'jadwal_sas_2026.pdf'
  }
];

const INITIAL_FOLLOWUPS = [
  {
    id: 'fu-1',
    code: 'TL-2026-001',
    title: 'Pemasangan Kanopi Area Tunggu Gerbang Depan',
    sourceType: 'Aspirasi',
    sourceRef: 'ASP-2026-8821',
    actionPlan: 'Melakukan pengukuran ulang area gerbang, meminta penawaran vendor kanopi baja ringan, dan mengoordinasikan pemasangan.',
    pic: 'Kepala Sekolah',
    priority: 'Tinggi',
    deadline: '2026-11-28',
    status: 'Sedang Berlangsung',
    evidenceNote: 'Foto pengukuran lahan gerbang depan telah diunggah.',
    evidenceFileName: 'pengukuran_gerbang.jpg',
    evidenceFileUrl: '',
    timeline: [
      { date: '2026-11-12', status: 'Belum Dimulai', note: 'Tindak lanjut dibuat dari tiket aspirasi ASP-2026-8821.' },
      { date: '2026-11-15', status: 'Sedang Berlangsung', note: 'Survei teknis dan penyusunan RAB selesai.' }
    ]
  },
  {
    id: 'fu-2',
    code: 'TL-2026-002',
    title: 'Kajian Program Ekstrakurikuler Literasi & Coding Dasar',
    sourceType: 'Aspirasi',
    sourceRef: 'ASP-2026-8822',
    actionPlan: 'Menyusun silabus pengenalan logika & coding dasar menggunakan perangkat Chromebook sekolah untuk kelas IV-VI.',
    pic: 'Guru',
    priority: 'Sedang',
    deadline: '2026-11-25',
    status: 'Menunggu Verifikasi',
    evidenceNote: 'Draf silabus dan foto kesiapan ruang lab komputer telah dilampirkan.',
    evidenceFileName: 'silabus_coding_dasar.pdf',
    evidenceFileUrl: '',
    timeline: [
      { date: '2026-11-15', status: 'Sedang Berlangsung', note: 'Penyusunan modul pengenalan logika anak.' },
      { date: '2026-11-17', status: 'Menunggu Verifikasi', note: 'Draf modul selesai disusun oleh Guru.' }
    ]
  }
];

// ============================================================================
// 2. FILE UPLOAD HELPER (CONVERT FILE TO DATAURL FOR PERSISTENT PREVIEW)
// ============================================================================

function readFileAsDataUrl(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    callback({
      name: file.name,
      type: file.type,
      url: e.target.result
    });
  };
  reader.readAsDataURL(file);
}

// ============================================================================
// 3. PRINT / PDF EXPORT HELPER FOR ACADEMIC CALENDAR
// ============================================================================

function downloadCalendarPDF(agendas, monthFilter = '') {
  const filtered = monthFilter
    ? agendas.filter(a => a.date.startsWith(monthFilter))
    : agendas;

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }

  const rowsHtml = filtered.map((ag, idx) => `
    <tr>
      <td style="border:1px solid #cbd5e1;padding:8px;text-align:center;">${idx + 1}</td>
      <td style="border:1px solid #cbd5e1;padding:8px;">${ag.date}</td>
      <td style="border:1px solid #cbd5e1;padding:8px;">${ag.startTime} - ${ag.endTime}</td>
      <td style="border:1px solid #cbd5e1;padding:8px;font-weight:600;">${ag.title}</td>
      <td style="border:1px solid #cbd5e1;padding:8px;">${ag.category}</td>
      <td style="border:1px solid #cbd5e1;padding:8px;">${ag.location}</td>
      <td style="border:1px solid #cbd5e1;padding:8px;">${ag.description || '-'}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kalender Akademik - ${SCHOOL_INFO.name}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #0f172a; padding: 28px; }
        .kop { text-align: center; border-bottom: 3px double #1e3a8a; padding-bottom: 12px; margin-bottom: 20px; }
        .kop h1 { margin: 4px 0; font-size: 20px; color: #1e3a8a; }
        .kop p { margin: 2px 0; font-size: 12px; color: #475569; }
        h2 { text-align: center; font-size: 16px; margin-bottom: 16px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background-color: #1e40af; color: white; border: 1px solid #1e3a8a; padding: 8px; text-align: left; }
        .footer { margin-top: 28px; text-align: right; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="kop">
        <p>PEMERINTAH KOTA MALANG • DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
        <h1>${SCHOOL_INFO.name.toUpperCase()} (NPSN: ${SCHOOL_INFO.npsn})</h1>
        <p>${SCHOOL_INFO.address} • Telp. ${SCHOOL_INFO.phone} • Email: ${SCHOOL_INFO.email}</p>
      </div>
      <h2>Kalender Akademik & Agenda Kegiatan Sekolah ${monthFilter ? `(Periode ${monthFilter})` : ''}</h2>
      <table>
        <thead>
          <tr>
            <th style="width:36px;text-align:center;">No</th>
            <th style="width:95px;">Tanggal</th>
            <th style="width:95px;">Waktu</th>
            <th>Nama Kegiatan</th>
            <th style="width:115px;">Kategori</th>
            <th style="width:130px;">Lokasi</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="7" style="text-align:center;padding:16px;">Tidak ada agenda pada periode ini.</td></tr>'}
        </tbody>
      </table>
      <div class="footer">
        <p>Malang, ${new Date().toISOString().slice(0, 10)}</p>
        <p style="margin-top:48px;font-weight:bold;">Kepala ${SCHOOL_INFO.name}</p>
      </div>
      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// ============================================================================
// 4. RELATIONAL APPLICATION CONTEXT & LOCALSTORAGE PERSISTENCE
// ============================================================================

const mapGuestbookRow = (row) => {
  const message = String(row.message || '');
  const readMessage = (label) => {
    const line = message.split('\n').find(item => item.startsWith(`${label}:`));
    return line ? line.slice(label.length + 1).trim() : '';
  };
  const createdAt = row.created_at ? new Date(row.created_at) : new Date();
  const regNumber = readMessage('No. Registrasi') || `GT-${createdAt.getFullYear()}-${String(row.id).slice(0, 4).toUpperCase()}`;
  const status = String(row.status || '').toLowerCase();
  return {
    id: row.id,
    regNumber,
    name: row.name || '',
    institution: row.institution || '',
    phone: readMessage('Nomor HP'),
    purpose: row.purpose || 'Lainnya',
    destination: readMessage('Tujuan'),
    notes: readMessage('Catatan'),
    date: createdAt.toISOString().slice(0, 10),
    time: createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
    verified: ['terverifikasi', 'verified', 'approved'].includes(status)
  };
};

const SchoolContext = createContext(null);

function SchoolProvider({ children }) {
  const loadState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed loading state:', e);
    }
    return {
      users: INITIAL_USERS,
      guestbook: INITIAL_GUESTBOOK,
      aspirasi: INITIAL_ASPIRASI,
      dokumentasi: INITIAL_DOKUMENTASI,
      pengumuman: INITIAL_PENGUMUMAN,
      agendas: INITIAL_AGENDAS,
      followUps: INITIAL_FOLLOWUPS,
      notifications: [
        { id: 'n-1', title: 'Pengunjung Baru Tercatat', message: 'M. Rizky Pratama (UM) mengisi Buku Tamu Digital', time: 'Baru saja', unread: true, targetTab: 'bukutamu' },
        { id: 'n-2', title: 'Aspirasi Masyarakat', message: 'Tiket ASP-2026-8822 menunggu tindak lanjut', time: 'Hari ini', unread: true, targetTab: 'aspirasi' }
      ]
    };
  };

  const [db, setDb] = useState(loadState);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewMode, setViewMode] = useState('public'); // 'public' | 'admin'
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed saving state:', e);
    }
  }, [db]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;
    let active = true;

    const loadGuestbookFromSupabase = async () => {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gagal memuat Buku Tamu dari Supabase:', error);
        return;
      }
      if (!active || !Array.isArray(data)) return;

      const remoteEntries = data.map(mapGuestbookRow);
      setDb(prev => {
        const remoteIds = new Set(remoteEntries.map(entry => String(entry.id)));
        const localOnlyEntries = prev.guestbook.filter(entry => !remoteIds.has(String(entry.id)));
        return { ...prev, guestbook: [...remoteEntries, ...localOnlyEntries] };
      });
    };

    loadGuestbookFromSupabase();
    return () => { active = false; };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const addNotification = (title, message, targetTab = 'dashboard') => {
    setDb(prev => ({
      ...prev,
      notifications: [
        { id: `notif-${Date.now()}`, title, message, time: 'Baru saja', unread: true, targetTab },
        ...prev.notifications
      ]
    }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDb({
      users: INITIAL_USERS,
      guestbook: INITIAL_GUESTBOOK,
      aspirasi: INITIAL_ASPIRASI,
      dokumentasi: INITIAL_DOKUMENTASI,
      pengumuman: INITIAL_PENGUMUMAN,
      agendas: INITIAL_AGENDAS,
      followUps: INITIAL_FOLLOWUPS,
      notifications: []
    });
    showToast('Data simulasi berhasil dikembalikan ke pengaturan awal!', 'info');
  };

  return (
    <SchoolContext.Provider value={{
      db, setDb,
      currentUser, setCurrentUser,
      viewMode, setViewMode,
      toast, showToast,
      addNotification,
      resetDemoData
    }}>
      {children}
    </SchoolContext.Provider>
  );
}

const useSchool = () => useContext(SchoolContext);

// ============================================================================
// 5. HELPER COMPONENTS (BADGES, MODALS, AVATARS)
// ============================================================================

function StatusBadge({ status }) {
  const styles = {
    'Baru Masuk': 'bg-sky-100 text-sky-800 border-sky-200',
    'Diverifikasi': 'bg-blue-100 text-blue-800 border-blue-200',
    'Terverifikasi': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Dalam Tindak Lanjut': 'bg-amber-100 text-amber-800 border-amber-200',
    'Sedang Berlangsung': 'bg-amber-100 text-amber-800 border-amber-200',
    'Menunggu Persetujuan': 'bg-amber-100 text-amber-800 border-amber-200',
    'Menunggu Verifikasi': 'bg-purple-100 text-purple-800 border-purple-200',
    'Perlu Revisi': 'bg-orange-100 text-orange-800 border-orange-200',
    'Perlu Perbaikan': 'bg-orange-100 text-orange-800 border-orange-200',
    'Belum Dimulai': 'bg-slate-100 text-slate-700 border-slate-200',
    'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
    'Internal': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Selesai': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Disetujui': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Terbit': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Publik': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Ditolak': 'bg-rose-100 text-rose-800 border-rose-200',
    'Diarsipkan': 'bg-gray-200 text-gray-700 border-gray-300'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    'Rendah': 'bg-slate-100 text-slate-600',
    'Sedang': 'bg-sky-100 text-sky-700',
    'Tinggi': 'bg-amber-100 text-amber-800',
    'Mendesak': 'bg-rose-100 text-rose-700 font-bold'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[priority] || 'bg-slate-100 text-slate-700'}`}>
      {priority}
    </span>
  );
}

function UserAvatar({ user, size = 'w-10 h-10 text-sm' }) {
  if (user?.photoUrl) {
    return (
      <img
        src={user.photoUrl}
        alt={user.roleLabel}
        className={`${size} rounded-full object-cover border border-slate-200 shrink-0`}
      />
    );
  }
  return (
    <div className={`${size} rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shrink-0`}>
      {user?.avatar || 'SD'}
    </div>
  );
}

function Modal({ open, onClose, title, maxWidth = 'max-w-2xl', children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <h3 className="text-lg font-bold text-slate-800 font-['Poppins']">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. LOGIN PORTAL MODAL (HANYA KEPALA SEKOLAH & GURU DENGAN PASSWORD)
// ============================================================================

function LoginModal({ open, onClose }) {
  const { db, setCurrentUser, setViewMode, showToast } = useSchool();
  const [selectedRole, setSelectedRole] = useState('kepala_sekolah');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const found = db.users.find(u => u.role === selectedRole && u.password === password);
    if (!found) {
      setError('Kata sandi tidak sesuai. Silakan periksa kembali kata sandi peran Anda.');
      return;
    }
    setCurrentUser(found);
    setViewMode('admin');
    setError('');
    setPassword('');
    showToast(`Berhasil masuk ke Portal ${found.roleLabel}!`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Login Portal Petugas Sekolah" maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed">
            Pilih peran akses (<strong>Kepala Sekolah</strong> atau <strong>Guru</strong>) dan masukkan kata sandi masing-masing untuk masuk ke sistem.
          </div>
        </div>

        {/* Role Selector Cards (No Personal Names) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pilih Peran Akses</label>
          <div className="grid grid-cols-2 gap-3">
            {db.users.map(u => {
              const isSelected = selectedRole === u.role;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { setSelectedRole(u.role); setError(''); }}
                  className={`p-3.5 rounded-2xl border-2 transition text-left flex flex-col gap-2 ${
                    isSelected
                      ? 'border-blue-700 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <UserAvatar user={u} size="w-9 h-9 text-xs" />
                    {isSelected && <CheckCircle className="w-4 h-4 text-blue-700" />}
                  </div>
                  <div>
                    <div className="font-['Poppins'] font-bold text-sm text-slate-900">{u.roleLabel}</div>
                    <div className="text-[11px] text-slate-500">Sandi default: <span className="font-mono font-semibold text-blue-700">{u.password}</span></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi ({selectedRole === 'kepala_sekolah' ? 'Kepala Sekolah' : 'Guru'})
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Masukkan kata sandi..."
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-700/20 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Masuk sebagai {selectedRole === 'kepala_sekolah' ? 'Kepala Sekolah' : 'Guru'}
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ============================================================================
// 7. PUBLIC WEBSITE INTERFACE (TAMPILAN PUBLIK)
// ============================================================================

function PublicPortal({ onOpenLogin }) {
  const { currentUser, setViewMode } = useSchool();
  const [activeTab, setActiveTab] = useState('beranda');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil Sekolah' },
    { id: 'bukutamu', label: 'Buku Tamu' },
    { id: 'dokumentasi', label: 'Dokumentasi' },
    { id: 'aspirasi', label: 'Aspirasi' },
    { id: 'pengumuman', label: 'Pengumuman & Berita' },
    { id: 'kalender', label: 'Kalender Publik' }
  ];

  const navigate = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-['Inter']">
      {/* Top Institutional Bar */}
      <div className="bg-blue-900 text-sky-100 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {SCHOOL_INFO.address}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {SCHOOL_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> NPSN: {SCHOOL_INFO.npsn}
            </span>
          </div>
        </div>
      </div>

      {/* Main Public Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <button onClick={() => navigate('beranda')} className="flex items-center gap-3 text-left group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="font-['Poppins'] font-bold text-base sm:text-lg text-blue-950 leading-tight">
                  SDN MERJOSARI 2
                </div>
                <div className="text-[11px] font-medium text-slate-500">
                  Smart School Information & Management
                </div>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <button
                  onClick={() => setViewMode('admin')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Portal {currentUser.roleLabel}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-700/15 transition flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login Petugas</span>
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-lg">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {activeTab === 'beranda' && <PublicHome onNavigate={navigate} />}
        {activeTab === 'profil' && <PublicSchoolProfile />}
        {activeTab === 'bukutamu' && <PublicGuestbook />}
        {activeTab === 'dokumentasi' && <PublicDocumentation />}
        {activeTab === 'aspirasi' && <PublicAspirasi />}
        {activeTab === 'pengumuman' && <PublicPengumuman />}
        {activeTab === 'kalender' && <PublicCalendar />}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="font-['Poppins'] font-bold text-white text-lg block leading-tight">{SCHOOL_INFO.name}</span>
                <span className="text-xs text-sky-400">NPSN: {SCHOOL_INFO.npsn}</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {SCHOOL_INFO.visi}
            </p>
          </div>

          <div>
            <h4 className="font-['Poppins'] font-semibold text-white mb-4">Layanan Publik Digital</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('bukutamu')} className="hover:text-sky-400 transition">Buku Tamu Digital</button></li>
              <li><button onClick={() => navigate('aspirasi')} className="hover:text-sky-400 transition">Layanan Aspirasi & Pengaduan</button></li>
              <li><button onClick={() => navigate('pengumuman')} className="hover:text-sky-400 transition">Pengumuman & Berita Sekolah</button></li>
              <li><button onClick={() => navigate('kalender')} className="hover:text-sky-400 transition">Kalender Akademik Resmi</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Poppins'] font-semibold text-white mb-4">Jam Layanan Sekolah</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between"><span>Senin – Kamis</span><span className="text-slate-200">07.00 – 15.00 WIB</span></li>
              <li className="flex justify-between"><span>Jumat</span><span className="text-slate-200">07.00 – 11.30 WIB</span></li>
              <li className="flex justify-between"><span>Sabtu – Minggu</span><span className="text-rose-400">Tutup</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Poppins'] font-semibold text-white mb-4">Kontak & Alamat</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                <span>{SCHOOL_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{SCHOOL_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{SCHOOL_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-5 px-4 text-center text-xs text-slate-500">
          © 2026 {SCHOOL_INFO.name} (NPSN: {SCHOOL_INFO.npsn}) – Smart School Information & Management System.
        </div>
      </footer>
    </div>
  );
}

// --- 7A. PUBLIC HOME (TANPA SAMBUTAN, TANPA STATISTIK SISWA/TENDIK/ROMBEL, TANPA AGENDA TERDEKAT) ---
function PublicHome({ onNavigate }) {
  const { db } = useSchool();
  const publishedDocs = db.dokumentasi.filter(d => d.status === 'Terbit');
  const publicNews = db.pengumuman.filter(p => p.visibility === 'Publik');

  return (
    <div className="space-y-14">
      {/* Clean Institutional Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-22 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Portal Informasi & Pelayanan Publik Terpadu • NPSN {SCHOOL_INFO.npsn}
            </div>
            <h1 className="font-['Poppins'] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Selamat Datang di <span className="text-sky-300">{SCHOOL_INFO.name}</span> Smart School System
            </h1>
            <p className="text-sky-100 text-base sm:text-lg leading-relaxed max-w-2xl">
              Pusat informasi pendidikan, pengumuman & berita sekolah, dokumentasi kegiatan, layanan buku tamu digital, serta pelacakan aspirasi masyarakat secara transparan.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('bukutamu')}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-900/20 transition flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" /> Isi Buku Tamu Digital
              </button>
              <button
                onClick={() => onNavigate('aspirasi')}
                className="px-5 py-3 rounded-xl bg-white text-blue-900 hover:bg-sky-50 font-semibold text-sm shadow-lg transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Kirim & Lacak Aspirasi
              </button>
              <button
                onClick={() => onNavigate('kalender')}
                className="px-5 py-3 rounded-xl bg-blue-700/60 hover:bg-blue-700 border border-sky-300/30 text-white font-semibold text-sm transition flex items-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" /> Kalender Akademik
              </button>
            </div>
          </div>

          {/* Right Hero School Visual Illustration Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-7 space-y-5 shadow-2xl">
              <div className="h-44 rounded-2xl bg-gradient-to-tr from-sky-400/30 to-emerald-400/30 border border-white/20 flex flex-col items-center justify-center text-center p-4">
                <School className="w-14 h-14 text-emerald-300 mb-2" />
                <div className="font-['Poppins'] font-bold text-lg text-white">{SCHOOL_INFO.name}</div>
                <div className="text-xs text-sky-200 mt-1">{SCHOOL_INFO.address}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Visi Sekolah</div>
                <p className="text-sm text-sky-50 leading-relaxed">
                  "{SCHOOL_INFO.visi}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News / Announcements & Documentation Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pengumuman & Berita Terbaru */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Poppins'] text-xl font-bold text-slate-900">Pengumuman & Berita Terbaru</h2>
              <p className="text-xs text-slate-500">Informasi dan kabar kegiatan terkini dari {SCHOOL_INFO.name}</p>
            </div>
            <button onClick={() => onNavigate('pengumuman')} className="text-sm font-semibold text-blue-700 hover:underline flex items-center gap-1">
              Semua Berita <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {publicNews.slice(0, 3).map(news => (
              <div
                key={news.id}
                onClick={() => onNavigate('pengumuman')}
                className="cursor-pointer bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition flex items-start gap-4"
              >
                {news.photoUrl ? (
                  <img src={news.photoUrl} alt={news.title} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Newspaper className="w-8 h-8" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">{news.category}</span>
                    <span className="text-xs text-slate-400">{news.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{news.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{news.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dokumentasi Kegiatan Terbaru */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Poppins'] text-xl font-bold text-slate-900">Dokumentasi Kegiatan</h2>
              <p className="text-xs text-slate-500">Galeri foto & video aktivitas sekolah</p>
            </div>
            <button onClick={() => onNavigate('dokumentasi')} className="text-sm font-semibold text-blue-700 hover:underline flex items-center gap-1">
              Semua Galeri <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {publishedDocs.slice(0, 2).map(doc => (
              <div key={doc.id} onClick={() => onNavigate('dokumentasi')} className="cursor-pointer bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition group">
                {doc.fileUrl && doc.mediaType === 'Foto' ? (
                  <img src={doc.fileUrl} alt={doc.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="h-24 bg-gradient-to-r from-blue-700 to-sky-500 p-4 flex items-end justify-between text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-black/25 backdrop-blur-xs text-xs font-medium">{doc.category}</span>
                    <span className="text-xs font-medium opacity-90">{doc.date}</span>
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition">{doc.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// --- 7B. PUBLIC SCHOOL PROFILE (TANPA FASILITAS & TENDIK, DENGAN MAPS & DATA BARU) ---
function PublicSchoolProfile() {
  const [subTab, setSubTab] = useState('identitas');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-blue-800 to-sky-600 rounded-3xl p-8 text-white">
        <span className="text-xs uppercase tracking-wider text-sky-200 font-semibold">Profil Satuan Pendidikan</span>
        <h1 className="font-['Poppins'] text-2xl sm:text-3xl font-bold mt-1">Profil {SCHOOL_INFO.name}</h1>
        <p className="text-sm text-sky-100 mt-2 max-w-2xl">
          Identitas resmi sekolah, sejarah singkat, visi dan misi pendidikan, serta lokasi peta digital sekolah.
        </p>
      </div>

      {/* Sub-navigation: Only Identitas & Sejarah, Visi & Misi, Lokasi Maps */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'identitas', label: 'Identitas & Sejarah' },
          { id: 'visimisi', label: 'Visi & Misi' },
          { id: 'lokasi', label: 'Lokasi & Google Maps' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              subTab === t.id ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'identitas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-['Poppins'] font-bold text-lg text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-700" /> Identitas Sekolah
            </h3>
            <dl className="divide-y divide-slate-100 text-sm">
              {[
                ['Nama Sekolah', SCHOOL_INFO.name],
                ['NPSN', SCHOOL_INFO.npsn],
                ['Jenjang / Status', 'Sekolah Dasar (SD) / Negeri'],
                ['Kurikulum', 'Kurikulum Merdeka'],
                ['Alamat', SCHOOL_INFO.address],
                ['Nomor Telepon', SCHOOL_INFO.phone],
                ['Email Resmi', SCHOOL_INFO.email]
              ].map(([k, v], idx) => (
                <div key={idx} className="py-2.5 flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">{k}</dt>
                  <dd className="font-semibold text-slate-800 text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-['Poppins'] font-bold text-lg text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" /> Sejarah Singkat
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {SCHOOL_INFO.name} berdiri sebagai wujud komitmen pelayanan pendidikan dasar negeri bagi masyarakat di wilayah Kelurahan Merjosari, Kecamatan Lowokwaru, Kota Malang, Provinsi Jawa Timur.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Berlokasi strategis di {SCHOOL_INFO.address}, sekolah ini terus berkembang dalam menyelenggarakan pembelajaran yang efektif, berkarakter IMTAQ, dan adaptif terhadap pemanfaatan teknologi informasi bagi siswa maupun pelayanan publik.
            </p>
          </div>
        </div>
      )}

      {subTab === 'visimisi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl p-7 space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">VISI SEKOLAH</span>
            <h3 className="font-['Poppins'] text-xl font-bold leading-snug">
              "{SCHOOL_INFO.visi}"
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-slate-200 space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">MISI SEKOLAH</span>
            <p className="text-base font-medium text-slate-800 leading-relaxed">
              {SCHOOL_INFO.misi}
            </p>
          </div>
        </div>
      )}

      {/* Embedded Interactive Google Maps */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-['Poppins'] font-bold text-lg text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" /> Peta Lokasi {SCHOOL_INFO.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{SCHOOL_INFO.address}</p>
          </div>
          <a
            href={SCHOOL_INFO.mapsExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold inline-flex items-center gap-1.5 self-start"
          >
            <ExternalLink className="w-4 h-4" /> Buka di Google Maps
          </a>
        </div>
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200">
          <iframe
            title="Peta Lokasi SDN Merjosari 2"
            src={SCHOOL_INFO.mapsEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

// --- 7C. PUBLIC DIGITAL GUESTBOOK (TUJUAN KUNJUNGAN SEBAGAI INPUT ISIAN) ---
function PublicGuestbook() {
  const { setDb, showToast, addNotification } = useSchool();
  const [form, setForm] = useState({
    name: '',
    institution: '',
    phone: '',
    purpose: 'Kunjungan Dinas',
    destination: '',
    notes: ''
  });
  const [receipt, setReceipt] = useState(null);
  const [submitFeedback, setSubmitFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitFeedback({ type: 'info', message: 'Sedang mengirim data ke database...' });
    if (!form.name.trim() || !form.institution.trim() || !form.phone.trim() || !form.destination.trim()) {
      setSubmitFeedback({ type: 'error', message: 'Mohon lengkapi Nama, Instansi, Nomor HP, dan Tujuan Kunjungan.' });
      showToast('Mohon lengkapi data wajib kunjungan!', 'error');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setSubmitFeedback({ type: 'error', message: 'Koneksi database belum tersedia. Periksa pengaturan Vercel.' });
      showToast('Koneksi database belum tersedia.', 'error');
      return;
    }

    const now = new Date();
    const regNumber = `GT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const message = [
      `No. Registrasi: ${regNumber}`,
      `Nomor HP: ${form.phone.trim()}`,
      `Tujuan: ${form.destination.trim()}`,
      `Catatan: ${form.notes.trim() || '-'}`
    ].join('\n');

    let data;
    try {
      const result = await supabase
        .from('guestbook')
        .insert([{
          name: form.name.trim(),
          institution: form.institution.trim(),
          purpose: form.purpose,
          message,
          status: 'Menunggu Verifikasi'
        }])
        .select()
        .single();

      if (result.error) throw result.error;
      data = result.data;
    } catch (error) {
      console.error('Gagal menyimpan Buku Tamu ke Supabase:', error);
      const detail = error?.message || error?.details || 'Kesalahan tidak diketahui saat mengirim data.';
      setSubmitFeedback({ type: 'error', message: `Gagal menyimpan ke Supabase: ${detail}` });
      showToast('Data Buku Tamu gagal dikirim. Lihat keterangan pada formulir.', 'error');
      return;
    }

    const newEntry = mapGuestbookRow(data);
    setDb(prev => ({ ...prev, guestbook: [newEntry, ...prev.guestbook.filter(entry => String(entry.id) !== String(newEntry.id))] }));
    addNotification('Buku Tamu Digital Baru', `${form.name} (${form.institution}) - ${form.destination}`, 'bukutamu');
    setReceipt(newEntry);
    setSubmitFeedback({ type: 'success', message: 'Berhasil! Data Buku Tamu sudah dikirim ke Supabase.' });
    showToast('Registrasi Buku Tamu berhasil tersimpan ke Supabase!');
    setForm({ name: '', institution: '', phone: '', purpose: 'Kunjungan Dinas', destination: '', notes: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">Pelayanan Resepsionis Digital</span>
        <h1 className="font-['Poppins'] text-2xl sm:text-3xl font-bold text-slate-900">Buku Tamu Digital {SCHOOL_INFO.name}</h1>
        <p className="text-sm text-slate-500">
          Silakan isi formulir kunjungan di bawah ini. Data Anda otomatis tercatat pada sistem administrasi dan mendapatkan nomor registrasi kunjungan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Pengunjung *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: Budi Santoso, S.Pd."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instansi / Asal / Wali Murid *</label>
              <input
                type="text"
                required
                value={form.institution}
                onChange={e => setForm({ ...form, institution: e.target.value })}
                placeholder="Contoh: Dinas Pendidikan / Wali Kelas IV"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor HP / WhatsApp *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Keperluan</label>
              <select
                value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option>Kunjungan Dinas</option>
                <option>Wali Murid</option>
                <option>Penelitian/Magang</option>
                <option>Kerjasama / Mitra</option>
                <option>Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tujuan Kunjungan *</label>
            <input
              type="text"
              required
              value={form.destination}
              onChange={e => setForm({ ...form, destination: e.target.value })}
              placeholder="Tuliskan tujuan kunjungan Anda (misal: Bertemu Kepala Sekolah / Wali Kelas IV / Urusan Surat)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan Tambahan (Opsional)</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Catatan tambahan mengenai kunjungan Anda..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-700/20 transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Simpan & Dapatkan Nomor Kunjungan
          </button>
          {submitFeedback && (
            <div role="status" aria-live="polite" className={`rounded-xl px-4 py-3 text-sm font-medium ${submitFeedback.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : submitFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              {submitFeedback.message}
            </div>
          )}
        </form>

        {/* Visitor Pass / Status Card */}
        <div className="lg:col-span-5 space-y-4">
          {receipt ? (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Kartu Registrasi Tamu</span>
                <CheckCircle className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="text-xs text-emerald-100">Nomor Registrasi</div>
                <div className="font-['Poppins'] text-2xl font-bold tracking-wide">{receipt.regNumber}</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-emerald-100">Nama:</span><span className="font-semibold">{receipt.name}</span></div>
                <div className="flex justify-between"><span className="text-emerald-100">Instansi:</span><span className="font-semibold">{receipt.institution}</span></div>
                <div className="flex justify-between gap-2"><span className="text-emerald-100 shrink-0">Tujuan:</span><span className="font-semibold text-right">{receipt.destination}</span></div>
                <div className="flex justify-between"><span className="text-emerald-100">Waktu:</span><span className="font-semibold">{receipt.date} • {receipt.time} WIB</span></div>
              </div>
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-white text-emerald-800 font-semibold text-xs hover:bg-emerald-50 transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Cetak Bukti Kunjungan
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 space-y-3">
              <h3 className="font-['Poppins'] font-bold text-blue-950 text-base">Tata Tertib Kunjungan Sekolah</h3>
              <ul className="text-xs text-blue-900/80 space-y-2 list-disc pl-4 leading-relaxed">
                <li>Pengunjung wajib mengisi buku tamu digital sebelum memasuki area ruang guru atau kelas.</li>
                <li>Gunakan pakaian yang sopan dan rapi selama berada di lingkungan {SCHOOL_INFO.name}.</li>
                <li>Nomor registrasi otomatis tersinkronisasi dengan dashboard Kepala Sekolah dan Guru.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 7D. PUBLIC DOCUMENTATION GALLERY ---
function PublicDocumentation() {
  const { db } = useSchool();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [year, setYear] = useState('Semua');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const publishedDocs = db.dokumentasi.filter(d => d.status === 'Terbit');
  const categories = ['Semua', ...new Set(publishedDocs.map(d => d.category))];
  const years = ['Semua', ...new Set(publishedDocs.map(d => d.year))];

  const filtered = publishedDocs.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Semua' || d.category === category;
    const matchYear = year === 'Semua' || d.year === year;
    return matchSearch && matchCat && matchYear;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">Galeri & Arsip Publik</span>
        <h1 className="font-['Poppins'] text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Dokumentasi Kegiatan Sekolah</h1>
        <p className="text-sm text-slate-500">Liputan foto dan video kegiatan yang telah diterbitkan oleh {SCHOOL_INFO.name}.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul atau deskripsi kegiatan..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white outline-none">
          {categories.map(c => <option key={c} value={c}>Kategori: {c}</option>)}
        </select>
        <select value={year} onChange={e => setYear(e.target.value)} className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white outline-none">
          {years.map(y => <option key={y} value={y}>Tahun: {y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(doc => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition group flex flex-col"
          >
            {doc.fileUrl && doc.mediaType === 'Foto' ? (
              <div className="h-44 relative overflow-hidden">
                <img src={doc.fileUrl} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 text-white text-xs font-semibold">{doc.category}</span>
              </div>
            ) : (
              <div className="h-44 bg-gradient-to-br from-blue-700 to-sky-500 p-5 flex flex-col justify-between text-white">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-lg bg-black/25 text-xs font-semibold">{doc.category}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/20 text-xs font-semibold">{doc.mediaType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/90">{doc.date}</span>
                  <span className="px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-semibold opacity-0 group-hover:opacity-100 transition">
                    Lihat Detail
                  </span>
                </div>
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-['Poppins'] font-bold text-slate-900 text-base group-hover:text-blue-700 transition">{doc.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{doc.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-semibold">
                <span>Buka Detail Dokumentasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedDoc} onClose={() => setSelectedDoc(null)} title="Detail Dokumentasi Kegiatan" maxWidth="max-w-2xl">
        {selectedDoc && (
          <div className="space-y-4">
            {selectedDoc.fileUrl && selectedDoc.mediaType === 'Foto' ? (
              <img src={selectedDoc.fileUrl} alt={selectedDoc.title} className="w-full max-h-80 object-cover rounded-2xl border border-slate-200" />
            ) : (
              <div className="h-52 rounded-2xl bg-gradient-to-br from-blue-700 to-sky-500 p-6 flex flex-col justify-between text-white">
                <div className="flex justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/30 text-xs font-semibold">{selectedDoc.category}</span>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">{selectedDoc.mediaType} • {selectedDoc.date}</span>
                </div>
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 mx-auto opacity-80 mb-2" />
                  <p className="text-xs text-white/90">{selectedDoc.fileName || 'Dokumentasi Resmi Sekolah'}</p>
                </div>
                <div />
              </div>
            )}
            <h3 className="font-['Poppins'] text-xl font-bold text-slate-900">{selectedDoc.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{selectedDoc.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

// --- 7E. PUBLIC ASPIRASI & TICKET TRACKER (DENGAN PILIHAN "LAINNYA") ---
function PublicAspirasi() {
  const { db, setDb, showToast, addNotification } = useSchool();
  const [form, setForm] = useState({
    senderName: '',
    contact: '',
    category: 'Sarana & Prasarana',
    subject: '',
    content: '',
    attachment: ''
  });
  const [createdTicket, setCreatedTicket] = useState(null);
  const [trackInput, setTrackInput] = useState('ASP-2026-8821');

  const trackedItem = useMemo(() => {
    return db.aspirasi.find(a => a.ticketNumber.toLowerCase() === trackInput.trim().toLowerCase());
  }, [db.aspirasi, trackInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.content.trim()) {
      showToast('Subjek dan isi aspirasi wajib diisi!', 'error');
      return;
    }
    const now = new Date();
    const ticketNumber = `ASP-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5);

    const newItem = {
      id: `asp-${Date.now()}`,
      ticketNumber,
      senderName: form.senderName.trim() || 'Anonim',
      contact: form.contact.trim() || '-',
      category: form.category,
      subject: form.subject,
      content: form.content,
      attachment: form.attachment,
      status: 'Baru Masuk',
      priority: 'Sedang',
      createdAt: dateStr,
      publicNote: 'Aspirasi Anda telah masuk dalam antrean verifikasi pihak sekolah.',
      internalNote: '',
      linkedFollowUpId: null,
      history: [
        { date: `${dateStr} ${timeStr}`, status: 'Baru Masuk', note: 'Aspirasi dikirimkan melalui portal publik.' }
      ]
    };

    setDb(prev => ({ ...prev, aspirasi: [newItem, ...prev.aspirasi] }));
    addNotification('Aspirasi Baru Masuk', `[${ticketNumber}] ${form.subject}`, 'aspirasi');
    setCreatedTicket(ticketNumber);
    setTrackInput(ticketNumber);
    showToast(`Aspirasi terkirim! Nomor Tiket: ${ticketNumber}`);
    setForm({ senderName: '', contact: '', category: 'Sarana & Prasarana', subject: '', content: '', attachment: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">Suara Masyarakat & Wali Murid</span>
        <h1 className="font-['Poppins'] text-2xl sm:text-3xl font-bold text-slate-900">Layanan Aspirasi, Kritik & Saran</h1>
        <p className="text-sm text-slate-500">
          Sampaikan masukan konstruktif Anda untuk kemajuan {SCHOOL_INFO.name} dan pantau progres tindak lanjutnya menggunakan nomor tiket.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-['Poppins'] font-bold text-lg text-slate-900">Formulir Penyampaian Aspirasi</h2>

          {createdTicket && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="font-bold text-sm">Aspirasi Berhasil Dikirim!</div>
              <div>Simpan nomor tiket Anda: <span className="font-mono font-bold text-emerald-700 text-sm">{createdTicket}</span></div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pengirim (Opsional / Anonim)</label>
              <input
                type="text"
                value={form.senderName}
                onChange={e => setForm({ ...form, senderName: e.target.value })}
                placeholder="Kosongkan jika ingin Anonim"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor HP / Email (Opsional)</label>
              <input
                type="text"
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
                placeholder="Untuk konfirmasi lanjutan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Aspirasi</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Sarana & Prasarana</option>
              <option>Akademik & Pembelajaran</option>
              <option>Pelayanan Administrasi</option>
              <option>Kesiswaan & Ekstrakurikuler</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subjek / Judul Singkat *</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="Contoh: Usulan penambahan buku cerita di pojok baca"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Uraian Aspirasi / Pengaduan *</label>
            <textarea
              rows={4}
              required
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Jelaskan detail aspirasi, lokasi, atau harapan Anda..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lampiran Pendukung (Opsional)</label>
            <input
              type="file"
              onChange={e => setForm({ ...form, attachment: e.target.files?.[0]?.name || '' })}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Kirim Aspirasi & Buat Tiket
          </button>
        </form>

        {/* Pelacakan Tiket Aspirasi */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="font-['Poppins'] font-bold text-lg text-slate-900">Lacak Status Aspirasi (Real-Time)</h2>
            <p className="text-xs text-slate-500">Masukkan nomor tiket untuk melihat progres penanganan oleh sekolah.</p>
          </div>

          <input
            type="text"
            value={trackInput}
            onChange={e => setTrackInput(e.target.value)}
            placeholder="Masukkan nomor tiket (misal: ASP-2026-8821)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Contoh tiket:</span>
            {db.aspirasi.slice(0, 3).map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => setTrackInput(a.ticketNumber)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 font-mono transition"
              >
                {a.ticketNumber}
              </button>
            ))}
          </div>

          {trackedItem ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-700">{trackedItem.ticketNumber}</span>
                  <h4 className="font-bold text-slate-900 text-base">{trackedItem.subject}</h4>
                </div>
                <StatusBadge status={trackedItem.status} />
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div><strong>Kategori:</strong> {trackedItem.category} • <strong>Tanggal:</strong> {trackedItem.createdAt}</div>
                <div><strong>Tanggapan Resmi Sekolah:</strong> <span className="text-slate-800">{trackedItem.publicNote || 'Sedang dalam peninjauan.'}</span></div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Riwayat Progres Penanganan</div>
                <div className="space-y-2.5 border-l-2 border-blue-500 pl-4 ml-1">
                  {trackedItem.history.map((h, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-semibold text-slate-800">{h.status} <span className="font-normal text-slate-400">({h.date})</span></div>
                      <div className="text-slate-600">{h.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
              Nomor tiket tidak ditemukan. Pastikan format nomor tiket benar (contoh: ASP-2026-8821).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 7F. PUBLIC PENGUMUMAN & BERITA SEKOLAH (PENGGANTI BERITA ACARA FORMAL) ---
function PublicPengumuman() {
  const { db } = useSchool();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [selectedNews, setSelectedNews] = useState(null);

  const publicList = db.pengumuman.filter(p => p.visibility === 'Publik');
  const categories = ['Semua', ...new Set(publicList.map(p => p.category))];

  const filtered = publicList.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Semua' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">Informasi & Kabar Sekolah</span>
        <h1 className="font-['Poppins'] text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Pengumuman & Berita {SCHOOL_INFO.name}</h1>
        <p className="text-sm text-slate-500">Kumpulan pengumuman resmi, informasi akademik, dan berita kegiatan terbaru sekolah.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul pengumuman atau berita..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white outline-none"
        >
          {categories.map(c => <option key={c} value={c}>Kategori: {c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.title} className="w-full h-44 object-cover" />
              ) : (
                <div className="h-40 bg-gradient-to-br from-blue-700 to-sky-500 p-5 flex flex-col justify-between text-white">
                  <span className="px-2.5 py-1 rounded-lg bg-black/25 text-xs font-semibold self-start">{item.category}</span>
                  <div className="flex items-center gap-2 text-xs text-sky-100">
                    <Newspaper className="w-4 h-4" />
                    <span>{item.photoName || 'Berita Sekolah'}</span>
                  </div>
                </div>
              )}
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-blue-700">{item.category}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-['Poppins'] font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.content}</p>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setSelectedNews(item)}
                className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> Baca Selengkapnya
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedNews} onClose={() => setSelectedNews(null)} title="Detail Pengumuman & Berita Sekolah" maxWidth="max-w-2xl">
        {selectedNews && (
          <div className="space-y-4">
            {selectedNews.photoUrl && (
              <img src={selectedNews.photoUrl} alt={selectedNews.title} className="w-full max-h-80 object-cover rounded-2xl border border-slate-200" />
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">{selectedNews.category}</span>
              <span className="text-slate-400">Dipublikasikan pada {selectedNews.date}</span>
            </div>
            <h3 className="font-['Poppins'] text-xl font-bold text-slate-900">{selectedNews.title}</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selectedNews.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

// --- 7G. PUBLIC ACADEMIC CALENDAR (DENGAN UNDUH PDF YANG BERFUNGSI) ---
function PublicCalendar() {
  const { db, showToast } = useSchool();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [currentMonth, setCurrentMonth] = useState('2026-11');

  const approvedEvents = db.agendas.filter(a => a.status === 'Disetujui');
  const categories = ['Semua', ...new Set(approvedEvents.map(a => a.category))];

  const filtered = approvedEvents.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'Semua' || a.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const [yearNum, monthNum] = currentMonth.split('-').map(Number);
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  const firstDayIdx = new Date(yearNum, monthNum - 1, 1).getDay();
  const todayStr = '2026-11-17';

  const colorMap = {
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  const handleDownloadPDF = () => {
    showToast('Menyiapkan dokumen PDF Kalender Akademik...');
    downloadCalendarPDF(filtered, currentMonth);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">Kalender Akademik & Agenda Resmi</span>
          <h1 className="font-['Poppins'] text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Kalender Kegiatan {SCHOOL_INFO.name}</h1>
          <p className="text-sm text-slate-500">Jadwal kegiatan akademik, kesiswaan, dan agenda resmi sekolah.</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-sm flex items-center gap-2 self-start"
        >
          <Download className="w-4 h-4" /> Unduh Kalender PDF
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="month"
          value={currentMonth}
          onChange={e => setCurrentMonth(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 w-full sm:w-auto"
        />
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama agenda atau lokasi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white w-full sm:w-auto"
        >
          {categories.map(c => <option key={c} value={c}>Kategori: {c}</option>)}
        </select>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-bold text-slate-600 py-3">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {Array.from({ length: firstDayIdx }).map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-[95px] border-b border-r border-slate-100 bg-slate-50/40" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
            const dayEvents = filtered.filter(ev => ev.date === dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div key={day} className={`min-h-[95px] p-2 border-b border-r border-slate-100 ${isToday ? 'bg-sky-50/60' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${isToday ? 'bg-blue-700 text-white' : 'text-slate-700'}`}>
                    {day}
                  </span>
                  {isToday && <span className="text-[10px] font-bold text-blue-700">Hari Ini</span>}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className={`px-1.5 py-1 rounded text-[10px] font-semibold border truncate ${colorMap[ev.color] || colorMap.blue}`} title={`${ev.title} (${ev.startTime})`}>
                      {ev.startTime} {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming List */}
      <div className="space-y-3">
        <h3 className="font-['Poppins'] font-bold text-lg text-slate-900">Daftar Agenda Terjadwal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(ev => (
            <div key={ev.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${colorMap[ev.color] || colorMap.blue}`}>{ev.category}</span>
                  <span className="text-xs font-semibold text-slate-500">{ev.date} • {ev.startTime} - {ev.endTime} WIB</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                <p className="text-xs text-slate-600">{ev.description}</p>
                <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> {ev.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. ADMIN & PORTAL DASHBOARD INTERFACE (KEPALA SEKOLAH & GURU)
// ============================================================================

function AdminDashboard() {
  const { db, setDb, currentUser, setCurrentUser, setViewMode, showToast } = useSchool();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadNotifs = db.notifications.filter(n => n.unread).length;

  // Both Kepala Sekolah & Guru have access to Buku Tamu & Aspirasi as requested
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, roles: ['kepala_sekolah', 'guru'] },
    { id: 'kalender', label: 'Kalender Akademik & Agenda', icon: CalendarIcon, roles: ['kepala_sekolah', 'guru'] },
    { id: 'aspirasi', label: 'Manajemen Aspirasi', icon: MessageSquare, roles: ['kepala_sekolah', 'guru'] },
    { id: 'bukutamu', label: 'Buku Tamu Digital', icon: Users, roles: ['kepala_sekolah', 'guru'] },
    { id: 'tindaklanjut', label: 'Manajemen Tindak Lanjut', icon: ClipboardList, roles: ['kepala_sekolah', 'guru'] },
    { id: 'dokumentasi', label: 'Dokumentasi Kegiatan', icon: ImageIcon, roles: ['kepala_sekolah'] },
    { id: 'pengumuman', label: 'Pengumuman & Berita', icon: Newspaper, roles: ['kepala_sekolah'] },
    { id: 'profil', label: 'Profil & Foto Akun', icon: User, roles: ['kepala_sekolah', 'guru'] }
  ];

  const allowedMenu = menuItems.filter(m => m.roles.includes(currentUser.role));

  const markAllRead = () => {
    setDb(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, unread: false }))
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('public');
    showToast('Anda telah keluar dari portal.', 'info');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 font-['Inter']">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-68 bg-slate-900 text-slate-200 flex flex-col transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 text-white flex items-center justify-center shadow-md">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Poppins'] font-bold text-white text-sm">{SCHOOL_INFO.name}</div>
              <div className="text-[11px] text-sky-400 font-medium">NPSN: {SCHOOL_INFO.npsn}</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Card (Without Personal Names, Shows Uploaded Profile Photo) */}
        <div className="p-4 mx-3 mt-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
          <UserAvatar user={currentUser} size="w-11 h-11 text-sm" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">Portal Akses</div>
            <div className="text-base font-bold text-white font-['Poppins']">{currentUser.roleLabel}</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {allowedMenu.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveModule(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeModule === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setViewMode('public')}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Lihat Website Publik
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-['Poppins'] font-bold text-slate-900 text-base sm:text-lg">
                {menuItems.find(m => m.id === activeModule)?.label}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">Portal {currentUser.roleLabel} • {SCHOOL_INFO.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Pusat Notifikasi</span>
                    <button onClick={markAllRead} className="text-[11px] font-semibold text-blue-700 hover:underline">
                      Tandai dibaca
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {db.notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">Belum ada notifikasi baru.</div>
                    ) : (
                      db.notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => { setActiveModule(n.targetTab || 'dashboard'); setNotifOpen(false); }}
                          className={`p-3.5 text-xs cursor-pointer hover:bg-slate-50 ${n.unread ? 'bg-blue-50/40' : ''}`}
                        >
                          <div className="font-bold text-slate-800 flex justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setViewMode('public')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Portal Publik
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeModule === 'dashboard' && <AdminOverview onNavigate={setActiveModule} />}
          {activeModule === 'kalender' && <AdminCalendarModule />}
          {activeModule === 'aspirasi' && <AdminAspirasiModule onNavigate={setActiveModule} />}
          {activeModule === 'bukutamu' && <AdminGuestbookModule />}
          {activeModule === 'tindaklanjut' && <AdminFollowUpModule />}
          {activeModule === 'dokumentasi' && <AdminDocumentationModule />}
          {activeModule === 'pengumuman' && <AdminPengumumanModule />}
          {activeModule === 'profil' && <AdminProfileModule />}
        </main>
      </div>
    </div>
  );
}

// --- 8A. ADMIN OVERVIEW & ANALYTICS (TANPA LOG AKTIVITAS SISTEM) ---
function AdminOverview({ onNavigate }) {
  const { db } = useSchool();

  const pendingAspirasi = db.aspirasi.filter(a => a.status === 'Baru Masuk' || a.status === 'Diverifikasi').length;
  const unverifiedGuests = db.guestbook.filter(g => !g.verified).length;
  const activeFollowUps = db.followUps.filter(f => f.status !== 'Selesai').length;
  const pendingAgendas = db.agendas.filter(a => a.status === 'Menunggu Persetujuan').length;

  const monthlyTrendData = [
    { bulan: 'Jul', pengunjung: 24, aspirasi: 5 },
    { bulan: 'Agu', pengunjung: 31, aspirasi: 8 },
    { bulan: 'Sep', pengunjung: 28, aspirasi: 6 },
    { bulan: 'Okt', pengunjung: 39, aspirasi: 11 },
    { bulan: 'Nov', pengunjung: db.guestbook.length + 22, aspirasi: db.aspirasi.length + 4 }
  ];

  const aspirasiCategoryData = useMemo(() => {
    const counts = {};
    db.aspirasi.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [db.aspirasi]);

  const PIE_COLORS = ['#1d4ed8', '#0284c7', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onNavigate('aspirasi')} className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Aspirasi Masuk</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="font-['Poppins'] text-2xl font-bold text-slate-900 mt-2">{db.aspirasi.length}</div>
          <div className="text-xs text-amber-600 font-medium mt-1">{pendingAspirasi} menunggu tindak lanjut</div>
        </div>

        <div onClick={() => onNavigate('bukutamu')} className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Buku Tamu Digital</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-['Poppins'] text-2xl font-bold text-slate-900 mt-2">{db.guestbook.length}</div>
          <div className="text-xs text-sky-700 font-medium mt-1">{unverifiedGuests} belum diverifikasi</div>
        </div>

        <div onClick={() => onNavigate('kalender')} className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-300 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Agenda & Kalender</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="font-['Poppins'] text-2xl font-bold text-slate-900 mt-2">{db.agendas.length}</div>
          <div className="text-xs text-amber-600 font-medium mt-1">{pendingAgendas} menunggu persetujuan</div>
        </div>

        <div onClick={() => onNavigate('tindaklanjut')} className="cursor-pointer bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-300 shadow-xs transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tindak Lanjut Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="font-['Poppins'] text-2xl font-bold text-slate-900 mt-2">{activeFollowUps}</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">{db.followUps.length} total program</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-['Poppins'] font-bold text-slate-900 text-base">Grafik Kunjungan & Aspirasi Bulanan</h3>
            <p className="text-xs text-slate-500">Pemantauan partisipasi masyarakat & tamu sekolah</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="pengunjung" name="Pengunjung Tamu" stroke="#1d4ed8" fill="#93c5fd" fillOpacity={0.45} />
                <Area type="monotone" dataKey="aspirasi" name="Aspirasi Masuk" stroke="#10b981" fill="#6ee7b7" fillOpacity={0.45} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-['Poppins'] font-bold text-slate-900 text-base">Sebaran Kategori Aspirasi</h3>
            <p className="text-xs text-slate-500">Klasifikasi laporan & saran masyarakat</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={aspirasiCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {aspirasiCategoryData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 8B. KALENDER AKADEMIK & AGENDA SEKOLAH (INTEGRASI GURU -> KEPALA SEKOLAH -> PUBLIK) ---
function AdminCalendarModule() {
  const { db, setDb, currentUser, showToast, addNotification } = useSchool();
  const isKepsek = currentUser.role === 'kepala_sekolah';
  const isGuru = currentUser.role === 'guru';

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState(null);
  const [verifyModal, setVerifyModal] = useState(null);
  const [revisionNoteInput, setRevisionNoteInput] = useState('');
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  const [form, setForm] = useState({
    title: '',
    date: '2026-11-25',
    startTime: '08:00',
    endTime: '10:00',
    location: 'Aula Utama',
    category: 'Akademik',
    color: 'blue',
    description: '',
    attachment: ''
  });

  const scheduleConflicts = useMemo(() => {
    if (!form.date || !form.location) return [];
    return db.agendas.filter(a =>
      a.id !== editingAgenda?.id &&
      a.status !== 'Ditolak' &&
      a.date === form.date &&
      a.location.toLowerCase() === form.location.toLowerCase()
    );
  }, [db.agendas, form.date, form.location, editingAgenda]);

  // Kepala Sekolah sees all agendas; Guru sees all approved school agendas + their own submissions/drafts/revisions
  const visibleAgendas = useMemo(() => {
    return db.agendas.filter(a => {
      if (isKepsek) return true;
      return a.submitterId === currentUser.id || a.status === 'Disetujui';
    });
  }, [db.agendas, isKepsek, currentUser.id]);

  const filteredAgendas = visibleAgendas.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    const matchMonth = !monthFilter || a.date.startsWith(monthFilter);
    const matchStatus = statusFilter === 'Semua' || a.status === statusFilter;
    return matchSearch && matchMonth && matchStatus;
  });

  const pendingApprovals = db.agendas.filter(a => a.status === 'Menunggu Persetujuan');
  const guruNeedsRevision = db.agendas.filter(a => a.submitterId === currentUser.id && a.status === 'Perlu Revisi');

  const openCreateModal = () => {
    setEditingAgenda(null);
    setForm({
      title: '',
      date: '2026-11-25',
      startTime: '08:00',
      endTime: '10:00',
      location: 'Aula Utama',
      category: 'Akademik',
      color: 'blue',
      description: '',
      attachment: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (ag) => {
    setEditingAgenda(ag);
    setForm({
      title: ag.title,
      date: ag.date,
      startTime: ag.startTime,
      endTime: ag.endTime,
      location: ag.location,
      category: ag.category,
      color: ag.color || 'blue',
      description: ag.description || '',
      attachment: ag.attachment || ''
    });
    setModalOpen(true);
  };

  const saveAgenda = (e, asDraft = false) => {
    if (e) e.preventDefault();
    if (!form.title.trim()) {
      showToast('Nama kegiatan wajib diisi!', 'error');
      return;
    }

    // Kepala Sekolah directly approves; Guru saves as Draft or submits for Kepsek verification
    const nextStatus = isKepsek
      ? 'Disetujui'
      : (asDraft ? 'Draft' : 'Menunggu Persetujuan');

    if (editingAgenda) {
      setDb(prev => ({
        ...prev,
        agendas: prev.agendas.map(a =>
          a.id === editingAgenda.id
            ? {
                ...a,
                ...form,
                status: nextStatus,
                revisionNote: isGuru && !asDraft ? '' : a.revisionNote
              }
            : a
        )
      }));

      if (isGuru && !asDraft) {
        addNotification(
          'Pengajuan / Revisi Agenda Guru',
          `Guru mengajukan agenda "${form.title}" (${form.date}) untuk diverifikasi.`,
          'kalender'
        );
        showToast('Pengajuan / revisi agenda berhasil dikirim ke Kepala Sekolah!');
      } else if (asDraft) {
        showToast('Perubahan disimpan sebagai Draft.');
      } else {
        showToast('Agenda sekolah diperbarui & tersinkronisasi ke Kalender Publik!');
      }
    } else {
      const newItem = {
        id: `ag-${Date.now()}`,
        ...form,
        status: nextStatus,
        submittedBy: currentUser.roleLabel,
        submitterId: currentUser.id,
        revisionNote: ''
      };
      setDb(prev => ({ ...prev, agendas: [newItem, ...prev.agendas] }));

      if (isGuru && !asDraft) {
        addNotification(
          'Pengajuan Agenda Kegiatan Baru',
          `Guru mengajukan kegiatan "${form.title}" pada ${form.date} untuk verifikasi Kepala Sekolah.`,
          'kalender'
        );
        showToast('Pengajuan agenda berhasil dikirim ke Portal Kepala Sekolah!');
      } else if (asDraft) {
        showToast('Draft pengajuan agenda berhasil disimpan.');
      } else {
        showToast('Agenda baru berhasil ditambahkan & otomatis tampil di Kalender Publik!');
      }
    }
    setModalOpen(false);
  };

  const handleVerifyDecision = (decision) => {
    if (!verifyModal) return;
    if (decision === 'Perlu Revisi' && !revisionNoteInput.trim()) {
      showToast('Harap tuliskan catatan revisi untuk Guru!', 'error');
      return;
    }

    setDb(prev => ({
      ...prev,
      agendas: prev.agendas.map(a =>
        a.id === verifyModal.id
          ? {
              ...a,
              status: decision,
              revisionNote: decision === 'Perlu Revisi' ? revisionNoteInput.trim() : (decision === 'Ditolak' ? revisionNoteInput.trim() : '')
            }
          : a
      )
    }));

    const notifMsg =
      decision === 'Disetujui'
        ? `Agenda "${verifyModal.title}" disetujui Kepala Sekolah & otomatis terbit di Kalender Publik.`
        : decision === 'Perlu Revisi'
        ? `Agenda "${verifyModal.title}" diminta revisi: ${revisionNoteInput}`
        : `Agenda "${verifyModal.title}" ditolak oleh Kepala Sekolah.`;

    addNotification(`Status Pengajuan Agenda: ${decision}`, notifMsg, 'kalender');
    showToast(
      decision === 'Disetujui'
        ? 'Agenda disetujui & otomatis terintegrasi ke Kalender Publik!'
        : `Status pengajuan diperbarui menjadi "${decision}".`
    );
    setVerifyModal(null);
    setRevisionNoteInput('');
  };

  const deleteAgenda = (id) => {
    setDb(prev => ({ ...prev, agendas: prev.agendas.filter(a => a.id !== id) }));
    showToast('Agenda berhasil dihapus.', 'info');
  };

  const handlePrintPDF = () => {
    showToast('Membuka pratinjau cetak PDF Kalender Akademik...');
    downloadCalendarPDF(filteredAgendas.filter(a => a.status === 'Disetujui'), monthFilter);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-['Poppins'] font-bold text-slate-900">
            {isKepsek ? 'Kalender Akademik & Verifikasi Agenda Sekolah' : 'Pengajuan & Kalender Agenda Kegiatan Guru'}
          </h3>
          <p className="text-xs text-slate-500">
            {isKepsek
              ? 'Verifikasi pengajuan agenda Guru (Setujui / Revisi / Tolak). Agenda yang disetujui otomatis tampil di Kalender Publik.'
              : 'Ajukan kegiatan baru atau sunting/revisi pengajuan Anda untuk diverifikasi oleh Kepala Sekolah.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-blue-700" /> Cetak / Unduh PDF
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> {isKepsek ? 'Tambah Agenda Resmi' : 'Ajukan Agenda Kegiatan'}
          </button>
        </div>
      </div>

      {/* Kepala Sekolah: Pending Approval Banner */}
      {isKepsek && pendingApprovals.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Pengajuan Agenda Guru Menunggu Verifikasi ({pendingApprovals.length})</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingApprovals.map(item => (
              <div key={item.id} className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.date} ({item.startTime} - {item.endTime}) • {item.location}</div>
                  <div className="text-[11px] text-blue-700 font-medium">Kategori: {item.category} • Pengaju: {item.submittedBy}</div>
                </div>
                <button
                  onClick={() => { setVerifyModal(item); setRevisionNoteInput(item.revisionNote || ''); }}
                  className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shrink-0"
                >
                  Verifikasi Pengajuan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guru: Revision Request Alert Banner */}
      {isGuru && guruNeedsRevision.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-orange-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Pengajuan Agenda Memerlukan Revisi dari Kepala Sekolah ({guruNeedsRevision.length})</span>
          </div>
          <div className="space-y-2">
            {guruNeedsRevision.map(item => (
              <div key={item.id} className="bg-white p-3.5 rounded-xl border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{item.title} <span className="text-xs font-normal text-slate-500">({item.date})</span></div>
                  <div className="text-xs text-orange-800 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                    <strong>Catatan Revisi Kepsek:</strong> {item.revisionNote}
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" /> Sunting & Ajukan Ulang
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <input
          type="month"
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-700"
        />
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama kegiatan atau lokasi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
        >
          <option value="Semua">Semua Status</option>
          <option value="Disetujui">Disetujui (Tampil Publik)</option>
          <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
          <option value="Perlu Revisi">Perlu Revisi</option>
          <option value="Ditolak">Ditolak</option>
          {isGuru && <option value="Draft">Draft</option>}
        </select>
      </div>

      {/* Agenda & Submission Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Kegiatan & Kategori</th>
                <th className="px-5 py-3">Jadwal & Lokasi</th>
                <th className="px-5 py-3">Pengaju</th>
                <th className="px-5 py-3">Status & Publikasi</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAgendas.map(ag => {
                const canGuruEdit = isGuru && ag.submitterId === currentUser.id;
                return (
                  <tr key={ag.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{ag.title}</div>
                      <div className="text-xs text-blue-700 font-medium mt-0.5">{ag.category}</div>
                      {ag.revisionNote && (
                        <div className="text-[11px] text-orange-700 mt-1 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 inline-block">
                          Catatan: {ag.revisionNote}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800">{ag.date} ({ag.startTime} - {ag.endTime})</div>
                      <div>{ag.location}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{ag.submittedBy}</td>
                    <td className="px-5 py-3.5 space-y-1">
                      <div><StatusBadge status={ag.status} /></div>
                      {ag.status === 'Disetujui' && (
                        <div className="text-[10px] font-semibold text-emerald-700">✓ Otomatis di Kalender Publik</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      {isKepsek && (
                        <button
                          onClick={() => { setVerifyModal(ag); setRevisionNoteInput(ag.revisionNote || ''); }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold"
                        >
                          Verifikasi
                        </button>
                      )}
                      {(isKepsek || canGuruEdit) && (
                        <button
                          onClick={() => openEditModal(ag)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                          title={isGuru ? 'Sunting / Revisi Pengajuan' : 'Edit Agenda'}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {(isKepsek || canGuruEdit) && (
                        <button
                          onClick={() => deleteAgenda(ag.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form: Create / Edit / Revise Agenda */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          isKepsek
            ? (editingAgenda ? 'Edit Agenda Sekolah' : 'Tambah Agenda Kalender Akademik')
            : (editingAgenda ? 'Sunting / Revisi Pengajuan Agenda Guru' : 'Formulir Pengajuan Agenda Kegiatan Guru')
        }
      >
        <form onSubmit={(e) => saveAgenda(e, false)} className="space-y-4">
          {scheduleConflicts.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong>Deteksi Benturan Jadwal!</strong> Lokasi <strong>{form.location}</strong> pada tanggal <strong>{form.date}</strong> sudah terjadwal untuk kegiatan: <em>"{scheduleConflicts[0].title}"</em>.
              </div>
            </div>
          )}

          {editingAgenda?.revisionNote && isGuru && (
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs">
              <strong>Catatan Revisi dari Kepala Sekolah:</strong> {editingAgenda.revisionNote}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kegiatan / Agenda *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              placeholder="Contoh: Kunjungan Edukasi Perpustakaan Daerah"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu Mulai</label>
              <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu Selesai</label>
              <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Kegiatan</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={e => {
                  const cat = e.target.value;
                  const cMap = { 'Akademik': 'emerald', 'Rapat & Dinas': 'blue', 'Kesiswaan': 'amber', 'Lomba & Prestasi': 'purple' };
                  setForm({ ...form, category: cat, color: cMap[cat] || 'blue' });
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option>Akademik</option>
                <option>Rapat & Dinas</option>
                <option>Kesiswaan</option>
                <option>Lomba & Prestasi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi & Tujuan Kegiatan</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lampiran Proposal / Jadwal (Opsional)</label>
            <input
              type="file"
              onChange={e => setForm({ ...form, attachment: e.target.files?.[0]?.name || form.attachment })}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
            />
            {form.attachment && <div className="text-[11px] text-blue-700 mt-1">Lampiran: {form.attachment}</div>}
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700">
              Batal
            </button>
            {isGuru && (
              <button
                type="button"
                onClick={() => saveAgenda(null, true)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Simpan Draft
              </button>
            )}
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold">
              {isKepsek ? 'Simpan & Terbitkan ke Kalender Publik' : 'Kirim Pengajuan ke Kepala Sekolah'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Verifikasi Kepala Sekolah (Disetujui / Revisi / Ditolak) */}
      <Modal
        open={!!verifyModal}
        onClose={() => setVerifyModal(null)}
        title="Verifikasi Pengajuan Agenda Kegiatan (Kepala Sekolah)"
        maxWidth="max-w-lg"
      >
        {verifyModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-700">{verifyModal.category}</span>
                <StatusBadge status={verifyModal.status} />
              </div>
              <h4 className="font-bold text-slate-900 text-base">{verifyModal.title}</h4>
              <div><strong>Waktu:</strong> {verifyModal.date} ({verifyModal.startTime} - {verifyModal.endTime} WIB)</div>
              <div><strong>Lokasi:</strong> {verifyModal.location} • <strong>Pengaju:</strong> {verifyModal.submittedBy}</div>
              {verifyModal.description && <p className="text-slate-600 pt-1">{verifyModal.description}</p>}
              {verifyModal.attachment && <div className="text-blue-700 font-medium pt-1">Lampiran: {verifyModal.attachment}</div>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Evaluasi / Arahan Revisi (Wajib diisi jika meminta revisi)
              </label>
              <textarea
                rows={3}
                value={revisionNoteInput}
                onChange={e => setRevisionNoteInput(e.target.value)}
                placeholder="Tuliskan catatan persetujuan, alasan penolakan, atau poin revisi bagi Guru..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleVerifyDecision('Disetujui')}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                Setujui (Terbit Publik)
              </button>
              <button
                type="button"
                onClick={() => handleVerifyDecision('Perlu Revisi')}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs"
              >
                Minta Revisi
              </button>
              <button
                type="button"
                onClick={() => handleVerifyDecision('Ditolak')}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// --- 8C. MANAJEMEN ASPIRASI MASYARAKAT (KEPALA SEKOLAH & GURU) ---
function AdminAspirasiModule({ onNavigate }) {
  const { db, setDb, showToast } = useSchool();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editState, setEditState] = useState({ status: '', priority: '', publicNote: '', internalNote: '' });

  const filtered = db.aspirasi.filter(a => {
    const matchSearch =
      a.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.senderName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Semua' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openManageModal = (item) => {
    setSelectedItem(item);
    setEditState({
      status: item.status,
      priority: item.priority,
      publicNote: item.publicNote || '',
      internalNote: item.internalNote || ''
    });
  };

  const handleSaveStatus = () => {
    const now = new Date();
    const stamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;

    setDb(prev => ({
      ...prev,
      aspirasi: prev.aspirasi.map(a => {
        if (a.id !== selectedItem.id) return a;
        return {
          ...a,
          status: editState.status,
          priority: editState.priority,
          publicNote: editState.publicNote,
          internalNote: editState.internalNote,
          history: [
            ...a.history,
            {
              date: stamp,
              status: editState.status,
              note: editState.publicNote || `Status diperbarui menjadi ${editState.status}`
            }
          ]
        };
      })
    }));
    showToast(`Tiket ${selectedItem.ticketNumber} berhasil diperbarui!`);
    setSelectedItem(null);
  };

  const createFollowUpFromAspirasi = (item) => {
    const existing = db.followUps.find(f => f.sourceRef === item.ticketNumber);
    if (existing) {
      showToast(`Tiket ini sudah terhubung dengan ${existing.code}. Mengalihkan...`, 'info');
      onNavigate('tindaklanjut');
      return;
    }
    const code = `TL-2026-${Math.floor(100 + Math.random() * 899)}`;
    const today = new Date().toISOString().slice(0, 10);
    const newFu = {
      id: `fu-${Date.now()}`,
      code,
      title: `Tindak Lanjut: ${item.subject}`,
      sourceType: 'Aspirasi',
      sourceRef: item.ticketNumber,
      actionPlan: item.content,
      pic: 'Kepala Sekolah',
      priority: item.priority || 'Sedang',
      deadline: '2026-11-30',
      status: 'Belum Dimulai',
      evidenceNote: '',
      evidenceFileName: '',
      evidenceFileUrl: '',
      timeline: [{ date: today, status: 'Belum Dimulai', note: `Dibuat otomatis dari tiket aspirasi ${item.ticketNumber}.` }]
    };

    setDb(prev => ({
      ...prev,
      followUps: [newFu, ...prev.followUps],
      aspirasi: prev.aspirasi.map(a =>
        a.id === item.id
          ? {
              ...a,
              status: 'Dalam Tindak Lanjut',
              linkedFollowUpId: newFu.id,
              history: [...a.history, { date: today, status: 'Dalam Tindak Lanjut', note: `Dihubungkan ke Tindak Lanjut (${code}).` }]
            }
          : a
      )
    }));
    showToast(`Berhasil membuat Tindak Lanjut ${code} dari aspirasi!`);
    setSelectedItem(null);
    onNavigate('tindaklanjut');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nomor tiket, subjek, atau pengirim..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
        >
          <option value="Semua">Semua Status</option>
          <option value="Baru Masuk">Baru Masuk</option>
          <option value="Diverifikasi">Diverifikasi</option>
          <option value="Dalam Tindak Lanjut">Dalam Tindak Lanjut</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Tiket & Tanggal</th>
                <th className="px-5 py-3">Pengirim & Kategori</th>
                <th className="px-5 py-3">Subjek Aspirasi</th>
                <th className="px-5 py-3">Prioritas</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="font-mono text-xs font-bold text-blue-700">{item.ticketNumber}</div>
                    <div className="text-[11px] text-slate-400">{item.createdAt}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800">{item.senderName}</div>
                    <div className="text-xs text-slate-500">{item.category}</div>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate">{item.subject}</div>
                    <div className="text-xs text-slate-500 truncate">{item.content}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => openManageModal(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition"
                    >
                      Kelola Tiket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)} title={`Kelola Aspirasi (${selectedItem?.ticketNumber || ''})`}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 text-sm">{selectedItem.subject}</div>
              <div className="text-slate-500">Pengirim: {selectedItem.senderName} ({selectedItem.contact}) • Kategori: {selectedItem.category}</div>
              <p className="text-slate-700 pt-1 leading-relaxed">{selectedItem.content}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Penanganan</label>
                <select
                  value={editState.status}
                  onChange={e => setEditState({ ...editState, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option>Baru Masuk</option>
                  <option>Diverifikasi</option>
                  <option>Dalam Tindak Lanjut</option>
                  <option>Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prioritas</label>
                <select
                  value={editState.priority}
                  onChange={e => setEditState({ ...editState, priority: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option>Rendah</option>
                  <option>Sedang</option>
                  <option>Tinggi</option>
                  <option>Mendesak</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggapan Publik (Tampil di Pelacakan Tiket)</label>
              <textarea
                rows={2}
                value={editState.publicNote}
                onChange={e => setEditState({ ...editState, publicNote: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Internal Sekolah</label>
              <textarea
                rows={2}
                value={editState.internalNote}
                onChange={e => setEditState({ ...editState, internalNote: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="flex flex-wrap justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => createFollowUpFromAspirasi(selectedItem)}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <Link2 className="w-4 h-4" /> Hubungkan ke Tindak Lanjut
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// --- 8D. MANAJEMEN BUKU TAMU (KEPALA SEKOLAH & GURU - DENGAN AKSI VERIFIKASI) ---
function AdminGuestbookModule() {
  const { db, setDb, showToast } = useSchool();
  const [search, setSearch] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', institution: '', phone: '', purpose: 'Kunjungan Dinas', destination: '', notes: '' });

  const filtered = db.guestbook.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.institution.toLowerCase().includes(search.toLowerCase()) || g.regNumber.toLowerCase().includes(search.toLowerCase());
    const matchPurpose = purposeFilter === 'Semua' || g.purpose === purposeFilter;
    return matchSearch && matchPurpose;
  });

  const toggleVerifyGuest = (guest) => {
    const nextState = !guest.verified;
    setDb(prev => ({
      ...prev,
      guestbook: prev.guestbook.map(g => g.id === guest.id ? { ...g, verified: nextState } : g)
    }));
    showToast(nextState ? `Kunjungan ${guest.regNumber} telah diverifikasi!` : `Verifikasi ${guest.regNumber} dibatalkan.`);
  };

  const exportCSV = () => {
    const headers = ['No Registrasi,Nama,Instansi,No HP,Keperluan,Tujuan Kunjungan,Tanggal,Waktu,Status Verifikasi'];
    const rows = filtered.map(g => `"${g.regNumber}","${g.name}","${g.institution}","${g.phone}","${g.purpose}","${g.destination}","${g.date}","${g.time}","${g.verified ? 'Terverifikasi' : 'Menunggu Verifikasi'}"`);
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Buku_Tamu_SDN_Merjosari_2.csv`;
    a.click();
    showToast('Laporan Buku Tamu (Excel/CSV) berhasil diunduh!');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editing) {
      setDb(prev => ({ ...prev, guestbook: prev.guestbook.map(g => g.id === editing.id ? { ...g, ...form } : g) }));
      showToast('Data kunjungan diperbarui!');
    } else {
      const now = new Date();
      const newEntry = {
        id: `gb-${Date.now()}`,
        regNumber: `GT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        ...form,
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
        verified: true
      };
      setDb(prev => ({ ...prev, guestbook: [newEntry, ...prev.guestbook] }));
      showToast('Data kunjungan baru ditambahkan!');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setDb(prev => ({ ...prev, guestbook: prev.guestbook.filter(g => g.id !== id) }));
    showToast('Data kunjungan dihapus.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Ekspor Excel (CSV)
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Cetak PDF
          </button>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', institution: '', phone: '', purpose: 'Kunjungan Dinas', destination: '', notes: '' }); setModalOpen(true); }}
          className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Tambah Kunjungan
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, instansi, atau nomor registrasi..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none" />
        </div>
        <select value={purposeFilter} onChange={e => setPurposeFilter(e.target.value)} className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white">
          <option value="Semua">Semua Keperluan</option>
          <option>Kunjungan Dinas</option>
          <option>Wali Murid</option>
          <option>Penelitian/Magang</option>
          <option>Kerjasama / Mitra</option>
          <option>Lainnya</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">No. Reg & Waktu</th>
                <th className="px-5 py-3">Nama & Instansi</th>
                <th className="px-5 py-3">Tujuan Kunjungan</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(g => (
                <tr key={g.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="font-mono text-xs font-bold text-blue-700">{g.regNumber}</div>
                    <div className="text-[11px] text-slate-400">{g.date} • {g.time}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800">{g.name}</div>
                    <div className="text-xs text-slate-500">{g.institution} • {g.phone}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-xs font-semibold">{g.purpose}</span>
                    <div className="text-xs text-slate-700 mt-1">{g.destination}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={g.verified ? 'Terverifikasi' : 'Menunggu Verifikasi'} />
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => toggleVerifyGuest(g)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        g.verified
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {g.verified ? 'Batal Verif' : 'Verifikasi'}
                    </button>
                    <button onClick={() => { setEditing(g); setForm(g); setModalOpen(true); }} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(g.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Data Pengunjung' : 'Input Kunjungan Manual'}>
        <form onSubmit={handleSave} className="space-y-3">
          <input required type="text" placeholder="Nama Pengunjung" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          <input required type="text" placeholder="Instansi / Asal" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          <input required type="text" placeholder="Nomor HP" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white">
            <option>Kunjungan Dinas</option>
            <option>Wali Murid</option>
            <option>Penelitian/Magang</option>
            <option>Kerjasama / Mitra</option>
            <option>Lainnya</option>
          </select>
          <input required type="text" placeholder="Tujuan Kunjungan (isian bebas)" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          <textarea rows={2} placeholder="Catatan tambahan" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-sm">Simpan Data</button>
        </form>
      </Modal>
    </div>
  );
}

// --- 8E. MANAJEMEN TINDAK LANJUT (GURU: BERDASARKAN DATA ASPIRASI + UPLOAD FOTO; KEPSEK: UPLOAD FOTO/FILE) ---
function AdminFollowUpModule() {
  const { db, setDb, currentUser, showToast } = useSchool();
  const isGuru = currentUser.role === 'guru';

  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);

  const [form, setForm] = useState({
    title: '',
    sourceType: 'Aspirasi',
    sourceRef: db.aspirasi[0]?.ticketNumber || '',
    actionPlan: '',
    pic: currentUser.roleLabel,
    priority: 'Sedang',
    deadline: '2026-11-30',
    status: 'Belum Dimulai',
    evidenceFileName: '',
    evidenceFileUrl: ''
  });

  const [progressUpdate, setProgressUpdate] = useState({
    status: '',
    note: '',
    evidenceNote: '',
    evidenceFileName: '',
    evidenceFileUrl: ''
  });

  // For Guru portal: strictly display follow-ups sourced from Aspirasi data
  const visibleFollowUps = isGuru
    ? db.followUps.filter(f => f.sourceType === 'Aspirasi')
    : db.followUps;

  const handleFileUploadCreate = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, ({ name, url }) => {
      setForm(prev => ({ ...prev, evidenceFileName: name, evidenceFileUrl: url }));
      showToast(`Berkas "${name}" siap diunggah!`);
    });
  };

  const handleFileUploadUpdate = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, ({ name, url }) => {
      setProgressUpdate(prev => ({ ...prev, evidenceFileName: name, evidenceFileUrl: url }));
      showToast(`Foto/File "${name}" berhasil dilampirkan!`);
    });
  };

  const createFollowUp = (e) => {
    e.preventDefault();
    const code = `TL-2026-${Math.floor(100 + Math.random() * 899)}`;
    const newItem = {
      id: `fu-${Date.now()}`,
      code,
      ...form,
      sourceType: isGuru ? 'Aspirasi' : form.sourceType,
      evidenceNote: form.evidenceFileName ? `Lampiran awal: ${form.evidenceFileName}` : '',
      timeline: [{ date: new Date().toISOString().slice(0, 10), status: form.status, note: 'Rencana tindak lanjut dibuat.' }]
    };
    setDb(prev => ({ ...prev, followUps: [newItem, ...prev.followUps] }));
    showToast(`Tindak lanjut ${code} berhasil dibuat!`);
    setModalOpen(false);
  };

  const openDetail = (fu) => {
    setDetailModal(fu);
    setProgressUpdate({
      status: fu.status,
      note: '',
      evidenceNote: fu.evidenceNote || '',
      evidenceFileName: fu.evidenceFileName || '',
      evidenceFileUrl: fu.evidenceFileUrl || ''
    });
  };

  const saveProgress = () => {
    const today = new Date().toISOString().slice(0, 10);
    setDb(prev => ({
      ...prev,
      followUps: prev.followUps.map(f => {
        if (f.id !== detailModal.id) return f;
        return {
          ...f,
          status: progressUpdate.status,
          evidenceNote: progressUpdate.evidenceNote,
          evidenceFileName: progressUpdate.evidenceFileName,
          evidenceFileUrl: progressUpdate.evidenceFileUrl,
          timeline: [
            ...f.timeline,
            { date: today, status: progressUpdate.status, note: progressUpdate.note || `Status diperbarui ke ${progressUpdate.status}` }
          ]
        };
      })
    }));
    showToast('Progres & bukti tindak lanjut berhasil disimpan!');
    setDetailModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-['Poppins'] font-bold text-slate-900">
            {isGuru ? 'Manajemen Tindak Lanjut Aspirasi (Portal Guru)' : 'Manajemen Tindak Lanjut Terpadu'}
          </h3>
          <p className="text-xs text-slate-500">
            {isGuru
              ? 'Daftar tindak lanjut yang bersumber langsung dari data aspirasi masyarakat beserta unggah foto bukti pelaksanaan.'
              : 'Kelola tindak lanjut aspirasi maupun internal lengkap dengan lampiran foto atau dokumen bukti.'}
          </p>
        </div>
        <button
          onClick={() => {
            setForm({
              title: '',
              sourceType: 'Aspirasi',
              sourceRef: db.aspirasi[0]?.ticketNumber || '',
              actionPlan: '',
              pic: currentUser.roleLabel,
              priority: 'Sedang',
              deadline: '2026-11-30',
              status: 'Belum Dimulai',
              evidenceFileName: '',
              evidenceFileUrl: ''
            });
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" /> {isGuru ? 'Tambah Tindak Lanjut Aspirasi' : 'Tambah Tindak Lanjut'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleFollowUps.map(fu => (
          <div key={fu.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700">{fu.code}</span>
                <StatusBadge status={fu.status} />
              </div>
              <h4 className="font-['Poppins'] font-bold text-slate-900 text-sm">{fu.title}</h4>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                <Link2 className="w-3 h-3 text-blue-600" /> Sumber: {fu.sourceType} ({fu.sourceRef})
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{fu.actionPlan}</p>

              {/* Thumbnail Preview if image uploaded */}
              {fu.evidenceFileUrl && fu.evidenceFileUrl.startsWith('data:image') && (
                <img src={fu.evidenceFileUrl} alt="Bukti Tindak Lanjut" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
              )}
              {fu.evidenceFileName && (
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Bukti: {fu.evidenceFileName}
                </div>
              )}

              <div className="text-xs text-slate-500 pt-1 space-y-0.5">
                <div><strong>Penanggung Jawab:</strong> {fu.pic}</div>
                <div className="flex items-center justify-between">
                  <span><strong>Deadline:</strong> {fu.deadline}</span>
                  <PriorityBadge priority={fu.priority} />
                </div>
              </div>
            </div>

            <button onClick={() => openDetail(fu)} className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition">
              Update Timeline & {isGuru ? 'Upload Foto Bukti' : 'Upload Foto / File'}
            </button>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isGuru ? 'Tambah Tindak Lanjut dari Data Aspirasi' : 'Buat Rencana Tindak Lanjut Baru'}>
        <form onSubmit={createFollowUp} className="space-y-3">
          {isGuru ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Tiket Data Aspirasi *</label>
              <select
                required
                value={form.sourceRef}
                onChange={e => {
                  const chosen = db.aspirasi.find(a => a.ticketNumber === e.target.value);
                  setForm({
                    ...form,
                    sourceType: 'Aspirasi',
                    sourceRef: e.target.value,
                    title: chosen ? `Tindak Lanjut: ${chosen.subject}` : form.title,
                    actionPlan: chosen ? chosen.content : form.actionPlan
                  });
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              >
                {db.aspirasi.map(a => (
                  <option key={a.id} value={a.ticketNumber}>{a.ticketNumber} — {a.subject}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <select value={form.sourceType} onChange={e => setForm({ ...form, sourceType: e.target.value })} className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                <option>Aspirasi</option>
                <option>Temuan Internal</option>
              </select>
              <input type="text" placeholder="Referensi (misal: ASP-2026-8821)" value={form.sourceRef} onChange={e => setForm({ ...form, sourceRef: e.target.value })} className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          )}

          <input required type="text" placeholder="Judul Tindak Lanjut" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          <textarea required rows={3} placeholder="Rencana tindakan konkret..." value={form.actionPlan} onChange={e => setForm({ ...form, actionPlan: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />

          <div className="grid grid-cols-2 gap-3">
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white">
              <option>Rendah</option>
              <option>Sedang</option>
              <option>Tinggi</option>
              <option>Mendesak</option>
            </select>
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isGuru ? 'Upload Foto Pendukung (Opsional)' : 'Upload Foto atau File Pendukung (Opsional)'}
            </label>
            <input
              type="file"
              accept={isGuru ? 'image/*' : 'image/*,.pdf,.doc,.docx'}
              onChange={handleFileUploadCreate}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
            />
          </div>

          <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold">Simpan Tindak Lanjut</button>
        </form>
      </Modal>

      {/* Timeline & Upload Foto/File Modal */}
      <Modal open={!!detailModal} onClose={() => setDetailModal(null)} title={`Timeline & Bukti (${detailModal?.code || ''})`}>
        {detailModal && (
          <div className="space-y-4">
            <div className="space-y-2 border-l-2 border-emerald-500 pl-4 ml-1">
              {detailModal.timeline.map((t, i) => (
                <div key={i} className="text-xs">
                  <div className="font-bold text-slate-800">{t.status} <span className="font-normal text-slate-400">({t.date})</span></div>
                  <div className="text-slate-600">{t.note}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Perbarui Status</label>
                <select value={progressUpdate.status} onChange={e => setProgressUpdate({ ...progressUpdate, status: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                  <option>Belum Dimulai</option>
                  <option>Sedang Berlangsung</option>
                  <option>Menunggu Verifikasi</option>
                  <option>Perlu Perbaikan</option>
                  <option>Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Perkembangan Baru</label>
                <input type="text" value={progressUpdate.note} onChange={e => setProgressUpdate({ ...progressUpdate, note: e.target.value })} placeholder="Tuliskan progres terbaru..." className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan Bukti Penyelesaian</label>
                <input type="text" value={progressUpdate.evidenceNote} onChange={e => setProgressUpdate({ ...progressUpdate, evidenceNote: e.target.value })} placeholder="Deskripsi bukti penyelesaian..." className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>

              {/* Upload Foto / File */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  {isGuru ? 'Upload Foto Bukti Tindak Lanjut' : 'Upload Foto atau File Bukti Penyelesaian'}
                </label>
                <input
                  type="file"
                  accept={isGuru ? 'image/*' : 'image/*,.pdf,.doc,.docx,.xls,.xlsx'}
                  onChange={handleFileUploadUpdate}
                  className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {progressUpdate.evidenceFileUrl && progressUpdate.evidenceFileUrl.startsWith('data:image') && (
                  <img src={progressUpdate.evidenceFileUrl} alt="Preview Bukti" className="w-full max-h-44 object-cover rounded-xl border border-slate-200 mt-2" />
                )}
                {progressUpdate.evidenceFileName && (
                  <div className="text-xs font-medium text-blue-700">File terlampir: {progressUpdate.evidenceFileName}</div>
                )}
              </div>

              <button onClick={saveProgress} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold">
                Simpan Pembaruan & Bukti
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// --- 8F. MANAJEMEN DOKUMENTASI KEGIATAN (TANPA TEMA + UPLOAD FOTO/FILE) ---
function AdminDocumentationModule() {
  const { db, setDb, showToast } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Akademik',
    date: '2026-11-17',
    mediaType: 'Foto',
    status: 'Terbit',
    description: '',
    fileName: '',
    fileUrl: ''
  });

  const openModal = (item = null) => {
    setEditing(item);
    setForm(item || {
      title: '',
      category: 'Akademik',
      date: '2026-11-17',
      mediaType: 'Foto',
      status: 'Terbit',
      description: '',
      fileName: '',
      fileUrl: ''
    });
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, ({ name, type, url }) => {
      const detectedType = type.startsWith('video/') ? 'Video' : 'Foto';
      setForm(prev => ({ ...prev, fileName: name, fileUrl: url, mediaType: detectedType }));
      showToast(`File "${name}" berhasil dipilih!`);
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const year = form.date.slice(0, 4);
    if (editing) {
      setDb(prev => ({ ...prev, dokumentasi: prev.dokumentasi.map(d => d.id === editing.id ? { ...d, ...form, year } : d) }));
      showToast('Dokumentasi diperbarui!');
    } else {
      const newDoc = { id: `dok-${Date.now()}`, ...form, year };
      setDb(prev => ({ ...prev, dokumentasi: [newDoc, ...prev.dokumentasi] }));
      showToast(form.status === 'Terbit' ? 'Dokumentasi diterbitkan ke Website Publik!' : 'Dokumentasi disimpan.');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setDb(prev => ({ ...prev, dokumentasi: prev.dokumentasi.filter(d => d.id !== id) }));
    showToast('Dokumentasi dihapus.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-['Poppins'] font-bold text-slate-900">Kelola Galeri Dokumentasi</h3>
          <p className="text-xs text-slate-500">Unggah foto atau file dokumentasi kegiatan sekolah untuk ditampilkan di Portal Publik.</p>
        </div>
        <button onClick={() => openModal()} className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Unggah Dokumentasi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {db.dokumentasi.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              {doc.fileUrl && doc.mediaType === 'Foto' ? (
                <div className="h-36 relative">
                  <img src={doc.fileUrl} alt={doc.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3"><StatusBadge status={doc.status} /></div>
                </div>
              ) : (
                <div className="h-28 bg-gradient-to-r from-blue-700 to-sky-500 p-4 flex justify-between items-start text-white">
                  <span className="px-2.5 py-0.5 rounded bg-black/25 text-xs font-semibold">{doc.category}</span>
                  <StatusBadge status={doc.status} />
                </div>
              )}
              <div className="p-4 space-y-1.5">
                <div className="text-[11px] text-slate-400">{doc.date} • {doc.mediaType} {doc.fileName ? `(${doc.fileName})` : ''}</div>
                <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{doc.description}</p>
              </div>
            </div>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => openModal(doc)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100">Edit</button>
              <button onClick={() => handleDelete(doc.id)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-xs font-semibold text-rose-600 hover:bg-rose-100">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Dokumentasi' : 'Unggah Dokumentasi Kegiatan'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Kegiatan *</label>
            <input required type="text" placeholder="Judul Kegiatan" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                <option>Akademik</option>
                <option>Kesiswaan</option>
                <option>Ekstrakurikuler</option>
                <option>Rapat & Dinas</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                <option>Terbit</option>
                <option>Draft</option>
                <option>Diarsipkan</option>
              </select>
            </div>
          </div>

          {/* Upload Foto atau File (Tanpa Pilihan Tema) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Upload Foto atau File Dokumentasi</label>
            <input
              type="file"
              accept="image/*,video/*,.pdf"
              onChange={handleFileChange}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {form.fileUrl && form.mediaType === 'Foto' && (
              <img src={form.fileUrl} alt="Preview" className="w-full max-h-44 object-cover rounded-xl border border-slate-200 mt-2" />
            )}
            {form.fileName && <div className="text-xs text-blue-700 font-medium">Terpilih: {form.fileName}</div>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Kegiatan *</label>
            <textarea required rows={3} placeholder="Deskripsi dokumentasi kegiatan..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          </div>

          <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold">Simpan Dokumentasi</button>
        </form>
      </Modal>
    </div>
  );
}

// --- 8G. MANAJEMEN PENGUMUMAN & BERITA SEKOLAH (DENGAN UPLOAD FOTO) ---
function AdminPengumumanModule() {
  const { db, setDb, showToast } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    date: '2026-11-17',
    category: 'Pengumuman Sekolah',
    visibility: 'Publik',
    photoUrl: '',
    photoName: '',
    content: ''
  });

  const openModal = (item = null) => {
    setEditing(item);
    setForm(item || {
      title: '',
      date: '2026-11-17',
      category: 'Pengumuman Sekolah',
      visibility: 'Publik',
      photoUrl: '',
      photoName: '',
      content: ''
    });
    setModalOpen(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, ({ name, url }) => {
      setForm(prev => ({ ...prev, photoName: name, photoUrl: url }));
      showToast(`Foto "${name}" siap diunggah!`);
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editing) {
      setDb(prev => ({ ...prev, pengumuman: prev.pengumuman.map(p => p.id === editing.id ? { ...p, ...form } : p) }));
      showToast('Pengumuman / Berita diperbarui!');
    } else {
      const newItem = { id: `pg-${Date.now()}`, ...form };
      setDb(prev => ({ ...prev, pengumuman: [newItem, ...prev.pengumuman] }));
      showToast('Pengumuman / Berita berhasil diterbitkan!');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setDb(prev => ({ ...prev, pengumuman: prev.pengumuman.filter(p => p.id !== id) }));
    showToast('Pengumuman dihapus.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-['Poppins'] font-bold text-slate-900">Kelola Pengumuman & Berita Sekolah</h3>
          <p className="text-xs text-slate-500">Publikasi berita kegiatan dan pengumuman resmi dengan unggahan foto.</p>
        </div>
        <button onClick={() => openModal()} className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Buat Pengumuman / Berita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {db.pengumuman.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.title} className="w-full h-36 object-cover" />
              ) : (
                <div className="h-28 bg-gradient-to-r from-blue-700 to-sky-500 p-4 flex justify-between items-start text-white">
                  <span className="px-2.5 py-0.5 rounded bg-black/25 text-xs font-semibold">{item.category}</span>
                  <StatusBadge status={item.visibility} />
                </div>
              )}
              <div className="p-4 space-y-1.5">
                <div className="text-[11px] text-slate-400">{item.date} • {item.category}</div>
                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-3">{item.content}</p>
              </div>
            </div>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => openModal(item)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-xs font-semibold text-rose-600 hover:bg-rose-100">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Pengumuman / Berita' : 'Tambah Pengumuman & Berita Baru'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Pengumuman / Berita *</label>
            <input required type="text" placeholder="Judul berita atau pengumuman..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                <option>Pengumuman Sekolah</option>
                <option>Informasi Akademik</option>
                <option>Kegiatan Sekolah</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Tayang</label>
              <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                <option>Publik</option>
                <option>Draft</option>
              </select>
            </div>
          </div>

          {/* Upload Foto Berita */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Upload Foto Pengumuman / Berita</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {form.photoUrl && (
              <img src={form.photoUrl} alt="Preview Berita" className="w-full max-h-44 object-cover rounded-xl border border-slate-200 mt-2" />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Pengumuman / Berita *</label>
            <textarea required rows={4} placeholder="Tuliskan isi berita atau pengumuman lengkap di sini..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
          </div>

          <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold">Simpan & Publikasikan</button>
        </form>
      </Modal>
    </div>
  );
}

// --- 8H. PROFIL AKUN (TANPA LOG AKTIVITAS + UPLOAD FOTO PROFIL) ---
function AdminProfileModule() {
  const { db, setDb, currentUser, setCurrentUser, showToast, resetDemoData } = useSchool();
  const [profileForm, setProfileForm] = useState({
    phone: currentUser.phone,
    email: currentUser.email,
    newPassword: '',
    photoUrl: currentUser.photoUrl || ''
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsDataUrl(file, ({ url }) => {
      setProfileForm(prev => ({ ...prev, photoUrl: url }));
      const updatedUser = { ...currentUser, photoUrl: url };
      setCurrentUser(updatedUser);
      setDb(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u)
      }));
      showToast('Foto profil berhasil diperbarui!');
    });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      phone: profileForm.phone,
      email: profileForm.email,
      photoUrl: profileForm.photoUrl,
      password: profileForm.newPassword ? profileForm.newPassword : currentUser.password
    };
    setCurrentUser(updatedUser);
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u)
    }));
    setProfileForm(prev => ({ ...prev, newPassword: '' }));
    showToast('Pengaturan akun berhasil diperbarui!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-5 border-b border-slate-100">
          <UserAvatar user={{ ...currentUser, photoUrl: profileForm.photoUrl }} size="w-20 h-20 text-2xl" />
          <div className="space-y-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Akun Portal Resmi</span>
              <h3 className="font-['Poppins'] font-bold text-xl text-slate-900 mt-1">{currentUser.roleLabel}</h3>
              <p className="text-xs text-slate-500">{SCHOOL_INFO.name} • NPSN: {SCHOOL_INFO.npsn}</p>
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto Profil</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon Sekolah</label>
              <input type="text" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ubah Kata Sandi Login ({currentUser.roleLabel})</label>
            <input type="password" placeholder="Kosongkan jika tidak ingin mengubah kata sandi" value={profileForm.newPassword} onChange={e => setProfileForm({ ...profileForm, newPassword: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-sm">
            Simpan Perubahan Akun
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100">
          <button onClick={resetDemoData} className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Reset Data Simulasi ke Awal
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. ROOT APPLICATION COMPONENT
// ============================================================================

function MainShell() {
  const { viewMode, currentUser, toast, showToast } = useSchool();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const testSupabaseConnection = async () => {
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Supabase belum dikonfigurasi. Periksa Environment Variables Vercel.');
        return;
      }

      const { error } = await supabase.from('guestbook').select('*').limit(1);
      if (!active) return;

      if (error) {
        console.error('Supabase connection test:', error);
        showToast('Supabase merespons, tetapi akses tabel guestbook belum berhasil. Periksa izin RLS dan struktur tabel.', 'error');
      } else {
        showToast('Koneksi Supabase berhasil. Tabel guestbook dapat diakses.');
      }
    };

    testSupabaseConnection();
    return () => { active = false; };
  }, [showToast]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
        @media print {
          body { background: white !important; }
          button, header, nav, footer { display: none !important; }
        }
      `}</style>

      {viewMode === 'admin' && currentUser ? (
        <AdminDashboard />
      ) : (
        <PublicPortal onOpenLogin={() => setLoginOpen(true)} />
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <MainShell />
    </SchoolProvider>
  );
}