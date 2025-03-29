import React, { useState } from 'react';
import { sendAlert } from '../lib/api';

type EmergencyType = 'Flood' | 'Earthquake' | 'Fire' | 'Cyclone' | 'Landslide' | 'Other';

const EmergencyAlert: React.FC = () => {
  const [formData, setFormData] = useState({
    type: 'Earthquake' as EmergencyType,
    location: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validate form
      if (!formData.location.trim()) {
        throw new Error('Please enter a location');
      }

      // Send alert to backend
      const response = await sendAlert(formData);
      
      // Show success message
      setMessage({
        text: 'Emergency alert sent successfully! Responders have been notified.',
        type: 'success'
      });

      // Reset form
      setFormData({
        type: 'Earthquake',
        location: '',
        details: ''
      });
    } catch (error) {
      // Show error message
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to send alert. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold text-red-600 mb-4">Report Emergency</h3>
      
      {message && (
        <div 
          className={`p-3 rounded-md mb-4 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="type" className="form-label">Emergency Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-input bg-white"
            disabled={isSubmitting}
            required
          >
            <option value="Earthquake">Earthquake</option>
            <option value="Flood">Flood</option>
            <option value="Fire">Fire</option>
            <option value="Cyclone">Cyclone</option>
            <option value="Landslide">Landslide</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            placeholder="City, State or specific address"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="details" className="form-label">Additional Details</label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="form-input h-24 resize-none"
            placeholder="Describe the situation and any specific needs"
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Alert...
            </>
          ) : 'Send Emergency Alert'}
        </button>
      </form>
    </div>
  );
};

export default EmergencyAlert; 