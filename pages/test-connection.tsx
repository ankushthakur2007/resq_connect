'use client'
import { useState, useEffect } from 'react'
import { supabase, checkSupabaseConnection } from '@/lib/supabase'
import Head from 'next/head'

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...')
  const [connectionDetails, setConnectionDetails] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function testConnection() {
      try {
        // Check Supabase connection
        const result = await checkSupabaseConnection()
        
        if (result.success) {
          setConnectionStatus('✅ Connected to Supabase successfully')
          setConnectionDetails(JSON.stringify(result.data, null, 2))
        } else {
          setConnectionStatus('❌ Failed to connect to Supabase')
          setError(result.errorDetails || JSON.stringify(result.error, null, 2))
        }
        
        // Try to list available tables
        try {
          const { data, error } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public')
          
          if (error) {
            console.error('Error fetching tables:', error)
          } else if (data) {
            setTables(data.map(t => t.tablename))
          }
        } catch (tableError) {
          console.error('Error in table query:', tableError)
        }
      } catch (err) {
        setConnectionStatus('❌ Error testing connection')
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setIsLoading(false)
      }
    }
    
    testConnection()
  }, [])
  
  async function testInsert() {
    try {
      setIsLoading(true)
      
      // Create a test incident with the correct schema
      const testData = {
        type: 'TEST', // This matches the database schema
        description: 'This is a test incident',
        location: `POINT(-74.0060 40.7128)`, // Use the PostGIS point format
        status: 'test',
        reported_at: new Date().toISOString()
      }
      
      console.log('Sending test data:', testData);
      
      const { data, error } = await supabase
        .from('incidents')
        .insert([testData])
        .select()
      
      if (error) {
        setError(`Insert error: ${error.message} (${error.code})`)
        console.error('Full error details:', error);
      } else {
        setConnectionDetails(`Test record inserted successfully: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (err) {
      setError(`Insert error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Supabase Connection Test</title>
      </Head>
      
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <p className={connectionStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
          {connectionStatus}
        </p>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-red-800">Error Details</h3>
            <pre className="mt-2 text-sm overflow-auto bg-white p-2 rounded">{error}</pre>
          </div>
        )}
        
        {connectionDetails && (
          <div className="mt-4">
            <h3 className="font-medium">Connection Details</h3>
            <pre className="mt-2 text-sm overflow-auto bg-white p-2 rounded">{connectionDetails}</pre>
          </div>
        )}
      </div>
      
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Available Tables</h2>
        {tables.length > 0 ? (
          <ul className="list-disc pl-5">
            {tables.map(table => (
              <li key={table}>{table}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No tables found or no permission to access them.</p>
        )}
      </div>
      
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Test Database Insert</h2>
        <p className="mb-2 text-sm text-gray-600">
          Click the button below to test inserting a record into the incidents table.
        </p>
        <button
          onClick={testInsert}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Insert'}
        </button>
      </div>
      
      <div className="p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <div>
          <p>
            NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
          </p>
          <p>
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
          </p>
        </div>
      </div>
    </div>
  )
} 