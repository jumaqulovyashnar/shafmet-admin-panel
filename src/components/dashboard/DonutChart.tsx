interface DonutChartProps {
    percentage: number
    color: string
    size?: number
    strokeWidth?: number
}

export default function DonutChart({
    percentage,
    color,
    size = 120,
    strokeWidth = 14,
}: DonutChartProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference
    const center = size / 2

    return (
        <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="transition-transform duration-500 group-hover:rotate-180"
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Background track */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#f0f0f0"
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{percentage}%</span>
                <span className="text-[10px] text-gray-500 text-center leading-tight mt-0.5 px-3 max-w-[85px]">
                    Bajarilgan
                </span>
            </div>
        </div>
    )
}
