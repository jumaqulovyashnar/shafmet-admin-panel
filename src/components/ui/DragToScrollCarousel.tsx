import React, { useRef, useCallback, useEffect } from 'react'

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
        
        // Only respond to left click
        if (e.button !== 0) return

        isDown.current = true
        wasDragging.current = false
        startX.current = e.pageX
        scrollLeft.current = containerRef.current.scrollLeft
        
        containerRef.current.style.cursor = 'grabbing'
        containerRef.current.style.userSelect = 'none'
        containerRef.current.style.scrollBehavior = 'auto' // Instant response during dragging
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

    const handleClickCapture = useCallback((e: React.MouseEvent) => {
        if (wasDragging.current) {
            e.preventDefault()
            e.stopPropagation()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className={`flex gap-5 overflow-x-auto overflow-y-hidden no-scrollbar select-none ${className}`}
            style={{
                cursor: 'grab',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
            }}
            onMouseDown={handleMouseDown}
            onClickCapture={handleClickCapture}
        >
            {children}
        </div>
    )
}
