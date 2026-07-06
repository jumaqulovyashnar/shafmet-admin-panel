import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu, LogOut, Users, Clock,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import useUserStore from '@/stores/userStore'
import { cn } from '@/lib/utils'
import { icons } from '@/api/constant/icons'
import MyProfileModal from '@/components/dashboard/MyProfileModal'

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  { label: 'Asosiy Sahifa', icon: <img src={icons.key} alt="" className="w-5 h-5 object-contain" />, href: '/dashboard' },
  { label: 'Topshiriqlar', icon: <img src={icons.box} alt="" className="w-5 h-5 object-contain" />, href: '/tasks' },
  { label: "Ishchi Qo'shish", icon: <Users size={20} className="w-5 h-5" />, href: '/employees' },
  { label: 'Tolovlar', icon: <img src={icons.wallet} alt="" className="w-5 h-5 object-contain" />, href: '/payments' },
  { label: 'Geolokatsiya', icon: <img src={icons.circle} alt="" className="w-5 h-5 object-contain" />, href: '/geo' },
  { label: 'Ish Jadvali', icon: <Clock size={20} className="w-5 h-5" />, href: '/schedules' },
  { label: "Maxsus Bo'lim", icon: <img src={icons.support} alt="" className="w-5 h-5 object-contain" />, href: '/departments' },
]

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const userInfo = useUserStore((s) => s.userInfo)
  const clearUserInfoAndToken = useUserStore((s) => s.actions.clearUserInfoAndToken)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    clearUserInfoAndToken()
    navigate('/login')
  }

  return (
    <>
    {/* Mobile Overlay */}
    {isMobileOpen && (
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
        onClick={() => setIsMobileOpen?.(false)}
      />
    )}

    <aside
      className={cn(
        'bg-white border-r border-gray-100 flex flex-col h-full shrink-0 transition-all duration-300 relative z-50',
        'fixed md:static inset-y-0 left-0 shadow-2xl md:shadow-none',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Logo + collapse toggle */}
      <div className={cn(
        'h-14 flex items-center border-b border-gray-100 px-3 gap-2',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src={icons.main1} alt="" className="w-6 h-6" />
            <span className="font-bold text-[15px] text-gray-900 flex-1 whitespace-nowrap">
              Admin Panel
            </span>
          </div>
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
                  ? 'bg-[#1976d2] text-white shadow-sm [&_img]:brightness-0 [&_img]:invert [&_svg]:stroke-white'
                  : 'text-gray-500 hover:bg-[#1976d2]/10 hover:text-gray-800'
              )}
            >
              <span className="shrink-0 flex items-center justify-start w-5 h-5">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer Area: Logout + User Info */}
      <div className="px-2 py-3">
        {/* Logout button */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Chiqish' : undefined}
          className={cn(
            'w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-gray-500 hover:text-red-500 bg-gray-50/40 hover:bg-red-50 border border-gray-200/30 hover:border-red-100/50 mb-[70px] cursor-pointer group',
            collapsed && 'justify-center px-0'
          )}
        >
          <span className="shrink-0 flex items-center justify-center w-5 h-5">
            <LogOut size={20} className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
          </span>
          {!collapsed && <span className="truncate">Chiqish</span>}
        </button>

        {/* User info */}
        <div
          onClick={() => setProfileOpen(true)}
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="bg-[#1976d2] text-white text-xs font-semibold">
              {(userInfo?.name ?? 'Ad').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-semibold text-gray-800 truncate">
                {userInfo?.name ?? 'Admin'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
      <MyProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  )
}
