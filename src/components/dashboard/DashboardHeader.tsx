import { Search, Calendar, ChevronDown, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useUserStore from '@/stores/userStore'
import { useNavigate } from 'react-router-dom'

interface DashboardHeaderProps {
    userName: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    const clearUserInfoAndToken = useUserStore((s) => s.actions.clearUserInfoAndToken)
    const navigate = useNavigate()

    const handleLogout = () => {
        clearUserInfoAndToken()
        navigate('/login')
    }

    return (
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left — greeting */}
            <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-800">
                    Salom {userName} 👋
                </h2>
            </div>

            {/* Right — filter + search + avatar */}
            <div className="flex items-center gap-3">
                {/* Filter oylik */}
                <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 h-8 hover:bg-gray-50 transition-colors">
                    <Calendar size={13} className="text-gray-400" />
                    <span>Filtr oylik</span>
                    <ChevronDown size={12} />
                </button>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                        type="text"
                        placeholder="Qidirish"
                        className="h-8 pl-8 pr-3 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-400 transition-colors w-44"
                    />
                </div>

                {/* User avatar + dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                            <Avatar className="w-7 h-7">
                                <AvatarFallback className="text-xs bg-blue-600 text-white">
                                    {userName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown size={12} className="text-gray-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                            <LogOut size={13} className="mr-2" />
                            Chiqish
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
