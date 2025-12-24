
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Doctor, LeaveRequest, DoctorPerformance } from '../types';
import { Icons } from '../constants';

const DoctorManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'profiles' | 'schedules' | 'leaves' | 'performance'>('profiles');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [performance, setPerformance] = useState<DoctorPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [d, l, p] = await Promise.all([
      apiService.getDoctors(),
      apiService.getLeaveRequests(),
      apiService.getDoctorPerformance()
    ]);
    setDoctors(d);
    setLeaves(l);
    setPerformance(p);
    setLoading(false);
  };

  const handleLeaveAction = async (leaveId: string, status: 'Approved' | 'Rejected') => {
    const success = await apiService.updateLeaveStatus(leaveId, status);
    if (success) {
      setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status } : l));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        <p className="text-slate-500">Fetching Doctor Management Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Management</h1>
          <p className="text-slate-500 text-sm">Administrative oversight for clinical staff.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('profiles')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === 'profiles' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >Profiles</button>
          <button 
            onClick={() => setActiveSubTab('schedules')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === 'schedules' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >Schedules</button>
          <button 
            onClick={() => setActiveSubTab('leaves')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === 'leaves' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >Leaves</button>
          <button 
            onClick={() => setActiveSubTab('performance')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === 'performance' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >Performance</button>
        </div>
      </div>

      {activeSubTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div key={doctor.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-xl">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="p-2 text-slate-400 hover:text-sky-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{doctor.name}</h3>
              <p className="text-sky-600 text-sm font-semibold">{doctor.specialization}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Department</span>
                  <span className="text-slate-700 font-bold">{doctor.department}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Experience</span>
                  <span className="text-slate-700 font-bold">{doctor.experience || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Room</span>
                  <span className="text-slate-700 font-bold">{doctor.room}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-sky-300 hover:text-sky-400 transition-all cursor-pointer">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="font-bold text-sm">Add New Doctor</span>
          </div>
        </div>
      )}

      {activeSubTab === 'leaves' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Doctor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Leave Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Period</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leaves.map(leave => (
                <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{leave.doctorName}</td>
                  <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600 font-medium">{leave.type}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{leave.startDate} to {leave.endDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {leave.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleLeaveAction(leave.id, 'Approved')}
                            className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button 
                            onClick={() => handleLeaveAction(leave.id, 'Rejected')}
                            className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </>
                      )}
                      {leave.status !== 'Pending' && <span className="text-xs text-slate-400 italic">No actions</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'schedules' && (
        <div className="grid grid-cols-1 gap-6">
          {doctors.filter(d => d.schedules).map(doctor => (
            <div key={doctor.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center mb-6">
                 <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold mr-3">{doctor.name[4]}</div>
                 <h3 className="font-bold text-slate-800">{doctor.name} - OPD Schedule</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const daySched = doctor.schedules?.find(s => s.day === day);
                  return (
                    <div key={day} className={`p-4 rounded-2xl border ${daySched ? 'border-sky-100 bg-sky-50/30' : 'border-slate-50 bg-slate-50/10'}`}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{day}</p>
                      {daySched ? (
                        <>
                          <p className="text-xs font-bold text-sky-700">{daySched.startTime} - {daySched.endTime}</p>
                          <p className="text-[10px] text-sky-500 mt-1">Limit: {daySched.limit} slots</p>
                        </>
                      ) : (
                        <p className="text-xs text-slate-300 italic">Off Day</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {performance.map(perf => {
             const doc = doctors.find(d => d.id === perf.doctorId);
             return (
               <div key={perf.doctorId} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                  <h3 className="font-bold text-slate-800 mb-1">{doc?.name}</h3>
                  <p className="text-xs text-slate-400 mb-6">{doc?.department}</p>
                  
                  <div className="space-y-4 relative z-10">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Patients Seen</span>
                        <span className="font-bold text-slate-800">{perf.patientsSeen}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full">
                        <div className="h-full bg-sky-500 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Attendance Rate</span>
                        <span className="font-bold text-slate-800">{perf.attendanceRate}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{width: `${perf.attendanceRate}%`}}></div>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between items-center border-t border-slate-50">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span className="text-sm font-bold text-slate-700">{perf.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">{perf.surgeriesPerformed} Surgeries</span>
                    </div>
                  </div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
