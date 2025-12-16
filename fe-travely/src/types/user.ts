export interface User {
    userID: string
    userName: string
    phoneNumber?: string
    address?: string
    email: string
    role_id?: number
    created_by?: string
    updated_by?: string
    email_verified: boolean
    google_id?: string
    facebook_id?: string
    avatar_url?: string
    is_admin: boolean
    is_active?: boolean
    created_at?: string
    updated_at?: string
    last_login?: string
    role?: Role
}

export interface Role {
    role_id: number
    name: string
    role_name?: string // Alias for backward compatibility
    description?: string
    active?: boolean
    created_at?: string
    updated_at?: string
    created_by?: string
    updated_by?: string
}

export interface UserCreateData {
    userName: string
    passWord: string
    email: string
    phoneNumber?: string
    address?: string
    role_id?: number
    is_admin?: boolean
}

export interface UserUpdateData {
    userName?: string
    passWord?: string
    phoneNumber?: string
    address?: string
    email?: string
    role_id?: number
    is_admin?: boolean
    is_active?: boolean
}