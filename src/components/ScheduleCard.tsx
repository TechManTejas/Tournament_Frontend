/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import PanelLarge from "../assets/images/panel_large.png"
import Team1 from "../assets/images/team_1.png"
import Team2 from "../assets/images/team_2.png"
import Team3 from "../assets/images/team_3.png"
import Team4 from "../assets/images/team_4.png"
import Team5 from "../assets/images/team_5.png"
import Team6 from "../assets/images/team_6.png"
import Team7 from "../assets/images/team_7.png"
import Team8 from "../assets/images/team_8.png"
import PoweredBy1 from "../assets/images/poweredby_1.png"
import PoweredBy2 from "../assets/images/poweredby_2.png"

interface ScheduleCardProps {
    onDrag?: (event: DraggableEvent, data: DraggableData) => void;
    x?: number;
    y?: number;
    isLive?: boolean;
    data?: any;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ onDrag, x, y, isLive, data }) => {

    const matches = data?.matches
    console.log(matches)

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
                                <div className='text-sm'>
                                    <div>
                                        Time 1
                                    </div>
                                    <div>
                                        Group
                                    </div>
                                </div>
                                <div className='flex justify-end gap-2 items-center w-64'>
                                    <div className=''>Team A</div>
                                    <img src={Team1} className='w-12 h-12 object-contain rounded' />
                                </div>
                                <div>
                                    :
                                </div>

                                <div className='flex justify-start gap-2 items-center w-64'>
                                    <img src={Team2} className='w-12 h-12 object-contain rounded' />
                                    <div className=''>Team B</div>
                                </div>
                            </div>
                            <div className='flex justify-center gap-2 items-center text-white text-xl'>
                                <div className='text-sm'>
                                    <div>
                                        Time 2
                                    </div>
                                    <div>
                                        Group
                                    </div>
                                </div>
                                <div className='flex justify-end gap-2 items-center w-64'>
                                    <div className=''>Team C</div>
                                    <img src={Team3} className='w-12 h-12 object-contain rounded' />
                                </div>
                                <div>
                                    :
                                </div>

                                <div className='flex justify-start gap-2 items-center w-64'>
                                    <img src={Team4} className='w-12 h-12 object-contain rounded' />
                                    <div className=''>Team D</div>
                                </div>
                            </div>
                            <div className='flex justify-center gap-2 items-center text-white text-xl'>
                                <div className='text-sm'>
                                    <div>
                                        Time 3
                                    </div>
                                    <div>
                                        Group
                                    </div>
                                </div>
                                <div className='flex justify-end gap-2 items-center w-64'>
                                    <div className=''>Team E</div>
                                    <img src={Team5} className='w-12 h-12 object-contain rounded' />
                                </div>
                                <div>
                                    :
                                </div>

                                <div className='flex justify-start gap-2 items-center w-64'>
                                    <img src={Team6} className='w-12 h-12 object-contain rounded' />
                                    <div className=''>Team F</div>
                                </div>
                            </div>
                            <div className='flex justify-center gap-2 items-center text-white text-xl'>
                                <div className='text-sm'>
                                    <div>
                                        Time 4
                                    </div>
                                    <div>
                                        Group
                                    </div>
                                </div>
                                <div className='flex justify-end gap-2 items-center w-64'>
                                    <div className=''>Team G</div>
                                    <img src={Team7} className='w-12 h-12 object-contain rounded' />
                                </div>
                                <div>
                                    :
                                </div>

                                <div className='flex justify-start gap-2 items-center w-64'>
                                    <img src={Team8} className='w-12 h-12 object-contain rounded' />
                                    <div className=''>Team H</div>
                                </div>
                            </div>
                            {/* <div className='flex flex-col justify-center  items-center text-white text-xl'>
                                <div>
                                    Livestream Powered by
                                </div>
                                <div className='flex gap-2'>
                                    <img src={PoweredBy1} className='h-12 object-contain' />
                                    <img src={PoweredBy2} className='h-12 object-contain' />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </Draggable>
            ) : (
                <div className='w-[720px] h-[450px]' style={{ left: `${x}px`, top: `${y}px`, backgroundImage: `url(${PanelLarge})`, backgroundSize: 'cover' }}>
                    {/* Your non-draggable box content goes here */}
                    <div className='relative px-4 flex flex-col justify-center h-full gap-3'>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <div className='text-sm'>
                                <div>
                                    {/* Time  */}
                                </div>
                                <div>
                                    {matches && matches[0]?.group}
                                </div>
                            </div>
                            <div className='flex justify-end gap-2 items-center w-64'>
                                {matches && matches[0] &&
                                    <div className=''>{matches && matches[0]?.teamA.name}</div>
                                }
                                <img src={matches && matches[0]?.teamA.logo} className='w-12 h-12 object-contain rounded' />
                            </div>
                            {matches && matches[0] &&
                                <div>
                                    :
                                </div>
                            }
                            <div className='flex justify-start gap-2 items-center w-64'>
                                {matches && matches[0] &&
                                    <img src={matches && matches[0]?.teamB.logo} className='w-12 h-12 object-contain rounded' />
                                }
                                <div className=''>{matches && matches[0]?.teamB.name}</div>
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <div className='text-sm'>
                                <div>
                                    {/* Time  */}
                                </div>
                                <div>
                                    {matches && matches[1]?.group}
                                </div>
                            </div>
                            <div className='flex justify-end gap-2 items-center w-64'>
                                <div className=''>{matches && matches[1]?.teamA.name}</div>
                                {matches && matches[1] &&
                                    <img src={matches && matches[1]?.teamA.logo} className='w-12 h-12 object-contain rounded' />
                                }
                            </div>
                            {matches && matches[1] &&
                                <div>
                                    :
                                </div>
                            }
                            <div className='flex justify-start gap-2 items-center w-64'>
                                <img src={matches && matches[1]?.teamB.logo} className='w-12 h-12 object-contain rounded' />
                                <div className=''>{matches && matches[1]?.teamB.name}</div>
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <div className='text-sm'>
                                <div>
                                    {/* Time  */}
                                </div>
                                <div>
                                    {matches && matches[2]?.group}
                                </div>
                            </div>
                            <div className='flex justify-end gap-2 items-center w-64'>
                                <div className=''>{matches && matches[2]?.teamA.name}</div>
                                {matches && matches[2] &&
                                    <img src={matches && matches[2]?.teamA.logo} className='w-12 h-12 object-contain rounded' />
                                }
                            </div>
                            {matches && matches[2] &&
                                <div>
                                    :
                                </div>
                            }
                            <div className='flex justify-start gap-2 items-center w-64'>
                                {matches && matches[2] &&
                                    <img src={matches && matches[2]?.teamB.logo} className='w-12 h-12 object-contain rounded' />
                                }
                                <div className=''>{matches && matches[2]?.teamB.name}</div>
                            </div>
                        </div>
                        <div className='flex justify-center gap-2 items-center text-white text-xl'>
                            <div className='text-sm'>
                                <div>
                                    {/* Time  */}
                                </div>
                                <div>
                                    {matches && matches[3]?.group}
                                </div>
                            </div>
                            <div className='flex justify-end gap-2 items-center w-64'>
                                <div className=''>{matches && matches[3]?.teamA.name}</div>
                                {matches && matches[3] &&
                                    <img src={matches && matches[3]?.teamA.logo} className='w-12 h-12 object-contain rounded' />
                                }
                            </div>
                            {matches && matches[3] &&
                                <div>
                                    :
                                </div>
                            }
                            <div className='flex justify-start gap-2 items-center w-64'>
                                {matches && matches[3] &&
                                    <img src={matches && matches[3]?.teamB.logo} className='w-12 h-12 object-contain rounded' />
                                }
                                <div className=''>{matches && matches[3]?.teamB.name}</div>
                            </div>
                        </div>
                        {/* <div className='flex flex-col justify-center  items-center text-white text-xl'>
                            <div>
                                Livestream Powered by
                            </div>
                            <div className='flex gap-2'>
                                <img src={PoweredBy1} className='h-12 object-contain' />
                                <img src={PoweredBy2} className='h-12 object-contain' />
                            </div>
                        </div> */}
                    </div>
                </div>
            )}
        </>
    );
};

export default ScheduleCard;
