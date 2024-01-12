// Referees.tsx

import React, { useEffect, useState } from 'react';
import { Button, Table, message, Input } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { confirmation } from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { IReferee } from '../types/referee.types'; // Assuming you have a type for Referee
import { getUserDataFromStorage } from '../utils/storage';

const Referees: React.FC = () => {
  const navigate = useNavigate();

  const isClubAdmin = getUserDataFromStorage()?.user?.role === 'club_admin';

  const [loading, setLoading] = useState<boolean>(false);
  const [referees, setReferees] = useState<IReferee[]>([]);
  const [totalReferees, setTotalReferees] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const columns: ColumnsType<{
    id:number;
    name:string;
  }> = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Aktionen',
      dataIndex: 'actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, referee) => {
        return isClubAdmin ? (
          <div className='text-primary font-bold flex flex-wrap space-x-1'>
            <Button
              type='primary'
              className='rounded w-10 h-10 flex justify-center items-center'
              onClick={() => {
                const refereeToEdit = referees.find((r) => r.id === referee.id);
                navigate('/dashboard/referees/add-edit', {
                  state: { referee: refereeToEdit },
                });
              }}
            >
              {<EditOutlined />}
            </Button>
            <Button
              type='primary'
              className='rounded w-10 h-10 flex justify-center items-center'
              onClick={() => handleDeleteConfirmation(referee.id)}
            >
              <DeleteOutlined />
            </Button>
          </div>
        ) : null;
      },
    },
  ];

  const fetchData = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);

      const response = await axios.get('/referee/', {
        params: {
          page,
          search,
        },
      });

      setReferees(response.data.results);
      setTotalReferees(response.data.count);
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

  const handleDeleteReferee = async (refereeId: number) => {
    try {
      await axios.delete(`/referee/${refereeId}/`);
      setReferees((prevReferees) => prevReferees.filter((r) => r.id !== refereeId));
      message.success('Referee deleted successfully!');
    } catch (error) {
      console.error('Error deleting referee:', error);
      message.error('Error deleting referee. Please try again.');
    }
  };

  const handleDeleteConfirmation = async (refereeId: number) => {
    const shouldDelete = await confirmation('Are you sure you want to delete this Referee?');
    if (shouldDelete) {
      handleDeleteReferee(refereeId);
    }
  };

  const mapDataToTableFormat = (data: IReferee[]): Array<{
    id:number;
    name:string;
  }> => {
    return data.map((referee) => ({
      id: referee?.id,
      name: referee?.name,
    }));
  };

  const formattedData = mapDataToTableFormat(referees);

  return (
    <div className='px-10 py-6'>
      <div className=''>
        <div className='flex justify-between items-center w-full gap-x-4'>
          <div className='text-2xl'>Schiedsrichter</div>
          <div className='flex space-x-3'>
            <Input
              size='large'
              placeholder='Suchen...'
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
                    navigate('/dashboard/referees/add-edit');
                  }}
                >
                  Hinzufügen
                </Button>
              </div>
            )}
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={formattedData}
          pagination={{
            position: ['bottomRight'],
            pageSize: 10,
            total: totalReferees,
            onChange: handlePageChange,
            current: currentPage,
          }}
          scroll={{
            y: 600,
          }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Referees;
