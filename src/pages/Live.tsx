import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import ScoreCard from '../components/ScoreCard';
import MatchCard from '../components/MatchCard';
import ScheduleCard from '../components/ScheduleCard';
import RefereesCard from '../components/RefereesCard';
import GoalScorerCard from '../components/GoalScorerCard';
import CardsCard from '../components/CardsCard';
import FreeTextCard from '../components/FreeTextCard';
import SwapsCard from '../components/SwapsCard';
import TimeCard from '../components/TimeCard';

interface DraggableScore {
  x: number;
  y: number;
}

interface DraggableMatch {
  x: number;
  y: number;
}

interface DraggableSchedule {
  x: number;
  y: number;
}

interface DraggableReferees {
  x: number;
  y: number;
}

interface DraggableGoalScorer {
  x: number;
  y: number;
}

interface DraggableCards {
  x: number;
  y: number;
}

interface DraggableFreeText {
  x: number;
  y: number;
}

interface DraggableSwaps {
  x: number;
  y: number;
}

interface DraggableTime {
  x: number;
  y: number;
}


const Live: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = id ? parseInt(id, 10) : 0;

  const parentWidth = window.innerWidth;
  const parentHeight = window.innerHeight;

  const [draggableScore, setDraggableScore] = useState<DraggableScore>({ x: ((parentWidth - 320) / 2) - 32, y: ((parentHeight - 96) / 2) - 30 });
  const [scoreCardIsLive, setScoreCardIsLive] = useState(false);
  const [scoreCardData, setScoreCardData] = useState<unknown>()
  const [scoreCardTime, setScoreCardTime] = useState<number>(0);

  const [draggableMatch, setDraggableMatch] = useState<DraggableMatch>({ x: ((parentWidth - 560) / 2) - 32, y: ((parentHeight - 180) / 2) - 30 });
  const [matchCardIsLive, setMatchCardIsLive] = useState(false);
  const [matchCardData, setMatchCardData] = useState<unknown>({})

  const [draggableSchedule, setDraggableSchedule] = useState<DraggableSchedule>({ x: ((parentWidth - 720) / 2) - 32, y: ((parentHeight - 450) / 2) - 30 });
  const [scheduleCardIsLive, setScheduleCardIsLive] = useState(false);
  const [scheduleCardData, setScheduleCardData] = useState<unknown>()

  const [draggableReferees, setDraggableReferees] = useState<DraggableReferees>({ x: ((parentWidth - 460) / 2) - 32, y: ((parentHeight - 280) / 2) - 30 });
  const [refereesCardIsLive, setRefereesCardIsLive] = useState(false);
  const [refereesCardData, setRefereesCardData] = useState<unknown>()

  const [draggableGoalScorer, setDraggableGoalScorer] = useState<DraggableGoalScorer>({ x: ((parentWidth - 640) / 2) - 32, y: ((parentHeight - 200) / 2) - 30 });
  const [goalScorerCardIsLive, setGoalScorerCardIsLive] = useState(false);
  const [goalScorerCardData, setGoalScorerCardData] = useState<unknown>()

  const [draggableCards, setDraggableCards] = useState<DraggableCards>({ x: ((parentWidth - 580) / 2) - 32, y: ((parentHeight - 180) / 2) - 30 });
  const [cardsCardIsLive, setCardsCardIsLive] = useState(false);
  const [cardsCardData, setCardsCardData] = useState<unknown>()

  const [draggableFreeText, setDraggableFreeText] = useState<DraggableFreeText>({ x: ((parentWidth - 580) / 2) - 32, y: ((parentHeight - 180) / 2) - 30 });
  const [freeTextCardIsLive, setFreeTextCardIsLive] = useState(false);
  const [freeTextCardData, setFreeTextCardData] = useState<unknown>()

  const [draggableSwaps, setDraggableSwaps] = useState<DraggableSwaps>({ x: ((parentWidth - 720) / 2) - 32, y: ((parentHeight - 450) / 2) - 30 });
  const [swapsCardIsLive, setSwapsCardIsLive] = useState(false);
  const [swapsCardData, setSwapsCardData] = useState<unknown>()

  const [draggableTime, setDraggableTime] = useState<DraggableTime>({ x: ((parentWidth - 580) / 2) - 32, y: ((parentHeight - 180) / 2) - 30 });
  const [timeCardIsLive, setTimeCardIsLive] = useState(false);
  const [timeCardData, setTimeCardData] = useState<unknown>()

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

    // WebSocket connection for MatchCard
    const matchSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/matchcard/${matchId}/`);
    matchSocket.onopen = () => console.log('Match WebSocket connected');
    matchSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      console.log(data)

      if (data.isLive !== undefined) {
        setMatchCardIsLive(data.isLive);
      }
      if (data.x && data.y) {
        setDraggableMatch({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setMatchCardData(data.data.data);
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

    // WebSocket connection for RefereesCard
    const refereesSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/refereescard/${matchId}/`);
    refereesSocket.onopen = () => console.log('Referees WebSocket connected');
    refereesSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setRefereesCardIsLive(data.isLive);
      } 
      if (data.x && data.y) {
        setDraggableReferees({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setRefereesCardData(data.data.data);
      }
    };

    // WebSocket connection for GoalScorerCard
    const goalScorerSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/goalscorercard/${matchId}/`);
    goalScorerSocket.onopen = () => console.log('GoalScorer WebSocket connected');
    goalScorerSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setGoalScorerCardIsLive(data.isLive);
      } 
      if (data.x && data.y) {
        setDraggableGoalScorer({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setGoalScorerCardData(data.data.data);
      }
    };

    // WebSocket connection for CardsCard
    const cardsSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/cardscard/${matchId}/`);
    cardsSocket.onopen = () => console.log('Cards WebSocket connected');
    cardsSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setCardsCardIsLive(data.isLive);
      } 
      if (data.x && data.y) {
        setDraggableCards({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setCardsCardData(data.data.data);
      }
    };

    // WebSocket connection for FreeTextCard
    const freeTextSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/freetextcard/${matchId}/`);
    freeTextSocket.onopen = () => console.log('FreeText WebSocket connected');
    freeTextSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setFreeTextCardIsLive(data.isLive);
      } 
      if (data.x && data.y) {
        setDraggableFreeText({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setFreeTextCardData(data.data.data);
      }
    };

    // WebSocket connection for SwapsCard
    const swapsSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/swapscard/${matchId}/`);
    swapsSocket.onopen = () => console.log('Swaps WebSocket connected');
    swapsSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setSwapsCardIsLive(data.isLive);
      } 
      if (data.x && data.y) {
        setDraggableSwaps({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setSwapsCardData(data.data.data);
      }
    };

    // WebSocket connection for TimeCard
    const timeSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/timecard/${matchId}/`);
    timeSocket.onopen = () => console.log('Time WebSocket connected');
    timeSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setTimeCardIsLive(data.isLive);
      } 
      if (data.x && data.y) {
        setDraggableTime({ x: data.x, y: data.y });
      }
      if (data?.data && data.data?.type === 'send_data') {
        setTimeCardData(data.data.data);
      }
    };

  }, [matchId]);

  return (
    <div className='rounded-xl m-6 flex justify-center items-center h-[calc(100vh-50px)]'>
      {scoreCardIsLive && (
        <div style={{ position: 'absolute', left: draggableScore.x, top: draggableScore.y }} className='p-6'>
          <ScoreCard x={0} y={0} data={scoreCardData} time={scoreCardTime}/>
        </div>
      )}

      {matchCardIsLive && (
        <div style={{ position: 'absolute', left: draggableMatch.x, top: draggableMatch.y }} className='p-6'>
          <MatchCard x={0} y={0} data={matchCardData} />
        </div>
      )}

      {scheduleCardIsLive && (
        <div style={{ position: 'absolute', left: draggableSchedule.x, top: draggableSchedule.y }} className='p-6'>
          <ScheduleCard x={0} y={0} data={scheduleCardData} />
        </div>
      )}

      {refereesCardIsLive && (
        <div style={{ position: 'absolute', left: draggableReferees.x, top: draggableReferees.y }} className='p-6'>
          <RefereesCard x={0} y={0} data={refereesCardData} />
        </div>
      )}

      {goalScorerCardIsLive && (
        <div style={{ position: 'absolute', left: draggableGoalScorer.x, top: draggableGoalScorer.y }} className='p-6'>
          <GoalScorerCard x={0} y={0} data={goalScorerCardData} />
        </div>
      )}

      {cardsCardIsLive && (
        <div style={{ position: 'absolute', left: draggableCards.x, top: draggableCards.y }} className='p-6'>
          <CardsCard x={0} y={0} data={cardsCardData} />
        </div>
      )}

      {freeTextCardIsLive && (
        <div style={{ position: 'absolute', left: draggableFreeText.x, top: draggableFreeText.y }} className='p-6'>
          <FreeTextCard x={0} y={0} data={freeTextCardData} />
        </div>
      )}

      {swapsCardIsLive && (
        <div style={{ position: 'absolute', left: draggableSwaps.x, top: draggableSwaps.y }} className='p-6'>
          <SwapsCard x={0} y={0} data={swapsCardData} />
        </div>
      )}

      {timeCardIsLive && (
        <div style={{ position: 'absolute', left: draggableTime.x, top: draggableTime.y }} className='p-6'>
          <TimeCard x={0} y={0} data={timeCardData} />
        </div>
      )}
    </div>
  );
};

export default Live;
