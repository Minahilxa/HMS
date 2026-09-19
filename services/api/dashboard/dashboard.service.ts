import { apiRequest } from "../client";
import type { DashboardStats, Doctor, EmergencyCase, PatientGrowthEntry, RevenueData } from "../../../types";

export const dashboardService = {
    async getInitDashboard(): Promise<{ stats: DashboardStats; revenue: RevenueData[]; doctors: Doctor[]; emergencyCases: EmergencyCase[] }> {
        return apiRequest("/init-dashboard");
    },
    async getDashboardStats(): Promise<DashboardStats> {
        return apiRequest("/stats");
    },
    async getRevenueSummary(): Promise<RevenueData[]> {
        return apiRequest("/revenue");
    },
    async getPatientGrowthStats(): Promise<PatientGrowthEntry[]> {
        return apiRequest("/analytics/growth");
    },
};
