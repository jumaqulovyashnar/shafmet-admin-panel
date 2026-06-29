import { useState, useEffect } from 'react'
import {
  Clock,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Calendar,
  Building2,
  User,
  X,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { inspectionService } from '@/services/inspectionService'
import { useLavozimlar } from '@/hooks/useLavozimlar'

// ---------- Types ----------
interface DepartmentDetail {
  id: number
  name: string
  code: string
}

interface Schedule {
  id: number
  departments: number[]
  departments_details: DepartmentDetail[]
  start_time: string
  end_time: string
  created_by: number
  created_by_name: string
  created_at: string
}

// ---------- Helpers ----------
function formatTime(raw: string): string {
  if (!raw) return '—'
  return raw.slice(0, 5)
}

function formatDate(raw: string): string {
  if (!raw) return '—'
  const d = new Date(raw)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

// ---------- Component ----------
export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const { lavozimlar } = useLavozimlar() // Fetch actual departments

  const [modalOpen, setModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const [form, setForm] = useState<{
    departments: number[],
    start_time: string,
    end_time: string
  }>({
    departments: [],
    start_time: '',
    end_time: '',
  })
  const [submitting, setSubmitting] = useState(false)

  // ---- Data fetch ----
  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const data = await inspectionService.getSchedules()
      setSchedules(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Jadvallar ro'yxatini yuklashda xatolik")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSchedules() }, [])

  // ---- Modal helpers ----
  const openCreateModal = () => {
    setEditingSchedule(null)
    setForm({ departments: [], start_time: '', end_time: '' })
    setModalOpen(true)
  }

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setForm({
      departments: schedule.departments || [],
      start_time: schedule.start_time?.slice(0, 5) || '',
      end_time: schedule.end_time?.slice(0, 5) || '',
    })
    setModalOpen(true)
  }

  // ---- Submit ----
  const handleSubmit = async () => {
    if (!form.start_time || !form.end_time) {
      toast.error('Ish boshlanish va tugash vaqtini kiriting')
      return
    }

    const payload = {
      departments: form.departments,
      start_time: form.start_time.length === 5 ? form.start_time + ':00' : form.start_time,
      end_time: form.end_time.length === 5 ? form.end_time + ':00' : form.end_time,
    }

    setSubmitting(true)
    try {
      if (editingSchedule) {
        await inspectionService.updateSchedulePut(editingSchedule.id, payload)
        toast.success("Jadval muvaffaqiyatli yangilandi")
      } else {
        await inspectionService.createSchedule(payload)
        toast.success("Yangi ish jadvali yaratildi")
      }
      setModalOpen(false)
      fetchSchedules()
    } catch {
      toast.error('Saqlashda xatolik yuz berdi')
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Delete ----
  const handleDelete = async (id: number) => {
    try {
      await inspectionService.deleteSchedule(id)
      toast.success("Jadval o'chirildi")
      setDeleteConfirmId(null)
      fetchSchedules()
    } catch {
      toast.error("O'chirishda xatolik")
    }
  }

  // ---- Render ----
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center">
            <Clock size={20} className="text-[#1976d2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ish Vaqti Jadvallari</h1>
            <p className="text-xs text-[#64b5f6]">
              Jami {schedules.length} ta jadval
            </p>
          </div>
        </div>

        <Button onClick={openCreateModal} className="gap-2 rounded-xl text-sm font-semibold px-5">
          <Plus size={16} />
          Yangi Jadval
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#42a5f5]" />
        </div>
      )}

      {/* Empty state */}
      {!loading && schedules.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Calendar size={48} className="mb-4 text-gray-300" />
          <p className="text-sm font-medium">Hozircha jadvallar yo'q</p>
          <p className="text-xs mt-1">Yangi ish vaqti jadvalini yarating</p>
        </div>
      )}

      {/* Schedule Cards Grid */}
      {!loading && schedules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              {/* Card header strip */}
              <div className="h-1.5 bg-[#42a5f5]" />

              <div className="p-5">
                {/* Time display */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#e3f2fd] flex items-center justify-center">
                    <Clock size={20} className="text-[#1976d2]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Ish Vaqti</p>
                    <p className="text-lg font-bold text-gray-900 tracking-tight">
                      {formatTime(schedule.start_time)}
                      <span className="text-gray-300 mx-1.5">—</span>
                      {formatTime(schedule.end_time)}
                    </p>
                  </div>
                </div>

                {/* Departments pills */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Building2 size={13} className="text-gray-400" />
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      Bo'limlar
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {schedule.departments_details && schedule.departments_details.length > 0 ? (
                      schedule.departments_details.map((dept) => (
                        <span
                          key={dept.id}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#e3f2fd] text-[#1976d2] text-[11px] font-semibold border border-[#bbdefb]"
                        >
                          {dept.name}
                        </span>
                      ))
                    ) : schedule.departments && schedule.departments.length > 0 ? (
                      schedule.departments.map((deptId) => (
                        <span
                          key={deptId}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-[11px] font-semibold border border-gray-100"
                        >
                          Bo'lim #{deptId}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-300 italic">
                        Bo'lim belgilanmagan
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    {schedule.created_by_name && (
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-gray-300" />
                        <span className="text-[11px] text-gray-400">
                          {schedule.created_by_name}
                        </span>
                      </div>
                    )}
                    {schedule.created_at && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-300" />
                        <span className="text-[11px] text-gray-400">
                          {formatDate(schedule.created_at)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => openEditModal(schedule)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#1976d2] hover:bg-[#e3f2fd] transition-colors cursor-pointer"
                      title="Tahrirlash"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(schedule.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== Delete Confirmation Dialog ===== */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl p-0 overflow-hidden">
          <div className="h-1 bg-red-500" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900">
                Jadvalni o'chirish
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Bu amalni qaytarib bo'lmaydi. Ish vaqti jadvalini o'chirishni tasdiqlaysizmi?
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl text-sm"
              >
                Bekor qilish
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                className="rounded-xl text-sm gap-1.5"
              >
                <Trash2 size={14} />
                O'chirish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Create / Edit Dialog ===== */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 overflow-hidden">
          <div className="h-1.5 bg-[#42a5f5]" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] flex items-center justify-center">
                  <Clock size={16} className="text-[#1976d2]" />
                </div>
                {editingSchedule ? 'Jadvalni Tahrirlash' : 'Yangi Jadval Yaratish'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                {editingSchedule
                  ? "Ish vaqti jadvalini tahrirlang va saqlang"
                  : "Bo'limlar va ish vaqtlarini kiritib yangi jadval yarating"}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              {/* Department IDs */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Building2 size={13} className="text-gray-400" />
                  Biriktiriladigan Bo'limlar
                </label>
                <div className="flex flex-col gap-2 mt-2 max-h-48 overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                  {lavozimlar.map(lavozim => (
                    <label key={lavozim.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-[#1976d2] focus:ring-[#1976d2] border-gray-300 cursor-pointer"
                        checked={form.departments.includes(lavozim.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, departments: [...form.departments, lavozim.id] })
                          } else {
                            setForm({ ...form, departments: form.departments.filter(id => id !== lavozim.id) })
                          }
                        }}
                      />
                      <span className="text-[13px] font-medium text-gray-700">{lavozim.name}</span>
                    </label>
                  ))}
                  {lavozimlar.length === 0 && (
                    <span className="text-[12px] text-gray-400 italic">Bo'limlar topilmadi</span>
                  )}
                </div>
              </div>

              {/* Time inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Clock size={13} className="text-green-500" />
                    Boshlanish vaqti
                  </label>
                  <Input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="rounded-xl border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Clock size={13} className="text-red-500" />
                    Tugash vaqti
                  </label>
                  <Input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="rounded-xl border-gray-200 text-sm"
                  />
                </div>
              </div>

              {/* Preview */}
              {form.start_time && form.end_time && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#e3f2fd] border border-[#bbdefb]">
                  <Clock size={16} className="text-[#1976d2]" />
                  <span className="text-sm font-bold text-[#1976d2]">
                    {form.start_time} — {form.end_time}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="rounded-xl text-sm gap-1.5"
              >
                <X size={14} />
                Bekor qilish
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl text-sm gap-1.5"
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                {editingSchedule ? 'Saqlash' : 'Yaratish'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
