import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import StoreCard from '@/components/dashboard/StoreCard'
import EmployeesTable from '@/components/dashboard/EmployeesTable'
import EmployeeModal from '@/components/dashboard/EmployeeModal'
import { images } from '@/api/constant/images'
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
            {/* Stat cards row - combined into single card with dividers */}
            <div className="bg-white rounded-xl px-5 py-4 flex items-center divide-x divide-gray-300" style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
                {/* Card 1 */}
                <div
                    onClick={() => setModal('kelganlar')}
                    className="flex items-center gap-4 flex-1 pr-5 cursor-pointer hover:opacity-80 transition-all duration-500 ease-in-out"
                >
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <img src={images.profile1} alt="" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Ishga Kelganlar</p>
                        <p className="text-2xl font-bold text-gray-900">{onTimeEmployees.length}</p>
                        <div className="flex items-center gap-1 text-xs mt-0.5 text-emerald-600">
                            <TrendingUp size={11} />
                            <span>18% o'tgan oyga nbt</span>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div
                    onClick={() => setModal('kechikkanlar')}
                    className="flex items-center gap-4 flex-1 px-5 cursor-pointer hover:opacity-80 transition-all duration-500 ease-in-out"
                >
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <img src={images.profile2} alt="" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Ishga kechikganlar</p>
                        <p className="text-2xl font-bold text-gray-900">{lateEmployees.length}</p>
                        <div className="flex items-center gap-1 text-xs mt-0.5 text-red-500">
                            <TrendingDown size={11} />
                            <span>1% o'tgan oyga nbt</span>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div
                    onClick={() => setModal('kelmaganlar')}
                    className="flex items-center gap-4 flex-1 pl-5 cursor-pointer hover:opacity-80 transition-all duration-500 ease-in-out"
                >
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <img src={images.profile3} alt="" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Kelmaganlar</p>
                        <p className="text-2xl font-bold text-gray-900">{absentEmployees.length}</p>
                    </div>
                </div>
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
