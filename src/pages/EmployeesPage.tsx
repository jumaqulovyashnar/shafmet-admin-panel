import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Search, ChevronDown, Folder, Store, Users, Pencil, Trash2, UserPlus, ShieldPlus, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Pagination from '@/components/ui/pagination'
import AddEmployeeModal from '@/components/employees/AddEmployeeModal'
import AddRoleModal from '@/components/employees/AddRoleModal'
import EditDepartmentModal from '@/components/employees/EditDepartmentModal'
import DeleteDepartmentModal from '@/components/employees/DeleteDepartmentModal'
import EmployeeProfileModal from '@/components/dashboard/EmployeeProfileModal'
import { getAbsoluteImageUrl } from '@/lib/api-base-url'
import { useWorkers } from '@/hooks/useWorkers'
import type { Worker } from '@/types/inspection'

/* ---- Department folder config ---- */
interface DeptFolder {
    key: string
    label: string
    count: number
    isCustomRole?: boolean
    icon?: React.ReactNode
    bgColor?: string
    iconColor?: string
}

// Folder icon color — static va custom rollarga
const folderColors = [
    'text-amber-400', 'text-teal-400', 'text-blue-400',
    'text-violet-400', 'text-pink-400', 'text-orange-400',
    'text-green-400', 'text-red-400', 'text-cyan-400',
]

const folderBgColors = [
    'bg-amber-100', 'bg-teal-100', 'bg-blue-100',
    'bg-violet-100', 'bg-pink-100', 'bg-orange-100',
    'bg-green-100', 'bg-red-100', 'bg-cyan-100',
]

const ITEMS_PER_PAGE = 10

import { useLavozimlar, type Lavozim } from '@/hooks/useLavozimlar'

/* ---- Build folders from Lavozimlar data ---- */
function buildFoldersFromLavozimlar(lavozimlar: Lavozim[], workers: Worker[]): DeptFolder[] {
    const folders: DeptFolder[] = lavozimlar.map((lavozim, idx) => {
        // Find workers for this branch/department
        const count = workers.filter(w => 
            w.branch === lavozim.slug || 
            w.department_detail?.slug === lavozim.slug ||
            w.department_detail?.id === lavozim.id
        ).length

        return {
            key: lavozim.slug,
            label: lavozim.name,
            count: count,
            icon: <Store size={28} />,
            bgColor: folderBgColors[idx % folderBgColors.length],
            iconColor: folderColors[idx % folderColors.length]
        }
    })

    // Har doim "Barchasi" folderi bo'lsin
    folders.push({
        key: 'all',
        label: 'Barcha Xodimlar',
        count: workers.length,
        icon: <Users size={28} />,
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-500'
    })

    return folders
}

