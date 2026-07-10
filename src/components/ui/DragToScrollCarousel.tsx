import React, { useRef, useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DragToScrollCarouselProps {
    children: React.ReactNode
    className?: string
}

export default function DragToScrollCarousel({ children, className = '' }: DragToScrollCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)
    
    const isDown = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)
    const wasDragging = useRef(false)
    const dragThreshold = 5 // pixels

    const updateArrows = useCallback(() => {
        if (!containerRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
        
        // Show left arrow if scrolled more than 5px
        setShowLeftArrow(scrollLeft > 5)
        
        // Show right arrow if there is remaining content to scroll
        // Adding a 5px buffer to handle subpixel rounding issues
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5)
    }, [])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        
        // Initialize arrow visibility
        updateArrows()
        
        // Listen to scroll events
        el.addEventListener('scroll', updateArrows)
        window.addEventListener('resize', updateArrows)
        
        return () => {
            el.removeEventListener('scroll', updateArrows)
            window.removeEventListener('resize', updateArrows)
        }
    }, [updateArrows])

    // Update arrows whenever children change (e.g. data is loaded)
    useEffect(() => {
        // Wait a small timeout to let the browser recalculate layout sizes
        const timer = setTimeout(updateArrows, 100)
        return () => clearTimeout(timer)
    }, [children, updateArrows])

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        
        // Only respond to left click
        if (e.button !== 0) return

        isDown.current = true
        wasDragging.current = false
        startX.current = e.pageX
        scrollLeft.current = containerRef.current.scrollLeft
        
        containerRef.current.style.cursor = 'grabbing'
        containerRef.current.style.userSelect = 'none'
        containerRef.current.style.scrollBehavior = 'auto' // Instant response during dragging
        containerRef.current.style.scrollSnapType = 'none' // Disable snapping during drag
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown.current || !containerRef.current) return
            
            const walk = e.pageX - startX.current
            
            if (Math.abs(walk) > dragThreshold) {
                wasDragging.current = true
            }
            
            // Scroll container based on mouse movement delta
            containerRef.current.scrollLeft = scrollLeft.current - walk
        }

        const handleMouseUp = () => {
            if (!isDown.current) return
            isDown.current = false
            
            if (containerRef.current) {
                containerRef.current.style.cursor = 'grab'
                containerRef.current.style.removeProperty('user-select')
                containerRef.current.style.scrollBehavior = 'smooth' // Restore smooth scrolling
                containerRef.current.style.scrollSnapType = 'x mandatory' // Re-enable snapping after release
            }

            // Keep wasDragging active for the click event tick
            setTimeout(() => {
                wasDragging.current = false
            }, 0)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const scrollByAmount = (direction: 'left' | 'right') => {
        if (!containerRef.current) return
        const { clientWidth } = containerRef.current
        const scrollAmount = clientWidth * 0.75
        
        containerRef.current.scrollTo({
            left: containerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
            behavior: 'smooth'
        })
    }

    const handleClickCapture = useCallback((e: React.MouseEvent) => {
        if (wasDragging.current) {
            e.preventDefault()
            e.stopPropagation()
        }
    }, [])

    return (
        <div className="relative group w-full">
            {/* Left navigation arrow button (appears on hover) */}
            <button
                type="button"
                onClick={() => scrollByAmount('left')}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-md border border-gray-100 text-gray-700 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer ${
                    showLeftArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-label="Scroll left"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Main scrollable container */}
            <div
                ref={containerRef}
                className={`flex gap-5 overflow-x-auto overflow-y-hidden no-scrollbar select-none snap-x snap-mandatory ${className}`}
                style={{
                    cursor: 'grab',
                    WebkitOverflowScrolling: 'touch',
                }}
                onMouseDown={handleMouseDown}
                onClickCapture={handleClickCapture}
            >
                {children}
                {/* Scroll spacer to prevent last item shadow clipping */}
                <div className="w-5 flex-shrink-0" aria-hidden="true" />
            </div>

            {/* Right navigation arrow button (appears on hover) */}
            <button
                type="button"
                onClick={() => scrollByAmount('right')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-md border border-gray-100 text-gray-700 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer ${
                    showRightArrow ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-label="Scroll right"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    )
}
