import apiClient from '@/api/client'
import type { LoginRequest, LoginResponse } from '@/types/auth'

const authService = {
    login: (body: LoginRequest): Promise<LoginResponse> =>
        apiClient.post<LoginResponse>('/account/login/', body),
}

export default authService
