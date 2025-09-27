#!/usr/bin/env node

// Script untuk test Cascading CRUD operations
// Usage: node test-cascading-crud.js

import { cascadingCRUD } from './src/utils/cascadingCRUD.js'

async function testCascadingCRUD() {
  console.log('🚀 Testing Cascading CRUD Operations')
  console.log('=' .repeat(50))
  
  try {
    // Test 1: Add tujuan to first misi (ID: 1)
    console.log('\n📝 Test 1: Adding new tujuan to misi ID 1')
    const addResult = await cascadingCRUD.addChild('1', 'misi', {
      name: 'Test Tujuan Cascading CRUD',
      type: 'tujuan',
      description: 'Tujuan test untuk Cascading CRUD operations'
    })
    
    console.log('Add Result:', addResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (!addResult.success) {
      console.log('Error:', addResult.error)
      return
    }
    
    const newNodeId = addResult.data.id
    console.log('New Node ID:', newNodeId)
    
    // Test 2: Update the newly created node
    console.log('\n✏️  Test 2: Updating the new tujuan')
    const updateResult = await cascadingCRUD.updateNode(newNodeId, 'tujuan', {
      name: 'Test Tujuan Cascading CRUD - Updated',
      description: 'Updated description for Cascading CRUD test'
    })
    
    console.log('Update Result:', updateResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (!updateResult.success) {
      console.log('Error:', updateResult.error)
    }
    
    // Test 3: Add sasaran to the new tujuan
    console.log('\n📝 Test 3: Adding sasaran to the new tujuan')
    const addChildResult = await cascadingCRUD.addChild(newNodeId, 'tujuan', {
      name: 'Test Sasaran Cascading CRUD',
      type: 'sasaran',
      description: 'Sasaran test untuk Cascading CRUD operations'
    })
    
    console.log('Add Child Result:', addChildResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (!addChildResult.success) {
      console.log('Error:', addChildResult.error)
    }
    
    const childNodeId = addChildResult.success ? addChildResult.data.id : null
    
    // Test 4: Refresh cascading data
    console.log('\n🔄 Test 4: Refreshing cascading data')
    const refreshResult = await cascadingCRUD.refreshCascadingData()
    console.log('Refresh Result:', refreshResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (refreshResult.success) {
      console.log('Cascading nodes count:', countNodes(refreshResult.data))
    }
    
    // Test 5: Delete the child sasaran
    if (childNodeId) {
      console.log('\n🗑️  Test 5: Deleting the child sasaran')
      const deleteChildResult = await cascadingCRUD.deleteNode(childNodeId, 'sasaran')
      console.log('Delete Child Result:', deleteChildResult.success ? '✅ SUCCESS' : '❌ FAILED')
      if (!deleteChildResult.success) {
        console.log('Error:', deleteChildResult.error)
      }
    }
    
    // Test 6: Delete the main test tujuan
    console.log('\n🗑️  Test 6: Deleting the main test tujuan')
    const deleteResult = await cascadingCRUD.deleteNode(newNodeId, 'tujuan')
    console.log('Delete Result:', deleteResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (!deleteResult.success) {
      console.log('Error:', deleteResult.error)
    }
    
    // Final refresh
    console.log('\n🔄 Final: Refreshing cascading data after cleanup')
    const finalRefresh = await cascadingCRUD.refreshCascadingData()
    console.log('Final Refresh Result:', finalRefresh.success ? '✅ SUCCESS' : '❌ FAILED')
    if (finalRefresh.success) {
      console.log('Final cascading nodes count:', countNodes(finalRefresh.data))
    }
    
    console.log('\n🎉 Cascading CRUD Operations Test Completed!')
    
  } catch (error) {
    console.error('❌ Cascading test failed with error:', error.message)
  }
}

// Helper function to count nodes in cascading structure
function countNodes(node) {
  if (!node) return 0
  
  let count = 1
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(child => {
      count += countNodes(child)
    })
  }
  return count
}

// Run the test
testCascadingCRUD().catch(console.error)