import apiClient from '@/api/client'
import { API_ENDPOINTS } from '@/api/constant/endpoints'
import type { LoginRequest, LoginResponse } from '@/types/auth'

interface RefreshTokenResponse {
    access: string
    refresh?: string
}

const authService = {
    login: (body: LoginRequest): Promise<LoginResponse> =>
        apiClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, body),
    
    refreshToken: (refresh: string): Promise<RefreshTokenResponse> =>
        apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.REFRESH_TOKEN, { refresh }),
}

export default authService
