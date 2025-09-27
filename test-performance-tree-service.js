#!/usr/bin/env node

// Script untuk menguji Performance Tree Service
// Usage: node test-performance-tree-service.js

import { performanceTreeService } from './src/utils/performanceTreeService.js'
import { cascadingService } from './src/utils/cascadingService.js'

const printSeparator = (title) => {
  console.log('\n' + '='.repeat(80))
  console.log(`  ${title}`)
  console.log('='.repeat(80))
}

const printJSON = (obj, maxDepth = 3) => {
  const replacer = (key, value, depth = 0) => {
    if (depth > maxDepth) {
      if (Array.isArray(value)) {
        return `[Array with ${value.length} items]`
      } else if (typeof value === 'object' && value !== null) {
        return `[Object with ${Object.keys(value).length} keys]`
      }
    }
    
    if (typeof value === 'object' && value !== null) {
      const newObj = {}
      for (const [k, v] of Object.entries(value)) {
        newObj[k] = replacer(k, v, depth + 1)
      }
      return newObj
    }
    
    return value
  }
  
  console.log(JSON.stringify(replacer('', obj), null, 2))
}

// Test Performance Tree Service
async function testPerformanceTreeService() {
  printSeparator('TESTING PERFORMANCE TREE SERVICE')
  
  try {
    console.log('🔍 Getting performance tree...')
    const result = await performanceTreeService.getPerformanceTree()
    
    if (result.success) {
      console.log('✅ Performance tree retrieved successfully!')
      console.log(`📊 Tree structure:`)
      printJSON(result.data, 2)
      
      // Count nodes
      const countNodes = (node) => {
        let count = 1
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(child => {
            count += countNodes(child)
          })
        }
        return count
      }
      
      const totalNodes = countNodes(result.data)
      console.log(`\n📈 Total nodes in tree: ${totalNodes}`)
      
      // Show tree levels
      const showLevels = (node, level = 0) => {
        const indent = '  '.repeat(level)
        console.log(`${indent}${level}: ${node.type} - ${node.label}`)
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => showLevels(child, level + 1))
        }
      }
      
      console.log(`\n🌳 Tree hierarchy:`)
      showLevels(result.data)
      
    } else {
      console.log('❌ Failed to get performance tree:', result.error)
    }
    
  } catch (error) {
    console.log('❌ Error testing performance tree service:', error.message)
  }
}

// Test Cascading Service
async function testCascadingService() {
  printSeparator('TESTING CASCADING SERVICE')
  
  try {
    console.log('🔍 Getting cascading structure...')
    const result = await cascadingService.getCascadingStructure()
    
    if (result.success) {
      console.log('✅ Cascading structure retrieved successfully!')
      console.log(`📊 Cascading structure:`)
      printJSON(result.data, 2)
      
      // Count nodes
      const countNodes = (node) => {
        let count = 1
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(child => {
            count += countNodes(child)
          })
        }
        return count
      }
      
      const totalNodes = countNodes(result.data)
      console.log(`\n📈 Total nodes in cascading: ${totalNodes}`)
      
      // Show cascading levels
      const showLevels = (node, level = 0) => {
        const indent = '  '.repeat(level)
        const opdInfo = node.opd ? ` (${node.opd})` : ''
        console.log(`${indent}${level}: ${node.type} - ${node.name}${opdInfo}`)
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => showLevels(child, level + 1))
        }
      }
      
      console.log(`\n🌳 Cascading hierarchy:`)
      showLevels(result.data)
      
    } else {
      console.log('❌ Failed to get cascading structure:', result.error)
    }
    
  } catch (error) {
    console.log('❌ Error testing cascading service:', error.message)
  }
}

// Test additional functions
async function testAdditionalFunctions() {
  printSeparator('TESTING ADDITIONAL FUNCTIONS')
  
  try {
    // Test get all OPD
    console.log('🔍 Getting all OPD...')
    const opdResult = await performanceTreeService.getAllOPD()
    if (opdResult.success) {
      console.log('✅ OPD list retrieved:')
      opdResult.data.forEach(opd => {
        console.log(`   - ${opd.name} (ID: ${opd.id})`)
      })
    }
    
    // Test get indicators by type
    console.log('\n🔍 Getting IKU indicators...')
    const ikuResult = await performanceTreeService.getIndicatorsByType('IKU')
    if (ikuResult.success) {
      console.log(`✅ Found ${ikuResult.data.length} IKU indicators:`)
      ikuResult.data.forEach(indicator => {
        console.log(`   - ${indicator.name} (${indicator.parent_type})`)
      })
    }
    
    console.log('\n���� Getting IKK indicators...')
    const ikkResult = await performanceTreeService.getIndicatorsByType('IKK')
    if (ikkResult.success) {
      console.log(`✅ Found ${ikkResult.data.length} IKK indicators:`)
      ikkResult.data.forEach(indicator => {
        const opdName = indicator.opd ? indicator.opd.name : 'No OPD'
        console.log(`   - ${indicator.name} (${indicator.parent_type}) - ${opdName}`)
      })
    }
    
    // Test cascading by OPD
    if (opdResult.success && opdResult.data.length > 0) {
      const firstOPD = opdResult.data[0]
      console.log(`\n🔍 Getting cascading for OPD: ${firstOPD.name}...`)
      const cascadingByOPD = await cascadingService.getCascadingByOPD(firstOPD.id)
      if (cascadingByOPD.success) {
        console.log('✅ Cascading by OPD retrieved successfully!')
        console.log(`📊 Structure for ${firstOPD.name}:`)
        printJSON(cascadingByOPD.data, 1)
      }
    }
    
  } catch (error) {
    console.log('❌ Error testing additional functions:', error.message)
  }
}

// Main function
async function main() {
  console.log('🚀 PERFORMANCE TREE & CASCADING SERVICE TESTER')
  console.log(`⏰ Started at: ${new Date().toLocaleString('id-ID')}`)
  
  await testPerformanceTreeService()
  await testCascadingService()
  await testAdditionalFunctions()
  
  printSeparator('SUMMARY')
  console.log('✅ Service testing completed!')
  console.log('📋 Check the output above for service functionality')
  console.log(`⏰ Finished at: ${new Date().toLocaleString('id-ID')}`)
}

// Run the script
main().catch(console.error)