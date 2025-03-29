import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// This runs on the server where we can safely use service role keys
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    // Service role key is optional but preferred for bypassing RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Check that required environment variables are set
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: 'Server misconfiguration - missing Supabase credentials',
        success: false
      });
    }
    
    // Create Supabase client - use service role key if available, otherwise use anon key
    const supabase = createClient(
      supabaseUrl, 
      serviceRoleKey || supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Get incident data from request body
    const incidentData = req.body;
    
    // Validate incident data
    if (!incidentData || !incidentData.type || !incidentData.location) {
      return res.status(400).json({ 
        error: 'Missing required incident data',
        success: false,
        received: incidentData
      });
    }
    
    console.log('Server-side inserting incident:', incidentData);
    
    // First attempt: Try using a specific function if available
    try {
      // Try calling a stored function that might exist in the database
      // This function can be created in Supabase SQL editor to bypass RLS
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'insert_incident_bypass_rls',
        {
          incident_type: incidentData.type,
          incident_description: incidentData.description,
          incident_location: incidentData.location,
          incident_status: incidentData.status || 'pending'
        }
      );
      
      if (!rpcError) {
        return res.status(200).json({ 
          data: rpcData, 
          success: true,
          message: 'Incident reported successfully via RPC'
        });
      }
      
      console.log('RPC function approach failed:', rpcError);
      // Continue to next approach if this fails
    } catch (rpcError) {
      console.log('RPC function not available:', rpcError);
      // Continue to next approach
    }
    
    // Second attempt: Try direct query with RLS security_definer function
    try {
      // This approach expects a security_definer function to exist in the database
      // You would need to create this function in Supabase SQL editor:
      /*
      CREATE OR REPLACE FUNCTION public.insert_incident(
        incident_type text,
        incident_description text,
        incident_location text,
        incident_status text DEFAULT 'pending'
      ) RETURNS uuid
      LANGUAGE plpgsql
      SECURITY DEFINER -- This is what bypasses RLS
      AS $$
      DECLARE
        new_id uuid;
      BEGIN
        INSERT INTO public.incidents(type, description, location, status, reported_at)
        VALUES (incident_type, incident_description, incident_location, incident_status, NOW())
        RETURNING id INTO new_id;
        
        RETURN new_id;
      END;
      $$;
      */
      
      const { data: queryData, error: queryError } = await supabase.rpc(
        'insert_incident',
        {
          incident_type: incidentData.type,
          incident_description: incidentData.description,
          incident_location: incidentData.location,
          incident_status: incidentData.status || 'pending'
        }
      );
      
      if (!queryError) {
        return res.status(200).json({ 
          data: [{ id: queryData }], 
          success: true,
          message: 'Incident reported successfully via security_definer function'
        });
      }
      
      console.log('Security definer function approach failed:', queryError);
      // Continue to next approach if this fails
    } catch (queryError) {
      console.log('Security definer function not available:', queryError);
      // Continue to next approach
    }
    
    // Last attempt: Try direct insert (might still fail due to RLS)
    const { data, error } = await supabase
      .from('incidents')
      .insert([incidentData])
      .select();
      
    if (error) {
      console.error('Error inserting incident:', error);
      
      // Special case for RLS policy violation
      if (error.code === '42501') {
        return res.status(403).json({ 
          error: 'Permission denied: Row-level security is preventing insert operations',
          details: error,
          success: false,
          message: 'You need to contact your database administrator to grant insert permissions or disable RLS for this table.'
        });
      }
      
      return res.status(500).json({ 
        error: `Database error: ${error.message} (${error.code})`,
        details: error,
        success: false
      });
    }
    
    return res.status(200).json({ 
      data, 
      success: true,
      message: 'Incident reported successfully'
    });
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : String(error),
      success: false
    });
  }
} 