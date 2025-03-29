import React from 'react';
import Head from 'next/head';

export default function SimplifiedSQL() {
  const simpleSql = `
-- Try running this single command in your SQL editor:
CREATE POLICY "public_insert" ON "public"."incidents" FOR INSERT USING (true);

-- If that fails, try this alternative command:
CREATE POLICY "insert_policy" ON "incidents" FOR INSERT TO public USING (true);

-- If you're still having trouble, try disabling RLS entirely (not recommended for production):
ALTER TABLE "public"."incidents" DISABLE ROW LEVEL SECURITY;
`;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Head>
        <title>Simplified SQL Fix</title>
      </Head>
      
      <div className="bg-amber-100 border-l-4 border-amber-500 p-4 mb-6 rounded">
        <h1 className="text-2xl font-bold mb-2">Simplified SQL Fix for RLS</h1>
        <p className="mb-2">
          You're still experiencing the Row-Level Security (RLS) error. Here's a simplified approach that might work better.
        </p>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Super Simple SQL Commands</h2>
      <p className="mb-4">
        Go to your Supabase dashboard → SQL Editor → New Query and run these commands one at a time:
      </p>
      
      <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-6">
        <pre>{simpleSql}</pre>
      </div>
      
      <button 
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {navigator.clipboard.writeText(simpleSql)}}
      >
        Copy to Clipboard
      </button>
      
      <h2 className="text-xl font-bold mb-4">Alternative Data Collection Method</h2>
      <p className="mb-4">
        If you cannot modify the RLS policies, you can use an alternative approach:
      </p>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className="font-medium mb-2">1. Try a different submission method</h3>
          <p>
            Visit <a href="/emergency-direct" className="text-blue-600 underline">the direct emergency form</a> which tries 
            multiple approaches to bypass RLS restrictions.
          </p>
        </div>
        
        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className="font-medium mb-2">2. Use an alternative database</h3>
          <p>
            If you're unable to modify the Supabase policies, consider using a different database or data collection method 
            like:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>Storing data in localStorage temporarily</li>
            <li>Using a different service like Firebase</li>
            <li>Setting up a simple server-side database</li>
          </ul>
        </div>
        
        <div className="p-4 border rounded-md bg-white shadow-sm">
          <h3 className="font-medium mb-2">3. Contact Supabase support</h3>
          <p>
            If you're still having issues, you might want to contact Supabase support for help with your specific 
            project configuration.
          </p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Additional Resources</h3>
        <ul className="list-disc pl-5">
          <li className="mb-1">
            <a 
              href="https://supabase.com/docs/guides/auth/row-level-security" 
              className="text-blue-600 underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Supabase Row Level Security Documentation
            </a>
          </li>
          <li className="mb-1">
            <a 
              href="https://supabase.com/docs/reference/javascript/insert" 
              className="text-blue-600 underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Supabase Insert Reference
            </a>
          </li>
          <li>
            <a 
              href="/supabase-setup" 
              className="text-blue-600 underline"
            >
              Detailed Setup Guide
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
} 