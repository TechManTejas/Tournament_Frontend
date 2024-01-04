import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelSmall from "../assets/images/panel_large.png"
import RefereeHead from "../assets/images/referee_head.png"
import RefereeAssistant from "../assets/images/referee_assistant.png"

interface RefereesCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
}

const RefereesCard: React.FC<RefereesCardProps> = ({ onDrag, x, y, isLive }) => {
    const isDraggable = typeof x === 'undefined' || typeof y === 'undefined';

    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

    // Function to set the initial position based on the parent's dimensions
    const calculateInitialPosition = () => {
        const parentWidth = window.innerWidth; // Replace this with the actual width of the parent component
        const parentHeight = window.innerHeight; // Replace this with the actual height of the parent component

        const cardWidth = 460; // Replace this with the width of your ScoreCard component
        const cardHeight = 280; // Replace this with the height of your ScoreCard component

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
                <Draggable bounds={"parent"} onDrag={onDrag} defaultPosition={initialPosition}>
                    <div className={`absolute w-[460px] h-[280px] rounded ${isLive ? 'border-green-500 border-4' : 'border-red-500 border-4'}`} style={{ backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                        {/* Your draggable box content goes here */}
                        <div className='relative px-4 flex flex-col gap-4 justify-center h-full '>
                            <div className='flex text-white justify-center text-2xl'>
                                Schiedsrichter
                            </div>
                            <div className='flex justify-center'>
                                <div>
                                    <div className='flex text-white justify-center text-lg'>
                                        <span><img src={RefereeHead} className='w-6'></img></span>Steffen Winkler
                                    </div>
                                    <div className='flex text-white justify-center text-lg'>
                                        <span><img src={RefereeAssistant} className='w-6'></img></span>Peter Wunderlich
                                    </div>
                                    <div className='flex text-white justify-center text-lg'>
                                        <span><img src={RefereeAssistant} className='w-6'></img></span>Jan Benzing
                                    </div>
                                    <div className='flex text-white justify-center text-lg'>
                                        <span><img src={RefereeAssistant} className='w-6'></img></span>Peter Wunderlich
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='flex text-white justify-center text-sm'>
                                    Powered by
                                </div>
                                <div className='flex text-white justify-center text-xl'>
                                    Mitutoyo
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            ) : (
                <div className='w-[460px] h-[280px]' style={{ left: `${x}px`, top: `${y}px`, backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                    {/* Your non-draggable box content goes here */}
                    <div className='relative px-4 flex flex-col gap-4 justify-center h-full '>
                            <div className='flex text-white justify-center text-2xl'>
                                Schiedsrichter
                            </div>
                            <div className='flex justify-center'>
                                <div>
                                    <div className='flex text-white justify-center text-lg'>
                                        <span><img src={RefereeHead} className='w-6'></img></span>Steffen Winkler
                                    </div>
                                    <div className='flex text-white justify-center text-lg'>
                                        <span><img src={RefereeAssistant} className='w-6'></img></span>Peter Wunderlich
                                    </div>
                                    <div className='flex text-white justify-center text-lg'>
                                        <span><img src={RefereeAssistant} className='w-6'></img></span>Jan Benzing
                                    </div>
                                    <div className='flex text-white justify-center text-lg'>
                                        <span><img src={RefereeAssistant} className='w-6'></img></span>Peter Wunderlich
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='flex text-white justify-center text-sm'>
                                    Powered by
                                </div>
                                <div className='flex text-white justify-center text-xl'>
                                    Mitutoyo
                                </div>
                            </div>
                        </div>
                </div>
            )}
        </>
    );
};

export default RefereesCard;
