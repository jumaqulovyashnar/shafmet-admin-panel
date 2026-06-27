import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import StoreCard from '@/components/dashboard/StoreCard'
import EmployeesTable from '@/components/dashboard/EmployeesTable'
import EmployeeModal from '@/components/dashboard/EmployeeModal'
import { images } from '@/api/constant/images'
import type { ModalType } from '@/types/dashboard'
import { useAttendances } from '@/hooks/useAttendances'

export default function DashboardPage() {
    const [modal, setModal] = useState<ModalType>(null)
    const { attendances, loading, totalCount, page, totalPages, setPage, search, setSearch, filter, setFilter } = useAttendances(100)

    // Calculate statistics from real attendance data
    const safeAttendances = attendances || []
    const onTimeCount = safeAttendances.filter(a => a.is_success && a.face_verified && a.location_verified).length
    const lateCount = safeAttendances.filter(a => a.is_success && (!a.face_verified || !a.location_verified)).length
    const absentCount = totalCount > 0 ? totalCount - onTimeCount - lateCount : 0

    // Calculate percentages for charts
    const faceVerifiedRate = totalCount > 0 
        ? Math.round((safeAttendances.filter(a => a.face_verified).length / totalCount) * 100) 
        : 0
    const locationVerifiedRate = totalCount > 0 
        ? Math.round((safeAttendances.filter(a => a.location_verified).length / totalCount) * 100) 
        : 0
    const successRate = totalCount > 0 
        ? Math.round((safeAttendances.filter(a => a.is_success).length / totalCount) * 100) 
        : 0
    const checkInRate = totalCount > 0 
        ? Math.round((safeAttendances.filter(a => a.attendance_type === 'in').length / totalCount) * 100) 
        : 0

    const modalEmployees = () => {
        switch (modal) {
            case 'ichki-dokon': return safeAttendances
            case 'kelganlar': return safeAttendances.filter(a => a.is_success && a.face_verified && a.location_verified)
            case 'kechikkanlar': return safeAttendances.filter(a => a.is_success && (!a.face_verified || !a.location_verified))
            case 'kelmaganlar': return safeAttendances.filter(a => !a.is_success)
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
                        <p className="text-2xl font-bold text-gray-900">{onTimeCount}</p>
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
                        <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
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
                        <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
                    </div>
                </div>
            </div>

            {/* Store cards row */}
            <div className="grid grid-cols-4 gap-5">
                <StoreCard
                    title="Yuz Tasdiqlash"
                    subtitle="Yuz tanish bo'yicha foiz"
                    percentage={faceVerifiedRate}
                    color="#f97316"
                    onClick={() => setModal('ichki-dokon')}
                />
                <StoreCard
                    title="Joy Tasdiqlash"
                    subtitle="GPS joylashuv bo'yicha foiz"
                    percentage={locationVerifiedRate}
                    color="#22c55e"
                />
                <StoreCard
                    title="Muvaffaqiyat"
                    subtitle="Umumiy muvaffaqiyat foizi"
                    percentage={successRate}
                    color="#a855f7"
                />
                <StoreCard
                    title="Kirish"
                    subtitle="Check-in bo'yicha foiz"
                    percentage={checkInRate}
                    color="#3b82f6"
                />
            </div>

            {/* Employees table */}
            <EmployeesTable 
                attendances={safeAttendances} 
                loading={loading} 
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                search={search}
                onSearchChange={setSearch}
                filter={filter}
                onFilterChange={setFilter}
            />

            {/* Modals */}
            <EmployeeModal
                open={modal !== null}
                onClose={() => setModal(null)}
                type={modal}
                attendances={modalEmployees()}
            />
        </div>
    )
}
