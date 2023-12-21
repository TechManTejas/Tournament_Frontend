import React, { useEffect, useState } from 'react';
import { Button, Image, Table, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import axios from "../api/axios"
import Search from 'antd/es/input/Search';
import { IMedia } from '../types/media.types';
import { confirmation } from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';

const Media: React.FC = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(false);
    const [medias, setMedias] = useState<IMedia[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [totalMedias, setTotalMedias] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const columns: ColumnsType<{
        id: number;
        user: string;
        name: string;
        image: string;
        type: string;
        category: string;
        verified: boolean;
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
                        <Image key={_} src={record.image} alt="Media Image" width={100} />
                    </>,
            },
            {
                title: 'TYPE',
                dataIndex: 'type',
                key: 'type',
                width: 140
            },
            {
                title: 'CATEGORY',
                dataIndex: 'category',
                key: 'category',
                width: 120
            },
            {
                title: 'VERIFIED',
                dataIndex: 'verified',
                key: 'verified',
                width: 100,
                render: (verified: boolean) => (verified ? 'Yes' : 'No'),
            },
            {
                title: 'ACTIONS',
                dataIndex: 'actions',
                key: 'actions',
                fixed: 'right',
                width: 100,
                render: (_, media) => (
                    !media.verified && 
                    <div className='text-primary font-bold flex flex-wrap space-x-1'>
                        <Button type='primary' className='rounded w-10 h-10 flex justify-center items-center' onClick={() => {
                            const mediaToEdit = medias.find((c) => c.id === media.id)
                            navigate('/dashboard/media/add-edit', { state: { media: mediaToEdit } })
                        }}>
                            {<EditOutlined/>}
                        </Button>
                        <Button type='primary' className='rounded w-10 h-10 flex justify-center items-center' onClick={() => handleDeleteConfirmation(media.id)}>
                            <DeleteOutlined/>
                        </Button>
                    </div>
                ),
            },
        ];

    const fetchData = async (page: number = 1) => {
        try {
            setLoading(true);

            const response = await axios.get('/media/');

            console.log(response.data)

            setMedias(response.data.results);
            setTotalMedias(response.data.count);
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

    const handleDeleteMedia = async (mediaId: number) => {
        try {
            // Make axios call to delete the coupon
            await axios.delete(`/media/${mediaId}/`);
            // Update the list after successful deletion
            setMedias((prevMedias) => prevMedias.filter((media) => media.id !== mediaId));
            // Fetch data for the current page to reflect the deletion
            // fetchData(currentPage); 
            console.log(currentPage)

            // Show a success message to the user
            message.success('Media deleted successfully!');
        } catch (error) {
            console.error('Error deleting media:', error);
            // Handle error (e.g., show an error message to the user)
            message.error('Error deleting media. Please try again.');
        }
    };

    const handleDeleteConfirmation = async (mediaId: number) => {
        const shouldDelete = await confirmation("Are you sure you want to delete this Media?");
        if (shouldDelete) {
            // User confirmed the deletion, call the delete function
            handleDeleteMedia(mediaId);
        }
    };

    const mapDataToTableFormat = (data: IMedia[]): Array<{
        id: number;
        user: string;
        name: string;
        image: string;
        type: string;
        category: string;
        verified: boolean;
    }> => {
        return data.map(media => ({
            id: media?.id,
            user: media?.user.username,
            name: media?.name,
            image: media?.image,
            type: media?.type,
            category: media?.category,
            verified: media?.verified,
        }));
    };

    const formattedData = mapDataToTableFormat(medias);

    return (
        <div className='px-10 py-6'>
            <div className=''>
                <div className='flex justify-between items-center w-full gap-x-4'>
                    <div className='text-2xl'>
                        MEDIA
                    </div>
                    <div className='flex space-x-3'>
                        <Search
                            size={'large'}
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        // onSearch={fetchData} // Trigger fetchData on search
                        />
                        <div>
                            <Button type='primary' icon={<PlusOutlined />} size={'large'} className='font-bold text-md' onClick={() => {
                                navigate('/dashboard/media/add-edit')
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
                        total: totalMedias,
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

export default Media;