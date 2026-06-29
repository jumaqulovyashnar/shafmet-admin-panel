import { useState, useEffect } from 'react'
import { inspectionService } from '@/services/inspectionService'
import { toast } from 'sonner'

export interface Lavozim {
  id: number
  name: string
  slug: string
  code?: string
  description?: string
}

export function useLavozimlar() {
  const [lavozimlar, setLavozimlar] = useState<Lavozim[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLavozimlar = async () => {
    try {
      setLoading(true)
      const data = await inspectionService.getLavozimlar()
      setLavozimlar(data)
    } catch (err) {
      console.error('Failed to fetch lavozimlar', err)
      toast.error("Bo'limlarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLavozimlar()
  }, [])

  return { lavozimlar, loading, refetch: fetchLavozimlar }
}
