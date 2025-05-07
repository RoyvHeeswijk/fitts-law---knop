'use client';

import { useState, useEffect, useRef } from 'react';

interface Position {
    x: number;
    y: number;
}

export default function EvilButton() {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Function to get random position within container
    const getRandomPosition = () => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const container = containerRef.current.getBoundingClientRect();
        const button = buttonRef.current?.getBoundingClientRect();
        if (!button) return { x: 0, y: 0 };

        const maxX = container.width - button.width;
        const maxY = container.height - button.height;

        return {
            x: Math.random() * maxX,
            y: Math.random() * maxY,
        };
    };

    // Handle mouse movement
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current || !isVisible || isMoving) return;

        const button = buttonRef.current.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate distance between mouse and button center
        const buttonCenterX = button.left + button.width / 2;
        const buttonCenterY = button.top + button.height / 2;
        const distance = Math.sqrt(
            Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
        );

        // If mouse is within 100px of button, move it
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

    // Show button after 3 clicks on the container
    const handleContainerClick = () => {
        if (clickCount < 2) {
            setClickCount(prev => prev + 1);
        } else if (clickCount === 2) {
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
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-700">
                Press the button for a prize!
            </div>
            {isVisible && (
                <button
                    ref={buttonRef}
                    className={`absolute transition-all duration-300 ease-in-out px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 ${isMoving ? 'opacity-50' : 'opacity-100'
                        }`}
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: `scale(${isMoving ? 0.9 : 1})`,
                    }}
                    onClick={handleButtonClick}
                >
                    Try to click me!
                </button>
            )}
        </div>
    );
} 