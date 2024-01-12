import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import ScoreCard from '../components/ScoreCard';
import ScheduleCard from '../components/ScheduleCard';
import LiveBackground from "../assets/images/live-background.jpeg"
import Logo from "../assets/images/newlogo.png"

interface DraggableScore {
  x: number;
  y: number;
}
interface DraggableSchedule {
  x: number;
  y: number;
}


const LiveTV: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = id ? parseInt(id, 10) : 0;

  const parentWidth = window.innerWidth;
  const parentHeight = window.innerHeight;

  const [draggableScore, setDraggableScore] = useState<DraggableScore>({ x: ((parentWidth - 320) / 2) - 32, y: ((parentHeight - 96) / 2) - 30 });
  const [scoreCardIsLive, setScoreCardIsLive] = useState(false);
  const [scoreCardData, setScoreCardData] = useState<unknown>()
  const [scoreCardTime, setScoreCardTime] = useState<number>(0);

  const [draggableSchedule, setDraggableSchedule] = useState<DraggableSchedule>({ x: ((parentWidth - 720) / 2) - 32, y: ((parentHeight - 450) / 2) - 30 });
  const [scheduleCardIsLive, setScheduleCardIsLive] = useState(false);
  const [scheduleCardData, setScheduleCardData] = useState<unknown>()

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

  useEffect(() => {
    // WebSocket connection for ScoreCard
    const scoreSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/scorecard/${matchId}/`);
    scoreSocket.onopen = () => console.log('Score WebSocket connected');
    scoreSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);

      console.log(data)

      if (data.isLive !== undefined) {
        setScoreCardIsLive(data.isLive);
      }
      if (data.x && data.y) {
        setDraggableScore({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setScoreCardData(data.data.data);
      }
      if (data?.time && data.time?.type === 'send_time') {
        setScoreCardTime(data.time.time_value);
      }
    };


    // WebSocket connection for ScheduleCard
    const scheduleSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/schedulecard/${matchId}/`);
    scheduleSocket.onopen = () => console.log('Schedule WebSocket connected');
    scheduleSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setScheduleCardIsLive(data.isLive);
      }
      if (data.x && data.y) {
        setDraggableSchedule({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setScheduleCardData(data.data.data);
      }
    };

  }, [matchId]);

  return (
    <div className='rounded-xl m-6 flex flex-col gap-4 justify-center items-center h-[calc(100vh-50px)]' style={{backgroundImage:`url(${LiveBackground})`, backgroundSize:'cover'}}>

        <div>
            <img src={Logo}/>
        </div>

        <div className='w-full flex justify-between shadow-xl bg-white'>
            <div className='p-4 flex flex-col justify-center items-center w-full'>
                <div>
                    <img src={scoreCardData?.teamA?.logo} className='rounded-xl w-40 h-40'/>
                </div>
                <div className='text-center text-4xl font-bold m-2'>
                    {scoreCardData?.teamA?.name}
                </div>
            </div>
            <div className='flex flex-col justify-evenly items-center'>
                <div className='text-center text-6xl font-bold'>
                    {formatTime(scoreCardTime)}
                </div>
                <div className='text-center text-6xl font-bold'>
                    {scoreCardData?.teamA?.score ?? '-'} : {scoreCardData?.teamB?.score ?? '-'}
                </div>
            </div>
            <div className='p-4 flex flex-col justify-center items-center w-full'>
                <div>
                    <img src={scoreCardData?.teamB?.logo} className='rounded-xl w-40 h-40'/>
                </div>
                <div className='text-center text-4xl font-bold m-2'>
                    {scoreCardData?.teamB?.name} 
                </div>
            </div>
        </div>

        {scheduleCardData?.matches[0] &&
                <div className='w-full flex justify-between shadow-xl bg-white'>
                    <div className='p-4 flex justify-start mx-32 items-center w-full'>
                        <div>
                            <img src={scheduleCardData?.matches[0]?.teamA?.logo} className='rounded-xl w-20 h-20'/>
                        </div>
                        <div className='text-center text-3xl m-2'>
                            {scheduleCardData?.matches[0]?.teamA?.name}
                        </div>
                    </div>
                    <div className='p-4 flex justify-end items-center w-full'>
                        <div className='text-center text-3xl m-2'>
                            {scheduleCardData?.matches[0]?.teamB?.name}
                        </div>
                        <div>
                            <img src={scheduleCardData?.matches[0]?.teamB?.logo} className='rounded-xl w-20 h-20'/>
                        </div>
                    </div>
                </div>
        }

        {scheduleCardData?.matches[1] &&
        <div className='w-full flex justify-between shadow-xl bg-white'>
        <div className='p-4 flex justify-start mx-32 items-center w-full'>
                <div>
                    <img src={scheduleCardData?.matches[1]?.teamA?.logo} className='rounded-xl w-20 h-20'/>
                </div>
                <div className='text-center text-3xl m-2'>
                    {scheduleCardData?.matches[1]?.teamA?.name}
                </div>
            </div>
            <div className='p-4 flex justify-end items-center w-full'>
                <div className='text-center text-3xl m-2'>
                    {scheduleCardData?.matches[1]?.teamB?.name}
                </div>
                <div>
                    <img src={scheduleCardData?.matches[1]?.teamB?.logo} className='rounded-xl w-20 h-20'/>
                </div>
            </div>
        </div>
        }

        {scheduleCardData?.matches[2] &&
            <div className='w-full flex justify-between shadow-xl bg-white'>
            <div className='p-4 flex justify-start mx-32 items-center w-full'>
                <div>
                    <img src={scheduleCardData?.matches[2]?.teamA?.logo} className='rounded-xl w-20 h-20'/>
                </div>
                <div className='text-center text-3xl m-2'>
                    {scheduleCardData?.matches[2]?.teamA?.name}
                </div>
            </div>
            <div className='p-4 flex justify-end items-center w-full'>
                <div className='text-center text-3xl m-2'>
                    {scheduleCardData?.matches[2]?.teamB?.name}
                </div>
                <div>
                    <img src={scheduleCardData?.matches[2]?.teamB?.logo} className='rounded-xl w-20 h-20'/>
                </div>
            </div>
        </div>
        }

        {scheduleCardData?.matches[3] &&
            <div className='w-full flex justify-between shadow-xl bg-white'>
            <div className='p-4 flex justify-start mx-32 items-center w-full'>
                <div>
                    <img src={scheduleCardData?.matches[3]?.teamA?.logo} className='rounded-xl w-20 h-20'/>
                </div>
                <div className='text-center text-3xl m-2'>
                    {scheduleCardData?.matches[3]?.teamA?.name}
                </div>
            </div>
            <div className='p-4 flex justify-end items-center w-full'>
                <div className='text-center text-3xl m-2'>
                    {scheduleCardData?.matches[3]?.teamB?.name}
                </div>
                <div>
                    <img src={scheduleCardData?.matches[3]?.teamB?.logo} className='rounded-xl w-20 h-20'/>
                </div>
            </div>
        </div>
        }

      {scoreCardIsLive && (
        <div style={{ position: 'absolute', left: draggableScore.x, top: draggableScore.y }} className='p-6'>
          <ScoreCard x={0} y={0} data={scoreCardData} time={scoreCardTime}/>
        </div>
      )}

      {scheduleCardIsLive && (
        <div style={{ position: 'absolute', left: draggableSchedule.x, top: draggableSchedule.y }} className='p-6'>
          <ScheduleCard x={0} y={0} data={scheduleCardData} />
        </div>
      )}
    </div>
  );
};

export default LiveTV;
