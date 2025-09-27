import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gymfkgorfgerqkoeuivl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWZrZ29yZmdlcnFrb2V1aXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDg0NTksImV4cCI6MjA3NDUyNDQ1OX0.EO1vRJJAopAfzNCmybHFaMvVaUkGcnlzPyUrTnxIzXw'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Import services
import { performanceTreeService } from './performanceTreeService.js'
import { cascadingService } from './cascadingService.js'

// NEW Performance Tree API - using relational database structure
export const performanceTreeAPI = {
  // Get performance tree (built from relational data)
  async loadPerformanceTree(id = '1') {
    try {
      const result = await performanceTreeService.getPerformanceTree()
      return result
    } catch (error) {
      console.error('Error loading performance tree:', error)
      return { success: false, error: error.message }
    }
  },

  // Save performance tree data (placeholder - would need implementation for saving changes back to relational tables)
  async savePerformanceTree(data) {
    try {
      // TODO: Implement saving changes back to individual tables
      // This would involve parsing the tree structure and updating:
      // - visi, misi, tujuan, sasaran, program, kegiatan, sub_kegiatan tables
      // - indikator table for indicators
      console.warn('savePerformanceTree: Not implemented yet - requires parsing tree back to relational structure')
      return { success: false, error: 'Save functionality not implemented for new relational structure' }
    } catch (error) {
      console.error('Error saving performance tree:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all performance trees (returns single tree from relational data)
  async getAllPerformanceTrees() {
    try {
      const result = await performanceTreeService.getPerformanceTree()
      if (result.success) {
        return { success: true, data: [result.data] } // Wrap in array for compatibility
      }
      return result
    } catch (error) {
      console.error('Error loading performance trees:', error)
      return { success: false, error: error.message }
    }
  }
}

// NEW Cascading Performance API - using relational database structure
export const cascadingAPI = {
  // Get cascading structure (built from relational data)
  async loadCascading(id = '1') {
    try {
      const result = await cascadingService.getCascadingStructure()
      return result
    } catch (error) {
      console.error('Error loading cascading data:', error)
      return { success: false, error: error.message }
    }
  },

  // Save cascading data (placeholder - would need implementation for saving changes back to relational tables)
  async saveCascading(data) {
    try {
      // TODO: Implement saving changes back to individual tables
      console.warn('saveCascading: Not implemented yet - requires parsing cascading back to relational structure')
      return { success: false, error: 'Save functionality not implemented for new relational structure' }
    } catch (error) {
      console.error('Error saving cascading data:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all cascading data (returns single structure from relational data)
  async getAllCascading() {
    try {
      const result = await cascadingService.getCascadingStructure()
      if (result.success) {
        return { success: true, data: [result.data] } // Wrap in array for compatibility
      }
      return result
    } catch (error) {
      console.error('Error loading cascading data:', error)
      return { success: false, error: error.message }
    }
  },

  // Get cascading by OPD
  async getCascadingByOPD(opdId) {
    try {
      const result = await cascadingService.getCascadingByOPD(opdId)
      return result
    } catch (error) {
      console.error('Error loading cascading by OPD:', error)
      return { success: false, error: error.message }
    }
  }
}

// NEW Outcomes API - using indikator table
export const outcomesAPI = {
  // Get all outcomes (from indikator table)
  async getAllOutcomes() {
    try {
      const { data, error } = await supabase
        .from('indikator')
        .select(`
          id,
          name,
          type,
          parent_type,
          parent_id,
          opd:opd_id (
            name
          )
        `)
        .order('id')

      if (error) throw error

      // Transform to match old outcomes structure
      const outcomes = data.map(indicator => ({
        id: indicator.id.toString(),
        name: indicator.name,
        type: indicator.type,
        indicators: [indicator.name], // Single indicator
        achievement: Math.round((Math.random() * 20 + 70) * 10) / 10, // Sample data
        target: Math.round(Math.random() * 10 + 85), // Sample data
        status: 'at_risk', // Sample data
        trend: 'up', // Sample data
        opd: indicator.opd ? indicator.opd.name : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      return { success: true, data: outcomes }
    } catch (error) {
      console.error('Error loading outcomes:', error)
      return { success: false, error: error.message }
    }
  },

  // Save outcome (to indikator table)
  async saveOutcome(outcome) {
    try {
      // Find OPD ID if opd name is provided
      let opdId = null
      if (outcome.opd) {
        const { data: opdData } = await supabase
          .from('opd')
          .select('id')
          .eq('name', outcome.opd)
          .single()
        
        if (opdData) {
          opdId = opdData.id
        }
      }

      const { data, error } = await supabase
        .from('indikator')
        .upsert({
          id: outcome.id ? parseInt(outcome.id) : undefined,
          name: outcome.name,
          type: outcome.type,
          parent_type: 'manual', // Default for manually added outcomes
          parent_id: 1, // Default parent
          opd_id: opdId
        })
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving outcome:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete outcome (from indikator table)
  async deleteOutcome(id) {
    try {
      const { error } = await supabase
        .from('indikator')
        .delete()
        .eq('id', parseInt(id))

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting outcome:', error)
      return { success: false, error: error.message }
    }
  }
}

// Additional utility functions for the new structure
export const hierarchyAPI = {
  // Get all OPD
  async getAllOPD() {
    return await performanceTreeService.getAllOPD()
  },

  // Get indicators by type
  async getIndicatorsByType(type) {
    return await performanceTreeService.getIndicatorsByType(type)
  },

  // Get indicators by OPD
  async getIndicatorsByOPD(opdId) {
    return await performanceTreeService.getIndicatorsByOPD(opdId)
  }
}