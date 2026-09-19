import { apiRequest } from "../client";
import type { Appointment, TimeSlot } from "../../../types";

export const appointmentsService = {
    async getAppointments(): Promise<Appointment[]> {
        return apiRequest("/appointments");
    },
    async createAppointment(data: any): Promise<Appointment> {
        return apiRequest("/appointments", { method: "POST", body: JSON.stringify(data) });
    },
    async updateAppointmentStatus(id: string, status: string) {
        return apiRequest(`/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    },
    async getSlots(): Promise<TimeSlot[]> {
        return apiRequest("/slots");
    },
    async createSlot(data: any): Promise<TimeSlot> {
        return apiRequest("/slots", { method: "POST", body: JSON.stringify(data) });
    },
};
