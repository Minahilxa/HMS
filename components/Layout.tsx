
import React, { useState } from 'react';
import { Icons, ROLE_PERMISSIONS } from '../constants';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, activeTab, setActiveTab, currentUser }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'apt-mgmt', label: 'Appointments', icon: Icons.Calendar },
    { id: 'patients', label: 'Patients (OPD/IPD)', icon: Icons.Users },
    { id: 'doctors', label: 'Doctors On Duty', icon: Icons.Stethoscope },
    { id: 'doctor-mgmt', label: 'Doctor Management', icon: Icons.DoctorBadge },
    { id: 'dept-mgmt', label: 'Department Mgmt', icon: Icons.Department },
    { id: 'lab-mgmt', label: 'Laboratory Module', icon: Icons.Laboratory },
    { id: 'radio-mgmt', label: 'Radiology Module', icon: Icons.Radiology },
    { id: 'pharmacy-mgmt', label: 'Pharmacy Module', icon: Icons.Pharmacy },
    { id: 'billing-mgmt', label: 'Billing & Accounts', icon: Icons.Receipt },
    { id: 'insurance-mgmt', label: 'Insurance & Panels', icon: Icons.ShieldCheck },
    { id: 'reports-mgmt', label: 'Reports & Analytics', icon: Icons.ChartBar },
    { id: 'cms-mgmt', label: 'CMS Module', icon: Icons.DocumentText },
    { id: 'comm-mgmt', label: 'Communication Hub', icon: Icons.Megaphone },
    { id: 'settings-mgmt', label: 'Settings & Security', icon: Icons.Cog6Tooth },
    { id: 'emergency', label: 'Emergency', icon: Icons.Emergency },
    { id: 'revenue', label: 'Revenue', icon: Icons.Currency },
    { id: 'users', label: 'User & Roles', icon: Icons.UserShield },
  ];

  // Filter navigation items based on current user role
  const allowedNavItems = navItems.filter(item => {
    if (!currentUser) return false;
    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes(item.id);
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-white border-r border-slate-200 flex flex-col z-20 shadow-sm`}
      >
        <div className="p-4 flex items-center justify-center border-b border-slate-100 mb-4 h-16">
          <Icons.Hospital className="w-8 h-8 text-sky-600 mr-2" />
          {isSidebarOpen && <span className="font-bold text-xl text-slate-800 tracking-tight text-nowrap">HealSync HIS</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {allowedNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors group ${
                activeTab === item.id 
                ? 'bg-sky-50 text-sky-600 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
              }`}
            >
              <item.icon className={`w-6 h-6 flex-shrink-0 ${activeTab === item.id ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
              {isSidebarOpen && <span className="ml-3 text-xs uppercase tracking-wider truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center px-3 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Icons.Logout className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-3 font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center space-y-0 space-x-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-700">{currentUser?.name || 'Administrator'}</span>
              <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 self-end">
                {currentUser?.role || 'User'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center shadow-inner">
              <span className="text-sky-600 font-black">
                {currentUser?.name.split(' ').map(n => n[0]).join('') || 'AD'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
