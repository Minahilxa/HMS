
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await apiService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdating(userId);
    const success = await apiService.updateUserRole(userId, newRole);
    if (success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdating(null);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-red-100 text-red-700 border-red-200';
      case UserRole.ADMIN: return 'bg-orange-100 text-orange-700 border-orange-200';
      case UserRole.DOCTOR: return 'bg-sky-100 text-sky-700 border-sky-200';
      case UserRole.NURSE: return 'bg-purple-100 text-purple-700 border-purple-200';
      case UserRole.ACCOUNTANT: return 'bg-green-100 text-green-700 border-green-200';
      case UserRole.RECEPTIONIST: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        <p className="text-slate-500 font-medium">Loading system users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User & Role Management</h1>
          <p className="text-sm text-slate-500">Assign system permissions and manage staff access levels.</p>
        </div>
        <button className="bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all shadow-md shadow-sky-100 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User Profile</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Current Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Change Permission</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3 shadow-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group max-w-[200px] mx-auto">
                      {updating === user.id ? (
                        <div className="flex justify-center">
                          <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <select
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-sky-500 outline-none transition-all appearance-none cursor-pointer hover:border-slate-300"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        >
                          {Object.values(UserRole).map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      ACTIVE
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-8 rounded-3xl text-white shadow-xl shadow-sky-200 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Permission Guide</h3>
            <p className="text-sky-100 text-sm opacity-90 leading-relaxed mb-6">
              Roles define what data modules a user can access. Super Admins can override all restrictions. Ensure doctors only have access to patient records for confidentiality.
            </p>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md transition-all">
              Read Security Protocol
            </button>
          </div>
          <Icons.UserShield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10 group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
           <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mr-4">
                 <Icons.Dashboard className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800">Audit Logs</h3>
                 <p className="text-xs text-slate-500">Track all role modification activities.</p>
              </div>
           </div>
           <p className="text-sm text-slate-600 mb-4">Total of 24 role changes were made in the last 30 days by Super Admin.</p>
           <button className="text-sky-600 font-bold text-xs hover:underline flex items-center">
              View Activity Report
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
