import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    ClipboardList,
    UserPlus,
    ShoppingCart,
    MapPin,
    Building2,
    MessageSquare,
    Settings,
    ChevronDown,
    ChevronRight,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import useUserStore from '@/stores/userStore'
import { cn } from '@/lib/utils'

interface NavItem {
    label: string
    icon: React.ReactNode
    href?: string
    children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
    { label: 'Asosiy Sahifa', icon: <LayoutDashboard size={16} />, href: '/dashboard' },
    {
        label: 'Topshiriqlar',
        icon: <ClipboardList size={16} />,
        children: [{ label: "Barcha topshiriqlar", href: '/tasks' }],
    },
    {
        label: "Ishchi Qo'shish",
        icon: <UserPlus size={16} />,
        children: [{ label: "Xodim qo'shish", href: '/employees/add' }],
    },
    {
        label: 'Tolovlar',
        icon: <ShoppingCart size={16} />,
        children: [{ label: 'Barcha to\'lovlar', href: '/payments' }],
    },
    { label: 'Geolokatsiya', icon: <MapPin size={16} />, href: '/geo' },
    {
        label: "Maxsus Bo'lim",
        icon: <Building2 size={16} />,
        children: [{ label: "Bo'limlar", href: '/departments' }],
    },
    { label: 'Support', icon: <MessageSquare size={16} />, href: '/support' },
    { label: 'Sozlamalar', icon: <Settings size={16} />, href: '/settings' },
]

export default function Sidebar() {
    const location = useLocation()
    const [expanded, setExpanded] = useState<string | null>(null)
    const userInfo = useUserStore((s) => s.userInfo)

    const toggle = (label: string) => {
        setExpanded((prev) => (prev === label ? null : label))
    }

    return (
        <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
            {/* Logo */}
            <div className="h-14 flex items-center px-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full border-2 border-white" />
                    </div>
                    <span className="font-bold text-sm text-gray-900">Admin Panel</span>
                    <span className="text-[10px] text-gray-400">.uz</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-3 px-3">
                {navItems.map((item) => {
                    const isActive = item.href
                        ? location.pathname === item.href
                        : item.children?.some((c) => location.pathname === c.href)
                    const isOpen = expanded === item.label

                    return (
                        <div key={item.label} className="mb-0.5">
                            {item.href ? (
                                <Link
                                    to={item.href}
                                    className={cn(
                                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                                        isActive
                                            ? 'bg-blue-600 text-white font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggle(item.label)}
                                        className={cn(
                                            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                                            isActive
                                                ? 'text-blue-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        )}
                                    >
                                        {item.icon}
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                                    </button>
                                    {isOpen && item.children && (
                                        <div className="ml-7 mt-0.5 space-y-0.5">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    to={child.href}
                                                    className={cn(
                                                        'block px-3 py-1.5 rounded-lg text-xs transition-colors',
                                                        location.pathname === child.href
                                                            ? 'text-blue-600 font-medium bg-blue-50'
                                                            : 'text-gray-500 hover:bg-gray-100'
                                                    )}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* Promo banner */}
            <div className="mx-3 mb-3 rounded-xl bg-linear-to-br from-blue-600 to-violet-600 p-3 text-white">
                <p className="text-xs font-medium leading-tight mb-2">
                    yangi funksiyalar tez orada ochiladi !
                </p>
                <button className="w-full h-7 bg-white text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                    Bog'lanish
                </button>
            </div>

            {/* User profile */}
            <div className="border-t border-gray-100 px-3 py-3 flex items-center gap-2">
                <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {(userInfo?.name ?? 'Ad').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                        {userInfo?.name ?? 'Admin'}
                    </p>
                    <p className="text-[10px] text-gray-400">Manajer</p>
                </div>
                <ChevronDown size={12} className="text-gray-400" />
            </div>
        </aside>
    )
}
