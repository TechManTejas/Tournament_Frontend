/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, message, Input, Image, Card, Pagination, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { confirmation } from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import { IStadium } from '../types/stadium.types'; // Assuming you have a type for Stadium
import { getUserDataFromStorage } from '../utils/storage';

const Stadiums: React.FC = () => {
    const navigate = useNavigate();

    const isClubAdmin = getUserDataFromStorage()?.user?.role === 'club_admin';

    const [loading, setLoading] = useState<boolean>(false);
    const [stadiums, setStadiums] = useState<IStadium[]>([]);
    const [totalStadiums, setTotalStadiums] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;

    const fetchData = async (page: number = 1, search: string = '') => {
        try {
            setLoading(true);

            const response = await axios.get('/stadium/', {
                params: {
                    page,
                    search,
                },
            });

            setStadiums(response.data.results);
            setTotalStadiums(response.data.count);
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

    const handleDeleteStadium = async (stadiumId: number) => {
        try {
            await axios.delete(`/stadium/${stadiumId}/`);
            setStadiums((prevStadiums) => prevStadiums.filter((s) => s.id !== stadiumId));
            message.success('Stadium deleted successfully!');
        } catch (error) {
            console.error('Error deleting stadium:', error);
            message.error('Error deleting stadium. Please try again.');
        }
    };

    const handleDeleteConfirmation = async (stadiumId: number) => {
        const shouldDelete = await confirmation('Are you sure you want to delete this Stadium?');
        if (shouldDelete) {
            handleDeleteStadium(stadiumId);
        }
    };

    const mapDataToCardFormat = (data: IStadium[]): React.ReactNode => {
        return data.map((stadium) => (
            <Card
                key={stadium.id}
                hoverable
                style={{ width: 300, marginBottom: 16 }}
                cover={<Image src={stadium.image} alt='Stadium' preview={false} />}
                actions={[
                    <Button
                        key='edit'
                        type='primary'
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(stadium)}
                    >
                        Edit
                    </Button>,
                    <Button
                        key='delete'
                        type='primary'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteConfirmation(stadium.id)}
                    >
                        Delete
                    </Button>,
                ]}
            >
                <Card.Meta title={stadium.name} description={stadium.address} />
            </Card>
        ));
    };

    const handleEdit = (stadium: IStadium) => {
        navigate('/dashboard/stadiums/add-edit', {
            state: { stadium },
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
                        <div className='text-2xl'>STADIUMS</div>
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
                                            navigate('/dashboard/stadiums/add-edit');
                                        }}
                                    >
                                        ADD NEW
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-4'>
                        {mapDataToCardFormat(stadiums)}
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalStadiums}
                        onChange={handlePageChange}
                        className='mt-4'
                    />
                </div>
            </div>
        </>
    );
};

export default Stadiums;
