import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/loginPage'
import DashboardPage from '@/pages/DashboardPage'
import TasksPage from '@/pages/TasksPage'
import EmployeesPage from '@/pages/EmployeesPage'
import DashboardLayout from '@/layout/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'employees/:dept', element: <EmployeesPage /> },
      { path: 'payments', element: <div className="bg-white rounded-2xl p-8 text-gray-400 text-sm">Tolovlar — tez kunda</div> },
      { path: 'geo', element: <div className="bg-white rounded-2xl p-8 text-gray-400 text-sm">Geolokatsiya — tez kunda</div> },
      { path: 'departments', element: <div className="bg-white rounded-2xl p-8 text-gray-400 text-sm">Maxsus Bo'lim — tez kunda</div> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])
