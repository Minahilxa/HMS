
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { HospitalDepartment, HospitalService, Doctor } from '../types';
import { Icons } from '../constants';

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<HospitalDepartment[]>([]);
  const [services, setServices] = useState<HospitalService[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'depts' | 'services'>('depts');
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<HospitalDepartment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [d, s, docs] = await Promise.all([
      apiService.getDepartments(),
      apiService.getServices(),
      apiService.getDoctors()
    ]);
    setDepartments(d);
    setServices(s);
    setDoctors(docs);
    setLoading(false);
  };

  const handleDeptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const headDoctorId = formData.get('headDoctorId') as string;

    if (editingDept) {
      await apiService.updateDepartment(editingDept.id, { name, description, headDoctorId });
    } else {
      await apiService.createDepartment({ name, description, headDoctorId });
    }
    
    setShowDeptModal(false);
    setEditingDept(null);
    loadData();
  };

  const toggleServiceStatus = async (serviceId: string, current: boolean) => {
    await apiService.updateService(serviceId, { isAvailable: !current });
    loadData();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hospital Administration</h1>
          <p className="text-sm text-slate-500">Manage institutional infrastructure, specialized departments, and service offerings.</p>
        </div>
        <div className="flex gap-3">
           <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button onClick={() => setActiveTab('depts')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'depts' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Departments</button>
              <button onClick={() => setActiveTab('services')} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'services' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Services & Facilities</button>
           </div>
        </div>
      </div>

      {activeTab === 'depts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map(dept => {
            const headDoc = doctors.find(d => d.id === dept.headDoctorId);
            return (
              <div key={dept.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative group hover:border-sky-200 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                      <Icons.Hospital className="w-8 h-8" />
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => { setEditingDept(dept); setShowDeptModal(true); }} className="p-2 text-slate-400 hover:text-sky-600"><Icons.Dashboard className="w-5 h-5" /></button>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${dept.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{dept.status}</span>
                   </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{dept.name}</h3>
                <p className="text-sm text-slate-500 mt-2 mb-6 line-clamp-2">{dept.description}</p>
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                   <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 mr-2 border-2 border-white shadow-sm">
                         {headDoc?.name[4]}
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Head Physician</p>
                         <p className="text-xs font-bold text-slate-700">{headDoc?.name || 'Unassigned'}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Staff</p>
                      <p className="text-xs font-bold text-slate-700">{dept.staffCount} Members</p>
                   </div>
                </div>
              </div>
            );
          })}
          <div 
            onClick={() => { setEditingDept(null); setShowDeptModal(true); }}
            className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-sky-300 hover:text-sky-400 transition-all cursor-pointer bg-slate-50/50"
          >
            <Icons.Hospital className="w-12 h-12 mb-3" />
            <span className="font-bold uppercase tracking-widest text-xs">Create New Department</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Service Offering</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Unit Cost</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Operation</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {services.map(service => (
                    <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{service.name}</p>
                          <p className="text-xs text-slate-400">{service.description}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{service.category}</span>
                       </td>
                       <td className="px-6 py-4 font-bold text-sky-600">${service.cost}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${service.isAvailable ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                             {service.isAvailable ? 'Available' : 'Disabled'}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex justify-center">
                             <button 
                                onClick={() => toggleServiceStatus(service.id, service.isAvailable)}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all ${service.isAvailable ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                             >
                                {service.isAvailable ? 'Disable' : 'Enable'}
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">{editingDept ? 'Edit' : 'New'} Department</h3>
                <button onClick={() => setShowDeptModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleDeptSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department Name</label>
                  <input name="name" defaultValue={editingDept?.name} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Head Doctor</label>
                  <select name="headDoctorId" defaultValue={editingDept?.headDoctorId} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                     <option value="">Select a Head</option>
                     {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea name="description" defaultValue={editingDept?.description} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none h-24 resize-none" />
                </div>
                <button type="submit" className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-900 transition-all">
                  {editingDept ? 'Update Details' : 'Initialize Department'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
