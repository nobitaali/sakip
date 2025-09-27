#!/usr/bin/env node

// Script untuk menampilkan semua tabel di Supabase
// Usage: node list-supabase-tables.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gymfkgorfgerqkoeuivl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bWZrZ29yZmdlcnFrb2V1aXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDg0NTksImV4cCI6MjA3NDUyNDQ1OX0.EO1vRJJAopAfzNCmybHFaMvVaUkGcnlzPyUrTnxIzXw'

const supabase = createClient(supabaseUrl, supabaseKey)

const printSeparator = (title) => {
  console.log('\n' + '='.repeat(80))
  console.log(`  ${title}`)
  console.log('='.repeat(80))
}

// Function to get all tables using information_schema
async function getAllTables() {
  printSeparator('LISTING ALL TABLES IN SUPABASE')
  
  try {
    // Query to get all tables from information_schema
    const { data, error } = await supabase
      .rpc('get_schema_tables')
      .select()

    if (error) {
      console.log('❌ RPC function not available, trying alternative method...')
      
      // Alternative: Try to query some common system tables
      const systemTables = [
        'information_schema.tables',
        'pg_catalog.pg_tables'
      ]
      
      for (const table of systemTables) {
        try {
          console.log(`\n🔍 Trying to query: ${table}`)
          const { data: tableData, error: tableError } = await supabase
            .from(table)
            .select('*')
            .limit(5)
          
          if (tableError) {
            console.log(`   ❌ Error: ${tableError.message}`)
          } else {
            console.log(`   ✅ Success: Found ${tableData.length} records`)
            if (tableData.length > 0) {
              console.log('   Sample data:', JSON.stringify(tableData[0], null, 2))
            }
          }
        } catch (err) {
          console.log(`   ❌ Exception: ${err.message}`)
        }
      }
      
      // Try to access known tables directly
      await tryKnownTables()
      
    } else {
      console.log('✅ Successfully retrieved table list:')
      console.log(data)
    }
    
  } catch (error) {
    console.log('❌ Error getting tables:', error.message)
    await tryKnownTables()
  }
}

// Function to try accessing known tables
async function tryKnownTables() {
  printSeparator('CHECKING KNOWN TABLES')
  
  const knownTables = [
    'performance_trees',
    'cascading_performance', 
    'outcomes',
    'users',
    'profiles',
    'auth.users'
  ]
  
  console.log('🔍 Checking access to known tables...\n')
  
  for (const tableName of knownTables) {
    try {
      console.log(`📋 Checking table: ${tableName}`)
      
      // Try to get count
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        if (error.message.includes('does not exist') || 
            error.message.includes('not found') ||
            error.message.includes('schema cache')) {
          console.log(`   ❌ Table does not exist`)
        } else if (error.message.includes('permission') || 
                   error.message.includes('access')) {
          console.log(`   🔒 Table exists but access denied`)
        } else {
          console.log(`   ⚠️  Error: ${error.message}`)
        }
      } else {
        console.log(`   ✅ Table exists with ${count} records`)
        
        // Try to get sample data
        try {
          const { data: sampleData, error: sampleError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1)
          
          if (!sampleError && sampleData && sampleData.length > 0) {
            console.log(`   📄 Sample columns: ${Object.keys(sampleData[0]).join(', ')}`)
          }
        } catch (sampleErr) {
          // Ignore sample data errors
        }
      }
      
    } catch (err) {
      console.log(`   ❌ Exception: ${err.message}`)
    }
    
    console.log('') // Empty line for readability
  }
}

// Function to check database connection and basic info
async function checkConnection() {
  printSeparator('DATABASE CONNECTION INFO')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.auth.getSession()
    
    console.log('✅ Connection successful!')
    console.log(`📡 Supabase URL: ${supabaseUrl}`)
    console.log(`🔑 API Key: ${supabaseKey.substring(0, 20)}...`)
    console.log(`🔐 Session status: ${data?.session ? 'Authenticated' : 'Anonymous'}`)
    
    // Try to get some basic database info
    try {
      const { data: versionData, error: versionError } = await supabase
        .rpc('version')
      
      if (!versionError && versionData) {
        console.log(`🗄️  Database version: ${versionData}`)
      }
    } catch (err) {
      // Ignore version check errors
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message)
    return false
  }
  
  return true
}

// Function to list available RPC functions
async function listRPCFunctions() {
  printSeparator('AVAILABLE RPC FUNCTIONS')
  
  const commonRPCFunctions = [
    'version',
    'get_schema_tables',
    'get_table_info',
    'current_user',
    'current_database'
  ]
  
  console.log('🔍 Checking common RPC functions...\n')
  
  for (const funcName of commonRPCFunctions) {
    try {
      console.log(`🔧 Testing RPC: ${funcName}`)
      
      const { data, error } = await supabase.rpc(funcName)
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`   ❌ Function does not exist`)
        } else {
          console.log(`   ⚠️  Error: ${error.message}`)
        }
      } else {
        console.log(`   ✅ Function available`)
        if (data !== null && data !== undefined) {
          console.log(`   📄 Result: ${JSON.stringify(data).substring(0, 100)}...`)
        }
      }
      
    } catch (err) {
      console.log(`   ❌ Exception: ${err.message}`)
    }
    
    console.log('') // Empty line
  }
}

// Main function
async function main() {
  console.log('🚀 SUPABASE TABLE EXPLORER')
  console.log(`⏰ Started at: ${new Date().toLocaleString('id-ID')}`)
  
  const connected = await checkConnection()
  
  if (!connected) {
    console.log('❌ Cannot proceed without connection')
    process.exit(1)
  }
  
  await listRPCFunctions()
  await getAllTables()
  
  printSeparator('SUMMARY')
  console.log('✅ Table exploration completed')
  console.log('📋 Check the output above for available tables and their status')
  console.log(`⏰ Finished at: ${new Date().toLocaleString('id-ID')}`)
}

// Run the script
main().catch(console.error)