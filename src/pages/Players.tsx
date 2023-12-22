/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, message, Input, Image, Card, Pagination, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { confirmation } from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import { IPlayer } from '../types/player.types'; // Assuming you have a type for Player
import { getUserDataFromStorage } from '../utils/storage';

const Players: React.FC = () => {
    const navigate = useNavigate();

    const isClubAdmin = getUserDataFromStorage()?.user?.role === 'club_admin';

    const [loading, setLoading] = useState<boolean>(false);
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [totalPlayers, setTotalPlayers] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;

    const fetchData = async (page: number = 1, search: string = '') => {
        try {
            setLoading(true);

            const response = await axios.get('/player/', {
                params: {
                    page,
                    search,
                },
            });

            console.log(response.data);

            setPlayers(response.data.results);
            setTotalPlayers(response.data.count);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = (page: number) => {
        fetchData(page);
    };

    const handleSearch = (value: string) => {
        fetchData(1, value);
    };

    const handleDeletePlayer = async (playerId: number) => {
        try {
            await axios.delete(`/player/${playerId}/`);
            setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== playerId));
            message.success('Player deleted successfully!');
        } catch (error) {
            console.error('Error deleting player:', error);
            message.error('Error deleting player. Please try again.');
        }
    };

    const handleDeleteConfirmation = async (playerId: number) => {
        const shouldDelete = await confirmation('Are you sure you want to delete this Player?');
        if (shouldDelete) {
            handleDeletePlayer(playerId);
        }
    };

    const mapDataToCardFormat = (data: IPlayer[]): React.ReactNode => {
        return data.map((player) => (
            <Card
                key={player.id}
                hoverable
                style={{ width: 250, marginBottom: 16 }}
                cover={<Image style={{ height: 350, objectFit:"cover" }}  src={player.image} alt='Player'/>}
                actions={[
                    <Button
                        key='edit'
                        type='primary'
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(player)}
                    >
                        Edit
                    </Button>,
                    <Button
                        key='delete'
                        type='primary'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteConfirmation(player.id)}
                    >
                        Delete
                    </Button>,
                ]}
            >
                <Card.Meta title={player.name} description={`Squad Number: ${player.squad_number}`} />
            </Card>
        ));
    };

    const handleEdit = (player: IPlayer) => {
        navigate('/dashboard/players/add-edit', {
            state: { player },
        });
    };

    return (
        <>
            <div className='relative px-10 py-6 w-full h-full'>
                <div className='absolute top-1/2 left-1/2'>
                    <Spin spinning={loading} size={'large'} className='mt-4' />
                </div>
                <div>
                    <div className='flex justify-between items-center w-full gap-x-4'>
                        <div className='text-2xl'>PLAYERS</div>
                        <div className='flex space-x-3'>
                            <Input
                                size='large'
                                placeholder='Search...'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {isClubAdmin && (
                                <div>
                                    <Button
                                        type='primary'
                                        icon={<PlusOutlined />}
                                        size='large'
                                        className='font-bold text-md'
                                        onClick={() => {
                                            navigate('/dashboard/players/add-edit');
                                        }}
                                    >
                                        ADD NEW
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                        {mapDataToCardFormat(players)}
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalPlayers}
                        onChange={handlePageChange}
                        className='mt-4'
                    />
                </div>
            </div>
        </>
    );
};

export default Players;
