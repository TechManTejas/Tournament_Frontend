import React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelSmall from "../assets/images/panel_small.png"

interface ScoreCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ onDrag, x, y, isLive }) => {
    const isDraggable = typeof x === 'undefined' || typeof y === 'undefined';

    return (
        <>
            {isDraggable ? (
                <Draggable bounds={"parent"} onDrag={onDrag} >
                    <div className={`absolute w-[320px] h-[96px] rounded ${isLive ? 'border-green-500 border-4' : 'border-red-500 border-4'}`} style={{ backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                        {/* Your draggable box content goes here */}
                        <div className='relative px-4 flex flex-col justify-center h-full text-white text-xl'>
                            <div className='flex justify-center w-full'>
                                09: 17
                            </div>
                            <div className='flex justify-between'>
                                <div className='flex flex-grow justify-around'>
                                    <div className='w-2 h-full bg-blue-500 rounded' />
                                    <div className=''>STGK</div>
                                    <div className=''>0</div>
                                </div>
                                <div>
                                    -
                                </div>
                                <div className='flex flex-grow justify-around'>
                                    <div className=''>0</div>
                                    <div className=''>KSC</div>
                                    <div className='w-2 bg-yellow-500 rounded' />
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>
            ) : (
                <div className='w-[320px] h-[96px]' style={{ left: `${x}px`, top: `${y}px`, backgroundImage: `url(${PanelSmall})`, backgroundSize: 'cover' }}>
                    {/* Your non-draggable box content goes here */}
                    <div className='relative px-4 flex flex-col justify-center h-full text-white text-xl'>
                        <div className='flex justify-center w-full'>
                            09: 17
                        </div>
                        <div className='flex justify-between'>
                            <div className='flex flex-grow justify-around'>
                                <div className='w-2 h-full bg-blue-500 rounded' />
                                <div className=''>STGK</div>
                                <div className=''>0</div>
                            </div>
                            <div>
                                -
                            </div>
                            <div className='flex flex-grow justify-around'>
                                <div className=''>0</div>
                                <div className=''>KSC</div>
                                <div className='w-2 bg-yellow-500 rounded' />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ScoreCard;
