import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Layout({ children }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/agents', label: 'Agents', icon: '🤖' },
    { path: '/costs', label: 'Costs', icon: '💰' },
    { path: '/tickets', label: 'Tickets', icon: '🎫' },
    { path: '/governance', label: 'Governance', icon: '🛡️' },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black border-b border-red-900/30">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚔️</span>
            <h1 className="text-xl font-bold text-white">Anthill</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user?.company?.plan || 'Pro'} Plan</span>
            <button 
              onClick={logout}
              className="text-gray-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
          <div className="p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
                  location.pathname === item.path
                    ? 'bg-red-900/20 text-red-400 border border-red-900/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
