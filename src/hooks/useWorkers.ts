import { useState, useEffect, useCallback } from 'react'
import { inspectionService } from '@/services/inspectionService'
import type { Worker } from '@/types/inspection'

interface UseWorkersReturn {
  workers: Worker[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useWorkers(): UseWorkersReturn {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await inspectionService.getWorkers()

      console.log('[useWorkers] API response:', response)

      if (Array.isArray(response)) {
        setWorkers(response)
      } else {
        console.warn('[useWorkers] Unexpected response format:', response)
        setWorkers([])
      }
    } catch (err) {
      setError('Ishchilar ro\'yxatini yuklab bo\'lmadi')
      console.error('[useWorkers] Error fetching workers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkers()
  }, [fetchWorkers])

  return {
    workers,
    loading,
    error,
    refetch: fetchWorkers,
  }
}
