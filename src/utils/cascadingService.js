import { supabase } from './supabase.js'

/**
 * Cascading Performance Service
 * Mengambil data dari database relasional dan mengubahnya menjadi struktur cascading
 */

/**
 * Cascading Performance Service
 */
export const cascadingService = {
  
  /**
   * Mendapatkan struktur cascading lengkap
   */
  async getCascadingStructure() {
    try {
      // 1. Ambil visi sebagai root
      const { data: visiData, error: visiError } = await supabase
        .from('visi')
        .select('*')
        .single()

      if (visiError) throw visiError

      // 2. Build cascading structure
      const cascading = await this.buildCascadingFromVisi(visiData)
      
      return {
        success: true,
        data: cascading
      }
    } catch (error) {
      console.error('Error getting cascading structure:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Membangun cascading dari visi
   */
  async buildCascadingFromVisi(visi) {
    const cascading = {
      id: visi.id.toString(),
      name: visi.name,
      type: 'visi',
      description: visi.description,
      children: []
    }

    // Ambil misi-misi dari visi ini
    const { data: misiList, error } = await supabase
      .from('misi')
      .select('*')
      .eq('visi_id', visi.id)

    if (!error && misiList) {
      for (const misi of misiList) {
        const misiNode = await this.buildCascadingFromMisi(misi)
        cascading.children.push(misiNode)
      }
    }

    return cascading
  },

  /**
   * Membangun cascading dari misi
   */
  async buildCascadingFromMisi(misi) {
    const node = {
      id: misi.id.toString(),
      name: misi.name,
      type: 'misi',
      description: misi.description,
      children: []
    }

    // Ambil tujuan-tujuan dari misi ini
    const { data: tujuanList, error } = await supabase
      .from('tujuan')
      .select('*')
      .eq('misi_id', misi.id)

    if (!error && tujuanList) {
      for (const tujuan of tujuanList) {
        const tujuanNode = await this.buildCascadingFromTujuan(tujuan)
        node.children.push(tujuanNode)
      }
    }

    return node
  },

  /**
   * Membangun cascading dari tujuan
   */
  async buildCascadingFromTujuan(tujuan) {
    const node = {
      id: tujuan.id.toString(),
      name: tujuan.name,
      type: 'tujuan',
      description: tujuan.description,
      children: []
    }

    // Ambil sasaran-sasaran dari tujuan ini
    const { data: sasaranList, error } = await supabase
      .from('sasaran')
      .select('*')
      .eq('tujuan_id', tujuan.id)

    if (!error && sasaranList) {
      for (const sasaran of sasaranList) {
        const sasaranNode = await this.buildCascadingFromSasaran(sasaran)
        node.children.push(sasaranNode)
      }
    }

    return node
  },

  /**
   * Membangun cascading dari sasaran
   */
  async buildCascadingFromSasaran(sasaran) {
    const node = {
      id: sasaran.id.toString(),
      name: sasaran.name,
      type: 'sasaran',
      description: sasaran.description,
      children: []
    }

    // Untuk sasaran, kita perlu menambahkan OPD yang bertanggung jawab
    // Ambil OPD yang memiliki indikator terkait sasaran ini
    const { data: opdList, error: opdError } = await supabase
      .from('indikator')
      .select(`
        opd_id,
        opd:opd_id (
          id,
          name
        )
      `)
      .eq('parent_type', 'sasaran')
      .eq('parent_id', sasaran.id)

    if (!opdError && opdList) {
      // Group by OPD untuk menghindari duplikasi
      const uniqueOPDs = opdList.reduce((acc, item) => {
        if (item.opd && !acc.find(opd => opd.id === item.opd.id)) {
          acc.push(item.opd)
        }
        return acc
      }, [])

      // Untuk setiap OPD, buat node OPD dan ambil program-programnya
      for (const opd of uniqueOPDs) {
        const opdNode = await this.buildCascadingFromOPD(opd, sasaran.id)
        node.children.push(opdNode)
      }
    }

    return node
  },

  /**
   * Membangun cascading dari OPD
   */
  async buildCascadingFromOPD(opd, sasaranId) {
    const node = {
      id: `opd_${opd.id}_${sasaranId}`,
      name: opd.name,
      type: 'opd',
      opd: opd.name,
      children: []
    }

    // Ambil program-program yang terkait dengan sasaran ini
    const { data: programList, error } = await supabase
      .from('program')
      .select('*')
      .eq('sasaran_id', sasaranId)

    if (!error && programList) {
      for (const program of programList) {
        // Check apakah program ini terkait dengan OPD ini melalui indikator
        const { data: programIndicators } = await supabase
          .from('indikator')
          .select('opd_id')
          .eq('parent_type', 'program')
          .eq('parent_id', program.id)
          .eq('opd_id', opd.id)

        if (programIndicators && programIndicators.length > 0) {
          const programNode = await this.buildCascadingFromProgram(program, opd.name)
          node.children.push(programNode)
        }
      }
    }

    return node
  },

  /**
   * Membangun cascading dari program
   */
  async buildCascadingFromProgram(program, opdName) {
    const node = {
      id: program.id.toString(),
      name: program.name,
      type: 'program',
      opd: opdName,
      description: program.description,
      children: []
    }

    // Ambil kegiatan-kegiatan dari program ini
    const { data: kegiatanList, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('program_id', program.id)

    if (!error && kegiatanList) {
      for (const kegiatan of kegiatanList) {
        const kegiatanNode = await this.buildCascadingFromKegiatan(kegiatan, opdName)
        node.children.push(kegiatanNode)
      }
    }

    return node
  },

  /**
   * Membangun cascading dari kegiatan
   */
  async buildCascadingFromKegiatan(kegiatan, opdName) {
    const node = {
      id: kegiatan.id.toString(),
      name: kegiatan.name,
      type: 'kegiatan',
      opd: opdName,
      description: kegiatan.description,
      children: []
    }

    // Ambil sub_kegiatan dari kegiatan ini
    const { data: subKegiatanList, error } = await supabase
      .from('sub_kegiatan')
      .select('*')
      .eq('kegiatan_id', kegiatan.id)

    if (!error && subKegiatanList) {
      for (const subKegiatan of subKegiatanList) {
        const subKegiatanNode = await this.buildCascadingFromSubKegiatan(subKegiatan, opdName)
        node.children.push(subKegiatanNode)
      }
    }

    return node
  },

  /**
   * Membangun cascading dari sub_kegiatan
   */
  async buildCascadingFromSubKegiatan(subKegiatan, opdName) {
    const node = {
      id: subKegiatan.id.toString(),
      name: subKegiatan.name,
      type: 'sub_kegiatan',
      opd: opdName,
      description: subKegiatan.description,
      children: [] // Sub kegiatan adalah leaf node
    }

    return node
  },

  /**
   * Mendapatkan cascading berdasarkan OPD tertentu
   */
  async getCascadingByOPD(opdId) {
    try {
      // Ambil visi sebagai root
      const { data: visiData, error: visiError } = await supabase
        .from('visi')
        .select('*')
        .single()

      if (visiError) throw visiError

      // Build cascading tapi hanya untuk OPD tertentu
      const cascading = await this.buildCascadingFromVisiForOPD(visiData, opdId)
      
      return {
        success: true,
        data: cascading
      }
    } catch (error) {
      console.error('Error getting cascading by OPD:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Membangun cascading dari visi untuk OPD tertentu
   */
  async buildCascadingFromVisiForOPD(visi, opdId) {
    const cascading = {
      id: visi.id.toString(),
      name: visi.name,
      type: 'visi',
      description: visi.description,
      children: []
    }

    // Ambil misi-misi yang memiliki relasi ke OPD ini
    const { data: misiList, error } = await supabase
      .from('misi')
      .select('*')
      .eq('visi_id', visi.id)

    if (!error && misiList) {
      for (const misi of misiList) {
        const misiNode = await this.buildCascadingFromMisiForOPD(misi, opdId)
        if (misiNode.children.length > 0) { // Hanya tambahkan jika ada children
          cascading.children.push(misiNode)
        }
      }
    }

    return cascading
  },

  /**
   * Membangun cascading dari misi untuk OPD tertentu
   */
  async buildCascadingFromMisiForOPD(misi, opdId) {
    const node = {
      id: misi.id.toString(),
      name: misi.name,
      type: 'misi',
      description: misi.description,
      children: []
    }

    // Ambil tujuan-tujuan yang memiliki relasi ke OPD ini
    const { data: tujuanList, error } = await supabase
      .from('tujuan')
      .select('*')
      .eq('misi_id', misi.id)

    if (!error && tujuanList) {
      for (const tujuan of tujuanList) {
        const tujuanNode = await this.buildCascadingFromTujuanForOPD(tujuan, opdId)
        if (tujuanNode.children.length > 0) { // Hanya tambahkan jika ada children
          node.children.push(tujuanNode)
        }
      }
    }

    return node
  },

  /**
   * Membangun cascading dari tujuan untuk OPD tertentu
   */
  async buildCascadingFromTujuanForOPD(tujuan, opdId) {
    const node = {
      id: tujuan.id.toString(),
      name: tujuan.name,
      type: 'tujuan',
      description: tujuan.description,
      children: []
    }

    // Ambil sasaran-sasaran yang memiliki indikator untuk OPD ini
    const { data: sasaranList, error } = await supabase
      .from('sasaran')
      .select('*')
      .eq('tujuan_id', tujuan.id)

    if (!error && sasaranList) {
      for (const sasaran of sasaranList) {
        // Check apakah sasaran ini memiliki indikator untuk OPD ini
        const { data: indicators } = await supabase
          .from('indikator')
          .select('id')
          .eq('parent_type', 'sasaran')
          .eq('parent_id', sasaran.id)
          .eq('opd_id', opdId)

        if (indicators && indicators.length > 0) {
          const sasaranNode = await this.buildCascadingFromSasaranForOPD(sasaran, opdId)
          node.children.push(sasaranNode)
        }
      }
    }

    return node
  },

  /**
   * Membangun cascading dari sasaran untuk OPD tertentu
   */
  async buildCascadingFromSasaranForOPD(sasaran, opdId) {
    const node = {
      id: sasaran.id.toString(),
      name: sasaran.name,
      type: 'sasaran',
      description: sasaran.description,
      children: []
    }

    // Ambil data OPD
    const { data: opdData } = await supabase
      .from('opd')
      .select('*')
      .eq('id', opdId)
      .single()

    if (opdData) {
      const opdNode = await this.buildCascadingFromOPD(opdData, sasaran.id)
      node.children.push(opdNode)
    }

    return node
  }
}