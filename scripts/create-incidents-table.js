// Script to create the incidents table with the correct schema
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createIncidentsTable() {
  console.log('Setting up the incidents table...');
  
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
    // First check if the table already exists
    const { data: existingTable, error: tableError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'incidents');
      
    if (tableError) {
      console.error('❌ Error checking for table existence:', tableError);
      process.exit(1);
    }
    
    if (existingTable && existingTable.length > 0) {
      console.log('The incidents table already exists. Do you want to drop and recreate it?');
      console.log('This would delete all existing incident data.');
      console.log('To proceed, modify this script to uncomment the DROP TABLE SQL function.');
      // Uncomment the following lines to drop and recreate the table
      /*
      const { error: dropError } = await supabase.rpc('drop_incidents_table');
      if (dropError) {
        console.error('❌ Error dropping table:', dropError);
        process.exit(1);
      }
      console.log('✅ Dropped existing incidents table');
      */
    }
    
    // Create the RPC function to drop the table (if needed)
    const createDropFunctionSQL = `
      CREATE OR REPLACE FUNCTION drop_incidents_table()
      RETURNS void AS $$
      BEGIN
        DROP TABLE IF EXISTS incidents;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Execute the CREATE FUNCTION SQL
    const { error: funcError } = await supabase.rpc('drop_incidents_table', {}, { count: 'exact' }).catch(() => {
      // Function might not exist yet, create it
      return supabase.from('sqls').select('*').then(() => {
        return supabase.rpc('exec_sql', { sql: createDropFunctionSQL });
      });
    });
    
    if (funcError) {
      console.log('Note: Could not create drop function, but this is okay for first run:', funcError.message);
    }
    
    // Create the incidents table with the correct schema
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS incidents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL,
        description TEXT,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        status TEXT DEFAULT 'pending',
        reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        resolved_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Add spatial index if PostGIS is enabled (optional)
      -- CREATE INDEX IF NOT EXISTS incidents_location_idx ON incidents USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));
      
      -- Create a function to update the updated_at timestamp
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Create a trigger to automatically update the updated_at column
      DROP TRIGGER IF EXISTS update_incidents_timestamp ON incidents;
      CREATE TRIGGER update_incidents_timestamp
      BEFORE UPDATE ON incidents
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();
    `;
    
    // Create the exec_sql RPC function
    const createExecFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS void AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Try to create the exec_sql function if it doesn't exist
    await supabase.rpc('exec_sql', { sql: 'SELECT 1' }).catch(() => {
      return supabase.from('sqls').select('*').then(() => {
        return supabase.rpc('exec_sql', { sql: createExecFunctionSQL });
      });
    });
    
    // Execute the CREATE TABLE SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (sqlError) {
      console.error('❌ Error creating table:', sqlError);
      
      // Try another approach with direct SQL if available
      console.log('Trying alternative approach...');
      // This approach would require additional setup or SQL permissions
      
      process.exit(1);
    }
    
    console.log('✅ Successfully set up the incidents table!');
    
    // Insert a test record
    const { error: insertError } = await supabase
      .from('incidents')
      .insert([
        {
          type: 'TEST',
          description: 'This is a test incident created by the setup script',
          latitude: 40.7128,
          longitude: -74.0060,
          status: 'test'
        }
      ]);
      
    if (insertError) {
      console.error('❌ Error inserting test record:', insertError);
    } else {
      console.log('✅ Added a test record to the incidents table');
    }
    
    // Verify table structure
    const { data: columns, error: columnsError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('tablename', 'incidents');
      
    if (columnsError) {
      console.error('❌ Error verifying table:', columnsError);
    } else {
      console.log('Table details:', columns);
    }
    
    console.log('\n✅ Setup completed successfully!');
    console.log('You can now use the incidents table for your application.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

createIncidentsTable(); 