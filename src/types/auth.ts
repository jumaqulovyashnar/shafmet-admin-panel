// POST /account/login/ — request body
export interface LoginRequest {
    phone: string
    password: string
}

// POST /account/login/ — response
export interface LoginResponse {
    access?: string
    refresh?: string
    token?: string
    access_token?: string
    // Server role qaytarishi 
    role?: string
    is_admin?: boolean
    user?: {
        id?: number | string
        phone?: string
        name?: string
        role?: string
        is_admin?: boolean
    }
}
