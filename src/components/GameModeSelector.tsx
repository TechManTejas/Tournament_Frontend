import React, { useEffect, useState } from 'react';
import { Button, Card, Spin, message } from 'antd';
import { GameMode } from '../types/tournament.types'; // Assuming you have a type for GameMode
import axios from '../api/axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { confirmation } from './Confirmation';

interface GameModeSelectorProps {
    selectedGameMode: GameMode | null;
    onSelect: (gameMode: GameMode) => void;
    onEdit: (gameMode: GameMode) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ selectedGameMode, onSelect, onEdit }) => {
    const [gameModes, setGameModes] = useState<GameMode[]>([]);
    const [loading, setLoading] = useState(true);

    const handleEdit = (mode: GameMode) => {
        // Call the provided callback with the selected game mode
        if (onEdit) {
            onEdit(mode);
        }
    };

    // Function to handle delete action (you can implement as needed)
    const handleDelete = async (modeId: number) => {
        // Display confirmation modal
        const isConfirmed = await confirmation('Are you sure you want to delete this game mode?');
    
        // If user confirms, proceed with the deletion
        if (isConfirmed) {
            try {
                // Make the delete request here (you might want to handle errors appropriately)
                await axios.delete(`/gamemode/${modeId}`);
    
                // Update the state or fetch game modes again to reflect the changes
                // (You might need to implement this based on your API structure)
                const updatedGameModes = gameModes.filter((mode) => mode.id !== modeId);
                setGameModes(updatedGameModes);
    
                // Display success message
                message.success(`Successfully deleted game mode with ID: ${modeId}`);
            } catch (error) {
                console.error('Error deleting game mode:', error);
    
                // Display error message
                message.error('Error deleting game mode. Please try again later.');
            }
        }
    };

    useEffect(() => {
        const fetchGameModes = async () => {
            try {
                const response = await axios.get('/gamemode/');
                console.log(response);
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
                    <div className="mt-4 flex justify-between">
                        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(mode)} />
                        <Button className='bg-red-500 text-white' icon={<DeleteOutlined />} onClick={() => handleDelete(mode.id)} />
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default GameModeSelector;