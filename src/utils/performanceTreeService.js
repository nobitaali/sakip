import { supabase } from './supabase.js'

/**
 * Performance Tree Service
 * Mengambil data dari database relasional dan mengubahnya menjadi struktur pohon kinerja
 */

// Helper function untuk mendapatkan indikator berdasarkan parent
const getIndicatorsByParent = async (parentType, parentId) => {
  try {
    const { data, error } = await supabase
      .from('indikator')
      .select('name')
      .eq('parent_type', parentType)
      .eq('parent_id', parentId)

    if (error) throw error
    return data ? data.map(item => item.name) : []
  } catch (error) {
    console.error('Error getting indicators:', error)
    return []
  }
}

// Helper function untuk mendapatkan nama OPD berdasarkan ID
const getOPDName = async (opdId) => {
  if (!opdId) return null
  
  try {
    const { data, error } = await supabase
      .from('opd')
      .select('name')
      .eq('id', opdId)
      .single()

    if (error) throw error
    return data ? data.name : null
  } catch (error) {
    console.error('Error getting OPD name:', error)
    return null
  }
}

// Mapping tipe dari database ke tipe pohon kinerja
const mapToPerformanceType = (level, isOutput = false) => {
  if (isOutput) return 'OUTPUT'
  
  switch (level) {
    case 0: return 'ULTIMATE OUTCOME'
    case 1: return 'INTERMEDIATE OUTCOME'
    case 2: return 'IMMEDIATE OUTCOME LEVEL 1'
    case 3: return 'IMMEDIATE OUTCOME LEVEL 2'
    default: return 'OUTPUT'
  }
}

// Generate sample performance data (achievement, target, status, trend)
const generatePerformanceData = (level) => {
  // Sample data - dalam implementasi nyata, ini harus diambil dari tabel terpisah
  const baseAchievement = Math.random() * 20 + 70 // 70-90
  const baseTarget = Math.random() * 10 + 85 // 85-95
  
  return {
    achievement: Math.round(baseAchievement * 10) / 10,
    target: Math.round(baseTarget),
    status: baseAchievement >= baseTarget * 0.9 ? 'on_track' : 
            baseAchievement >= baseTarget * 0.7 ? 'at_risk' : 'critical',
    trend: Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down'
  }
}

/**
 * Membangun struktur pohon kinerja dari data relasional
 */
