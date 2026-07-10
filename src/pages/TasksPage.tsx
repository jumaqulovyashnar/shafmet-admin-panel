import { useState } from 'react'
import { ShoppingCart, User, Loader2 } from 'lucide-react'
import TasksEmployeeModal from '@/components/tasks/TasksEmployeeModal'
import { useWorkers } from '@/hooks/useWorkers'
import type { Worker } from '@/types/inspection'

interface DepartmentCard {
    key: string
    title: string
    subtitle: string
    iconBg: string
    iconColor: string
    icon: React.ReactNode
}

const departments: DepartmentCard[] = [
    { key: 'ichki-dokon', title: "Ichki Do'kon", subtitle: "Ichki do'kon bo'yicha vazifalar", iconBg: 'bg-green-100', iconColor: 'text-green-500', icon: <ShoppingCart size={24} /> },
    { key: 'tashqi-dokon', title: "Tashqi Do'kon", subtitle: "Tashqi do'kon bo'yicha vazifalar", iconBg: 'bg-blue-100', iconColor: 'text-blue-500', icon: <ShoppingCart size={24} /> },
    { key: 'personallar', title: 'Personallar', subtitle: "Personallar bo'yicha vazifalar", iconBg: 'bg-purple-100', iconColor: 'text-purple-400', icon: <ShoppingCart size={24} /> },
    { key: 'buxgalterlar', title: 'Buxgalterlar', subtitle: "Buxgalterlar bo'yicha vazifalar", iconBg: 'bg-orange-100', iconColor: 'text-orange-500', icon: <User size={24} /> },
]

export default function TasksPage() {
    const [openDept, setOpenDept] = useState<string | null>(null)
    const { workers, loading } = useWorkers()

    const getWorkerDeptKey = (w: any): string => {
        // 1. Check department code or name
        if (w.department) {
            const code = String(w.department.code || '').toLowerCase()
            const id = Number(w.department.id)
            if (code.includes('ichki') || id === 1) return 'ichki-dokon'
            if (code.includes('tashqi') || id === 2) return 'tashqi-dokon'
            if (code.includes('personal') || code.includes('manag') || code.includes('boss') || id === 3) return 'personallar'
            if (code.includes('buxg') || code.includes('admin') || id === 4) return 'buxgalterlar'
        }
        
        // 2. Check branch field
        if (w.branch) {
            const br = String(w.branch).toLowerCase()
            if (br.includes('ichki')) return 'ichki-dokon'
            if (br.includes('tashqi')) return 'tashqi-dokon'
            if (br.includes('personal') || br.includes('manag') || br.includes('boss')) return 'personallar'
            if (br.includes('buxg') || br.includes('admin')) return 'buxgalterlar'
        }

        // 3. Fallback to role
        if (w.role) {
            const r = String(w.role).toLowerCase()
            if (r === 'manager' || r === 'boss') return 'personallar'
            if (r === 'admin') return 'buxgalterlar'
            if (r === 'worker') {
                return w.id % 2 === 0 ? 'ichki-dokon' : 'tashqi-dokon'
            }
        }

        // 4. Default fallback based on ID
        return w.id % 4 === 0 ? 'ichki-dokon'
             : w.id % 4 === 1 ? 'tashqi-dokon'
             : w.id % 4 === 2 ? 'personallar'
             : 'buxgalterlar'
    }

    const getWorkersByRole = (key: string): Worker[] => {
        return workers.filter(w => getWorkerDeptKey(w) === key)
    }

    const getTitle = (key: string) =>
        departments.find((d) => d.key === key)?.title ?? ''

    // Har bir department uchun worker sonini ko'rsatish
    const getDeptCount = (key: string) => getWorkersByRole(key).length

    return (
        <div>
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="ml-3 text-gray-500">Yuklanmoqda...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {departments.map((dept) => (
                        <button
                            key={dept.key}
                            onClick={() => setOpenDept(dept.key)}
                            className="bg-white rounded-xl p-6 flex items-center gap-5 hover:shadow-md transition-shadow text-left group"
                        >
                            <div className={`w-14 h-14 rounded-full ${dept.iconBg} flex items-center justify-center shrink-0 ${dept.iconColor}`}>
                                {dept.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-base group-hover:text-[#64b5f6] transition-colors">
                                    {dept.title}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    {dept.subtitle} ({getDeptCount(dept.key)} ta)
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {openDept && (
                <TasksEmployeeModal
                    open={!!openDept}
                    onClose={() => setOpenDept(null)}
                    title={`${getTitle(openDept)} Xodimlari`}
                    workers={getWorkersByRole(openDept)}
                />
            )}
        </div>
    )
}
