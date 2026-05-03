export type UserRole = "farmer" | "buyer" | "transporter"

export interface User {
    _id : string;
    name: string;
    email?: string;
    phone: string;
    role: UserRole;
    createdAt: string;
}
export interface LoginPayload {
    phone: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email?: string;
    phone: string;
    password: string;
    role: UserRole;
}

export interface AuthResponse {
    token : string;
    user: User;
}

export interface RoleSelectParams {
    role: UserRole;
}