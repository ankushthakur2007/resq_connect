// Script to check the actual column names in the incidents table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkTableColumns() {
  console.log('Checking columns in the incidents table...');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials. Please check your .env.local file.');
    process.exit(1);
  }
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // First verify the table exists
    const { data: existingTable, error: tableError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'incidents');
      
    if (tableError) {
      console.error('❌ Error checking for table existence:', tableError);
      process.exit(1);
    }
    
    if (!existingTable || existingTable.length === 0) {
      console.error('❌ The incidents table does not exist in the database.');
      process.exit(1);
    }
    
    console.log('✅ The incidents table exists.');
    
    // Get column information using system catalog tables
    const { data: columnInfo, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'incidents');
      
    if (columnError) {
      console.error('❌ Error getting column information:', columnError);
      
      // Try an alternative approach
      console.log('Trying alternative approach...');
      
      try {
        // Try to select from the table with a LIMIT 0 to get column details
        const { error: selectError } = await supabase
          .from('incidents')
          .select('*')
          .limit(0);
          
        if (selectError) {
          console.error('❌ Alternative approach failed:', selectError);
        } else {
          console.log('✅ Table is accessible but cannot get column details directly.');
        }
      } catch (alt_error) {
        console.error('❌ Alternative approach failed with exception:', alt_error);
      }
      
      process.exit(1);
    }
    
    if (!columnInfo || columnInfo.length === 0) {
      console.error('❌ No columns found in the incidents table.');
      process.exit(1);
    }
    
    console.log('\n=== Incidents Table Columns ===');
    columnInfo.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
    console.log('\n=== Column Names for Reference ===');
    console.log(columnInfo.map(col => col.column_name).join(', '));
    
    // Try to retrieve the most recent record to see the data structure
    const { data: sampleRecord, error: sampleError } = await supabase
      .from('incidents')
      .select('*')
      .limit(1)
      .order('created_at', { ascending: false });
      
    if (sampleError) {
      console.error('❌ Error getting sample record:', sampleError);
    } else if (sampleRecord && sampleRecord.length > 0) {
      console.log('\n=== Sample Record ===');
      console.log(JSON.stringify(sampleRecord[0], null, 2));
    } else {
      console.log('\n=== No sample records found ===');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

checkTableColumns(); 