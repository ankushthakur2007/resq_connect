import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

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