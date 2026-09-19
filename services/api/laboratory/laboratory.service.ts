import { apiRequest } from "../client";
import type { AccessHistory, LabSample, LabTest, RadiologyOrder } from "../../../types";

export const laboratoryService = {
    async getLabTests(): Promise<LabTest[]> { return apiRequest("/lab/tests"); },
    async getLabSamples(): Promise<LabSample[]> { return apiRequest("/lab/samples"); },
    async updateSampleStatus(id: string, status: string, result?: string) {
        return apiRequest(`/lab/samples/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, result }) });
    },
    async getRadiologyOrders(): Promise<RadiologyOrder[]> { return apiRequest("/radiology/orders"); },
    async createRadiologyOrder(data: any): Promise<RadiologyOrder> {
        return apiRequest("/radiology/orders", { method: "POST", body: JSON.stringify(data) });
    },
    async updateRadiologyStatus(id: string, status: string, notes?: string) {
        return apiRequest(`/radiology/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, notes }) });
    },
    async getAccessHistory(): Promise<AccessHistory[]> { return apiRequest("/analytics/access-history"); },
};
