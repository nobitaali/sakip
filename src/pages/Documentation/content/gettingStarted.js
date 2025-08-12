export const gettingStartedContent = {
  introduction: {
    title: 'Pengenalan SAKIP',
    content: `
      <div class="prose max-w-none">
        <p class="text-lg text-gray-600 mb-6">
          SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) adalah aplikasi web modern yang dirancang untuk membantu instansi pemerintah dalam mengelola, memantau, dan mengevaluasi kinerja secara terpadu dan terintegrasi.
        </p>

        <h3 class="text-xl font-semibold text-gray-900 mb-4">Apa itu SAKIP?</h3>
        <p class="mb-4">
          SAKIP merupakan sistem yang mengintegrasikan seluruh proses akuntabilitas kinerja mulai dari perencanaan, pelaksanaan, pelaporan, hingga evaluasi. Sistem ini dikembangkan untuk memenuhi kebutuhan instansi pemerintah dalam:
        </p>
        
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Menyusun dan mengelola dokumen perencanaan strategis</li>
          <li>Memantau capaian kinerja secara real-time</li>
          <li>Mengelola anggaran dan realisasinya</li>
          <li>Menghasilkan laporan kinerja otomatis</li>
          <li>Melakukan evaluasi internal dan eksternal</li>
          <li>Mengintegrasikan data dengan sistem lain</li>
        </ul>

        <h3 class="text-xl font-semibold text-gray-900 mb-4">Manfaat SAKIP</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">🎯 Efisiensi</h4>
            <p class="text-gray-600 text-sm">Otomatisasi proses pelaporan dan integrasi data mengurangi beban kerja manual</p>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">📊 Akurasi</h4>
            <p class="text-gray-600 text-sm">Data terintegrasi dan validasi otomatis memastikan akurasi informasi</p>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">⚡ Real-time</h4>
            <p class="text-gray-600 text-sm">Monitoring kinerja dan anggaran secara langsung</p>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">🔗 Terintegrasi</h4>
            <p class="text-gray-600 text-sm">Koneksi dengan SIPD, BKN, dan sistem lainnya</p>
          </div>
        </div>

        <h3 class="text-xl font-semibold text-gray-900 mb-4">Arsitektur Sistem</h3>
        <p class="mb-4">
          SAKIP dibangun dengan arsitektur modern yang terdiri dari:
        </p>
        
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li><strong>Frontend:</strong> React.js dengan Tailwind CSS untuk antarmuka yang responsif</li>
          <li><strong>Backend:</strong> Node.js dengan Express.js untuk API yang robust</li>
          <li><strong>Database:</strong> PostgreSQL untuk penyimpanan data yang reliable</li>
          <li><strong>Cache:</strong> Redis untuk performa yang optimal</li>
          <li><strong>Integration:</strong> RESTful API untuk koneksi dengan sistem eksternal</li>
        </ul>
      </div>
    `
  },

  login: {
    title: 'Cara Login ke SAKIP',
    content: `
      <div class="prose max-w-none">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Langkah-langkah Login</h3>
        
        <div class="space-y-6">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-primary-600 font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Akses Aplikasi</h4>
              <p class="text-gray-600 mb-3">Buka browser dan akses URL aplikasi SAKIP yang diberikan administrator.</p>
              <div class="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                https://sakip.pemda.go.id
              </div>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-primary-600 font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Input Kredensial</h4>
              <p class="text-gray-600 mb-3">Masukkan username dan password yang telah diberikan administrator.</p>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 text-sm">
                  <strong>Catatan:</strong> Pastikan Caps Lock tidak aktif dan periksa ejaan username dengan teliti.
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-primary-600 font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Klik Masuk</h4>
              <p class="text-gray-600">Tekan tombol "Masuk" untuk mengakses dashboard aplikasi.</p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h4 class="font-semibold text-blue-900 mb-3">🔐 Akun Demo untuk Testing</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b border-blue-200">
                  <th class="text-left py-2 font-medium text-blue-900">Role</th>
                  <th class="text-left py-2 font-medium text-blue-900">Username</th>
                  <th class="text-left py-2 font-medium text-blue-900">Password</th>
                  <th class="text-left py-2 font-medium text-blue-900">Akses</th>
                </tr>
              </thead>
              <tbody class="text-blue-800">
                <tr class="border-b border-blue-100">
                  <td class="py-2">Super Admin</td>
                  <td class="py-2 font-mono">superadmin</td>
                  <td class="py-2 font-mono">password</td>
                  <td class="py-2">Semua modul</td>
                </tr>
                <tr class="border-b border-blue-100">
                  <td class="py-2">Admin OPD</td>
                  <td class="py-2 font-mono">admin</td>
                  <td class="py-2 font-mono">password</td>
                  <td class="py-2">Modul OPD</td>
                </tr>
                <tr class="border-b border-blue-100">
                  <td class="py-2">Evaluator</td>
                  <td class="py-2 font-mono">evaluator</td>
                  <td class="py-2 font-mono">password</td>
                  <td class="py-2">Evaluasi</td>
                </tr>
                <tr>
                  <td class="py-2">Viewer</td>
                  <td class="py-2 font-mono">viewer</td>
                  <td class="py-2 font-mono">password</td>
                  <td class="py-2">Dashboard</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
          <h4 class="font-semibold text-red-900 mb-2">🚨 Troubleshooting Login</h4>
          <ul class="text-red-800 text-sm space-y-2">
            <li>• <strong>Lupa Password:</strong> Hubungi administrator untuk reset password</li>
            <li>• <strong>Akun Terkunci:</strong> Tunggu 15 menit atau hubungi administrator</li>
            <li>• <strong>Error Browser:</strong> Clear cache dan cookies, atau coba browser lain</li>
            <li>• <strong>Koneksi Bermasalah:</strong> Periksa koneksi internet dan firewall</li>
          </ul>
        </div>
      </div>
    `
  },

  dashboard: {
    title: 'Memahami Dashboard',
    content: `
      <div class="prose max-w-none">
        <p class="text-lg text-gray-600 mb-6">
          Dashboard adalah pusat kontrol aplikasi SAKIP yang menampilkan ringkasan kinerja dan informasi penting secara real-time.
        </p>

        <h3 class="text-xl font-semibold text-gray-900 mb-4">Komponen Dashboard</h3>
        
        <div class="space-y-6">
          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              📊 Kartu Statistik Utama
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Rata-rata Nilai SAKIP:</strong><br>
                <span class="text-gray-600">Nilai rata-rata evaluasi SAKIP semua OPD</span>
              </div>
              <div>
                <strong>Capaian Kinerja (%):</strong><br>
                <span class="text-gray-600">Persentase rata-rata capaian indikator</span>
              </div>
              <div>
                <strong>Serapan Anggaran (%):</strong><br>
                <span class="text-gray-600">Persentase realisasi anggaran</span>
              </div>
              <div>
                <strong>Indikator Bermasalah:</strong><br>
                <span class="text-gray-600">Jumlah indikator dengan capaian rendah</span>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              🏆 Ranking OPD
            </h4>
            <p class="text-gray-600 mb-3">
              Menampilkan peringkat OPD berdasarkan nilai SAKIP dengan indikator visual:
            </p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>🥇 <strong>Peringkat 1-3:</strong> Ikon medali khusus</div>
              <div>📈 <strong>Trend:</strong> Naik/turun dari periode sebelumnya</div>
              <div>🟢 <strong>Sangat Baik:</strong> Nilai 85-100</div>
              <div>🟡 <strong>Baik:</strong> Nilai 70-84</div>
              <div>🟠 <strong>Cukup:</strong> Nilai 60-69</div>
              <div>🔴 <strong>Kurang:</strong> Nilai < 60</div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              📈 Grafik Kinerja
            </h4>
            <ul class="text-gray-600 space-y-2">
              <li>• <strong>Trend View:</strong> Grafik garis menampilkan perkembangan bulanan/triwulanan</li>
              <li>• <strong>Comparison View:</strong> Grafik batang perbandingan antar OPD</li>
              <li>• <strong>Color Coding:</strong> 🟢 Normal (≥90%), 🟡 Perhatian (70-89%), 🔴 Kritis (<70%)</li>
            </ul>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              🔔 Alert & Reminder System
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center">
                <span class="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <div>
                  <strong>Kritis:</strong><br>
                  <span class="text-gray-600">Deadline mendekat, capaian sangat rendah</span>
                </div>
              </div>
              <div class="flex items-center">
                <span class="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <div>
                  <strong>Perhatian:</strong><br>
                  <span class="text-gray-600">Perlu tindakan segera</span>
                </div>
              </div>
              <div class="flex items-center">
                <span class="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <div>
                  <strong>Info:</strong><br>
                  <span class="text-gray-600">Update sistem, sinkronisasi data</span>
                </div>
              </div>
              <div class="flex items-center">
                <span class="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <div>
                  <strong>Sukses:</strong><br>
                  <span class="text-gray-600">Evaluasi selesai, target tercapai</span>
                </div>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
              🌳 Pohon Kinerja Interaktif
            </h4>
            <p class="text-gray-600 mb-3">
              Visualisasi hierarki kinerja yang dapat diinteraksi:
            </p>
            <ul class="text-gray-600 space-y-2">
              <li>• <strong>Hierarki:</strong> RPJMD → Tujuan → Sasaran → Program → Kegiatan</li>
              <li>• <strong>Expand/Collapse:</strong> Klik untuk membuka/tutup cabang</li>
              <li>• <strong>Progress Bar:</strong> Indikator capaian di setiap level</li>
              <li>• <strong>Export:</strong> Download ke PDF atau Excel</li>
              <li>• <strong>Filter:</strong> Tampilkan berdasarkan OPD atau periode</li>
            </ul>
          </div>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <h4 class="font-semibold text-green-900 mb-3">💡 Tips Menggunakan Dashboard</h4>
          <ul class="text-green-800 text-sm space-y-2">
            <li>• <strong>Refresh Data:</strong> Klik tombol refresh (🔄) untuk update data terbaru</li>
            <li>• <strong>Filter Periode:</strong> Gunakan dropdown periode untuk melihat data historis</li>
            <li>• <strong>Export Dashboard:</strong> Klik tombol download untuk export ke PDF</li>
            <li>• <strong>Drill Down:</strong> Klik pada grafik atau kartu untuk detail lebih lanjut</li>
            <li>• <strong>Bookmark:</strong> Simpan filter favorit untuk akses cepat</li>
          </ul>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h4 class="font-semibold text-blue-900 mb-3">⚙️ Kustomisasi Dashboard</h4>
          <p class="text-blue-800 text-sm mb-3">
            Dashboard dapat dikustomisasi sesuai kebutuhan pengguna:
          </p>
          <ul class="text-blue-800 text-sm space-y-2">
            <li>• <strong>Widget Layout:</strong> Drag & drop untuk mengatur posisi widget</li>
            <li>• <strong>Color Theme:</strong> Pilih tema warna sesuai preferensi</li>
            <li>• <strong>Default Filter:</strong> Set filter default saat membuka dashboard</li>
            <li>• <strong>Notification:</strong> Atur jenis notifikasi yang ingin diterima</li>
          </ul>
        </div>
      </div>
    `
  },

  navigation: {
    title: 'Navigasi Aplikasi',
    content: `
      <div class="prose max-w-none">
        <p class="text-lg text-gray-600 mb-6">
          Panduan lengkap untuk navigasi dan penggunaan antarmuka aplikasi SAKIP.
        </p>

        <h3 class="text-xl font-semibold text-gray-900 mb-4">Struktur Navigasi</h3>
        
        <div class="space-y-6">
          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">🎯 Sidebar Navigation</h4>
            <p class="text-gray-600 mb-3">Menu utama terletak di sisi kiri dengan ikon dan label yang jelas:</p>
            <ul class="text-gray-600 space-y-2">
              <li>• <strong>Dashboard:</strong> Halaman utama dengan ringkasan kinerja</li>
              <li>• <strong>Perencanaan:</strong> Modul untuk mengelola Renstra dan Renaksi</li>
              <li>• <strong>Pengukuran Kinerja:</strong> Input dan monitoring capaian kinerja</li>
              <li>• <strong>Anggaran:</strong> Manajemen pagu dan realisasi anggaran</li>
              <li>• <strong>Pelaporan:</strong> Generate LKJIP dan laporan lainnya</li>
              <li>• <strong>Evaluasi:</strong> Evaluasi internal dan eksternal SAKIP</li>
              <li>• <strong>Integrasi & API:</strong> Koneksi dengan sistem eksternal</li>
              <li>• <strong>Dokumentasi:</strong> Panduan penggunaan aplikasi</li>
              <li>• <strong>Manajemen User:</strong> Kelola pengguna dan hak akses</li>
            </ul>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">🔍 Header & Search</h4>
            <ul class="text-gray-600 space-y-2">
              <li>• <strong>Page Title:</strong> Menampilkan nama halaman aktif</li>
              <li>• <strong>Search Bar:</strong> Pencarian global di seluruh aplikasi</li>
              <li>• <strong>Notifications:</strong> Bell icon untuk notifikasi sistem</li>
              <li>• <strong>User Profile:</strong> Info pengguna dan menu logout</li>
              <li>• <strong>Breadcrumb:</strong> Navigasi hierarkis (pada halaman tertentu)</li>
            </ul>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">📱 Responsive Design</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Desktop (≥1024px):</strong>
                <ul class="text-gray-600 text-sm mt-2 space-y-1">
                  <li>• Sidebar selalu terlihat</li>
                  <li>• Layout multi-kolom</li>
                  <li>• Hover effects aktif</li>
                  <li>• Keyboard shortcuts</li>
                </ul>
              </div>
              <div>
                <strong>Mobile (<1024px):</strong>
                <ul class="text-gray-600 text-sm mt-2 space-y-1">
                  <li>• Sidebar dapat disembunyikan</li>
                  <li>• Layout single-kolom</li>
                  <li>• Touch-friendly buttons</li>
                  <li>• Swipe gestures</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">⌨️ Keyboard Shortcuts</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Navigasi:</strong>
                <ul class="text-gray-600 mt-2 space-y-1">
                  <li>• <kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + /</kbd> - Search</li>
                  <li>• <kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + H</kbd> - Home/Dashboard</li>
                  <li>• <kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + B</kbd> - Toggle Sidebar</li>
                  <li>• <kbd class="px-2 py-1 bg-gray-100 rounded">Esc</kbd> - Close Modal</li>
                </ul>
              </div>
              <div>
                <strong>Actions:</strong>
                <ul class="text-gray-600 mt-2 space-y-1">
                  <li>• <kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + S</kbd> - Save</li>
                  <li>• <kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + N</kbd> - New Item</li>
                  <li>• <kbd class="px-2 py-1 bg-gray-100 rounded">Ctrl + E</kbd> - Edit</li>
                  <li>• <kbd class="px-2 py-1 bg-gray-100 rounded">F5</kbd> - Refresh</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h4 class="font-semibold text-yellow-900 mb-3">🎨 Tema dan Personalisasi</h4>
          <ul class="text-yellow-800 text-sm space-y-2">
            <li>• <strong>Dark Mode:</strong> Toggle tema gelap untuk kenyamanan mata</li>
            <li>• <strong>Font Size:</strong> Sesuaikan ukuran font (Small, Medium, Large)</li>
            <li>• <strong>Language:</strong> Pilih bahasa Indonesia atau English</li>
            <li>• <strong>Timezone:</strong> Set zona waktu sesuai lokasi</li>
            <li>• <strong>Dashboard Layout:</strong> Kustomisasi tata letak widget</li>
          </ul>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h4 class="font-semibold text-blue-900 mb-3">🔄 Auto-Save & Sync</h4>
          <p class="text-blue-800 text-sm mb-3">
            Aplikasi SAKIP memiliki fitur auto-save dan sinkronisasi otomatis:
          </p>
          <ul class="text-blue-800 text-sm space-y-2">
            <li>• <strong>Auto-Save:</strong> Data tersimpan otomatis setiap 30 detik</li>
            <li>• <strong>Real-time Sync:</strong> Perubahan data langsung tersinkronisasi</li>
            <li>• <strong>Offline Mode:</strong> Dapat bekerja offline, sync saat online</li>
            <li>• <strong>Version Control:</strong> Riwayat perubahan data tersimpan</li>
            <li>• <strong>Conflict Resolution:</strong> Penanganan konflik data otomatis</li>
          </ul>
        </div>
      </div>
    `
  }
}