'use client'
import { useState } from 'react'
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

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const { data: incident, error } = await supabase
        .from('incidents')
        .insert([{ 
          type: data.emergencyType,
          location: `POINT(${data.lng} ${data.lat})`,
          description: data.description,
          status: 'pending',
          reported_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      
      // Trigger real-time update
      await pusher.trigger('incidents', 'new', incident?.[0] || {})
      
      reset()
      alert('Emergency reported successfully')
    } catch (error) {
      console.error('Error reporting emergency:', error)
      alert('Failed to report emergency')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Report Emergency</h2>
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
          {submitting ? 'Submitting...' : 'Report Emergency'}
        </button>
      </form>
    </div>
  )
} 