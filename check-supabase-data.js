#!/usr/bin/env node

// Script untuk mengecek semua data dari Supabase
// Usage: node check-supabase-data.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gymfkgorfgerqkoeuivl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWZrZ29yZmdlcnFrb2V1aXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDg0NTksImV4cCI6MjA3NDUyNDQ1OX0.EO1vRJJAopAfzNCmybHFaMvVaUkGcnlzPyUrTnxIzXw'

const supabase = createClient(supabaseUrl, supabaseKey)

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const printSeparator = (title) => {
  console.log('\n' + '='.repeat(80))
  console.log(`  ${title}`)
  console.log('='.repeat(80))
}

const printSubSeparator = (title) => {
  console.log('\n' + '-'.repeat(60))
  console.log(`  ${title}`)
  console.log('-'.repeat(60))
}

// Check Performance Trees
async function checkPerformanceTrees() {
  printSeparator('PERFORMANCE TREES')
  
  try {
    const { data, error } = await supabase
      .from('performance_trees')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error

    console.log(`📊 Total Records: ${data.length}`)
    
    if (data.length === 0) {
      console.log('❌ Tidak ada data performance trees')
      return
    }

    data.forEach((row, index) => {
      printSubSeparator(`Record ${index + 1}`)
      console.log(`ID: ${row.id}`)
      console.log(`Created: ${formatDate(row.created_at)}`)
      console.log(`Updated: ${formatDate(row.updated_at)}`)
      
      if (row.tree_data) {
        console.log(`Tree Label: ${row.tree_data.label || 'N/A'}`)
        console.log(`Tree Type: ${row.tree_data.type || 'N/A'}`)
        console.log(`Achievement: ${row.tree_data.achievement || 'N/A'}`)
        console.log(`Target: ${row.tree_data.target || 'N/A'}`)
        console.log(`Status: ${row.tree_data.status || 'N/A'}`)
        console.log(`Children Count: ${row.tree_data.children ? row.tree_data.children.length : 0}`)
        
        // Count total nodes in tree
        const countNodes = (node) => {
          let count = 1
          if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => {
              count += countNodes(child)
            })
          }
          return count
        }
        console.log(`Total Nodes: ${countNodes(row.tree_data)}`)
      }
      
      console.log(`\nJSON Size: ${JSON.stringify(row.tree_data).length} characters`)
    })

  } catch (error) {
    console.error('❌ Error fetching performance trees:', error.message)
  }
}

// Check Cascading Performance
async function checkCascadingPerformance() {
  printSeparator('CASCADING PERFORMANCE')
  
  try {
    const { data, error } = await supabase
      .from('cascading_performance')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error

    console.log(`📊 Total Records: ${data.length}`)
    
    if (data.length === 0) {
      console.log('❌ Tidak ada data cascading performance')
      return
    }

    data.forEach((row, index) => {
      printSubSeparator(`Record ${index + 1}`)
      console.log(`ID: ${row.id}`)
      console.log(`Created: ${formatDate(row.created_at)}`)
      console.log(`Updated: ${formatDate(row.updated_at)}`)
      
      if (row.cascading_data) {
        console.log(`Name: ${row.cascading_data.name || 'N/A'}`)
        console.log(`Type: ${row.cascading_data.type || 'N/A'}`)
        console.log(`Description: ${row.cascading_data.description || 'N/A'}`)
        console.log(`Children Count: ${row.cascading_data.children ? row.cascading_data.children.length : 0}`)
        
        // Count total nodes in cascading
        const countNodes = (node) => {
          let count = 1
          if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => {
              count += countNodes(child)
            })
          }
          return count
        }
        console.log(`Total Nodes: ${countNodes(row.cascading_data)}`)
      }
      
      console.log(`\nJSON Size: ${JSON.stringify(row.cascading_data).length} characters`)
    })

  } catch (error) {
    console.error('❌ Error fetching cascading performance:', error.message)
  }
}

// Check Outcomes
async function checkOutcomes() {
  printSeparator('OUTCOMES')
  
  try {
    const { data, error } = await supabase
      .from('outcomes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`📊 Total Records: ${data.length}`)
    
    if (data.length === 0) {
      console.log('❌ Tidak ada data outcomes')
      return
    }

    // Group by type
    const groupedByType = data.reduce((acc, outcome) => {
      const type = outcome.type || 'Unknown'
      if (!acc[type]) acc[type] = []
      acc[type].push(outcome)
      return acc
    }, {})

    console.log('\n📈 Breakdown by Type:')
    Object.entries(groupedByType).forEach(([type, outcomes]) => {
      console.log(`  ${type}: ${outcomes.length} records`)
    })

    // Group by OPD
    const groupedByOPD = data.reduce((acc, outcome) => {
      const opd = outcome.opd || 'No OPD'
      if (!acc[opd]) acc[opd] = []
      acc[opd].push(outcome)
      return acc
    }, {})

    console.log('\n🏢 Breakdown by OPD:')
    Object.entries(groupedByOPD).forEach(([opd, outcomes]) => {
      console.log(`  ${opd}: ${outcomes.length} records`)
    })

    // Group by status
    const groupedByStatus = data.reduce((acc, outcome) => {
      const status = outcome.status || 'No Status'
      if (!acc[status]) acc[status] = []
      acc[status].push(outcome)
      return acc
    }, {})

    console.log('\n📊 Breakdown by Status:')
    Object.entries(groupedByStatus).forEach(([status, outcomes]) => {
      console.log(`  ${status}: ${outcomes.length} records`)
    })

    // Show individual records
    data.forEach((row, index) => {
      printSubSeparator(`Record ${index + 1}`)
      console.log(`ID: ${row.id}`)
      console.log(`Name: ${row.name}`)
      console.log(`Type: ${row.type}`)
      console.log(`OPD: ${row.opd || 'N/A'}`)
      console.log(`Achievement: ${row.achievement || 'N/A'}`)
      console.log(`Target: ${row.target || 'N/A'}`)
      console.log(`Status: ${row.status || 'N/A'}`)
      console.log(`Trend: ${row.trend || 'N/A'}`)
      console.log(`Indicators: ${Array.isArray(row.indicators) ? row.indicators.length : 0} items`)
      if (Array.isArray(row.indicators) && row.indicators.length > 0) {
        console.log(`  - ${row.indicators.join(', ')}`)
      }
      console.log(`Created: ${formatDate(row.created_at)}`)
      console.log(`Updated: ${formatDate(row.updated_at)}`)
    })

  } catch (error) {
    console.error('❌ Error fetching outcomes:', error.message)
  }
}

// Check database connection
async function checkConnection() {
  printSeparator('DATABASE CONNECTION TEST')
  
  try {
    const { data, error } = await supabase
      .from('performance_trees')
      .select('count', { count: 'exact', head: true })

    if (error) throw error
    
    console.log('✅ Connection successful!')
    console.log(`📡 Supabase URL: ${supabaseUrl}`)
    console.log(`🔑 Using anon key: ${supabaseKey.substring(0, 20)}...`)
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }
}

// Main function
async function main() {
  console.log('🚀 SAKIP Supabase Data Checker')
  console.log(`⏰ Started at: ${new Date().toLocaleString('id-ID')}`)
  
  await checkConnection()
  await checkPerformanceTrees()
  await checkCascadingPerformance()
  await checkOutcomes()
  
  printSeparator('SUMMARY')
  console.log('✅ Data check completed successfully!')
  console.log(`⏰ Finished at: ${new Date().toLocaleString('id-ID')}`)
  console.log('\n📋 Analysis report saved to: SUPABASE_ANALYSIS.md')
}

// Run the script
main().catch(console.error)