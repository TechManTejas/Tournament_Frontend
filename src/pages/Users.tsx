import React, { useEffect, useState } from 'react';
import { Button, Table, message, Input } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { confirmation } from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { IUser } from '../types/user.types';
import { getUserDataFromStorage } from '../utils/storage';

const Users: React.FC = () => {
  const navigate = useNavigate();

  const isClubAdmin = getUserDataFromStorage()?.user?.role === 'club_admin'

  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const columns: ColumnsType<IUser> = [
    {
      title: 'USERNAME',
      dataIndex: 'username',
      key: 'username',
      width: 100,
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      width: 100,
    },
    {
      title: 'FIRSTNAME',
      dataIndex: 'first_name',
      key: 'first_name',
      width: 100,
    },
    {
      title: 'LASTNAME',
      dataIndex: 'last_name',
      key: 'last_name',
      width: 100,
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
      width: 100,
    },
    {
      title: 'ACTIONS',
      dataIndex: 'actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, user) => {

        return isClubAdmin ?
          (
            <div className='text-primary font-bold flex flex-wrap space-x-1'>
              <Button
                type='primary'
                className='rounded w-10 h-10 flex justify-center items-center'
                onClick={() => {
                  const userToEdit = users.find((u) => u.id === user.id);
                  navigate('/dashboard/users/add-edit', { state: { user: userToEdit } });
                }}
              >
                {<EditOutlined />}
              </Button>
              <Button
                type='primary'
                className='rounded w-10 h-10 flex justify-center items-center'
                onClick={() => handleDeleteConfirmation(user.id)}
              >
                <DeleteOutlined />
              </Button>
            </div>
          ) : null
      }
    }
  ];

  const fetchData = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);

      const response = await axios.get('/user/', {
        params: {
          page,
          search,
        },
      });

      console.log(response.data);

      setUsers(response.data.results);
      setTotalUsers(response.data.count);
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

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`/user/${userId}/`);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      message.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Error deleting user. Please try again.');
    }
  };

  const handleDeleteConfirmation = async (userId: number) => {
    const shouldDelete = await confirmation('Are you sure you want to delete this User?');
    if (shouldDelete) {
      handleDeleteUser(userId);
    }
  };

  const mapDataToTableFormat = (data: IUser[]): Array<IUser> => {
    return data.map((user) => ({
      id: user?.id,
      username: user?.username,
      email: user?.email,
      first_name: user?.first_name,
      last_name: user?.last_name,
      role: user?.role,
      verified: user?.verified || false,
    }));
  };

  const formattedData = mapDataToTableFormat(users);

  return (
    <div className='px-10 py-6'>
      <div className=''>
        <div className='flex justify-between items-center w-full gap-x-4'>
          <div className='text-2xl'>USERS</div>
          <div className='flex space-x-3'>
            <Input
              size='large'
              placeholder='Search...'
              onChange={(e) => handleSearch(e.target.value)}
            />
            {isClubAdmin &&
              <div>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  size='large'
                  className='font-bold text-md'
                  onClick={() => {
                    navigate('/dashboard/users/add-edit');
                  }}
                >
                  ADD NEW
                </Button>
              </div>
            }
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={formattedData}
          pagination={{
            position: ['bottomRight'],
            pageSize: 10,
            total: totalUsers,
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

export default Users;
