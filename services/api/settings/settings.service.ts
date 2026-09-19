import { apiRequest } from "../client";
import type { BackupLog, HospitalSettings, PaymentGateway, SecuritySetting } from "../../../types";

export const settingsService = {
    async getHospitalSettings(): Promise<HospitalSettings> { return apiRequest("/settings/hospital"); },
    async updateHospitalSettings(data: Partial<HospitalSettings>) { return apiRequest("/settings/hospital", { method: "PATCH", body: JSON.stringify(data) }); },
    async getPaymentGateways(): Promise<PaymentGateway[]> { return apiRequest("/settings/payments"); },
    async createPaymentGateway(data: Partial<PaymentGateway>): Promise<PaymentGateway> { return apiRequest("/settings/payments", { method: "POST", body: JSON.stringify(data) }); },
    async updatePaymentGateway(id: string, data: Partial<PaymentGateway>) { return apiRequest(`/settings/payments/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
    async deletePaymentGateway(id: string) { return apiRequest(`/settings/payments/${id}`, { method: "DELETE" }); },
    async getSecuritySettings(): Promise<SecuritySetting[]> { return apiRequest("/settings/security"); },
    async createSecuritySetting(data: Partial<SecuritySetting>): Promise<SecuritySetting> { return apiRequest("/settings/security", { method: "POST", body: JSON.stringify(data) }); },
    async updateSecuritySetting(id: string, data: Partial<SecuritySetting>) { return apiRequest(`/settings/security/${id}`, { method: "PATCH", body: JSON.stringify(data) }); },
    async deleteSecuritySetting(id: string) { return apiRequest(`/settings/security/${id}`, { method: "DELETE" }); },
    async toggleSecuritySetting(id: string) { return apiRequest(`/settings/security/${id}/toggle`, { method: "PATCH" }); },
    async getBackupLogs(): Promise<BackupLog[]> { return apiRequest("/settings/backups"); },
    async runManualBackup() { return apiRequest("/settings/backups/run", { method: "POST" }); },
    async deleteBackup(id: string) { return apiRequest(`/settings/backups/${id}`, { method: "DELETE" }); },
};
