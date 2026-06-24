import { Search, Calendar, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import useUserStore from '@/stores/userStore'
import { useLocation, Link } from 'react-router-dom'

interface Crumb { label: string; href?: string }

const deptLabels: Record<string, string> = {
    ichki: 'Ichki dokon ishchilari',
    tashqi: 'Tashqi dokon ishchilari',
    personallar: 'Personallar',
}

function getBreadcrumbs(pathname: string): Crumb[] {
    if (pathname === '/dashboard') return [{ label: 'Asosiy Sahifa' }]
    if (pathname === '/tasks') return [{ label: 'Topshiriqlar' }]
    if (pathname === '/payments') return [{ label: 'Tolovlar' }]
    if (pathname === '/geo') return [{ label: 'Geolokatsiya' }]
    if (pathname === '/departments') return [{ label: "Maxsus Bo'lim" }]

    if (pathname === '/employees') return [{ label: "Ishchi Qo'shish" }]

    const deptMatch = pathname.match(/^\/employees\/(\w+)$/)
    if (deptMatch) {
        const key = deptMatch[1]
        return [
            { label: "Ishchi Qo'shish", href: '/employees' },
            { label: deptLabels[key] ?? key },
        ]
    }

    return [{ label: 'Admin Panel' }]
}

export default function DashboardHeader() {
    const userInfo = useUserStore((s) => s.userInfo)
    const location = useLocation()
    const userName = userInfo?.name ?? 'Admin'
    const crumbs = getBreadcrumbs(location.pathname)

    return (
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[14px] font-semibold">
                {crumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                        {i > 0 && (
                            <span className="text-gray-400 font-normal text-[16px] leading-none">›</span>
                        )}
                        {crumb.href ? (
                            <Link
                                to={crumb.href}
                                className="text-gray-400 font-medium hover:text-blue-600 transition-colors text-[13px]"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-gray-800">{crumb.label}</span>
                        )}
                    </span>
                ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* Filtr */}
                <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 h-8 hover:bg-gray-50 transition-colors">
                    <Calendar size={13} className="text-gray-400" />
                    <span>Filtr oylik</span>
                    <ChevronDown size={11} />
                </button>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                        type="text"
                        placeholder="Qidirish"
                        className="h-8 pl-8 pr-3 text-[12px] border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors w-40"
                    />
                </div>

                {/* Avatar - faqat display */}
                <div className="flex items-center gap-2 px-1 py-1">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-[11px] font-bold bg-blue-600 text-white">
                            {userName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] text-gray-700 font-semibold hidden sm:block">{userName}</span>
                </div>
            </div>
        </header>
    )
}
