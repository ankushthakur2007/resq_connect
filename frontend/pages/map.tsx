import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

// Dynamically import the DisasterMap component with no SSR to avoid Leaflet errors
const DisasterMap = dynamic(
  () => import('../components/DisasterMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function MapPage() {
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-28">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Disaster Live Map</h1>
        <p className="text-gray-600 mb-8">
          Track ongoing and recent disasters across India. Click on the markers for more information.
        </p>

        <div className="mb-6 flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={() => setShowActiveOnly(!showActiveOnly)}
              className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary"
            />
            <span className="ml-2 text-gray-700">Show active disasters only</span>
          </label>
        </div>

        <DisasterMap 
          height="600px" 
          showActiveOnly={showActiveOnly} 
        />

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Disaster Response Information</h2>
          <p className="mb-4">
            If you're in an affected area or need emergency assistance, please contact one of the following helplines:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span><strong>National Emergency Number:</strong> 112</span>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span><strong>Disaster Management:</strong> 1078</span>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span><strong>Fire Emergency:</strong> 101</span>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span><strong>Ambulance:</strong> 108</span>
            </li>
          </ul>
          <p>
            <strong>Note:</strong> This map shows approximate locations of reported disasters. For the most accurate and up-to-date information, please refer to official government sources and emergency broadcasts.
          </p>
        </div>
      </div>
    </Layout>
  );
} 