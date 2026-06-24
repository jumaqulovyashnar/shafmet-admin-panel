import { useState } from 'react'
import { Users, UserCheck, UserX } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import StoreCard from '@/components/dashboard/StoreCard'
import EmployeesTable from '@/components/dashboard/EmployeesTable'
import EmployeeModal from '@/components/dashboard/EmployeeModal'
import type { ModalType } from '@/types/dashboard'
import {
    allEmployees,
    onTimeEmployees,
    lateEmployees,
    absentEmployees,
    ichkiDokonEmployees,
} from '@/data/mockEmployees'

export default function DashboardPage() {
    const [modal, setModal] = useState<ModalType>(null)

    const modalEmployees = () => {
        switch (modal) {
            case 'ichki-dokon': return ichkiDokonEmployees
            case 'kelganlar': return onTimeEmployees
            case 'kechikkanlar': return lateEmployees
            case 'kelmaganlar': return absentEmployees
            default: return []
        }
    }

    return (
        <div className="space-y-5">
            {/* Stat cards row */}
            <div className="flex gap-4">
                <StatCard
                    label="Ishga Kelganlar"
                    count={onTimeEmployees.length}
                    trend={{ value: '18%', direction: 'up' }}
                    icon={<UserCheck size={20} className="text-emerald-600" />}
                    onClick={() => setModal('kelganlar')}
                />
                <StatCard
                    label="Ishga kechikganlar"
                    count={lateEmployees.length}
                    trend={{ value: '1%', direction: 'down' }}
                    icon={<Users size={20} className="text-amber-500" />}
                    onClick={() => setModal('kechikkanlar')}
                />
                <StatCard
                    label="Kelmaganlar"
                    count={absentEmployees.length}
                    icon={<UserX size={20} className="text-red-500" />}
                    onClick={() => setModal('kelmaganlar')}
                />
            </div>

            {/* Store cards row */}
            <div className="flex gap-4">
                <StoreCard
                    title="Ichki Do'kon"
                    subtitle="Ichki do'kon statistikasi umumiy"
                    percentage={65}
                    color="#f97316"
                    onClick={() => setModal('ichki-dokon')}
                />
                <StoreCard
                    title="Tashqi Do'kon"
                    subtitle="Tashqi do'kon statistikasi Umumiy"
                    percentage={65}
                    color="#22c55e"
                />
                <StoreCard
                    title="Personallar"
                    subtitle="Personallar Statistikasi"
                    percentage={65}
                    color="#a855f7"
                />
            </div>

            {/* Employees table */}
            <EmployeesTable employees={allEmployees} />

            {/* Modals */}
            <EmployeeModal
                open={modal !== null}
                onClose={() => setModal(null)}
                type={modal}
                employees={modalEmployees()}
            />
        </div>
    )
}
