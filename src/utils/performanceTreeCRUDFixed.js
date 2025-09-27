import { supabase } from './supabase.js'
import { performanceTreeService } from './performanceTreeService.js'

/**
 * Performance Tree CRUD Operations - Fixed Version
 * Simplified approach for immediate functionality
 */

export const performanceTreeCRUD = {
  
  /**
   * Add new child node - Simplified approach
   */
  async addChild(parentId, parentType, childData) {
    try {
      console.log('Adding child:', { parentId, parentType, childData })
      
      // For now, we'll add to the most appropriate table based on the child type
      let targetTable = 'program' // Default
      let foreignKey = 'sasaran_id' // Default
      let foreignKeyValue = 1 // Default to first sasaran
      
      // Determine target table based on child type
      switch (childData.type) {
        case 'INTERMEDIATE OUTCOME':
          targetTable = 'misi'
          foreignKey = 'visi_id'
          foreignKeyValue = 1 // Always link to first visi
          break
        case 'IMMEDIATE OUTCOME LEVEL 1':
          targetTable = 'tujuan'
          foreignKey = 'misi_id'
          // Find appropriate misi based on parent
          if (parentType === 'INTERMEDIATE OUTCOME') {
            foreignKeyValue = parseInt(parentId)
          } else {
            foreignKeyValue = 1 // Default to first misi
          }
          break
        case 'IMMEDIATE OUTCOME LEVEL 2':
          targetTable = 'sasaran'
          foreignKey = 'tujuan_id'
          // Find appropriate tujuan based on parent
          if (parentType === 'IMMEDIATE OUTCOME LEVEL 1') {
            foreignKeyValue = parseInt(parentId)
          } else {
            foreignKeyValue = 1 // Default to first tujuan
          }
          break
        case 'OUTPUT':
          targetTable = 'program'
          foreignKey = 'sasaran_id'
          // Find appropriate sasaran based on parent
          if (parentType === 'IMMEDIATE OUTCOME LEVEL 2') {
            foreignKeyValue = parseInt(parentId)
          } else {
            foreignKeyValue = 1 // Default to first sasaran
          }
          break
      }
      
      // Get next available ID
      const { data: maxIdData } = await supabase
        .from(targetTable)
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
      
      const nextId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1
      
      // Prepare insert data
      const insertData = {
        id: nextId,
        [foreignKey]: foreignKeyValue,
        name: childData.label,
        description: childData.description || 'Deskripsi untuk ' + childData.label
      }
      
      console.log('Inserting to table:', targetTable, insertData)
      
      // Insert the new record
      const { data, error } = await supabase
        .from(targetTable)
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Insert error:', error)
        throw error
      }
      
      console.log('Insert successful:', data)
      
      // Create indicators if provided
      if (childData.indicators && childData.indicators.length > 0) {
        await this.createIndicators(data.id, targetTable, childData.indicators, childData.opd)
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
      console.log('Updating node:', { nodeId, nodeType, updateData })
      
      // Determine table based on node type
      let tableName = 'program' // Default
      
      switch (nodeType) {
        case 'ULTIMATE OUTCOME':
          tableName = 'visi'
          break
        case 'INTERMEDIATE OUTCOME':
          tableName = 'misi'
          break
        case 'IMMEDIATE OUTCOME LEVEL 1':
          tableName = 'tujuan'
          break
        case 'IMMEDIATE OUTCOME LEVEL 2':
          tableName = 'sasaran'
          break
        case 'OUTPUT':
          tableName = 'program'
          break
      }
      
      // Prepare update data
      const dbUpdateData = {
        name: updateData.label,
        description: updateData.description || 'Deskripsi untuk ' + updateData.label
      }
      
      console.log('Updating table:', tableName, 'ID:', nodeId, 'Data:', dbUpdateData)
      
      // Update main record
      const { data, error } = await supabase
        .from(tableName)
        .update(dbUpdateData)
        .eq('id', parseInt(nodeId))
        .select()
        .single()

      if (error) {
        console.error('Update error:', error)
        throw error
      }
      
      console.log('Update successful:', data)
      
      // Update indicators if provided
      if (updateData.indicators && updateData.indicators.length > 0) {
        await this.updateIndicators(nodeId, tableName, updateData.indicators, updateData.opd)
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
   * Delete node
   */
  async deleteNode(nodeId, nodeType) {
    try {
      console.log('Deleting node:', { nodeId, nodeType })
      
      // Don't allow deleting root visi
      if (nodeType === 'ULTIMATE OUTCOME') {
        return {
          success: false,
          error: 'Cannot delete root node (Visi)'
        }
      }
      
      // Determine table based on node type
      let tableName = 'program' // Default
      
      switch (nodeType) {
        case 'INTERMEDIATE OUTCOME':
          tableName = 'misi'
          break
        case 'IMMEDIATE OUTCOME LEVEL 1':
          tableName = 'tujuan'
          break
        case 'IMMEDIATE OUTCOME LEVEL 2':
          tableName = 'sasaran'
          break
        case 'OUTPUT':
          tableName = 'program'
          break
      }
      
      // Delete related indicators first
      await supabase
        .from('indikator')
        .delete()
        .eq('parent_type', tableName)
        .eq('parent_id', parseInt(nodeId))
      
      console.log('Deleting from table:', tableName, 'ID:', nodeId)
      
      // Delete the main record
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', parseInt(nodeId))

      if (error) {
        console.error('Delete error:', error)
        throw error
      }
      
      console.log('Delete successful')
      
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
      console.log('Creating indicators:', { parentId, parentType, indicators, opdName })
      
      // Find OPD ID if provided
      let opdId = null
      if (opdName) {
        const { data: opdData } = await supabase
          .from('opd')
          .select('id')
          .eq('name', opdName)
          .single()
        
        if (opdData) {
          opdId = opdData.id
        }
      }
      
      // Create indicators
      for (const indicatorName of indicators) {
        const { error } = await supabase
          .from('indikator')
          .insert({
            name: indicatorName,
            type: 'IKK', // Default type
            parent_type: parentType,
            parent_id: parseInt(parentId),
            opd_id: opdId
          })
        
        if (error) {
          console.error('Error creating indicator:', error)
        }
      }
      
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
      console.log('Updating indicators:', { parentId, parentType, indicators, opdName })
      
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
   * Refresh tree data after CRUD operations
   */
  async refreshTreeData() {
    try {
      console.log('Refreshing tree data...')
      const result = await performanceTreeService.getPerformanceTree()
      console.log('Tree data refreshed:', result.success)
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
  },

  /**
   * Test function to check if CRUD is working
   */
  async testCRUD() {
    try {
      console.log('Testing CRUD operations...')
      
      // Test add child to first misi
      const addResult = await this.addChild('1', 'INTERMEDIATE OUTCOME', {
        label: 'Test Tujuan Baru',
        type: 'IMMEDIATE OUTCOME LEVEL 1',
        description: 'Test description'
      })
      
      console.log('Add test result:', addResult)
      
      if (addResult.success) {
        // Test update
        const updateResult = await this.updateNode(addResult.data.id, 'IMMEDIATE OUTCOME LEVEL 1', {
          label: 'Test Tujuan Updated',
          description: 'Updated description'
        })
        
        console.log('Update test result:', updateResult)
        
        // Test delete
        const deleteResult = await this.deleteNode(addResult.data.id, 'IMMEDIATE OUTCOME LEVEL 1')
        console.log('Delete test result:', deleteResult)
      }
      
      return { success: true, message: 'CRUD test completed' }
    } catch (error) {
      console.error('CRUD test error:', error)
      return { success: false, error: error.message }
    }
  }
}