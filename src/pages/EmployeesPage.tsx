import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Search, Folder, Store, Users, Pencil, Trash2, ShieldPlus, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import AddEmployeeModal from '@/components/employees/AddEmployeeModal'
import AddRoleModal from '@/components/employees/AddRoleModal'
import EditDepartmentModal from '@/components/employees/EditDepartmentModal'
import DeleteDepartmentModal from '@/components/employees/DeleteDepartmentModal'
import FolderActionButtons from '@/components/employees/FolderActionButtons'
import EmployeeProfileModal from '@/components/dashboard/EmployeeProfileModal'
import { getAbsoluteImageUrl } from '@/lib/api-base-url'
import { useWorkers } from '@/hooks/useWorkers'
import type { Worker } from '@/types/inspection'
import { toast } from 'sonner'
import { inspectionService } from '@/services/inspectionService'

/* ---- Department folder config ---- */
interface DeptFolder {
    key: string
    label: string
    count: number
    isCustomRole?: boolean
    icon?: React.ReactNode
    bgColor?: string
    iconColor?: string
    isDefault?: boolean
    showInDiagram?: boolean
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
        const matchedWorkers = workers.filter(w => {
            return workerMatchesLavozim(w, lavozim)
        })

        return {
            key: String(lavozim.id),
            label: lavozim.name,
            count: matchedWorkers.length,
            icon: <Store size={28} />,
            bgColor: folderBgColors[idx % folderBgColors.length],
            iconColor: folderColors[idx % folderColors.length],
            isDefault: lavozim.is_default || false,
            showInDiagram: lavozim.show_in_diagram || false
        }
    })

    // Har doim "Barchasi" folderi bo'lsin
    folders.push({
        key: 'all',
        label: 'Barcha Xodimlar',
        count: workers.length,
        icon: <Users size={28} />,
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-500',
        isDefault: true
    })

    return folders
}


/**
 * Worker ning lavozim ga tegishli ekanligini aniqlash.
 * Birinchi navbatda department (ID) bo'yicha tekshiradi,
 * agar department yo'q bo'lsa branch (slug) bo'yicha fallback qiladi.
 */
function workerMatchesLavozim(w: Worker, lavozim: Lavozim): boolean {
    // 1. department_detail (aniq ma'lumot) bo'yicha tekshir
    if (w.department_detail) {
        return w.department_detail.id === lavozim.id || w.department_detail.slug === lavozim.slug
    }

    // 2. department (raqam yoki obyekt) bo'yicha tekshir
    if (w.department !== undefined && w.department !== null) {
        const deptId = typeof w.department === 'object' && w.department !== null
            ? Number((w.department as any).id)
            : Number(w.department)
        if (!isNaN(deptId) && deptId > 0) {
            return deptId === lavozim.id
        }
    }

    // 3. Faqat department yo'q bo'lsa, branch (slug) bo'yicha fallback
    if (w.branch) {
        return w.branch === lavozim.slug
    }

    return false
}

/* ---- Folder list view ---- */
function FolderList({
    folders,
    onSelect,
    onEdit,
    onDelete,
    onAddEmployee,
}: {
    folders: DeptFolder[]
    onSelect: (key: string) => void
    onEdit?: (key: string) => void
    onDelete?: (key: string) => void
    onAddEmployee?: (key: string) => void
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {folders.map((d, idx) => (
                <div
                    key={d.key}
                    className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all group border border-gray-100 hover:border-blue-200 flex flex-col"
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
                    <FolderActionButtons 
                        departmentKey={d.key} 
                        isDefault={d.isDefault}
                        onAddEmployee={onAddEmployee} 
                        onEdit={onEdit} 
                        onDelete={onDelete} 
                    />
                </div>
            ))}
        </div>
    )
}

