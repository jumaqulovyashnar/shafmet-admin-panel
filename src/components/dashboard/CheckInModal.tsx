import { useState, useRef } from 'react'
import { Camera, MapPin, Check, X, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { inspectionService } from '@/services/inspectionService'
import type { CheckInRequest } from '@/types/inspection'

interface CheckInModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CheckInModal({ open, onClose, onSuccess }: CheckInModalProps) {
  const [attendanceType, setAttendanceType] = useState<'in' | 'out'>('in')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
          toast.success('Joylashuv muvaffaqiyatli olindi')
        },
        (error) => {
          toast.error('Joylashuvni olishda xatolik yuz berdi')
          console.error('Geolocation error:', error)
        }
      )
    } else {
      toast.error('Brauzeringiz geolocationni qo\'llab-quvvatlamaydi')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!photo) {
      toast.error('Iltimos, rasm yuklang')
      return
    }

    if (!latitude || !longitude) {
      toast.error('Iltimos, GPS joylashuvni oling')
      return
    }

    const data: CheckInRequest = {
      photo,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      attendance_type: attendanceType === 'in' ? 'In' : 'Out',
    }

    setLoading(true)
    try {
      const response = await inspectionService.checkIn(data)
      
      if (response.success) {
        toast.success(response.message || 'Davomat muvaffaqiyatli qayd etildi')
        onSuccess?.()
        onClose()
        // Reset form
        setPhoto(null)
        setPhotoPreview(null)
        setLatitude('')
        setLongitude('')
      } else {
        toast.error(response.message || 'Davomatni qayd etib bo\'lmadi')
      }
    } catch (error) {
      toast.error('Xatolik yuz berdi. Qaytadan urinib ko\'ring')
      console.error('Check-in error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      // Reset form
      setPhoto(null)
      setPhotoPreview(null)
      setLatitude('')
      setLongitude('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {attendanceType === 'in' ? 'Ishga Kirish' : 'Ishdan Chiqish'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Attendance Type Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={attendanceType === 'in' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setAttendanceType('in')}
            >
              Kirish
            </Button>
            <Button
              type="button"
              variant={attendanceType === 'out' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setAttendanceType('out')}
            >
              Chiqish
            </Button>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Yuz Rasmi</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPhoto(null)
                      setPhotoPreview(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div>
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Rasm yuklash uchun bosing</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Rasm Tanlash
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* GPS Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">GPS Joylashuv</label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                placeholder="Kenglik (Latitude)"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                step="any"
                placeholder="Uzunlik (Longitude)"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGetLocation}
                title="Joylashuvni olish"
              >
                <MapPin size={20} />
              </Button>
            </div>
          </div>

          {/* Verification Status Display */}
          {latitude && longitude && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check size={16} />
              <span>GPS joylashuv tasdiqlandi</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {attendanceType === 'in' ? 'Kirishni Tasdiqlash' : 'Chiqishni Tasdiqlash'}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
