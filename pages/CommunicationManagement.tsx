
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { InternalAnnouncement, SMSLog, EmailLog, Patient } from '../types';
import { Icons } from '../constants';

const CommunicationManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<InternalAnnouncement[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'announcements' | 'sms' | 'email'>('announcements');
  
  // Modals
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ann, s, e, pts] = await Promise.all([
        apiService.getInternalAnnouncements(),
        apiService.getSMSLogs(),
        apiService.getEmailLogs(),
        apiService.getPatients()
      ]);
      setAnnouncements(ann);
      setSmsLogs(s);
      setEmailLogs(e);
      setPatients(pts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await apiService.createAnnouncement({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      priority: formData.get('priority') as any,
      targetAudience: formData.get('targetAudience') as any
    });
    setShowAnnModal(false);
    loadData();
  };

  const handleDeleteAnn = async (id: string) => {
    if (confirm("Delete this announcement?")) {
      await apiService.deleteAnnouncement(id);
      loadData();
    }
  };

  const handleSendSMS = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pId = formData.get('patientId') as string;
    const p = patients.find(pat => pat.id === pId);
    
    await apiService.sendSMS({
      patientName: p?.name,
      phoneNumber: p?.phone,
      message: formData.get('message') as string,
      type: 'General'
    });
    setShowSMSModal(false);
    loadData();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.Megaphone className="w-8 h-8 mr-3 text-sky-600" />
            Communication System
          </h1>
          <p className="text-sm text-slate-500">Manage internal staff broadcasts and monitor patient outreach via SMS/Email.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab('announcements')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'announcements' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Announcements</button>
          <button onClick={() => setActiveTab('sms')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'sms' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>SMS Gateway</button>
          <button onClick={() => setActiveTab('email')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'email' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>Email Alerts</button>
        </div>
      </div>

      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold text-slate-700">Internal Broadcasts</h2>
             <button onClick={() => setShowAnnModal(true)} className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-sky-700 transition-all flex items-center">
               Post New Announcement
             </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-200 transition-all relative group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                      ann.priority === 'High' ? 'bg-red-50 text-red-600' :
                      ann.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {ann.priority} Priority
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{ann.targetAudience}</span>
                  </div>
                  <button onClick={() => handleDeleteAnn(ann.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{ann.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{ann.content}</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black">{ann.author[0]}</div>
                    <span className="text-[10px] font-bold text-slate-400">{ann.author}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sms' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">SMS Outbox Activity</h2>
              <button onClick={() => setShowSMSModal(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-black transition-all">
                Compose Ad-hoc SMS
              </button>
           </div>
           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient & Phone</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Message Content</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {smsLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{log.patientName}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{log.phoneNumber}</p>
                         </td>
                         <td className="px-6 py-4 max-w-md">
                            <p className="text-xs text-slate-600 italic">"{log.message}"</p>
                            <span className="text-[8px] text-sky-600 font-black uppercase mt-1 inline-block">{log.type}</span>
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                              log.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                              log.status === 'Sent' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                            }`}>{log.status}</span>
                         </td>
                         <td className="px-6 py-4 text-xs text-slate-400 font-medium">{log.timestamp}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Email Dispatcher Logs</h2>
              <button className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
                Email Templates
              </button>
           </div>
           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Recipient</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Subject Line</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Outcome</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date/Time</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {emailLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{log.patientName}</p>
                            <p className="text-[10px] text-slate-400">{log.email}</p>
                         </td>
                         <td className="px-6 py-4 text-xs text-slate-600 font-medium">{log.subject}</td>
                         <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                              log.status === 'Opened' ? 'bg-green-50 text-green-600' : 
                              log.status === 'Sent' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                            }`}>{log.status}</span>
                         </td>
                         <td className="px-6 py-4 text-xs text-slate-400 font-medium">{log.timestamp}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">New Staff Announcement</h3>
                <button onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleCreateAnnouncement} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message Heading</label>
                  <input name="title" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="e.g. Maintenance Scheduled" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                    <select name="priority" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>High</option>
                       <option>Medium</option>
                       <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Audience</label>
                    <select name="targetAudience" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>All Staff</option>
                       <option>Doctors</option>
                       <option>Nurses</option>
                       <option>Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Content</label>
                  <textarea name="content" required className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none resize-none" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all">Broadcast Announcement</button>
             </form>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSMSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="p-6 bg-sky-50 border-b border-sky-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-sky-800">Send Direct SMS</h3>
                <button onClick={() => setShowSMSModal(false)} className="text-sky-400 hover:text-sky-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleSendSMS} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Select</label>
                  <select name="patientId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                     {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message (Max 160 chars)</label>
                  <textarea name="message" required maxLength={160} className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none resize-none" placeholder="Type your patient message here..." />
                </div>
                <button type="submit" className="w-full bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-sky-700 transition-all flex items-center justify-center">
                  <Icons.Phone className="w-5 h-5 mr-2" />
                  Initiate SMS Dispatch
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationManagement;
