import { apiRequest } from "../client";
import type { Invoice } from "../../../types";

export const billingService = {
    async getInvoices(): Promise<Invoice[]> {
        return apiRequest("/invoices");
    },
    async createInvoice(data: any): Promise<Invoice> {
        return apiRequest("/invoices", { method: "POST", body: JSON.stringify(data) });
    },
    async updateInvoice(id: string, data: any) {
        return apiRequest(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
};
