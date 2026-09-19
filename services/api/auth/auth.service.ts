import { apiRequest } from "../client";
import type { User } from "../../../types";

export const authService = {
    async login(credentials: any): Promise<{ user: User; token: string }> {
        return apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    },
};
