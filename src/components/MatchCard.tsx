/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelSmall from "../assets/images/panel_small.png"
import Team1 from "../assets/images/team_1.png"
import Team2 from "../assets/images/team_2.png"

interface TeamData {
    name?: string;
    logo?: string;
    score?: number;
    shortName?: string;
}

interface MatchCardData {
    teamA?: TeamData;
    teamB?: TeamData;
    matchDate?: Date | string;
    venue?: string;
    status?: string;
}

interface MatchCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    onDragStart?: (event: DraggableEvent, data: DraggableData) => void;
    onDragStop?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
    data?: MatchCardData;
    className?: string;
    showScore?: boolean;
    showVenue?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
    onDrag,
    onDragStart,
    onDragStop,
    x,
    y,
    isLive = false,
    data,
    className = '',
    showScore = false,
    showVenue = false,
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

    const handleDragStart = useCallback((event: DraggableEvent, data: DraggableData) => {
        setIsDragging(true);
        if (onDragStart) {
            onDragStart(event, data);
        }
    }, [onDragStart]);

    const handleDrag = useCallback((event: DraggableEvent, data: DraggableData) => {
        if (onDrag) {
            onDrag(event, data);
        }
    }, [onDrag]);

    const handleDragStop = useCallback((event: DraggableEvent, data: DraggableData) => {
        setIsDragging(false);
        if (onDragStop) {
            onDragStop(event, data);
        }
    }, [onDragStop]);

    const getTeamName = (team: TeamData | undefined, defaultName: string): string => {
        return team?.name || defaultName;
    };

    const getTeamLogo = (team: TeamData | undefined, defaultLogo: string): string => {
        return team?.logo || defaultLogo;
    };

    const getTeamScore = (team: TeamData | undefined): number | null => {
        return team?.score !== undefined ? team.score : null;
    };


    const teamAName = getTeamName(data?.teamA, "Team A Name");
    const teamBName = getTeamName(data?.teamB, "Team B Name");
    const teamALogo = getTeamLogo(data?.teamA, Team1);
    const teamBLogo = getTeamLogo(data?.teamB, Team2);
    const teamAScore = getTeamScore(data?.teamA);
    const teamBScore = getTeamScore(data?.teamB);

    const cardContent = (
        <div className={`relative px-4 flex flex-col justify-center h-full ${className}`}>
            <div className='flex justify-between items-center text-white text-xl'>
                <div className='flex flex-grow justify-around items-center'>
                    <img
                        src={teamALogo}
                        alt={`${teamAName} logo`}
                        className='w-12 h-full rounded'
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = Team1;
                        }}
                    />
                    <div className='text-center'>
                        <div className='font-semibold'>{teamAName}</div>
                        {showScore && teamAScore !== null && (
                            <div className='text-2xl font-bold mt-1'>{teamAScore}</div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center mx-4'>
                    <div className='text-3xl font-bold'>/</div>
                    {showScore && teamAScore !== null && teamBScore !== null && (
                        <div className='text-sm text-zinc-400 mt-1'>
                            {teamAScore} - {teamBScore}
                        </div>
                    )}
                </div>
                <div className='flex flex-grow justify-around items-center'>
                    <div className='text-center'>
                        <div className='font-semibold'>{teamBName}</div>
                        {showScore && teamBScore !== null && (
                            <div className='text-2xl font-bold mt-1'>{teamBScore}</div>
                        )}
                    </div>
                    <img
                        src={teamBLogo}
                        alt={`${teamBName} logo`}
                        className='w-12 h-full rounded'
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = Team2;
                        }}
                    />
                </div>
            </div>
            {showVenue && data?.venue && (
                <div className='flex justify-center items-center text-zinc-400 text-sm mt-2'>
                    <span>📍 {data.venue}</span>
                </div>
            )}
            {data?.status && (
                <div className='flex justify-center items-center text-zinc-400 text-xs mt-1'>
                    <span>{data.status}</span>
                </div>
            )}
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

export default MatchCard;
