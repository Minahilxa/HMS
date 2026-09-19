import { apiRequest } from "../client";
import type { CustomReport, RevenueData } from "../../../types";

export const analyticsService = {
    async getRevenueSummary(): Promise<RevenueData[]> { return apiRequest("/revenue"); },
    async getCustomReports(): Promise<CustomReport[]> { return apiRequest("/analytics/reports"); },
    async deleteCustomReport(id: string) { return apiRequest(`/analytics/reports/${id}`, { method: "DELETE" }); },
};
