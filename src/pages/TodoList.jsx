import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { todoListAPI } from "../api/todo-list";

function TodoList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [filterCompanyId, setFilterCompanyId] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await todoListAPI.getTodoItems(token);
      
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      // Fallback to localStorage if API fails
      const savedTasks = localStorage.getItem("todoTasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies from backend
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5557/api'}/company-management`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCompanies(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCompanies();
  }, []);

  // Initial tasks from user's list (for fallback)
  const initialTasks = [
    { id: 1, text: "JV ID PATTANI DGN HJ OSMAN - EN ABE", completed: false, assignee: "EN ABE" },
    { id: 2, text: "AGREEMENT CAFE PATTANI RENEW - EN ABE", completed: false, assignee: "EN ABE" },
    { id: 3, text: "BAYARAN MAHKAMAH UZAIR - TEAM KEW", completed: false, assignee: "TEAM KEW" },
    { id: 4, text: "ENZA - PERANCANGAN2 DI M2, M3, SWK - ENZA", completed: false, assignee: "ENZA" },
    { id: 5, text: "JOIN ORG LUAR UTK PGRM2 BERSAMA - TEAM ZM", completed: false, assignee: "TEAM ZM" },
    { id: 6, text: "TUTUP ANAK SYARIKAT GISBH YG DORMANT - EKO", completed: false, assignee: "EKO" },
    { id: 7, text: "BAS PADA CENDANA AUTO. KIRA2 NYA MCMN - TN AMIN", completed: false, assignee: "TN AMIN" },
    { id: 8, text: "KELAB PAYUNG PUTERI - RPUM", completed: false, assignee: "RPUM" },
    { id: 9, text: "KHUTBAH. UTK SELATAN THAI JUGA - TN MAARUF", completed: false, assignee: "TN MAARUF" },
    { id: 10, text: "TEAM UTK HADIRI SEMINAR - TEAM ZM", completed: false, assignee: "TEAM ZM" },
    { id: 11, text: "TRM. JUMPA DA. BANGUNKN TRM DGN PPZ - EKO DAN TEAM ZM", completed: false, assignee: "EKO, TEAM ZM" },
    { id: 12, text: "LAPORAN MINGGUAN TTG RIFAAH A - EKA", completed: false, assignee: "EKA" },
    { id: 13, text: "OTP GERAKKAN - TEAM OTP", completed: false, assignee: "TEAM OTP" },
    { id: 14, text: "INFO ENZA DI SWK, M2 - ENZA", completed: false, assignee: "ENZA" },
    { id: 15, text: "FOLLOW HJ SALLEH @TNH - TNH", completed: false, assignee: "TNH" },
    { id: 16, text: "PROPOSAL LENGKAP UTK SYED HOOD - EN ZAR", completed: false, assignee: "EN ZAR" },
    { id: 17, text: "SELESAIKAN URUSAN UTK JUAL TANAH BT HAMPAR - TN QUDAMAH", completed: false, assignee: "TN QUDAMAH" },
    { id: 18, text: "TERUSKAN PERHUBUNGAN DGN AISYAH BAICON DLL - TNH", completed: false, assignee: "TNH" },
    { id: 19, text: "SEWAAN TANAH RND ENZA BIOTECH - EKA", completed: false, assignee: "EKA" },
    { id: 20, text: "BANGUNKAN TRM - TEAM ZM", completed: false, assignee: "TEAM ZM" },
    { id: 21, text: "SELESAIKAN HUTANG MART DENGAN KASIH SAYANG - EN ALI HASSAN", completed: false, assignee: "EN ALI HASSAN" },
    { id: 22, text: "KEM MTVSI BUKA PADA ORG LUAR - APS", completed: false, assignee: "APS" },
    { id: 23, text: "KHUTBAH UTK MASYARAKAT - APS", completed: false, assignee: "APS" },
    { id: 24, text: "KEMPEN SERTAI PERSATUAN2 LUAR - TEAM ZM", completed: false, assignee: "TEAM ZM" },
    { id: 25, text: "MAAL HIJRAH. JOIN GROUP LUAR - TEAM ZM", completed: false, assignee: "TEAM ZM" },
    { id: 26, text: "EXPO BANGKOK - EN ABE", completed: false, assignee: "EN ABE" },
    { id: 27, text: "FOLLOW UP AMLA ASET DISITA - TEAM AMLA", completed: false, assignee: "TEAM AMLA" },
    { id: 28, text: "JUMPA TN TAR DAN ZAIM TUNTUT BRG² DR PDRM - EKO", completed: false, assignee: "EKO" },
    { id: 29, text: "OTP UTK M2. BUAT MAPPING MAQLUBAH. UTK FOKUS TINDAKAN2 - TEAM M2", completed: false, assignee: "TEAM M2" },
    { id: 30, text: "SEMAK SEMULA PENDIDIKAN DI M2 - TEAM M2", completed: false, assignee: "TEAM M2" },
    { id: 31, text: "MANIFESTO. MELALUI JAWAPAN2 KPD PERMASALAHAN POLITIK, DGN MINDA2 M. HALATUJU KITA MELALUI MINDA, PERJUANGAN M. SUPPORTED DGN QURAN HADIS. - TEAM MANIFESTO", completed: false, assignee: "TEAM MANIFESTO" },
    { id: 32, text: "WUJUDKAN SATU PROJEK CONTOH DALM 2 BULAN. BY 22 JULAI. PROJEK TANAH JERAM. ASAIMEN IKUT KATEGORI. - TNF DAN ZM", completed: false, assignee: "TNF, ZM" },
    { id: 33, text: "PN HAILA (CHINA). PENGAJIAN, SUASANA ISLAM DI MSIA. JUMPA KOMUNITI MRK - AZHAR CHEN (?). SIAPA KWN2 MRK DI MSIA. - PKA, TSCKA", completed: false, assignee: "PKA, TSCKA" },
    { id: 34, text: "JUMPA FATEH RAZAK, DEHYA RAHMAN - 4MAT", completed: false, assignee: "4MAT" },
    { id: 35, text: "TANAH DM - F UP SURAT AGREEMENT. HNTAR DRAFT NYA KPD DM. - TAS", completed: false, assignee: "TAS" },
    { id: 36, text: "TANAH JERAM - PERNIAGAAN OK. JETI - STUDY LEGAL. PENGURUSAN PROJEK JERAM - TNF", completed: false, assignee: "TNF" },
    { id: 37, text: "BMW UTK DA. LEPAS OK.. BERGANTUNG NILAI DA NAK AMBIK - TWS", completed: false, assignee: "TWS" },
    { id: 38, text: "JUMPA DR FAUZI - TAAAR THAH", completed: false, assignee: "TAAAR, THAH" },
    { id: 39, text: "KIFFAH TRAVEL. CARI INFO - TN HANZALAH", completed: false, assignee: "TN HANZALAH" },
    { id: 40, text: "ASET BOSNIA - JUMPA EN NORMAN", completed: false, assignee: "EN NORMAN" },
    { id: 41, text: "TANAH RND ENZA BIOTECH - EKA", completed: false, assignee: "EKA" },
    { id: 42, text: "LAPORAN BULANAN PREMIS, PROJEK - TEAM ZM", completed: false, assignee: "TEAM ZM" },
    { id: 43, text: "SISTEM TERNAKAN AYAM - EJI", completed: false, assignee: "EJI" },
    { id: 44, text: "KAFE QAHWA - TSCKA, PKA", completed: false, assignee: "TSCKA, PKA" },
    { id: 45, text: "TEAM DI M2 PERKEMASKAN - TEAM M2", completed: false, assignee: "TEAM M2" },
    { id: 46, text: "NAMA2 KE UMRAH - TEAM", completed: false, assignee: "TEAM" },
    { id: 47, text: "MODULAR GORO RM8K. - TEAM ZM", completed: false, assignee: "TEAM ZM" },
    { id: 48, text: "DR FAUZI. BERGABUNG DGN PENDIDIKAN - APS", completed: false, assignee: "APS" },
    { id: 49, text: "HJ MISWAN. PROJEK JAHITAN. - SYARIKAT JAHITAN", completed: false, assignee: "SYARIKAT JAHITAN" },
    { id: 50, text: "JUAL LOT DB BHC. AKHIE HUANG - EKO", completed: false, assignee: "EKO" },
    { id: 51, text: "TANAH SP. MAHKAMAH. - EKO", completed: false, assignee: "EKO" },
    { id: 52, text: "AMBIL ALIH TANAH BENTONG. - EKO", completed: false, assignee: "EKO" },
    { id: 53, text: "TANAH JELEBU BANGUNKAN", completed: false, assignee: "" },
    { id: 54, text: "TANAH LABU LANJUT DA", completed: false, assignee: "" },
    { id: 55, text: "TANAH REMBAU DATO UJAT", completed: false, assignee: "" },
    { id: 56, text: "PROJEK TAUGEH - THMN", completed: false, assignee: "THMN" },
    { id: 57, text: "TANAH MERLIMAU - TAAAR", completed: false, assignee: "TAAAR" },
    { id: 58, text: "EQUINE A TO Z - TAA", completed: false, assignee: "TAA" },
    { id: 59, text: "SEWA BANGUNAN EVENT MGT - PKA", completed: false, assignee: "PKA" },
    { id: 60, text: "SEWAAN RMH DA PENANG - TSCKA", completed: false, assignee: "TSCKA" },
    { id: 61, text: "ARAFAH HOTEL - EN FATEH", completed: false, assignee: "EN FATEH" },
    { id: 62, text: "HSTAY DI NEGERI2 - TEAM", completed: false, assignee: "TEAM" },
    { id: 63, text: "SAFINA DI M3 - EN ABE", completed: false, assignee: "EN ABE" },
    { id: 64, text: "EXPORT AL HADDAD - PKA, EXPORT", completed: false, assignee: "PKA, EXPORT" },
    { id: 65, text: "PES TOMYAM KE TURKIYE - PKA, EXPORT", completed: false, assignee: "PKA, EXPORT" },
    { id: 66, text: "TEAM PERHUBUNGAN - EN NIK H", completed: false, assignee: "EN NIK H" },
    { id: 67, text: "TIMELINE PJNGAN - TAS", completed: false, assignee: "TAS" },
    { id: 68, text: "BANK FITNAH - MEDIA TN ALAH", completed: false, assignee: "TN ALAH" },
    { id: 69, text: "KULIAH MTVSI 30 TAJUK - APS", completed: false, assignee: "APS" },
    { id: 70, text: "JADUAL KURSUS RESOLVIA - TSCKA", completed: false, assignee: "TSCKA" },
    { id: 71, text: "PGRM PRISMA, KAUNSELING - TSCKA", completed: false, assignee: "TSCKA" },
    { id: 72, text: "BAYARAN LBDI - ALP, TEAM OZZIE", completed: false, assignee: "ALP, TEAM OZZIE" },
    { id: 73, text: "GERAN2 KRJN - PERSATUAN2", completed: false, assignee: "PERSATUAN2" },
    { id: 74, text: "MAHA 2026 - PUATL", completed: false, assignee: "PUATL" },
    { id: 75, text: "KSAMA DGN MAIS - TAS", completed: false, assignee: "TAS" },
    { id: 76, text: "NAMA2 KE MEKAH UMRAH - TEAM ZM", completed: false, assignee: "TEAM ZM" },
    { id: 77, text: "RESPON KPD KRIANSAK - TN MAARUF", completed: false, assignee: "TN MAARUF" },
    { id: 78, text: "PENDIDIKAN ANAK2 ANGKAT DI BKK - EN ABE", completed: false, assignee: "EN ABE" },
    { id: 79, text: "MART S2 - ENH", completed: false, assignee: "ENH" },
    { id: 80, text: "CC - THAH DAN TEAM CC", completed: false, assignee: "THAH, TEAM CC" },
    { id: 81, text: "JV ALHADDAD - TEAM STOKIST", completed: false, assignee: "TEAM STOKIST" },
    { id: 82, text: "BUKU PEMULIHAN - EN ZAR APS", completed: false, assignee: "EN ZAR, APS" },
    { id: 83, text: "BUKU SDAAK UTK MUTAWWIF - APS", completed: false, assignee: "APS" },
    { id: 84, text: "CARTA SALASILAH R - APS", completed: false, assignee: "APS" },
    { id: 85, text: "TUISYEN IKUT PERINGKAT UMUR - APS", completed: false, assignee: "APS" },
    { id: 86, text: "TT MOTIVASI MINDA - APS", completed: false, assignee: "APS" },
    { id: 87, text: "JV DGN DATO HOOD - PENDIDIKAN", completed: false, assignee: "PENDIDIKAN" },
    { id: 88, text: "JV DR FAQAR - EKO, TAAAR", completed: false, assignee: "EKO, TAAAR" },
    { id: 89, text: "TERNAKAN AYAM BERSISTEM. - TAAAR", completed: false, assignee: "TAAAR" },
    { id: 90, text: "CAFE QAHWA - TSCKA", completed: false, assignee: "TSCKA" },
    { id: 91, text: "JV DATO UNDANG LUAK JOHOL - TFY", completed: false, assignee: "TFY" },
    { id: 92, text: "KILANG SABUN - 4MAT", completed: false, assignee: "4MAT" },
    { id: 93, text: "OEM WILDANI - TNH", completed: false, assignee: "TNH" },
    { id: 94, text: "OEM MI KUNING HADDAD - THAH", completed: false, assignee: "THAH" },
    { id: 95, text: "KOPI GANTANG OEM - TNH", completed: false, assignee: "TNH" },
    { id: 96, text: "PERSATUAN2 - PENEGRUSI PERS", completed: false, assignee: "PENEGRUSI PERS" },
    { id: 97, text: "PGRM MOTOR RMJ - 4MAT", completed: false, assignee: "4MAT" },
    { id: 98, text: "JV PKPS - MSMN.THAH", completed: false, assignee: "MSMN, THAH" },
    { id: 99, text: "KENDERAAN - GLS, BMW, DLL - TEAM ASET AMLA", completed: false, assignee: "TEAM ASET AMLA" },
    { id: 100, text: "IMPORT TEPUNG TURKIYE - TN QUADAMAH", completed: false, assignee: "TN QUADAMAH" },
    { id: 101, text: "RMH PENDIDIKAN PERINGIT MELAKA. HJ ARSAT. - APS PENDIDIKAN", completed: false, assignee: "APS, PENDIDIKAN" },
    { id: 102, text: "PEMULIHAN BARBAROSSA. JUMPA MARA - MSMN, TSCKA", completed: false, assignee: "MSMN, TSCKA" },
    { id: 103, text: "KEM MOTIVASI HUJUNG MINGGU - APS, PENDIDIKAN", completed: false, assignee: "APS, PENDIDIKAN" },
    { id: 104, text: "INFAQ HARI JUMAAT - PREMIS", completed: false, assignee: "PREMIS" },
    { id: 105, text: "TANAH UTK JEC GUNA UTK TERNAKAN - TAA", completed: false, assignee: "TAA" },
    { id: 106, text: "OTP M2 - TEAM M2", completed: false, assignee: "TEAM M2" },
    { id: 107, text: "Timeline - rujuk dgn TC utk panduan maklumat bg TMT. (En Fajrul)", completed: false, assignee: "EN FAJRUL" },
    { id: 108, text: "Pekan Baru - sediakan alternatif tanah baru sbg perancangan awal. (Pak Darwis)", completed: false, assignee: "PAK DARWIS" },
    { id: 109, text: "Pgrm kpd Team YB Emiryati - boleh buat pgrm yg mrk minta, tp kena bertegas.. sbb kita nak satukan semua parti politik atas nama Islam. (En Zarnukman)", completed: false, assignee: "EN ZARNUKMAN" },
    { id: 110, text: "Mart S2 - wibawakan premis ikut era skrg. (En Nik Hishamuddin)", completed: false, assignee: "EN NIK HISHAMUDDIN" },
    { id: 111, text: "Manifesto - siapkan segera. PRN PRU dah dekat. (Team Manifesto)", completed: false, assignee: "TEAM MANIFESTO" },
    { id: 112, text: "Status Shumardijaya.. (En Wan Alisabi)", completed: false, assignee: "EN WAN ALISABI" },
    { id: 113, text: "Berhubung dg MARA cari lg peluang sebanyaknya - EKA", completed: false, assignee: "EKA" },
    { id: 114, text: "Berhubung, cari maklumat ttg 5 nama yg buat report sekitar 2013 - Tn Hasnan", completed: false, assignee: "TN HASNAN" },
    { id: 115, text: "Tawaran Pjbt Agama Bentong.", completed: false, assignee: "" },
    { id: 116, text: "Tn Mashdiq Ketua Jbtn KDN Sel - bantuan utk buka akaun. (THAH)", completed: false, assignee: "THAH" },
    { id: 117, text: "NTW - yg ada 3T boleh bercakap. Atas nama manifesto. Latih bercakap atas dasar perjuangan, dan ikut kategori2 berkenaan. (TSCKA)", completed: false, assignee: "TSCKA" },
    { id: 118, text: "Tambah ikuti 3T sehingga 50 org. (TSCKA)", completed: false, assignee: "TSCKA" },
    { id: 119, text: "Buang perangai2 buruk kita yg membawa kpd OG. Tambah kefahaman dan keyakinan. (ZM)", completed: false, assignee: "ZM" },
    { id: 120, text: "24 Jun *Persidangan Inovasi Halal & Keterjaminan Makanan MADANI*. Cari info dan join. (TSCKA)", completed: false, assignee: "TSCKA" },
    { id: 121, text: "Syh Abdullah Yemeni. Import jus guava dan mangga. 200 karton. (MSMN, TNF)", completed: false, assignee: "MSMN, TNF" },
    { id: 122, text: "Jika ada individu yg difitnah, saman. (ZM)", completed: false, assignee: "ZM" },
    { id: 123, text: "Contact Jajan utk pgrm2 Maal Hijrah. (ZM)", completed: false, assignee: "ZM" },
    { id: 124, text: "Team kewangan - legal, guna kaedah IT, strategi, konsep beli sabun, perbincangan dan rujukan. (Team Kew)", completed: false, assignee: "TEAM KEW" },
    { id: 125, text: "JUMPA ADUN BERSATU TANYAKAN TTG PENDIRIAN BERSATU", completed: false, assignee: "" },
    { id: 126, text: "HAL PASSPORT DLL - MINTA RK URUSKAN. BERTEGAS DGN RK.", completed: false, assignee: "" },
    { id: 127, text: "SAMPAIKAN HURAIAN HADIS, MINDA, MADAH, SEJARAH, ISU SEMASA (KE DLM DIRI/ KELUARGA... DAN KE LUAR SPT MASALAH SOSIAL / POLITIK / ISU NEGARA..), DLL KAITKAN DGN PJ SEMASA. BINCANGKAN --> PROJEK EKONOMI, PENTERNAKAN, ENZA, IMPORT EXPORT, 25 SYARIKAT, (PENDIDIKAN?)", completed: false, assignee: "" },
    { id: 128, text: "ENGINEERING. BUAT TEAM. BINCANG PERANCANGAN. BAIKI DIRI, KEYAKINAN.", completed: false, assignee: "" },
    { id: 129, text: "Gabungkan hadis, minda, madah, isu semasa dll dlm memahamkan kwn2. - Team ZM", completed: false, assignee: "TEAM ZM" },
    { id: 130, text: "Buat mee kuning sendiri utk CFD - M2", completed: false, assignee: "M2" },
    { id: 131, text: "Pgrm dakwah melalui CFD - M2", completed: false, assignee: "M2" },
    { id: 132, text: "Tanah LBDI - cari jln penyelesaian apa yg TL blh tlg / dlm 2/3 hari - TFY, TAA, TNH", completed: false, assignee: "TFY, TAA, TNH" },
    { id: 133, text: "Sharp shooter berperanan - TAS, EKA", completed: false, assignee: "TAS, EKA" },
    { id: 134, text: "Perbincangan dg ust Din kena cukup maklumat hal nilaian harga bas - THAH", completed: false, assignee: "THAH" },
    { id: 135, text: "Kena ada perancangan kenderaan2 dibebaskan dari AMLA - FU", completed: false, assignee: "FU" },
    { id: 136, text: "Ziarah kaum cina: target orng yg faham dan mudah faham, buat program atas nama perniagaan. Tajuk : kekeluargaan (Islam Cara Hidup) - TSCKA, PKA", completed: false, assignee: "TSCKA, PKA" },
    { id: 137, text: "Tanya hubungan Komuniti Cina mrk dg Daud L - supaya tk terperangkap dg anti Islam - TSCKA, PKA", completed: false, assignee: "TSCKA, PKA" },
    { id: 138, text: "Jaga standard motel di Jitra - TSCKA", completed: false, assignee: "TSCKA" },
    { id: 139, text: "DR HISHAM DI SELATAN THAI DAN SEKOLAH BT PAHAT", completed: false, assignee: "" },
    { id: 140, text: "Jumpa Rifaah Jordan hal kenderaan", completed: false, assignee: "" },
    { id: 141, text: "Contact Dato Nasir ... Utk repair boat²", completed: false, assignee: "" },
    { id: 142, text: "Jual bas dan MHome. Dgn Ust Din Coaster. MH RM1j final. Cek prosedur daftar MH di M1. - Tn Hasnan", completed: false, assignee: "TN HASNAN" },
    { id: 143, text: "GLS jual dgn Din Coaster - Tn Amin", completed: false, assignee: "TN AMIN" },
    { id: 144, text: "Barbarossa - buatkan legal dokumen agihan share CM", completed: false, assignee: "" },
    { id: 145, text: "Persiapan di M3", completed: false, assignee: "" },
    { id: 146, text: "Persiapan di Filipina", completed: false, assignee: "" },
    { id: 147, text: "Maklumat kewangan", completed: false, assignee: "" },
    { id: 148, text: "Mendoakan D. Abd Rahman Undang Luak yg sdg sakit", completed: false, assignee: "" },
    { id: 149, text: "Buat mee kuning sendiri utk CFD - dah buat di Sentul R&D cuma jumlah yg sedikit. Mee kuning Jadikan projek induk di M2 dan jadikan mee kering /sanggul/telur", completed: false, assignee: "M2" },
    { id: 150, text: "Indahkan MH, poolish dan baiki seblm dijual", completed: false, assignee: "" },
    { id: 151, text: "Pastikan betul2 aset yg dh dpt serta pastikan team yg betul2 terlibat utk selesaikan", completed: false, assignee: "" },
    { id: 152, text: "Teratak Bonda - Jadikan tiga2 bangunan dr bwh ke atas sebgai tapak, buat betul2 jadikan contoh, bkn setinggan - PTB", completed: false, assignee: "PTB" },
    { id: 153, text: "Barbarossa, berkaitan Cikgu Mahdi selesaikan secara baik.", completed: false, assignee: "" },
    { id: 154, text: "JV DGN PKPS - UBAH DASAR DAN PENDEKATAN", completed: false, assignee: "" },
    { id: 155, text: "LAPORAN KEWANGAN HARIAN SETIAP DUA HARI", completed: false, assignee: "" },
    { id: 156, text: "NAK BUAT GORO DGN IZIN.. DGN TNF", completed: false, assignee: "TNF" },
    { id: 157, text: "JUAL ASET2 UTK SUMBER KEWANGAN", completed: false, assignee: "" },
    { id: 158, text: "WUJUDKAN TABUNG KEBAJIKAN. KEUTAMAAN. KAYUH DAHULU..", completed: false, assignee: "" },
    { id: 159, text: "GORO SAMPAIKAN ISI ZM, BUKAN STRATEGI.. SEDIH PD YG NAK, TP TAK FAHAM..", completed: false, assignee: "ZM" },
    { id: 160, text: "LANTIKAN KETUA BAGI NEGARA2 LUAR NEGARA DAN SELARASKAN MASA ZM", completed: false, assignee: "ZM" },
    { id: 161, text: "SUSUN MODAL INSAN DAN MODAL KEWANGAN", completed: false, assignee: "" },
    { id: 162, text: "KENA ADA SYARIKAT LUAR NEGARA UTK TERLIBAT TERHUBUNG DGN MQBH **BINCANGKAN", completed: false, assignee: "" },
    { id: 163, text: "BANCI ANAK² SEKOLAH. BUAT TUISYEN", completed: false, assignee: "" },
    { id: 164, text: "BOT - TERUSKN BINCG DGN DATO NASIR - THAH", completed: false, assignee: "THAH" },
    { id: 165, text: "UPDATE BMW ..?", completed: false, assignee: "" },
    { id: 166, text: "KARNIVAL USAHAWAN HALAL MADANI SELANGOR 2026 (B-HALAL 2026) ; SUSUN WAKIL YG BOLEH TRGKAN SITUASI KITA - ENH", completed: false, assignee: "ENH" },
    { id: 167, text: "PERBINCANGAN TTG PENDIDIKAN DI MESIR. ATAS NAMA SYARIKAT.. INTERVIEW MAK AYAH.. - APS, ALP, MQBH", completed: false, assignee: "APS, ALP, MQBH" },
    { id: 168, text: "PROJEK TERATAK BONDA BCH - PASTIKAN LOKASI, WIBAWA.", completed: false, assignee: "" },
    { id: 169, text: "SELESAIKAN HAL CM DI BARBAROSSA SECARA BAIK.", completed: false, assignee: "" },
    { id: 170, text: "JUMPA WAN JAMBI", completed: false, assignee: "" },
    { id: 171, text: "PGRM MAK AYAH ANAK2 TVET JASIN", completed: false, assignee: "" },
    { id: 172, text: "SELESAIKAN LDBI", completed: false, assignee: "" },
    { id: 173, text: "Manfaatkan aplikasi2 yg telah dibangunkan oleh Team IT.", completed: false, assignee: "" },
    { id: 174, text: "Tanah RnD Enza - ambil kunci pada 1 Julai.", completed: false, assignee: "" },
    { id: 175, text: "Pjbt ENZA dan premis utk rawatan PD.", completed: false, assignee: "" },
    { id: 176, text: "Urusan permit MHome. Buka kasut dlm MH.", completed: false, assignee: "" },
    { id: 177, text: "Urusan Pulau Tioman. (TA, Wan Siwi, TQ). Terhubung dgn SB, Tok 4, Abg Mi. Apa tujuan..? Staf Gardenia terlibat..?", completed: false, assignee: "TA, WAN SIWI, TQ" },
    { id: 178, text: "Urusan kehakiman Sabah. Rayuan semakan fatwa GISBH kpd Mufti JAS.", completed: false, assignee: "" },
    { id: 179, text: "Pjbt MOBILE.. - Maqlubah, peranan ALP PZ.. sistemkan secara maya", completed: false, assignee: "ALP, PZ" },
    { id: 180, text: "Berunding hotel & cafe di Sarajevo. Tenok respon T smd jual atau dpt teruskan.", completed: false, assignee: "" },
    { id: 181, text: "Kemaskan sistem pendidikan anak2", completed: false, assignee: "" },
    { id: 182, text: "Yang dh ckup umur semua kena mengundi", completed: false, assignee: "" },
    { id: 183, text: "Pendidikan kena cepat dikemaskan. Menjiwai perjuangan ini. GM dgn ibu bapa TVET. Kursus utk ibu bapa", completed: false, assignee: "" },
    { id: 184, text: "OSSEM - kembangkan cthnya buat di Putrajaya, Bangi - di tempat2 yg ramai. Ini ikatan x rasmi", completed: false, assignee: "" },
    { id: 185, text: "Selesaikan urusan permit, cukai MH, list ini akan di masukan ke dalam company, dengan di asign companynya dengan drop down list", completed: false, assignee: "" },
  ];

  const addTask = async () => {
    if (newTask.trim()) {
      const assigneeMatch = newTask.match(/- (.+)$/);
      const assignee = assigneeMatch ? assigneeMatch[1].trim() : "";
      const textWithoutAssignee = assigneeMatch ? newTask.replace(/- .+$/, "").trim() : newTask.trim();
      
      try {
        const token = localStorage.getItem('token');
        const data = await todoListAPI.createTodoItem(token, {
          text: textWithoutAssignee + (assignee ? ` - ${assignee}` : ""),
          assignee: assignee,
          priority: 'medium',
          companyId: selectedCompanyId ? parseInt(selectedCompanyId) : null
        });
        
        if (data.success) {
          setTasks([...tasks, data.data]);
          setNewTask("");
          setSelectedCompanyId("");
        }
      } catch (err) {
        console.error('Error adding task:', err);
        // Fallback to local state if API fails
        const newTaskObj = {
          id: Date.now(),
          text: textWithoutAssignee + (assignee ? ` - ${assignee}` : ""),
          completed: false,
          assignee: assignee,
          companyId: selectedCompanyId ? parseInt(selectedCompanyId) : null
        };
        setTasks([...tasks, newTaskObj]);
        setNewTask("");
        setSelectedCompanyId("");
      }
    }
  };

  const toggleTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const data = await todoListAPI.toggleTodoItem(id, token);
      
      if (data.success) {
        setTasks(tasks.map(task => 
          task.id === id ? data.data : task
        ));
      }
    } catch (err) {
      console.error('Error toggling task:', err);
      // Fallback to local state if API fails
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await todoListAPI.deleteTodoItem(id, token);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      // Fallback to local state if API fails
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const updateTaskCompany = async (taskId, companyId) => {
    try {
      const token = localStorage.getItem('token');
      const data = await todoListAPI.updateTodoItem(taskId, {
        companyId: companyId ? parseInt(companyId) : null
      }, token);
      
      if (data.success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, companyId: companyId ? parseInt(companyId) : null, company: data.data.company } : task
        ));
      }
    } catch (err) {
      console.error('Error updating task company:', err);
      // Fallback to local state if API fails
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, companyId: companyId ? parseInt(companyId) : null } : task
      ));
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);
    
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = 
      !filterCompanyId ||
      (task.companyId === parseInt(filterCompanyId));
    
    return matchesFilter && matchesSearch && matchesCompany;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };

  const uniqueAssignees = [...new Set(tasks.map(t => t.assignee).filter(a => a))].sort();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#F2F5F4",
        fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
        maxWidth: "480px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
      }}>
        <div style={{ fontSize: "48px" }}>⏳</div>
        <div style={{ fontSize: "16px", color: "#0A3D2E" }}>Memuat tugas...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F2F5F4",
      fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
      maxWidth: "480px",
      margin: "0 auto",
      paddingBottom: "80px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0A3D2E 0%, #0D5C42 100%)",
        padding: "52px 20px 28px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }} />
        
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}>
          <div style={{
            color: "white",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}>
            Senarai Tugas
          </div>
          <div
            onClick={() => navigate("/home")}
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✕
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex",
          gap: "10px",
        }}>
          {[
            { label: "Semua", value: stats.total, color: "#1DB87A" },
            { label: "Selesai", value: stats.completed, color: "#0D7A5F" },
            { label: "Belum", value: stats.pending, color: "#FFA726" },
          ].map((stat) => (
            <div key={stat.label} style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "12px",
              border: "1px solid " + stat.color + "33",
            }}>
              <div style={{
                color: stat.color,
                fontSize: "22px",
                fontWeight: 700,
                lineHeight: 1,
              }}>{stat.value}</div>
              <div style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "11px",
                marginTop: "4px",
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 16px" }}>

        {/* Search */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "16px",
          border: "1px solid #E4EDEA",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span style={{ fontSize: "18px", opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            placeholder="Cari tugas atau orang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              background: "transparent",
            }}
          />
        </div>

        {/* Filter tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}>
          {[
            { label: "Semua", value: "all" },
            { label: "Selesai", value: "completed" },
            { label: "Belum", value: "pending" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: filter === f.value ? "#0A3D2E" : "white",
                color: filter === f.value ? "white" : "#0A3D2E",
                border: "1px solid #E4EDEA",
                whiteSpace: "nowrap",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Company filter */}
        {companies.length > 0 && (
          <div style={{
            marginBottom: "16px",
          }}>
            <select
              value={filterCompanyId}
              onChange={(e) => setFilterCompanyId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #E4EDEA",
                fontSize: "13px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <option value="">Semua Syarikat</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add task */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #E4EDEA",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}>
          <input
            type="text"
            placeholder="Tambah tugas baru... (contoh: Tugas - Nama)"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "14px",
              background: "transparent",
              padding: "8px 0",
            }}
          />
          
          {/* Company dropdown */}
          {companies.length > 0 && (
            <div style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E4EDEA",
                  fontSize: "13px",
                  backgroundColor: "#F9F9F9",
                  cursor: "pointer",
                }}
              >
                <option value="">Pilih Syarikat (Pilihan)</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addTask}
                style={{
                  backgroundColor: "#0A3D2E",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Tambah
              </button>
            </div>
          )}
          
          {companies.length === 0 && (
            <button
              onClick={addTask}
              style={{
                backgroundColor: "#0A3D2E",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                alignSelf: "flex-end",
              }}
            >
              Tambah
            </button>
          )}
        </div>

        {/* Task list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: task.completed ? "#F5F5F5" : "white",
                borderRadius: "12px",
                padding: "14px",
                border: "1px solid #E4EDEA",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: `2px solid ${task.completed ? "#0D7A5F" : "#D0D9D6"}`,
                  backgroundColor: task.completed ? "#0D7A5F" : "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {task.completed && (
                  <span style={{ color: "white", fontSize: "14px", lineHeight: 1 }}>✓</span>
                )}
              </button>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: task.completed ? "#9AA8A3" : "#0A1F17",
                  lineHeight: "1.4",
                  textDecoration: task.completed ? "line-through" : "none",
                  marginBottom: task.assignee ? "6px" : "0",
                }}>
                  {task.text}
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  {task.assignee && (
                    <div style={{
                      display: "inline-block",
                      backgroundColor: "#EBF7F3",
                      color: "#0D7A5F",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "4px",
                    }}>
                      {task.assignee}
                    </div>
                  )}
                  <select
                    value={task.companyId || ""}
                    onChange={(e) => updateTaskCompany(task.id, e.target.value)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      border: "1px solid #E4EDEA",
                      fontSize: "11px",
                      backgroundColor: "white",
                      cursor: "pointer",
                      maxWidth: "150px",
                    }}
                  >
                    <option value="">Tiada Syarikat</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#E57373",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "4px",
                  lineHeight: 1,
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#9AA8A3",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📝</div>
            <div style={{ fontSize: "14px" }}>Tiada tugas dijumpai</div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "white",
        borderTop: "1px solid #E4EDEA",
        display: "flex",
        padding: "8px 0 calc(8px + env(safe-area-inset-bottom))",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
        zIndex: 100,
      }}>
        {[
          { icon: "🏠", label: "Utama", route: "/home" },
          { icon: "✓", label: "Tugas", route: "/todo-list", active: true },
          { icon: "⚙️", label: "Tetapan", route: "/home" },
        ].map((nav) => (
          <div
            key={nav.label}
            onClick={() => navigate(nav.route)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "4px 0",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span style={{ fontSize: "20px", lineHeight: 1 }}>{nav.icon}</span>
            <span style={{
              fontSize: "10px",
              fontWeight: nav.active ? 700 : 500,
              color: nav.active ? "#0A3D2E" : "#A0B5AE",
              letterSpacing: "0.2px",
            }}>{nav.label}</span>
            {nav.active && (
              <div style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#1DB87A",
                marginTop: "1px",
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
