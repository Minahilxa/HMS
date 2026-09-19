import { apiRequest } from "../client";
import type { EmergencyCase, EmergencyNumber } from "../../../types";

export const emergencyService = {
    async getEmergencyNumbers(): Promise<EmergencyNumber[]> { return apiRequest("/settings/emergency-numbers"); },
    async createEmergencyNumber(data: Partial<EmergencyNumber>): Promise<EmergencyNumber> {
        return apiRequest("/settings/emergency-numbers", { method: "POST", body: JSON.stringify(data) });
    },
    async updateEmergencyNumber(id: string, data: Partial<EmergencyNumber>) {
        return apiRequest(`/settings/emergency-numbers/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async deleteEmergencyNumber(id: string) { return apiRequest(`/settings/emergency-numbers/${id}`, { method: "DELETE" }); },
    async getEmergencyCases(): Promise<EmergencyCase[]> { return apiRequest("/emergency/cases"); },
    async createEmergencyCase(data: Partial<EmergencyCase>): Promise<EmergencyCase> {
        return apiRequest("/emergency/cases", { method: "POST", body: JSON.stringify(data) });
    },
    async updateEmergencyCase(id: string, data: Partial<EmergencyCase>) {
        return apiRequest(`/emergency/cases/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async deleteEmergencyCase(id: string) { return apiRequest(`/emergency/cases/${id}`, { method: "DELETE" }); },
};
