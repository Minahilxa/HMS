import React, { useState, useEffect, useCallback, useRef } from "react";
import Layout from "./components/Layout";
import DoctorsOnDutyList from "./components/dashboard/DoctorsOnDutyList";
import LoginPage from "./pages/login/LoginPage";
import Dashboard from "./pages/dashboard/Dashboard";
import UserManagement from "./pages/users/UserManagement";
import DoctorManagement from "./pages/doctors/DoctorManagement";
import PatientManagement from "./pages/patients/PatientManagement";
import AppointmentManagement from "./pages/appointments/AppointmentManagement";
import DepartmentManagement from "./pages/departments/DepartmentManagement";
import LaboratoryManagement from "./pages/laboratory/LaboratoryManagement";
import RadiologyManagement from "./pages/radiology/RadiologyManagement";
import PharmacyManagement from "./pages/pharmacy/PharmacyManagement";
import BillingManagement from "./pages/billing/BillingManagement";
import InsuranceManagement from "./pages/insurance/InsuranceManagement";
import CMSManagement from "./pages/cms/CMSManagement";
import ReportsManagement from "./pages/reports/ReportsManagement";
import CommunicationManagement from "./pages/communications/CommunicationManagement";
import SettingsSecurity from "./pages/settings/SettingsSecurity";
import EmergencyManagement from "./pages/emergency/EmergencyManagement";
import { apiService } from "./services/apiService.ts";
import {
  Doctor,
  EmergencyCase,
  RevenueData,
  DashboardStats,
  User,
  UserRole,
} from "./types";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
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
      console.error("Data sync failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("his_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem("his_user");
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
    localStorage.setItem("his_user", JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("his_user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setStats(null);
  };

  const handleDoctorStatusUpdate = async (
    id: string,
    status: Doctor["status"],
  ) => {
    if (!id || id === "undefined") return;
    const success = await apiService.updateDoctorStatus(id, status);
    if (success) {
      setDoctors((prev) =>
        prev.map((d) => {
          const docId = (d as any)._id || d.id;
          return docId === id ? { ...d, status } : d;
        }),
      );
      const updatedStats = await apiService.getDashboardStats();
      setStats(updatedStats);
    }
  };

  if (!isLoggedIn && !loading) return <LoginPage onLogin={handleLogin} />;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">
          Initializing HealSync Environment...
        </p>
      </div>
    );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            stats={stats}
            setActiveTab={setActiveTab}
            revenue={revenue}
          />
        );
      case "apt-mgmt":
        return <AppointmentManagement />;
      case "patients":
        return <PatientManagement />;
      case "doctors":
        return (
          <DoctorsOnDutyList
            title="Doctors on Duty"
            data={doctors}
            isAdmin={
              currentUser?.role === UserRole.SUPER_ADMIN ||
              currentUser?.role === UserRole.ADMIN
            }
            onDoctorStatusChange={handleDoctorStatusUpdate}
          />
        );
      case "doctor-mgmt":
        return <DoctorManagement />;
      case "dept-mgmt":
        return <DepartmentManagement />;
      case "lab-mgmt":
        return <LaboratoryManagement />;
      case "radio-mgmt":
        return <RadiologyManagement />;
      case "pharmacy-mgmt":
        return <PharmacyManagement />;
      case "billing-mgmt":
        return <BillingManagement />;
      case "insurance-mgmt":
        return <InsuranceManagement />;
      case "cms-mgmt":
        return <CMSManagement />;
      case "reports-mgmt":
        return <ReportsManagement />;
      case "comm-mgmt":
        return <CommunicationManagement />;
      case "settings-mgmt":
        return <SettingsSecurity />;
      case "emergency":
        return <EmergencyManagement />;
      case "users":
        return <UserManagement />;
      default:
        return (
          <Dashboard
            stats={stats}
            setActiveTab={setActiveTab}
            revenue={revenue}
          />
        );
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      currentUser={currentUser}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
