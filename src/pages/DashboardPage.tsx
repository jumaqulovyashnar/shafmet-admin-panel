import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import StoreCard from '@/components/dashboard/StoreCard'
import EmployeesTable from '@/components/dashboard/EmployeesTable'
import EmployeeModal from '@/components/dashboard/EmployeeModal'
import EmployeeProfileModal from '@/components/dashboard/EmployeeProfileModal'
import DragToScrollCarousel from '@/components/ui/DragToScrollCarousel'
import { images } from '@/api/constant/images'
import type { ModalType } from '@/types/dashboard'
import { useAttendances } from '@/hooks/useAttendances'
import { useWorkers } from '@/hooks/useWorkers'
import { useLavozimlar } from '@/hooks/useLavozimlar'
import { inspectionService } from '@/services/inspectionService'

export default function DashboardPage() {
    const [modal, setModal] = useState<ModalType>(null)
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null)
    const [summary, setSummary] = useState<any>(null)
    const [charts, setCharts] = useState<any[]>([])
    
    const { attendances, loading, page, totalPages, setPage, search, setSearch, filter, setFilter, refetch: refetchAttendances } = useAttendances(100)
    const { workers } = useWorkers()
    const { lavozimlar } = useLavozimlar()

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [summaryRes, chartsRes] = await Promise.all([
                    inspectionService.getDashboardSummary(undefined, { silent404: true }),
                    inspectionService.getDashboardCharts(undefined, { silent404: true })
                ])
                if (summaryRes) setSummary(summaryRes)
                if (Array.isArray(chartsRes)) setCharts(chartsRes)
            } catch (err) {
                console.error("Dashboard V1 load error:", err)
            }
        }
        loadDashboardData()
    }, [attendances])

    // Calculate statistics from real attendance data
    const safeAttendances = attendances || []
    
    const isLate = (a: any) => a.turi_kirish?.toLowerCase() === 'kechikkan' || a.turi_kirish?.toLowerCase() === 'kechikgan' || a.is_late === true
    const isAbsent = (a: any) => a.turi_kirish?.toLowerCase() === 'kelmagan' || a.status_kirish === false && !isLate(a)
    const isPresent = (a: any) => !isAbsent(a) && (a.status_kirish === true || a.is_success === true || a.turi_kirish?.toLowerCase() === 'ishda' || a.turi_kirish?.toLowerCase() === 'vaqtida' || isLate(a))

    const onTimeCount = safeAttendances.filter(isPresent).length
    const lateCount = safeAttendances.filter(isLate).length
    const absentCount = safeAttendances.filter(isAbsent).length

    const workerMap = new Map(workers?.map(w => [w.id, w]) || [])
    const getAttendanceGroup = (attendance: any) => {
        const userId = typeof attendance.user === 'object' && attendance.user !== null ? attendance.user.id : attendance.user
        let worker: any = workerMap.get(userId)
        
        if (!worker && attendance.ism) {
            worker = workers?.find(w => w.full_name?.toLowerCase() === attendance.ism?.toLowerCase() || w.first_name?.toLowerCase() === attendance.ism?.toLowerCase())
        }
        
        // Agar xodim worker listidan topilmasa, lekin attendance ichida user obyekti bo'lsa
        if (!worker && typeof attendance.user === 'object' && attendance.user !== null) {
             return String(attendance.user.branch || '').toLowerCase();
        }

        if (!worker) {
            return '';
        }

        if (worker.department_detail?.slug) {
            return String(worker.department_detail.slug).toLowerCase()
        }
        
        if (worker.branch) {
            return String(worker.branch).toLowerCase()
        }

        return '';
    }

    const modalEmployees = () => {
        if (!modal) return []
        if (modal === 'kelganlar') return safeAttendances.filter(isPresent)
        if (modal === 'kechikkanlar') return safeAttendances.filter(isLate)
        if (modal === 'kelmaganlar') return safeAttendances.filter(isAbsent)
        
        return safeAttendances.filter(a => {
            const grp = getAttendanceGroup(a)
            const normGrp = grp.replace(/[-_]/g, '')
            const normModal = modal.replace(/[-_]/g, '')
            return normGrp === normModal
        })
    }

    const filteredAttendances = safeAttendances.filter((a) => {
        if (filter === 'Barchasi') return true
        
        const targetLavozim = lavozimlar.find(l => l.name === filter)
        if (!targetLavozim) return true
        
        const grp = getAttendanceGroup(a)
        const normGrp = grp.replace(/[-_]/g, '')
        const normSlug = targetLavozim.slug.replace(/[-_]/g, '')
        return normGrp === normSlug
    })

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
                        <p className="text-2xl font-bold text-gray-900">{summary?.present?.count ?? onTimeCount}</p>
                        <div className="flex items-center gap-1 text-xs mt-0.5 text-emerald-600">
                            {(summary?.present?.trend_percentage ?? 18) >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            <span>{Math.abs(summary?.present?.trend_percentage ?? 18)}% o'tgan oyga nbt</span>
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
                        <p className="text-2xl font-bold text-gray-900">{summary?.late?.count ?? lateCount}</p>
                        <div className="flex items-center gap-1 text-xs mt-0.5 text-red-500">
                            {(summary?.late?.trend_percentage ?? 1) >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            <span>{Math.abs(summary?.late?.trend_percentage ?? 1)}% o'tgan oyga nbt</span>
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
                        <p className="text-2xl font-bold text-gray-900">{summary?.absent?.count ?? absentCount}</p>
                        {summary?.absent?.trend_percentage !== undefined && (
                            <div className="flex items-center gap-1 text-xs mt-0.5 text-gray-500">
                                {summary.absent.trend_percentage >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                <span>{Math.abs(summary.absent.trend_percentage)}% o'tgan oyga nbt</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Store cards row — drag to scroll horizontally */}
            {(() => {
                const displayCharts = [...charts]
                lavozimlar.forEach(lavozim => {
                    const exists = charts.some(c => 
                        (c.branch && c.branch.toLowerCase() === lavozim.slug?.toLowerCase()) || 
                        (c.name && c.name.toLowerCase() === lavozim.name?.toLowerCase())
                    )
                    if (!exists) {
                        displayCharts.push({
                            branch: lavozim.slug || String(lavozim.id),
                            name: lavozim.name,
                            percentage: 0
                        })
                    }
                })

                return (
                    <DragToScrollCarousel className="pb-2">
                        {displayCharts.map((chart, idx) => {
                            const colors = ["#f97316", "#22c55e", "#a855f7", "#3b82f6", "#ec4899", "#06b6d4", "#eab308"];
                            const color = colors[idx % colors.length];
                            return (
                                <div key={chart.branch} className="w-[300px] sm:w-[350px] flex-shrink-0 snap-start">
                                    <StoreCard
                                        title={chart.name}
                                        subtitle={`${chart.name} davomat foizi`}
                                        percentage={chart.percentage ?? 0}
                                        color={color}
                                        onClick={() => setModal(chart.branch)}
                                    />
                                </div>
                            );
                        })}
                    </DragToScrollCarousel>
                )
            })()}

            {/* Employees table */}
            <EmployeesTable 
                attendances={filteredAttendances} 
                loading={loading} 
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                search={search}
                onSearchChange={setSearch}
                filter={filter}
                onFilterChange={setFilter}
                filterOptions={['Barchasi', ...lavozimlar.map(l => l.name)]}
                onWorkerClick={setSelectedWorkerId}
            />

            {/* Modals */}
            <EmployeeModal
                open={modal !== null}
                onClose={() => setModal(null)}
                type={modal}
                attendances={modalEmployees()}
            />

            {/* Employee Profile Modal */}
            <EmployeeProfileModal
                open={selectedWorkerId !== null}
                onClose={() => setSelectedWorkerId(null)}
                workerId={selectedWorkerId}
                onUpdate={refetchAttendances}
            />
        </div>
    )
}
