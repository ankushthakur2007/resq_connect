// Simple script to check and fix the incidents table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fixIncidentsTable() {
  console.log('Checking and fixing the incidents table...');
  
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
    // Try to select data from incidents
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Error accessing incidents table:', error);
      
      if (error.code === '42P01') {
        console.log('Table does not exist. Creating it now...');
        
        // Create incidents table
        const createTableResult = await supabase
          .from('incidents')
          .insert([
            {
              type: 'TEST',
              description: 'Test incident',
              latitude: 40.7128,
              longitude: -74.0060,
              status: 'test'
            }
          ]);
          
        if (createTableResult.error) {
          console.error('❌ Error creating table:', createTableResult.error);
          
          // Try with lat/lng column names
          console.log('Trying with lat/lng column names...');
          const createTableResult2 = await supabase
            .from('incidents')
            .insert([
              {
                type: 'TEST',
                description: 'Test incident',
                lat: 40.7128,
                lng: -74.0060,
                status: 'test'
              }
            ]);
            
          if (createTableResult2.error) {
            console.error('❌ Second attempt also failed:', createTableResult2.error);
          } else {
            console.log('✅ Table created successfully with lat/lng columns');
            console.log('Update your form to use lat/lng instead of latitude/longitude');
          }
        } else {
          console.log('✅ Table created successfully with latitude/longitude columns');
        }
      }
    } else {
      console.log('✅ Incidents table exists and is accessible');
      console.log('Sample data:', data);
      
      // Check for column names to determine schema
      if (data && data.length > 0) {
        const sample = data[0];
        if ('lat' in sample && 'lng' in sample) {
          console.log('✅ Table has lat/lng columns');
          console.log('Update your form to use lat/lng instead of latitude/longitude');
        } else if ('latitude' in sample && 'longitude' in sample) {
          console.log('✅ Table has latitude/longitude columns');
          console.log('Your form is already configured correctly');
        } else {
          console.log('⚠️ Could not determine location column names');
          console.log('Available columns:', Object.keys(sample).join(', '));
        }
      } else {
        console.log('⚠️ No data in the table, adding a test record...');
        
        // Try with latitude/longitude
        const insertResult = await supabase
          .from('incidents')
          .insert([
            {
              type: 'TEST',
              description: 'Test incident',
              latitude: 40.7128,
              longitude: -74.0060,
              status: 'test'
            }
          ]);
          
        if (insertResult.error) {
          console.error('❌ Error inserting with latitude/longitude:', insertResult.error);
          
          // Try with lat/lng
          const insertResult2 = await supabase
            .from('incidents')
            .insert([
              {
                type: 'TEST',
                description: 'Test incident',
                lat: 40.7128,
                lng: -74.0060,
                status: 'test'
              }
            ]);
            
          if (insertResult2.error) {
            console.error('❌ Error inserting with lat/lng:', insertResult2.error);
          } else {
            console.log('✅ Record inserted with lat/lng columns');
            console.log('Update your form to use lat/lng instead of latitude/longitude');
          }
        } else {
          console.log('✅ Record inserted with latitude/longitude columns');
          console.log('Your form is already configured correctly');
        }
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixIncidentsTable(); 