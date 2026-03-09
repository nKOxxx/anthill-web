import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Agents from './pages/Agents'
import Costs from './pages/Costs'
import Tickets from './pages/Tickets'
import Governance from './pages/Governance'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'

function PrivateRoute({ children }) {
  // AUTH BYPASSED FOR DEMO - Remove this later
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        } />
        <Route path="/agents" element={
          <PrivateRoute>
            <Layout><Agents /></Layout>
          </PrivateRoute>
        } />
        <Route path="/costs" element={
          <PrivateRoute>
            <Layout><Costs /></Layout>
          </PrivateRoute>
        } />
        <Route path="/tickets" element={
          <PrivateRoute>
            <Layout><Tickets /></Layout>
          </PrivateRoute>
        } />
        <Route path="/governance" element={
          <PrivateRoute>
            <Layout><Governance /></Layout>
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
