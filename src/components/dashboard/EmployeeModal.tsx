import { useState, useEffect } from 'react'
import { Search, Download, Check, X, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import { useWorkers } from '@/hooks/useWorkers'
import type { V1Attendance } from '@/types/inspection'
import type { ModalType as DashboardModalType } from '@/types/dashboard'
import { toast } from 'sonner'
import { inspectionService } from '@/services/inspectionService'
import { getApiBaseUrl, getAbsoluteImageUrl } from '@/lib/api-base-url'
import { API_ENDPOINTS } from '@/api/constant/endpoints'

interface EmployeeModalProps {
  open: boolean
  onClose: () => void
  type: DashboardModalType
  attendances: V1Attendance[] // Fallback if API fails
  onWorkerClick?: (workerId: number) => void
}

const ITEMS_PER_PAGE = 50

const modalConfig: Record<
  NonNullable<DashboardModalType>,
  { title: string; subLabel: (count: number) => string; timeColor: string; subColor: string }
> = {
  'ichki-dokon': {
    title: "Ichki Do'kon Davomati",
    subLabel: (n) => `Ichki do'kondagilar davomati (${n} ta)`,
    timeColor: 'bg-orange-500 text-white',
    subColor: 'text-orange-500',
  },
  'tashqi-dokon': {
    title: "Tashqi Do'kon Davomati",
    subLabel: (n) => `Tashqi do'kondagilar davomati (${n} ta)`,
    timeColor: 'bg-green-600 text-white',
    subColor: 'text-green-600',
  },
  personallar: {
    title: 'Personallar Davomati',
    subLabel: (n) => `Personallar davomati (${n} ta)`,
    timeColor: 'bg-purple-600 text-white',
    subColor: 'text-purple-600',
  },
  buxgalterlar: {
    title: 'Buxgalterlar Davomati',
    subLabel: (n) => `Buxgalterlar davomati (${n} ta)`,
    timeColor: 'bg-blue-600 text-white',
    subColor: 'text-blue-600',
  },
  kelganlar: {
    title: 'Ishga Kelganlar',
    subLabel: (n) => `Vaqtida Kelganlar ${n}`,
    timeColor: 'bg-emerald-600 text-white',
    subColor: 'text-emerald-600',
  },
  kechikkanlar: {
    title: 'Ishga Kechikib Kelganlar',
    subLabel: (n) => `Kechikib Kelganlar ${n}`,
    timeColor: 'bg-amber-400 text-white',
    subColor: 'text-amber-500',
  },
  kelmaganlar: {
    title: 'Ishga Kelmaganlar',
    subLabel: (n) => `Ishga Kelmagan ${n}`,
    timeColor: 'bg-red-500 text-white',
    subColor: 'text-red-500',
  },
}

export default function EmployeeModal({ open, onClose, type, attendances, onWorkerClick }: EmployeeModalProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [apiAttendances, setApiAttendances] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const { workers } = useWorkers()
  const workerMap = new Map(workers.map((w) => [String(w.id), w]))

  useEffect(() => {
    if (!open || !type) return
    const fetchData = async () => {
      setLoading(true)
      try {
        if (type === 'kelmaganlar') {
          const res = await inspectionService.getAbsentAttendances({
            search: search || undefined,
            page,
            page_size: ITEMS_PER_PAGE
          })
          if (res) {
            const results = res.results || res;
            const mapped = results.map((worker: any) => ({
              id: worker.id,
              user: worker.id,
              ism: worker.full_name,
              rasm: worker.avatar || worker.photo,
              sana: new Date().toISOString().split('T')[0],
              kelgan_vaqt: null,
              turi_kirish: "Kelmagan",
              status_kirish: false,
              is_late: false,
              ketgan_vaqt: null,
              turi_chiqish: null,
              status_chiqish: null,
              umumiy_soat: null,
            }))
            setApiAttendances(mapped)
            setTotalCount(res.count || (Array.isArray(res) ? res.length : 0))
          }
          return
        }

        if (type === 'kelganlar') {
          const res = await inspectionService.getPresentAttendances({
            search: search || undefined,
            page,
            page_size: ITEMS_PER_PAGE
          })
          if (res) {
            const results = res.results || res;
            const mapped = results.map((att: any) => ({
              id: att.id,
              user: att.user?.id || att.worker?.id || att.worker,
              ism: att.user?.full_name || att.worker?.full_name || att.ism,
              rasm: att.user?.avatar || att.user?.photo || att.worker?.photo || att.rasm,
              sana: att.created_at ? att.created_at.split('T')[0] : (att.date || ''),
              kelgan_vaqt: att.created_at || att.check_in_time,
              turi_kirish: att.is_late ? "Kechikkan" : "Ishda",
              status_kirish: att.is_success ?? att.check_in_success,
              is_late: att.is_late,
              ketgan_vaqt: att.check_out_time,
              turi_chiqish: att.check_out_time ? "Ketgan" : null,
              status_chiqish: att.check_out_success,
              umumiy_soat: att.total_hours,
            }))
            setApiAttendances(mapped)
            setTotalCount(res.count || (Array.isArray(res) ? res.length : 0))
          }
          return
        }

        if (type === 'kechikkanlar') {
          const res = await inspectionService.getLateAttendances({
            search: search || undefined,
            page,
            page_size: ITEMS_PER_PAGE
          })
          if (res) {
            const results = res.results || res;
            const mapped = results.map((att: any) => ({
              id: att.id,
              user: att.user?.id || att.worker?.id || att.worker,
              ism: att.user?.full_name || att.worker?.full_name || att.ism,
              rasm: att.user?.avatar || att.user?.photo || att.worker?.photo || att.rasm,
              sana: att.created_at ? att.created_at.split('T')[0] : (att.date || ''),
              kelgan_vaqt: att.created_at || att.check_in_time,
              turi_kirish: "Kechikkan",
              status_kirish: att.is_success ?? att.check_in_success,
              is_late: true,
              ketgan_vaqt: att.check_out_time,
              turi_chiqish: att.check_out_time ? "Ketgan" : null,
              status_chiqish: att.check_out_success,
              umumiy_soat: att.total_hours,
            }))
            setApiAttendances(mapped)
            setTotalCount(res.count || (Array.isArray(res) ? res.length : 0))
          }
          return
        }

        let localList = attendances;
        if (search) {
             const s = search.toLowerCase();
             localList = localList.filter(a => {
                 const name = (a.ism || (a as any).worker_name || (a as any).full_name || (typeof a.user === 'object' ? (a.user as any)?.full_name : '') || '').toLowerCase();
                 const phone = ((a as any).telefon || (a as any).phone || (a as any).user_phone || (typeof a.user === 'object' ? (a.user as any)?.phone : '') || '').toLowerCase();
                 return name.includes(s) || phone.includes(s);
             });
        }
        setTotalCount(localList.length)
        setApiAttendances(localList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE))
      } catch (err) {
        console.error("EmployeeModal fetch error:", err)
        setApiAttendances(attendances)
        setTotalCount(attendances.length)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [open, type, page, search, attendances])

  if (!type) return null
  const cfg = modalConfig[type]

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  const paginated = apiAttendances as V1Attendance[]

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleExcelExport = async () => {
    const exportId = toast.loading("Excel fayli tayyorlanmoqda...")
    try {
      let status: 'all' | 'present' | 'late' | 'absent' = 'all'
      if (type === 'kelganlar') status = 'present'
      else if (type === 'kechikkanlar') status = 'late'
      else if (type === 'kelmaganlar') status = 'absent'

      let branch: string | undefined
      if (type === 'ichki-dokon') branch = 'Ichki dokon'
      if (type === 'tashqi-dokon') branch = 'Tashqi dokon'
      if (type === 'personallar') branch = 'Personallar'
      if (type === 'buxgalterlar') branch = 'Buxgalter'

      const res: any = await inspectionService.exportAttendances({
        branch,
        search: search || undefined,
        status,
      })

      toast.dismiss(exportId)
      if (res && res.download_link) {
        window.open(res.download_link, '_blank')
        toast.success("Excel muvaffaqiyatli yuklab olindi!")
      } else {
        const queryParams = new URLSearchParams()
        if (branch) queryParams.append('branch', branch)
        if (search) queryParams.append('search', search)
        if (status) queryParams.append('status', status)
        
        const exportUrl = `${getApiBaseUrl()}${API_ENDPOINTS.EXPORT_ATTENDANCES}?${queryParams.toString()}`
        window.open(exportUrl, '_blank')
        toast.success("Excel yuklab olish boshlandi")
      }
    } catch (err) {
      toast.dismiss(exportId)
      toast.error("Excel yuklab olishda xatolik yuz berdi")
      console.error(err)
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === 'null') return '-'
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
      return timeString.substring(0, 5)
    }
    try {
      const date = new Date(timeString)
      if (isNaN(date.getTime())) return timeString
      return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return timeString
    }
  }

  const formatDate = (timeString: string) => {
    if (!timeString || timeString === 'null') return '-'
    try {
      const date = new Date(timeString)
      if (isNaN(date.getTime())) return timeString
      return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return timeString
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[1020px] min-w-[1020px] max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>{cfg.title}</DialogTitle>
          <DialogDescription className={`font-semibold text-sm ${cfg.subColor}`}>
            {cfg.subLabel(totalCount)}
          </DialogDescription>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <Input
              placeholder="Qidirish"
              className="pl-8 h-8 text-xs"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5 text-xs h-8 cursor-pointer"
            onClick={handleExcelExport}
          >
            <Download size={13} />
            Excel Yuklash
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 min-h-0">
          <table className="w-full table-fixed text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-100 h-12">
                <th className="w-[8%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Rasm</th>
                <th className="w-[11%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Ism</th>
                <th className="w-[12%] text-center py-2 pr-4 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Telefon</th>
                <th className="w-[9%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Sana</th>
                <th className="w-[9%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Kelgan vaqt</th>
                <th className="w-[8%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Turi</th>
                <th className="w-[7%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Status</th>
                <th className="w-[9%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Ketgan vaqt</th>
                <th className="w-[8%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Turi</th>
                <th className="w-[7%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Status</th>
                <th className="w-[12%] text-center py-2 px-2 text-xs font-semibold text-gray-400 whitespace-nowrap align-middle">Umumiy soat</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center">
                    <Loader2 className="animate-spin text-blue-500 mx-auto" size={24} />
                    <p className="text-xs text-gray-400 mt-2">Yuklanmoqda...</p>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-xs text-gray-400">
                    Ma'lumotlar topilmadi
                  </td>
                </tr>
              ) : (
                paginated.map((a, idx) => {
                  const avatarUrl = getAbsoluteImageUrl(a.rasm)

                  // User object to get phone if needed, though V1 API may not return phone. We can fallback to workerMap
                  const worker = workerMap.get(String(a.user))

                  return (
                    <tr
                      key={a.id || idx}
                      onClick={() => {
                        const userObj = a.user || a.worker || a;
                        const userId = typeof userObj === 'object' && userObj !== null ? userObj.id || userObj.user_id || userObj.worker_id : userObj;
                        let finalId = userId || a.user_id || a.worker_id;
                        
                        // Fallback by name if ID is completely missing
                        if (!finalId && a.ism) {
                          const matchedWorker = workers.find(w => w.full_name === a.ism);
                          if (matchedWorker) finalId = matchedWorker.id;
                        }

                        if (finalId && onWorkerClick) onWorkerClick(Number(finalId));
                      }}
                      className="border-b border-gray-50 h-12 hover:bg-[#e3f2fd] transition-colors cursor-pointer"
                    >
                      <td className="py-1.5 px-2 text-center align-middle">
                        <div className="flex justify-center items-center">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={a.ism}
                              className="w-7 h-7 rounded-full object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                              {(a.ism || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-center align-middle">
                        <span className="font-semibold text-gray-800 text-[12px] truncate block max-w-[90px] mx-auto" title={a.ism || `User #${a.user}`}>
                          {a.ism || `User #${a.user}`}
                        </span>
                      </td>
                      <td className="py-1.5 pr-4 text-gray-500 text-[11px] text-center align-middle">
                        {worker?.phone || '-'}
                      </td>
                      <td className="py-1.5 px-2 text-gray-500 text-[11px] text-center align-middle">
                        {formatDate(a.sana)}
                      </td>
                      <td className="py-1.5 px-2 text-gray-500 text-[11px] text-center align-middle">
                        {a.kelgan_vaqt ? formatTime(a.kelgan_vaqt) : '-'}
                      </td>
                      <td className="py-1.5 px-2 text-[11px] text-center align-middle">
                        <div className="flex justify-center items-center">
                          {a.is_late || a.turi_kirish?.toLowerCase() === 'kechikkan' ? (
                              <span className="px-1.5 py-0.5 rounded-full font-medium bg-orange-50 text-orange-700 border border-orange-100 text-[10px]">
                                Kechikkan
                              </span>
                          ) : a.turi_kirish ? (
                            a.turi_kirish.toLowerCase() === 'kelmagan' ? (
                              <span className="px-1.5 py-0.5 rounded-full font-medium bg-red-50 text-red-700 border border-red-100 text-[10px]">
                                Kelmagan
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-full font-medium bg-green-50 text-green-700 border border-green-100 text-[10px]">
                                {a.turi_kirish}
                              </span>
                            )
                          ) : a.status_kirish === false ? (
                            <span className="px-1.5 py-0.5 rounded-full font-medium bg-red-50 text-red-700 border border-red-100 text-[10px]">
                              Kelmagan
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-center align-middle">
                        <div className="flex justify-center items-center">
                          {a.kelgan_vaqt ? (
                            a.status_kirish ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                                <Check size={12} className="stroke-[3]" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">
                                <X size={12} className="stroke-[3]" />
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-gray-500 text-[11px] text-center align-middle">
                        {a.ketgan_vaqt ? formatTime(a.ketgan_vaqt) : '-'}
                      </td>
                      <td className="py-1.5 px-2 text-[11px] text-center align-middle">
                        <div className="flex justify-center items-center">
                          {a.turi_chiqish ? (
                            <span className="px-1.5 py-0.5 rounded-full font-medium bg-gray-50 text-gray-600 border border-gray-100 text-[10px]">
                              {a.turi_chiqish}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-center align-middle">
                        <div className="flex justify-center items-center">
                          {a.ketgan_vaqt ? (
                            a.status_chiqish ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                                <Check size={12} className="stroke-[3]" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600">
                                <X size={12} className="stroke-[3]" />
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-[11px] text-gray-700 font-semibold text-center align-middle">
                        {a.umumiy_soat || '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </DialogContent>
    </Dialog>
  )
}
