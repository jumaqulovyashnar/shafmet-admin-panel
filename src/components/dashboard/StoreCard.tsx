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
            className={`bg-white rounded-[20px] p-6 flex-1 min-w-0 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''
                }`}
        >
            <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
            <div className="flex justify-center">
                <DonutChart percentage={percentage} color={color} />
            </div>
        </div>
    )
}
