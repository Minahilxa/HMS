
import React, { useState } from 'react';
import { Icons } from '../constants';
import { apiService } from '../services/apiService';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.login({ username, password });
      localStorage.setItem('his_token', response.token);
      onLogin(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-sky-600 rounded-2xl shadow-lg mb-6">
            <Icons.Hospital className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">HealSync HIS</h1>
          <p className="text-slate-500 mt-2">Hospital Information System Portal</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign In</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="Enter admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Log In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400">
              © 2024 HealSync Medical Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
