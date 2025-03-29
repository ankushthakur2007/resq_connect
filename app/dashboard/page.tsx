import Stats from '@/components/Stats'
import AppErrorBoundary from '@/components/ErrorBoundary'

export const metadata = {
  title: 'Dashboard - Disaster Response',
  description: 'Analytics and statistics for emergency response efforts',
}

export default function DashboardPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Emergency Response Dashboard</h1>
        <p className="text-gray-600">
          Monitor and analyze emergency incidents and response efforts.
        </p>
      </div>
      
      <AppErrorBoundary>
        <Stats />
      </AppErrorBoundary>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <p className="font-medium">New Flood Reported</p>
              <p className="text-sm text-gray-500">2 minutes ago</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-medium">Fire Response Team Deployed</p>
              <p className="text-sm text-gray-500">15 minutes ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium">Medical Emergency Resolved</p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium">New Volunteer Joined</p>
              <p className="text-sm text-gray-500">3 hours ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Resource Allocation</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Medical Teams</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Emergency Vehicles</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Rescue Equipment</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Volunteer Force</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 