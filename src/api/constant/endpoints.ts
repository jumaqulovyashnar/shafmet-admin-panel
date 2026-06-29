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
  WORKER_BY_ID: (id: number) => `/api/inspection/workers/${id}/`,
  WORKER_CREATE: '/api/inspection/workers/create/',
  WORKER_PROFILE: (id: number) => `/api/attendance/worker/${id}/`,

  // Zones
  ZONES: '/api/inspection/zones/',
  ZONE_BY_ID: (id: number) => `/api/inspection/zones/${id}/`,

  // Attendance Status and Export Endpoints
  ABSENT_ATTENDANCES: '/api/v1/attendance/absent/',
  ALL_LIST_ATTENDANCES: '/api/v1/attendance/all/',
  EXPORT_ATTENDANCES: '/api/v1/attendance/export/',
  LATE_ATTENDANCES: '/api/v1/attendance/late/',
  PRESENT_ATTENDANCES: '/api/v1/attendance/present/',

  // Dashboard & Employees V1
  DASHBOARD_SUMMARY: '/api/v1/dashboard/summary/',
  DASHBOARD_CHARTS: '/api/v1/dashboard/charts/',
  EMPLOYEES_V1: '/api/v1/employees/',
  EMPLOYEE_V1_BY_ID: (id: number) => `/api/v1/employees/${id}/`,
  EMPLOYEE_V1_UPLOAD_FACE: (id: number) => `/api/v1/employees/${id}/upload-face/`,

  // Tasks V1
  TASKS: '/task/',
  TASK_BY_ID: (id: number) => `/task/${id}/`,
  TASK_STATUS: (id: number) => `/task/${id}/status/`,

  // Assessments V1
  ASSESSMENTS: '/task/assessments/',
  ASSESSMENT_BY_ID: (id: number) => `/task/assessments/${id}/`,
  ASSESSMENTS_BY_WORKER: (workerId: number) => `/task/assessments/worker/${workerId}/`,

  // Work Schedules
  SCHEDULES: '/api/inspection/schedules/',
  SCHEDULE_BY_ID: (id: number) => `/api/inspection/schedules/${id}/`,

  // Lavozim (Departments/Roles)
  LAVOZIM: '/api/lavozim/',
  LAVOZIM_BY_ID: (id: number) => `/api/lavozim/${id}/`,

  // Profile
  PROFILE: '/account/profile/',
} as const
