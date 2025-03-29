import React from 'react';
import Head from 'next/head';

export default function SupabaseSetup() {
  const createRlsPolicy = `
-- 1. Enable Row Level Security on the incidents table
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows anonymous inserts
CREATE POLICY "Allow anonymous inserts on incidents" 
ON public.incidents 
FOR INSERT 
TO anon 
USING (true);

-- 3. Create a policy that allows anonymous selects (optional)
CREATE POLICY "Allow anonymous selects on incidents" 
ON public.incidents 
FOR SELECT 
TO anon 
USING (true);
`;

  const createBypassFunction = `
-- Create a function that bypasses RLS using SECURITY DEFINER
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

-- Grant usage on this function to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.insert_incident TO anon;
GRANT EXECUTE ON FUNCTION public.insert_incident TO authenticated;
`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Supabase RLS Setup Guide</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-6">Setting up Supabase for Emergency Response App</h1>
      
      <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-yellow-800">⚠️ Important: Row-Level Security Error</h2>
        <p className="mb-3">
          You are seeing errors because your Supabase database has Row-Level Security (RLS) enabled, 
          but no policies set up to allow inserts into the incidents table.
        </p>
        <p>
          Follow the instructions below to fix this issue.
        </p>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Option 1: Create RLS Policy (Recommended)</h2>
      <div className="mb-6">
        <p className="mb-4">
          This option creates a Row-Level Security policy to allow anonymous inserts.
          Follow these steps:
        </p>
        <ol className="list-decimal pl-8 mb-4">
          <li className="mb-2">Go to your <a href="https://app.supabase.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Supabase Dashboard</a></li>
          <li className="mb-2">Select your project</li>
          <li className="mb-2">Go to <strong>SQL Editor</strong> in the left sidebar</li>
          <li className="mb-2">Create a new query</li>
          <li className="mb-2">Paste the following SQL:</li>
        </ol>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre>{createRlsPolicy}</pre>
        </div>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {navigator.clipboard.writeText(createRlsPolicy)}}
        >
          Copy to Clipboard
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Option 2: Create Security Definer Function</h2>
      <div className="mb-6">
        <p className="mb-4">
          If you want more control or Option 1 doesn't work, you can create a database function
          with SECURITY DEFINER that bypasses RLS. Follow these steps:
        </p>
        <ol className="list-decimal pl-8 mb-4">
          <li className="mb-2">Go to your <a href="https://app.supabase.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Supabase Dashboard</a></li>
          <li className="mb-2">Select your project</li>
          <li className="mb-2">Go to <strong>SQL Editor</strong> in the left sidebar</li>
          <li className="mb-2">Create a new query</li>
          <li className="mb-2">Paste the following SQL:</li>
        </ol>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre>{createBypassFunction}</pre>
        </div>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {navigator.clipboard.writeText(createBypassFunction)}}
        >
          Copy to Clipboard
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Checking Your Database Structure</h2>
      <div className="mb-6">
        <p className="mb-4">
          If you're still having issues, make sure your incidents table has the correct columns.
          Your table should have at least:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li className="mb-2"><strong>id</strong>: UUID (primary key)</li>
          <li className="mb-2"><strong>type</strong>: TEXT</li>
          <li className="mb-2"><strong>description</strong>: TEXT</li>
          <li className="mb-2"><strong>location</strong>: TEXT (in PostGIS POINT format)</li>
          <li className="mb-2"><strong>status</strong>: TEXT</li>
          <li className="mb-2"><strong>reported_at</strong>: TIMESTAMP WITH TIME ZONE</li>
        </ul>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Need Further Help?</h3>
        <p>
          After setting this up, restart your application and try submitting the form again.
          If you're still having issues, check the browser console for specific error messages.
        </p>
      </div>
    </div>
  );
} 