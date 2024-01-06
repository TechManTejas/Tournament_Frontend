// GameModeSelector.tsx
import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { GameMode } from '../types/tournament.types'; // Assuming you have a type for GameMode
import axios from '../api/axios';

interface GameModeSelectorProps {
    selectedGameMode: GameMode | null;
    onSelect: (gameMode: GameMode) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ selectedGameMode, onSelect }) => {
    const [gameModes, setGameModes] = useState<GameMode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGameModes = async () => {
            try {
                const response = await axios.get('/gamemode/');
                console.log(response.data);
                setGameModes(response.data);
            } catch (error) {
                console.error('Error fetching game modes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameModes();
    }, []);

    if (loading) {
        return <Spin />;
    }

    return (
        <div className="flex flex-wrap gap-4">
            {gameModes.map((mode) => (
                <Card
                    key={mode.id}
                    hoverable
                    style={{ width: 200 }}
                    onClick={() => onSelect(mode)}
                    className={`game-mode-card ${selectedGameMode === mode ? 'shadow-xl border-2 border-green-500' : ''}`}
                >
                    <Card.Meta
                        title={mode.name}
                        description={mode.description}
                        className='h-60 over'
                    />
                </Card>
            ))}
        </div>
    );
};

export default GameModeSelector;