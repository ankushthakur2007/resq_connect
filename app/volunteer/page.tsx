import Chat from '@/components/Chat'
import AppErrorBoundary from '@/components/ErrorBoundary'

export const metadata = {
  title: 'Volunteer Coordination - Disaster Response',
  description: 'Chat and coordinate with other volunteers and emergency responders',
}

export default function VolunteerPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Volunteer Coordination</h1>
        <p className="text-gray-600">
          Connect with other volunteers and emergency responders to coordinate efforts.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AppErrorBoundary>
            <Chat />
          </AppErrorBoundary>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Volunteer Guidelines</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Only share verified information</li>
              <li>Be clear about your location and availability</li>
              <li>Follow instructions from official responders</li>
              <li>Report any dangerous situations immediately</li>
              <li>Provide regular updates on your assigned tasks</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Safety First</h2>
            <p className="text-gray-700 mb-4">
              Never put yourself in danger. Always prioritize your safety and the safety of others.
            </p>
            <p className="text-gray-700">
              If you're unsure about a situation, consult with experienced emergency responders before taking action.
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Training Resources</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Basic First Aid Training
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Disaster Response Protocols
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Communication Best Practices
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Emergency Equipment Guide
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
} 