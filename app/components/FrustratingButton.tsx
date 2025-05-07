'use client';

import { useState, useEffect, useRef } from 'react';

interface Position {
    x: number;
    y: number;
}

export default function FrustratingButton() {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Function to get random position within container
    const getRandomPosition = () => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const container = containerRef.current;
        const button = buttonRef.current;
        if (!button) return { x: 0, y: 0 };

        const maxX = container.clientWidth - button.clientWidth;
        const maxY = container.clientHeight - button.clientHeight;

        return {
            x: Math.random() * maxX,
            y: Math.random() * maxY,
        };
    };

    // Handle mouse movement
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current || !isVisible || isMoving) return;

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Check if mouse is within 100px of the button
        const distance = Math.sqrt(
            Math.pow(mouseX - (rect.left + rect.width / 2), 2) +
            Math.pow(mouseY - (rect.top + rect.height / 2), 2)
        );

        if (distance < 100) {
            setIsMoving(true);
            setTimeout(() => {
                setPosition(getRandomPosition());
                setIsMoving(false);
            }, 100);
        }
    };

    // Handle button click
    const handleButtonClick = () => {
        setClickCount(prev => prev + 1);
        setIsVisible(false);
        setTimeout(() => {
            setPosition(getRandomPosition());
            setIsVisible(true);
        }, 1000);
    };

    // Handle container click
    const handleContainerClick = () => {
        if (clickCount < 3) {
            setClickCount(prev => prev + 1);
        } else if (clickCount === 3) {
            setIsVisible(true);
            setPosition(getRandomPosition());
        }
    };

    // Auto-hide button after 3 seconds
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isVisible) {
            timeout = setTimeout(() => {
                setIsVisible(false);
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [isVisible]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen bg-gray-100 cursor-pointer"
            onClick={handleContainerClick}
            onMouseMove={handleMouseMove}
        >
            <button
                ref={buttonRef}
                className={`absolute transition-all duration-300 ease-in-out px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${isMoving ? 'pointer-events-none' : ''}
          hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%)`,
                }}
                onClick={handleButtonClick}
            >
                Click me if you can!
            </button>
            <div className="absolute top-4 left-4 text-gray-600">
                Clicks needed: {3 - clickCount}
            </div>
        </div>
    );
} 