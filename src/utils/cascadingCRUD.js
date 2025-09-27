import { supabase } from './supabase.js'
import { cascadingService } from './cascadingService.js'

/**
 * Cascading CRUD Operations
 * Simplified approach for immediate functionality
 */

export const cascadingCRUD = {
  
  /**
   * Add new child node to cascading structure
   */
  async addChild(parentId, parentType, childData) {
    try {
      console.log('Adding cascading child:', { parentId, parentType, childData })
      
      // Determine target table and foreign key based on child type
      let targetTable = 'program' // Default
      let foreignKey = 'sasaran_id' // Default
      let foreignKeyValue = 1 // Default
      
      switch (childData.type) {
        case 'misi':
          targetTable = 'misi'
          foreignKey = 'visi_id'
          foreignKeyValue = 1 // Always link to first visi
          break
        case 'tujuan':
          targetTable = 'tujuan'
          foreignKey = 'misi_id'
          if (parentType === 'misi') {
            foreignKeyValue = parseInt(parentId)
          } else {
            foreignKeyValue = 1 // Default to first misi
          }
          break
        case 'sasaran':
          targetTable = 'sasaran'
          foreignKey = 'tujuan_id'
          if (parentType === 'tujuan') {
            foreignKeyValue = parseInt(parentId)
          } else {
            foreignKeyValue = 1 // Default to first tujuan
          }
          break
        case 'program':
          targetTable = 'program'
          foreignKey = 'sasaran_id'
          if (parentType === 'sasaran') {
            foreignKeyValue = parseInt(parentId)
          } else {
            foreignKeyValue = 1 // Default to first sasaran
          }
          break
        case 'kegiatan':
          targetTable = 'kegiatan'
          foreignKey = 'program_id'
          if (parentType === 'program') {
            foreignKeyValue = parseInt(parentId)
          } else {
            foreignKeyValue = 1 // Default to first program
          }
          break
        case 'sub_kegiatan':
          targetTable = 'sub_kegiatan'
          foreignKey = 'kegiatan_id'
          if (parentType === 'kegiatan') {
            foreignKeyValue = parseInt(parentId)
          } else {
            foreignKeyValue = 1 // Default to first kegiatan
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
        name: childData.name,
        description: childData.description || 'Deskripsi untuk ' + childData.name
      }
      
      console.log('Inserting to cascading table:', targetTable, insertData)
      
      // Insert the new record
      const { data, error } = await supabase
        .from(targetTable)
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Cascading insert error:', error)
        throw error
      }
      
      console.log('Cascading insert successful:', data)
      
      return {
        success: true,
        data: {
          ...data,
          id: data.id.toString(),
          type: childData.type,
          name: data.name,
          ...childData
        }
      }
      
    } catch (error) {
      console.error('Error adding cascading child:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Update existing cascading node
   */
  async updateNode(nodeId, nodeType, updateData) {
    try {
      console.log('Updating cascading node:', { nodeId, nodeType, updateData })
      
      // Determine table based on node type
      let tableName = 'program' // Default
      
      switch (nodeType) {
        case 'visi':
          tableName = 'visi'
          break
        case 'misi':
          tableName = 'misi'
          break
        case 'tujuan':
          tableName = 'tujuan'
          break
        case 'sasaran':
          tableName = 'sasaran'
          break
        case 'program':
          tableName = 'program'
          break
        case 'kegiatan':
          tableName = 'kegiatan'
          break
        case 'sub_kegiatan':
          tableName = 'sub_kegiatan'
          break
      }
      
      // Prepare update data
      const dbUpdateData = {
        name: updateData.name,
        description: updateData.description || 'Deskripsi untuk ' + updateData.name
      }
      
      console.log('Updating cascading table:', tableName, 'ID:', nodeId, 'Data:', dbUpdateData)
      
      // Update main record
      const { data, error } = await supabase
        .from(tableName)
        .update(dbUpdateData)
        .eq('id', parseInt(nodeId))
        .select()
        .single()

      if (error) {
        console.error('Cascading update error:', error)
        throw error
      }
      
      console.log('Cascading update successful:', data)
      
      return {
        success: true,
        data: {
          ...data,
          id: data.id.toString(),
          type: nodeType,
          name: data.name,
          ...updateData
        }
      }
      
    } catch (error) {
      console.error('Error updating cascading node:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Delete cascading node
   */
  async deleteNode(nodeId, nodeType) {
    try {
      console.log('Deleting cascading node:', { nodeId, nodeType })
      
      // Don't allow deleting root visi
      if (nodeType === 'visi') {
        return {
          success: false,
          error: 'Cannot delete root node (Visi)'
        }
      }
      
      // Determine table based on node type
      let tableName = 'program' // Default
      
      switch (nodeType) {
        case 'misi':
          tableName = 'misi'
          break
        case 'tujuan':
          tableName = 'tujuan'
          break
        case 'sasaran':
          tableName = 'sasaran'
          break
        case 'program':
          tableName = 'program'
          break
        case 'kegiatan':
          tableName = 'kegiatan'
          break
        case 'sub_kegiatan':
          tableName = 'sub_kegiatan'
          break
      }
      
      // Delete related indicators first
      await supabase
        .from('indikator')
        .delete()
        .eq('parent_type', tableName)
        .eq('parent_id', parseInt(nodeId))
      
      console.log('Deleting from cascading table:', tableName, 'ID:', nodeId)
      
      // Delete the main record
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', parseInt(nodeId))

      if (error) {
        console.error('Cascading delete error:', error)
        throw error
      }
      
      console.log('Cascading delete successful')
      
      return {
        success: true
      }
      
    } catch (error) {
      console.error('Error deleting cascading node:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Refresh cascading data after CRUD operations
   */
  async refreshCascadingData() {
    try {
      console.log('Refreshing cascading data...')
      const result = await cascadingService.getCascadingStructure()
      console.log('Cascading data refreshed:', result.success)
      return result
    } catch (error) {
      console.error('Error refreshing cascading data:', error)
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
   * Test function to check if cascading CRUD is working
   */
  async testCRUD() {
    try {
      console.log('Testing cascading CRUD operations...')
      
      // Test add child to first misi
      const addResult = await this.addChild('1', 'misi', {
        name: 'Test Tujuan Cascading',
        type: 'tujuan',
        description: 'Test description for cascading'
      })
      
      console.log('Cascading add test result:', addResult)
      
      if (addResult.success) {
        // Test update
        const updateResult = await this.updateNode(addResult.data.id, 'tujuan', {
          name: 'Test Tujuan Cascading Updated',
          description: 'Updated description for cascading'
        })
        
        console.log('Cascading update test result:', updateResult)
        
        // Test delete
        const deleteResult = await this.deleteNode(addResult.data.id, 'tujuan')
        console.log('Cascading delete test result:', deleteResult)
      }
      
      return { success: true, message: 'Cascading CRUD test completed' }
    } catch (error) {
      console.error('Cascading CRUD test error:', error)
      return { success: false, error: error.message }
    }
  }
}