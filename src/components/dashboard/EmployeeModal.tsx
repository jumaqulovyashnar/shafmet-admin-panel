import { useState } from 'react'
import { Search, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import EmployeeProfileModal from './EmployeeProfileModal'
import type { Employee, ModalType } from '@/types/dashboard'

interface EmployeeModalProps {
  open: boolean
  onClose: () => void
  type: ModalType
  employees: Employee[]
}

const ITEMS_PER_PAGE = 10

const modalConfig: Record<
  NonNullable<ModalType>,
  { title: string; subLabel: (count: number) => string; timeColor: string; subColor: string }
> = {
  'ichki-dokon': {
    title: 'Ichki dokon Xodimlari',
    subLabel: () => 'umumiy faolligar',
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

function efficiencyColor(val: number) {
  if (val >= 70) return 'bg-emerald-100 text-emerald-700'
  if (val >= 40) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

export default function EmployeeModal({ open, onClose, type, employees }: EmployeeModalProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  if (!type) return null
  const cfg = modalConfig[type]

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const showBalance = type === 'ichki-dokon'
  const showIp = type !== 'ichki-dokon'

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-6">
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
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Download size={13} />
            Excel Yuklash
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Ism Familiyasi</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Ish Joyi</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Telefon Raqami</th>
                {showIp && <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Ip Manzil</th>}
                {showIp && <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Urunishlar</th>}
                {showBalance && <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">Balansi</th>}
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-400 whitespace-nowrap">
                  {showBalance ? 'Faolligi' : 'Kelgan Vaqti'}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="border-b border-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800 text-sm">{emp.name}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs">{emp.location}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs">{emp.phone}</td>
                  {showIp && <td className="py-2.5 px-3 text-gray-500 text-xs">{emp.ip}</td>}
                  {showIp && <td className="py-2.5 px-3 text-gray-500 text-xs">{emp.attempts} ta</td>}
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

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />

        {/* Employee Profile Modal */}
        <EmployeeProfileModal
          open={selectedEmployee !== null}
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
        />
      </DialogContent>
    </Dialog>
  )
}
