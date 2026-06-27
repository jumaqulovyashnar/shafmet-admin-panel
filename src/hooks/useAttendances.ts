import { useState, useEffect, useCallback } from 'react'
import { inspectionService } from '@/services/inspectionService'
import type { Attendance } from '@/types/inspection'

interface UseAttendancesReturn {
    attendances: Attendance[]
    loading: boolean
    error: string | null
    page: number
    totalPages: number
    totalCount: number
    setPage: (page: number) => void
    refetch: () => void
    search: string
    setSearch: (search: string) => void
    filter: string
    setFilter: (filter: string) => void
}

export function useAttendances(pageSize: number = 50): UseAttendancesReturn {
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('Barchasi')

    const fetchAttendances = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            // Convert filter to API params
            let faceVerified: boolean | undefined
            let locationVerified: boolean | undefined
            let isSuccess: boolean | undefined

            if (filter === 'Yuz Tasdiqlangan') {
                faceVerified = true
            } else if (filter === 'Joy Tasdiqlangan') {
                locationVerified = true
            } else if (filter === 'Muvaffaqiyatli') {
                isSuccess = true
            }

            // Admin panel — barcha xodimlarning davomatlarini olish
            // /api/inspection/attendances/ endpoint (Admin/Manager)
            const raw: unknown = await inspectionService.getAllAttendances({
                page,
                page_size: pageSize,
                search: search || undefined,
                face_verified: faceVerified,
                location_verified: locationVerified,
                is_success: isSuccess,
            })

            console.log('[useAttendances] API response:', raw)

            if (Array.isArray(raw)) {
                // API returned a plain array of attendances
                setAttendances(raw as Attendance[])
                setTotalCount(raw.length)
            } else if (raw && typeof raw === 'object' && 'results' in raw) {
                // API returned paginated format: { count, next, previous, results }
                const paginated = raw as { count: number; results: Attendance[] }
                setAttendances(paginated.results)
                setTotalCount(paginated.count)
            } else {
                console.warn('[useAttendances] Unexpected response format:', raw)
                setAttendances([])
                setTotalCount(0)
            }
        } catch (err) {
            setError('Davomat ma\'lumotlarini yuklab bo\'lmadi')
            console.error('[useAttendances] Error fetching attendances:', err)
        } finally {
            setLoading(false)
        }
    }, [page, pageSize, search, filter])

    useEffect(() => {
        fetchAttendances()
    }, [fetchAttendances])

    const totalPages = Math.ceil(totalCount / pageSize)

    return {
        attendances,
        loading,
        error,
        page,
        totalPages,
        totalCount,
        setPage,
        refetch: fetchAttendances,
        search,
        setSearch,
        filter,
        setFilter,
    }
}
