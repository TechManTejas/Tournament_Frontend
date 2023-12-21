import React, { useEffect, useState } from 'react';
import { Button, Image, Table, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import axios from "../api/axios"
import Search from 'antd/es/input/Search';
import { IStadium } from '../types/stadium.types';
import { confirmation } from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';

const Stadiums: React.FC = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(false);
    const [stadiums, setStadiums] = useState<IStadium[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [totalStadiums, setTotalStadiums] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const columns: ColumnsType<{
        id: number;
        club: string;
        name: string;
        image: string;
        address: string;
    }> = [
            {
                title: 'NAME',
                dataIndex: 'name',
                key: 'name',
                width: 100
            },
            {
                title: 'IMAGE',
                dataIndex: 'image',
                key: 'image',
                width: 120,
                render: (_, record) =>
                    <>
                        <Image key={_} src={record.image} alt="Stadium Image" width={100} />
                    </>,
            },
            {
                title: 'ADDRESS',
                dataIndex: 'address',
                key: 'address',
                width: 140
            },
            {
                title: 'ACTIONS',
                dataIndex: 'actions',
                key: 'actions',
                fixed: 'right',
                width: 100,
                render: (_, stadium) => (
                    <div className='text-primary font-bold flex flex-wrap space-x-1'>
                        <Button type='primary' className='rounded w-10 h-10 flex justify-center items-center' onClick={() => {
                            const stadiumToEdit = stadiums.find((c) => c.id === stadium.id)
                            navigate('/dashboard/stadiums/add-edit', { state: { stadium: stadiumToEdit } })
                        }}>
                            {<EditOutlined />}
                        </Button>
                        <Button type='primary' className='rounded w-10 h-10 flex justify-center items-center' onClick={() => handleDeleteConfirmation(stadium.id)}>
                            <DeleteOutlined />
                        </Button>
                    </div>
                ),
            },
        ];

    const fetchData = async (page: number = 1) => {
        try {
            setLoading(true);

            const response = await axios.get('/stadium/');

            console.log(response.data)

            setStadiums(response.data.results);
            setTotalStadiums(response.data.count);
            setCurrentPage(page)

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const handlePageChange = (page: number) => {
        fetchData(page);
    };

    const handleDeleteStadium = async (stadiumId: number) => {
        try {
            await axios.delete(`/stadium/${stadiumId}/`);
            setStadiums((prevStadiums) => prevStadiums.filter((stadium) => stadium.id !== stadiumId));
            message.success('Stadium deleted successfully!');
        } catch (error) {
            console.error('Error deleting stadium:', error);
            message.error('Error deleting stadium. Please try again.');
        }
    };

    const handleDeleteConfirmation = async (stadiumId: number) => {
        const shouldDelete = await confirmation("Are you sure you want to delete this Stadium?");
        if (shouldDelete) {
            handleDeleteStadium(stadiumId);
        }
    };

    const mapDataToTableFormat = (data: IStadium[]): Array<{
        id: number;
        club: string;
        name: string;
        image: string;
        address: string;
    }> => {
        return data.map(stadium => ({
            id: stadium?.id,
            club: stadium?.club.name,
            name: stadium?.name,
            image: stadium?.image?.image,
            address: stadium?.address,
        }));
    };

    const formattedData = mapDataToTableFormat(stadiums);

    return (
        <div className='px-10 py-6'>
            <div className=''>
                <div className='flex justify-between items-center w-full gap-x-4'>
                    <div className='text-2xl'>
                        STADIUM
                    </div>
                    <div className='flex space-x-3'>
                        <Search
                            size={'large'}
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div>
                            <Button type='primary' icon={<PlusOutlined />} size={'large'} className='font-bold text-md' onClick={() => {
                                navigate('/dashboard/stadiums/add-edit')
                            }}>
                                ADD NEW
                            </Button>
                        </div>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={formattedData}
                    pagination={{
                        position: ['bottomRight'],
                        pageSize: 10,
                        total: totalStadiums,
                        onChange: handlePageChange,
                    }}
                    scroll={{
                        y: 600
                    }}
                    loading={loading}
                />
            </div>
        </div>
    )
};

export default Stadiums;
