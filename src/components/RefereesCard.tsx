/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelSmall from "../assets/images/panel_large.png"
import RefereeHead from "../assets/images/referee_head.png"
import RefereeAssistant from "../assets/images/referee_assistant.png"

export interface Referee {
    name: string;
    role: 'head' | 'assistant';
    image?: string;
}

export interface RefereesCardData {
    referees?: Referee[];
    sponsor?: {
        label?: string;
        name?: string;
    };
}

interface RefereesCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    onDragStart?: (event: DraggableEvent, data: DraggableData) => void;
    onDragStop?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
    data?: RefereesCardData;
    className?: string;
}

const DEFAULT_REFEREES: Referee[] = [
    { name: 'Steffen Winkler', role: 'head' },
    { name: 'Peter Wunderlich', role: 'assistant' },
    { name: 'Jan Benzing', role: 'assistant' },
    { name: 'Peter Wunderlich', role: 'assistant' },
];

const DEFAULT_SPONSOR = {
    label: 'Powered by',
    name: 'Mitutoyo',
};

const RefereesCard: React.FC<RefereesCardProps> = ({
    onDrag,
    onDragStart,
    onDragStop,
    x,
    y,
    isLive = false,
    data,
    className = '',
}) => {
    const isDraggable = typeof x === 'undefined' || typeof y === 'undefined';

    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // Function to set the initial position based on the parent's dimensions
    const calculateInitialPosition = useCallback(() => {
        const parentWidth = window.innerWidth;
        const parentHeight = window.innerHeight;

        const cardWidth = 460;
        const cardHeight = 280;

        const initialX = Math.max(0, (parentWidth - cardWidth) / 2);
        const initialY = Math.max(0, (parentHeight - cardHeight) / 2);

        setInitialPosition({ x: initialX - 32, y: initialY - 30 });
    }, []);

    // Calculate the initial position when the component mounts
    useEffect(() => {
        calculateInitialPosition();

        // Recalculate on window resize
        const handleResize = () => {
            if (isDraggable) {
                calculateInitialPosition();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateInitialPosition, isDraggable]);

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

    const getReferees = (): Referee[] => {
        return data?.referees && data.referees.length > 0
            ? data.referees
            : DEFAULT_REFEREES;
    };

    const getSponsor = () => {
        return data?.sponsor || DEFAULT_SPONSOR;
    };

    const getRefereeImage = (referee: Referee): string => {
        if (referee.image) {
            return referee.image;
        }
        return referee.role === 'head' ? RefereeHead : RefereeAssistant;
    };

    const referees = getReferees();
    const sponsor = getSponsor();

    const cardContent = (
        <div className={`relative px-4 flex flex-col gap-4 justify-center h-full ${className}`}>
            <div className='flex text-white justify-center text-2xl font-semibold'>
                Schiedsrichter
            </div>
            <div className='flex justify-center'>
                <div className='space-y-2'>
                    {referees.map((referee, index) => (
                        <div key={`${referee.name}-${index}`} className='flex text-white justify-center text-lg items-center gap-2'>
                            <span>
                                <img
                                    src={getRefereeImage(referee)}
                                    alt={`${referee.role} referee`}
                                    className='w-6 h-6 object-cover'
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = referee.role === 'head' ? RefereeHead : RefereeAssistant;
                                    }}
                                />
                            </span>
                            <span className='font-medium'>{referee.name}</span>
                            {referee.role === 'head' && (
                                <span className='text-xs text-gray-300'>(Head)</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {sponsor && (
                <div>
                    {sponsor.label && (
                        <div className='flex text-white justify-center text-sm text-gray-300'>
                            {sponsor.label}
                        </div>
                    )}
                    {sponsor.name && (
                        <div className='flex text-white justify-center text-xl font-bold'>
                            {sponsor.name}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const cardClassName = `w-[460px] h-[280px] rounded ${
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

export default RefereesCard;