/* ---- Worker table view (real API data) ---- */
function WorkerTable({ workers, onWorkerClick, onDeleteWorker, title = 'Barcha Hodimlar' }: { workers: Worker[]; onWorkerClick?: (id: number) => void; onDeleteWorker?: (id: number) => void; title?: string }) {
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
                    <h3 className="text-[17px] font-bold text-gray-900">{title}</h3>
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
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Ism Familiyasi</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Telefon Raqami</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Lavozimi</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Holati</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Yuz Profili</th>
                        <th className="text-left py-2 px-3 text-[11px] font-medium text-gray-400">Qo'shilgan</th>
                        <th className="text-center py-2 px-3 text-[11px] font-medium text-gray-400">Amallar</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map((worker) => (
                        <tr
                            key={worker.id}
                            onClick={() => onWorkerClick?.(worker.id)}
                            className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <td className="py-4 px-4">
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
                            <td className="py-4 px-4 text-[12px] text-gray-500">{worker.phone}</td>
                            <td className="py-4 px-4">
                                <div className="flex flex-col items-start gap-1.5">
                                    {(worker.department_detail?.name || worker.branch) && (
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                                            {worker.department_detail?.name || worker.branch}
                                        </span>
                                    )}
                                    {worker.role && getRoleBadge(worker.role)}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${worker.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {worker.is_active ? 'Faol' : 'Nofaol'}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-[12px] text-gray-500">
                                {worker.has_face_profile ? '✅ Bor' : '❌ Yo\'q'}
                            </td>
                            <td className="py-4 px-4 text-[12px] text-gray-400">
                                {worker.created_at ? (() => { const d = new Date(worker.created_at); return isNaN(d.getTime()) ? worker.created_at : d.toLocaleDateString('uz-UZ') })() : '-'}
                            </td>
                            <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onWorkerClick?.(worker.id)
                                        }}
                                        className="inline-flex items-center justify-center p-2.5 text-blue-500 border border-blue-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Tahrirlash"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDeleteWorker?.(worker.id)
                                        }}
                                        className="inline-flex items-center justify-center p-2.5 text-red-500 border border-red-200 hover:border-red-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        title="O'chirish"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

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
    const { lavozimlar, loading: lavozimLoading, refetch: refetchLavozimlar } = useLavozimlar()
    const isPageLoading = loading || lavozimLoading
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null)
    const [customFolders, setCustomFolders] = useState<DeptFolder[]>(loadCustomFolders)
    const [showAddEmployee, setShowAddEmployee] = useState(false)
    const [addEmployeeDeptId, setAddEmployeeDeptId] = useState<number | null>(null)
    const [showAddRole, setShowAddRole] = useState(false)
    const [editDepartment, setEditDepartment] = useState<DeptFolder | null>(null)
    const [deleteDepartment, setDeleteDepartment] = useState<DeptFolder | null>(null)


    // API dan olingan workers asosida folderlarni build qilish
    const apiFolders = buildFoldersFromLavozimlar(lavozimlar, workers)
    const allFolders = [...apiFolders, ...customFolders]

    // Yangi lavozim qo'shilganda — API orqali yaratilgani uchun lavozimlarni qayta yuklash
    const handleAddRole = (_role: { title: string; principle: string; showInDiagram: boolean }) => {
        refetchLavozimlar()
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

    const handleSaveEdit = async (key: string, newLabel: string, showInDiagram?: boolean) => {
        const isApiFolder = apiFolders.some((f) => f.key === key)
        if (isApiFolder) {
            try {
                const lavozimId = parseInt(key, 10)
                if (!isNaN(lavozimId)) {
                    const loadId = toast.loading("Lavozim tahrirlanmoqda...")
                    await inspectionService.updateLavozim(lavozimId, { 
                        name: newLabel.trim(),
                        show_in_diagram: showInDiagram,
                    })
                    toast.dismiss(loadId)
                    toast.success("Lavozim muvaffaqiyatli tahrirlandi!")
                    refetchLavozimlar()
                }
            } catch (error: any) {
                toast.dismiss()
                console.error("Lavozimni tahrirlashda xatolik:", error)
                const errorMsg = error?.response?.data?.error || error?.response?.data?.detail || "Lavozimni tahrirlab bo'lmadi"
                toast.error(errorMsg)
            }
        } else {
            const updated = customFolders.map((f) => (f.key === key ? { ...f, label: newLabel } : f))
            setCustomFolders(updated)
            saveCustomFolders(updated)
        }
    }

    const handleConfirmDelete = async (key: string) => {
        const isApiFolder = apiFolders.some((f) => f.key === key)
        if (isApiFolder) {
            try {
                const lavozimId = parseInt(key, 10)
                if (!isNaN(lavozimId)) {
                    await inspectionService.deleteLavozim(lavozimId)
                    toast.success("Lavozim muvaffaqiyatli o'chirildi")
                    refetchLavozimlar()
                    if (dept === key) {
                        navigate('/employees')
                    }
                }
            } catch (error: any) {
                console.error("Lavozimni o'chirishda xatolik:", error)
                const errorMsg = error?.response?.data?.error || error?.response?.data?.detail || "Lavozimni o'chirish imkoni bo'lmadi"
                toast.error(errorMsg)
            }
        } else {
            const updated = customFolders.filter((f) => f.key !== key)
            setCustomFolders(updated)
            saveCustomFolders(updated)
            toast.success("Bo'lim muvaffaqiyatli o'chirildi")
        }
    }


    const handleDeleteWorker = async (id: number) => {
        if (!window.confirm("Rostdan ham bu xodimni o'chirmoqchimisiz?")) return;
        try {
            await inspectionService.deleteWorker(id)
            toast.success("Xodim muvaffaqiyatli o'chirildi")
            refetch()
        } catch (error) {
            toast.error("Xodimni o'chirishda xatolik yuz berdi")
        }
    }

    // Bo'lim tanlanganda — workerlarni lavozim bo'yicha filtr qilish
    // dept param = lavozim ID (masalan "1", "5") — shuning uchun lavozim slug ni ham topib, branch bilan solishtirish kerak
    const currentLavozim = dept && dept !== 'all' ? lavozimlar.find(l => String(l.id) === dept) : null
    
    const selectedWorkers = dept === 'all' 
        ? workers 
        : dept 
            ? workers.filter(w => {
                if (currentLavozim) {
                    return workerMatchesLavozim(w, currentLavozim)
                }
                // Agar lavozim topilmasa — eski logika (fallback)
                const deptId = typeof w.department === 'object' && w.department !== null
                    ? Number((w.department as any).id)
                    : Number(w.department)
                const deptNum = Number(dept)
                return deptId === deptNum
              }) 
            : []

    return (
        <div className="space-y-4">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <div className="w-48">
                    <Button
                        onClick={() => setShowAddRole(true)}
                        className="w-full gap-2"
                    >
                        <ShieldPlus size={16} />
                        <span>Lavozim yaratish</span>
                    </Button>
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
                    onAddEmployee={(key) => {
                        setAddEmployeeDeptId(Number(key))
                        setShowAddEmployee(true)
                    }}
                />
            ) : (
                <WorkerTable 
                    title={currentLavozim ? currentLavozim.name : 'Barcha Xodimlar'}
                    workers={selectedWorkers} 
                    onWorkerClick={setSelectedWorkerId} 
                    onDeleteWorker={handleDeleteWorker} 
                />
            )}

            {/* Modals */}
            <AddEmployeeModal
                open={showAddEmployee}
                onClose={() => { setShowAddEmployee(false); setAddEmployeeDeptId(null); refetch() }}
                defaultLocation={dept ? allFolders.find(f => f.key === dept)?.label : undefined}
                defaultDepartmentId={addEmployeeDeptId ?? (dept ? Number(dept) : undefined)}
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
