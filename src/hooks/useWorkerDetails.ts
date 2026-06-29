import { useState, useCallback } from 'react'
import { inspectionService } from '@/services/inspectionService'
import type { Worker } from '@/types/inspection'

interface UseWorkerDetailsReturn {
  worker: Worker | null
  loading: boolean
  error: string | null
  getWorker: (id: number) => Promise<Worker>
  updateWorker: (id: number, data: Partial<Worker>) => Promise<Worker>
  deleteWorker: (id: number) => Promise<void>
}

export function useWorkerDetails(): UseWorkerDetailsReturn {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWorker = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await inspectionService.getWorkerById(id)
      setWorker(data)
      return data
    } catch (err) {
      setError("Ishchi ma'lumotlarini yuklab bo'lmadi")
      console.error('[useWorkerDetails] Error fetching worker:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateWorker = useCallback(async (id: number, data: Partial<Worker>) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await inspectionService.updateWorker(id, data)
      setWorker(updated)
      return updated
    } catch (err) {
      setError("Ishchi ma'lumotlarini yangilab bo'lmadi")
      console.error('[useWorkerDetails] Error updating worker:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteWorker = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await inspectionService.deleteWorker(id)
      setWorker(null)
    } catch (err) {
      setError("Ishchini o'chirib bo'lmadi")
      console.error('[useWorkerDetails] Error deleting worker:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    worker,
    loading,
    error,
    getWorker,
    updateWorker,
    deleteWorker,
  }
}
