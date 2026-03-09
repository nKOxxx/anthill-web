import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { LoadingCard, EmptyState, ErrorMessage, StatCard } from '../components/ui'

function Dashboard() {
  const [stats, setStats] = useState({
    active_agents: 0,
    month_cost: 0,
    open_tickets: 0,
    pending_approvals: 0
  })
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsData, activityData] = await Promise.all([
        api.getDashboardStats(),
        api.getRecentActivity()
      ])
      setStats(statsData)
      setActivity(activityData.activity || [])
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'agent_action': return { icon: '⚡', color: 'text-green-400' }
      case 'ticket': return { icon: '🎫', color: 'text-blue-400' }
      case 'approval': return { icon: '🛡️', color: 'text-yellow-400' }
      default: return { icon: '•', color: 'text-gray-400' }
    }
  }

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-4 gap-6 mb-8">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
        <LoadingCard />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Active Agents"
          value={stats.active_agents}
          icon="🤖"
          color="white"
        />
        <StatCard
          label="This Month Cost"
          value={`$${stats.month_cost.toFixed(2)}`}
          icon="💰"
          color="green"
        />
        <StatCard
          label="Open Tickets"
          value={stats.open_tickets}
          icon="🎫"
          color="yellow"
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pending_approvals}
          icon="🛡️"
          color="red"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-semibold text-lg">Recent Activity</h3>
        </div>
        <div className="p-6">
          {activity.length === 0 ? (
            <EmptyState
              icon="📊"
              title="No Recent Activity"
              description="Your agent activity will appear here when agents start performing actions."
            />
          ) : (
            <div className="space-y-4">
              {activity.map((item, index) => {
                const { icon, color } = getActivityIcon(item.type)
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-700/50 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`${color} text-xl`}>{icon}</span>
                      <div>
                        <span className="text-gray-200">{item.message}</span>
                        {item.cost && (
                          <span className="text-gray-500 ml-2">(${item.cost.toFixed(4)})</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm" title={new Date(item.timestamp).toLocaleString()}>
                      {formatTimeAgo(item.timestamp)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
