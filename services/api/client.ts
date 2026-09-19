import { API_BASE, getHeaders, handleResponse } from "../../api_config";

export const apiRequest = async <T = any>(
    path: string,
    options: RequestInit = {},
): Promise<T> => {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...getHeaders(),
            ...(options.headers || {}),
        },
    });
    return handleResponse(response) as Promise<T>;
};
