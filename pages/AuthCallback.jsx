import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyMagicLink } = useAuth();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyMagicLink(token)
        .then(() => {
          navigate('/');
        })
        .catch((err) => {
          console.error('Auth failed:', err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [token, navigate, verifyMagicLink]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
