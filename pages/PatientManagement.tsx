
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Patient, PatientStatus, EHRRecord, Prescription } from '../types';
import { Icons } from '../constants';

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [viewTab, setViewTab] = useState<'ehr' | 'prescriptions' | 'discharge'>('ehr');

  // Form States
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '', age: 0, gender: 'Male', status: PatientStatus.OPD, diagnosis: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    const data = await apiService.getPatients();
    setPatients(data);
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiService.registerPatient(newPatient);
    setShowRegModal(false);
    loadPatients();
  };

  const handleStatusUpdate = async (id: string, newStatus: PatientStatus) => {
    await apiService.updatePatient(id, { status: newStatus });
    loadPatients();
    if (selectedPatient?.id === id) {
      setSelectedPatient(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAddEHR = async (patientId: string) => {
    const condition = prompt("Enter Condition:");
    const treatment = prompt("Enter Treatment:");
    if (condition && treatment) {
      await apiService.addEHRRecord(patientId, { condition, treatment, notes: 'Added via Patient Management Portal' });
      loadPatients();
      // Refresh selected patient ref
      const updated = await apiService.getPatients();
      setSelectedPatient(updated.find(p => p.id === patientId) || null);
    }
  };

  const handleAddPrescription = async (patientId: string) => {
    const medName = prompt("Medication Name:");
    const dosage = prompt("Dosage (e.g. 500mg):");
    if (medName && dosage) {
      await apiService.addPrescription(patientId, {
        doctorName: 'Dr. Admin',
        medications: [{ name: medName, dosage, frequency: 'Once daily', duration: '7 days' }]
      });
      loadPatients();
      const updated = await apiService.getPatients();
      setSelectedPatient(updated.find(p => p.id === patientId) || null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Patient Management</h1>
          <p className="text-sm text-slate-500">Registry, EHR Monitoring, and clinical documentation.</p>
        </div>
        <button 
          onClick={() => setShowRegModal(true)}
          className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all flex items-center"
        >
          <Icons.Users className="w-5 h-5 mr-2" />
          Register Patient
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <input 
              type="text" 
              placeholder="Search patients by name..." 
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {patients.map(patient => (
              <div 
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`p-4 cursor-pointer transition-all hover:bg-slate-50 ${selectedPatient?.id === patient.id ? 'bg-sky-50/50 border-r-4 border-sky-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{patient.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{patient.age}Y • {patient.gender}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    patient.status === 'OPD' ? 'bg-blue-100 text-blue-700' :
                    patient.status === 'IPD' ? 'bg-purple-100 text-purple-700' :
                    patient.status === 'Discharged' ? 'bg-slate-100 text-slate-600' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Details & EHR */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPatient ? (
            <>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 font-black text-2xl shadow-inner mr-4">
                      {selectedPatient.name[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h2>
                      <p className="text-slate-500 text-sm font-medium">ID: #{selectedPatient.id} • Admitted: {selectedPatient.admissionDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={selectedPatient.status}
                      onChange={(e) => handleStatusUpdate(selectedPatient.id, e.target.value as PatientStatus)}
                      className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-1 outline-none bg-slate-50"
                    >
                      {Object.values(PatientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex border-b border-slate-100 mb-6">
                  {(['ehr', 'prescriptions', 'discharge'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setViewTab(tab)}
                      className={`px-6 py-3 text-sm font-bold border-b-2 transition-all capitalize ${viewTab === tab ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      {tab === 'ehr' ? 'Electronic Health Record' : tab}
                    </button>
                  ))}
                </div>

                <div className="min-h-[300px] animate-in fade-in duration-300">
                  {viewTab === 'ehr' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-700">Clinical History</h4>
                        <button onClick={() => handleAddEHR(selectedPatient.id)} className="text-sky-600 text-xs font-bold flex items-center hover:underline">
                          <Icons.EHR className="w-4 h-4 mr-1" /> Add Entry
                        </button>
                      </div>
                      {selectedPatient.medicalHistory.length > 0 ? (
                        <div className="space-y-3">
                          {selectedPatient.medicalHistory.map(record => (
                            <div key={record.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                              <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-slate-400">{record.date}</span>
                                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">{record.condition}</span>
                              </div>
                              <p className="text-sm font-bold text-slate-800">Treatment: {record.treatment}</p>
                              <p className="text-xs text-slate-500 mt-1">{record.notes}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <p className="text-slate-400 text-sm italic">No medical history records found.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {viewTab === 'prescriptions' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-700">Medication Logs</h4>
                        <button onClick={() => handleAddPrescription(selectedPatient.id)} className="text-sky-600 text-xs font-bold flex items-center hover:underline">
                          <Icons.Prescription className="w-4 h-4 mr-1" /> New Prescription
                        </button>
                      </div>
                      {selectedPatient.prescriptions.length > 0 ? (
                        <div className="space-y-3">
                          {selectedPatient.prescriptions.map(pres => (
                            <div key={pres.id} className="p-4 rounded-2xl border border-amber-100 bg-amber-50/20">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="text-xs font-bold text-slate-400">Date: {pres.date}</p>
                                  <p className="text-xs font-semibold text-slate-600">Ordered by: {pres.doctorName}</p>
                                </div>
                                <Icons.Prescription className="w-5 h-5 text-amber-400" />
                              </div>
                              <div className="space-y-2">
                                {pres.medications.map((med, i) => (
                                  <div key={i} className="flex justify-between text-xs border-b border-slate-100/50 pb-1">
                                    <span className="font-bold text-slate-700">{med.name} - {med.dosage}</span>
                                    <span className="text-slate-500">{med.frequency} • {med.duration}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <p className="text-slate-400 text-sm italic">No prescription history found.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {viewTab === 'discharge' && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                       <h4 className="font-bold text-slate-800 mb-4">Discharge Summary Status</h4>
                       {selectedPatient.status === PatientStatus.DISCHARGED ? (
                         <div className="space-y-4">
                            <div className="p-4 bg-white rounded-xl border border-slate-100">
                               <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Final Diagnosis</p>
                               <p className="text-sm font-bold text-slate-800">Acute Respiratory Infection (Resolved)</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-slate-100">
                               <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Follow-up Instructions</p>
                               <p className="text-sm text-slate-600 leading-relaxed">Continue rest for 5 days. Return if fever persists beyond 72 hours. Scheduled follow-up on June 1st.</p>
                            </div>
                         </div>
                       ) : (
                         <div className="text-center">
                            <Icons.Logout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">Patient is currently active ({selectedPatient.status}).</p>
                            <button 
                              onClick={() => handleStatusUpdate(selectedPatient.id, PatientStatus.DISCHARGED)}
                              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all"
                            >
                              Initiate Discharge Process
                            </button>
                         </div>
                       )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white h-[600px] flex flex-col items-center justify-center rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Icons.Users className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-800">No Patient Selected</h3>
               <p className="text-slate-400 text-sm mt-2 max-w-xs">Select a patient from the registry to view their EHR, prescriptions, and status.</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">New Patient Registration</h3>
              <button onClick={() => setShowRegModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleRegister} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input required type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Age</label>
                  <input required type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                  <select value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Diagnosis / Complaint</label>
                  <textarea value={newPatient.diagnosis} onChange={e => setNewPatient({...newPatient, diagnosis: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all h-24" />
                </div>
              </div>
              <button type="submit" className="w-full bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all">Complete Registration</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
