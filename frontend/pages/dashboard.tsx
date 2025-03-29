import React, { useState } from 'react';
import Layout from '../components/Layout';
import WeatherWidget from '../components/WeatherWidget';
import EarthquakeTracker from '../components/EarthquakeTracker';
import ChatAssistant from '../components/ChatAssistant';
import DisasterMap from '../components/DisasterMap';
import EmergencyStats from '../components/EmergencyStats';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues with Leaflet
const DynamicDisasterMap = dynamic(
  () => import('../components/DisasterMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function Dashboard() {
  const [city, setCity] = useState('Delhi');
  const cities = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-28">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Disaster Response Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Monitor real-time disaster data, weather conditions, and emergency response resources.
        </p>
        
        {/* Emergency Stats Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Current Emergency Status</h2>
          <EmergencyStats />
        </section>
        
        {/* Weather & Earthquake Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Weather Conditions</h2>
              <div>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input bg-white py-1 px-3 text-sm rounded-md"
                >
                  {cities.map(cityOption => (
                    <option key={cityOption} value={cityOption}>{cityOption}</option>
                  ))}
                </select>
              </div>
            </div>
            <WeatherWidget city={city} className="h-full" />
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Earthquake Monitoring</h2>
            <EarthquakeTracker className="h-full" />
          </section>
        </div>
        
        {/* Map Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live Disaster Map</h2>
          <DynamicDisasterMap height="400px" />
        </section>
        
        {/* Chatbot Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Emergency Response Assistant</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">How to Use the Emergency Assistant</h3>
                <p className="mb-4">
                  Our Emergency Response Assistant can help you with information about:
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>Current weather conditions in your area</li>
                  <li>Recent earthquake activity</li>
                  <li>Emergency preparedness tips</li>
                  <li>Evacuation procedures</li>
                  <li>First aid information</li>
                </ul>
                <p className="text-sm text-red-600 font-medium">
                  Note: This is an informational assistant only. For actual emergencies, please call your local emergency number.
                </p>
              </div>
            </div>
            <div>
              <ChatAssistant className="h-full" />
            </div>
          </div>
        </section>
        
        {/* Resources Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Emergency Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Emergency Contacts",
                description: "National and local emergency phone numbers",
                link: "#",
                color: "bg-red-100 border-red-300 text-red-800"
              },
              {
                title: "Evacuation Routes",
                description: "Find safe evacuation routes for your area",
                link: "#",
                color: "bg-blue-100 border-blue-300 text-blue-800"
              },
              {
                title: "First Aid Guide",
                description: "Basic first aid procedures and tips",
                link: "#",
                color: "bg-green-100 border-green-300 text-green-800"
              },
              {
                title: "Volunteer Registration",
                description: "Sign up to help with disaster response",
                link: "#",
                color: "bg-purple-100 border-purple-300 text-purple-800"
              }
            ].map((resource, index) => (
              <div 
                key={index}
                className={`${resource.color} border p-4 rounded-lg hover:shadow-md transition-shadow`}
              >
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm mb-3">{resource.description}</p>
                <a href={resource.link} className="text-sm font-medium hover:underline">
                  Access Resource →
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
} 