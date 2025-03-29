'use client'

import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Disaster Response</Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/map" className="hover:underline">Live Map</Link>
          <Link href="/volunteer" className="hover:underline">Volunteer</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        </div>
      </div>
    </nav>
  )
} 