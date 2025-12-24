
import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { Icons } from '../constants';
import { DashboardStats, RevenueData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  stats: DashboardStats | null;
  setActiveTab: (tab: string) => void;
  revenue: RevenueData[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, setActiveTab, revenue }) => {
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hospital Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back. Here is what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 flex items-center shadow-sm">
             <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
             SYSTEM ONLINE
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm">
             MAY 21, 2024
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Daily Appointments"
          value={stats.dailyAppointments}
          icon={<Icons.Calendar className="w-6 h-6" />}
          color="bg-sky-500"
          trend={{ value: 12, isUp: true }}
          onClick={() => setActiveTab('appointments')}
        />
        <DashboardCard
          title="OPD / IPD Patients"
          value={stats.opdPatients + stats.ipdPatients}
          icon={<Icons.Users className="w-6 h-6" />}
          color="bg-purple-500"
          trend={{ value: 5, isUp: true }}
          onClick={() => setActiveTab('patients')}
        />
        <DashboardCard
          title="Emergency Cases"
          value={stats.emergencyCases}
          icon={<Icons.Emergency className="w-6 h-6" />}
          color="bg-red-500"
          onClick={() => setActiveTab('emergency')}
        />
        <DashboardCard
          title="Revenue (Current Period)"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<Icons.Currency className="w-6 h-6" />}
          color="bg-green-500"
          trend={{ value: 8, isUp: true }}
          onClick={() => setActiveTab('revenue')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Revenue Analytics</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
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
          </div>
        </div>

        {/* Doctors Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Doctors on Duty</h3>
            <button 
                onClick={() => setActiveTab('doctors')}
                className="text-sky-600 text-xs font-semibold hover:underline"
            >
                View List
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold mr-3">SW</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Dr. Sarah Wilson</p>
                <p className="text-xs text-slate-500">Cabin 101 • General Medicine</p>
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center p-3 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-3">JM</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Dr. James Miller</p>
                <p className="text-xs text-slate-500">Cabin 202 • Dermatology</p>
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center p-3 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold mr-3">ER</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Dr. Elena Rossi</p>
                <p className="text-xs text-slate-500">Cabin 305 • Cardiology</p>
              </div>
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Active</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{stats.doctorsOnDuty} Staff</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
