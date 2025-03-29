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
}

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or key is missing! Database features will not work correctly.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Export check function that can be used to test connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('incidents').select('count').limit(1);
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return { success: false, error };
  }
} 