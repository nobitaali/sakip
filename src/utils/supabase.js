import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gymfkgorfgerqkoeuivl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWZrZ29yZmdlcnFrb2V1aXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDg0NTksImV4cCI6MjA3NDUyNDQ1OX0.EO1vRJJAopAfzNCmybHFaMvVaUkGcnlzPyUrTnxIzXw'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Performance Tree API functions
export const performanceTreeAPI = {
  // Save performance tree data
  async savePerformanceTree(data) {
    try {
      const { data: result, error } = await supabase
        .from('performance_trees')
        .upsert({
          id: data.id,
          tree_data: data,
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return { success: true, data: result }
    } catch (error) {
      console.error('Error saving performance tree:', error)
      return { success: false, error: error.message }
    }
  },

  // Load performance tree data
  async loadPerformanceTree(id = '1') {
    try {
      const { data, error } = await supabase
        .from('performance_trees')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { success: true, data: data?.tree_data || null }
    } catch (error) {
      console.error('Error loading performance tree:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all performance trees
  async getAllPerformanceTrees() {
    try {
      const { data, error } = await supabase
        .from('performance_trees')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error loading performance trees:', error)
      return { success: false, error: error.message }
    }
  }
}

// Cascading Performance API functions
export const cascadingAPI = {
  // Save cascading data
  async saveCascading(data) {
    try {
      const { data: result, error } = await supabase
        .from('cascading_performance')
        .upsert({
          id: data.id,
          cascading_data: data,
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return { success: true, data: result }
    } catch (error) {
      console.error('Error saving cascading data:', error)
      return { success: false, error: error.message }
    }
  },

  // Load cascading data
  async loadCascading(id = '1') {
    try {
      const { data, error } = await supabase
        .from('cascading_performance')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { success: true, data: data?.cascading_data || null }
    } catch (error) {
      console.error('Error loading cascading data:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all cascading data
  async getAllCascading() {
    try {
      const { data, error } = await supabase
        .from('cascading_performance')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error loading cascading data:', error)
      return { success: false, error: error.message }
    }
  }
}

// Outcomes API functions
export const outcomesAPI = {
  // Save outcome data
  async saveOutcome(outcome) {
    try {
      const { data, error } = await supabase
        .from('outcomes')
        .upsert({
          id: outcome.id || crypto.randomUUID(),
          name: outcome.name,
          indicators: outcome.indicators,
          type: outcome.type,
          created_at: outcome.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving outcome:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all outcomes
  async getAllOutcomes() {
    try {
      const { data, error } = await supabase
        .from('outcomes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error loading outcomes:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete outcome
  async deleteOutcome(id) {
    try {
      const { error } = await supabase
        .from('outcomes')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting outcome:', error)
      return { success: false, error: error.message }
    }
  }
}