
import React, { useState, useEffect } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('his_token');
      const savedUser = localStorage.getItem('his_user');
      
      if (token && savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
          setIsLoggedIn(true);
        } catch (e) {
          handleLogout();
        }
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getInitDashboard();
      setStats(data.stats);
      setRevenue(data.revenue);
      setDoctors(data.doctors);
      setEmergencyCases(data.emergencyCases);
    } catch (err: any) {
      console.error('Data Load Failed:', err);
      setError("Failed to sync with clinical server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user: User) => {
    localStorage.setItem('his_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('his_token');
    localStorage.removeItem('his_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setStats(null);
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">Synchronizing HIS Data...</p>
    </div>
  );

  const renderContent = () => {
    if (error) return (
      <div className="p-8 text-center bg-white rounded-3xl border border-red-100 shadow-sm">
        <div className="text-red-500 font-bold mb-2">Connectivity Error</div>
        <p className="text-slate-500 mb-4">{error}</p>
        <button onClick={loadData} className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-bold">Retry Sync</button>
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
      case 'billing-mgmt': return <BillingManagement />;
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
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Doctor Profile</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specialization</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                </>
              ) : (
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Information</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(data || []).map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
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
            {!data?.length && <tr><td className="p-10 text-center text-slate-400 italic">No records found in database.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
