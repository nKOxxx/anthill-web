// API client for Anthill
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API Base URL:', API_BASE);

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      this.clearToken();
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyMagicLink(token) {
    const result = await this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  // Agents
  async getAgents() {
    return this.request('/agents');
  }

  async createAgent(agent) {
    return this.request('/agents', {
      method: 'POST',
      body: JSON.stringify(agent),
    });
  }

  async updateAgent(id, agent) {
    return this.request(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agent),
    });
  }

  async deleteAgent(id) {
    return this.request(`/agents/${id}`, {
      method: 'DELETE',
    });
  }

  // Costs
  async getCosts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/costs?${params}`);
  }

  async getCostSummary() {
    return this.request('/costs/summary');
  }

  // Tickets
  async getTickets() {
    return this.request('/tickets');
  }

  async createTicket(ticket) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  async updateTicket(id, ticket) {
    return this.request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticket),
    });
  }

  // Governance
  async getGovernanceRules() {
    return this.request('/governance/rules');
  }

  async getPendingApprovals() {
    return this.request('/governance/approvals');
  }

  async approveAction(id) {
    return this.request(`/governance/approvals/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectAction(id) {
    return this.request(`/governance/approvals/${id}/reject`, {
      method: 'POST',
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getRecentActivity() {
    return this.request('/dashboard/activity');
  }
}

export const api = new ApiClient();
export default api;
