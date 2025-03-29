'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { pusher } from '@/lib/pusher'

type EmergencyType = 'flood' | 'fire' | 'earthquake' | 'medical' | 'other'

type Stats = {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  byType: Record<EmergencyType, number>;
}

// Sample stats for GitHub Pages demo
const SAMPLE_STATS: Stats = {
  total: 42,
  pending: 15,
  inProgress: 18,
  resolved: 9,
  byType: {
    flood: 12,
    fire: 8,
    earthquake: 5,
    medical: 14,
    other: 3
  }
};

export default function Stats() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    byType: {
      flood: 0,
      fire: 0,
      earthquake: 0,
      medical: 0,
      other: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [isGitHubPages, setIsGitHubPages] = useState(false)

  useEffect(() => {
    // Check if on GitHub Pages
    if (typeof window !== 'undefined') {
      const isGitHub = window.location.hostname.includes('github.io');
      setIsGitHubPages(isGitHub);
      
      // For GitHub Pages, use sample data
      if (isGitHub) {
        console.log('Using sample stats for GitHub Pages demo');
        setStats(SAMPLE_STATS);
        setLoading(false);
        return;
      }
    }
    
    // Regular functionality
    fetchStats();
    
    // Only set up Pusher if not on GitHub Pages
    if (!isGitHubPages) {
      // Listen for new incidents
      const channel = pusher.subscribe('incidents')
      channel.bind('new', () => {
        fetchStats()
      })
      
      return () => {
        pusher.unsubscribe('incidents')
      }
    }
  }, [isGitHubPages])

  const fetchStats = async () => {
    try {
      // Get total count
      const { count: total } = await supabase
        .from('incidents')
        .select('*', { count: 'exact', head: true })
      
      // Get count by status
      const { data: statusData } = await supabase
        .from('incidents')
        .select('status, count')
        .group('status')
      
      // Get count by type
      const { data: typeData } = await supabase
        .from('incidents')
        .select('type, count')
        .group('type')
      
      const pendingCount = statusData?.find(item => item.status === 'pending')?.count || 0
      const inProgressCount = statusData?.find(item => item.status === 'in_progress')?.count || 0
      const resolvedCount = statusData?.find(item => item.status === 'resolved')?.count || 0
      
      const byType: Record<EmergencyType, number> = {
        flood: 0,
        fire: 0,
        earthquake: 0,
        medical: 0,
        other: 0
      }
      
      typeData?.forEach(item => {
        if (item.type in byType) {
          byType[item.type as EmergencyType] = item.count
        }
      })
      
      setStats({
        total: total || 0,
        pending: pendingCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        byType
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to sample data on error
      setStats(SAMPLE_STATS);
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center p-8">Loading statistics...</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Emergency Statistics</h2>
        {isGitHubPages && (
          <div className="px-3 py-1 bg-yellow-100 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">Demo Mode: Using sample data</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Emergencies"
          value={stats.total}
          color="bg-gray-100"
        />
        <StatCard 
          title="Pending"
          value={stats.pending}
          color="bg-red-100"
        />
        <StatCard 
          title="In Progress"
          value={stats.inProgress}
          color="bg-yellow-100"
        />
        <StatCard 
          title="Resolved"
          value={stats.resolved}
          color="bg-green-100"
        />
      </div>
      
      <h3 className="text-xl font-bold mb-4">Emergencies by Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard 
          title="Flood"
          value={stats.byType.flood}
          color="bg-blue-100"
        />
        <StatCard 
          title="Fire"
          value={stats.byType.fire}
          color="bg-red-100"
        />
        <StatCard 
          title="Earthquake"
          value={stats.byType.earthquake}
          color="bg-orange-100"
        />
        <StatCard 
          title="Medical"
          value={stats.byType.medical}
          color="bg-green-100"
        />
        <StatCard 
          title="Other"
          value={stats.byType.other}
          color="bg-purple-100"
        />
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  color = 'bg-gray-100'
}: { 
  title: string; 
  value: number; 
  color?: string;
}) {
  return (
    <div className={`${color} p-4 rounded-lg shadow`}>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
} 