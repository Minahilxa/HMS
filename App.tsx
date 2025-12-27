import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import DoctorManagement from './pages/DoctorManagement';
import PatientManagement from './pages/PatientManagement';
import AppointmentManagement from './pages/AppointmentManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import LaboratoryManagement from './pages/LaboratoryManagement';
import RadiologyManagement from './pages/RadiologyManagement';
import PharmacyManagement from './pages/PharmacyManagement';
import BillingManagement from './pages/BillingManagement';
import InsuranceManagement from './pages/InsuranceManagement';
import CMSManagement from './pages/CMSManagement';
import ReportsManagement from './pages/ReportsManagement';
import CommunicationManagement from './pages/CommunicationManagement';
import SettingsSecurity from './pages/SettingsSecurity';
import { apiService } from './services/apiService';
import { 
  Doctor, 
  EmergencyCase, 
  RevenueData, 
  DashboardStats, 
  User 
} from './types';

const App: React.FC = () => {
  console.log("HealSync HIS: App component rendering...");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);

  const isFetched = useRef(false);

  const loadData = useCallback(async () => {
    if (isFetched.current) return;
    console.log("HealSync HIS: Synchronizing clinical data...");
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getInitDashboard();
      console.log("HealSync HIS: Synchronization successful.");
      setStats(data.stats);
      setRevenue(data.revenue);
      setDoctors(data.doctors);
      setEmergencyCases(data.emergencyCases);
      isFetched.current = true;
    } catch (err: any) {
      console.error('HealSync HIS: Sync Failure:', err);
      setError("Clinical Server Connection Failed. Ensure the backend is running at http://localhost:5000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkSession = () => {
      console.log("HealSync HIS: Checking session storage...");
      try {
        const token = localStorage.getItem('his_token');
        const savedUser = localStorage.getItem('his_user');
        
        if (token && savedUser) {
          const user = JSON.parse(savedUser);
          console.log("HealSync HIS: Restored session for", user.name);
          setCurrentUser(user);
          setIsLoggedIn(true);
        } else {
          console.log("HealSync HIS: No valid session found.");
          setLoading(false);
        }
      } catch (e) {
        console.error("HealSync HIS: Session recovery error:", e);
        handleLogout();
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn, loadData]);

  const handleLogin = (user: User) => {
    localStorage.setItem('his_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
    isFetched.current = false; 
    console.log("HealSync HIS: Staff login successful:", user.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('his_token');
    localStorage.removeItem('his_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setStats(null);
    isFetched.current = false;
    setLoading(false);
    console.log("HealSync HIS: Session terminated.");
  };

  if (!isLoggedIn && !loading) return <LoginPage onLogin={handleLogin} />;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">Syncing Clinical Intelligence...</p>
    </div>
  );

  const renderContent = () => {
    if (error) return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-3xl border border-red-100 shadow-xl max-w-2xl mx-auto mt-20">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Sync Interrupted</h2>
        <p className="text-slate-500 mb-8 max-w-md">{error}</p>
        <div className="flex gap-4">
          <button onClick={() => { isFetched.current = false; loadData(); }} className="px-6 py-3 bg-sky-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all">Retry Sync</button>
          <button onClick={handleLogout} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">Return to Login</button>
        </div>
      </div>
    );

    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} setActiveTab={setActiveTab} revenue={revenue} />;
      case 'apt-mgmt': return <AppointmentManagement />;
      case 'patients': return <PatientManagement />;
      case 'doctors': return <ListSection title="Doctors on Duty" data={doctors} type="doctor" />;
      case 'doctor-mgmt': return <DoctorManagement />;
      case 'dept-mgmt': return <DepartmentManagement />;
      case 'lab-mgmt': return <LaboratoryManagement />;
      case 'radio-mgmt': return <RadiologyManagement />;
      case 'pharmacy-mgmt': return <PharmacyManagement />;
      case 'billing-mgmt': return <PharmacyManagement />;
      case 'insurance-mgmt': return <InsuranceManagement />;
      case 'cms-mgmt': return <CMSManagement />;
      case 'reports-mgmt': return <ReportsManagement />;
      case 'comm-mgmt': return <CommunicationManagement />;
      case 'settings-mgmt': return <SettingsSecurity />;
      case 'emergency': return <ListSection title="Emergency Cases" data={emergencyCases} type="emergency" />;
      case 'users': return <UserManagement />;
      default: return <Dashboard stats={stats} setActiveTab={setActiveTab} revenue={revenue} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} currentUser={currentUser}>
      {renderContent()}
    </Layout>
  );
};

const ListSection: React.FC<{ title: string; data: any[]; type: string }> = ({ title, data, type }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {type === 'doctor' ? (
                <>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-nowrap">Doctor Profile</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-nowrap">Specialization</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center text-nowrap">Status</th>
                </>
              ) : (
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Information</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(data || []).map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                {type === 'doctor' && (
                  <>
                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{item.specialization}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'On Duty' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {!data?.length && <tr><td colSpan={3} className="p-10 text-center text-slate-400 italic">No records found in database.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;