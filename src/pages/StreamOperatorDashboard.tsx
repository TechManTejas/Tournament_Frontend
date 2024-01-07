import React, { useEffect, useState } from 'react';
import { Button, Switch } from 'antd';
import ScoreCard from '../components/ScoreCard';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { useLocation } from 'react-router-dom';
import { w3cwebsocket } from 'websocket';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import MatchCard from '../components/MatchCard';
import ScheduleCard from '../components/ScheduleCard';
import RefereesCard from '../components/RefereesCard';
import GoalScorerCard from '../components/GoalScorerCard';
import CardsCard from '../components/CardsCard';
import FreeTextCard from '../components/FreeTextCard';
import SwapsCard from '../components/SwapsCard';

export const StreamOperatorDashboard: React.FC = () => {

    const location = useLocation();
    const { matchRecord, tournament } = location.state;
    console.log(matchRecord);
    console.log(tournament);
    const match = tournament.id

    if(!tournament){
        window.location.href = '/dashboard/tournament'
    }

    const [socketScoreCard, setSocketScoreCard] = useState<w3cwebsocket | null>(null);
    const [scoreCardIsLive, setScoreCardIsLive] = useState(false);
    const [isDraggableScoreCardVisible, setDraggableScoreCardVisible] = useState(false);

    const [socketMatchCard, setSocketMatchCard] = useState<w3cwebsocket | null>(null);
    const [matchCardIsLive, setMatchCardIsLive] = useState(false);
    const [isDraggableMatchCardVisible, setDraggableMatchCardVisible] = useState(false);

    const [socketScheduleCard, setSocketScheduleCard] = useState<w3cwebsocket | null>(null);
    const [scheduleCardIsLive, setScheduleCardIsLive] = useState(false);
    const [isDraggableScheduleCardVisible, setDraggableScheduleCardVisible] = useState(false);

    const [socketRefereesCard, setSocketRefereesCard] = useState<w3cwebsocket | null>(null);
    const [refereesCardIsLive, setRefereesCardIsLive] = useState(false);
    const [isDraggableRefereesCardVisible, setDraggableRefereesCardVisible] = useState(false);

    // To be made into list 
    // const [socketGroupTableCard, setSocketGroupTableCard] = useState<w3cwebsocket | null>(null);
    // const [groupTableCardIsLive, setGroupTableCardIsLive] = useState(false);
    // const [isDraggableGroupTableCardVisible, setDraggableGroupTableCardVisible] = useState(false);
    // To be made into list

    const [socketGoalScorerCard, setSocketGoalScorerCard] = useState<w3cwebsocket | null>(null);
    const [goalScorerCardIsLive, setGoalScorerCardIsLive] = useState(false);
    const [isDraggableGoalScorerCardVisible, setDraggableGoalScorerCardVisible] = useState(false);

    const [socketCardsCard, setSocketCardsCard] = useState<w3cwebsocket | null>(null);
    const [cardsCardIsLive, setCardsCardIsLive] = useState(false);
    const [isDraggableCardsCardVisible, setDraggableCardsCardVisible] = useState(false);

    const [socketSwapsCard, setSocketSwapsCard] = useState<w3cwebsocket | null>(null);
    const [swapsCardIsLive, setSwapsCardIsLive] = useState(false);
    const [isDraggableSwapsCardVisible, setDraggableSwapsCardVisible] = useState(false);

    const [socketFreeTextCard, setSocketFreeTextCard] = useState<w3cwebsocket | null>(null);
    const [freeTextCardIsLive, setFreeTextCardIsLive] = useState(false);
    const [isDraggableFreeTextCardVisible, setDraggableFreeTextCardVisible] = useState(false);

    const openDraggableScoreCard = () => {
        setDraggableScoreCardVisible(true);
    };
    const openDraggableMatchCard = () => {
        setDraggableMatchCardVisible(true);
    };
    const openDraggableScheduleCard = () => {
        setDraggableScheduleCardVisible(true);
    };
    const openDraggableRefereesCard = () => {
        setDraggableRefereesCardVisible(true);
    };
    const openDraggableGoalScorerCard = () => {
        setDraggableGoalScorerCardVisible(true);
    };
    const openDraggableCardsCard = () => {
        setDraggableCardsCardVisible(true);
    };
    const openDraggableFreeTextCard = () => {
        setDraggableFreeTextCardVisible(true);
    };
    const openDraggableSwapsCard = () => {
        setDraggableSwapsCardVisible(true);
    };

    const closeDraggableScoreCard = () => {
        setDraggableScoreCardVisible(false);
        handleToggleScoreCardLive(false)
    };
    const closeDraggableMatchCard = () => {
        setDraggableMatchCardVisible(false);
        handleToggleMatchCardLive(false)
    };
    const closeDraggableScheduleCard = () => {
        setDraggableScheduleCardVisible(false);
        handleToggleScheduleCardLive(false)
    };
    const closeDraggableRefereesCard = () => {
        setDraggableRefereesCardVisible(false);
        handleToggleRefereesCardLive(false)
    };
    const closeDraggableGoalScorerCard = () => {
        setDraggableGoalScorerCardVisible(false);
        handleToggleGoalScorerCardLive(false)
    };
    const closeDraggableCardsCard = () => {
        setDraggableCardsCardVisible(false);
        handleToggleCardsCardLive(false)
    };
    const closeDraggableFreeTextCard = () => {
        setDraggableFreeTextCardVisible(false);
        handleToggleFreeTextCardLive(false)
    };
    const closeDraggableSwapsCard = () => {
        setDraggableSwapsCardVisible(false);
        handleToggleSwapsCardLive(false)
    };

    const handleToggleScoreCardVisible = () => {
        if (!isDraggableScoreCardVisible) {
            openDraggableScoreCard()
        } else {
            closeDraggableScoreCard()
        }
    };
    const handleToggleMatchCardVisible = () => {
        if (!isDraggableMatchCardVisible) {
            openDraggableMatchCard()
        } else {
            closeDraggableMatchCard()
        }
    };
    const handleToggleScheduleCardVisible = () => {
        if (!isDraggableScheduleCardVisible) {
            openDraggableScheduleCard()
        } else {
            closeDraggableScheduleCard()
        }
    };
    const handleToggleRefereesCardVisible = () => {
        if (!isDraggableRefereesCardVisible) {
            openDraggableRefereesCard()
        } else {
            closeDraggableRefereesCard()
        }
    };
    const handleToggleGoalScorerCardVisible = () => {
        if (!isDraggableGoalScorerCardVisible) {
            openDraggableGoalScorerCard()
        } else {
            closeDraggableGoalScorerCard()
        }
    };
    const handleToggleCardsCardVisible = () => {
        if (!isDraggableCardsCardVisible) {
            openDraggableCardsCard()
        } else {
            closeDraggableCardsCard()
        }
    };
    const handleToggleFreeTextCardVisible = () => {
        if (!isDraggableFreeTextCardVisible) {
            openDraggableFreeTextCard()
        } else {
            closeDraggableFreeTextCard()
        }
    };
    const handleToggleSwapsCardVisible = () => {
        if (!isDraggableSwapsCardVisible) {
            openDraggableSwapsCard()
        } else {
            closeDraggableSwapsCard()
        }
    };

    const handleToggleScoreCardLive = (checked: boolean) => {
        setScoreCardIsLive(checked)
    };
    const handleToggleMatchCardLive = (checked: boolean) => {
        setMatchCardIsLive(checked)
    };
    const handleToggleScheduleCardLive = (checked: boolean) => {
        setScheduleCardIsLive(checked)
    };
    const handleToggleRefereesCardLive = (checked: boolean) => {
        setRefereesCardIsLive(checked)
    };
    const handleToggleGoalScorerCardLive = (checked: boolean) => {
        setGoalScorerCardIsLive(checked)
    };
    const handleToggleCardsCardLive = (checked: boolean) => {
        setCardsCardIsLive(checked)
    };
    const handleToggleFreeTextCardLive = (checked: boolean) => {
        setFreeTextCardIsLive(checked)
    };
    const handleToggleSwapsCardLive = (checked: boolean) => {
        setSwapsCardIsLive(checked)
    };

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/scorecard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket ScoreCard connected');
        };

        setSocketScoreCard(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [match]);

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/matchcard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket MatchCard connected');
        };

        setSocketMatchCard(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [match]);

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/schedulecard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket ScheduleCard connected');
        };

        setSocketScheduleCard(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [match]);

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/refereescard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket RefereesCard connected');
        };

        setSocketRefereesCard(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [match]);

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/goalscorercard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket GoalScorerCard connected');
        };

        setSocketGoalScorerCard(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [match]);

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/cardscard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket CardsCard connected');
        };

        setSocketCardsCard(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [match]);

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/freetextcard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket FreeTextCard connected');
        };

        setSocketFreeTextCard(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [match]);

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/swapscard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket SwapsCard connected');
        };

        setSocketSwapsCard(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [match]);

    useEffect(() => {
        // Send the isLive status to the socket when it becomes true
        if (socketScoreCard && socketScoreCard.readyState === socketScoreCard.OPEN) {
            socketScoreCard.send(
                JSON.stringify({
                    type: 'live_status',
                    isLive: scoreCardIsLive,
                })
            );
        }
    }, [socketScoreCard, scoreCardIsLive]);

    useEffect(() => {
        // Send the isLive status to the socket when it becomes true
        if (socketMatchCard && socketMatchCard.readyState === socketMatchCard.OPEN) {
            socketMatchCard.send(
                JSON.stringify({
                    type: 'live_status',
                    isLive: matchCardIsLive,
                })
            );
        }
    }, [socketMatchCard, matchCardIsLive]);

    useEffect(() => {
        // Send the isLive status to the socket when it becomes true
        if (socketScheduleCard && socketScheduleCard.readyState === socketScheduleCard.OPEN) {
            socketScheduleCard.send(
                JSON.stringify({
                    type: 'live_status',
                    isLive: scheduleCardIsLive,
                })
            );
        }
    }, [socketScheduleCard, scheduleCardIsLive]);

    useEffect(() => {
        // Send the isLive status to the socket when it becomes true
        if (socketRefereesCard && socketRefereesCard.readyState === socketRefereesCard.OPEN) {
            socketRefereesCard.send(
                JSON.stringify({
                    type: 'live_status',
                    isLive: refereesCardIsLive,
                })
            );
        }
    }, [socketRefereesCard, refereesCardIsLive]);

    useEffect(() => {
        // Send the isLive status to the socket when it becomes true
        if (socketGoalScorerCard && socketGoalScorerCard.readyState === socketGoalScorerCard.OPEN) {
            socketGoalScorerCard.send(
                JSON.stringify({
                    type: 'live_status',
                    isLive: goalScorerCardIsLive,
                })
            );
        }
    }, [socketGoalScorerCard, goalScorerCardIsLive]);

    useEffect(() => {
        // Send the isLive status to the socket when it becomes true
        if (socketCardsCard && socketCardsCard.readyState === socketCardsCard.OPEN) {
            socketCardsCard.send(
                JSON.stringify({
                    type: 'live_status',
                    isLive: cardsCardIsLive,
                })
            );
        }
    }, [socketCardsCard, cardsCardIsLive]);

    useEffect(() => {
        // Send the isLive status to the socket when it becomes true
        if (socketFreeTextCard && socketFreeTextCard.readyState === socketFreeTextCard.OPEN) {
            socketFreeTextCard.send(
                JSON.stringify({
                    type: 'live_status',
                    isLive: freeTextCardIsLive,
                })
            );
        }
    }, [socketFreeTextCard, freeTextCardIsLive]);

    useEffect(() => {
        // Send the isLive status to the socket when it becomes true
        if (socketSwapsCard && socketSwapsCard.readyState === socketSwapsCard.OPEN) {
            socketSwapsCard.send(
                JSON.stringify({
                    type: 'live_status',
                    isLive: swapsCardIsLive,
                })
            );
        }
    }, [socketSwapsCard, swapsCardIsLive]);

    const handleDragScoreCard = (event: DraggableEvent, data: DraggableData) => {
        // Send the drag information to the server via WebSocket
        if (socketScoreCard && socketScoreCard.readyState === socketScoreCard.OPEN) {
            socketScoreCard.send(
                JSON.stringify({
                    type: 'drag_event',
                    x: data.x,
                    y: data.y,
                })
            );
        }
    };

    const handleDragMatchCard = (event: DraggableEvent, data: DraggableData) => {
        // Send the drag information to the server via WebSocket
        if (socketMatchCard && socketMatchCard.readyState === socketMatchCard.OPEN) {
            socketMatchCard.send(
                JSON.stringify({
                    type: 'drag_event',
                    x: data.x,
                    y: data.y,
                })
            );
        }
    };

    const handleDragScheduleCard = (event: DraggableEvent, data: DraggableData) => {
        // Send the drag information to the server via WebSocket
        if (socketScheduleCard && socketScheduleCard.readyState === socketScheduleCard.OPEN) {
            socketScheduleCard.send(
                JSON.stringify({
                    type: 'drag_event',
                    x: data.x,
                    y: data.y,
                })
            );
        }
    };

    const handleDragRefereesCard = (event: DraggableEvent, data: DraggableData) => {
        // Send the drag information to the server via WebSocket
        if (socketRefereesCard && socketRefereesCard.readyState === socketRefereesCard.OPEN) {
            socketRefereesCard.send(
                JSON.stringify({
                    type: 'drag_event',
                    x: data.x,
                    y: data.y,
                })
            );
        }
    };

    const handleDragGoalScorerCard = (event: DraggableEvent, data: DraggableData) => {
        // Send the drag information to the server via WebSocket
        if (socketGoalScorerCard && socketGoalScorerCard.readyState === socketGoalScorerCard.OPEN) {
            socketGoalScorerCard.send(
                JSON.stringify({
                    type: 'drag_event',
                    x: data.x,
                    y: data.y,
                })
            );
        }
    };

    const handleDragCardsCard = (event: DraggableEvent, data: DraggableData) => {
        // Send the drag information to the server via WebSocket
        if (socketCardsCard && socketCardsCard.readyState === socketCardsCard.OPEN) {
            socketCardsCard.send(
                JSON.stringify({
                    type: 'drag_event',
                    x: data.x,
                    y: data.y,
                })
            );
        }
    };

    const handleDragFreeTextCard = (event: DraggableEvent, data: DraggableData) => {
        // Send the drag information to the server via WebSocket
        if (socketFreeTextCard && socketFreeTextCard.readyState === socketFreeTextCard.OPEN) {
            socketFreeTextCard.send(
                JSON.stringify({
                    type: 'drag_event',
                    x: data.x,
                    y: data.y,
                })
            );
        }
    };

    const handleDragSwapsCard = (event: DraggableEvent, data: DraggableData) => {
        // Send the drag information to the server via WebSocket
        if (socketSwapsCard && socketSwapsCard.readyState === socketSwapsCard.OPEN) {
            socketSwapsCard.send(
                JSON.stringify({
                    type: 'drag_event',
                    x: data.x,
                    y: data.y,
                })
            );
        }
    };


    return (
        <>
            <div className='h-full rounded-xl '>
                <div className='relative border border-black rounded h-[calc(100vh-50px)]'>
                    {isDraggableScoreCardVisible && <ScoreCard onDrag={handleDragScoreCard} isLive={scoreCardIsLive} />}
                    {isDraggableMatchCardVisible && <MatchCard onDrag={handleDragMatchCard} isLive={matchCardIsLive} />}
                    {isDraggableScheduleCardVisible && <ScheduleCard onDrag={handleDragScheduleCard} isLive={scheduleCardIsLive} />}
                    {isDraggableRefereesCardVisible && <RefereesCard onDrag={handleDragRefereesCard} isLive={refereesCardIsLive} />}
                    {isDraggableGoalScorerCardVisible && <GoalScorerCard onDrag={handleDragGoalScorerCard} isLive={goalScorerCardIsLive} />}
                    {isDraggableCardsCardVisible && <CardsCard onDrag={handleDragCardsCard} isLive={cardsCardIsLive} />}
                    {isDraggableFreeTextCardVisible && <FreeTextCard onDrag={handleDragFreeTextCard} isLive={freeTextCardIsLive} />}
                    {isDraggableSwapsCardVisible && <SwapsCard onDrag={handleDragSwapsCard} isLive={swapsCardIsLive} />}
                    <div className='flex justify-center items-center h-full text-red-500 font-bold z-50'>
                        <div className='absolute border w-full border-red-200'/>
                        <div className='absolute border h-full border-red-200'/>
                    </div>
                </div>
                <div className='bottom-0 flex justify-between w-full'>
                    <div className='p-4 border border-green-500 shadow rounded bottom-0 bg-transparent backdrop-blur-sm h-30'>

                        <div className='flex gap-2'>
                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type={isDraggableScoreCardVisible ? 'primary' : 'default'} onClick={handleToggleScoreCardVisible}>Scoreboard</Button>
                                </div>
                                <div>
                                    <Switch checked={scoreCardIsLive} onChange={handleToggleScoreCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {scoreCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type={isDraggableMatchCardVisible ? 'primary' : 'default'} onClick={handleToggleMatchCardVisible}>Matchboard</Button>
                                </div>
                                <div>
                                    <Switch checked={matchCardIsLive} onChange={handleToggleMatchCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {matchCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type={isDraggableScheduleCardVisible ? 'primary' : 'default'} onClick={handleToggleScheduleCardVisible}>Schedule</Button>
                                </div>
                                <div>
                                    <Switch checked={scheduleCardIsLive} onChange={handleToggleScheduleCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {scheduleCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type={isDraggableRefereesCardVisible ? 'primary' : 'default'} onClick={handleToggleRefereesCardVisible}>Referees</Button>
                                </div>
                                <div>
                                    <Switch checked={refereesCardIsLive} onChange={handleToggleRefereesCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {refereesCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type={isDraggableGoalScorerCardVisible ? 'primary' : 'default'} onClick={handleToggleGoalScorerCardVisible}>Goal Scorers</Button>
                                </div>
                                <div>
                                    <Switch checked={goalScorerCardIsLive} onChange={handleToggleGoalScorerCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {goalScorerCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type={isDraggableCardsCardVisible ? 'primary' : 'default'} onClick={handleToggleCardsCardVisible}>Card</Button>
                                </div>
                                <div>
                                    <Switch checked={cardsCardIsLive} onChange={handleToggleCardsCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {cardsCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type={isDraggableFreeTextCardVisible ? 'primary' : 'default'} onClick={handleToggleFreeTextCardVisible}>Free Text</Button>
                                </div>
                                <div>
                                    <Switch checked={freeTextCardIsLive} onChange={handleToggleFreeTextCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {freeTextCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type={isDraggableSwapsCardVisible ? 'primary' : 'default'} onClick={handleToggleSwapsCardVisible}>Swaps</Button>
                                </div>
                                <div>
                                    <Switch checked={swapsCardIsLive} onChange={handleToggleSwapsCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {swapsCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='p-1 border border-green-500 shadow rounded bottom-0 bg-transparent backdrop-blur-sm h-30 w-full'>
                        <div className='flex flex-col'>
                            <div>
                                12:12 - Message from Tournament Leader this can be a lot long and contain a log of what happened at this point here
                            </div>
                            <div>
                                12:12 - Message from Tournament Leader
                            </div>
                            <div>
                                12:12 - Message from Tournament Leader
                            </div>
                            <div>
                                12:12 - Message from Tournament Leader
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
