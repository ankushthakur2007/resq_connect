'use client'
import { ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

type FallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg" role="alert">
      <h2 className="text-xl font-bold text-red-800 mb-2">
        Emergency System Temporarily Offline
      </h2>
      <p className="text-red-700 mb-4">
        Please use alternative communication channels for emergencies.
      </p>
      <div className="bg-white p-4 rounded mb-4 text-sm overflow-auto max-h-32">
        <pre className="text-gray-800">{error.message}</pre>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  )
}

type ErrorBoundaryProps = {
  children: ReactNode
}

export default function AppErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary FallbackComponent={Fallback}>
      {children}
    </ReactErrorBoundary>
  )
}

export { Fallback } 