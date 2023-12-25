import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Table, message } from 'antd'
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { ITeamRecord } from '../types/team.types';
import { getUserDataFromStorage } from '../utils/storage';
import axios from "../api/axios"
import { confirmation } from '../components/Confirmation';
import { ITournament } from '../types/tournament.types';

interface TeamsProps {
  toggleAddEdit: () => void;
  handleSelectTeam: (team: ITeamRecord | undefined) => void;
  tournament: ITournament | undefined;
}


export const Teams: React.FC<TeamsProps>  = ({ toggleAddEdit, handleSelectTeam, tournament }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [teamRecords, setTeamRecords] = useState<ITeamRecord[]>([]);
  const [totalTeamRecords, setTotalTeamRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const isClubAdmin = getUserDataFromStorage()?.user?.role === 'club_admin'

  const mapTeamRecordDataToTableFormat = (data: ITeamRecord[]): Array<{
    id: number,
    name: string,
    logo: string,
  }> => {
    return data.map((teamRecord) => ({
      id: teamRecord?.id,
      name: teamRecord?.name,
      logo: teamRecord?.logo
    }));
  };

  const formattedData = mapTeamRecordDataToTableFormat(teamRecords);

  const columns: ColumnsType<{
    id: number,
    name: string,
    logo: string,
  }> = [
      {
        title: 'NAME',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (_, teamRecord) => (
          <div className='flex items-center'>
            <img src={teamRecord.logo} alt={`${teamRecord.name} Logo`} className='w-6 h-6 mr-2' />
            {teamRecord.name}
          </div>
        ),
      },
      {
        title: 'ACTIONS',
        dataIndex: 'actions',
        key: 'actions',
        width: 100,
        render: (_, teamRecord) => {
          return isClubAdmin ? (
            <div className='text-primary font-bold flex flex-wrap gap-1'>
              <Button
                type='primary'
                className='rounded w-10 h-10 flex justify-center items-center'
                onClick={() => {
                  const teamRecordToEdit = teamRecords.find((record) => record.id === teamRecord.id)
                  handleSelectTeam(teamRecordToEdit)
                  console.log(`Edit team: ${teamRecord.name}`);
                }}
                icon={<EditOutlined />} />
              <Button
                type='primary'
                className='rounded w-10 h-10 flex justify-center items-center'
                onClick={() => handleDeleteConfirmation(teamRecord.id)}
                icon={<DeleteOutlined />}
              />
            </div>
          ) : null;
        },
      },
    ];

  const fetchData = async (page: number = 1, search: string = '', tournament_id?: number) => {
    try {
      setLoading(true);

      const response = await axios.get('/teamrecord/', {
        params: {
          page,
          search,
          tournament_id,
        },
      });

      console.log(response.data);

      setTeamRecords(response.data.results);
      setTotalTeamRecords(response.data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data for the initial page, search, and specify the tournamentId if needed
    fetchData(1, '', tournament?.id);
  }, [tournament]); 

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleSearch = (value: string) => {
    fetchData(1, value);
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      await axios.delete(`/teamrecord/${teamId}/`);
      setTeamRecords((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
      message.success('Team deleted successfully!');
    } catch (error) {
      console.error('Error deleting team:', error);
      message.error('Error deleting team. Please try again.');
    }
  };

  const handleDeleteConfirmation = async (teamId: number) => {
    const shouldDelete = await confirmation('Are you sure you want to delete this Team?');
    if (shouldDelete) {
      handleDeleteTeam(teamId);
    }
  };

  return (
    <>
      <div>
        <div className='flex justify-end'>
          <div className='flex gap-4'>
            <Input
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Search...'
              className='mb-2'
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button
              type='primary'
              icon={<PlusOutlined />}
              className='font-bold text-md'
              onClick={toggleAddEdit}
            >
              ADD NEW
            </Button>
          </div>
        </div>
        <div className='flex'>

          <div className='w-full'>
            <Table
              columns={columns}
              dataSource={formattedData}
              pagination={{
                position: ['bottomRight'],
                pageSize: 10,
                total: totalTeamRecords,
                onChange: handlePageChange,
                current: currentPage,
              }}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  )
}
