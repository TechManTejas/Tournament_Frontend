import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import ScoreCard from '../components/ScoreCard';

interface DraggableScore {
  x: number;
  y: number;
}

const Live: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = id ? parseInt(id, 10) : 0;

  const [draggableScore, setDraggableScore] = useState<DraggableScore>({ x: 0, y: 0 });
  const [scoreCardIsLive, setScoreCardIsLive] = useState(false);

  useEffect(() => {
    const socket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/scorecard/${matchId}/`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data as string);

      // Check for live status from the server
      if (data.isLive !== undefined) {
        setScoreCardIsLive(data.isLive);
      } else {
        setDraggableScore({ x: data.x, y: data.y });
      }
    };

    return () => {
      socket.close();
    };
  }, [matchId]);

  return (
    <div className='rounded-xl m-6 flex justify-center items-center h-[calc(100vh-50px)]'>
      {scoreCardIsLive && (
        <div style={{ position: 'absolute', left: draggableScore.x, top: draggableScore.y }} className='p-6'>
          <ScoreCard x={draggableScore.x} y={draggableScore.y} />
        </div>
      )}
    </div>
  );
};

export default Live;
