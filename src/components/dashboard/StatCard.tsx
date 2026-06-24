import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
    label: string
    count: number
    trend?: { value: string; direction: 'up' | 'down' }
    icon?: ReactNode
    profileImage?: string
    avatars?: string[]
    onClick?: () => void
}

export default function StatCard({ label, count, trend, icon, profileImage, avatars, onClick }: StatCardProps) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-4 bg-white rounded-xl px-5 py-4 flex-1 min-w-0 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''
                }`}
        >
            {/* Icon or Profile Image */}
            {profileImage ? (
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <img src={profileImage} alt="" className="w-8 h-8" />
                </div>
            ) : (
                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    {icon}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs mt-0.5 ${trend.direction === 'up' ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                        {trend.direction === 'up'
                            ? <TrendingUp size={11} />
                            : <TrendingDown size={11} />
                        }
                        <span>{trend.value} o'tgan oyga nbt</span>
                    </div>
                )}
                {avatars && (
                    <div className="flex -space-x-1.5 mt-1">
                        {avatars.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt=""
                                className="w-5 h-5 rounded-full border border-white object-cover"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
