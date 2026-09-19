import { apiRequest } from "../client";
import type { InsuranceClaim, InsurancePanel, PatientCoverage } from "../../../types";

export const insuranceService = {
    async getInsurancePanels(): Promise<InsurancePanel[]> { return apiRequest("/insurance/panels"); },
    async createInsurancePanel(data: any): Promise<InsurancePanel> {
        return apiRequest("/insurance/panels", { method: "POST", body: JSON.stringify(data) });
    },
    async updateInsurancePanel(id: string, data: any) {
        return apiRequest(`/insurance/panels/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async deleteInsurancePanel(id: string) { return apiRequest(`/insurance/panels/${id}`, { method: "DELETE" }); },
    async getInsuranceClaims(): Promise<InsuranceClaim[]> { return apiRequest("/insurance/claims"); },
    async updateClaimStatus(id: string, data: any) {
        return apiRequest(`/insurance/claims/${id}/status`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async getPatientCoverage(id: string): Promise<PatientCoverage[]> { return apiRequest(`/insurance/coverage/${id}`); },
    async createPatientCoverage(data: any): Promise<PatientCoverage> {
        return apiRequest("/insurance/coverage", { method: "POST", body: JSON.stringify(data) });
    },
};
