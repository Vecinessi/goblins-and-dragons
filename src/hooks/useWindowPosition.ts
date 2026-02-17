import { useState, useEffect, useRef } from 'react';
import type { WindowState } from '../types';

interface UseWindowPositionProps {
    windowState: WindowState;
    initialPosition?: { x: number; y: number };
}

export function useWindowPosition({
    windowState,
    initialPosition = { x: 100, y: 100 }
}: UseWindowPositionProps) {
    const [savedPosition, setSavedPosition] = useState(initialPosition);

    const windowRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const currentPos = useRef(savedPosition);

    // Sync ref with saved state
    useEffect(() => {
        currentPos.current = savedPosition;
    }, [savedPosition]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (windowState === 'MINIMIZED') return;

        isDragging.current = true;

        // CRITICAL OPTIMIZATION: Manually unset transition to ensure ZERO delay.
        if (windowRef.current) {
            windowRef.current.style.transition = 'none';
            windowRef.current.style.zIndex = '100'; // Bring to front while dragging
        }

        dragStartOffset.current = {
            x: e.clientX - currentPos.current.x,
            y: e.clientY - currentPos.current.y
        };

        document.body.style.userSelect = 'none';
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !windowRef.current) return;

            let newX = e.clientX - dragStartOffset.current.x;
            let newY = e.clientY - dragStartOffset.current.y;

            const maxX = window.innerWidth - 100; // Allow partial off-screen
            const maxY = window.innerHeight - 50;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            windowRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
            currentPos.current = { x: newX, y: newY };
        };

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false;

                // Restore transition for smooth minimizes
                if (windowRef.current) {
                    windowRef.current.style.transition = 'all 300ms ease-in-out';
                    windowRef.current.style.zIndex = '';
                }

                document.body.style.userSelect = '';
                setSavedPosition(currentPos.current);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const isMinimized = windowState === 'MINIMIZED';

    const style: React.CSSProperties = isMinimized
        ? { transition: 'all 300ms ease-in-out' }
        : {
            transform: `translate3d(${savedPosition.x}px, ${savedPosition.y}px, 0)`,
            transition: 'all 300ms ease-in-out'
        };

    return {
        windowRef,
        style,
        handleMouseDown,
        isMinimized
    };
}
