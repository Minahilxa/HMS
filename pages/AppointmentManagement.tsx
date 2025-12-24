
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Appointment, AppointmentSource, TimeSlot, Doctor } from '../types';
import { Icons } from '../constants';

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'online' | 'walk-in' | 'slots'>('online');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [apts, s, docs] = await Promise.all([
      apiService.getAppointments(),
      apiService.getSlots(),
      apiService.getDoctors()
    ]);
    setAppointments(apts);
    setSlots(s);
    setDoctors(docs);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: Appointment['status']) => {
    const success = await apiService.updateAppointmentStatus(id, status);
    if (success) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const doctorId = formData.get('doctorId') as string;
    const doc = doctors.find(d => d.id === doctorId);

    const newApt = await apiService.createAppointment({
      patientName: formData.get('patientName') as string,
      doctorId: doctorId,
      doctorName: doc?.name || 'Dr. Wilson',
      time: formData.get('time') as string,
      date: formData.get('date') as string,
      type: formData.get('type') as string,
      source: activeTab === 'online' ? AppointmentSource.ONLINE : AppointmentSource.WALK_IN
    });

    setAppointments(prev => [...prev, newApt]);
    setShowModal(false);
  };

  const filteredApts = appointments.filter(a => 
    activeTab === 'online' ? a.source === AppointmentSource.ONLINE : a.source === AppointmentSource.WALK_IN
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Appointment Management</h1>
          <p className="text-sm text-slate-500">Coordinate patient consultations and doctor availability.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all flex items-center"
        >
          <Icons.Calendar className="w-5 h-5 mr-2" />
          New Appointment
        </button>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('online')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'online' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Online Bookings</button>
        <button onClick={() => setActiveTab('walk-in')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'walk-in' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Walk-in Traffic</button>
        <button onClick={() => setActiveTab('slots')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'slots' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Slot Management</button>
      </div>

      {activeTab !== 'slots' ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient & Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Physician</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Time & Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredApts.map(apt => (
                <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{apt.patientName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{apt.date}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{apt.doctorName}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-sky-600">{apt.time}</p>
                    <p className="text-xs text-slate-400">{apt.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      apt.status === 'Scheduled' ? 'bg-amber-100 text-amber-700' :
                      apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'Checked-in' ? 'bg-sky-100 text-sky-700' :
                      'bg-red-100 text-red-700'
                    }`}>{apt.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-1">
                      {apt.status === 'Scheduled' && (
                        <button onClick={() => handleStatusUpdate(apt.id, 'Checked-in')} className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-sky-100">Check-in</button>
                      )}
                      {apt.status === 'Checked-in' && (
                        <button onClick={() => handleStatusUpdate(apt.id, 'Completed')} className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-green-100">Complete</button>
                      )}
                      {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                        <button onClick={() => handleStatusUpdate(apt.id, 'Cancelled')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-100">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {slots.map(slot => (
            <div key={slot.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-1.5 h-full ${slot.isAvailable ? 'bg-green-500' : 'bg-red-400'}`}></div>
              <h4 className="font-bold text-slate-800">{slot.startTime} - {slot.endTime}</h4>
              <p className="text-xs text-slate-500 mt-1">{slot.day}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase ${slot.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {slot.isAvailable ? 'Available' : 'Booked'}
                </span>
                <button className="text-sky-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
              </div>
            </div>
          ))}
          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-sky-300 hover:text-sky-400 transition-all cursor-pointer">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="font-bold text-xs uppercase tracking-widest">Add Slot</span>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">New {activeTab} Appointment</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleCreateAppointment} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Name</label>
                  <input name="patientName" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="John Smith" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Doctor</label>
                    <select name="doctorId" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                      {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Appointment Type</label>
                    <select name="type" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                      <option>General Checkup</option>
                      <option>Follow-up</option>
                      <option>Specialist Consult</option>
                      <option>Diagnostics</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preferred Date</label>
                    <input name="date" type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preferred Time</label>
                    <input name="time" type="time" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all">Confirm Booking</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
