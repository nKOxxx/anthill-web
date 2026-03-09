import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'

function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium'
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const data = await api.getTickets()
      setTickets(data.tickets || [])
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    try {
      await api.createTicket(newTicket)
      setShowCreateModal(false)
      setNewTicket({ title: '', description: '', priority: 'medium' })
      fetchTickets()
    } catch (err) {
      console.error('Failed to create ticket:', err)
      alert('Failed to create ticket: ' + err.message)
    }
  }

  const handleStatusChange = async (ticket, newStatus) => {
    try {
      await api.updateTicket(ticket.id, { ...ticket, status: newStatus })
      fetchTickets()
    } catch (err) {
      console.error('Failed to update ticket:', err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'text-green-400'
      case 'in_progress': return 'text-blue-400'
      case 'review': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tickets</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium transition"
        >
          + New Ticket
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700 grid grid-cols-5 text-sm text-gray-400">
          <div>Title</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Assigned To</div>
          <div>Created</div>
        </div>
        
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tickets yet. Create your first ticket to track work.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="px-6 py-4 grid grid-cols-5 items-center hover:bg-gray-700/50">
                <div className="font-medium">{ticket.title}</div>
                <div>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket, e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getPriorityColor(ticket.priority)}`}></span>
                  <span className="capitalize">{ticket.priority}</span>
                </div>
                <div className="text-gray-400">{ticket.agent_name || 'Unassigned'}</div>
                <div className="text-gray-400 text-sm">{new Date(ticket.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Ticket</h3>
            <form onSubmit={handleCreateTicket}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tickets
