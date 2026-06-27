// Check-in API Types
export interface CheckInRequest {
  user_id?: number
  photo: File
  latitude: number
  longitude: number
  attendance_type: 'in' | 'out'
}

export interface CheckInResponse {
  success: boolean
  face_verified: boolean
  location_verified: boolean
  distance_meters: number
  attendance_type: string
  message: string
}

// Attendance Types — API dan kelgan haqiqiy format
export interface Attendance {
  id: number
  user: number                    // user ID (raqam)
  user_phone: string              // flat maydon
  user_full_name: string          // flat maydon
  attendance_type: 'in' | 'out'
  face_verified: boolean
  location_verified: boolean
  is_success: boolean
  latitude?: number
  longitude?: number
  distance_meters?: number
  created_at: string              // sana/vaqt
}

export interface AttendanceListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Attendance[]
}

export interface AttendanceDetailResponse extends Attendance {}

// Worker Types
export type WorkerRole = 'boss' | 'manager' | 'worker' | 'admin'

export interface Worker {
  id: number
  phone: string
  full_name: string
  avatar?: string
  role: WorkerRole
  is_active: boolean
  photo?: string
  has_face_profile?: string
  created_at: string
}
