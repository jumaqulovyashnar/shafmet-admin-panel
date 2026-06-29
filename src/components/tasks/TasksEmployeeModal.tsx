import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import TaskAssignModal from './TaskAssignModal'
import TaskRemoveModal from './TaskRemoveModal'
import type { Worker } from '@/types/inspection'

interface TasksEmployeeModalProps {
    open: boolean
    onClose: () => void
    title: string
    workers: Worker[]
}

const ITEMS_PER_PAGE = 10

export default function TasksEmployeeModal({ open, onClose, title, workers }: TasksEmployeeModalProps) {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [assignTarget, setAssignTarget] = useState<Worker | null>(null)
    const [removeTarget, setRemoveTarget] = useState<Worker | null>(null)
    const [showUmumiy, setShowUmumiy] = useState(false)

    const filtered = workers.filter((w) =>
        w.full_name.toLowerCase().includes(search.toLowerCase()) ||
        w.phone.includes(search)
    )
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            boss: 'bg-purple-100 text-purple-700',
            manager: 'bg-blue-100 text-blue-700',
            worker: 'bg-green-100 text-green-700',
            admin: 'bg-orange-100 text-orange-700',
        }
        const labels: Record<string, string> = {
            boss: 'Rahbar',
            manager: 'Menejer',
            worker: 'Ishchi',
            admin: 'Admin',
        }
        return (
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[role] || 'bg-gray-100 text-gray-700'}`}>
                {labels[role] || role}
            </span>
        )
    }

    return (
        <>
            <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
                <DialogContent className="max-w-3xl min-w-[768px] max-h-[90vh] overflow-hidden flex flex-col p-6">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription className="text-blue-600 font-semibold text-sm">
                            Topshiriqlar Bo'limi ({filtered.length} ta xodim)
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
                            className="gap-1.5 text-xs h-8 text-[#64b5f6] border-[#64b5f6] hover:bg-[#64b5f6]/10"
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
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Telefon</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Lavozimi</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Holati</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Vazifa Berish</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-400">Vazifa Ayrish</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((worker) => (
                                    <tr key={worker.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-2.5 px-3">
                                            <div className="flex items-center gap-2">
                                                {worker.avatar || worker.photo ? (
                                                    <img
                                                        src={worker.avatar || worker.photo}
                                                        alt={worker.full_name}
                                                        className="w-7 h-7 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                                                        {worker.full_name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-800 text-sm">{worker.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-500 text-xs">{worker.phone}</td>
                                        <td className="py-2.5 px-3">
                                            <div className="flex flex-col items-start gap-1">
                                                {(worker.department_detail?.name || worker.branch) && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                                                        {worker.department_detail?.name || worker.branch}
                                                    </span>
                                                )}
                                                {worker.role && getRoleBadge(worker.role)}
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${worker.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {worker.is_active ? 'Faol' : 'Nofaol'}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <button
                                                onClick={() => setAssignTarget(worker)}
                                                className="w-8 h-8 rounded-md bg-[#64b5f6] hover:bg-[#42a5f5] text-white font-bold text-lg flex items-center justify-center transition-colors"
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <button
                                                onClick={() => setRemoveTarget(worker)}
                                                className="w-8 h-8 rounded-md bg-red-400 hover:bg-red-500 text-white font-bold text-lg flex items-center justify-center transition-colors"
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
                worker={assignTarget}
            />

            {/* Hodimdan vazifa olish */}
            <TaskRemoveModal
                open={!!removeTarget}
                onClose={() => setRemoveTarget(null)}
                employeeName={removeTarget?.full_name ?? ''}
            />

            {/* Umumiy vazifa berish */}
            <TaskAssignModal
                open={showUmumiy}
                onClose={() => setShowUmumiy(false)}
                worker={null}
            />
        </>
    )
}
