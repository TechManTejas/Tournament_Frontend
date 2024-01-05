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

const Live: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = id ? parseInt(id, 10) : 0;

  const parentWidth = window.innerWidth;
  const parentHeight = window.innerHeight;

  const [draggableScore, setDraggableScore] = useState<DraggableScore>({ x: ((parentWidth - 320) / 2) - 32, y: ((parentHeight - 96) / 2) - 30 });
  const [scoreCardIsLive, setScoreCardIsLive] = useState(false);

  const [draggableMatch, setDraggableMatch] = useState<DraggableMatch>({ x: ((parentWidth - 560) / 2) - 32, y: ((parentHeight - 180) / 2) - 30 });
  const [matchCardIsLive, setMatchCardIsLive] = useState(false);

  const [draggableSchedule, setDraggableSchedule] = useState<DraggableSchedule>({ x: ((parentWidth - 720) / 2) - 32, y: ((parentHeight - 450) / 2) - 30 });
  const [scheduleCardIsLive, setScheduleCardIsLive] = useState(false);

  const [draggableReferees, setDraggableReferees] = useState<DraggableReferees>({ x: ((parentWidth - 460) / 2) - 32, y: ((parentHeight - 280) / 2) - 30 });
  const [refereesCardIsLive, setRefereesCardIsLive] = useState(false);

  const [draggableGoalScorer, setDraggableGoalScorer] = useState<DraggableGoalScorer>({ x: ((parentWidth - 640) / 2) - 32, y: ((parentHeight - 200) / 2) - 30 });
  const [goalScorerCardIsLive, setGoalScorerCardIsLive] = useState(false);

  const [draggableCards, setDraggableCards] = useState<DraggableCards>({ x: ((parentWidth - 580) / 2) - 32, y: ((parentHeight - 180) / 2) - 30 });
  const [cardsCardIsLive, setCardsCardIsLive] = useState(false);

  const [draggableFreeText, setDraggableFreeText] = useState<DraggableFreeText>({ x: ((parentWidth - 580) / 2) - 32, y: ((parentHeight - 180) / 2) - 30 });
  const [freeTextCardIsLive, setFreeTextCardIsLive] = useState(false);

  const [draggableSwaps, setDraggableSwaps] = useState<DraggableSwaps>({ x: ((parentWidth - 720) / 2) - 32, y: ((parentHeight - 450) / 2) - 30 });
  const [swapsCardIsLive, setSwapsCardIsLive] = useState(false);

  useEffect(() => {
    // WebSocket connection for ScoreCard
    const scoreSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/scorecard/${matchId}/`);
    scoreSocket.onopen = () => console.log('Score WebSocket connected');
    scoreSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setScoreCardIsLive(data.isLive);
      } else {
        setDraggableScore({ x: data.x, y: data.y });
      }
    };

    // WebSocket connection for MatchCard
    const matchSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/matchcard/${matchId}/`);
    matchSocket.onopen = () => console.log('Match WebSocket connected');
    matchSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setMatchCardIsLive(data.isLive);
      } else {
        setDraggableMatch({ x: data.x, y: data.y });
      }
    };

    // WebSocket connection for ScheduleCard
    const scheduleSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/schedulecard/${matchId}/`);
    scheduleSocket.onopen = () => console.log('Schedule WebSocket connected');
    scheduleSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setScheduleCardIsLive(data.isLive);
      } else {
        setDraggableSchedule({ x: data.x, y: data.y });
      }
    };

    // WebSocket connection for RefereesCard
    const refereesSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/refereescard/${matchId}/`);
    refereesSocket.onopen = () => console.log('Referees WebSocket connected');
    refereesSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setRefereesCardIsLive(data.isLive);
      } else {
        setDraggableReferees({ x: data.x, y: data.y });
      }
    };

    // WebSocket connection for GoalScorerCard
    const goalScorerSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/goalscorercard/${matchId}/`);
    goalScorerSocket.onopen = () => console.log('GoalScorer WebSocket connected');
    goalScorerSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setGoalScorerCardIsLive(data.isLive);
      } else {
        setDraggableGoalScorer({ x: data.x, y: data.y });
      }
    };

    // WebSocket connection for CardsCard
    const cardsSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/cardscard/${matchId}/`);
    cardsSocket.onopen = () => console.log('Cards WebSocket connected');
    cardsSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setCardsCardIsLive(data.isLive);
      } else {
        setDraggableCards({ x: data.x, y: data.y });
      }
    };

    // WebSocket connection for FreeTextCard
    const freeTextSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/freetextcard/${matchId}/`);
    freeTextSocket.onopen = () => console.log('FreeText WebSocket connected');
    freeTextSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setFreeTextCardIsLive(data.isLive);
      } else {
        setDraggableFreeText({ x: data.x, y: data.y });
      }
    };

    // WebSocket connection for SwapsCard
    const swapsSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/swapscard/${matchId}/`);
    swapsSocket.onopen = () => console.log('Swaps WebSocket connected');
    swapsSocket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);
      if (data.isLive !== undefined) {
        setSwapsCardIsLive(data.isLive);
      } else {
        setDraggableSwaps({ x: data.x, y: data.y });
      }
    };

  }, [matchId]);

  return (
    <div className='rounded-xl m-6 flex justify-center items-center h-[calc(100vh-50px)]'>
      {scoreCardIsLive && (
        <div style={{ position: 'absolute', left: draggableScore.x, top: draggableScore.y }} className='p-6'>
          <ScoreCard x={draggableScore.x} y={draggableScore.y} />
        </div>
      )}

      {matchCardIsLive && (
        <div style={{ position: 'absolute', left: draggableMatch.x, top: draggableMatch.y }} className='p-6'>
          <MatchCard x={draggableMatch.x} y={draggableMatch.y} />
        </div>
      )}

      {scheduleCardIsLive && (
        <div style={{ position: 'absolute', left: draggableSchedule.x, top: draggableSchedule.y }} className='p-6'>
          <ScheduleCard x={draggableSchedule.x} y={draggableSchedule.y} />
        </div>
      )}

      {refereesCardIsLive && (
        <div style={{ position: 'absolute', left: draggableReferees.x, top: draggableReferees.y }} className='p-6'>
          <RefereesCard x={draggableReferees.x} y={draggableReferees.y} />
        </div>
      )}

      {goalScorerCardIsLive && (
        <div style={{ position: 'absolute', left: draggableGoalScorer.x, top: draggableGoalScorer.y }} className='p-6'>
          <GoalScorerCard x={draggableGoalScorer.x} y={draggableGoalScorer.y} />
        </div>
      )}

      {cardsCardIsLive && (
        <div style={{ position: 'absolute', left: draggableCards.x, top: draggableCards.y }} className='p-6'>
          <CardsCard x={draggableCards.x} y={draggableCards.y} />
        </div>
      )}

      {freeTextCardIsLive && (
        <div style={{ position: 'absolute', left: draggableFreeText.x, top: draggableFreeText.y }} className='p-6'>
          <FreeTextCard x={draggableFreeText.x} y={draggableFreeText.y} />
        </div>
      )}

      {swapsCardIsLive && (
        <div style={{ position: 'absolute', left: draggableSwaps.x, top: draggableSwaps.y }} className='p-6'>
          <SwapsCard x={draggableSwaps.x} y={draggableSwaps.y} />
        </div>
      )}
    </div>
  );
};

export default Live;
