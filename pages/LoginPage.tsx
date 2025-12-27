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
      console.error("Login System Error:", err);
      const msg = err.message?.toLowerCase() || '';
      
      // Specifically catch ECONNREFUSED or general fetch failures
      if (
        msg.includes('fetch') || 
        msg.includes('refused') || 
        msg.includes('connect') || 
        msg.includes('network')
      ) {
        setError('Failed to connect to the server. Please ensure the backend is running.');
      } else {
        setError(err.message || 'Access Denied: Invalid staff credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-sky-600 rounded-2xl shadow-lg mb-6">
            <Icons.Hospital className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HealSync HIS</h1>
          <p className="text-slate-500 mt-2 font-medium">Enterprise Health Management Portal</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Staff Authentication</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl animate-fade-in">
              <div className="flex items-start">
                <Icons.Emergency className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                <p className="font-medium leading-tight">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Staff Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50/50"
                placeholder="e.g. admin, doctor, nurse"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Security Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50/50"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-sky-100 transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? 'Verifying Identity...' : 'Access Clinical System'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[9px] text-center text-slate-400 font-medium uppercase tracking-tighter">
              Secure Medical Environment &copy; 2024 HealSync Global. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;