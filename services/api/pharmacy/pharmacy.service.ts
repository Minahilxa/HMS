import { apiRequest } from "../client";
import type { PharmacyItem, PharmacySale, PharmacySupplier } from "../../../types";

export const pharmacyService = {
    async getPharmacyInventory(): Promise<PharmacyItem[]> { return apiRequest("/pharmacy/inventory"); },
    async createPharmacyItem(data: any): Promise<PharmacyItem> {
        return apiRequest("/pharmacy/inventory", { method: "POST", body: JSON.stringify(data) });
    },
    async updatePharmacyItem(id: string, data: any) {
        return apiRequest(`/pharmacy/inventory/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async deletePharmacyItem(id: string) { return apiRequest(`/pharmacy/inventory/${id}`, { method: "DELETE" }); },
    async getPharmacySales(): Promise<PharmacySale[]> { return apiRequest("/pharmacy/sales"); },
    async createPharmacySale(data: any): Promise<PharmacySale> {
        return apiRequest("/pharmacy/sales", { method: "POST", body: JSON.stringify(data) });
    },
    async updatePharmacySale(id: string, data: any) {
        return apiRequest(`/pharmacy/sales/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async deletePharmacySale(id: string) { return apiRequest(`/pharmacy/sales/${id}`, { method: "DELETE" }); },
    async getPharmacySuppliers(): Promise<PharmacySupplier[]> { return apiRequest("/pharmacy/suppliers"); },
    async createPharmacySupplier(data: any): Promise<PharmacySupplier> {
        return apiRequest("/pharmacy/suppliers", { method: "POST", body: JSON.stringify(data) });
    },
    async updatePharmacySupplier(id: string, data: any) {
        return apiRequest(`/pharmacy/suppliers/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async deletePharmacySupplier(id: string) { return apiRequest(`/pharmacy/suppliers/${id}`, { method: "DELETE" }); },
};
