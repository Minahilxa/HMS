
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Invitation Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);

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

  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const role = formData.get('role') as UserRole;

    try {
      const success = await apiService.sendUserInvitation(email, role);
      if (success) {
        alert(`Invitation sent successfully to ${email}`);
        setShowInviteModal(false);
      }
    } catch (err) {
      alert("Failed to send invitation. Please try again.");
    } finally {
      setInviting(false);
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: 
        return { 
          bg: 'bg-rose-50', 
          text: 'text-rose-700', 
          border: 'border-rose-200', 
          dot: 'bg-rose-500' 
        };
      case UserRole.ADMIN: 
        return { 
          bg: 'bg-orange-50', 
          text: 'text-orange-700', 
          border: 'border-orange-200', 
          dot: 'bg-orange-500' 
        };
      case UserRole.DOCTOR: 
        return { 
          bg: 'bg-sky-50', 
          text: 'text-sky-700', 
          border: 'border-sky-200', 
          dot: 'bg-sky-500' 
        };
      case UserRole.NURSE: 
        return { 
          bg: 'bg-indigo-50', 
          text: 'text-indigo-700', 
          border: 'border-indigo-200', 
          dot: 'bg-indigo-500' 
        };
      case UserRole.ACCOUNTANT: 
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          border: 'border-emerald-200', 
          dot: 'bg-emerald-500' 
        };
      case UserRole.RECEPTIONIST: 
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-700', 
          border: 'border-amber-200', 
          dot: 'bg-amber-500' 
        };
      default: 
        return { 
          bg: 'bg-slate-50', 
          text: 'text-slate-700', 
          border: 'border-slate-200', 
          dot: 'bg-slate-500' 
        };
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
        <button 
          onClick={() => setShowInviteModal(true)}
          className="bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all shadow-md shadow-sky-100 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Current Role</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Change Permission</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => {
                const style = getRoleBadgeStyle(user.role);
                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3 shadow-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-bold text-slate-800 tracking-tight">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-sm font-medium">{user.email}</td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border ${style.bg} ${style.text} ${style.border} transition-all duration-300`}>
                        <span className={`w-1.5 h-1.5 ${style.dot} rounded-full mr-2 shadow-sm`}></span>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative group max-w-[200px] mx-auto">
                        {updating === user.id ? (
                          <div className="flex justify-center items-center py-2">
                            <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <div className="relative">
                            <select
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer hover:border-sky-300 hover:bg-white shadow-sm"
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            >
                              {Object.values(UserRole).map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-sky-500 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-[10px] font-black tracking-widest text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-xl w-fit border border-emerald-100">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                        ACTIVE
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Permission Guide</h3>
            <p className="text-slate-300 text-sm opacity-90 leading-relaxed mb-6">
              Roles define what data modules a user can access. Super Admins can override all restrictions. Ensure doctors only have access to patient records for confidentiality.
            </p>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md transition-all">
              Read Security Protocol
            </button>
          </div>
          <Icons.UserShield className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center group hover:border-sky-200 transition-all">
           <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                 <Icons.Dashboard className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800">Audit Logs</h3>
                 <p className="text-xs text-slate-500">Track all role modification activities.</p>
              </div>
           </div>
           <p className="text-sm text-slate-600 mb-4 leading-relaxed">Total of 24 role changes were made in the last 30 days by Super Admin. All changes are logged for HIPAA compliance.</p>
           <button className="text-sky-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center">
              View Activity Report
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
        </div>
      </div>

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Invite New Staff</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
            </div>
            <form onSubmit={handleInviteSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Staff Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-300" 
                  placeholder="staff@hospital.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Assigned Role</label>
                <div className="relative">
                  <select 
                    name="role" 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none appearance-none bg-white transition-all font-semibold text-slate-700"
                  >
                    {Object.values(UserRole).filter(r => r !== UserRole.PATIENT).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
                <p className="text-[10px] text-sky-700 font-bold leading-relaxed">
                  An invitation link will be sent to the email provided. The user will be prompted to set their credentials and complete their profile upon clicking the link.
                </p>
              </div>
              <button 
                type="submit" 
                disabled={inviting}
                className="w-full bg-sky-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-sky-700 transition-all uppercase tracking-widest text-xs flex items-center justify-center disabled:opacity-50"
              >
                {inviting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Icons.Mail className="w-4 h-4 mr-2" />
                    Send Digital Invitation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
