import { supabase } from './supabase.js'

/**
 * Sample Data Generator for SAKIP
 * Generates sample data for testing and demonstration
 */

export const sampleDataGenerator = {
  
  /**
   * Generate sample performance tree data
   */
  async generateSamplePerformanceTree() {
    try {
      console.log('🎯 Generating sample performance tree data...')
      
      // Clear existing data first (optional)
      await this.clearAllData()
      
      // 1. Create Visi
      const visiData = {
        id: 1,
        name: 'Terwujudnya Daerah yang Maju, Sejahtera, dan Berkelanjutan',
        description: 'Visi pembangunan daerah untuk periode 2021-2026'
      }
      
      await supabase.from('visi').upsert(visiData)
      console.log('✅ Visi created')
      
      // 2. Create Misi
      const misiData = [
        {
          id: 1,
          visi_id: 1,
          name: 'Meningkatkan Kualitas Sumber Daya Manusia',
          description: 'Fokus pada pengembangan SDM yang berkualitas dan kompetitif'
        },
        {
          id: 2,
          visi_id: 1,
          name: 'Membangun Infrastruktur yang Berkelanjutan',
          description: 'Pembangunan infrastruktur yang mendukung pertumbuhan ekonomi'
        },
        {
          id: 3,
          visi_id: 1,
          name: 'Meningkatkan Pelayanan Publik yang Prima',
          description: 'Pelayanan publik yang efisien, transparan, dan akuntabel'
        }
      ]
      
      for (const misi of misiData) {
        await supabase.from('misi').upsert(misi)
      }
      console.log('✅ Misi created (3 items)')
      
      // 3. Create Tujuan
      const tujuanData = [
        {
          id: 1,
          misi_id: 1,
          name: 'Peningkatan Kualitas Pendidikan',
          description: 'Meningkatkan akses dan kualitas pendidikan di semua jenjang'
        },
        {
          id: 2,
          misi_id: 1,
          name: 'Peningkatan Kualitas Kesehatan Masyarakat',
          description: 'Meningkatkan derajat kesehatan masyarakat'
        },
        {
          id: 3,
          misi_id: 2,
          name: 'Pembangunan Infrastruktur Transportasi',
          description: 'Membangun dan memperbaiki infrastruktur transportasi'
        },
        {
          id: 4,
          misi_id: 3,
          name: 'Digitalisasi Pelayanan Publik',
          description: 'Transformasi digital dalam pelayanan publik'
        }
      ]
      
      for (const tujuan of tujuanData) {
        await supabase.from('tujuan').upsert(tujuan)
      }
      console.log('✅ Tujuan created (4 items)')
      
      // 4. Create Sasaran
      const sasaranData = [
        {
          id: 1,
          tujuan_id: 1,
          name: 'Peningkatan Angka Partisipasi Sekolah',
          description: 'Meningkatkan APS di semua jenjang pendidikan'
        },
        {
          id: 2,
          tujuan_id: 1,
          name: 'Peningkatan Kualitas Tenaga Pendidik',
          description: 'Meningkatkan kompetensi guru dan tenaga kependidikan'
        },
        {
          id: 3,
          tujuan_id: 2,
          name: 'Penurunan Angka Kesakitan',
          description: 'Menurunkan angka kesakitan masyarakat'
        },
        {
          id: 4,
          tujuan_id: 3,
          name: 'Peningkatan Kualitas Jalan',
          description: 'Meningkatkan kondisi dan kualitas jalan daerah'
        },
        {
          id: 5,
          tujuan_id: 4,
          name: 'Implementasi e-Government',
          description: 'Penerapan sistem pemerintahan elektronik'
        }
      ]
      
      for (const sasaran of sasaranData) {
        await supabase.from('sasaran').upsert(sasaran)
      }
      console.log('✅ Sasaran created (5 items)')
      
      // 5. Create Program
      const programData = [
        {
          id: 1,
          sasaran_id: 1,
          name: 'Program Wajib Belajar 12 Tahun',
          description: 'Program peningkatan akses pendidikan dasar dan menengah'
        },
        {
          id: 2,
          sasaran_id: 2,
          name: 'Program Peningkatan Kompetensi Guru',
          description: 'Program pelatihan dan sertifikasi guru'
        },
        {
          id: 3,
          sasaran_id: 3,
          name: 'Program Pelayanan Kesehatan Dasar',
          description: 'Program peningkatan pelayanan kesehatan primer'
        },
        {
          id: 4,
          sasaran_id: 4,
          name: 'Program Pembangunan dan Pemeliharaan Jalan',
          description: 'Program infrastruktur jalan daerah'
        },
        {
          id: 5,
          sasaran_id: 5,
          name: 'Program Sistem Informasi Pemerintahan',
          description: 'Program digitalisasi layanan pemerintah'
        }
      ]
      
      for (const program of programData) {
        await supabase.from('program').upsert(program)
      }
      console.log('✅ Program created (5 items)')
      
      // 6. Create Kegiatan
      const kegiatanData = [
        {
          id: 1,
          program_id: 1,
          name: 'Pembangunan Sekolah Baru',
          description: 'Pembangunan gedung sekolah untuk meningkatkan akses pendidikan'
        },
        {
          id: 2,
          program_id: 1,
          name: 'Pengadaan Sarana Prasarana Pendidikan',
          description: 'Pengadaan alat dan fasilitas pendukung pembelajaran'
        },
        {
          id: 3,
          program_id: 2,
          name: 'Pelatihan Guru Berkelanjutan',
          description: 'Program pelatihan rutin untuk peningkatan kompetensi guru'
        },
        {
          id: 4,
          program_id: 3,
          name: 'Pelayanan Kesehatan Ibu dan Anak',
          description: 'Program kesehatan khusus ibu dan anak'
        },
        {
          id: 5,
          program_id: 4,
          name: 'Pembangunan Jalan Desa',
          description: 'Pembangunan dan perbaikan jalan di desa-desa'
        }
      ]
      
      for (const kegiatan of kegiatanData) {
        await supabase.from('kegiatan').upsert(kegiatan)
      }
      console.log('✅ Kegiatan created (5 items)')
      
      // 7. Create Sub Kegiatan
      const subKegiatanData = [
        {
          id: 1,
          kegiatan_id: 1,
          name: 'Pembangunan SD Negeri 1',
          description: 'Pembangunan gedung SD Negeri 1 di Kecamatan A'
        },
        {
          id: 2,
          kegiatan_id: 2,
          name: 'Pengadaan Laptop untuk Guru',
          description: 'Pengadaan laptop untuk mendukung pembelajaran digital'
        },
        {
          id: 3,
          kegiatan_id: 3,
          name: 'Workshop Kurikulum Merdeka',
          description: 'Pelatihan implementasi kurikulum merdeka'
        },
        {
          id: 4,
          kegiatan_id: 4,
          name: 'Posyandu Balita',
          description: 'Pelayanan kesehatan balita di posyandu'
        },
        {
          id: 5,
          kegiatan_id: 5,
          name: 'Pengaspalan Jalan Desa Makmur',
          description: 'Pengaspalan jalan utama Desa Makmur sepanjang 2 km'
        }
      ]
      
      for (const subKegiatan of subKegiatanData) {
        await supabase.from('sub_kegiatan').upsert(subKegiatan)
      }
      console.log('✅ Sub Kegiatan created (5 items)')
      
      // 8. Create OPD
      const opdData = [
        {
          id: 1,
          name: 'Dinas Pendidikan',
          head_name: 'Dr. Ahmad Suryadi, M.Pd',
          head_nip: '196501011990031001',
          level: 'Dinas'
        },
        {
          id: 2,
          name: 'Dinas Kesehatan',
          head_name: 'dr. Siti Nurhaliza, M.Kes',
          head_nip: '197203151995032002',
          level: 'Dinas'
        },
        {
          id: 3,
          name: 'Dinas Pekerjaan Umum dan Penataan Ruang',
          head_name: 'Ir. Budi Santoso, M.T',
          head_nip: '196812201992031003',
          level: 'Dinas'
        },
        {
          id: 4,
          name: 'Dinas Komunikasi dan Informatika',
          head_name: 'Andi Wijaya, S.Kom, M.T',
          head_nip: '198005102005011004',
          level: 'Dinas'
        }
      ]
      
      for (const opd of opdData) {
        await supabase.from('opd').upsert(opd)
      }
      console.log('✅ OPD created (4 items)')
      
      // 9. Create Indikator
      const indikatorData = [
        // IKU (Indikator Kinerja Utama)
        {
          id: 1,
          name: 'Angka Partisipasi Murni SD',
          type: 'IKU',
          parent_type: 'tujuan',
          parent_id: 1,
          opd_id: 1
        },
        {
          id: 2,
          name: 'Angka Harapan Hidup',
          type: 'IKU',
          parent_type: 'tujuan',
          parent_id: 2,
          opd_id: 2
        },
        {
          id: 3,
          name: 'Persentase Jalan dalam Kondisi Baik',
          type: 'IKU',
          parent_type: 'tujuan',
          parent_id: 3,
          opd_id: 3
        },
        // IKK (Indikator Kinerja Kegiatan)
        {
          id: 4,
          name: 'Jumlah Sekolah Baru yang Dibangun',
          type: 'IKK',
          parent_type: 'kegiatan',
          parent_id: 1,
          opd_id: 1
        },
        {
          id: 5,
          name: 'Jumlah Guru yang Mengikuti Pelatihan',
          type: 'IKK',
          parent_type: 'kegiatan',
          parent_id: 3,
          opd_id: 1
        },
        {
          id: 6,
          name: 'Jumlah Balita yang Dilayani di Posyandu',
          type: 'IKK',
          parent_type: 'kegiatan',
          parent_id: 4,
          opd_id: 2
        },
        {
          id: 7,
          name: 'Panjang Jalan yang Diperbaiki (km)',
          type: 'IKK',
          parent_type: 'kegiatan',
          parent_id: 5,
          opd_id: 3
        },
        {
          id: 8,
          name: 'Jumlah Layanan Digital yang Diluncurkan',
          type: 'IKK',
          parent_type: 'sasaran',
          parent_id: 5,
          opd_id: 4
        }
      ]
      
      for (const indikator of indikatorData) {
        await supabase.from('indikator').upsert(indikator)
      }
      console.log('✅ Indikator created (8 items)')
      
      console.log('🎉 Sample data generation completed successfully!')
      
      return {
        success: true,
        message: 'Sample data berhasil dibuat',
        summary: {
          visi: 1,
          misi: 3,
          tujuan: 4,
          sasaran: 5,
          program: 5,
          kegiatan: 5,
          sub_kegiatan: 5,
          opd: 4,
          indikator: 8
        }
      }
      
    } catch (error) {
      console.error('❌ Error generating sample data:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Clear all existing data
   */
  async clearAllData() {
    try {
      console.log('🧹 Clearing existing data...')
      
      // Delete in reverse order to respect foreign key constraints
      await supabase.from('indikator').delete().neq('id', 0)
      await supabase.from('sub_kegiatan').delete().neq('id', 0)
      await supabase.from('kegiatan').delete().neq('id', 0)
      await supabase.from('program').delete().neq('id', 0)
      await supabase.from('sasaran').delete().neq('id', 0)
      await supabase.from('tujuan').delete().neq('id', 0)
      await supabase.from('misi').delete().neq('id', 0)
      await supabase.from('visi').delete().neq('id', 0)
      await supabase.from('opd').delete().neq('id', 0)
      
      console.log('✅ Existing data cleared')
      
    } catch (error) {
      console.error('❌ Error clearing data:', error)
      throw error
    }
  },

  /**
   * Create minimal starter data (just Visi)
   */
  async createStarterData() {
    try {
      console.log('🌱 Creating starter data...')
      
      // Clear existing data first
      await this.clearAllData()
      
      // Create basic Visi
      const visiData = {
        id: 1,
        name: 'Visi Organisasi',
        description: 'Masukkan visi organisasi Anda di sini'
      }
      
      await supabase.from('visi').upsert(visiData)
      
      console.log('✅ Starter data created')
      
      return {
        success: true,
        message: 'Data starter berhasil dibuat. Silakan tambahkan Misi dan struktur lainnya.',
        data: visiData
      }
      
    } catch (error) {
      console.error('❌ Error creating starter data:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Load template data from predefined templates
   */
  async loadTemplate(templateType = 'pemda') {
    try {
      console.log(`📋 Loading ${templateType} template...`)
      
      if (templateType === 'pemda') {
        return await this.generateSamplePerformanceTree()
      } else if (templateType === 'opd') {
        return await this.generateOPDTemplate()
      }
      
      return {
        success: false,
        error: 'Template type not found'
      }
      
    } catch (error) {
      console.error('❌ Error loading template:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Generate OPD-specific template
   */
  async generateOPDTemplate() {
    try {
      console.log('🏢 Generating OPD template...')
      
      // This would be a simplified structure for single OPD
      await this.clearAllData()
      
      const visiData = {
        id: 1,
        name: 'Visi OPD',
        description: 'Terwujudnya pelayanan prima dan tata kelola yang baik'
      }
      
      await supabase.from('visi').upsert(visiData)
      
      const misiData = {
        id: 1,
        visi_id: 1,
        name: 'Meningkatkan Kualitas Pelayanan Publik',
        description: 'Memberikan pelayanan yang cepat, tepat, dan transparan'
      }
      
      await supabase.from('misi').upsert(misiData)
      
      return {
        success: true,
        message: 'Template OPD berhasil dimuat',
        summary: {
          visi: 1,
          misi: 1,
          note: 'Template sederhana untuk OPD. Silakan tambahkan tujuan dan sasaran sesuai kebutuhan.'
        }
      }
      
    } catch (error) {
      console.error('❌ Error generating OPD template:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}