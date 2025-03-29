'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type NotificationFormData = {
  phoneNumber: string;
  message?: string;
}

type EmergencyInfo = {
  id?: string;
  emergencyType: string;
  lat: number;
  lng: number;
  description: string;
  [key: string]: any;
}

interface EmergencyNotificationFormProps {
  emergency: EmergencyInfo;
}

export default function EmergencyNotificationForm({ emergency }: EmergencyNotificationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<NotificationFormData>();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: NotificationFormData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emergency,
          phoneNumber: data.phoneNumber,
          customMessage: data.message,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notification');
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border rounded-md p-4 mt-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Send Emergency SMS Alert</h3>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm font-medium">✅ SMS notification sent successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm font-medium">❌ Error: {error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('phoneNumber', { 
              required: 'Phone number is required',
              pattern: {
                value: /^\+?[1-9]\d{1,14}$/,
                message: 'Please enter a valid phone number (E.164 format: +1234567890)'
              }
            })}
            placeholder="+1234567890"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Enter phone number in international format (e.g., +1234567890)
          </p>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Message (Optional)
          </label>
          <textarea
            {...register('message')}
            placeholder="Any additional details to include in the notification..."
            className="w-full px-3 py-2 border rounded-md"
            rows={2}
          />
        </div>
        
        <div className="mb-3 text-xs text-gray-600 p-2 bg-gray-50 rounded">
          <p className="font-medium">Emergency Information to Include:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Type: {emergency.emergencyType}</li>
            <li>Location: Lat {emergency.lat}, Lng {emergency.lng}</li>
            <li>Description: {emergency.description.substring(0, 50)}...</li>
          </ul>
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? 'Sending...' : 'Send SMS Alert'}
        </button>
      </form>
    </div>
  );
} 