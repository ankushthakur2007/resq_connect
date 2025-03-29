import EmergencyForm from '@/components/EmergencyForm'
import AppErrorBoundary from '@/components/ErrorBoundary'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Disaster Response Platform</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Quickly report emergencies and coordinate disaster response efforts in real-time.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <AppErrorBoundary>
            <EmergencyForm />
          </AppErrorBoundary>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/map" 
              className="block p-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
            >
              <h3 className="text-xl font-bold mb-2">Live Map</h3>
              <p className="text-sm">View all active emergencies on an interactive map</p>
            </Link>
            
            <Link 
              href="/dashboard" 
              className="block p-4 bg-green-600 text-white rounded-lg text-center hover:bg-green-700"
            >
              <h3 className="text-xl font-bold mb-2">Dashboard</h3>
              <p className="text-sm">View statistics and analytics for emergency responses</p>
            </Link>
            
            <Link 
              href="/volunteer" 
              className="block p-4 bg-yellow-600 text-white rounded-lg text-center hover:bg-yellow-700"
            >
              <h3 className="text-xl font-bold mb-2">Volunteer</h3>
              <p className="text-sm">Chat with other volunteers and coordinate actions</p>
            </Link>
            
            <div className="block p-4 bg-red-600 text-white rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">Emergency Hotline</h3>
              <p className="text-lg font-bold">911</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-2">Information</h3>
            <p className="text-sm text-gray-600 mb-2">
              This platform helps coordinate disaster response efforts by connecting those in need with emergency responders and volunteers.
            </p>
            <p className="text-sm text-gray-600">
              For life-threatening emergencies, always call your local emergency number first.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
