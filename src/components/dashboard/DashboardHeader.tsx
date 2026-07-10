import { Menu } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useLavozimlar } from '@/hooks/useLavozimlar'
import type { Lavozim } from '@/hooks/useLavozimlar'

interface Crumb { label: string; href?: string }

const deptLabels: Record<string, string> = {
    all: 'Hammasi',
    ichki: 'Ichki dokon ishchilari',
    tashqi: 'Tashqi dokon ishchilari',
    personallar: 'Personallar',
    boss: 'Bosslar',
    manager: 'Menejerlar',
    worker: 'Ishchilar',
    admin: 'Adminlar',
}

function getBreadcrumbs(pathname: string, lavozimlar: Lavozim[]): Crumb[] {
    if (pathname === '/dashboard') return [{ label: 'Asosiy Sahifa' }]
    if (pathname === '/tasks') return [{ label: 'Topshiriqlar' }]
    if (pathname === '/geo') return [{ label: 'Geolokatsiya' }]
    if (pathname === '/schedules') return [{ label: 'Ish Jadvali' }]

    if (pathname === '/employees') return [{ label: "Lavozim qo'shish" }]

    const deptMatch = pathname.match(/^\/employees\/(\w+)$/)
    if (deptMatch) {
        const key = deptMatch[1]
        let label = deptLabels[key] ?? key
        
        if (key !== 'all' && lavozimlar.length > 0) {
            const lavozim = lavozimlar.find(l => String(l.id) === key || l.slug === key)
            if (lavozim) {
                label = lavozim.name
            }
        }

        return [
            { label: "Lavozim qo'shish", href: '/employees' },
            { label },
        ]
    }

    return [{ label: 'Admin Panel' }]
}

interface DashboardHeaderProps {
    onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const location = useLocation()
    const { lavozimlar } = useLavozimlar()
    const crumbs = getBreadcrumbs(location.pathname, lavozimlar)

    return (
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button 
                    onClick={onMenuClick}
                    className="md:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[14px] font-semibold overflow-hidden">
                {crumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                        {i > 0 && (
                            <span className="text-gray-400 font-normal text-[16px] leading-none">›</span>
                        )}
                        {crumb.href ? (
                            <Link
                                to={crumb.href}
                                className="text-gray-400 font-medium hover:text-[#64b5f6] transition-colors text-[13px]"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 truncate">{crumb.label}</span>
                        )}
                    </span>
                ))}
            </nav>
            </div>


        </header>
    )
}
