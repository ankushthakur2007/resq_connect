'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'

type FormData = {
  emergencyType: string;
  lat: number;
  lng: number;
  description: string;
}

export default function EmergencyDirectForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [customRLS, setCustomRLS] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Get environment variables
  useEffect(() => {
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
    setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  }, []);
  
  const onSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      // Create a fresh Supabase client
      const supabase = createClient(
        supabaseUrl,
        supabaseKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      
      // Format data for insertion
      const incidentData = {
        type: formData.emergencyType,
        description: formData.description,
        location: `POINT(${formData.lng} ${formData.lat})`,
        status: 'pending',
        reported_at: new Date().toISOString()
      };
      
      setDebugInfo({ 
        attemptingInsert: true, 
        formData, 
        incidentData,
        customRLS 
      });
      
      let insertResult;
      
      if (customRLS) {
        // Try using a custom RPC function that might bypass RLS
        const { data, error } = await supabase.rpc(
          'insert_incident',
          {
            incident_type: formData.emergencyType,
            incident_description: formData.description,
            incident_location: `POINT(${formData.lng} ${formData.lat})`,
            incident_status: 'pending'
          }
        );
        
        insertResult = { data, error, method: 'rpc' };
      } else {
        // Try normal insert
        const { data, error } = await supabase
          .from('incidents')
          .insert([incidentData])
          .select();
          
        insertResult = { data, error, method: 'direct' };
      }
      
      setDebugInfo(prev => ({ ...prev, insertResult }));
      
      if (insertResult.error) {
        // Attempt to get detailed error info
        setError(`Insert error (${insertResult.method}): ${insertResult.error.message} (${insertResult.error.code})`);
        console.error('Insert error details:', insertResult.error);
      } else {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Form error:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Emergency Report - Direct Method</title>
      </Head>
      
      <h1 className="text-2xl font-bold mb-4">Emergency Report - Direct Method</h1>
      <p className="mb-4 text-gray-600">
        This form attempts to bypass Row-Level Security by using different methods.
      </p>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">✅ Emergency reported successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 border rounded-md p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Emergency Type</label>
          <select
            {...register('emergencyType', { required: 'Emergency type is required' })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select emergency type</option>
            <option value="FIRE">Fire</option>
            <option value="MEDICAL">Medical</option>
            <option value="POLICE">Police</option>
            <option value="FLOOD">Flood</option>
            <option value="EARTHQUAKE">Earthquake</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.emergencyType && (
            <p className="text-red-500 text-xs mt-1">{errors.emergencyType.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Location (Latitude)</label>
          <input
            type="number"
            step="any"
            {...register('lat', { 
              required: 'Latitude is required',
              valueAsNumber: true,
              validate: v => (v >= -90 && v <= 90) || 'Latitude must be between -90 and 90'
            })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., 40.7128"
          />
          {errors.lat && (
            <p className="text-red-500 text-xs mt-1">{errors.lat.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Location (Longitude)</label>
          <input
            type="number"
            step="any"
            {...register('lng', { 
              required: 'Longitude is required',
              valueAsNumber: true,
              validate: v => (v >= -180 && v <= 180) || 'Longitude must be between -180 and 180'
            })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., -74.006"
          />
          {errors.lng && (
            <p className="text-red-500 text-xs mt-1">{errors.lng.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            placeholder="Describe the emergency situation..."
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={customRLS}
              onChange={e => setCustomRLS(e.target.checked)}
            />
            <span className="text-sm">Try using custom RLS bypass function (if available)</span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : 'Report Emergency'}
        </button>
      </form>
      
      <div className="border rounded-md p-4 bg-gray-50">
        <h2 className="text-lg font-medium mb-2">Debug Information</h2>
        <div className="mb-2">
          <p><strong>Supabase URL:</strong> {supabaseUrl ? '✓ Set' : '✗ Not set'}</p>
          <p><strong>Supabase Key:</strong> {supabaseKey ? '✓ Set' : '✗ Not set'}</p>
        </div>
        
        {debugInfo && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-1">Request Details</h3>
            <pre className="bg-white p-2 rounded text-xs overflow-auto" style={{ maxHeight: '200px' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Note: If this form also fails, you definitely need to modify your Supabase RLS policies.
            Visit the <a href="/supabase-setup" className="text-blue-600 underline">setup guide</a> for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
} 