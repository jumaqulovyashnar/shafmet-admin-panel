import { useState } from 'react'
import { Search, Download, Check, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import type { Attendance } from '@/types/inspection'
import type { ModalType as DashboardModalType } from '@/types/dashboard'

interface EmployeeModalProps {
  open: boolean
  onClose: () => void
  type: DashboardModalType
  attendances: Attendance[]
}

const ITEMS_PER_PAGE = 50

const modalConfig: Record<
  NonNullable<DashboardModalType>,
  { title: string; subLabel: (count: number) => string; timeColor: string; subColor: string }
> = {
  'ichki-dokon': {
    title: 'Barcha Davomatlar',
    subLabel: (n) => `umumiy davomatlar (${n} ta)`,
    timeColor: 'bg-blue-600 text-white',
    subColor: 'text-blue-600',
  },
  kelganlar: {
    title: 'Ishga Kelganlar',
    subLabel: (n) => `Vaqtida Kelganlar ${n}`,
    timeColor: 'bg-blue-600 text-white',
    subColor: 'text-blue-600',
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

export default function EmployeeModal({ open, onClose, type, attendances }: EmployeeModalProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  if (!type) return null
  const cfg = modalConfig[type]

  const filtered = attendances.filter((a) =>
    a.user_full_name?.toLowerCase().includes(search.toLowerCase()) || 
    a.user_phone?.includes(search)
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return timeString
    }
  }

  const formatDate = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return date.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
    } catch {
      return timeString
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl min-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>{cfg.title}</DialogTitle>
          <DialogDescription className={`font-semibold text-sm ${cfg.subColor}`}>
            {cfg.subLabel(filtered.length)}
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
            className="gap-1.5 text-xs h-8"
            onClick={() => {
              // CSV formatda eksport — Excel to'g'ri ochadi
              const headers = ['Ism', 'Telefon', 'Sana', 'Vaqt', 'Turi', 'Yuz Tasdiqlandi', 'Joy Tasdiqlandi', 'Muvaffaqiyat']
              const rows = filtered.map(a => [
                a.user_full_name || `User #${a.user}`,
                a.user_phone || '-',
                formatDate(a.created_at),
                formatTime(a.created_at),
                a.attendance_type === 'in' ? 'Kirish' : 'Chiqish',
                a.face_verified ? 'Ha' : 'Yo\'q',
                a.location_verified ? 'Ha' : 'Yo\'q',
                a.is_success ? 'Ha' : 'Yo\'q',
              ])
              const csvContent = [headers, ...rows]
                .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
                .join('\n')
              // BOM + UTF-8 — Excel uchun o'zbek harflarini to'g'ri ko'rsatish
              const bom = '\uFEFF'
              const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `davomat_${cfg.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
              link.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download size={13} />
            Excel Yuklash
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Ism</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Telefon</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Sana</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Vaqt</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Turi</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Yuz</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Joy</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Muvaffaqiyat</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-50 hover:bg-[#e3f2fd] transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800 text-sm">
                    {a.user_full_name || `User #${a.user}`}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs">
                    {a.user_phone || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs">
                    {formatDate(a.created_at)}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs">
                    {formatTime(a.created_at)}
                  </td>
                  <td className="py-2.5 px-3 text-gray-700 text-xs">
                    {a.attendance_type === 'in' ? 'Kirish' : 'Chiqish'}
                  </td>
                  <td className="py-2.5 px-3">
                    {a.face_verified ? (
                      <Check className="text-green-500" size={16} />
                    ) : (
                      <X className="text-red-500" size={16} />
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {a.location_verified ? (
                      <Check className="text-green-500" size={16} />
                    ) : (
                      <X className="text-red-500" size={16} />
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {a.is_success ? (
                      <Check className="text-green-500" size={16} />
                    ) : (
                      <X className="text-red-500" size={16} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </DialogContent>
    </Dialog>
  )
}
