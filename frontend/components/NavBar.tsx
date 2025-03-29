'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  // Check if the current route matches the link
  const isActive = (path: string) => router.pathname === path

  // Handle scroll event to add shadow and background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close the mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMenuOpen && !target.closest('nav')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-bold text-secondary group-hover:text-secondary-hover transition-colors">
                ResQ<span className="text-primary group-hover:text-primary-hover transition-colors">connect</span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <NavLink href="/" isActive={isActive('/')}>Home</NavLink>
            <NavLink href="/about" isActive={isActive('/about')}>About</NavLink>
            <NavLink href="/projects" isActive={isActive('/projects')}>Projects</NavLink>
            <NavLink href="/map" isActive={isActive('/map')}>Live Map</NavLink>
            <NavLink href="/dashboard" isActive={isActive('/dashboard')}>Dashboard</NavLink>
            <Link 
              href="/volunteer" 
              className="ml-2 btn-primary text-sm py-2 px-4"
            >
              Support Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none transition-colors duration-200"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg 
                className="h-7 w-7" 
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
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`bg-white h-screen w-4/5 max-w-sm shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                <span className="text-2xl font-bold text-secondary">
                  ResQ<span className="text-primary">connect</span>
                </span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary focus:outline-none transition-colors"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <MobileNavLink href="/" isActive={isActive('/')} onClick={() => setIsMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/about" isActive={isActive('/about')} onClick={() => setIsMenuOpen(false)}>
                About
              </MobileNavLink>
              <MobileNavLink href="/projects" isActive={isActive('/projects')} onClick={() => setIsMenuOpen(false)}>
                Projects
              </MobileNavLink>
              <MobileNavLink href="/map" isActive={isActive('/map')} onClick={() => setIsMenuOpen(false)}>
                Live Map
              </MobileNavLink>
              <MobileNavLink href="/dashboard" isActive={isActive('/dashboard')} onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </MobileNavLink>
              <div className="pt-4">
                <Link 
                  href="/volunteer" 
                  className="block w-full btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Support Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Desktop navigation link component
function NavLink({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${
        isActive 
          ? 'text-primary' 
          : 'text-gray-700 hover:text-primary'
      }`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}></span>
    </Link>
  )
}

// Mobile navigation link component
function MobileNavLink({ 
  href, 
  isActive, 
  onClick, 
  children 
}: { 
  href: string; 
  isActive: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) {
  return (
    <Link
      href={href}
      className={`block py-2.5 px-4 rounded-md font-medium transition-colors ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
} 