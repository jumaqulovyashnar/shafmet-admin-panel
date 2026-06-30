import apiClient from '@/api/client'
import { API_ENDPOINTS } from '@/api/constant/endpoints'
import type {
  CheckInRequest,
  CheckInResponse,
  AttendanceDetailResponse,
  Worker,
  V1AttendanceListResponse,
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

  // Lavozim (Departments)
  async getLavozimlar(): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.LAVOZIM)
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
  async getWorkers(options?: { silent404?: boolean }): Promise<Worker[]> {
    try {
      const [v1Res, coreRes] = await Promise.allSettled([
        apiClient.get<any>(API_ENDPOINTS.EMPLOYEES_V1, {
          params: { page_size: 1000 },
          _silent404: true,
        } as any),
        apiClient.get<any>(API_ENDPOINTS.WORKERS, {
          params: { page_size: 1000 },
          _silent404: options?.silent404,
        } as any),
      ])

      const v1List = v1Res.status === 'fulfilled'
        ? (v1Res.value?.results || (Array.isArray(v1Res.value) ? v1Res.value : []))
        : []
      const coreList = coreRes.status === 'fulfilled'
        ? (coreRes.value?.results || (Array.isArray(coreRes.value) ? coreRes.value : []))
        : []

      const coreMap = new Map<string, any>(coreList.map((w: any) => [String(w.id), w]))

      // Merge: prioritize core worker photos (since they are uploaded via multipart), keep V1 fields
      const mergedList = v1List.map((v1Worker: any) => {
        const coreWorker = coreMap.get(String(v1Worker.id))
        return {
          ...v1Worker,
          photo: coreWorker?.photo || v1Worker.avatar || v1Worker.photo,
          photo_url: coreWorker?.photo_url || coreWorker?.photo || v1Worker.avatar,
          has_face_profile: coreWorker?.has_face_profile,
        }
      })

      if (mergedList.length === 0) {
        return coreList
      }

      return mergedList
    } catch {
      return []
    }
  },

  // Get worker by ID (Admin/Manager)
  async getWorkerById(id: number): Promise<Worker> {
    return apiClient.get<Worker>(API_ENDPOINTS.WORKER_BY_ID(id))
  },

  // Update worker (Admin/Manager)
  async updateWorker(id: number, data: Partial<Worker>): Promise<Worker> {
    return apiClient.patch<Worker>(API_ENDPOINTS.WORKER_BY_ID(id), data)
  },

  // Replace worker (PUT)
  async replaceWorker(id: number, data: any): Promise<Worker> {
    return apiClient.put<Worker>(API_ENDPOINTS.WORKER_BY_ID(id), data)
  },

  // Delete worker (Admin/Manager)
  async deleteWorker(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.WORKER_BY_ID(id))
  },

  // Create worker with photo upload (multipart/form-data)
  async createWorkerWithPhoto(data: {
    phone: string
    full_name: string
    password: string
    photo: File
    department: number
    branch: string
  }): Promise<any> {
    // 1. Xodimni yaratish (rasmsiz) - backend formData talab qiladi (415 error fix)
    const createData = new FormData()
    createData.append('phone', data.phone)
    createData.append('full_name', data.full_name)
    createData.append('password', data.password)
    createData.append('department', data.department.toString())
    createData.append('branch', data.branch)
    
    const createdWorker = await apiClient.post<any>(API_ENDPOINTS.EMPLOYEES_V1, createData)

    if (!createdWorker || !createdWorker.id) {
      throw new Error("Xodim yaratildi, ammo ID qaytmadi.")
    }

    // 2. Yuz rasmini yuklash (Face ID integratsiyasi)
    const photoData = new FormData()
    photoData.append('photo', data.photo)
    return apiClient.post<any>(API_ENDPOINTS.EMPLOYEE_V1_UPLOAD_FACE(createdWorker.id), photoData)
  },

  async getWorkerProfile(id: number): Promise<any> {
    return apiClient.get<any>(API_ENDPOINTS.WORKER_PROFILE(id))
  },

  // --- ZONES MANAGEMENT ---
  async getZones(): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.ZONES)
  },

  async getZoneById(id: number): Promise<any> {
    return apiClient.get<any>(API_ENDPOINTS.ZONE_BY_ID(id))
  },

  async createZone(data: any): Promise<any> {
    return apiClient.post<any>(API_ENDPOINTS.ZONES, data)
  },

  async updateZonePut(id: number, data: any): Promise<any> {
    return apiClient.put<any>(API_ENDPOINTS.ZONE_BY_ID(id), data)
  },

  async updateZonePatch(id: number, data: any): Promise<any> {
    return apiClient.patch<any>(API_ENDPOINTS.ZONE_BY_ID(id), data)
  },

  async deleteZone(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ZONE_BY_ID(id))
  },

  // --- ATTENDANCE STATUS & EXPORT ---
  async getAbsentAttendances(
    params?: {
      branch?: string
      start_date?: string
      end_date?: string
      search?: string
    },
    options?: { silent404?: boolean }
  ): Promise<any> {
    return apiClient.get(API_ENDPOINTS.ABSENT_ATTENDANCES, {
      params,
      _silent404: options?.silent404 ?? true,
    } as any)
  },

  async getAllListAttendances(
    params?: {
      branch?: string
      start_date?: string
      end_date?: string
      page?: number
      page_size?: number
      search?: string
    },
    options?: { silent404?: boolean }
  ): Promise<V1AttendanceListResponse> {
    return apiClient.get(API_ENDPOINTS.ALL_LIST_ATTENDANCES, {
      params,
      _silent404: options?.silent404 ?? true,
    } as any)
  },

  async exportAttendances(params?: {
    branch?: string
    start_date?: string
    end_date?: string
    search?: string
    status?: 'all' | 'present' | 'late' | 'absent'
  }): Promise<any> {
    return apiClient.get(API_ENDPOINTS.EXPORT_ATTENDANCES, { params })
  },

  async getLateAttendances(
    params?: {
      branch?: string
      start_date?: string
      end_date?: string
      page?: number
      page_size?: number
      search?: string
    },
    options?: { silent404?: boolean }
  ): Promise<any> {
    return apiClient.get(API_ENDPOINTS.LATE_ATTENDANCES, {
      params,
      _silent404: options?.silent404 ?? true,
    } as any)
  },

  async getPresentAttendances(
    params?: {
      branch?: string
      start_date?: string
      end_date?: string
      page?: number
      page_size?: number
      search?: string
    },
    options?: { silent404?: boolean }
  ): Promise<any> {
    return apiClient.get(API_ENDPOINTS.PRESENT_ATTENDANCES, {
      params,
      _silent404: options?.silent404 ?? true,
    } as any)
  },

  async updateAttendanceExcuse(data: { worker_id: number; date?: string; is_excused: boolean; excuse_reason?: string }): Promise<any> {
    return apiClient.post(API_ENDPOINTS.ATTENDANCE_EXCUSE, data)
  },

  // --- V1 DASHBOARD & EMPLOYEES ---
  async getDashboardSummary(
    params?: {
      branch?: string
      start_date?: string
      end_date?: string
    },
    options?: { silent404?: boolean }
  ): Promise<any> {
    return apiClient.get(API_ENDPOINTS.DASHBOARD_SUMMARY, {
      params,
      _silent404: options?.silent404,
    } as any)
  },

  async getDashboardCharts(
    params?: {
      start_date?: string
      end_date?: string
    },
    options?: { silent404?: boolean }
  ): Promise<any> {
    return apiClient.get(API_ENDPOINTS.DASHBOARD_CHARTS, {
      params,
      _silent404: options?.silent404,
    } as any)
  },

  async getEmployeesV1(params?: {
    branch?: string
    page?: number
    page_size?: number
    search?: string
  }): Promise<any> {
    return apiClient.get(API_ENDPOINTS.EMPLOYEES_V1, { params })
  },

  async getEmployeeV1ById(id: number, options?: { silent404?: boolean }): Promise<any> {
    return apiClient.get(API_ENDPOINTS.EMPLOYEE_V1_BY_ID(id), {
      _silent404: options?.silent404,
    } as any)
  },

  async createEmployeeV1(data: any): Promise<any> {
    return apiClient.post(API_ENDPOINTS.EMPLOYEES_V1, data)
  },

  async updateEmployeeV1Put(id: number, data: any): Promise<any> {
    return apiClient.put(API_ENDPOINTS.EMPLOYEE_V1_BY_ID(id), data)
  },

  async updateEmployeeV1Patch(id: number, data: any): Promise<any> {
    return apiClient.patch(API_ENDPOINTS.EMPLOYEE_V1_BY_ID(id), data)
  },

  async deleteEmployeeV1(id: number): Promise<any> {
    return apiClient.delete(API_ENDPOINTS.EMPLOYEE_V1_BY_ID(id))
  },

  // --- TASKS V1 ---
  async getTasks(options?: { silent404?: boolean }): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.TASKS, {
      _silent404: options?.silent404 ?? true,
    } as any)
  },

  async getTaskById(id: number): Promise<any> {
    return apiClient.get<any>(API_ENDPOINTS.TASK_BY_ID(id))
  },

  async createTask(data: any): Promise<any> {
    return apiClient.post<any>(API_ENDPOINTS.TASKS, data)
  },

  async updateTaskPut(id: number, data: any): Promise<any> {
    return apiClient.put<any>(API_ENDPOINTS.TASK_BY_ID(id), data)
  },

  async updateTaskPatch(id: number, data: any): Promise<any> {
    return apiClient.patch<any>(API_ENDPOINTS.TASK_BY_ID(id), data)
  },

  async deleteTask(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.TASK_BY_ID(id))
  },

  async updateTaskStatusPut(id: number, status: string): Promise<any> {
    return apiClient.put<any>(API_ENDPOINTS.TASK_STATUS(id), { status })
  },

  async updateTaskStatusPatch(id: number, status: string): Promise<any> {
    return apiClient.patch<any>(API_ENDPOINTS.TASK_STATUS(id), { status })
  },

  // --- ASSESSMENTS V1 ---
  async getAssessments(options?: { silent404?: boolean }): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.ASSESSMENTS, {
      _silent404: options?.silent404 ?? true,
    } as any)
  },

  async getAssessmentById(id: number): Promise<any> {
    return apiClient.get<any>(API_ENDPOINTS.ASSESSMENT_BY_ID(id))
  },

  async createAssessment(data: any): Promise<any> {
    return apiClient.post<any>(API_ENDPOINTS.ASSESSMENTS, data)
  },

  async updateAssessmentPut(id: number, data: any): Promise<any> {
    return apiClient.put<any>(API_ENDPOINTS.ASSESSMENT_BY_ID(id), data)
  },

  async updateAssessmentPatch(id: number, data: any): Promise<any> {
    return apiClient.patch<any>(API_ENDPOINTS.ASSESSMENT_BY_ID(id), data)
  },

  async deleteAssessment(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ASSESSMENT_BY_ID(id))
  },

  async getAssessmentsByWorker(workerId: number, options?: { silent404?: boolean }): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.ASSESSMENTS_BY_WORKER(workerId), {
      _silent404: options?.silent404 ?? true,
    } as any)
  },

  // --- WORK SCHEDULES ---
  async getSchedules(options?: { silent404?: boolean }): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.SCHEDULES, {
      _silent404: options?.silent404 ?? true,
    } as any)
  },

  async getScheduleById(id: number): Promise<any> {
    return apiClient.get<any>(API_ENDPOINTS.SCHEDULE_BY_ID(id))
  },

  async createSchedule(data: any): Promise<any> {
    return apiClient.post<any>(API_ENDPOINTS.SCHEDULES, data)
  },

  async updateSchedulePut(id: number, data: any): Promise<any> {
    return apiClient.put<any>(API_ENDPOINTS.SCHEDULE_BY_ID(id), data)
  },

  async updateSchedulePatch(id: number, data: any): Promise<any> {
    return apiClient.patch<any>(API_ENDPOINTS.SCHEDULE_BY_ID(id), data)
  },

  async deleteSchedule(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.SCHEDULE_BY_ID(id))
  },
}

