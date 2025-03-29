'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase, checkSupabaseConnection, insertIncidentBypassRLS } from '@/lib/supabase'
import { pusher } from '@/lib/pusher'
import EmergencyNotificationForm from './EmergencyNotificationForm'
import { useRouter } from 'next/navigation'

type FormData = {
  emergencyType: string;
  lat: number;
  lng: number;
  description: string;
}

const SuccessMessage = () => (
  <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded shadow-sm">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-grow">
        <h3 className="text-sm font-medium text-green-800">Success</h3>
        <div className="mt-2 text-sm text-green-700">
          Emergency report submitted successfully. Thank you for your report.
        </div>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowNotificationForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send SMS Alert
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ details }: { details: string }) => {
  const [showDebug, setShowDebug] = useState(false);
  const router = useRouter();
  const isRlsError = details.includes('row-level security') || 
                    details.includes('42501') || 
                    details.includes('Database permission error');
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded shadow-sm">
      <div className="flex justify-between">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-grow">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <pre className="whitespace-pre-wrap overflow-x-auto">{details}</pre>
          </div>
          
          {isRlsError && (
            <div className="mt-3 flex items-center">
              <button
                onClick={() => router.push('/supabase-setup')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Setup Guide
              </button>
              <span className="ml-2 text-sm text-gray-500">
                Click to learn how to fix this database permission issue
              </span>
            </div>
          )}
        </div>
        <button 
          className="text-xs text-blue-600 hover:underline ml-2 h-fit"
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>
      
      {showDebug && (
        <div className="mt-3 p-3 bg-gray-50 rounded text-xs font-mono overflow-auto">
          <div>
            <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Not set'}</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Not set'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function EmergencyForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const [submitting, setSubmitting] = useState(false)
  const [isGitHubPages, setIsGitHubPages] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showNotificationForm, setShowNotificationForm] = useState(false)
  const [submittedEmergency, setSubmittedEmergency] = useState<FormData | null>(null)
  const router = useRouter()
  
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

  const onSubmit = async (formData: FormData) => {
    setSubmitting(true);
    setErrorDetails('');
    
    try {
      // Add debug information and validation
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      if (!supabaseUrl || !supabaseKey) {
        const missingVars = [];
        if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
        if (!supabaseKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        
        throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
      }
      
      console.log('Attempting to submit to Supabase:', supabaseUrl);
      
      // Diagnostic check of Supabase connection using the improved function
      try {
        const connectionCheck = await checkSupabaseConnection();
        
        if (!connectionCheck.success) {
          console.error('Supabase connection check failed:', connectionCheck.error);
          setErrorDetails(`Database connection error: ${
            connectionCheck.errorDetails || JSON.stringify(connectionCheck.error, null, 2)
          }`);
          
          // If we can't connect, don't try to insert
          throw new Error('Failed to connect to database');
        } else {
          console.log('Supabase connection successful:', connectionCheck.data);
        }
      } catch (healthCheckError) {
        console.error('Health check exception:', healthCheckError);
        setErrorDetails(`Database connection error: ${
          healthCheckError instanceof Error ? healthCheckError.message : String(healthCheckError)
        }`);
        
        // If health check throws, don't proceed with insert
        throw healthCheckError;
      }
      
      try {
        console.log('Inserting emergency:', formData);
        
        // Create properly formatted data matching the database schema
        const incidentData = {
          type: formData.emergencyType, // Map emergencyType to type
          description: formData.description,
          // Use POINT format for location (PostGIS format)
          location: `POINT(${formData.lng} ${formData.lat})`,
          status: 'pending',
          reported_at: new Date().toISOString()
        };
        
        console.log('Formatted data for database:', incidentData);
        
        // Try multiple approaches to insert the data
        try {
          // First try using the API endpoint (preferred approach)
          const response = await fetch('/api/insert-incident', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(incidentData),
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            console.error('API insert failed:', result);
            throw new Error(result.error || 'Failed to insert via API');
          }
          
          console.log('Successfully inserted via API:', result);
          
          // Use the returned data
          const data = result.data;
          
          // Continue with success handling
          console.log('Emergency reported successfully:', data);
          
          // Store the submitted emergency for notifications
          setSubmittedEmergency(formData);
          
          // Notify all subscribers (admin dashboards) via Pusher
          if (process.env.NEXT_PUBLIC_PUSHER_KEY) {
            try {
              console.log('Sending Pusher notification');
              
              // Create channel name based on emergency type for better filtering
              const channelName = 'emergencies';
              const eventName = 'new-emergency';
              
              const channel = pusher.channel(channelName);
              if (channel) {
                channel.trigger(eventName, {
                  message: 'New emergency reported',
                  emergency: data?.[0] || formData,
                  timestamp: new Date().toISOString()
                }).then(() => {
                  console.log('✅ Pusher notification sent successfully');
                }).catch((pusherError) => {
                  console.error('❌ Pusher trigger error:', pusherError);
                });
              } else {
                // If channel doesn't exist yet, try subscribing first
                const newChannel = pusher.subscribe(channelName);
                newChannel.bind(eventName, (data: any) => {
                  console.log('Received emergency event:', data);
                });
                
                // Then try to trigger after a short delay
                setTimeout(() => {
                  try {
                    pusher.channel(channelName)?.trigger(eventName, {
                      message: 'New emergency reported',
                      emergency: data?.[0] || formData,
                      timestamp: new Date().toISOString()
                    });
                    console.log('✅ Pusher notification sent (delayed)');
                  } catch (delayedError) {
                    console.error('❌ Delayed Pusher error:', delayedError);
                  }
                }, 500);
              }
            } catch (pusherError) {
              console.error('❌ Failed to send Pusher notification:', pusherError);
              // Don't throw here as the emergency was still reported successfully
            }
          } else {
            console.warn('Pusher key not found - skipping real-time notification');
          }
          
          // Reset form and show success message
          reset();
          setSuccess(true);
        } catch (apiError) {
          console.error('API insert error:', apiError);
          const errorMessage = apiError.message || '';
          
          // Check if this is an RLS policy error
          if (errorMessage.includes('row-level security') || errorMessage.includes('42501')) {
            setErrorDetails(`Database permission error: You don't have permission to add incidents to the database. 
            
This is likely due to Row-Level Security (RLS) being enabled without proper policies.
            
Please go to the setup guide to fix this issue.`);
            
            // Add a button to the error message to navigate to the setup page
            setTimeout(() => {
              if (confirm('Would you like to view the setup guide to fix this database permission issue?')) {
                router.push('/supabase-setup');
              }
            }, 1000);
          } else {
            setErrorDetails(`API insert error: ${apiError.message}`);
          }
          throw apiError;
        }
      } catch (databaseError) {
        console.error('Database operation error:', databaseError);
        
        if (databaseError && typeof databaseError === 'object') {
          // Handle Supabase error object specifically
          const supabaseError = databaseError as any;
          if (supabaseError.code) {
            setErrorDetails(`Database error ${supabaseError.code}: ${supabaseError.message || 'Unknown database error'}`);
          } else {
            setErrorDetails(`Database error: ${JSON.stringify(databaseError, null, 2)}`);
          }
        } else {
          setErrorDetails(`Database operation failed: ${String(databaseError)}`);
        }
        
        throw databaseError;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // If we haven't set error details yet (from specific error handlers above)
      if (!errorDetails) {
        if (error instanceof Error) {
          setErrorDetails(`Error: ${error.message}`);
        } else if (error && typeof error === 'object') {
          try {
            // Try to extract useful information from the error object
            const errorObj = error as any;
            const details = [];
            
            if (errorObj.code) details.push(`Code: ${errorObj.code}`);
            if (errorObj.message) details.push(`Message: ${errorObj.message}`);
            if (errorObj.details) details.push(`Details: ${errorObj.details}`);
            if (errorObj.hint) details.push(`Hint: ${errorObj.hint}`);
            if (errorObj.statusCode) details.push(`Status: ${errorObj.statusCode}`);
            
            if (details.length > 0) {
              setErrorDetails(`Error information:\n${details.join('\n')}`);
            } else {
              setErrorDetails(`Unprocessable error object: ${JSON.stringify(error, null, 2)}`);
            }
          } catch (jsonError) {
            setErrorDetails(`Error object cannot be stringified: ${String(error)}`);
          }
        } else {
          setErrorDetails(`Unknown error: ${String(error)}`);
        }
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
      
      {success && <SuccessMessage />}
      
      {errorDetails && <ErrorMessage details={errorDetails} />}
      
      {showNotificationForm && submittedEmergency && (
        <EmergencyNotificationForm emergency={submittedEmergency} />
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