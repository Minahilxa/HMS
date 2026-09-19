import { apiRequest } from "../client";
import type { Patient } from "../../../types";

export const patientsService = {
    async getPatients(): Promise<Patient[]> {
        return apiRequest("/patients");
    },
    async registerPatient(data: any): Promise<Patient> {
        return apiRequest("/patients", { method: "POST", body: JSON.stringify(data) });
    },
    async updatePatient(id: string, data: any) {
        return apiRequest(`/patients/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    },
    async addEHRRecord(id: string, data: any) {
        return apiRequest(`/patients/${id}/ehr`, { method: "POST", body: JSON.stringify(data) });
    },
    async addPrescription(id: string, data: any) {
        return apiRequest(`/patients/${id}/prescriptions`, { method: "POST", body: JSON.stringify(data) });
    },
};
