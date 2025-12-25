
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { RevenueData, DoctorPerformance, HospitalDepartment, PatientGrowthEntry, CustomReport, Doctor } from '../types';
import { Icons } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';

const ReportsManagement: React.FC = () => {
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [performance, setPerformance] = useState<DoctorPerformance[]>([]);
  const [depts, setDepts] = useState<HospitalDepartment[]>([]);
  const [growth, setGrowth] = useState<PatientGrowthEntry[]>([]);
  const [reports, setReports] = useState<CustomReport[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'revenue' | 'performance' | 'departments' | 'growth' | 'custom'>('revenue');
  
  // Modal state
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [rev, perf, d, g, r, docs] = await Promise.all([
      apiService.getRevenueSummary(),
      apiService.getDoctorPerformance(),
      apiService.getDepartments(),
      apiService.getPatientGrowthStats(),
      apiService.getCustomReports(),
      apiService.getDoctors()
    ]);
    setRevenue(rev);
    setPerformance(perf);
    setDepts(d);
    setGrowth(g);
    setReports(r);
    setDoctors(docs);
    setLoading(false);
  };

  const handleDeleteReport = async (id: string) => {
    if (confirm("Are you sure you want to delete this report definition?")) {
      await apiService.deleteCustomReport(id);
      loadData();
    }
  };

  const COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444', '#3b82f6'];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.ChartBar className="w-8 h-8 mr-3 text-sky-600" />
            Strategic Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500">Institutional health metrics, clinical performance, and financial auditing.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab('revenue')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'revenue' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Revenue</button>
          <button onClick={() => setActiveTab('performance')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'performance' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Clinicians</button>
          <button onClick={() => setActiveTab('departments')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'departments' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Depts</button>
          <button onClick={() => setActiveTab('growth')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'growth' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Growth</button>
          <button onClick={() => setActiveTab('custom')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'custom' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Report Mgmt</button>
        </div>
      </div>

      {activeTab === 'revenue' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-6 flex justify-between items-center">
                    Daily Revenue Influx
                    <span className="text-[10px] text-slate-400 font-bold uppercase">7-Day Rolling Trend</span>
                 </h3>
                 <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={revenue}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={3} fill="#0ea5e9" fillOpacity={0.05} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-6">Revenue Mix</h3>
                 <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={[
                                { name: 'OPD', value: revenue.filter(r => r.category === 'OPD').reduce((a,c) => a+c.amount, 0) },
                                { name: 'IPD', value: revenue.filter(r => r.category === 'IPD').reduce((a,c) => a+c.amount, 0) },
                                { name: 'Lab', value: revenue.filter(r => r.category === 'Lab').reduce((a,c) => a+c.amount, 0) },
                                { name: 'Pharmacy', value: revenue.filter(r => r.category === 'Pharmacy').reduce((a,c) => a+c.amount, 0) },
                             ]}
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                          >
                             {revenue.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-8">Clinician Patient Load Analysis</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={performance.map(p => ({
                    name: doctors.find(d => d.id === p.doctorId)?.name.split(' ').pop(),
                    load: p.patientsSeen,
                    rating: p.rating * 50 // Scaling for chart
                 }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="load" fill="#0ea5e9" radius={[10, 10, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Staff Distribution by Department</h3>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={depts.map(d => ({ name: d.name, staff: d.staffCount }))}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} width={100} />
                       <Tooltip />
                       <Bar dataKey="staff" fill="#8b5cf6" radius={[0, 10, 10, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-4">Department Utilization</h3>
                 <div className="space-y-6">
                    {depts.map(dept => (
                       <div key={dept.id}>
                          <div className="flex justify-between text-xs font-black uppercase mb-2">
                             <span>{dept.name}</span>
                             <span>{Math.floor(Math.random() * 40 + 60)}% Utilization</span>
                          </div>
                          <div className="h-1 w-full bg-white/10 rounded-full">
                             <div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <Icons.Hospital className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5" />
           </div>
        </div>
      )}

      {activeTab === 'growth' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-8">Registration vs. Discharge Velocity</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={growth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="newPatients" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="discharges" stroke="#22c55e" strokeWidth={4} dot={{ r: 6, fill: '#22c55e', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Saved Report Definitions</h2>
              <button onClick={() => setShowReportModal(true)} className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all">
                 Configure Custom Report
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(report => (
                 <div key={report.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-300 transition-all group">
                    <div className="flex justify-between mb-4">
                       <span className="bg-sky-50 text-sky-600 text-[10px] font-black uppercase px-2 py-1 rounded-lg">{report.type}</span>
                       <button onClick={() => handleDeleteReport(report.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                       </button>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{report.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{report.dateRange}</p>
                    <div className="mt-4 pt-4 border-t border-slate-50">
                       <p className="text-xs text-slate-500 mb-4 line-clamp-1"><span className="font-bold text-slate-700">Filters:</span> {report.filters}</p>
                       <button className="w-full bg-slate-100 text-slate-600 font-black text-[10px] py-2 rounded-xl uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all">Generate Now</button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* New Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Custom Report Configuration</h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); setShowReportModal(false); loadData(); }} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Report Name</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. Annual Surgical Audit" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Metrics Domain</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>Revenue</option>
                       <option>Clinical Outcome</option>
                       <option>HR & Staffing</option>
                       <option>Operational Efficiency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time Horizon</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>Current Quarter</option>
                       <option>Last 6 Months</option>
                       <option>Year to Date</option>
                       <option>Custom Range</option>
                    </select>
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filtering Parameters</label>
                   <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none h-24 resize-none" placeholder="e.g. Department IN (Cardiology, Surgery) AND Status = 'Finalized'" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all uppercase tracking-widest text-xs">Save Analysis Template</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;
