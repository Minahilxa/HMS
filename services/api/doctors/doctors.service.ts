import { apiRequest } from "../client";
import type { Doctor, DoctorPerformance, LeaveRequest } from "../../../types";

export const doctorsService = {
    async getDoctors(): Promise<Doctor[]> {
        return apiRequest("/doctors");
    },
    async createDoctor(data: any): Promise<Doctor> {
        return apiRequest("/doctors", { method: "POST", body: JSON.stringify(data) });
    },
    async updateDoctor(id: string, data: any) {
        return apiRequest(`/doctors/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async updateDoctorStatus(id: string, status: string) {
        return apiRequest(`/doctors/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    },
    async getLeaveRequests(): Promise<LeaveRequest[]> {
        return apiRequest("/leaves");
    },
    async updateLeaveStatus(id: string, status: string) {
        return apiRequest(`/leaves/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    },
    async getDoctorPerformance(): Promise<DoctorPerformance[]> {
        return apiRequest("/doctors/performance");
    },
    async updateDoctorCMS(id: string, data: any) {
        return apiRequest(`/doctors/${id}/cms`, { method: "PATCH", body: JSON.stringify(data) });
    },
};
