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

    getProfile: (): Promise<any> =>
        apiClient.get<any>(API_ENDPOINTS.PROFILE),

    updateProfile: (data: any): Promise<any> => {
        // If there's an avatar, we should send multipart/form-data
        if (data instanceof FormData) {
            return apiClient.patch<any>(API_ENDPOINTS.PROFILE, data)
        }
        return apiClient.patch<any>(API_ENDPOINTS.PROFILE, data)
    }
}

export default authService
