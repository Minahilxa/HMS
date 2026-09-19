import { apiRequest } from "../client";
import type { EmailLog, InternalAnnouncement, SMSLog } from "../../../types";

export const communicationsService = {
    async getInternalAnnouncements(): Promise<InternalAnnouncement[]> { return apiRequest("/communications/announcements"); },
    async createAnnouncement(data: any): Promise<InternalAnnouncement> {
        return apiRequest("/communications/announcements", { method: "POST", body: JSON.stringify(data) });
    },
    async deleteAnnouncement(id: string) { return apiRequest(`/communications/announcements/${id}`, { method: "DELETE" }); },
    async getSMSLogs(): Promise<SMSLog[]> { return apiRequest("/communications/sms"); },
    async sendSMS(data: any): Promise<SMSLog> { return apiRequest("/communications/sms", { method: "POST", body: JSON.stringify(data) }); },
    async getEmailLogs(): Promise<EmailLog[]> { return apiRequest("/emails"); },
    async sendEmail(data: any): Promise<EmailLog> { return apiRequest("/emails/send", { method: "POST", body: JSON.stringify(data) }); },
};
