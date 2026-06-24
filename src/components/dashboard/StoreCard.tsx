import DonutChart from './DonutChart'

interface StoreCardProps {
    title: string
    subtitle: string
    percentage: number
    color: string
    onClick?: () => void
}

export default function StoreCard({ title, subtitle, percentage, color, onClick }: StoreCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl p-5 flex-1 min-w-0 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
                }`}
        >
            <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{title}</h3>
            <p className="text-xs text-gray-400 mb-5">{subtitle}</p>
            <div className="flex justify-center">
                <DonutChart percentage={percentage} color={color} />
            </div>
        </div>
    )
}
