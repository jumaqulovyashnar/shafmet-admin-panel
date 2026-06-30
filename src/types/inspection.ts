// Check-in API Types
export interface CheckInRequest {
  user_id?: number
  photo: File
  latitude: number
  longitude: number
  attendance_type: 'in' | 'out' | 'In' | 'Out'
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

// Yangi API (v1) uchun format
export interface V1Attendance {
  [key: string]: any
  id?: number                     // Backend agar bersa
  user?: number                   // worker id
  rasm: string                    // rasm URL
  ism: string                     // xodim ismi
  sana: string                    // "YYYY-MM-DD"
  kelgan_vaqt: string | null      // ISO time
  turi_kirish: string | null      // in status text
  status_kirish: boolean          // success/fail
  ketgan_vaqt: string | null      // ISO time
  turi_chiqish: string | null     // out status text
  status_chiqish: boolean         // success/fail
  umumiy_soat: string             // "12:00:00" formatidagi string
}

export interface V1AttendanceListResponse {
  count: number
  next: string | null
  previous: string | null
  results: V1Attendance[]
}

// Worker Types
export type WorkerRole = 'boss' | 'manager' | 'worker' | 'admin'

export interface Worker {
  [key: string]: any
  id: number
  phone: string
  full_name: string
  avatar?: string
  role: WorkerRole
  branch?: string
  department?: number
  department_detail?: {
    id: number
    name: string
    slug: string
  }
  is_active: boolean
  photo?: string
  photo_url?: string
  has_face_profile?: string
  created_at: string
}
