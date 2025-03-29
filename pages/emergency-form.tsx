import React from 'react';
import Head from 'next/head';
import EmergencyForm from '@/components/EmergencyForm';

export default function EmergencyFormPage() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Head>
        <title>Report Emergency</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-6">Report an Emergency</h1>
      
      <p className="mb-6">
        Use the form below to report an emergency situation. This information will be sent to our
        emergency response teams for immediate action.
      </p>
      
      <EmergencyForm />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Having Issues?</h3>
        <p>
          If you're experiencing errors when submitting this form, please try our 
          <a href="/emergency-direct" className="text-blue-600 hover:underline"> alternative submission method</a>.
        </p>
      </div>
    </div>
  );
} 