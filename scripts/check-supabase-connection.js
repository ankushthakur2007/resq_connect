// Simple script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkConnection() {
  console.log('Testing Supabase connection...');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Environment variables:');
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '✗ Not set'}`);
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✓ Set' : '✗ Not set'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials. Please check your .env.local file.');
    process.exit(1);
  }
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Try to query the database
    console.log('Attempting to query the database...');
    
    // First, check if the incidents table exists by querying it
    const { data: incidents, error: incidentsError } = await supabase
      .from('incidents')
      .select('id')
      .limit(1);
      
    if (incidentsError) {
      console.error('❌ Error querying incidents table:', incidentsError);
      console.log('\nPossible issues:');
      console.log('1. The "incidents" table may not exist');
      console.log('2. Your Supabase credentials may not have permission to access it');
      console.log('3. There might be a network connectivity issue');
      
      // Try a direct system table query to list tables
      console.log('\nAttempting to list available tables directly...');
      const { data: tableList, error: tableError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
        
      if (tableError) {
        console.error('❌ Could not list tables:', tableError);
        
        // Try a simple health check instead
        console.log('\nTrying basic health check...');
        const { error: healthError } = await supabase.auth.getSession();
        
        if (healthError) {
          console.error('❌ Failed to connect to Supabase:', healthError);
        } else {
          console.log('✅ Basic connection to Supabase is working');
          console.log('The issue may be with database permissions or table structure');
        }
      } else {
        console.log('Available tables:', tableList);
      }
      
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('Data returned:', incidents);
    
    // Try to get table information from the information schema
    console.log('\nChecking incidents table schema...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'incidents')
      .eq('table_schema', 'public');
      
    if (columnsError) {
      console.error('❌ Could not get table schema:', columnsError);
    } else {
      console.log('Incidents table columns:', columns);
    }
    
    console.log('\n✅ Supabase connection test completed successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

checkConnection(); 