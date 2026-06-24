import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TaskAssignModalProps {
  open: boolean
  onClose: () => void
  employeeName?: string   // undefined => Umumiy
}

const categories = ['Tozalash', 'Yetkazib berish', 'Hisobot', 'Xizmat', 'Boshqa']

export default function TaskAssignModal({ open, onClose, employeeName }: TaskAssignModalProps) {
  const isUmumiy = !employeeName
  const [form, setForm] = useState({
    title: '', description: '', category: '',
    time: '', bonus: '', general: '', permanent: false,
  })

  const set = (key: string, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    onClose()
    setForm({ title: '', description: '', category: '', time: '', bonus: '', general: '', permanent: false })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Topshiriq Berish{' '}
            <span className="text-[#64b5f6]">
              {isUmumiy ? 'Umumiy' : 'Hodimga'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          {/* Sarlavha */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Topshiriq Sarlavhasi</label>
            <Input
              placeholder="Kocha Tashlash..."
              className="h-9 text-sm"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          {/* Mazmun */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Topshiriq Mazmuni</label>
            <Input
              placeholder="Yon tomonidagi kocha"
              className="h-9 text-sm"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* Kategoriya */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Kategoriya</label>
            <div className="relative">
              <select
                className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                <option value="">Tanlash</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
            </div>
          </div>

          {/* Vaqt + Bonus */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Vaqti</label>
              <Input
                placeholder="8:00-9:00"
                className="h-9 text-sm"
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Bonus</label>
              <Input
                placeholder="10 000 so'm"
                className="h-9 text-sm"
                value={form.bonus}
                onChange={(e) => set('bonus', e.target.value)}
              />
            </div>
          </div>

          {/* Umumiy mazmun */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Umumiy Mazmuni</label>
            <textarea
              placeholder="Add some description of the event."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.general}
              onChange={(e) => set('general', e.target.value)}
            />
          </div>

          {/* Doimiy vazifa toggle */}
          <div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3">
            <span className="text-sm text-gray-700 font-medium">Doimiy Vazifa Qilish</span>
            <button
              type="button"
              onClick={() => set('permanent', !form.permanent)}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.permanent ? 'bg-blue-500' : 'bg-gray-300'
                }`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.permanent ? 'left-5' : 'left-0.5'
                }`} />
            </button>
          </div>

          <Button onClick={handleSubmit} className="w-full h-10 bg-blue-600 hover:bg-blue-700">
            Yuborish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
