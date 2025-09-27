#!/usr/bin/env node

// Script untuk melihat tabel yang benar-benar ada di Supabase
// Usage: node check-existing-tables.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gymfkgorfgerqkoeuivl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWZrZ29yZmdlcnFrb2V1aXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDg0NTksImV4cCI6MjA3NDUyNDQ1OX0.EO1vRJJAopAfzNCmybHFaMvVaUkGcnlzPyUrTnxIzXw'

const supabase = createClient(supabaseUrl, supabaseKey)

const printSeparator = (title) => {
  console.log('\n' + '='.repeat(80))
  console.log(`  ${title}`)
  console.log('='.repeat(80))
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

// Function to test table access and show contents
async function checkTable(tableName) {
  console.log(`\n📋 Checking table: ${tableName}`)
  
  try {
    // Try to get count and sample data
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (error) {
      if (error.message.includes('does not exist') || 
          error.message.includes('not found') ||
          error.message.includes('schema cache')) {
        console.log(`   ❌ Table does not exist`)
        return false
      } else {
        console.log(`   ⚠️  Error: ${error.message}`)
        return false
      }
    }
    
    console.log(`   ✅ Table exists with ${count || 0} records`)
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0])
      console.log(`   📋 Columns (${columns.length}): ${columns.join(', ')}`)
      
      // Show sample data
      console.log(`   📄 Sample data:`)
      data.forEach((record, index) => {
        console.log(`      Record ${index + 1}:`)
        Object.entries(record).forEach(([key, value]) => {
          if (key.includes('_at')) {
            console.log(`        ${key}: ${formatDate(value)}`)
          } else if (typeof value === 'object' && value !== null) {
            console.log(`        ${key}: [Object/Array - ${JSON.stringify(value).length} chars]`)
          } else {
            const displayValue = String(value).length > 50 ? 
              String(value).substring(0, 50) + '...' : value
            console.log(`        ${key}: ${displayValue}`)
          }
        })
      })
    } else {
      console.log(`   📭 No data in table`)
    }
    
    return true
    
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`)
    return false
  }
}

// Function to discover existing tables by trying common table names
async function discoverTables() {
  printSeparator('DISCOVERING EXISTING TABLES')
  
  // Common table names to try
  const possibleTables = [
    // Auth related
    'users',
    'profiles',
    'user_profiles',
    'auth_users',
    
    // Performance related (new structure)
    'visi',
    'misi', 
    'tujuan',
    'sasaran',
    'program',
    'kegiatan',
    'sub_kegiatan',
    'indikator',
    'target',
    'capaian',
    'outcomes',
    'indicators',
    'achievements',
    'performance_data',
    'kinerja',
    
    // Organization related
    'opd',
    'organisasi',
    'dinas',
    'bagian',
    'seksi',
    
    // Planning related
    'renstra',
    'renja',
    'rkpd',
    'rpjmd',
    'perjanjian_kinerja',
    'rencana_aksi',
    
    // System tables
    'settings',
    'configurations',
    'logs',
    'audit_logs',
    
    // Other common names
    'data',
    'master_data',
    'reference',
    'lookup'
  ]
  
  const existingTables = []
  
  console.log(`🔍 Testing ${possibleTables.length} possible table names...\n`)
  
  for (const tableName of possibleTables) {
    const exists = await checkTable(tableName)
    if (exists) {
      existingTables.push(tableName)
    }
  }
  
  return existingTables
}

// Main function
async function main() {
  console.log('🚀 SUPABASE EXISTING TABLES DISCOVERY')
  console.log(`⏰ Started at: ${new Date().toLocaleString('id-ID')}`)
  
  // Test connection
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('✅ Connection successful')
    console.log(`📡 Supabase URL: ${supabaseUrl}`)
  } catch (err) {
    console.log('❌ Connection failed:', err.message)
    return
  }
  
  // Discover existing tables
  const existingTables = await discoverTables()
  
  printSeparator('SUMMARY')
  
  if (existingTables.length > 0) {
    console.log(`✅ Found ${existingTables.length} existing tables:`)
    existingTables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table}`)
    })
    
    console.log('\n📋 These are the tables you can work with in your application.')
    console.log('💡 You may need to update your Supabase utility functions to match these table names.')
    
  } else {
    console.log('❌ No accessible tables found')
    console.log('💡 This could mean:')
    console.log('   - Tables haven\'t been created yet')
    console.log('   - Tables exist but with different names')
    console.log('   - Permission issues with the API key')
    console.log('   - Tables are in a different schema')
  }
  
  console.log(`\n⏰ Finished at: ${new Date().toLocaleString('id-ID')}`)
}

// Run the script
main().catch(console.error)