
import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { Icons } from '../constants';
import { DashboardStats, RevenueData, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  stats: DashboardStats | null;
  setActiveTab: (tab: string) => void;
  revenue: RevenueData[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, setActiveTab, revenue = [] }) => {
  const userString = localStorage.getItem('his_user');
  const currentUser = userString ? JSON.parse(userString) : null;
  const role = currentUser?.role as UserRole;

  const displayStats = stats || {
    dailyAppointments: 0,
    opdPatients: 0,
    ipdPatients: 0,
    emergencyCases: 0,
    totalRevenue: 0,
    doctorsOnDuty: 0
  };

  const getGreeting = () => {
    switch(role) {
      case UserRole.DOCTOR: return "Doctor's Clinical Hub";
      case UserRole.PATIENT: return "My Patient Portal";
      case UserRole.ACCOUNTANT: return "Financial Intelligence Unit";
      case UserRole.LAB_TECH: return "Laboratory Operations Control";
      default: return "Hospital Overview";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{getGreeting()}</h1>
          <p className="text-slate-500 text-sm">Welcome back, {currentUser?.name || 'Administrator'}. Here is your session summary.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 flex items-center shadow-sm">
             <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
             SYSTEM ONLINE
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 shadow-sm">
             {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title={role === UserRole.PATIENT ? "My Appointments" : "Daily Appointments"}
          value={displayStats.dailyAppointments}
          icon={<Icons.Calendar className="w-6 h-6" />}
          variant="sky"
          onClick={() => setActiveTab('apt-mgmt')}
        />
        
        {role !== UserRole.ACCOUNTANT && role !== UserRole.PATIENT && (
          <DashboardCard
            title="Total Active Patients"
            value={displayStats.opdPatients + displayStats.ipdPatients}
            icon={<Icons.Users className="w-6 h-6" />}
            variant="purple"
            onClick={() => setActiveTab('patients')}
          />
        )}

        {role === UserRole.PATIENT && (
          <DashboardCard
            title="Assigned Doctors"
            value={displayStats.doctorsOnDuty}
            icon={<Icons.Stethoscope className="w-6 h-6" />}
            variant="purple"
            onClick={() => setActiveTab('patients')}
          />
        )}

        {(role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN || role === UserRole.DOCTOR || role === UserRole.NURSE) && (
          <DashboardCard
            title="Emergency Alerts"
            value={displayStats.emergencyCases}
            icon={<Icons.Emergency className="w-6 h-6" />}
            variant="red"
            onClick={() => setActiveTab('emergency')}
          />
        )}

        {(role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN || role === UserRole.ACCOUNTANT) && (
          <DashboardCard
            title="Period Revenue"
            value={`$${(displayStats.totalRevenue || 0).toLocaleString()}`}
            icon={<Icons.Currency className="w-6 h-6" />}
            variant="green"
            onClick={() => setActiveTab('revenue')}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Hidden for clinical roles or patients */}
        {(role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN || role === UserRole.ACCOUNTANT) && (
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Revenue Analytics</h3>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interactive Cashflow Stream</div>
            </div>
            <div className="h-80">
              {revenue && revenue.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                  <Icons.ChartBar className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-xs italic font-medium">Synchronizing with Billing records...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Doctors Summary - Visible to most but different context */}
        <div className={`${(role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN || role === UserRole.ACCOUNTANT) ? 'lg:col-span-1' : 'lg:col-span-3'} bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">{role === UserRole.PATIENT ? "Available Specialists" : "Clinicians Active"}</h3>
            {role !== UserRole.PATIENT && (
              <button 
                  onClick={() => setActiveTab('doctor-mgmt')}
                  className="text-sky-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
              >
                  Staff Roster
              </button>
            )}
          </div>
          <div className="flex-1 space-y-4">
             <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
                <Icons.Stethoscope className="w-10 h-10 text-slate-300 mb-3 opacity-50" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4">Staff metrics updating</p>
             </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">On-Duty Personnel</span>
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black">{displayStats.doctorsOnDuty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
