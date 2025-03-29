'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import { pusher } from '@/lib/pusher'

type FormData = {
  emergencyType: string;
  lat: number;
  lng: number;
  description: string;
}

export default function EmergencyForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const [submitting, setSubmitting] = useState(false)
  const [isGitHubPages, setIsGitHubPages] = useState(false)
  
  // Check if running on GitHub Pages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Both methods to detect GitHub Pages
      const isGitHub = window.location.hostname.includes('github.io') || 
                      (process.env.NODE_ENV === 'production' && !window.location.hostname.includes('localhost'));
      setIsGitHubPages(isGitHub);
      
      if (isGitHub) {
        console.log('Running on GitHub Pages - Demo mode active');
      }
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    
    // Always log the form data for debugging
    console.log('Form data submitted:', data);
    
    try {
      // For GitHub Pages: show demo message instead of trying to save to Supabase
      if (isGitHubPages || !supabase) {
        console.log('Demo mode active - not attempting to save to database');
        
        // Simulate successful submission
        setTimeout(() => {
          reset();
          alert('DEMO MODE: This is a static demo. In a full deployment, this would save your emergency report to the database.');
          setSubmitting(false);
        }, 1000);
        
        return;
      }
      
      // Extra check to ensure Supabase URL and key are actually set
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
        console.log('Supabase credentials not properly configured - using demo mode');
        // Treat as GitHub Pages / demo mode
        setTimeout(() => {
          reset();
          alert('DEMO MODE: Supabase configuration missing. This would normally save your emergency report to a database.');
          setSubmitting(false);
        }, 1000);
        return;
      }
      
      // Normal operation for non-GitHub Pages deployments
      const { data: incident, error } = await supabase
        .from('incidents')
        .insert([{ 
          type: data.emergencyType,
          location: `POINT(${data.lng} ${data.lat})`,
          description: data.description,
          status: 'pending',
          reported_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Incident successfully created:', incident);
      
      // Only attempt Pusher if we've successfully saved to Supabase
      if (incident) {
        try {
          // Trigger real-time update
          await pusher.trigger('incidents', 'new', incident?.[0] || {});
        } catch (pusherError) {
          console.error('Pusher error (non-fatal):', pusherError);
          // Don't throw here - we still succeeded with the database save
        }
      }
      
      reset();
      alert('Emergency reported successfully');
    } catch (error) {
      // Enhanced error logging
      console.error('Error reporting emergency:', error);
      
      if (isGitHubPages) {
        alert('This is a demo version. In a production environment, you would be connected to a real database.');
      } else {
        alert('Failed to report emergency. Please try again or contact support if the issue persists.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Report Emergency</h2>
      {isGitHubPages && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
          <p className="font-medium text-yellow-800">⚠️ Demo Mode Active</p>
          <p className="text-yellow-700">This is running as a static demo. Form submissions won't be saved to a database.</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Emergency Type</label>
          <select 
            {...register('emergencyType', { required: 'Emergency type is required' })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select emergency type</option>
            <option value="flood">Flood</option>
            <option value="fire">Fire</option>
            <option value="earthquake">Earthquake</option>
            <option value="medical">Medical</option>
            <option value="other">Other</option>
          </select>
          {errors.emergencyType && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyType.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Latitude</label>
            <input
              type="number"
              step="0.000001"
              defaultValue={14.5995}
              {...register('lat', { 
                required: 'Latitude is required',
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.lat && (
              <p className="text-red-500 text-sm mt-1">{errors.lat.message}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Longitude</label>
            <input
              type="number"
              step="0.000001"
              defaultValue={120.9842}
              {...register('lng', { 
                required: 'Longitude is required',
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.lng && (
              <p className="text-red-500 text-sm mt-1">{errors.lng.message}</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            placeholder="Describe the emergency situation..."
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
        >
          {submitting ? 'Submitting...' : isGitHubPages ? 'Submit (Demo)' : 'Report Emergency'}
        </button>
      </form>
    </div>
  )
} 