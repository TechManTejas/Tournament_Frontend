/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelSmall from "../assets/images/panel_small.png"

interface ScoreCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
    data?: any;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ onDrag, x, y, isLive, data }) => {
    console.log(data)
    const teamA = data?.teamA
    const teamB = data?.teamB

    const isDraggable = typeof x === 'undefined' || typeof y === 'undefined';

    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

    // Function to set the initial position based on the parent's dimensions
    const calculateInitialPosition = () => {
        const parentWidth = window.innerWidth; // Replace this with the actual width of the parent component
        const parentHeight = window.innerHeight; // Replace this with the actual height of the parent component

        const cardWidth = 320; // Replace this with the width of your ScoreCard component
        const cardHeight = 96; // Replace this with the height of your ScoreCard component

        const initialX = (parentWidth - cardWidth) / 2;
        const initialY = (parentHeight - cardHeight) / 2;

        setInitialPosition({ x: initialX - 32, y: initialY - 30});
    };

    // Calculate the initial position when the component mounts
    useState(() => {
        calculateInitialPosition();
    });

    return (
        <>
            {isDraggable ? (
                <>
                    <Draggable bounds={"parent"} onDrag={onDrag} defaultPosition={initialPosition}>
                        <div className={`absolute w-[320px] h-[96px] rounded ${isLive ? 'border-green-500 border-4' : 'border-red-500 border-4'}`} style={{ backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                            {/* Your draggable box content goes here */}
                            <div className='relative px-4 flex flex-col justify-center h-full text-white text-xl'>
                                <div className='flex justify-center w-full'>
                                    00 : 00
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex flex-grow justify-around'>
                                        <div className='w-2 h-full bg-blue-500 rounded' />
                                        <div className=''>{teamA?.shortName ?? 'A'}</div>
                                        <div className=''>0</div>
                                    </div>
                                    <div>
                                        -
                                    </div>
                                    <div className='flex flex-grow justify-around'>
                                        <div className=''>0</div>
                                        <div className=''>{teamB?.shortName ?? 'B'}</div>
                                        <div className='w-2 bg-red-500 rounded' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </>
            ) : (
                <div className='w-[320px] h-[96px]' style={{ left: `${x}px`, top: `${y}px`, backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                    {/* Your non-draggable box content goes here */}
                    <div className='relative px-4 flex flex-col justify-center h-full text-white text-xl'>
                        <div className='flex justify-center w-full'>
                            09 : 17
                        </div>
                        <div className='flex justify-between'>
                            <div className='flex flex-grow justify-around'>
                                <div className={`w-2 h-full rounded`} style={{backgroundColor: teamA?.color}}/>
                                <div className=''>{teamA?.shortName ?? 'A'}</div>
                                <div className=''>{teamA?.score ?? '0'}</div>
                            </div>
                            <div>
                                -
                            </div>
                            <div className='flex flex-grow justify-around'>
                                <div className=''>{teamB?.score ?? '0'}</div>
                                <div className=''>{teamB?.shortName ?? 'A'}</div>
                                <div className={`w-2 h-full rounded`} style={{backgroundColor: teamB?.color}}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ScoreCard;
