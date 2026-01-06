
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { InsurancePanel, InsuranceClaim, PatientCoverage, Patient } from '../types';
import { Icons } from '../constants';

const InsuranceManagement: React.FC = () => {
  const [panels, setPanels] = useState<InsurancePanel[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'panels' | 'claims' | 'verification'>('panels');
  
  // Modals
  const [showPanelModal, setShowPanelModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  // Selection/Editing states
  const [editingPanel, setEditingPanel] = useState<InsurancePanel | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<PatientCoverage[] | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [p, c, pts] = await Promise.all([
      apiService.getInsurancePanels(),
      apiService.getInsuranceClaims(),
      apiService.getPatients()
    ]);
    setPanels(p);
    setClaims(c);
    setPatients(pts);
    setLoading(false);
  };

  // --- PANEL HANDLERS ---
  const handlePanelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const panelData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      contactPerson: formData.get('contactPerson') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      settlementPeriod: parseInt(formData.get('settlementPeriod') as string) || 30,
      status: formData.get('status') as 'Active' | 'Inactive'
    };

    if (editingPanel) {
      await apiService.updateInsurancePanel(editingPanel.id, panelData);
    } else {
      await apiService.createInsurancePanel(panelData);
    }

    setShowPanelModal(false);
    setEditingPanel(null);
    loadData();
  };

  const handleDeletePanel = async (id: string) => {
    if (confirm("Are you sure you want to delete this insurance panel? This action cannot be undone.")) {
      await apiService.deleteInsurancePanel(id);
      loadData();
    }
  };

  // --- CLAIM HANDLERS ---
  const handleClaimUpdate = async (id: string, status: InsuranceClaim['status']) => {
    let approvedAmount;
    if (status === 'Approved' || status === 'Settled') {
      const currentClaim = claims.find(c => c.id === id);
      const amt = prompt("Enter Approved/Settled Amount:", currentClaim?.claimAmount.toString());
      if (amt === null) return;
      approvedAmount = parseFloat(amt);
    }
    
    await apiService.updateClaimStatus(id, { 
      status, 
      approvedAmount, 
      settlementDate: status === 'Settled' ? new Date().toISOString().split('T')[0] : undefined 
    });
    loadData();
  };

  // --- COVERAGE HANDLERS ---
  const handleVerifyPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const patientId = formData.get('patientId') as string;
    const coverage = await apiService.getPatientCoverage(patientId);
    setSelectedVerification(coverage);
  };

  const handleRegisterCoverage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const patientId = formData.get('patientId') as string;
    const panelId = formData.get('panelId') as string;

    await apiService.createPatientCoverage({
      patientId,
      panelId,
      policyNumber: formData.get('policyNumber') as string,
      totalLimit: parseFloat(formData.get('totalLimit') as string),
      consumedLimit: 0,
      expiryDate: formData.get('expiryDate') as string,
    });

    setShowVerifyModal(false);
    // Auto refresh verification view if viewing that patient
    const updatedCoverage = await apiService.getPatientCoverage(patientId);
    setSelectedVerification(updatedCoverage);
    loadData();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.ShieldCheck className="w-8 h-8 mr-3 text-indigo-600" />
            Insurance & Panels
          </h1>
          <p className="text-sm text-slate-500">Corporate panels management, patient eligibility verification, and claim lifecycle tracking.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button onClick={() => setActiveTab('panels')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'panels' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Panel Directory</button>
          <button onClick={() => setActiveTab('claims')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'claims' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Claim Tracking</button>
          <button onClick={() => setActiveTab('verification')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'verification' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Patient Coverage</button>
        </div>
      </div>

      {activeTab === 'panels' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold text-slate-700">Insurance Providers</h2>
             <button onClick={() => { setEditingPanel(null); setShowPanelModal(true); }} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center">
               Register New Panel
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {panels.map(panel => (
                <div key={panel.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group relative">
                   <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-2 py-1 rounded-lg">{panel.code}</div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${panel.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <button onClick={() => { setEditingPanel(panel); setShowPanelModal(true); }} className="p-1 text-slate-300 hover:text-indigo-600 transition-colors">
                           <Icons.Cog6Tooth className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeletePanel(panel.id)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                           <Icons.Logout className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-1">{panel.name}</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">Settlement: {panel.settlementPeriod} Days</p>
                   <div className="space-y-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center text-[10px] text-slate-500">
                         <Icons.Users className="w-3 h-3 mr-2" />
                         Contact: {panel.contactPerson}
                      </div>
                      <div className="flex items-center text-[10px] text-slate-500">
                         <Icons.Mail className="w-3 h-3 mr-2" />
                         {panel.email}
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'claims' && (activeTab === 'claims') && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Claim ID / Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient & Panel</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Operation</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {claims.map(claim => (
                    <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <p className="font-black text-slate-800 text-sm">#{claim.id}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{claim.submissionDate}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{claim.patientName}</p>
                          <p className="text-[10px] text-indigo-600 font-bold uppercase">{claim.panelName}</p>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <p className="font-black text-slate-800">${claim.claimAmount.toLocaleString()}</p>
                          {claim.approvedAmount && <p className="text-[10px] text-green-600 font-bold">Appr: ${claim.approvedAmount}</p>}
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                             <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase w-fit ${
                               claim.status === 'Settled' ? 'bg-green-100 text-green-700' :
                               claim.status === 'Approved' ? 'bg-sky-100 text-sky-700' :
                               claim.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                               'bg-amber-100 text-amber-700'
                             }`}>
                                {claim.status}
                             </span>
                             <select 
                                value={claim.status}
                                onChange={(e) => handleClaimUpdate(claim.id, e.target.value as any)}
                                className="text-[8px] font-bold uppercase bg-slate-50 border border-slate-200 rounded px-1 py-0.5 outline-none"
                             >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Settled">Settled</option>
                             </select>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex justify-center gap-1">
                             {claim.status === 'Pending' && (
                                <>
                                   <button onClick={() => handleClaimUpdate(claim.id, 'Approved')} className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-sky-100 transition-colors">Quick Approve</button>
                                   <button onClick={() => handleClaimUpdate(claim.id, 'Rejected')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors">Reject</button>
                                </>
                             )}
                             {claim.status === 'Approved' && (
                                <button onClick={() => handleClaimUpdate(claim.id, 'Settled')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-green-700 transition-colors">Mark Settled</button>
                             )}
                             <button className="p-2 text-slate-400 hover:text-indigo-600"><Icons.Receipt className="w-4 h-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {claims.length === 0 && (
                   <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">No insurance claims registered.</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Patient Eligibility Search</h2>
              <form onSubmit={handleVerifyPatient} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Select</label>
                    <select name="patientId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                       <option value="">Select Patient...</option>
                       {patients.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>)}
                    </select>
                 </div>
                 <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">Verify Coverage Status</button>
              </form>
              <div className="mt-8 pt-8 border-t border-slate-50">
                 <button onClick={() => setShowVerifyModal(true)} className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-xs hover:bg-slate-200 transition-all uppercase tracking-widest">
                    Register New Policy Coverage
                 </button>
              </div>
           </div>

           <div className="lg:col-span-8">
              {selectedVerification ? (
                 <div className="space-y-6 animate-in fade-in duration-200">
                    {selectedVerification.length > 0 ? selectedVerification.map(cov => (
                       <div key={cov.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4">
                             <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1 rounded-full border border-green-100 uppercase">{cov.status}</span>
                          </div>
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                             <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Policy Number</p>
                                <h3 className="text-2xl font-black text-slate-800">{cov.policyNumber}</h3>
                                <p className="text-indigo-600 font-bold mt-1">{panels.find(p => p.id === cov.panelId)?.name}</p>
                             </div>
                             <div className="text-right md:border-l md:pl-8 border-slate-50">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Expires On</p>
                                <p className="text-lg font-bold text-red-500">{cov.expiryDate}</p>
                             </div>
                          </div>
                          
                          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Limit</p>
                                <p className="text-lg font-black text-slate-800">${cov.totalLimit.toLocaleString()}</p>
                             </div>
                             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Consumed</p>
                                <p className="text-lg font-black text-amber-600">${cov.consumedLimit.toLocaleString()}</p>
                             </div>
                             <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 col-span-2">
                                <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Remaining Coverage</p>
                                <p className="text-lg font-black text-indigo-600">${(cov.totalLimit - cov.consumedLimit).toLocaleString()}</p>
                             </div>
                          </div>
                       </div>
                    )) : (
                       <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                          <Icons.ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
                          <p className="text-slate-500 font-bold">No active insurance policy found for this patient.</p>
                       </div>
                    )}
                 </div>
              ) : (
                 <div className="bg-slate-50/50 h-[400px] rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                    <Icons.ShieldCheck className="w-12 h-12 mb-4 opacity-20" />
                    <p className="italic text-sm">Use the search panel to verify patient eligibility.</p>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* Panel Registration/Edit Modal */}
      {showPanelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-indigo-800">{editingPanel ? 'Edit Panel Details' : 'Register Corporate Panel'}</h3>
                <button onClick={() => { setShowPanelModal(false); setEditingPanel(null); }} className="text-indigo-400 hover:text-indigo-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handlePanelSubmit} className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Panel Name</label>
                    <input name="name" defaultValue={editingPanel?.name} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Code</label>
                    <input name="code" defaultValue={editingPanel?.code} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. BUPA" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Person</label>
                  <input name="contactPerson" defaultValue={editingPanel?.contactPerson} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                    <input name="phone" defaultValue={editingPanel?.phone} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                    <input name="email" type="email" defaultValue={editingPanel?.email} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Settlement Days</label>
                    <input name="settlementPeriod" type="number" defaultValue={editingPanel?.settlementPeriod || 30} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                    <select name="status" defaultValue={editingPanel?.status || 'Active'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                       <option value="Active">Active</option>
                       <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
                  {editingPanel ? 'Update Panel Registry' : 'Confirm Registration'}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Coverage Policy Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Assign Insurance Policy</h3>
                <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleRegisterCoverage} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient</label>
                    <select name="patientId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                       <option value="">Select Patient...</option>
                       {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Panel Provider</label>
                    <select name="panelId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                       {panels.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Policy / Corporate ID</label>
                  <input name="policyNumber" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. POL-123456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Coverage ($)</label>
                    <input name="totalLimit" type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
                    <input name="expiryDate" type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">Verify & Save Policy</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceManagement;
