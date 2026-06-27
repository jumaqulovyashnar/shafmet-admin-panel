import apiClient from '@/api/client'
import { API_ENDPOINTS } from '@/api/constant/endpoints'
import type {
  CheckInRequest,
  CheckInResponse,
  AttendanceDetailResponse,
  Worker,
} from '@/types/inspection'

export const inspectionService = {
  // Check-in / Check-out endpoint
  async checkIn(data: CheckInRequest): Promise<CheckInResponse> {
    const formData = new FormData()
    if (data.user_id) {
      formData.append('user_id', data.user_id.toString())
    }
    formData.append('photo', data.photo)
    formData.append('latitude', data.latitude.toString())
    formData.append('longitude', data.longitude.toString())
    formData.append('attendance_type', data.attendance_type)

    return apiClient.post<CheckInResponse>(API_ENDPOINTS.CHECK_IN, formData)
  },

  // Get current worker's own attendances (Faqat Worker)
  async getMyAttendances(params?: {
    page?: number
    page_size?: number
    search?: string
    face_verified?: boolean
    location_verified?: boolean
    is_success?: boolean
  }): Promise<unknown> {
    return apiClient.get<unknown>(API_ENDPOINTS.MY_ATTENDANCES, {
      params: {
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 50,
        search: params?.search,
        face_verified: params?.face_verified,
        location_verified: params?.location_verified,
        is_success: params?.is_success,
      },
    })
  },

  // Get ALL attendances (Admin/Manager) — barcha xodimlarning davomatlari
  async getAllAttendances(params?: {
    page?: number
    page_size?: number
    search?: string
    face_verified?: boolean
    location_verified?: boolean
    is_success?: boolean
  }): Promise<unknown> {
    return apiClient.get<unknown>(API_ENDPOINTS.ALL_ATTENDANCES, {
      params: {
        page: params?.page ?? 1,
        page_size: params?.page_size ?? 50,
        search: params?.search,
        face_verified: params?.face_verified,
        location_verified: params?.location_verified,
        is_success: params?.is_success,
      },
    })
  },

  // Get attendance stats (Admin/Manager) — davomat statistikasi
  async getAttendanceStats(): Promise<unknown> {
    return apiClient.get<unknown>(API_ENDPOINTS.ATTENDANCE_STATS)
  },

  // Get attendance by ID
  async getAttendanceById(id: number): Promise<AttendanceDetailResponse> {
    return apiClient.get<AttendanceDetailResponse>(API_ENDPOINTS.ATTENDANCE_BY_ID(id))
  },

  // Get workers list (Admin/Manager)
  async getWorkers(): Promise<Worker[]> {
    return apiClient.get<Worker[]>(API_ENDPOINTS.WORKERS)
  },
}

