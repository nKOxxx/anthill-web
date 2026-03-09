import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'

function Governance() {
  const [rules, setRules] = useState([])
  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRule, setNewRule] = useState({
    name: '',
    rule_type: 'cost_threshold',
    threshold_value: 10,
    requires_approval: true
  })

  useEffect(() => {
    fetchGovernanceData()
  }, [])

  const fetchGovernanceData = async () => {
    try {
      const [rulesData, approvalsData] = await Promise.all([
        api.getGovernanceRules(),
        api.getPendingApprovals()
      ])
      setRules(rulesData.rules || [])
      setApprovals(approvalsData.approvals || [])
    } catch (err) {
      console.error('Failed to fetch governance data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRule = async (e) => {
    e.preventDefault()
    try {
      await api.request('/governance/rules', {
        method: 'POST',
        body: JSON.stringify(newRule)
      })
      setShowCreateModal(false)
      setNewRule({ name: '', rule_type: 'cost_threshold', threshold_value: 10, requires_approval: true })
      fetchGovernanceData()
    } catch (err) {
      console.error('Failed to create rule:', err)
      alert('Failed to create rule: ' + err.message)
    }
  }

  const handleApprove = async (id) => {
    try {
      await api.approveAction(id)
      fetchGovernanceData()
    } catch (err) {
      console.error('Failed to approve:', err)
    }
  }

  const handleReject = async (id) => {
    try {
      await api.rejectAction(id)
      fetchGovernanceData()
    } catch (err) {
      console.error('Failed to reject:', err)
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
      <h2 className="text-2xl font-bold mb-6">Governance</h2>

      {/* Pending Approvals */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-semibold text-lg">Pending Approvals ({approvals.length})</h3>
        </div>
        {approvals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending approvals. All agent actions are within policy.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {approvals.map((approval) => (
              <div key={approval.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{approval.action_type}</div>
                  <div className="text-gray-400 text-sm">
                    Agent: {approval.agent_name} | 
                    Estimated cost: ${approval.estimated_cost_usd}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(approval.id)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(approval.id)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Governance Rules */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Governance Rules</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            + Add Rule
          </button>
        </div>
        
        {rules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No governance rules defined. Add rules to control agent spending.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {rules.map((rule) => (
              <div key={rule.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-gray-400 text-sm">
                      Type: {rule.rule_type} | 
                      Threshold: ${rule.threshold_value} | 
                      Requires approval: {rule.requires_approval ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${rule.is_active ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Governance Rule</h3>
            <form onSubmit={handleCreateRule}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Rule Type</label>
                <select
                  value={newRule.rule_type}
                  onChange={(e) => setNewRule({...newRule, rule_type: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                >
                  <option value="cost_threshold">Cost Threshold</option>
                  <option value="tool_restriction">Tool Restriction</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Threshold ($)</label>
                <input
                  type="number"
                  value={newRule.threshold_value}
                  onChange={(e) => setNewRule({...newRule, threshold_value: parseFloat(e.target.value)})}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRule.requires_approval}
                    onChange={(e) => setNewRule({...newRule, requires_approval: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-400 text-sm">Requires approval</span>
                </label>
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

export default Governance
