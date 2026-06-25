import { Search, Calendar, ChevronDown, X } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

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
    const location = useLocation()
    const crumbs = getBreadcrumbs(location.pathname)
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')
    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
        }

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showCalendar])

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
                                className="text-gray-400 font-medium hover:text-[#64b5f6] transition-colors text-[13px]"
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
            <div className="flex items-center gap-3 mr-12">
                {/* Filtr with date picker */}
                <div className="relative" ref={calendarRef}>
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="flex items-center gap-2 text-[13px] text-gray-500 border border-gray-200 rounded-xl px-5 h-9 hover:bg-gray-50 transition-colors min-w-[160px] cursor-pointer"
                    >
                        <Calendar size={14} />
                        <span>{selectedDate || 'Sana tanlang'}</span>
                    </button>

                    {showCalendar && (
                        <div className="absolute top-[calc(100%+5px)] left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50 min-w-[280px]">
                            <input
                                type="date"
                                className="w-full text-[13px] text-gray-700 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value)
                                    setShowCalendar(false)
                                }}
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="Qidirish"
                        className="h-9 pl-9 pr-4 text-[13px] border border-gray-200 rounded-xl outline-none focus:border-[#64b5f6] transition-colors w-56"
                    />
                </div>
            </div>
        </header>
    )
}
