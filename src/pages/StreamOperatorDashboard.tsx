import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Switch } from 'antd';
import ScoreCard from '../components/ScoreCard';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { useLocation } from 'react-router-dom';
import { w3cwebsocket } from 'websocket';
import { w3cwebsocket as W3CWebSocket } from "websocket";
const { Option } = Select;

export const StreamOperatorDashboard: React.FC = () => {
    const { state } = useLocation()
    const match = state?.match ?? 1

    const [form] = Form.useForm();

    const [socketScoreCard, setSocketScoreCard] = useState<w3cwebsocket | null>(null);
    const [socketMatchCard, setSocketMatchCard] = useState<w3cwebsocket | null>(null);

    const [scoreCardIsLive, setScoreCardIsLive] = useState(false);

    const [isDraggableScoreCardVisible, setDraggableScoreCardVisible] = useState(false);

    const openDraggableScoreCard = () => {
        setDraggableScoreCardVisible(true);
    };

    const closeDraggableScoreCard = () => {
        setDraggableScoreCardVisible(false);
        handleToggleScoreCardLive(false)
    };

    const handleToggleScoreCardVisible = () => {
        if (!isDraggableScoreCardVisible) {
            openDraggableScoreCard()
        } else {
            closeDraggableScoreCard()
        }
    };

    const handleToggleScoreCardLive = (checked: boolean) => {
        setScoreCardIsLive(checked)
    };

    useEffect(() => {
        const ws = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/scorecard/${match}/`);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        setSocketScoreCard(ws);

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

    const handlePushAdvertise = (values: { adSelect: string }) => {
        // Add your logic to handle pushing the advertisement
        console.log('Advertisement pushed:', values.adSelect);
    };


    return (
        <>
            <div className='h-full rounded-xl relative'>
                <div className='border border-black rounded h-[calc(100vh-50px)]'>
                    {isDraggableScoreCardVisible && <ScoreCard onDrag={handleDragScoreCard} isLive={scoreCardIsLive} />}
                    <div className='flex justify-center items-center h-full text-red-500 font-bold z-50'>
                        +
                    </div>
                </div>
                <div className='bottom-0 flex justify-between w-full'>
                    <div className='p-4 border border-green-500 shadow rounded bottom-0 bg-transparent backdrop-blur-sm h-30'>

                        <div className='flex gap-2'>
                            <div className='flex flex-col gap-2'>
                                <div>
                                    <Button type='primary' onClick={handleToggleScoreCardVisible}>Scoreboard</Button>
                                </div>
                                <div>
                                    <Switch checked={scoreCardIsLive} onChange={handleToggleScoreCardLive} className='bg-red-500' />
                                </div>
                                <div>
                                    {scoreCardIsLive ? 'Live' : 'Inactive'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-4 border border-green-500 shadow rounded bottom-0 bg-transparent backdrop-blur-sm h-30'>

                        <div className='flex flex-col gap-2'>
                            <div>
                                Message from Tournament Leader:
                            </div>
                            <div className='text-center text-xl font-semibold'>
                                GOAL TEJAS VAIJ!!!
                            </div>
                            <div className='flex justify-center items-center gap-2'>
                                <Button type='primary'>PUSH LIVE</Button>
                                <Button size='small' className='bg-red-500 text-white'>IGNORE</Button>
                            </div>
                        </div>

                    </div>
                    <div className='p-4 border border-green-500 shadow rounded bottom-0 bg-transparent backdrop-blur-sm h-30'>
                        <div>
                            <Form layout='vertical' form={form} onFinish={handlePushAdvertise}>
                                <Form.Item name="adSelect" label="Select Ad:" className='m-0 p-0'>
                                    <Select style={{ width: 200 }}>
                                        <Option value='ad1'>Advertisement 1</Option>
                                        <Option value='ad2'>Advertisement 2</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item className='m-0 p-0'>
                                    <Button type='primary' htmlType='submit'>
                                        PUSH ADVERTISEMENT
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};
