import React, { useState, useEffect } from 'react'
import { api } from '../lib/api'

function Costs() {
  const [costs, setCosts] = useState([])
  const [summary, setSummary] = useState({
    month: { total: 0, request_count: 0 },
    today: { total: 0 },
    by_agent: [],
    by_tool: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCostData()
  }, [])

  const fetchCostData = async () => {
    try {
      const [costsData, summaryData] = await Promise.all([
        api.getCosts({ limit: 50 }),
        api.getCostSummary()
      ])
      setCosts(costsData.costs || [])
      setSummary(summaryData)
    } catch (err) {
      console.error('Failed to fetch cost data:', err)
    } finally {
      setLoading(false)
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
      <h2 className="text-2xl font-bold mb-6">Cost Tracking</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">This Month</div>
          <div className="text-3xl font-bold text-green-400">${summary.month.total.toFixed(2)}</div>
          <div className="text-gray-500 text-sm mt-1">{summary.month.request_count} requests</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">Today</div>
          <div className="text-3xl font-bold text-white">${summary.today.total.toFixed(2)}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">Avg per Request</div>
          <div className="text-3xl font-bold text-white">
            ${summary.month.request_count > 0 
              ? (summary.month.total / summary.month.request_count).toFixed(4) 
              : '0.0000'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* By Agent */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="font-semibold">Costs by Agent</h3>
          </div>
          <div className="p-4">
            {summary.by_agent.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {summary.by_agent.map((agent) => (
                  <div key={agent.id} className="flex justify-between items-center">
                    <span>{agent.name}</span>
                    <span className="font-mono">${agent.total_cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* By Tool */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="font-semibold">Costs by Tool</h3>
          </div>
          <div className="p-4">
            {summary.by_tool.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {summary.by_tool.map((tool) => (
                  <div key={tool.tool_name} className="flex justify-between items-center">
                    <span>{tool.tool_name}</span>
                    <span className="font-mono">${tool.total_cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Costs Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="font-semibold">Recent Costs</h3>
        </div>
        <div className="px-6 py-4 border-b border-gray-700 grid grid-cols-6 text-sm text-gray-400">
          <div>Time</div>
          <div>Agent</div>
          <div>Tool</div>
          <div>Model</div>
          <div>Tokens</div>
          <div>Cost</div>
        </div>
        {costs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No cost data yet. Costs will appear here when agents perform actions.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {costs.map((cost) => (
              <div key={cost.id} className="px-6 py-3 grid grid-cols-6 text-sm items-center">
                <div className="text-gray-400">{new Date(cost.created_at).toLocaleString()}</div>
                <div>{cost.agent_name || 'Unknown'}</div>
                <div>{cost.tool_name}</div>
                <div className="text-gray-400">{cost.model || '-'}</div>
                <div className="text-gray-400">
                  {cost.input_tokens + cost.output_tokens > 0 
                    ? `${cost.input_tokens}/${cost.output_tokens}` 
                    : '-'}
                </div>
                <div className="font-mono">${cost.cost_usd}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Costs
