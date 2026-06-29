import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import authService from '@/services/authService'
import { Camera, Loader2 } from 'lucide-react'
import { getAbsoluteImageUrl } from '@/lib/api-base-url'

interface MyProfileModalProps {
  open: boolean
  onClose: () => void
}

export default function MyProfileModal({ open, onClose }: MyProfileModalProps) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setLoading(true)
      authService.getProfile()
        .then((data) => {
          setProfile(data)
          setForm({ full_name: data.full_name || '' })
          setPhotoPreview(getAbsoluteImageUrl(data.avatar))
          setPhotoFile(null)
        })
        .catch(err => {
          console.error(err)
          toast.error("Profilni yuklashda xatolik")
        })
        .finally(() => setLoading(false))
    }
  }, [open])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  const handleSave = async () => {
    setSaving(true)
    const loadId = toast.loading("Saqlanmoqda...")
    try {
      const formData = new FormData()
      formData.append('full_name', form.full_name)
      if (photoFile) {
        formData.append('avatar', photoFile)
      }

      await authService.updateProfile(formData)
      toast.dismiss(loadId)
      toast.success("Profil yangilandi!")
      onClose()
    } catch (err) {
      toast.dismiss(loadId)
      toast.error("Xatolik yuz berdi")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle>Mening Profilim</DialogTitle>
          <DialogDescription>Shaxsiy ma'lumotlaringizni tahrirlash</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#64b5f6] mb-2" size={24} />
            <p className="text-sm text-gray-500">Yuklanmoqda...</p>
          </div>
        ) : (
          <div className="space-y-5 mt-4">
            <div className="flex flex-col items-center pb-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoChange}
              />
              <div
                onClick={triggerFileInput}
                className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-[#64b5f6] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={20} />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="text-gray-400 group-hover:text-[#64b5f6]" size={24} />
                    <span className="text-[10px] text-gray-400 mt-1">Rasm yuklash</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Ism Familiya</label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="h-10 text-sm rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Telefon</label>
                <div className="text-sm text-gray-800 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {profile?.phone || '-'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Rol</label>
                <div className="text-sm text-gray-800 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100 uppercase">
                  {profile?.role || '-'}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#64b5f6] hover:bg-[#42a5f5] text-white rounded-xl h-10 px-8"
              >
                {saving && <Loader2 size={16} className="animate-spin mr-2" />}
                Saqlash
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
