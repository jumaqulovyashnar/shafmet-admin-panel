import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { inspectionService } from '@/services/inspectionService'

// ---------- Types ----------
interface AddEmployeeModalProps {
  open: boolean
  onClose: () => void
  defaultLocation?: string
  defaultDepartmentId?: number
}

// Note: Departments are fetched from the API now instead of hardcoding.

const INITIAL_FORM = {
  name: '',
  phone: '',
  password: '',
  departmentId: 1,
}

// ---------- Component ----------
export default function AddEmployeeModal({ open, onClose, defaultLocation, defaultDepartmentId }: AddEmployeeModalProps) {
  // Photo state — keep both the File (for upload) and preview URL (for display)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [submitting, setSubmitting] = useState(false)

  const [departments, setDepartments] = useState<any[]>([])
  
  const [form, setForm] = useState(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)

  // Resolve default department ID from label if departments are loaded
  const defaultDeptId = departments.find((d) => d.name === defaultLocation)?.id ?? form?.departmentId ?? 1

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }))

  // Load departments from API (re-fetch every time modal opens)
  useEffect(() => {
    if (open) {
      inspectionService.getLavozimlar().then((data) => {
        setDepartments(data)
      }).catch(err => console.error("Error loading lavozimlar:", err))
    }
  }, [open])

  // Sync default location when modal opens or departments load
  useEffect(() => {
    if (open && departments.length > 0) {
      // 1-prioritet: aniq department ID berilgan bo'lsa — uni ishlatish
      if (defaultDepartmentId) {
        const found = departments.find((d) => d.id === defaultDepartmentId)
        if (found) {
          setForm(f => ({ ...f, departmentId: found.id }))
          return
        }
      }
      // 2-prioritet: defaultLocation (string label) bo'yicha topish
      if (defaultLocation) {
        const foundDept = departments.find((d) => d.name === defaultLocation)
        if (foundDept) {
          setForm(f => ({ ...f, departmentId: foundDept.id }))
          return
        }
      }
      // 3-prioritet: birinchi department ni tanlash
      setForm(f => ({ ...f, departmentId: departments[0].id }))
    }
  }, [open, defaultLocation, defaultDepartmentId, departments])

  // ---- Photo handling ----
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Store the raw File for multipart upload
    setPhotoFile(file)

    // Generate preview URL for display
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  // ---- Reset form state ----
  const resetForm = () => {
    setForm({ ...INITIAL_FORM, departmentId: defaultDeptId })
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  // ---- Submit handler ----
  const handleCreate = async () => {
    // Validation
    if (!form.name.trim()) {
      toast.error("Ism familiyasini kiriting")
      return
    }
    if (!form.phone.trim()) {
      toast.error("Telefon raqamini kiriting")
      return
    }
    if (!form.password.trim()) {
      toast.error("Parolni kiriting")
      return
    }
    if (!photoFile) {
      toast.error("Yuz rasmini yuklang — bu majburiy")
      return
    }

    setSubmitting(true)
    const loadId = toast.loading("Xodim yaratilmoqda...")

    try {
      await inspectionService.createWorkerWithPhoto({
        full_name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
        photo: photoFile,
        department: form.departmentId,
      })

      toast.dismiss(loadId)
      toast.success("Xodim muvaffaqiyatli yaratildi!")
      resetForm()
      onClose()
    } catch (err: any) {
      toast.dismiss(loadId)
      const msg = err?.message || "Xodim yaratishda xatolik yuz berdi"
      toast.error(msg)
      console.error('[AddEmployeeModal] create error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Render ----
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        {/* Top gradient strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#42a5f5] via-[#64b5f6] to-[#90caf9]" />

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Yangi Xodim{' '}
              <span className="text-[#64b5f6]">Qo'shish</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-0.5">
              Xodimning yuz rasmi, telefon raqami va parolini kiriting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-5">
            {/* ---- Photo Upload ---- */}
            <div className="flex flex-col items-center justify-center pb-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoChange}
              />
              <div
                onClick={triggerFileInput}
                className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 hover:border-[#64b5f6] bg-gray-50 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group"
                title="Yuz rasmi yuklash"
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={18} />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="text-gray-400 group-hover:text-[#64b5f6] transition-colors" size={20} />
                    <span className="text-[10px] text-gray-400 mt-1 font-medium group-hover:text-[#64b5f6] transition-colors">
                      Yuklash
                    </span>
                  </>
                )}
              </div>
              {photoFile && (
                <p className="text-[11px] text-green-600 mt-1.5 font-medium">
                  ✓ {photoFile.name}
                </p>
              )}
            </div>

            {/* ---- Full Name ---- */}
            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">
                Ism Familiyasi *
              </label>
              <Input
                placeholder="Ism familiyasi..."
                className="h-11 text-[13px] rounded-xl border-gray-200"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>

            {/* ---- Phone ---- */}
            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">
                Telefon Raqami *
              </label>
              <Input
                placeholder="+998901234567"
                className="h-11 text-[13px] rounded-xl border-gray-200"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>



            {/* ---- Department select ---- */}
            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">
                Bo'limi (Department) *
              </label>
              <div className="relative">
                <select
                  className="w-full h-11 border border-gray-200 rounded-xl px-3 text-[13px] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#64b5f6] text-gray-700"
                  value={form.departmentId}
                  onChange={(e) => set('departmentId', parseInt(e.target.value))}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ▾
                </span>
              </div>
            </div>

            {/* ---- Password ---- */}
            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">
                Parol *
              </label>
              <div className="relative">
                <Input
                  placeholder="Parol yozing..."
                  type={showPassword ? "text" : "password"}
                  className="h-11 text-[13px] rounded-xl border-gray-200 pr-10"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ---- Submit ---- */}
            <div className="flex justify-end pt-6 pb-2">
              <Button
                onClick={handleCreate}
                disabled={submitting}
                className="h-10 px-8 gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? 'Yaratilmoqda...' : 'Yaratish'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
