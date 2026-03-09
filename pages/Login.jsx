import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email);
      setMagicLinkSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <span className="text-4xl">⚔️</span>
          </div>
          <h1 className="text-2xl font-bold text-center mb-4">Check Your Email</h1>
          <p className="text-gray-400 text-center mb-6">
            We've sent a magic link to <strong>{email}</strong>. 
            Click the link to sign in.
          </p>
          <p className="text-gray-500 text-sm text-center">
            In this demo, check the browser console for the magic link token.
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="w-full mt-4 text-red-400 hover:text-red-300"
          >
            Use different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <span className="text-4xl">⚔️</span>
          <h1 className="text-2xl font-bold mt-4">Anthill</h1>
          <p className="text-gray-400 mt-2">Agent Workforce Orchestration</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/30 text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 px-4 py-2 rounded font-medium transition"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          No password needed. We'll send you a magic link to sign in instantly.
        </p>
      </div>
    </div>
  );
}

export default Login;