/* ---- Folder list view ---- */
function FolderList({
    folders,
    onSelect,
    onEdit,
    onDelete,
}: {
    folders: DeptFolder[]
    onSelect: (key: string) => void
    onEdit?: (key: string) => void
    onDelete?: (key: string) => void
}) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {folders.map((d, idx) => (
                <div
                    key={d.key}
                    className="bg-white rounded-2xl p-6 hover:shadow-md transition-all group border border-transparent hover:border-blue-100 flex flex-col"
                >
                    {/* Icon and Content */}
                    <button
                        onClick={() => onSelect(d.key)}
                        className="text-left flex-1"
                    >
                        <div className="mb-4">
                            <div
                                className={`w-14 h-14 rounded-xl flex items-center justify-center ${d.bgColor || folderBgColors[idx % folderBgColors.length]
                                    }`}
                            >
                                <div className={d.iconColor || folderColors[idx % folderColors.length]}>
                                    {d.icon || <Folder size={28} />}
                                </div>
                            </div>
                        </div>
                        <h3 className="text-[14px] font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {d.label}
                        </h3>
                        <p className="text-[12px] text-gray-400 mt-1">{d.count} ta</p>
                    </button>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => onEdit?.(d.key)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <Pencil size={14} />
                            Tahrirlash
                        </button>
                        <button
                            onClick={() => onDelete?.(d.key)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                            O'chirish
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

/* ---- Worker table view (real API data) ---- */
function WorkerTable({ workers, onWorkerClick }: { workers: Worker[]; onWorkerClick?: (id: number) => void }) {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

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
        <div className="bg-white rounded-2xl p-5">
            {/* Table header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-[17px] font-bold text-gray-900">Barcha Hodimlar</h3>
                    <p className="text-[12px] text-blue-500 font-medium mt-0.5">{filtered.length} ta hodim</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <Input
                            placeholder="Qidirish"
                            className="pl-8 h-8 text-[12px] w-40"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Ism Familiyasi</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Telefon Raqami</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Lavozimi</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Holati</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Yuz Profili</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Qo'shilgan</th>
                        <th className="text-center py-2 px-3 text-[11px] font-medium text-gray-400">Tahrirlash</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map((worker) => (
                        <tr
                            key={worker.id}
                            onClick={() => onWorkerClick?.(worker.id)}
                            className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                    {worker.photo_url || worker.photo || worker.avatar ? (
                                        <img
                                            src={getAbsoluteImageUrl(worker.photo_url || worker.photo || worker.avatar)}
                                            alt={worker.full_name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[11px] font-bold">
                                            {worker.full_name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-[13px] font-semibold text-gray-800">{worker.full_name}</span>
                                </div>
                            </td>
                            <td className="py-3 px-3 text-[12px] text-gray-500">{worker.phone}</td>
                            <td className="py-3 px-3">
                                <div className="flex flex-col items-start gap-1.5">
                                    {(worker.department_detail?.name || worker.branch) && (
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                                            {worker.department_detail?.name || worker.branch}
                                        </span>
                                    )}
                                    {worker.role && getRoleBadge(worker.role)}
                                </div>
                            </td>
                            <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${worker.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {worker.is_active ? 'Faol' : 'Nofaol'}
                                </span>
                            </td>
                            <td className="py-3 px-3 text-[12px] text-gray-500">
                                {worker.has_face_profile ? '✅ Bor' : '❌ Yo\'q'}
                            </td>
                            <td className="py-3 px-3 text-[12px] text-gray-400">
                                {new Date(worker.created_at).toLocaleDateString('uz-UZ')}
                            </td>
                            <td className="py-3 px-3 text-center">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onWorkerClick?.(worker.id)
                                    }}
                                    className="inline-flex items-center justify-center p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Tahrirlash"
                                >
                                    <Pencil size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
    )
}

/* ---- Main page ---- */

// Custom rollar uchun session storage
const SESSION_KEY = 'shafmet_custom_folders'

function loadCustomFolders(): DeptFolder[] {
    try {
        const saved = sessionStorage.getItem(SESSION_KEY)
        if (saved) return JSON.parse(saved) as DeptFolder[]
    } catch { /* ignore */ }
    return []
}

function saveCustomFolders(folders: DeptFolder[]) {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(folders))
    } catch { /* ignore */ }
}

export default function EmployeesPage() {
    const { dept } = useParams<{ dept?: string }>()
    const navigate = useNavigate()
    const { workers, loading, refetch } = useWorkers()
    const { lavozimlar, loading: lavozimLoading } = useLavozimlar()
    const isPageLoading = loading || lavozimLoading
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null)
    const [customFolders, setCustomFolders] = useState<DeptFolder[]>(loadCustomFolders)
    const [showAddEmployee, setShowAddEmployee] = useState(false)
    const [showAddRole, setShowAddRole] = useState(false)
    const [editDepartment, setEditDepartment] = useState<DeptFolder | null>(null)
    const [deleteDepartment, setDeleteDepartment] = useState<DeptFolder | null>(null)
    const [accordionOpen, setAccordionOpen] = useState(false)

    // API dan olingan workers asosida folderlarni build qilish
    const apiFolders = buildFoldersFromLavozimlar(lavozimlar, workers)
    const allFolders = [...apiFolders, ...customFolders]

    // Yangi lavozim qo'shilganda
    const handleAddRole = (role: { title: string; principle: string; showInDiagram: boolean }) => {
        const key = `role_${Date.now()}`
        const updated = [
            ...customFolders,
            { key, label: role.title, count: 0, isCustomRole: true },
        ]
        setCustomFolders(updated)
        saveCustomFolders(updated)
        if (dept) navigate('/employees')
    }

    const handleEdit = (key: string) => {
        const department = allFolders.find((d) => d.key === key)
        if (department) setEditDepartment(department)
    }

    const handleDelete = (key: string) => {
        const department = allFolders.find((d) => d.key === key)
        if (department) setDeleteDepartment(department)
    }

    const handleSaveEdit = (key: string, newLabel: string) => {
        const updated = customFolders.map((f) => (f.key === key ? { ...f, label: newLabel } : f))
        setCustomFolders(updated)
        saveCustomFolders(updated)
    }

    const handleConfirmDelete = (key: string) => {
        const updated = customFolders.filter((f) => f.key !== key)
        setCustomFolders(updated)
        saveCustomFolders(updated)
    }

    // Bo'lim tanlanganda — workerlarni lavozim (dept slug) bo'yicha filtr qilish
    const selectedWorkers = dept === 'all' 
        ? workers 
        : dept 
            ? workers.filter(w => 
                w.branch === dept || 
                w.department_detail?.slug === dept || 
                w.department_detail?.id.toString() === dept
              ) 
            : []

    return (
        <div className="space-y-4">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <div className="w-48">
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <button
                            onClick={() => setAccordionOpen(!accordionOpen)}
                            className="w-full flex items-center justify-between bg-[#64b5f6] hover:bg-[#42a5f5] text-white px-3 py-2 text-[13px] font-semibold transition-colors"
                        >
                            <span>Yangi Qo'shish</span>
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${accordionOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {accordionOpen && (
                            <div className="p-2 bg-white">
                                <button
                                    onClick={() => { setShowAddEmployee(true); setAccordionOpen(false) }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium mb-1"
                                >
                                    <UserPlus size={16} className="text-blue-600" />
                                    <span>Yangi xodim</span>
                                </button>
                                <button
                                    onClick={() => { setShowAddRole(true); setAccordionOpen(false) }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                                >
                                    <ShieldPlus size={16} className="text-blue-600" />
                                    <span>Lavozim yaratish</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <SlidersHorizontal size={15} />
                </button>
            </div>

            {/* Content */}
            {isPageLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="ml-3 text-gray-500">Yuklanmoqda...</span>
                </div>
            ) : !dept ? (
                <FolderList
                    folders={allFolders}
                    onSelect={(key) => navigate(`/employees/${key}`)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <WorkerTable workers={selectedWorkers} onWorkerClick={setSelectedWorkerId} />
            )}

            {/* Modals */}
            <AddEmployeeModal
                open={showAddEmployee}
                onClose={() => { setShowAddEmployee(false); refetch() }}
                defaultLocation={dept ? allFolders.find(f => f.key === dept)?.label : undefined}
            />
            <AddRoleModal
                open={showAddRole}
                onClose={() => setShowAddRole(false)}
                onAdd={handleAddRole}
            />
            <EditDepartmentModal
                open={editDepartment !== null}
                onClose={() => setEditDepartment(null)}
                department={editDepartment}
                onSave={handleSaveEdit}
            />
            <DeleteDepartmentModal
                open={deleteDepartment !== null}
                onClose={() => setDeleteDepartment(null)}
                department={deleteDepartment}
                onConfirm={handleConfirmDelete}
            />

            {/* Employee Profile Modal */}
            <EmployeeProfileModal
                open={selectedWorkerId !== null}
                onClose={() => setSelectedWorkerId(null)}
                workerId={selectedWorkerId}
                onUpdate={refetch}
            />
        </div>
    )
}
