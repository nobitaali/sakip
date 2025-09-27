#!/usr/bin/env node

// Script untuk test CRUD operations
// Usage: node test-crud-operations.js

import { performanceTreeCRUD } from './src/utils/performanceTreeCRUDFixed.js'

async function testCRUDOperations() {
  console.log('🚀 Testing CRUD Operations')
  console.log('=' .repeat(50))
  
  try {
    // Test 1: Add child to first misi (ID: 1)
    console.log('\n📝 Test 1: Adding new tujuan to misi ID 1')
    const addResult = await performanceTreeCRUD.addChild('1', 'INTERMEDIATE OUTCOME', {
      label: 'Test Tujuan CRUD',
      type: 'IMMEDIATE OUTCOME LEVEL 1',
      description: 'Tujuan test untuk CRUD operations'
    })
    
    console.log('Add Result:', addResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (!addResult.success) {
      console.log('Error:', addResult.error)
      return
    }
    
    const newNodeId = addResult.data.id
    console.log('New Node ID:', newNodeId)
    
    // Test 2: Update the newly created node
    console.log('\n✏️  Test 2: Updating the new node')
    const updateResult = await performanceTreeCRUD.updateNode(newNodeId, 'IMMEDIATE OUTCOME LEVEL 1', {
      label: 'Test Tujuan CRUD - Updated',
      description: 'Updated description for CRUD test'
    })
    
    console.log('Update Result:', updateResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (!updateResult.success) {
      console.log('Error:', updateResult.error)
    }
    
    // Test 3: Add child to the new node
    console.log('\n📝 Test 3: Adding sasaran to the new tujuan')
    const addChildResult = await performanceTreeCRUD.addChild(newNodeId, 'IMMEDIATE OUTCOME LEVEL 1', {
      label: 'Test Sasaran CRUD',
      type: 'IMMEDIATE OUTCOME LEVEL 2',
      description: 'Sasaran test untuk CRUD operations'
    })
    
    console.log('Add Child Result:', addChildResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (!addChildResult.success) {
      console.log('Error:', addChildResult.error)
    }
    
    const childNodeId = addChildResult.success ? addChildResult.data.id : null
    
    // Test 4: Refresh tree data
    console.log('\n🔄 Test 4: Refreshing tree data')
    const refreshResult = await performanceTreeCRUD.refreshTreeData()
    console.log('Refresh Result:', refreshResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (refreshResult.success) {
      console.log('Tree nodes count:', countNodes(refreshResult.data))
    }
    
    // Test 5: Delete the child node
    if (childNodeId) {
      console.log('\n🗑️  Test 5: Deleting the child sasaran')
      const deleteChildResult = await performanceTreeCRUD.deleteNode(childNodeId, 'IMMEDIATE OUTCOME LEVEL 2')
      console.log('Delete Child Result:', deleteChildResult.success ? '✅ SUCCESS' : '❌ FAILED')
      if (!deleteChildResult.success) {
        console.log('Error:', deleteChildResult.error)
      }
    }
    
    // Test 6: Delete the main test node
    console.log('\n🗑️  Test 6: Deleting the main test tujuan')
    const deleteResult = await performanceTreeCRUD.deleteNode(newNodeId, 'IMMEDIATE OUTCOME LEVEL 1')
    console.log('Delete Result:', deleteResult.success ? '✅ SUCCESS' : '❌ FAILED')
    if (!deleteResult.success) {
      console.log('Error:', deleteResult.error)
    }
    
    // Final refresh
    console.log('\n🔄 Final: Refreshing tree data after cleanup')
    const finalRefresh = await performanceTreeCRUD.refreshTreeData()
    console.log('Final Refresh Result:', finalRefresh.success ? '✅ SUCCESS' : '❌ FAILED')
    if (finalRefresh.success) {
      console.log('Final tree nodes count:', countNodes(finalRefresh.data))
    }
    
    console.log('\n�� CRUD Operations Test Completed!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

// Helper function to count nodes in tree
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
testCRUDOperations().catch(console.error)