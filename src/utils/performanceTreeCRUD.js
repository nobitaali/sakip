import { supabase } from './supabase.js'
import { performanceTreeService } from './performanceTreeService.js'

/**
 * Performance Tree CRUD Operations
 * Handles Create, Read, Update, Delete operations for relational database structure
 */

// Helper function to determine database table and level based on node type
const getTableInfoFromType = (type) => {
  const typeMapping = {
    'ULTIMATE OUTCOME': { table: 'visi', level: 0 },
    'INTERMEDIATE OUTCOME': { table: 'misi', level: 1 },
    'IMMEDIATE OUTCOME LEVEL 1': { table: 'tujuan', level: 2 },
    'IMMEDIATE OUTCOME LEVEL 2': { table: 'sasaran', level: 3 },
    'OUTPUT': { table: 'program', level: 4 } // Default to program, could be kegiatan or sub_kegiatan
  }
  
  return typeMapping[type] || { table: 'program', level: 4 }
}

// Helper function to determine parent table based on level
const getParentTableFromLevel = (level) => {
  const levelMapping = {
    1: 'visi',
    2: 'misi', 
    3: 'tujuan',
    4: 'sasaran',
    5: 'program',
    6: 'kegiatan'
  }
  
  return levelMapping[level] || 'sasaran'
}

// Helper function to get next available ID for a table
const getNextId = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .order('id', { ascending: false })
      .limit(1)

    if (error) throw error
    
    return data && data.length > 0 ? data[0].id + 1 : 1
  } catch (error) {
    console.error(`Error getting next ID for ${tableName}:`, error)
    return Date.now() // Fallback to timestamp
  }
}

// Helper function to find OPD ID by name
const findOPDByName = async (opdName) => {
  if (!opdName) return null
  
  try {
    const { data, error } = await supabase
      .from('opd')
      .select('id')
      .eq('name', opdName)
      .single()

    if (error) throw error
    return data ? data.id : null
  } catch (error) {
    console.error('Error finding OPD:', error)
    return null
  }
}

export const performanceTreeCRUD = {
  
  /**
   * Add new child node to performance tree
   */
  async addChild(parentId, parentType, childData) {
    try {
      const parentTableInfo = getTableInfoFromType(parentType)
      const childLevel = parentTableInfo.level + 1
      const childTable = getParentTableFromLevel(childLevel)
      
      // Determine foreign key column name
      const foreignKeyColumn = `${parentTableInfo.table}_id`
      
      // Get next ID for child table
      const nextId = await getNextId(childTable)
      
      // Prepare child data for database
      const dbChildData = {
        id: nextId,
        [foreignKeyColumn]: parseInt(parentId),
        name: childData.label,
        description: childData.description || '...'
      }
      
      // Insert into appropriate table
      const { data, error } = await supabase
        .from(childTable)
        .insert(dbChildData)
        .select()
        .single()

      if (error) throw error
      
      // If child has indicators, create them
      if (childData.indicators && childData.indicators.length > 0) {
        await this.createIndicators(data.id, childTable, childData.indicators, childData.opd)
      }
      
      // Create performance data if provided
      if (childData.achievement !== undefined || childData.target !== undefined) {
        await this.createPerformanceData(data.id, childTable, {
          achievement: childData.achievement,
          target: childData.target,
          status: childData.status,
          trend: childData.trend
        })
      }
      
      return {
        success: true,
        data: {
          ...data,
          id: data.id.toString(),
          type: childData.type,
          label: data.name,
          ...childData
        }
      }
      
    } catch (error) {
      console.error('Error adding child:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Update existing node
   */
  async updateNode(nodeId, nodeType, updateData) {
    try {
      const tableInfo = getTableInfoFromType(nodeType)
      const tableName = tableInfo.table
      
      // Prepare update data
      const dbUpdateData = {
        name: updateData.label,
        description: updateData.description || '...'
      }
      
      // Update main record
      const { data, error } = await supabase
        .from(tableName)
        .update(dbUpdateData)
        .eq('id', parseInt(nodeId))
        .select()
        .single()

      if (error) throw error
      
      // Update indicators if provided
      if (updateData.indicators) {
        await this.updateIndicators(nodeId, tableName, updateData.indicators, updateData.opd)
      }
      
      // Update performance data if provided
      if (updateData.achievement !== undefined || updateData.target !== undefined) {
        await this.updatePerformanceData(nodeId, tableName, {
          achievement: updateData.achievement,
          target: updateData.target,
          status: updateData.status,
          trend: updateData.trend
        })
      }
      
      return {
        success: true,
        data: {
          ...data,
          id: data.id.toString(),
          type: nodeType,
          label: data.name,
          ...updateData
        }
      }
      
    } catch (error) {
      console.error('Error updating node:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Delete node and all its children
   */
  async deleteNode(nodeId, nodeType) {
    try {
      const tableInfo = getTableInfoFromType(nodeType)
      const tableName = tableInfo.table
      
      // Delete related indicators first
      await supabase
        .from('indikator')
        .delete()
        .eq('parent_type', tableName)
        .eq('parent_id', parseInt(nodeId))
      
      // Delete performance data if exists
      await this.deletePerformanceData(nodeId, tableName)
      
      // Delete the main record (cascade will handle children)
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', parseInt(nodeId))

      if (error) throw error
      
      return {
        success: true
      }
      
    } catch (error) {
      console.error('Error deleting node:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Create indicators for a node
   */
  async createIndicators(parentId, parentType, indicators, opdName) {
    try {
      const opdId = await findOPDByName(opdName)
      
      const indicatorPromises = indicators.map(async (indicatorName) => {
        return supabase
          .from('indikator')
          .insert({
            name: indicatorName,
            type: 'IKK', // Default type
            parent_type: parentType,
            parent_id: parseInt(parentId),
            opd_id: opdId
          })
      })
      
      await Promise.all(indicatorPromises)
      
      return { success: true }
    } catch (error) {
      console.error('Error creating indicators:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Update indicators for a node
   */
  async updateIndicators(parentId, parentType, indicators, opdName) {
    try {
      // Delete existing indicators
      await supabase
        .from('indikator')
        .delete()
        .eq('parent_type', parentType)
        .eq('parent_id', parseInt(parentId))
      
      // Create new indicators
      if (indicators && indicators.length > 0) {
        await this.createIndicators(parentId, parentType, indicators, opdName)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error updating indicators:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Create performance data (placeholder - would need performance_data table)
   */
  async createPerformanceData(parentId, parentType, performanceData) {
    try {
      // TODO: Implement when performance_data table is created
      console.log('Performance data would be saved:', {
        parentId,
        parentType,
        ...performanceData
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error creating performance data:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Update performance data
   */
  async updatePerformanceData(parentId, parentType, performanceData) {
    try {
      // TODO: Implement when performance_data table is created
      console.log('Performance data would be updated:', {
        parentId,
        parentType,
        ...performanceData
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error updating performance data:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Delete performance data
   */
  async deletePerformanceData(parentId, parentType) {
    try {
      // TODO: Implement when performance_data table is created
      console.log('Performance data would be deleted for:', {
        parentId,
        parentType
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting performance data:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Refresh tree data after CRUD operations
   */
  async refreshTreeData() {
    try {
      const result = await performanceTreeService.getPerformanceTree()
      return result
    } catch (error) {
      console.error('Error refreshing tree data:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Auto-save functionality with debouncing
   */
  createAutoSave(callback, delay = 2000) {
    let timeoutId
    
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        callback(...args)
      }, delay)
    }
  }
}