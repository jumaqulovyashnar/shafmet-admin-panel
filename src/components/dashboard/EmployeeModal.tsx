import { useState } from 'react'
import { Search, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Employee, ModalType } from '@/types/dashboard'

interface EmployeeModalProps {
  open: boolean
  onClose: () => void
  type: ModalType
  employees: Employee[]
}

const ITEMS_PER_PAGE = 8

const modalConfig: Record<
  NonNullable<ModalType>,
  { title: string; subLabel: (count: number) => string; timeColor: string }
> = {
  'ichki-dokon': {
    title: 'Ichki dokon Xodimlari',
    subLabel: (n) => `umumiy faolligar`,
    timeColor: 'bg-blue-600 text-white',
  },
  kelganlar: {
    title: 'Ishga Kelganlar',
    subLabel: (n) => `Vaqtida Kelganlar ${n}`,
    timeColor: 'bg-blue-600 text-white',
  },
  kechikkanlar: {
    title: 'Ishga Kechikib Kelganlar',
    subLabel: (n) => `Kechikib Kelganlar ${n}`,
    timeColor: 'bg-amber-400 text-white',
  },
  kelmaganlar: {
    title: 'Ishga Kelmaganlar',
    subLabel: (n) => `Ishga Kelmagan ${n}`,
    timeColor: 'bg-red-500 text-white',
  },
}

function efficiencyColor(val: number) {
  if (val >= 70) return 'bg-emerald-100 text-emerald-700'
  if (val >= 40) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

export default function EmployeeModal({ open, onClose, type, employees }: EmployeeModalProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  if (!type) return null
  const cfg = modalConfig[type]

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const showBalance = type === 'ichki-dokon'
  const showIp = type !== 'ichki-dokon'

  const subColor =
    type === 'kelganlar'
      ? 'text-blue-600'
      : type === 'kechikkanlar'
      ? 'text-amber-500'
      : type === 'kelmaganlar'
      ? 'text-red-500'
      : 'text-blue-600'

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{cfg.title}</DialogTitle>
          <DialogDescription className={`font-semibold text-sm ${subColor}`}>
            {cfg.subLabel(filtered.length)}
          </DialogDescription>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <Input
              placeholder="Qidirish"
              className="pl-8 h-8 text-xs"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Download size={13} />
            Excel Yuklash
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Ism Familiyasi</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Ish Joyi</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Telefon Raqami</th>
                {showIp && <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Ip Manzil</th>}
                {showIp && <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">urunishlar</th>}
                {showBalance && <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Balansi</th>}
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">
                  {showBalance ? "Faolligi" : "Kelgan Vaqti"}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-gray-800">{emp.name}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs">{emp.location}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs">{emp.phone}</td>
                  {showIp && <td className="py-2.5 px-3 text-gray-500 text-xs">{emp.ip}</td>}
                  {showIp && (
                    <td className="py-2.5 px-3 text-gray-500 text-xs">
                      {emp.attempts} ta
                    </td>
                  )}
                  {showBalance && (
                    <td className="py-2.5 px-3 text-gray-700 text-xs">
                      {emp.balance.toLocaleString()} so'm
                    </td>
                  )}
                  <td className="py-2.5 px-3">
                    {showBalance ? (
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${efficiencyColor(emp.efficiency)}`}>
                        {emp.efficiency}%
                      </span>
                    ) : (
                      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ${cfg.timeColor}`}>
                        {emp.arrivalTime}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
          <span className="text-xs text-gray-400">
            Ushbu ma'lumotlar 2026-25-02 niki
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 text-sm"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            {totalPages > 4 && (
              <>
                <span className="text-gray-400 text-xs px-1">...</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className={`w-7 h-7 rounded text-xs font-medium ${page === totalPages ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 text-sm"
            >
              ›
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
