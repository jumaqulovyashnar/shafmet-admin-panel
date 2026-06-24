import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AddEmployeeModalProps {
  open: boolean
  onClose: () => void
  defaultLocation?: string
}

const locations = ['Ichki dokon', 'Tashqi dokon', 'Personallar', 'Buxgalter']

export default function AddEmployeeModal({ open, onClose, defaultLocation }: AddEmployeeModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: defaultLocation ?? 'Ichki dokon',
    password: '',
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleCreate = () => {
    onClose()
    setForm({ name: '', phone: '', location: defaultLocation ?? 'Ichki dokon', password: '' })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Yangi Hodim{' '}
            <span className="text-[#64b5f6]">Qo'shish</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Ism */}
          <div>
            <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">Ism Familiyasi</label>
            <Input
              placeholder="Ism familiyasi..."
              className="h-11 text-[13px] rounded-xl border-gray-200"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">Telefon Raqami</label>
            <Input
              placeholder="+998000000..."
              className="h-11 text-[13px] rounded-xl border-gray-200"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>

          {/* Lavozim */}
          <div>
            <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">Lavozimi</label>
            <div className="relative">
              <select
                className="w-full h-11 border border-gray-200 rounded-xl px-3 text-[13px] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#64b5f6] text-gray-700"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
              >
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
            </div>
          </div>

          {/* Parol */}
          <div>
            <label className="text-[12px] text-gray-500 mb-1.5 block font-medium">Parol Qoying</label>
            <Input
              placeholder="55362699155"
              type="password"
              className="h-11 text-[13px] rounded-xl border-gray-200"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleCreate}
              className="bg-[#64b5f6] hover:bg-[#42a5f5] h-10 px-8 rounded-xl text-[13px] font-semibold"
            >
              Yaratish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
