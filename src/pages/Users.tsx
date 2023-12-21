import React, { useEffect, useState } from 'react';
import { Button, Table, message, Input } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import { confirmation } from '../components/Confirmation';
import { useNavigate } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';

interface IUser {
  id: number;
  username: string;
  role: string;
  verified: boolean;
}

const Users: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  console.log(currentPage)

  const columns: ColumnsType<IUser> = [
    {
      title: 'USERNAME',
      dataIndex: 'username',
      key: 'username',
      width: 100,
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
      width: 120,
    },
    {
      title: 'VERIFIED',
      dataIndex: 'verified',
      key: 'verified',
      width: 120,
      render: (_, record) => (record.verified ? 'Yes' : 'No'),
    },
    {
      title: 'ACTIONS',
      dataIndex: 'actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, user) => (
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
      ),
    },
  ];

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);

      const response = await axios.get('/user/');

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
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`/user-lobby/${userId}/`);
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
