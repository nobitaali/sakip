# SAKIP - Sistem Akuntabilitas Kinerja Instansi Pemerintah
## Versi Terpadu & Terintegrasi

![SAKIP Logo](./docs/images/sakip-logo.png)

### 🏛️ Deskripsi Aplikasi

SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) adalah aplikasi web modern yang dirancang untuk membantu instansi pemerintah dalam mengelola, memantau, dan mengevaluasi kinerja secara terpadu dan terintegrasi. Aplikasi ini dibangun menggunakan teknologi terkini dengan fokus pada kemudahan penggunaan, integrasi sistem, dan otomatisasi proses.

### ✨ Fitur Utama

#### 📊 Dashboard Executive
- Ranking OPD berdasarkan nilai SAKIP otomatis
- Progress kinerja real-time dengan grafik trend
- Progress anggaran dan analisis efisiensi
- Peta zoning integrasi dengan visualisasi geografis
- Pohon kinerja interaktif
- Alert & reminder sistem otomatis

#### 📋 Modul Perencanaan
- Input manual hierarki perencanaan (Renstra → Tujuan → Sasaran → Program → Kegiatan)
- Manajemen indikator kinerja dengan rumus capaian
- Input dan tracking Rencana Aksi (Renaksi)
- Upload dan parsing dokumen perencanaan
- Integrasi otomatis dengan SIPD
- Template dan format standar

#### 📈 Modul Pengukuran Kinerja
- Input capaian kinerja bulanan/triwulanan
- Auto-populate dari data Renaksi
- Rumus otomatis perhitungan capaian
- Integrasi dengan BKN/BKD dan sistem sektor
- Tracking trend dan analisis perubahan
- Dashboard progress per OPD

#### 💰 Modul Anggaran
- Input pagu dan realisasi anggaran multi-level
- Perhitungan otomatis persentase serapan
- Integrasi penuh dengan SIPD Keuangan
- Analisis efisiensi dan efektivitas belanja
- Monitoring real-time serapan anggaran

#### 📑 Modul Pelaporan
- Generator LKJIP otomatis sesuai PermenPANRB
- Manajemen dokumen dengan version control
- Custom report builder
- Export ke berbagai format (PDF, Word, Excel)
- Template laporan standar

#### 🔍 Modul Evaluasi
- Evaluasi internal digital dengan LKE online
- Evaluasi eksternal (SAKIP Nasional)
- Traffic light system untuk status kinerja
- AI-powered rekomendasi perbaikan
- Tracking tindak lanjut rekomendasi

#### 🔗 Modul Integrasi & API
- Integrasi dengan SIPD, BKN/BKD, dan sistem sektor
- RESTful API untuk integrasi pihak ketiga
- Real-time data synchronization
- API monitoring dan logging
- Webhook support

### 🛠️ Teknologi yang Digunakan

#### Frontend
- **React 18** - Library UI modern
- **Vite** - Build tool yang cepat
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Data fetching dan caching
- **Recharts** - Visualisasi data dan grafik
- **Lucide React** - Icon library
- **React Hook Form** - Form management

#### Backend (Rekomendasi)
- **Node.js** dengan **Express.js** atau **Fastify**
- **PostgreSQL** - Database utama
- **Redis** - Caching dan session storage
- **JWT** - Authentication
- **Prisma** atau **TypeORM** - ORM
- **Bull** - Job queue untuk background tasks
- **Socket.io** - Real-time communication

### 🚀 Instalasi dan Setup

#### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

#### Langkah Instalasi

1. **Clone repository**
```bash
git clone https://github.com/your-org/sakip-app.git
cd sakip-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi Anda
```

4. **Jalankan development server**
```bash
npm run dev
```

5. **Akses aplikasi**
```
http://localhost:3000
```

### 👥 Sistem Manajemen User & Akses

#### Role-Based Access Control (RBAC)

1. **Super Admin / Admin Pemda**
   - Full system control
   - User management
   - System configuration
   - Database management
   - Audit log access

2. **Admin OPD**
   - Input data perencanaan dan Renaksi
   - Pengukuran kinerja
   - Upload dokumen
   - Generate laporan OPD
   - View dashboard OPD

3. **Evaluator**
   - Modul evaluasi digital
   - LKE online
   - Input nilai & rekomendasi
   - View all OPD data (read-only)
   - Generate laporan evaluasi

4. **Viewer Publik**
   - Dashboard publik
   - Laporan SAKIP published
   - Statistik kinerja umum

### 🔐 Demo Accounts

Untuk testing aplikasi, gunakan akun demo berikut:

| Role | Username | Password | Akses |
|------|----------|----------|-------|
| Super Admin | `superadmin` | `password` | Full Access |
| Admin OPD | `admin` | `password` | OPD Management |
| Evaluator | `evaluator` | `password` | Evaluation Module |
| Viewer | `viewer` | `password` | Dashboard Only |

### 📁 Struktur Proyek

```
sakip-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layout/        # Layout components
│   │   └── UI/            # UI components
│   ├── pages/             # Page components
│   │   ├── Auth/          # Authentication pages
│   │   ├── Dashboard/     # Dashboard pages
│   │   ├��─ Planning/      # Planning module
│   │   ├── Performance/   # Performance module
│   │   ├── Budget/        # Budget module
│   │   ├── Reporting/     # Reporting module
│   │   ├── Evaluation/    # Evaluation module
│   │   ├── Integration/   # Integration module
│   │   └── Admin/         # Admin pages
│   ├── stores/            # State management
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   └── services/          # API services
├── dummy-data/            # Sample data untuk development
├── docs/                  # Dokumentasi
└── tests/                 # Test files
```

### 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### 🚀 Deployment

#### Production Build
```bash
npm run build
```

#### Docker Deployment
```bash
# Build image
docker build -t sakip-app .

# Run container
docker run -p 3000:3000 sakip-app
```

### 📊 Data Dummy

Aplikasi dilengkapi dengan data dummy lengkap untuk development dan testing:

- **OPD Data** (`dummy-data/opd-data.json`) - Data organisasi perangkat daerah
- **Performance Data** (`dummy-data/performance-data.json`) - Data kinerja dan capaian
- **Budget Data** (`dummy-data/budget-data.json`) - Data anggaran dan realisasi
- **Users Data** (`dummy-data/users-data.json`) - Data pengguna dan role
- **Evaluation Data** (`dummy-data/evaluation-data.json`) - Data evaluasi dan LKE

### 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

### 📞 Support

Untuk dukungan teknis dan pertanyaan:
- Email: support@sakip-app.com
- Documentation: [docs.sakip-app.com](https://docs.sakip-app.com)
- Issues: [GitHub Issues](https://github.com/your-org/sakip-app/issues)

### 🔄 Changelog

Lihat [CHANGELOG.md](./CHANGELOG.md) untuk riwayat perubahan versi.

---

**SAKIP - Sistem Akuntabilitas Kinerja Instansi Pemerintah**  
*Versi Terpadu & Terintegrasi*

© 2024 - Dikembangkan untuk mendukung transparansi dan akuntabilitas pemerintahan yang baik.