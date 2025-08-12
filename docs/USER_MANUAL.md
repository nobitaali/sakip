# SAKIP - Manual Pengguna
## Sistem Akuntabilitas Kinerja Instansi Pemerintah

### 📋 Daftar Isi

1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Cara Login](#cara-login)
3. [Dashboard Utama](#dashboard-utama)
4. [Modul Perencanaan](#modul-perencanaan)
5. [Modul Pengukuran Kinerja](#modul-pengukuran-kinerja)
6. [Modul Anggaran](#modul-anggaran)
7. [Modul Pelaporan](#modul-pelaporan)
8. [Modul Evaluasi](#modul-evaluasi)
9. [Manajemen User](#manajemen-user)
10. [Tips dan Troubleshooting](#tips-dan-troubleshooting)

---

## Pengenalan Sistem

### Apa itu SAKIP?

SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) adalah aplikasi web yang dirancang untuk membantu instansi pemerintah dalam:

- **Perencanaan Kinerja**: Menyusun rencana strategis dan rencana aksi
- **Pengukuran Kinerja**: Memantau capaian indikator kinerja
- **Pelaporan**: Menghasilkan laporan kinerja otomatis
- **Evaluasi**: Melakukan evaluasi internal dan eksternal
- **Integrasi**: Menghubungkan dengan sistem lain (SIPD, BKN, dll)

### Fitur Utama

✅ **Dashboard Real-time** - Monitoring kinerja secara langsung  
✅ **Auto-Generate LKJIP** - Laporan otomatis sesuai standar  
✅ **Integrasi SIPD** - Sinkronisasi data anggaran  
✅ **Multi-Role Access** - Akses sesuai peran pengguna  
✅ **Mobile Responsive** - Dapat diakses dari berbagai perangkat  

---

## Cara Login

### Langkah-langkah Login

1. **Buka aplikasi** di browser dengan alamat yang diberikan admin
2. **Masukkan Username** dan **Password** yang telah diberikan
3. **Klik tombol "Masuk"**

![Login Screen](./images/login-screen.png)

### Akun Demo untuk Testing

| Role | Username | Password | Akses |
|------|----------|----------|-------|
| Super Admin | `superadmin` | `password` | Semua modul |
| Admin OPD | `admin` | `password` | Modul OPD |
| Evaluator | `evaluator` | `password` | Modul Evaluasi |
| Viewer | `viewer` | `password` | Dashboard saja |

### Lupa Password?

Hubungi administrator sistem untuk reset password.

---

## Dashboard Utama

Dashboard adalah halaman pertama yang muncul setelah login. Berisi ringkasan kinerja dan informasi penting.

### Komponen Dashboard

#### 1. **Kartu Statistik**
- Rata-rata Nilai SAKIP
- Capaian Kinerja (%)
- Serapan Anggaran (%)
- Jumlah Indikator Bermasalah

#### 2. **Ranking OPD**
Menampilkan peringkat OPD berdasarkan nilai SAKIP:
- 🥇 Peringkat 1-3 dengan ikon khusus
- Status: Sangat Baik, Baik, Cukup, Kurang
- Perubahan nilai dari periode sebelumnya

#### 3. **Grafik Kinerja**
- **Trend View**: Grafik garis menampilkan trend bulanan
- **Comparison View**: Grafik batang perbandingan antar OPD
- Indikator warna: 🟢 Normal, 🟡 Perhatian, 🔴 Kritis

#### 4. **Alert & Reminder**
- ⚠️ **Kritis**: Deadline mendekat, capaian rendah
- ⚡ **Perhatian**: Perlu tindakan segera
- ℹ️ **Info**: Update sistem, sinkronisasi data
- ✅ **Sukses**: Evaluasi selesai, target tercapai

#### 5. **Pohon Kinerja Interaktif**
- Hierarki dari RPJMD → Tujuan → Sasaran → Program → Kegiatan
- Klik untuk expand/collapse
- Progress bar untuk setiap level
- Export ke PDF/Excel

### Tips Menggunakan Dashboard

💡 **Refresh Data**: Klik tombol refresh untuk update data terbaru  
💡 **Filter Periode**: Gunakan dropdown untuk melihat data periode tertentu  
💡 **Export Dashboard**: Klik tombol download untuk export ke PDF  

---

## Modul Perencanaan

Modul untuk mengelola dokumen perencanaan dan rencana aksi.

### Tab Rencana Strategis (Renstra)

#### Membuat Renstra Baru

1. **Klik "Tambah Rencana"** di pojok kanan atas
2. **Isi informasi dasar**:
   - Periode (contoh: 2021-2026)
   - Visi organisasi
   - Misi organisasi (bisa lebih dari satu)

3. **Tambah Tujuan**:
   - Klik "Tambah Tujuan Baru"
   - Isi nama dan deskripsi tujuan
   - Tentukan indikator tujuan

4. **Tambah Sasaran** untuk setiap tujuan:
   - Klik pada tujuan yang sudah dibuat
   - Tambah sasaran dengan indikator yang terukur
   - Pastikan indikator SMART (Specific, Measurable, Achievable, Relevant, Time-bound)

5. **Tambah Program dan Kegiatan**:
   - Setiap sasaran memiliki program
   - Setiap program memiliki kegiatan
   - Tentukan target dan timeline

#### Mengedit Renstra

1. **Pilih item** yang ingin diedit dari pohon hierarki
2. **Klik tombol "Edit"**
3. **Ubah informasi** yang diperlukan
4. **Simpan perubahan**

### Tab Rencana Aksi (Renaksi)

#### Membuat Renaksi

1. **Pilih tahun** yang akan dibuat renaksi
2. **Import dari Renstra** atau buat manual
3. **Atur timeline** kegiatan:
   - Tentukan bulan/triwulan pelaksanaan
   - Set target per periode
   - Assign PIC (Person In Charge)

4. **Upload dokumen** pendukung jika ada

#### Monitoring Renaksi

- **Status Kegiatan**:
  - 🟢 **Selesai**: Target tercapai 100%
  - 🟡 **Berjalan**: Sedang dalam pelaksanaan
  - 🔴 **Belum Mulai**: Belum ada progress

### Tab Dokumen

#### Upload Dokumen

1. **Klik "Upload Dokumen"**
2. **Pilih file** (PDF, Word, Excel)
3. **Pilih kategori**:
   - RPJMD
   - RKPD
   - Perjanjian Kinerja
   - IKU (Indikator Kinerja Utama)
   - Renaksi

4. **Tambah deskripsi** dan **simpan**

#### Mengelola Dokumen

- **Download**: Klik ikon download
- **Edit**: Update informasi dokumen
- **Delete**: Hapus dokumen (hanya admin)
- **Version Control**: Sistem otomatis menyimpan versi

---

## Modul Pengukuran Kinerja

Modul untuk input dan monitoring capaian kinerja.

### Input Capaian Kinerja

#### Input Manual

1. **Pilih periode** (bulan/triwulan)
2. **Pilih indikator** dari dropdown
3. **Masukkan nilai capaian**
4. **Tambah keterangan**:
   - Faktor pendukung
   - Faktor penghambat
   - Rencana tindak lanjut

5. **Upload dokumen** pendukung (opsional)
6. **Klik "Simpan Capaian"**

#### Bulk Import Excel

1. **Download template** Excel
2. **Isi data** sesuai format template
3. **Upload file** Excel
4. **Review data** yang akan diimport
5. **Konfirmasi import**

### Monitoring Kinerja

#### Dashboard Kinerja

- **Traffic Light System**:
  - 🟢 **Hijau**: Capaian ≥ 90% target
  - 🟡 **Kuning**: Capaian 70-89% target
  - 🔴 **Merah**: Capaian < 70% target

#### Analisis Trend

- **Grafik Trend**: Melihat perkembangan capaian
- **Perbandingan**: Bandingkan dengan periode sebelumnya
- **Proyeksi**: Prediksi capaian akhir tahun

### Integrasi Data Eksternal

#### Status Integrasi

- **SIPD**: 🟢 Terhubung - Data anggaran
- **BKN**: 🟢 Terhubung - Data kepegawaian
- **BKD**: 🟢 Terhubung - Data lokal
- **Sistem Sektor**: 🟡 Parsial - Data spesifik

#### Sinkronisasi Manual

1. **Klik "Sync Data"** pada sistem yang diinginkan
2. **Pilih periode** sinkronisasi
3. **Tunggu proses** selesai
4. **Review hasil** sinkronisasi

---

## Modul Anggaran

Modul untuk mengelola pagu dan realisasi anggaran.

### Overview Anggaran

#### Kartu Ringkasan

- **Total Pagu**: Jumlah anggaran yang dialokasikan
- **Realisasi**: Jumlah yang sudah terserap
- **Persentase Serapan**: Otomatis terhitung
- **Skor Efisiensi**: Berdasarkan analisis sistem

### Input Data Anggaran

#### Input Pagu Anggaran

1. **Pilih OPD** dan **tahun anggaran**
2. **Pilih kategori belanja**:
   - Belanja Pegawai
   - Belanja Barang dan Jasa
   - Belanja Modal
   - Belanja Bantuan

3. **Input jumlah** pagu per program/kegiatan
4. **Simpan data**

#### Input Realisasi

1. **Pilih periode** (bulanan)
2. **Input realisasi** per kategori
3. **Sistem otomatis** menghitung:
   - Persentase serapan
   - Serapan kumulatif
   - Proyeksi akhir tahun

### Integrasi SIPD

#### Sinkronisasi Otomatis

- **Jadwal**: Setiap hari pukul 02:00 WIB
- **Data yang disinkronkan**:
  - Pagu anggaran terbaru
  - Realisasi bulanan
  - Perubahan anggaran (jika ada)

#### Sinkronisasi Manual

1. **Klik "Sync SIPD"**
2. **Pilih jenis sinkronisasi**:
   - Full Sync: Semua data
   - Incremental: Data terbaru saja
3. **Monitor progress** di log sinkronisasi

### Analisis Anggaran

#### Analisis Efisiensi

- **Efisiensi per Kategori**: Perbandingan realisasi vs target
- **Efektivitas**: Hubungan anggaran dengan capaian kinerja
- **Rekomendasi**: Saran perbaikan dari sistem

#### Laporan Anggaran

- **Laporan Bulanan**: Progress serapan
- **Laporan Triwulanan**: Analisis mendalam
- **Laporan Tahunan**: Evaluasi keseluruhan

---

## Modul Pelaporan

Modul untuk menghasilkan laporan otomatis dan mengelola dokumen.

### LKJIP Generator

#### Membuat LKJIP Otomatis

1. **Klik "Generate LKJIP Baru"**
2. **Pilih periode** pelaporan
3. **Pilih template**:
   - Template Standar PermenPANRB
   - Template Custom (jika ada)

4. **Review kelengkapan data**:
   - ✅ Bab I: Pendahuluan
   - ✅ Bab II: Perencanaan Kinerja
   - ⚠️ Bab III: Akuntabilitas Kinerja (90%)
   - ✅ Bab IV: Penutup

5. **Generate PDF** atau **Word**

#### Edit LKJIP

1. **Klik "Edit"** pada LKJIP yang sudah dibuat
2. **Pilih bab** yang ingin diedit
3. **Ubah konten** sesuai kebutuhan
4. **Simpan perubahan**
5. **Generate ulang** jika diperlukan

### Manajemen Dokumen

#### Upload Dokumen

1. **Klik "Upload Dokumen"**
2. **Pilih file** dan **kategori**:
   - LKJIP
   - Laporan Triwulanan
   - Evaluasi Internal
   - Dokumen Pendukung

3. **Isi metadata**:
   - Judul dokumen
   - Deskripsi
   - Tag/kategori
   - Status (Draft/Final)

#### Version Control

- **Otomatis**: Sistem menyimpan versi setiap perubahan
- **Manual**: Buat versi baru dengan klik "Save as New Version"
- **History**: Lihat riwayat perubahan dokumen

### Custom Report Builder

#### Membuat Laporan Custom

1. **Pilih data source**:
   - ☑️ Data Kinerja
   - ☑️ Data Anggaran
   - ☑️ Data Evaluasi

2. **Pilih periode** dan **filter**
3. **Pilih format output**:
   - 📄 PDF
   - 📊 Excel
   - 📝 Word

4. **Preview** sebelum generate
5. **Download** hasil laporan

---

## Modul Evaluasi

Modul untuk evaluasi internal dan eksternal SAKIP.

### Evaluasi Internal

#### Memulai Evaluasi Baru

1. **Klik "Mulai Evaluasi"**
2. **Pilih OPD** yang akan dievaluasi
3. **Pilih evaluator** dan **tim evaluasi**
4. **Set jadwal** evaluasi

#### Mengisi LKE (Lembar Kerja Evaluasi)

1. **Buka LKE Digital**
2. **Isi setiap komponen**:

   **A. Perencanaan Kinerja (Bobot 20%)**
   - A.1: Rencana strategis disusun dengan baik
   - A.2: Rencana kerja tahunan selaras dengan renstra
   - Berikan **skor 1-5** dan **justifikasi**

   **B. Pengukuran Kinerja (Bobot 25%)**
   - B.1: Sistem pengukuran kinerja berfungsi
   - B.2: Data kinerja akurat
   - Tambahkan **temuan** dan **bukti**

   **C. Pelaporan Kinerja (Bobot 25%)**
   - C.1: LKJIP disusun tepat waktu
   - C.2: Analisis capaian mendalam
   - Upload **dokumen pendukung**

   **D. Evaluasi Internal (Bobot 15%)**
   - D.1: Evaluasi dilakukan berkala
   - Dokumentasikan **proses evaluasi**

   **E. Perbaikan Kinerja (Bobot 15%)**
   - E.1: Tindak lanjut rekomendasi
   - Track **implementasi perbaikan**

3. **Hitung skor otomatis**
4. **Submit evaluasi**

#### Review dan Finalisasi

1. **Review hasil** evaluasi
2. **Diskusi dengan tim** evaluasi
3. **Revisi jika perlu**
4. **Finalisasi** dan **approve**

### Evaluasi Eksternal

#### Data Evaluasi KemenPANRB

- **Skor Nasional**: Otomatis tersinkronisasi
- **Komponen Penilaian**:
  - Akuntabilitas Kinerja
  - Akuntabilitas Keuangan
  - Akuntabilitas Manfaat

#### Tindak Lanjut Rekomendasi

1. **Review rekomendasi** dari evaluator eksternal
2. **Buat rencana** tindak lanjut
3. **Assign PIC** untuk setiap rekomendasi
4. **Set timeline** implementasi
5. **Monitor progress** secara berkala

### Rekomendasi AI

Sistem memberikan rekomendasi otomatis berdasarkan:
- **Analisis data** kinerja
- **Benchmarking** dengan OPD lain
- **Best practices** yang tersedia

---

## Manajemen User

*Khusus untuk Super Admin dan Admin Pemda*

### Mengelola User

#### Tambah User Baru

1. **Klik "Tambah User"**
2. **Isi informasi**:
   - Username (unik)
   - Nama lengkap
   - Email
   - Password (minimal 8 karakter)
   - Role/peran
   - OPD (jika Admin OPD)

3. **Set permissions** sesuai role
4. **Aktivasi akun**

#### Edit User

1. **Pilih user** dari daftar
2. **Klik "Edit"**
3. **Ubah informasi** yang diperlukan
4. **Update permissions** jika perlu
5. **Simpan perubahan**

### Role dan Permissions

#### Super Admin
- ✅ Semua akses sistem
- ✅ Manajemen user
- ✅ Konfigurasi sistem
- ✅ Backup dan restore

#### Admin OPD
- ✅ Input data perencanaan
- ✅ Input capaian kinerja
- ✅ Upload dokumen
- ✅ Generate laporan OPD
- ❌ Data OPD lain

#### Evaluator
- ✅ Modul evaluasi
- ✅ LKE digital
- ✅ View semua data OPD (read-only)
- ✅ Generate laporan evaluasi
- ❌ Input data operasional

#### Viewer
- ✅ Dashboard publik
- ✅ Laporan yang dipublikasi
- ❌ Input/edit data
- ❌ Akses data sensitif

### Activity Log

Monitor aktivitas user:
- **Login/logout**
- **Perubahan data**
- **Upload dokumen**
- **Generate laporan**
- **Akses halaman**

---

## Tips dan Troubleshooting

### Tips Penggunaan

#### 💡 **Produktivitas**
- Gunakan **keyboard shortcuts**: Ctrl+S untuk simpan cepat
- **Bookmark** halaman yang sering diakses
- Manfaatkan **bulk import** untuk data banyak
- Set **reminder** untuk deadline penting

#### 💡 **Data Quality**
- **Validasi data** sebelum input
- Gunakan **format standar** untuk konsistensi
- **Backup data** secara berkala
- **Review** data sebelum submit

#### 💡 **Keamanan**
- **Logout** setelah selesai menggunakan
- Jangan **share password** dengan orang lain
- **Update password** secara berkala
- Laporkan **aktivitas mencurigakan**

### Troubleshooting Umum

#### 🔧 **Login Bermasalah**

**Problem**: Tidak bisa login
**Solusi**:
1. Pastikan username/password benar
2. Clear browser cache dan cookies
3. Coba browser lain
4. Hubungi admin jika masih bermasalah

#### 🔧 **Data Tidak Muncul**

**Problem**: Data kosong atau tidak update
**Solusi**:
1. Refresh halaman (F5)
2. Check koneksi internet
3. Logout dan login kembali
4. Clear browser cache

#### 🔧 **Upload File Gagal**

**Problem**: File tidak bisa diupload
**Solusi**:
1. Check ukuran file (max 10MB)
2. Pastikan format file didukung
3. Rename file jika ada karakter khusus
4. Coba compress file jika terlalu besar

#### 🔧 **Laporan Tidak Generate**

**Problem**: LKJIP atau laporan tidak terbuat
**Solusi**:
1. Pastikan data lengkap
2. Check kelengkapan indikator
3. Tunggu beberapa menit (proses background)
4. Coba generate ulang

#### 🔧 **Sinkronisasi SIPD Gagal**

**Problem**: Data SIPD tidak tersinkronisasi
**Solusi**:
1. Check status koneksi SIPD
2. Pastikan API key masih valid
3. Coba sync manual
4. Hubungi admin sistem

### Kontak Support

#### 📞 **Bantuan Teknis**
- **Email**: support@sakip-app.com
- **Phone**: 021-1234-5678
- **WhatsApp**: 0812-3456-7890

#### 📚 **Dokumentasi**
- **User Manual**: [docs.sakip-app.com/manual](https://docs.sakip-app.com/manual)
- **Video Tutorial**: [youtube.com/sakip-tutorial](https://youtube.com/sakip-tutorial)
- **FAQ**: [docs.sakip-app.com/faq](https://docs.sakip-app.com/faq)

#### 🎓 **Training**
- **Online Training**: Setiap Jumat pukul 14:00 WIB
- **On-site Training**: Hubungi tim support
- **Webinar**: Notifikasi via email

---

### Changelog Manual

#### Versi 1.2 (Desember 2024)
- ✅ Tambah fitur bulk import Excel
- ✅ Perbaikan UI dashboard
- ✅ Integrasi WhatsApp notification
- ✅ Export laporan ke PowerPoint

#### Versi 1.1 (November 2024)
- ✅ LKE Digital interaktif
- ✅ AI-powered recommendations
- ✅ Real-time collaboration
- ✅ Mobile app support

#### Versi 1.0 (Oktober 2024)
- ✅ Rilis perdana
- ✅ Semua modul utama
- ✅ Integrasi SIPD, BKN, BKD
- ✅ LKJIP generator

---

**© 2024 SAKIP - Sistem Akuntabilitas Kinerja Instansi Pemerintah**  
*Manual Pengguna - Versi 1.2*