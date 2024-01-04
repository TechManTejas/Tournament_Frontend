import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelSmall from "../assets/images/panel_small.png"
import Team1 from "../assets/images/team_1.png"
import Team2 from "../assets/images/team_2.png"


interface GoalScorerCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
}

const GoalScorerCard: React.FC<GoalScorerCardProps> = ({ onDrag, x, y, isLive }) => {
    const isDraggable = typeof x === 'undefined' || typeof y === 'undefined';

    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

    // Function to set the initial position based on the parent's dimensions
    const calculateInitialPosition = () => {
        const parentWidth = window.innerWidth; // Replace this with the actual width of the parent component
        const parentHeight = window.innerHeight; // Replace this with the actual height of the parent component

        const cardWidth = 640; // Replace this with the width of your ScoreCard component
        const cardHeight = 200; // Replace this with the height of your ScoreCard component

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
                    <div className={`absolute w-[640px] h-[200px] rounded ${isLive ? 'border-green-500 border-4' : 'border-red-500 border-4'}`} style={{ backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                        {/* Your draggable box content goes here */}
                        <div className='relative flex flex-col justify-center h-full '>
                            <div className='flex justify-between items-start text-white text-xl'>
                                <div className='flex flex-grow justify-around items-start'>
                                    <img src={Team1} className='w-12 h-full rounded' />
                                    <div>
                                        <div className=''>Everton FC</div>
                                        <div className='text-sm'>
                                            <div>
                                                A. Schulz - 12 , 40
                                            </div>
                                            <div>
                                                P. Wunderlich - 16
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-2xl font-semibold'>
                                    3:2
                                </div>
                                <div className='flex flex-grow justify-around items-start'>
                                    <div>
                                        <div className=''>VfB Stuttgart</div>
                                        <div className='text-sm'>
                                            <div>
                                                S. Winkler - 12 , 40
                                            </div>
                                        </div>
                                    </div>
                                    <img src={Team2} className='w-12 h-full rounded' />
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            ) : (
                <div className='w-[640px] h-[200px]' style={{ left: `${x}px`, top: `${y}px`, backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                    {/* Your non-draggable box content goes here */}
                    <div className='relative flex flex-col justify-center h-full '>
                        <div className='flex justify-between items-start text-white text-xl'>
                            <div className='flex flex-grow justify-around items-start'>
                                <img src={Team1} className='w-12 h-full rounded' />
                                <div>
                                    <div className=''>Everton FC</div>
                                    <div className='text-sm'>
                                        <div>
                                            A. Schulz - 12 , 40
                                        </div>
                                        <div>
                                            P. Wunderlich - 16
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='text-2xl font-semibold'>
                                3:2
                            </div>
                            <div className='flex flex-grow justify-around items-start'>
                                <div>
                                    <div className=''>VfB Stuttgart</div>
                                    <div className='text-sm'>
                                        <div>
                                            S. Winkler - 12 , 40
                                        </div>
                                    </div>
                                </div>
                                <img src={Team2} className='w-12 h-full rounded' />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GoalScorerCard;
