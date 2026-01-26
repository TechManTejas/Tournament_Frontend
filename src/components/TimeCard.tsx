/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelSmall from "../assets/images/panel_small.png"
import Team1 from "../assets/images/team_1.png"

export interface TimeCardData {
    name?: string;
    logo?: string;
    minute?: number;
    team?: string;
    position?: string;
}

interface TimeCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    onDragStart?: (event: DraggableEvent, data: DraggableData) => void;
    onDragStop?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
    data?: TimeCardData;
    className?: string;
    showTeamInfo?: boolean;
}

const TimeCard: React.FC<TimeCardProps> = ({
    onDrag,
    onDragStart,
    onDragStop,
    x,
    y,
    isLive = false,
    data,
    className = '',
    showTeamInfo = false,
}) => {
    const isDraggable = typeof x === 'undefined' || typeof y === 'undefined';

    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // Function to set the initial position based on the parent's dimensions
    const calculateInitialPosition = useCallback(() => {
        const parentWidth = window.innerWidth;
        const parentHeight = window.innerHeight;

        const cardWidth = 580;
        const cardHeight = 180;

        const initialX = Math.max(0, (parentWidth - cardWidth) / 2);
        const initialY = Math.max(0, (parentHeight - cardHeight) / 2);

        setInitialPosition({ x: initialX - 32, y: initialY - 30 });
    }, []);

    // Calculate the initial position when the component mounts
    useEffect(() => {
        if (data) {
            console.log('TimeCard data:', data);
        }
        calculateInitialPosition();

        // Recalculate on window resize
        const handleResize = () => {
            if (isDraggable) {
                calculateInitialPosition();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateInitialPosition, isDraggable, data]);

    const handleDragStart = useCallback((event: DraggableEvent, dragData: DraggableData) => {
        setIsDragging(true);
        if (onDragStart) {
            onDragStart(event, dragData);
        }
    }, [onDragStart]);

    const handleDrag = useCallback((event: DraggableEvent, dragData: DraggableData) => {
        if (onDrag) {
            onDrag(event, dragData);
        }
    }, [onDrag]);

    const handleDragStop = useCallback((event: DraggableEvent, dragData: DraggableData) => {
        setIsDragging(false);
        if (onDragStop) {
            onDragStop(event, dragData);
        }
    }, [onDragStop]);

    const getPlayerName = (): string => {
        return data?.name || 'Player Name';
    };

    const getPlayerLogo = (): string => {
        return data?.logo || Team1;
    };

    const getMinute = (): string => {
        if (data?.minute !== undefined) {
            return `${data.minute} MIN`;
        }
        return 'TIME MIN';
    };

    const formatMinute = (minute: number): string => {
        return `${minute} MIN`;
    };

    const playerName = getPlayerName();
    const playerLogo = getPlayerLogo();
    const minuteDisplay = getMinute();

    const cardContent = (
        <div className={`relative px-4 flex flex-col justify-center h-full ${className}`}>
            <div className='flex justify-between items-center text-white text-xl mx-8'>
                <img
                    src={playerLogo}
                    alt={`${playerName} logo`}
                    className='w-12 h-12 rounded object-cover'
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = Team1;
                    }}
                />
                <div className='flex flex-col items-center flex-grow mx-4'>
                    <div className='font-semibold'>{playerName}</div>
                    {showTeamInfo && data?.team && (
                        <div className='text-sm text-gray-300'>{data.team}</div>
                    )}
                    {showTeamInfo && data?.position && (
                        <div className='text-xs text-gray-400'>{data.position}</div>
                    )}
                </div>
                <div className='rounded bg-black bg-opacity-30 px-3 py-1 font-bold'>
                    {data?.minute !== undefined ? formatMinute(data.minute) : minuteDisplay}
                </div>
            </div>
        </div>
    );

    const cardClassName = `w-[580px] h-[180px] rounded ${
        isLive ? 'border-green-500 border-4' : 'border-red-500 border-4'
    } ${isDragging ? 'opacity-90' : ''} ${className}`;

    return (
        <>
            {isDraggable ? (
                <Draggable
                    bounds="parent"
                    onDrag={handleDrag}
                    onStart={handleDragStart}
                    onStop={handleDragStop}
                    defaultPosition={initialPosition}
                >
                    <div
                        className={`absolute ${cardClassName}`}
                        style={{
                            backgroundImage: `url(${PanelSmall})`,
                            backgroundSize: 'cover',
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                    >
                        {cardContent}
                    </div>
                </Draggable>
            ) : (
                <div
                    className={cardClassName}
                    style={{
                        position: 'absolute',
                        left: `${x}px`,
                        top: `${y}px`,
                        backgroundImage: `url(${PanelSmall})`,
                        backgroundSize: 'cover',
                    }}
                >
                    {cardContent}
                </div>
            )}
        </>
    );
};

export default TimeCard;
