import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelLarge from "../assets/images/panel_large.png"
import Team1 from "../assets/images/team_1.png"
import { DownCircleOutlined, SwapOutlined, UpCircleOutlined } from '@ant-design/icons';

interface SwapsCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
}

const SwapsCard: React.FC<SwapsCardProps> = ({ onDrag, x, y, isLive }) => {
    const isDraggable = typeof x === 'undefined' || typeof y === 'undefined';

    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

    // Function to set the initial position based on the parent's dimensions
    const calculateInitialPosition = () => {
        const parentWidth = window.innerWidth; // Replace this with the actual width of the parent component
        const parentHeight = window.innerHeight; // Replace this with the actual height of the parent component

        const cardWidth = 720; // Replace this with the width of your ScoreCard component
        const cardHeight = 450; // Replace this with the height of your ScoreCard component

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
                    <div className={`absolute w-[720px] h-[450px] rounded ${isLive ? 'border-green-500 border-4' : 'border-red-500 border-4'}`} style={{ backgroundImage: `url(${PanelLarge})`, backgroundSize: 'cover' }}>
                        {/* Your draggable box content goes here */}
                        <div className='relative px-4 flex flex-col justify-center h-full gap-3'>
                            <div className='flex justify-center gap-2 items-center text-white text-xl'>
                                <img src={Team1} className='w-12 h-12 object-contain rounded' />
                            </div>
                            <div className='flex justify-center gap-20 items-center text-white text-4xl'>
                                <div className='flex  gap-2 items-center '>
                                    <DownCircleOutlined className='text-red-500' />
                                </div>
                                <div className='flex  gap-2 items-center '>
                                    <UpCircleOutlined className='text-green-500' />
                                </div>
                            </div>
                            <div className='flex justify-center gap-2 items-center text-white text-xl'>
                                <div className='flex justify-end gap-2 items-center w-64'>
                                    <div className=''>VfB Stuttgart</div>

                                </div>
                                <div>
                                    <SwapOutlined />
                                </div>

                                <div className='flex justify-start gap-2 items-center w-64'>
                                    <div className=''>FC Schalke 04</div>
                                </div>
                            </div>
                            <div className='flex justify-center gap-2 items-center text-white text-xl'>
                                <div className='flex justify-end gap-2 items-center w-64'>
                                    <div className=''>FC Midtylland</div>
                                </div>
                                <div>
                                    <SwapOutlined />
                                </div>

                                <div className='flex justify-start gap-2 items-center w-64'>
                                    <div className=''>Palmeiras</div>
                                </div>
                            </div>
                            <div className='flex justify-center gap-2 items-center text-white text-xl'>
                                <div className='flex justify-end gap-2 items-center w-64'>
                                    <div className=''>SC Freiburg</div>
                                </div>
                                <div>
                                    <SwapOutlined />
                                </div>

                                <div className='flex justify-start gap-2 items-center w-64'>
                                    <div className=''>FSV Mainz 05</div>
                                </div>
                            </div>
                            <div className='flex justify-center gap-2 items-center text-white text-xl'>
                                <div className='flex justify-end gap-2 items-center w-64'>
                                    <div className=''>Everton FC</div>
                                </div>
                                <div>
                                    <SwapOutlined />
                                </div>

                                <div className='flex justify-start gap-2 items-center w-64'>
                                    <div className=''>AS Rom</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Draggable>
            ) : (
                <div className='w-[720px] h-[450px]' style={{ left: `${x}px`, top: `${y}px`, backgroundImage: `url(${PanelLarge})`, backgroundSize: 'cover' }}>
                    {/* Your non-draggable box content goes here */}
                    <div className='relative px-4 flex flex-col justify-center h-full gap-3'>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <img src={Team1} className='w-12 h-12 object-contain rounded' />
                        </div>
                        <div className='flex justify-center gap-20 items-center text-white text-4xl'>
                            <div className='flex  gap-2 items-center '>
                                <DownCircleOutlined className='text-red-500' />
                            </div>
                            <div className='flex  gap-2 items-center '>
                                <UpCircleOutlined className='text-green-500' />
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <div className='flex justify-end gap-2 items-center w-64'>
                                <div className=''>VfB Stuttgart</div>

                            </div>
                            <div>
                                <SwapOutlined />
                            </div>

                            <div className='flex justify-start gap-2 items-center w-64'>
                                <div className=''>FC Schalke 04</div>
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <div className='flex justify-end gap-2 items-center w-64'>
                                <div className=''>FC Midtylland</div>
                            </div>
                            <div>
                                <SwapOutlined />
                            </div>

                            <div className='flex justify-start gap-2 items-center w-64'>
                                <div className=''>Palmeiras</div>
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <div className='flex justify-end gap-2 items-center w-64'>
                                <div className=''>SC Freiburg</div>
                            </div>
                            <div>
                                <SwapOutlined />
                            </div>

                            <div className='flex justify-start gap-2 items-center w-64'>
                                <div className=''>FSV Mainz 05</div>
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <div className='flex justify-end gap-2 items-center w-64'>
                                <div className=''>Everton FC</div>
                            </div>
                            <div>
                                <SwapOutlined />
                            </div>

                            <div className='flex justify-start gap-2 items-center w-64'>
                                <div className=''>AS Rom</div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default SwapsCard;
