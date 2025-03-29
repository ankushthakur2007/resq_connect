import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Head>
        <title>Disaster Response Platform</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-6">Disaster Response Platform</h1>
      
      <p className="mb-6">
        Welcome to the disaster response platform. This application helps coordinate emergency responses
        during disasters and crisis situations.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-3">📋 Main Features</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/emergency-form" className="text-blue-600 hover:underline">
                Report Emergency
              </Link>
              <p className="text-sm text-gray-600">Submit emergency reports to the system</p>
            </li>
            <li>
              <Link href="/incidents" className="text-blue-600 hover:underline">
                View Incidents
              </Link>
              <p className="text-sm text-gray-600">See all reported incidents in a table</p>
            </li>
            <li>
              <Link href="/map-view" className="text-blue-600 hover:underline">
                Map View
              </Link>
              <p className="text-sm text-gray-600">View incidents on an interactive map</p>
            </li>
          </ul>
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-3">🛠️ Utilities &amp; Tools</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/emergency-direct" className="text-blue-600 hover:underline">
                Direct Emergency Form
              </Link>
              <p className="text-sm text-gray-600">Alternative form that bypasses RLS</p>
            </li>
            <li>
              <Link href="/simplified-sql" className="text-blue-600 hover:underline">
                SQL Fix Guide
              </Link>
              <p className="text-sm text-gray-600">Simple SQL commands to fix database issues</p>
            </li>
            <li>
              <Link href="/supabase-setup" className="text-blue-600 hover:underline">
                Supabase Setup Guide
              </Link>
              <p className="text-sm text-gray-600">Detailed instructions for database setup</p>
            </li>
            <li>
              <Link href="/test-connection" className="text-blue-600 hover:underline">
                Test Database Connection
              </Link>
              <p className="text-sm text-gray-600">Check if database connection is working</p>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Database Issues?</h3>
        <p className="mb-2">
          If you're experiencing Row-Level Security (RLS) errors when submitting forms, 
          please visit the <Link href="/simplified-sql" className="text-blue-600 hover:underline">SQL Fix Guide</Link> for
          step-by-step instructions on resolving these issues.
        </p>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Disaster Response Platform • © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
} 