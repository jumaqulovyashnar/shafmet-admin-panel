import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, UserPlus,
  ShoppingCart, MapPin, Building2, Menu, ChevronRight, LogOut,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import useUserStore from '@/stores/userStore'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  { label: 'Asosiy Sahifa', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
  { label: 'Topshiriqlar', icon: <ClipboardList size={18} />, href: '/tasks' },
  { label: "Ishchi Qo'shish", icon: <UserPlus size={18} />, href: '/employees' },
  { label: 'Tolovlar', icon: <ShoppingCart size={18} />, href: '/payments' },
  { label: 'Geolokatsiya', icon: <MapPin size={18} />, href: '/geo' },
  { label: "Maxsus Bo'lim", icon: <Building2 size={18} />, href: '/departments' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const userInfo = useUserStore((s) => s.userInfo)
  const clearUserInfoAndToken = useUserStore((s) => s.actions.clearUserInfoAndToken)

  const handleLogout = () => {
    clearUserInfoAndToken()
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-100 flex flex-col h-full shrink-0 transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-56'
      )}
    >
      {/* Logo + collapse toggle */}
      <div className={cn(
        'h-14 flex items-center border-b border-gray-100 px-3 gap-2',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <span className="font-bold text-[15px] text-gray-900 flex-1 whitespace-nowrap">
            Admin Panel
          </span>
        )}

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors shrink-0"
          title={collapsed ? 'Kengaytirish' : 'Qisqartirish'}
        >
          <Menu size={15} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-medium transition-all',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Promo banner */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl bg-linear-to-br from-blue-600 to-violet-600 p-3 text-white">
          <p className="text-[11px] font-medium leading-tight mb-2">
            yangi funksiyalar tez orada ochiladi !
          </p>
          <button className="w-full h-7 bg-white text-blue-600 text-[11px] font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            Bog'lanish
          </button>
        </div>
      )}

      {/* User info with logout */}
      <div className="border-t border-gray-100 px-2 py-3">
        {/* User button */}
        <button
          onClick={() => setShowLogout(!showLogout)}
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
              {(userInfo?.name ?? 'Ad').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-semibold text-gray-800 truncate">
                  {userInfo?.name ?? 'Admin'}
                </p>
              </div>
              <ChevronRight
                size={14}
                className={cn(
                  'text-gray-400 transition-transform shrink-0',
                  showLogout && 'rotate-90'
                )}
              />
            </>
          )}
        </button>

        {/* Logout button - shown when expanded */}
        {showLogout && !collapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 mt-1 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={17} className="shrink-0" />
            <span>Chiqish</span>
          </button>
        )}
      </div>
    </aside>
  )
}
