#!/usr/bin/env node

// Script untuk output performance tree dalam format JSON lengkap
// Usage: node output-performance-tree.js

import { performanceTreeService } from './src/utils/performanceTreeService.js'
import { cascadingService } from './src/utils/cascadingService.js'

async function outputPerformanceTree() {
  console.log('🚀 PERFORMANCE TREE JSON OUTPUT')
  console.log('=' .repeat(80))
  
  try {
    const result = await performanceTreeService.getPerformanceTree()
    
    if (result.success) {
      console.log('✅ SUCCESS - Performance Tree Generated')
      console.log('\n📊 PERFORMANCE TREE JSON:')
      console.log(JSON.stringify(result.data, null, 2))
    } else {
      console.log('❌ ERROR:', result.error)
    }
  } catch (error) {
    console.log('❌ EXCEPTION:', error.message)
  }
}

async function outputCascadingStructure() {
  console.log('\n\n🚀 CASCADING STRUCTURE JSON OUTPUT')
  console.log('=' .repeat(80))
  
  try {
    const result = await cascadingService.getCascadingStructure()
    
    if (result.success) {
      console.log('✅ SUCCESS - Cascading Structure Generated')
      console.log('\n📊 CASCADING STRUCTURE JSON:')
      console.log(JSON.stringify(result.data, null, 2))
    } else {
      console.log('❌ ERROR:', result.error)
    }
  } catch (error) {
    console.log('❌ EXCEPTION:', error.message)
  }
}

// Main execution
async function main() {
  await outputPerformanceTree()
  await outputCascadingStructure()
  
  console.log('\n\n✅ Output completed!')
  console.log('📋 You can copy the JSON above to use in your application')
}

main().catch(console.error)