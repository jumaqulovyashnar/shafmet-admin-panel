import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import TaskAssignModal from './TaskAssignModal'
import TaskRemoveModal from './TaskRemoveModal'
import type { Employee } from '@/types/dashboard'

interface TasksEmployeeModalProps {
    open: boolean
    onClose: () => void
    title: string
    employees: Employee[]
}

const ITEMS_PER_PAGE = 10

export default function TasksEmployeeModal({ open, onClose, title, employees }: TasksEmployeeModalProps) {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [assignTarget, setAssignTarget] = useState<Employee | null>(null)   // + tugma => hodimga
    const [removeTarget, setRemoveTarget] = useState<Employee | null>(null)   // - tugma => hodimdan olib tashlash
    const [showUmumiy, setShowUmumiy] = useState(false)                       // Bo'linga Topshiriq => umumiy

    const filtered = employees.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <>
            <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-6">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription className="text-blue-600 font-semibold text-sm">
                            Topshiriqlar Bo'limi
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
                                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => setShowUmumiy(true)}
                        >
                            Bo'linga Topshiriq Berish
                            <SlidersHorizontal size={13} />
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-y-auto flex-1 min-h-0">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white">
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Ism Familiyasi</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Ish Joyi</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Telefon Raqami</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Bajargan Vazifalar</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Vazifa Berish</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Vazifa Ayrish</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((emp) => (
                                    <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-2.5 px-3 font-medium text-gray-800 text-sm">{emp.name}</td>
                                        <td className="py-2.5 px-3 text-gray-400 text-xs">-</td>
                                        <td className="py-2.5 px-3 text-gray-400 text-xs">-</td>
                                        <td className="py-2.5 px-3 text-gray-700 text-sm font-medium">{emp.tasks ?? 0}</td>
                                        <td className="py-2.5 px-3">
                                            <button
                                                onClick={() => setAssignTarget(emp)}
                                                className="w-8 h-7 rounded-md bg-blue-400 hover:bg-blue-500 text-white font-bold text-lg flex items-center justify-center transition-colors"
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <button
                                                onClick={() => setRemoveTarget(emp)}
                                                className="w-8 h-7 rounded-md bg-red-400 hover:bg-red-500 text-white font-bold text-lg flex items-center justify-center transition-colors"
                                            >
                                                −
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </DialogContent>
            </Dialog>

            {/* Hodimga vazifa berish */}
            <TaskAssignModal
                open={!!assignTarget}
                onClose={() => setAssignTarget(null)}
                employeeName={assignTarget?.name}
            />

            {/* Hodimdan vazifa olish */}
            <TaskRemoveModal
                open={!!removeTarget}
                onClose={() => setRemoveTarget(null)}
                employeeName={removeTarget?.name ?? ''}
            />

            {/* Umumiy vazifa berish */}
            <TaskAssignModal
                open={showUmumiy}
                onClose={() => setShowUmumiy(false)}
                employeeName={undefined}
            />
        </>
    )
}
