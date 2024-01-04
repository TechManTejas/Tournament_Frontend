import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelSmall from "../assets/images/panel_small.png"


interface FreeTextCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
}

const FreeTextCard: React.FC<FreeTextCardProps> = ({ onDrag, x, y, isLive }) => {
    const isDraggable = typeof x === 'undefined' || typeof y === 'undefined';

    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

    // Function to set the initial position based on the parent's dimensions
    const calculateInitialPosition = () => {
        const parentWidth = window.innerWidth; // Replace this with the actual width of the parent component
        const parentHeight = window.innerHeight; // Replace this with the actual height of the parent component

        const cardWidth = 580; // Replace this with the width of your ScoreCard component
        const cardHeight = 180; // Replace this with the height of your ScoreCard component

        const initialX = (parentWidth - cardWidth) / 2;
        const initialY = (parentHeight - cardHeight) / 2;

        setInitialPosition({ x: initialX - 32, y: initialY - 30 });
    };

    // Calculate the initial position when the component mounts
    useState(() => {
        calculateInitialPosition();
    });

    return (
        <>
            {isDraggable ? (
                <Draggable bounds={"parent"} onDrag={onDrag} defaultPosition={initialPosition}>
                    <div className={`absolute w-[580px] h-[180px] rounded ${isLive ? 'border-green-500 border-4' : 'border-red-500 border-4'}`} style={{ backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                        {/* Your draggable box content goes here */}
                        <div className='relative px-4 flex flex-col justify-center h-full '>
                            <div className='flex justify-center items-center text-white text-xl mx-8'>
                                <div className=''>Free text one liner</div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            ) : (
                <div className='w-[580px] h-[180px]' style={{ left: `${x}px`, top: `${y}px`, backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                    {/* Your non-draggable box content goes here */}
                    <div className='relative px-4 flex flex-col justify-center h-full '>
                        <div className='flex justify-center items-center text-white text-xl mx-8'>
                            <div className=''>Free text one liner</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FreeTextCard;
