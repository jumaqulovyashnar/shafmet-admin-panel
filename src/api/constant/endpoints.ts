// API Endpoints Constants
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/account/login/',
  REFRESH_TOKEN: '/api/token/refresh/',
  
  // Inspection / Attendance
  CHECK_IN: '/api/inspection/check-in/',
  MY_ATTENDANCES: '/api/inspection/my-attendances/',           // Faqat Worker — o'z davomatlari
  ALL_ATTENDANCES: '/api/inspection/attendances/',             // Admin/Manager — barcha davomatlar
  ATTENDANCE_STATS: '/api/inspection/attendance-stats/',       // Admin/Manager — statistika
  ATTENDANCE_BY_ID: (id: number) => `/api/inspection/attendances/${id}/`,
  WORKERS: '/api/inspection/workers/',
} as const
