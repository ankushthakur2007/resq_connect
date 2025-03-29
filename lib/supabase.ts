import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Import the service role key from environment variables
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Log initialization for debugging
if (typeof window !== 'undefined') {
  // Only log in browser environment
  console.log('Supabase initialization:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : 'Not set',
    key: supabaseKey ? 'Key provided' : 'Key missing',
  });
  
  // More verbose logging for debugging
  if (supabaseUrl && supabaseKey) {
    console.log('Supabase URL length:', supabaseUrl.length);
    console.log('Supabase key format check:', 
      supabaseKey.startsWith('eyJ') ? 'Valid JWT format' : 'Invalid format');
  }
}

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or key is missing! Database features will not work correctly.');
}

// Create and export the Supabase client with retry logic
let supabaseClient;
try {
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'disaster-response-app',
      },
    },
    // Add additional options that may help with connectivity issues
    db: {
      schema: 'public',
    },
  });
  
  if (typeof window !== 'undefined') {
    console.log('Supabase client created successfully');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a fallback client that logs errors on all operations
  supabaseClient = {
    from: () => ({
      select: () => Promise.reject(new Error('Supabase client initialization failed')),
      insert: () => Promise.reject(new Error('Supabase client initialization failed')),
      update: () => Promise.reject(new Error('Supabase client initialization failed')),
      delete: () => Promise.reject(new Error('Supabase client initialization failed')),
    }),
  };
}

export const supabase = supabaseClient;

// Create a service role client that bypasses RLS policies
export const supabaseAdmin = serviceRoleKey ? createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null;

// Export check function that can be used to test connection
export const checkSupabaseConnection = async () => {
  try {
    // First check if we even have a properly initialized client
    if (!supabase || !supabase.from) {
      return { 
        success: false, 
        error: { message: 'Supabase client is not properly initialized' }
      };
    }
    
    // Try a simple query to test connectivity
    const { data, error } = await supabase.from('incidents').select('count').limit(1);
    
    if (error) {
      return { 
        success: false, 
        error,
        errorDetails: JSON.stringify(error, null, 2)
      };
    }
    
    return { 
      success: true, 
      data,
      message: 'Successfully connected to Supabase' 
    };
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return { 
      success: false, 
      error,
      errorDetails: error instanceof Error ? error.message : JSON.stringify(error, null, 2)
    };
  }
}

// Function to insert data bypassing RLS
export async function insertIncidentBypassRLS(incidentData: any) {
  // First try with the anonymous client
  const { data, error } = await supabase
    .from('incidents')
    .insert([incidentData])
    .select();
    
  if (error) {
    console.log('Regular insert failed with error:', error);
    console.log('Trying with service role client...');
    
    // If admin client exists, try with it to bypass RLS
    if (supabaseAdmin) {
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('incidents')
        .insert([incidentData])
        .select();
        
      if (adminError) {
        console.error('Even admin insert failed:', adminError);
        return { data: null, error: adminError };
      }
      
      return { data: adminData, error: null };
    } else {
      // Alternative approaches if service client isn't available
      // 1. Try using a direct RPC call if you have a backend function set up
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'insert_incident_bypass_rls',
          incidentData
        );
        
        if (!rpcError) {
          return { data: rpcData, error: null };
        }
      } catch (e) {
        console.log('RPC approach failed:', e);
      }
      
      return { data: null, error };
    }
  }
  
  return { data, error: null };
} 