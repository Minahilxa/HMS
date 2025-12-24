
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { RadiologyOrder, Patient } from '../types';
import { Icons } from '../constants';

const RadiologyManagement: React.FC = () => {
  const [orders, setOrders] = useState<RadiologyOrder[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'completed' | 'history'>('pending');
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [o, p] = await Promise.all([
      apiService.getRadiologyOrders(),
      apiService.getPatients()
    ]);
    setOrders(o);
    setPatients(p);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: RadiologyOrder['status']) => {
    let notes;
    if (status === 'Reported') {
      notes = prompt("Enter Radiologist Findings/Notes:");
      if (!notes) return;
    }
    await apiService.updateRadiologyStatus(id, status, notes);
    loadData();
  };

  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const patientId = formData.get('patientId') as string;
    const patient = patients.find(p => p.id === patientId);

    await apiService.createRadiologyOrder({
      patientId,
      patientName: patient?.name || 'Unknown',
      type: formData.get('type') as any,
      bodyPart: formData.get('bodyPart') as string,
      priority: formData.get('priority') as any
    });

    setShowOrderModal(false);
    loadData();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  const pendingOrders = orders.filter(o => o.status !== 'Reported');
  const reportedOrders = orders.filter(o => o.status === 'Reported');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.Radiology className="w-8 h-8 mr-3 text-sky-600" />
            Radiology & Imaging
          </h1>
          <p className="text-sm text-slate-500">Diagnostic imaging orders, radiologist notes, and report archival.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button onClick={() => setActiveSubTab('pending')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'pending' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Current Studies</button>
          <button onClick={() => setActiveSubTab('completed')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'completed' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Archived Reports</button>
        </div>
      </div>

      {activeSubTab === 'pending' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setShowOrderModal(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-black transition-all flex items-center">
              <Icons.Radiology className="w-4 h-4 mr-2" />
              New Imaging Order
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:border-sky-300 transition-all group">
                <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                   <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center mr-2">
                         <span className="text-[10px] font-black">{order.type.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">{order.type}</span>
                   </div>
                   <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${
                     order.priority === 'STAT' ? 'bg-red-500 text-white' : 
                     order.priority === 'Urgent' ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-300'
                   }`}>{order.priority}</span>
                </div>
                <div className="p-6">
                   <h3 className="font-bold text-slate-800 text-lg">{order.patientName}</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase mt-1">Study: {order.bodyPart}</p>
                   
                   <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                         <p className="text-xs font-black text-sky-600 uppercase">{order.status}</p>
                      </div>
                      <div className="flex gap-1">
                         {order.status === 'Requested' && <button onClick={() => handleUpdateStatus(order.id, 'Scheduled')} className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg text-[10px] font-bold">Schedule</button>}
                         {order.status === 'Scheduled' && <button onClick={() => handleUpdateStatus(order.id, 'Completed')} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">Capture Study</button>}
                         {order.status === 'Completed' && <button onClick={() => handleUpdateStatus(order.id, 'Reported')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold">Write Report</button>}
                      </div>
                   </div>
                </div>
              </div>
            ))}
            {pendingOrders.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                 <Icons.Radiology className="w-12 h-12 mb-2 opacity-20" />
                 <p className="text-sm italic">No active imaging studies in queue.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'completed' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Study ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient Profile</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Modality</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Radiologist Notes</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Report</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {reportedOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4 text-xs font-black text-slate-400">#{order.id}</td>
                       <td className="px-6 py-4 font-bold text-slate-800">{order.patientName}</td>
                       <td className="px-6 py-4">
                          <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 uppercase">{order.type}</span>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">{order.bodyPart}</p>
                       </td>
                       <td className="px-6 py-4 max-w-xs">
                          <p className="text-xs text-slate-600 line-clamp-2 italic">"{order.radiologistNotes}"</p>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex justify-center">
                             <button className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold hover:bg-red-100 transition-all">
                                <Icons.Prescription className="w-4 h-4 mr-2" />
                                DOWNLOAD
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Imaging Requisition</h3>
                <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleCreateOrder} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Select</label>
                  <select name="patientId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                     {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Modality</label>
                    <select name="type" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>X-Ray</option>
                       <option>CT Scan</option>
                       <option>MRI</option>
                       <option>Ultrasound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                    <select name="priority" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>Routine</option>
                       <option>Urgent</option>
                       <option>STAT</option>
                    </select>
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Study Description (Body Part/View)</label>
                   <input name="bodyPart" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. Spine Lumbar AP/LAT" />
                </div>
                <button type="submit" className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-sky-700 transition-all">Submit Study Request</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadiologyManagement;
