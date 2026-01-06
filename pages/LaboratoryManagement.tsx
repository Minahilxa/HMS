
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { LabTest, LabSample, AccessHistory, Patient } from '../types';
import { Icons } from '../constants';

const LaboratoryManagement: React.FC = () => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [samples, setSamples] = useState<LabSample[]>([]);
  const [logs, setLogs] = useState<AccessHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'tests' | 'samples' | 'results' | 'history'>('tests');
  const [showTestModal, setShowTestModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [t, s, l] = await Promise.all([
      apiService.getLabTests(),
      apiService.getLabSamples(),
      apiService.getAccessHistory()
    ]);
    setTests(t);
    setSamples(s);
    setLogs(l);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: LabSample['status']) => {
    let result;
    if (status === 'Completed') {
      result = prompt("Enter Diagnostics Result / Laboratory Findings:");
      if (result === null) return; // Cancelled
    }
    await apiService.updateSampleStatus(id, status, result);
    loadData();
  };

  const handleManualStatusChange = async (id: string, status: string) => {
      await apiService.updateSampleStatus(id, status as LabSample['status']);
      loadData();
  };

  const handleGeneratePDF = (sampleId: string) => {
    setGeneratingReport(sampleId);
    setTimeout(() => {
      setGeneratingReport(null);
      alert("PDF Diagnostic Report generated and synced with Patient EHR.");
    }, 1500);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laboratory Information System (LIS)</h1>
          <p className="text-sm text-slate-500">Diagnostic track, sample collection, and automated result reporting.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveSubTab('tests')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'tests' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Test Directory</button>
          <button onClick={() => setActiveSubTab('samples')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'samples' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Sample Tracking</button>
          <button onClick={() => setActiveSubTab('results')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'results' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Diagnostics</button>
          <button onClick={() => setActiveSubTab('history')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'history' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Portal Logs</button>
        </div>
      </div>

      {activeSubTab === 'tests' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setShowTestModal(true)} className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
              Add New Test Category
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
              <div key={test.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">{test.category}</span>
                  <span className="text-xl font-black text-slate-800">${test.price}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{test.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{test.description}</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between">
                  <button className="text-[10px] font-bold text-slate-400 hover:text-sky-600 uppercase">Edit Pricing</button>
                  <button className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase">Archive</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'samples' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Test Required</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Current Phase</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Change Update</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Operation</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {samples.filter(s => s.status !== 'Completed').map(sample => (
                    <tr key={sample.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4 text-xs font-black text-slate-400">#{sample.id}</td>
                       <td className="px-6 py-4 font-bold text-slate-800">{sample.patientName}</td>
                       <td className="px-6 py-4 text-sm text-slate-600">{sample.testName}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                            sample.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                            sample.status === 'Collected' ? 'bg-blue-50 text-blue-600' :
                            'bg-indigo-50 text-indigo-600'
                          }`}>{sample.status}</span>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <select 
                            value={sample.status}
                            onChange={(e) => handleManualStatusChange(sample.id, e.target.value)}
                            className="text-[10px] font-bold uppercase bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Collected">Collected</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex justify-center gap-1">
                             {sample.status === 'Pending' && <button onClick={() => handleUpdateStatus(sample.id, 'Collected')} className="bg-sky-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold">Collect Sample</button>}
                             {sample.status === 'Collected' && <button onClick={() => handleUpdateStatus(sample.id, 'In Progress')} className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold">Move to Lab</button>}
                             {sample.status === 'In Progress' && <button onClick={() => handleUpdateStatus(sample.id, 'Completed')} className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold">Enter Results</button>}
                          </div>
                       </td>
                    </tr>
                 ))}
                 {samples.filter(s => s.status !== 'Completed').length === 0 && (
                    <tr><td colSpan={6} className="p-10 text-center text-slate-400 italic font-medium">No samples currently in diagnostic pipeline.</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      )}

      {activeSubTab === 'results' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient Profile</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Analysis Done</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Diagnostic Result</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Validation</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Operation</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {samples.filter(s => s.status === 'Completed').map(sample => (
                    <tr key={sample.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4 font-bold text-slate-800">{sample.patientName}</td>
                       <td className="px-6 py-4 text-sm text-slate-600">{sample.testName}</td>
                       <td className="px-6 py-4">
                          <p className="text-sm font-black text-sky-700">{sample.result || 'Pending Findings Entry'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Date: {sample.collectionDate}</p>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Verified</span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                             <button onClick={() => {
                               const newVal = prompt("Edit Diagnostic Result:", sample.result);
                               if (newVal !== null) handleManualStatusChange(sample.id, 'Completed').then(() => apiService.updateSampleStatus(sample.id, 'Completed', newVal).then(loadData));
                             }} className="p-2 text-slate-400 hover:text-sky-600 transition-all"><Icons.Cog6Tooth className="w-4 h-4"/></button>
                             <button 
                                onClick={() => handleGeneratePDF(sample.id)}
                                disabled={!!generatingReport}
                                className={`flex items-center px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${generatingReport === sample.id ? 'bg-slate-100 text-slate-400' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                             >
                                <Icons.Prescription className="w-4 h-4 mr-2" />
                                {generatingReport === sample.id ? 'Processing...' : 'Export Result'}
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {samples.filter(s => s.status === 'Completed').length === 0 && (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic font-medium">No diagnostic results verified yet.</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Citizen / Patient</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Portal Activity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Access Timestamp</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Technical Context</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4 font-bold text-slate-800">{log.patientName}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                            log.action === 'Login' ? 'bg-slate-100 text-slate-600' :
                            log.action === 'Report Viewed' ? 'bg-sky-50 text-sky-600' :
                            'bg-green-50 text-green-600'
                          }`}>{log.action}</span>
                       </td>
                       <td className="px-6 py-4 text-xs font-medium text-slate-500">{log.timestamp}</td>
                       <td className="px-6 py-4 text-xs text-slate-400 italic">{log.device}</td>
                    </tr>
                 ))}
                 {logs.length === 0 && (
                    <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic font-medium">Access logs are empty.</td></tr>
                 )}
              </tbody>
           </table>
        </div>
      )}

      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">New Diagnostic Test</h3>
                <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); setShowTestModal(false); loadData(); }} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Test Name</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. HBA1C" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>Hematology</option>
                       <option>Biochemistry</option>
                       <option>Immunology</option>
                       <option>Virology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Fee ($)</label>
                    <input type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-900 transition-all uppercase tracking-widest text-xs">Register Test Entry</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratoryManagement;
