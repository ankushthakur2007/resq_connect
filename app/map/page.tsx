import LiveMap from '@/components/LiveMap'
import AppErrorBoundary from '@/components/ErrorBoundary'

export const metadata = {
  title: 'Live Emergency Map - Disaster Response',
  description: 'Real-time map of active emergencies and incidents',
}

export default function MapPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Live Emergency Map</h1>
        <p className="text-gray-600">
          View real-time updates of all reported emergencies and their current status.
        </p>
      </div>
      
      <AppErrorBoundary>
        <LiveMap />
      </AppErrorBoundary>
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Map Legend</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>Pending Emergencies</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>Resolved</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Click on any marker to see more details about the emergency. The map updates in real-time as new incidents are reported.
        </p>
      </div>
    </main>
  )
} 