import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { LoadingSpinner, EmptyState, ErrorMessage, Button, Card, CardHeader } from '../components/ui'

function Agents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: '',
    description: '',
    runtime: 'openclaw',
    monthly_budget: 10
  })

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getAgents()
      setAgents(data.agents || [])
    } catch (err) {
      console.error('Failed to fetch agents:', err)
      setError(err.message || 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAgent = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.createAgent(newAgent)
      setShowCreateModal(false)
      setNewAgent({ name: '', role: '', description: '', runtime: 'openclaw', monthly_budget: 10 })
      await fetchAgents()
    } catch (err) {
      console.error('Failed to create agent:', err)
      alert('Failed to create agent: ' + err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleToggleStatus = async (agent) => {
    try {
      await api.updateAgent(agent.id, { ...agent, is_active: !agent.is_active })
      await fetchAgents()
    } catch (err) {
      console.error('Failed to update agent:', err)
      alert('Failed to update agent: ' + err.message)
    }
  }

  const handleDeleteAgent = async (id) => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) return
    try {
      await api.deleteAgent(id)
      await fetchAgents()
    } catch (err) {
      console.error('Failed to delete agent:', err)
      alert('Failed to delete agent: ' + err.message)
    }
  }

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-green-900/30 text-green-400 border border-green-900/50">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-500 border border-gray-700">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
        Inactive
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Agents</h2>
        <ErrorMessage message={error} onRetry={fetchAgents} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Agents</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          + New Agent
        </Button>
      </div>
      
      {agents.length === 0 ? (
        <EmptyState
          icon="🤖"
          title="No Agents Yet"
          description="Create your first agent to start tracking costs and managing your AI workforce."
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              Create Your First Agent
            </Button>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Agent</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Role</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Cost (MTD)</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-700/50 transition group">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{agent.name}</div>
                        <div className="text-sm text-gray-500">{agent.runtime || 'openclaw'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{agent.role}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(agent)}
                        className="hover:scale-105 transition"
                      >
                        {getStatusBadge(agent.is_active)}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-300">
                        ${agent.mtd_cost?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="text-red-500 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md m-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Create New Agent</h3>
            <form onSubmit={handleCreateAgent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Name *</label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 transition"
                    placeholder="e.g., Ares Dev"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Role *</label>
                  <input
                    type="text"
                    value={newAgent.role}
                    onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 transition"
                    placeholder="e.g., Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 transition"
                    placeholder="What does this agent do?"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Monthly Budget ($)</label>
                  <input
                    type="number"
                    value={newAgent.monthly_budget}
                    onChange={(e) => setNewAgent({...newAgent, monthly_budget: parseFloat(e.target.value)})}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 transition"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={creating}
                  className="flex-1"
                >
                  Create Agent
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Agents
