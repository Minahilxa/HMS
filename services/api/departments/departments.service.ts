import { apiRequest } from "../client";
import type { HospitalDepartment, HospitalService } from "../../../types";

export const departmentsService = {
    async getDepartments(): Promise<HospitalDepartment[]> {
        return apiRequest("/departments");
    },
    async createDepartment(data: any): Promise<HospitalDepartment> {
        return apiRequest("/departments", { method: "POST", body: JSON.stringify(data) });
    },
    async updateDepartment(id: string, data: any) {
        return apiRequest(`/departments/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async getServices(): Promise<HospitalService[]> {
        return apiRequest("/services");
    },
    async createService(data: any): Promise<HospitalService> {
        return apiRequest("/services", { method: "POST", body: JSON.stringify(data) });
    },
    async updateService(id: string, data: any) {
        return apiRequest(`/services/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async deleteService(id: string) {
        return apiRequest(`/services/${id}`, { method: "DELETE" });
    },
};
