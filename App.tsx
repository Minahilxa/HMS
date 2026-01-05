
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
  User,
  UserRole
} from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await apiService.getInitDashboard();
      setStats(data.stats);
      setRevenue(data.revenue);
      setDoctors(data.doctors);
      setEmergencyCases(data.emergencyCases);
    } catch (err: any) {
      console.error('Data sync failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('his_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('his_user');
      }
    }
    setLoading(false);
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
  };

  const handleLogout = () => {
    localStorage.removeItem('his_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setStats(null);
  };

  const handleDoctorStatusUpdate = async (id: string, status: Doctor['status']) => {
    const success = await apiService.updateDoctorStatus(id, status);
    if (success) {
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d));
      // Refresh stats to reflect new "On Duty" count
      const updatedStats = await apiService.getDashboardStats();
      setStats(updatedStats);
    }
  };

  if (!isLoggedIn && !loading) return <LoginPage onLogin={handleLogin} />;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">Initializing HealSync Environment...</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} setActiveTab={setActiveTab} revenue={revenue} />;
      case 'apt-mgmt': return <AppointmentManagement />;
      case 'patients': return <PatientManagement />;
      case 'doctors': return (
        <ListSection 
          title="Doctors on Duty" 
          data={doctors} 
          type="doctor" 
          isAdmin={currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.ADMIN}
          onDoctorStatusChange={handleDoctorStatusUpdate}
        />
      );
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

const ListSection: React.FC<{ 
  title: string; 
  data: any[]; 
  type: string; 
  isAdmin?: boolean;
  onDoctorStatusChange?: (id: string, status: Doctor['status']) => void;
}> = ({ title, data, type, isAdmin, onDoctorStatusChange }) => {
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
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center text-nowrap">Availability Status</th>
                  {isAdmin && <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center text-nowrap">Administrative Action</th>}
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
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'On Duty' ? 'bg-green-100 text-green-700' : 
                        item.status === 'On Break' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{item.status}</span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-center">
                        <select 
                          value={item.status}
                          onChange={(e) => onDoctorStatusChange?.(item.id, e.target.value as Doctor['status'])}
                          className="text-[10px] font-bold uppercase bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-sky-500 outline-none transition-all cursor-pointer hover:bg-slate-200"
                        >
                          <option value="On Duty">On Duty</option>
                          <option value="On Break">On Break</option>
                          <option value="Off Duty">Off Duty</option>
                        </select>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
            {!data?.length && <tr><td colSpan={isAdmin ? 4 : 3} className="p-10 text-center text-slate-400 italic">No records found. Use management modules to add data.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
