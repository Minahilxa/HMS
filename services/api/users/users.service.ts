import { apiRequest } from "../client";
import type { User, UserRole } from "../../../types";

export const usersService = {
    async getUsers(): Promise<User[]> {
        return apiRequest("/users");
    },
    async updateUserRole(id: string, role: UserRole) {
        return apiRequest(`/users/${id}/role`, {
            method: "PATCH",
            body: JSON.stringify({ role }),
        });
    },
    async sendUserInvitation(email: string, role: UserRole): Promise<boolean> {
        const response = await apiRequest<{ message: string }>("/users/invite", {
            method: "POST",
            body: JSON.stringify({ email, role }),
        });
        return response.message === "Invitation sent successfully.";
    },
};
