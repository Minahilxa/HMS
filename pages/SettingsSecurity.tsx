
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  HospitalSettings, EmergencyNumber, PaymentGateway, 
  BackupLog, SecuritySetting, EmergencyCase, Doctor 
} from '../types';
import { Icons } from '../constants';

const SettingsSecurity: React.FC = () => {
  const [hospital, setHospital] = useState<HospitalSettings | null>(null);
  const [emergencies, setEmergencies] = useState<EmergencyNumber[]>([]);
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [backups, setBackups] = useState<BackupLog[]>([]);
  const [security, setSecurity] = useState<SecuritySetting[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'emergency_nums' | 'emergency_cases' | 'payments' | 'backups' | 'security'>('general');
  const [backingUp, setBackingUp] = useState(false);

  // Modals
  const [showModal, setShowModal] = useState<'none' | 'num' | 'case' | 'pay' | 'sec'>('none');
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [h, e, c, g, b, s, d] = await Promise.all([
        apiService.getHospitalSettings(),
        apiService.getEmergencyNumbers(),
        apiService.getEmergencyCases(),
        apiService.getPaymentGateways(),
        apiService.getBackupLogs(),
        apiService.getSecuritySettings(),
        apiService.getDoctors()
      ]);
      setHospital(h);
      setEmergencies(e);
      setCases(c);
      setGateways(g);
      setBackups(b);
      setSecurity(s);
      setDoctors(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHospital = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = Object.fromEntries(formData.entries());
    await apiService.updateHospitalSettings(updates as any);
    alert("Hospital settings updated successfully.");
    loadData();
  };

  const handleEntitySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData.entries());

    // Handling multiselect for payments
    if (showModal === 'pay') {
      data.methods = (formData.get('methods') as string).split(',').map(s => s.trim());
    }

    try {
      if (showModal === 'num') {
        editingItem ? await apiService.updateEmergencyNumber(editingItem.id, data) : await apiService.createEmergencyNumber(data);
      } else if (showModal === 'case') {
        editingItem ? await apiService.updateEmergencyCase(editingItem.id, data) : await apiService.createEmergencyCase(data);
      } else if (showModal === 'pay') {
        editingItem ? await apiService.updatePaymentGateway(editingItem.id, data) : await apiService.createPaymentGateway(data);
      } else if (showModal === 'sec') {
        data.isEnabled = data.isEnabled === 'on';
        editingItem ? await apiService.updateSecuritySetting(editingItem.id, data) : await apiService.createSecuritySetting(data);
      }
      setShowModal('none');
      setEditingItem(null);
      loadData();
    } catch (err) {
      alert("Action failed. Check logs.");
    }
  };

  const handleDelete = async (id: string, type: 'num' | 'case' | 'pay' | 'sec' | 'bk') => {
    if (!confirm("Permanently delete this entry?")) return;
    if (type === 'num') await apiService.deleteEmergencyNumber(id);
    if (type === 'case') await apiService.deleteEmergencyCase(id);
    if (type === 'pay') await apiService.deletePaymentGateway(id);
    if (type === 'sec') await apiService.deleteSecuritySetting(id);
    if (type === 'bk') await apiService.deleteBackup(id);
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
          <p className="text-sm text-slate-500">Configure core system parameters, clinical emergencies, and data safety protocols.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab('general')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'general' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>General</button>
          <button onClick={() => setActiveTab('emergency_nums')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'emergency_nums' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>ER Numbers</button>
          <button onClick={() => setActiveTab('emergency_cases')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'emergency_cases' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Active ER Cases</button>
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

      {activeTab === 'emergency_nums' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Internal ER Numbers</h2>
              <button onClick={() => { setEditingItem(null); setShowModal('num'); }} className="bg-sky-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-sky-700 shadow-lg">Register Number</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencies.map(en => (
                 <div key={en.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                       <button onClick={() => { setEditingItem(en); setShowModal('num'); }} className="text-slate-400 hover:text-sky-600"><Icons.Cog6Tooth className="w-4 h-4"/></button>
                       <button onClick={() => handleDelete(en.id, 'num')} className="text-slate-400 hover:text-red-600"><Icons.Logout className="w-4 h-4"/></button>
                    </div>
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter mb-1">{en.department}</p>
                    <h3 className="font-bold text-slate-800 text-lg">{en.label}</h3>
                    <p className="text-2xl font-black text-slate-900 mt-4 tracking-tight">{en.number}</p>
                 </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'emergency_cases' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Clinical Emergency Registry</h2>
              <button onClick={() => { setEditingItem(null); setShowModal('case'); }} className="bg-red-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-700 shadow-lg">New ER Admission</button>
           </div>
           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Arrived Via</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Assigned Dr.</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {cases.map(ec => (
                      <tr key={ec.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-6 py-4 font-bold text-slate-800">{ec.patientName}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                               ec.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                            }`}>{ec.priority}</span>
                         </td>
                         <td className="px-6 py-4 text-xs text-slate-500 font-medium">{ec.arrivalType}</td>
                         <td className="px-6 py-4 text-center text-xs font-bold text-slate-700">{ec.assignedDoctor}</td>
                         <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                               <button onClick={() => { setEditingItem(ec); setShowModal('case'); }} className="text-slate-400 hover:text-sky-600"><Icons.Cog6Tooth className="w-4 h-4"/></button>
                               <button onClick={() => handleDelete(ec.id, 'case')} className="text-slate-400 hover:text-red-600"><Icons.Logout className="w-4 h-4"/></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Financial Gateways</h2>
              <button onClick={() => { setEditingItem(null); setShowModal('pay'); }} className="bg-sky-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-sky-700 shadow-lg">Integrate Gateway</button>
           </div>
           {gateways.map(gw => (
              <div key={gw.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-sky-200 transition-all">
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
                       gw.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                    }`}>{gw.status}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => { setEditingItem(gw); setShowModal('pay'); }} className="text-sky-600 font-bold text-[10px] uppercase hover:underline">Edit</button>
                       <button onClick={() => handleDelete(gw.id, 'pay')} className="text-red-500 font-bold text-[10px] uppercase hover:underline">Revoke</button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {activeTab === 'backups' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Database & System Snapshots</h2>
              <button onClick={handleRunBackup} disabled={backingUp} className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-sky-700 transition-all flex items-center">
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
                       <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Manage</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {backups.map(log => (
                       <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">{log.timestamp}</td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">{log.size}</td>
                          <td className="px-6 py-4"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{log.type}</span></td>
                          <td className="px-6 py-4 text-center"><span className="px-2 py-1 rounded-full text-[10px] font-black uppercase bg-green-50 text-green-600">Success</span></td>
                          <td className="px-6 py-4">
                             <div className="flex justify-center gap-2">
                                <button className="text-sky-600"><Icons.Prescription className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(log.id, 'bk')} className="text-red-400 hover:text-red-600"><Icons.Logout className="w-5 h-5"/></button>
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
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Security Protocols</h2>
              <button onClick={() => { setEditingItem(null); setShowModal('sec'); }} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-black shadow-lg">New Policy</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {security.map(s => (
                 <div key={s.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-200 transition-all flex justify-between items-start group">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-2">
                          <Icons.LockClosed className="w-4 h-4 text-slate-400" />
                          <span className="bg-slate-50 text-slate-500 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{s.category}</span>
                       </div>
                       <h3 className="text-lg font-bold text-slate-800">{s.label}</h3>
                       <p className="text-sm text-slate-500 mt-1 leading-relaxed">{s.description}</p>
                       <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => { setEditingItem(s); setShowModal('sec'); }} className="text-[10px] font-black text-sky-600 uppercase">Edit Logic</button>
                          <button onClick={() => handleDelete(s.id, 'sec')} className="text-[10px] font-black text-red-600 uppercase">Revoke Protocol</button>
                       </div>
                    </div>
                    <div className="ml-8">
                       <button onClick={() => handleToggleSecurity(s.id)} className={`w-14 h-8 rounded-full transition-all relative ${s.isEnabled ? 'bg-green-500' : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${s.isEnabled ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* CRUD Modal */}
      {showModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">
                   {editingItem ? 'Modify' : 'Initialize'} {showModal.toUpperCase()} Configuration
                </h3>
                <button onClick={() => { setShowModal('none'); setEditingItem(null); }} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleEntitySubmit} className="p-8 space-y-4">
                {showModal === 'num' && (
                  <>
                    <input name="label" defaultValue={editingItem?.label} required placeholder="Label (e.g. Trauma Hub)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                    <input name="number" defaultValue={editingItem?.number} required placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                    <select name="department" defaultValue={editingItem?.department} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>General</option><option>Cardiology</option><option>Neurology</option><option>Pediatrics</option>
                    </select>
                  </>
                )}
                {showModal === 'case' && (
                  <>
                    <input name="patientName" defaultValue={editingItem?.patientName} required placeholder="Patient Identifier / Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <select name="arrivalType" defaultValue={editingItem?.arrivalType || 'Ambulance'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                         <option>Ambulance</option><option>Walk-in</option><option>Med-Evac</option>
                      </select>
                      <select name="priority" defaultValue={editingItem?.priority || 'Stable'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                         <option>Critical</option><option>Severe</option><option>Stable</option>
                      </select>
                    </div>
                    <select name="assignedDoctor" defaultValue={editingItem?.assignedDoctor} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option value="">Select On-Call Dr.</option>
                       {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </>
                )}
                {showModal === 'pay' && (
                  <>
                    <input name="provider" defaultValue={editingItem?.provider} required placeholder="Gateway Provider" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                    <input name="merchantId" defaultValue={editingItem?.merchantId} required placeholder="Merchant API ID" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                    <input name="methods" defaultValue={editingItem?.methods?.join(', ')} placeholder="Methods (comma separated)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                    <select name="status" defaultValue={editingItem?.status || 'Active'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>Active</option><option>Testing</option><option>Inactive</option>
                    </select>
                  </>
                )}
                {showModal === 'sec' && (
                  <>
                    <input name="label" defaultValue={editingItem?.label} required placeholder="Protocol Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                    <textarea name="description" defaultValue={editingItem?.description} placeholder="Technical description" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none h-24 resize-none" />
                    <select name="category" defaultValue={editingItem?.category || 'Access'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>Access</option><option>Data</option><option>Network</option>
                    </select>
                    <div className="flex items-center gap-3">
                       <input type="checkbox" name="isEnabled" defaultChecked={editingItem?.isEnabled} />
                       <label className="text-xs font-bold text-slate-600">Activate Immediately</label>
                    </div>
                  </>
                )}
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all uppercase tracking-widest text-xs">
                  {editingItem ? 'Update Configuration' : 'Confirm & Save'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSecurity;
