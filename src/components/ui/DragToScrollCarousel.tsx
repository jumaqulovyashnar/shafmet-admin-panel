import React, { useRef, useCallback } from 'react'

interface DragToScrollCarouselProps {
    children: React.ReactNode
    className?: string
}

export default function DragToScrollCarousel({ children, className = '' }: DragToScrollCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isDown = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)
    const wasDragging = useRef(false)
    const dragThreshold = 5 // pixels

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        isDown.current = true
        wasDragging.current = false
        startX.current = e.pageX - containerRef.current.offsetLeft
        scrollLeft.current = containerRef.current.scrollLeft
        containerRef.current.style.cursor = 'grabbing'
        containerRef.current.style.userSelect = 'none'
        containerRef.current.style.scrollBehavior = 'auto' // Disable smooth scrolling during manual drag for natural responsiveness
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDown.current || !containerRef.current) return
        
        const x = e.pageX - containerRef.current.offsetLeft
        const walk = x - startX.current
        
        if (Math.abs(walk) > dragThreshold) {
            wasDragging.current = true
        }
        
        // Scroll the container in the opposite direction of the drag (natural feel)
        containerRef.current.scrollLeft = scrollLeft.current - walk
    }

    const handleMouseUpOrLeave = () => {
        if (!isDown.current || !containerRef.current) return
        isDown.current = false
        containerRef.current.style.cursor = 'grab'
        containerRef.current.style.removeProperty('user-select')
        containerRef.current.style.scrollBehavior = 'smooth' // Restore smooth scroll behavior

        // Clear wasDragging flag in the next tick to allow click capture to run first
        setTimeout(() => {
            wasDragging.current = false
        }, 0)
    }

    // Intercept and prevent click events on child elements if the user was dragging
    const handleClickCapture = useCallback((e: React.MouseEvent) => {
        if (wasDragging.current) {
            e.preventDefault()
            e.stopPropagation()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className={`flex gap-5 overflow-x-auto overflow-y-hidden no-scrollbar select-none active:cursor-grabbing ${className}`}
            style={{
                cursor: 'grab',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onClickCapture={handleClickCapture}
        >
            {children}
        </div>
    )
}
