#!/usr/bin/env node

// Script untuk menampilkan isi semua tabel di Supabase
// Usage: node show-table-contents.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gymfkgorfgerqkoeuivl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWZrZ29yZmdlcnFrb2V1aXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDg0NTksImV4cCI6MjA3NDUyNDQ1OX0.EO1vRJJAopAfzNCmybHFaMvVaUkGcnlzPyUrTnxIzXw'

const supabase = createClient(supabaseUrl, supabaseKey)

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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Function to show table contents
async function showTableContents(tableName, description = '') {
  printSeparator(`TABLE: ${tableName.toUpperCase()}`)
  
  if (description) {
    console.log(`📝 Description: ${description}`)
  }
  
  try {
    // Get count first
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.log(`❌ Error getting count: ${countError.message}`)
      return
    }
    
    console.log(`📊 Total Records: ${count || 0}`)
    
    if (count === 0) {
      console.log('📭 No data found in this table')
      return
    }
    
    // Get actual data
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10) // Limit to 10 records for readability
    
    if (error) {
      console.log(`❌ Error fetching data: ${error.message}`)
      return
    }
    
    if (!data || data.length === 0) {
      console.log('📭 No data returned')
      return
    }
    
    // Show column info
    const sampleRecord = data[0]
    const columns = Object.keys(sampleRecord)
    console.log(`📋 Columns (${columns.length}): ${columns.join(', ')}`)
    
    // Show each record
    data.forEach((record, index) => {
      printSubSeparator(`Record ${index + 1}`)
      
      Object.entries(record).forEach(([key, value]) => {
        if (key.includes('_at')) {
          console.log(`${key}: ${formatDate(value)}`)
        } else if (typeof value === 'object' && value !== null) {
          console.log(`${key}: [JSON Object - ${JSON.stringify(value).length} chars]`)
          // Show preview of JSON for smaller objects
          if (JSON.stringify(value).length < 200) {
            console.log(`  Preview: ${JSON.stringify(value, null, 2)}`)
          } else {
            // Show structure for large JSON objects
            if (Array.isArray(value)) {
              console.log(`  Type: Array with ${value.length} items`)
            } else {
              console.log(`  Type: Object with keys: ${Object.keys(value).join(', ')}`)
            }
          }
        } else {
          console.log(`${key}: ${value}`)
        }
      })
    })
    
    if (count > 10) {
      console.log(`\n... and ${count - 10} more records`)
    }
    
  } catch (error) {
    console.log(`❌ Exception: ${error.message}`)
  }
}

// Function to analyze JSON structure
function analyzeJSONStructure(obj, prefix = '') {
  if (typeof obj !== 'object' || obj === null) {
    return [`${prefix}: ${typeof obj}`]
  }
  
  if (Array.isArray(obj)) {
    return [`${prefix}: Array[${obj.length}]`]
  }
  
  const result = []
  Object.keys(obj).forEach(key => {
    const newPrefix = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        result.push(`${newPrefix}: Array[${obj[key].length}]`)
      } else {
        result.push(`${newPrefix}: Object`)
        // Don't go too deep
        if (prefix.split('.').length < 2) {
          result.push(...analyzeJSONStructure(obj[key], newPrefix))
        }
      }
    } else {
      result.push(`${newPrefix}: ${typeof obj[key]}`)
    }
  })
  
  return result
}

// Function to show detailed JSON analysis
async function showDetailedJSONAnalysis(tableName, jsonColumn) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(jsonColumn)
      .limit(1)
    
    if (error || !data || data.length === 0) {
      return
    }
    
    const jsonData = data[0][jsonColumn]
    if (!jsonData) {
      return
    }
    
    console.log(`\n🔍 JSON Structure Analysis for ${jsonColumn}:`)
    const structure = analyzeJSONStructure(jsonData)
    structure.forEach(item => console.log(`  ${item}`))
    
  } catch (error) {
    console.log(`❌ Error analyzing JSON: ${error.message}`)
  }
}

// Main function
async function main() {
  console.log('🚀 SUPABASE TABLE CONTENTS VIEWER')
  console.log(`⏰ Started at: ${new Date().toLocaleString('id-ID')}`)
  
  // Test connection
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('✅ Connection successful')
  } catch (err) {
    console.log('❌ Connection failed:', err.message)
    return
  }
  
  // Define tables to check
  const tables = [
    {
      name: 'performance_trees',
      description: 'Stores hierarchical performance tree data structure'
    },
    {
      name: 'cascading_performance', 
      description: 'Stores cascading performance data from vision to programs'
    },
    {
      name: 'outcomes',
      description: 'Stores individual outcome data with indicators and performance metrics'
    },
    {
      name: 'users',
      description: 'User accounts and basic information'
    },
    {
      name: 'profiles',
      description: 'Extended user profile information'
    }
  ]
  
  // Show contents of each table
  for (const table of tables) {
    await showTableContents(table.name, table.description)
    
    // Special handling for JSON columns
    if (table.name === 'performance_trees') {
      await showDetailedJSONAnalysis('performance_trees', 'tree_data')
    } else if (table.name === 'cascading_performance') {
      await showDetailedJSONAnalysis('cascading_performance', 'cascading_data')
    } else if (table.name === 'outcomes') {
      await showDetailedJSONAnalysis('outcomes', 'indicators')
    }
  }
  
  printSeparator('SUMMARY')
  console.log('✅ Table contents exploration completed')
  console.log('📋 All accessible tables have been displayed above')
  console.log(`⏰ Finished at: ${new Date().toLocaleString('id-ID')}`)
}

// Run the script
main().catch(console.error)