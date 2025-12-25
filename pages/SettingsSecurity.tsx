
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { HospitalSettings, EmergencyNumber, PaymentGateway, BackupLog, SecuritySetting } from '../types';
import { Icons } from '../constants';

const SettingsSecurity: React.FC = () => {
  const [hospital, setHospital] = useState<HospitalSettings | null>(null);
  const [emergencies, setEmergencies] = useState<EmergencyNumber[]>([]);
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [backups, setBackups] = useState<BackupLog[]>([]);
  const [security, setSecurity] = useState<SecuritySetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'emergency' | 'payments' | 'backups' | 'security'>('general');
  const [backingUp, setBackingUp] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [h, e, g, b, s] = await Promise.all([
      apiService.getHospitalSettings(),
      apiService.getEmergencyNumbers(),
      apiService.getPaymentGateways(),
      apiService.getBackupLogs(),
      apiService.getSecuritySettings()
    ]);
    setHospital(h);
    setEmergencies(e);
    setGateways(g);
    setBackups(b);
    setSecurity(s);
    setLoading(false);
  };

  const handleUpdateHospital = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = Object.fromEntries(formData.entries());
    await apiService.updateHospitalSettings(updates as any);
    alert("Hospital settings updated successfully.");
    loadData();
  };

  const handleToggleSecurity = async (id: string) => {
    await apiService.toggleSecuritySetting(id);
    loadData();
  };

  const handleRunBackup = async () => {
    setBackingUp(true);
    await apiService.runManualBackup();
    setTimeout(() => {
      setBackingUp(false);
      loadData();
    }, 1000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.Cog6Tooth className="w-8 h-8 mr-3 text-slate-600" />
            Settings & Security
          </h1>
          <p className="text-sm text-slate-500">Configure core system parameters, payment infrastructure, and data safety protocols.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab('general')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'general' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-50' && 'text-slate-500'}`}>General</button>
          <button onClick={() => setActiveTab('emergency')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'emergency' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Emergency</button>
          <button onClick={() => setActiveTab('payments')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'payments' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Payments</button>
          <button onClick={() => setActiveTab('backups')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'backups' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Backups</button>
          <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'security' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Security</button>
        </div>
      </div>

      {activeTab === 'general' && hospital && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <form onSubmit={handleUpdateHospital} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hospital Name</label>
                    <input name="name" defaultValue={hospital.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Slogan / Tagline</label>
                    <input name="tagline" defaultValue={hospital.tagline} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Physical Address</label>
                    <input name="address" defaultValue={hospital.address} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Email</label>
                    <input name="email" defaultValue={hospital.email} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Phone</label>
                    <input name="phone" defaultValue={hospital.phone} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Standard OPD Timings</label>
                    <textarea name="opdTimings" defaultValue={hospital.opdTimings} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none h-20 resize-none" />
                 </div>
              </div>
              <div className="flex justify-end pt-4">
                 <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-black transition-all">Save Global Settings</button>
              </div>
           </form>
        </div>
      )}

      {activeTab === 'emergency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {emergencies.map(en => (
              <div key={en.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative group overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full opacity-50 -mr-4 -mt-4 transition-transform group-hover:scale-125"></div>
                 <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter mb-1">{en.department}</p>
                 <h3 className="font-bold text-slate-800 text-lg">{en.label}</h3>
                 <p className="text-2xl font-black text-slate-900 mt-4 tracking-tight">{en.number}</p>
                 <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                    <button className="text-[10px] font-bold text-slate-400 hover:text-sky-600 uppercase">Modify Number</button>
                 </div>
              </div>
           ))}
           <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-red-300 hover:text-red-400 transition-all cursor-pointer">
              <Icons.Emergency className="w-10 h-10 mb-2 opacity-30" />
              <span className="font-black uppercase text-xs tracking-widest">Add Contact</span>
           </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
           {gateways.map(gw => (
              <div key={gw.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700">
                       <Icons.CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-800">{gw.provider}</h3>
                       <p className="text-xs text-slate-400 font-medium tracking-tight">Merchant ID: {gw.merchantId}</p>
                    </div>
                 </div>
                 <div className="flex-1 px-0 md:px-8">
                    <div className="flex flex-wrap gap-2">
                       {gw.methods.map(m => (
                          <span key={m} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{m}</span>
                       ))}
                    </div>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                       gw.status === 'Active' ? 'bg-green-50 text-green-600' :
                       gw.status === 'Testing' ? 'bg-amber-50 text-amber-600' :
                       'bg-slate-100 text-slate-400'
                    }`}>{gw.status}</span>
                    <button className="text-sky-600 font-bold text-[10px] uppercase hover:underline">Manage API</button>
                 </div>
              </div>
           ))}
        </div>
      )}

      {activeTab === 'backups' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Database & System Snapshots</h2>
              <button 
                onClick={handleRunBackup}
                disabled={backingUp}
                className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-sky-700 transition-all flex items-center"
              >
                 <Icons.CloudArrowUp className={`w-4 h-4 mr-2 ${backingUp ? 'animate-bounce' : ''}`} />
                 {backingUp ? 'Syncing...' : 'Initiate Manual Backup'}
              </button>
           </div>
           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Snapshot Date</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data Size</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Trigger</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Download</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {backups.map(log => (
                       <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">{log.timestamp}</td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">{log.size}</td>
                          <td className="px-6 py-4">
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{log.type}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${log.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{log.status}</span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex justify-center">
                                <button className="text-sky-600 hover:text-sky-700"><Icons.Prescription className="w-5 h-5" /></button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {security.map(s => (
              <div key={s.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-200 transition-all flex justify-between items-start">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <Icons.LockClosed className="w-4 h-4 text-slate-400" />
                       <span className="bg-slate-50 text-slate-500 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{s.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{s.label}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{s.description}</p>
                 </div>
                 <div className="ml-8">
                    <button 
                       onClick={() => handleToggleSecurity(s.id)}
                       className={`w-14 h-8 rounded-full transition-all relative ${s.isEnabled ? 'bg-green-500 shadow-inner' : 'bg-slate-200'}`}
                    >
                       <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${s.isEnabled ? 'right-1' : 'left-1'}`}></div>
                    </button>
                 </div>
              </div>
           ))}
           <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden">
              <Icons.ShieldCheck className="w-16 h-16 text-sky-400 mb-4 animate-pulse" />
              <h3 className="text-xl font-black uppercase tracking-tighter">System Integrity Scan</h3>
              <p className="text-xs text-slate-400 mt-2">The system is currently monitored for suspicious SQL injection and XSS attempts.</p>
              <div className="mt-8 flex gap-2">
                 <span className="text-[10px] font-bold text-green-400">● GATEWAY SECURE</span>
                 <span className="text-[10px] font-bold text-green-400">● DB ENCRYPTED</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSecurity;
