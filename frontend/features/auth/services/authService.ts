import { userClient } from "../../../libs/apiClient";
import { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth.types";

export const loginUser = async(payload: LoginPayload): Promise<AuthResponse> => {
    const response = await userClient.post<AuthResponse>("/auth/login", payload);
    return response.data;
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await userClient.post<AuthResponse>('/auth/register', payload);
    return response.data
}

export const getMe = async (): Promise<AuthResponse["user"]> => {
    const response = await userClient.get<AuthResponse["user"]>("/auth/get");
    return response.data
}