export const performanceTreeService = {
  
  /**
   * Mendapatkan pohon kinerja lengkap
   */
  async getPerformanceTree() {
    try {
      // 1. Ambil visi sebagai root
      const { data: visiData, error: visiError } = await supabase
        .from('visi')
        .select('*')
        .single()

      if (visiError) throw visiError

      // 2. Build tree structure
      const tree = await this.buildTreeFromVisi(visiData)
      
      return {
        success: true,
        data: tree
      }
    } catch (error) {
      console.error('Error getting performance tree:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Membangun tree dari visi (level 0 - ULTIMATE OUTCOME)
   */
  async buildTreeFromVisi(visi) {
    const performanceData = generatePerformanceData(0)
    const indicators = await getIndicatorsByParent('visi', visi.id)

    const tree = {
      id: visi.id.toString(),
      type: 'ULTIMATE OUTCOME',
      label: visi.name,
      indicators: indicators,
      ...performanceData,
      children: []
    }

    // Ambil misi-misi dari visi ini
    const { data: misiList, error } = await supabase
      .from('misi')
      .select('*')
      .eq('visi_id', visi.id)

    if (!error && misiList) {
      for (const misi of misiList) {
        const misiNode = await this.buildTreeFromMisi(misi, 1)
        tree.children.push(misiNode)
      }
    }

    return tree
  },

  /**
   * Membangun tree dari misi (level 1 - INTERMEDIATE OUTCOME)
   */
  async buildTreeFromMisi(misi, level) {
    const performanceData = generatePerformanceData(level)
    const indicators = await getIndicatorsByParent('misi', misi.id)

    const node = {
      id: misi.id.toString(),
      type: mapToPerformanceType(level),
      label: misi.name,
      indicators: indicators,
      ...performanceData,
      children: []
    }

    // Ambil tujuan-tujuan dari misi ini
    const { data: tujuanList, error } = await supabase
      .from('tujuan')
      .select('*')
      .eq('misi_id', misi.id)

    if (!error && tujuanList) {
      for (const tujuan of tujuanList) {
        const tujuanNode = await this.buildTreeFromTujuan(tujuan, level + 1)
        node.children.push(tujuanNode)
      }
    }

    return node
  },

  /**
   * Membangun tree dari tujuan (level 2 - IMMEDIATE OUTCOME LEVEL 1)
   */
  async buildTreeFromTujuan(tujuan, level) {
    const performanceData = generatePerformanceData(level)
    const indicators = await getIndicatorsByParent('tujuan', tujuan.id)

    const node = {
      id: tujuan.id.toString(),
      type: mapToPerformanceType(level),
      label: tujuan.name,
      indicators: indicators,
      ...performanceData,
      children: []
    }

    // Ambil sasaran-sasaran dari tujuan ini
    const { data: sasaranList, error } = await supabase
      .from('sasaran')
      .select('*')
      .eq('tujuan_id', tujuan.id)

    if (!error && sasaranList) {
      for (const sasaran of sasaranList) {
        const sasaranNode = await this.buildTreeFromSasaran(sasaran, level + 1)
        node.children.push(sasaranNode)
      }
    }

    return node
  },

  /**
   * Membangun tree dari sasaran (level 3 - IMMEDIATE OUTCOME LEVEL 2)
   */
  async buildTreeFromSasaran(sasaran, level) {
    const performanceData = generatePerformanceData(level)
    const indicators = await getIndicatorsByParent('sasaran', sasaran.id)

    const node = {
      id: sasaran.id.toString(),
      type: mapToPerformanceType(level),
      label: sasaran.name,
      indicators: indicators,
      ...performanceData,
      children: []
    }

    // Ambil program-program dari sasaran ini
    const { data: programList, error } = await supabase
      .from('program')
      .select('*')
      .eq('sasaran_id', sasaran.id)

    if (!error && programList) {
      for (const program of programList) {
        const programNode = await this.buildTreeFromProgram(program, level + 1)
        node.children.push(programNode)
      }
    }

    return node
  },

  /**
   * Membangun tree dari program (level 4 - OUTPUT)
   */
  async buildTreeFromProgram(program, level) {
    const performanceData = generatePerformanceData(level)
    const indicators = await getIndicatorsByParent('program', program.id)

    // Untuk program, kita perlu mendapatkan OPD yang bertanggung jawab
    // Asumsi: program memiliki relasi ke OPD melalui indikator
    let opdName = null
    const { data: programIndicators } = await supabase
      .from('indikator')
      .select('opd_id')
      .eq('parent_type', 'program')
      .eq('parent_id', program.id)
      .limit(1)

    if (programIndicators && programIndicators.length > 0 && programIndicators[0].opd_id) {
      opdName = await getOPDName(programIndicators[0].opd_id)
    }

    const node = {
      id: program.id.toString(),
      type: 'OUTPUT',
      label: program.name,
      indicators: indicators,
      opd: opdName,
      ...performanceData,
      children: []
    }

    // Ambil kegiatan-kegiatan dari program ini
    const { data: kegiatanList, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('program_id', program.id)

    if (!error && kegiatanList) {
      for (const kegiatan of kegiatanList) {
        const kegiatanNode = await this.buildTreeFromKegiatan(kegiatan, level + 1)
        node.children.push(kegiatanNode)
      }
    }

    return node
  },

  /**
   * Membangun tree dari kegiatan (level 5 - OUTPUT)
   */
  async buildTreeFromKegiatan(kegiatan, level) {
    const performanceData = generatePerformanceData(level)
    const indicators = await getIndicatorsByParent('kegiatan', kegiatan.id)

    // Mendapatkan OPD untuk kegiatan
    let opdName = null
    const { data: kegiatanIndicators } = await supabase
      .from('indikator')
      .select('opd_id')
      .eq('parent_type', 'kegiatan')
      .eq('parent_id', kegiatan.id)
      .limit(1)

    if (kegiatanIndicators && kegiatanIndicators.length > 0 && kegiatanIndicators[0].opd_id) {
      opdName = await getOPDName(kegiatanIndicators[0].opd_id)
    }

    const node = {
      id: kegiatan.id.toString(),
      type: 'OUTPUT',
      label: kegiatan.name,
      indicators: indicators,
      opd: opdName,
      ...performanceData,
      children: []
    }

    // Ambil sub_kegiatan dari kegiatan ini
    const { data: subKegiatanList, error } = await supabase
      .from('sub_kegiatan')
      .select('*')
      .eq('kegiatan_id', kegiatan.id)

    if (!error && subKegiatanList) {
      for (const subKegiatan of subKegiatanList) {
        const subKegiatanNode = await this.buildTreeFromSubKegiatan(subKegiatan, level + 1)
        node.children.push(subKegiatanNode)
      }
    }

    return node
  },

  /**
   * Membangun tree dari sub_kegiatan (level 6 - OUTPUT)
   */
  async buildTreeFromSubKegiatan(subKegiatan, level) {
    const performanceData = generatePerformanceData(level)
    const indicators = await getIndicatorsByParent('sub_kegiatan', subKegiatan.id)

    // Mendapatkan OPD untuk sub_kegiatan
    let opdName = null
    const { data: subKegiatanIndicators } = await supabase
      .from('indikator')
      .select('opd_id')
      .eq('parent_type', 'sub_kegiatan')
      .eq('parent_id', subKegiatan.id)
      .limit(1)

    if (subKegiatanIndicators && subKegiatanIndicators.length > 0 && subKegiatanIndicators[0].opd_id) {
      opdName = await getOPDName(subKegiatanIndicators[0].opd_id)
    }

    const node = {
      id: subKegiatan.id.toString(),
      type: 'OUTPUT',
      label: subKegiatan.name,
      indicators: indicators,
      opd: opdName,
      ...performanceData,
      children: [] // Sub kegiatan adalah leaf node
    }

    return node
  },

  /**
   * Mendapatkan indikator berdasarkan OPD
   */
  async getIndicatorsByOPD(opdId) {
    try {
      const { data, error } = await supabase
        .from('indikator')
        .select(`
          *,
          opd:opd_id (
            name
          )
        `)
        .eq('opd_id', opdId)

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Error getting indicators by OPD:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Mendapatkan indikator berdasarkan tipe (IKU/IKK)
   */
  async getIndicatorsByType(type) {
    try {
      const { data, error } = await supabase
        .from('indikator')
        .select(`
          *,
          opd:opd_id (
            name
          )
        `)
        .eq('type', type)

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Error getting indicators by type:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Mendapatkan semua OPD
   */
  async getAllOPD() {
    try {
      const { data, error } = await supabase
        .from('opd')
        .select('*')
        .order('name')

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Error getting all OPD:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}