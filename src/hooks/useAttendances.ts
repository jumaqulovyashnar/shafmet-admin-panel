import { useState, useEffect, useCallback } from 'react'
import { inspectionService } from '@/services/inspectionService'
import type { V1Attendance } from '@/types/inspection'

interface UseAttendancesReturn {
    attendances: V1Attendance[]
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
    const [attendances, setAttendances] = useState<V1Attendance[]>([])
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
            // Admin panel — barcha xodimlarning davomatlarini olish
            // Yangi /api/v1/attendance/all_list/ endpoint orqali
            const res = await inspectionService.getAllListAttendances({
                page,
                page_size: pageSize,
                search: search || undefined,
            })

            if (res && res.results && Array.isArray(res.results)) {
                setAttendances(res.results)
                setTotalCount(res.count)
            } else if (Array.isArray(res)) {
                setAttendances(res)
                setTotalCount(res.length)
            } else {
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
