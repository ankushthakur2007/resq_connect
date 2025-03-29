'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-slate-800">ResQ<span className="text-red-600">connect</span></span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-red-600 font-medium">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium">About</Link>
            <Link href="/projects" className="text-gray-700 hover:text-red-600 font-medium">Projects</Link>
            <Link href="/map" className="text-gray-700 hover:text-red-600 font-medium">Live Map</Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-red-600 font-medium">Dashboard</Link>
            <Link 
              href="/volunteer" 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Support Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/projects" 
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="/map" 
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Live Map
            </Link>
            <Link 
              href="/dashboard" 
              className="block py-2 px-4 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/volunteer" 
              className="block py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Support Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
} 