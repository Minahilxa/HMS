
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { EmergencyCase, Doctor } from '../types';
import { Icons } from '../constants';

const EmergencyManagement: React.FC = () => {
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<EmergencyCase | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [c, d] = await Promise.all([
        apiService.getEmergencyCases(),
        apiService.getDoctors()
      ]);
      setCases(c);
      setDoctors(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<EmergencyCase> = {
      patientName: formData.get('patientName') as string,
      arrivalType: formData.get('arrivalType') as any,
      priority: formData.get('priority') as any,
      assignedDoctor: formData.get('assignedDoctor') as string,
      status: formData.get('status') as any || 'Active'
    };

    if (editingCase) {
      await apiService.updateEmergencyCase(editingCase.id, data);
    } else {
      await apiService.createEmergencyCase(data);
    }

    setShowModal(false);
    setEditingCase(null);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this emergency record?")) {
      await apiService.deleteEmergencyCase(id);
      loadData();
    }
  };

  const handleUpdateStatus = async (id: string, status: EmergencyCase['status']) => {
    await apiService.updateEmergencyCase(id, { status });
    loadData();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.Emergency className="w-8 h-8 mr-3 text-red-600" />
            Trauma & Emergency Care
          </h1>
          <p className="text-sm text-slate-500">Real-time monitoring and coordination of critical hospital admissions.</p>
        </div>
        <button 
          onClick={() => { setEditingCase(null); setShowModal(true); }}
          className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center"
        >
          <Icons.Bolt className="w-4 h-4 mr-2" />
          Add emergency case
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Arrival</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Priority</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Clinician</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {cases.map(ec => (
              <tr key={ec.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-800">
                  {ec.patientName}
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{ec.timestamp}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-500 font-medium">{ec.arrivalType}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    ec.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                    ec.priority === 'Severe' ? 'bg-orange-100 text-orange-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>{ec.priority}</span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-700">{ec.assignedDoctor || 'Triage Pending'}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase w-fit ${
                      ec.status === 'Resolved' ? 'bg-green-50 text-green-600' :
                      ec.status === 'Pending' ? 'bg-indigo-50 text-indigo-600' :
                      'bg-red-50 text-red-600'
                    }`}>{ec.status || 'Active'}</span>
                    <select 
                      value={ec.status || 'Active'} 
                      onChange={(e) => handleUpdateStatus(ec.id, e.target.value as any)}
                      className="text-[8px] font-bold border border-slate-100 rounded px-1 py-0.5 outline-none bg-slate-50 text-slate-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setEditingCase(ec); setShowModal(true); }} className="p-2 text-slate-400 hover:text-sky-600 transition-colors"><Icons.Cog6Tooth className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(ec.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Icons.Logout className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {cases.length === 0 && (
              <tr><td colSpan={6} className="py-20 text-center text-slate-400 italic font-medium">No active trauma cases currently registered.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-red-50 border-b border-red-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-800 uppercase tracking-tighter">
                {editingCase ? 'Modify Incident' : 'Initialize Emergency Entry'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-red-400 hover:text-red-600 font-bold text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Patient Identifier / Name</label>
                <input name="patientName" defaultValue={editingCase?.patientName} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g. John Doe / Unknown Male" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Arrival Mode</label>
                  <select name="arrivalType" defaultValue={editingCase?.arrivalType || 'Ambulance'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none">
                    <option value="Ambulance">Ambulance</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Med-Evac">Med-Evac</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Severity Level</label>
                  <select name="priority" defaultValue={editingCase?.priority || 'Stable'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none">
                    <option value="Critical">Critical (Immediate)</option>
                    <option value="Severe">Severe (Urgent)</option>
                    <option value="Stable">Stable (Non-Life Threatening)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Assigned Specialist</label>
                  <input name="assignedDoctor" defaultValue={editingCase?.assignedDoctor} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Enter Physician Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Flow Status</label>
                  <select name="status" defaultValue={editingCase?.status || 'Active'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none">
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all uppercase tracking-widest text-xs">
                {editingCase ? 'Update Admission Data' : 'Dispatch Admission Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyManagement;
