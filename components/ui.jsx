import React from 'react';

export function LoadingSpinner({ size = 'medium' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-red-500`}></div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-gray-700 rounded w-1/2 mb-6"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-6 text-center">
      <div className="text-red-400 text-3xl mb-2">⚠️</div>
      <p className="text-red-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }) {
  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`fixed top-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">✕</button>
    </div>
  );
}

export function Button({ children, onClick, type = 'button', variant = 'primary', loading = false, disabled = false, className = '' }) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 disabled:bg-red-900/50',
    secondary: 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800',
    danger: 'bg-red-700 hover:bg-red-800 disabled:bg-red-900/50',
    ghost: 'bg-transparent hover:bg-gray-800 disabled:opacity-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {loading && <LoadingSpinner size="small" />}
      {children}
    </button>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }) {
  return (
    <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
      <h3 className="font-semibold text-lg">{title}</h3>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon, trend, color = 'white' }) {
  const colorClasses = {
    white: 'text-white',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    blue: 'text-blue-400'
  };

  return (
    <Card className="p-6 hover:border-gray-600 transition">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-gray-400 text-sm mb-2">{label}</div>
          <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
          {trend && (
            <div className="text-sm mt-2 text-gray-500">{trend}</div>
          )}
        </div>
        <div className="text-2xl opacity-50">{icon}</div>
      </div>
    </Card>
  );
}
