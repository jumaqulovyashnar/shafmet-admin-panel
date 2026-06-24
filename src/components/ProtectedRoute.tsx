import { Navigate } from 'react-router-dom'
import useUserStore from '@/stores/userStore'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = useUserStore((s) => s.userToken?.accessToken)
    if (!token) return <Navigate to="/login" replace />
    return <>{children}</>
}
