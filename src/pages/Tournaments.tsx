/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios"
import { confirmation } from '../components/Confirmation';
import { Button, Card, Image, Input, Pagination, Spin, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

export const Tournaments = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [tournaments, setTournaments] = useState<any[]>([]); // Replace 'any' with the actual type
  const [totalTournaments, setTotalTournaments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const fetchData = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);

      const response = await axios.get('/tournament/', {
        params: {
          page,
          search,
        },
      });

      console.log(response.data);

      setTournaments(response.data.results);
      setTotalTournaments(response.data.count);
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

  const handleDeleteTournament = async (tournamentId: number) => {
    try {
      await axios.delete(`/tournament/${tournamentId}/`);
      setTournaments((prevTournaments) => prevTournaments.filter((t) => t.id !== tournamentId));
      message.success('Tournament deleted successfully!');
    } catch (error) {
      console.error('Error deleting tournament:', error);
      message.error('Error deleting tournament. Please try again.');
    }
  };

  const handleDeleteConfirmation = async (tournamentId: number) => {
    const shouldDelete = await confirmation('Are you sure you want to delete this Tournament?');
    if (shouldDelete) {
      handleDeleteTournament(tournamentId);
    }
  };

  const mapDataToCardFormat = (data: any[]): React.ReactNode => {
    return data.map((tournament) => (
      <Card
        key={tournament.id}
        hoverable
        style={{ width: 300, marginBottom: 16 }}
        cover={<Image src={tournament.logo} alt='Tournament' preview={false} />}
        actions={[
          <Button
            key='edit'
            type='primary'
            icon={<EditOutlined />}
            onClick={() => handleEdit(tournament)}
          >
            Edit
          </Button>,
          <Button
            key='delete'
            type='primary'
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteConfirmation(tournament.id)}
          >
            Delete
          </Button>,
          <Button
            key='manage'
            type='primary'
            style={{ backgroundColor: 'blue', borderColor: 'blue' }}
            onClick={() => handleManage(tournament)}
          >
            Manage
          </Button>,
        ]}
      >
        <Card.Meta title={tournament.name} description={tournament.alias} />
      </Card>
    ));
  };

  const handleEdit = (tournament: any) => {
    navigate('/dashboard/tournaments/add-edit', {
      state: { tournament },
    });
  };

  const handleManage = (tournament: any) => {
    navigate('/dashboard/tournaments/manage', {
      state: { tournament },
    });
  };

  useEffect(() => {
    // Algorithm for scheduling football tournament
    class FootballTournamentScheduler {
      teams: string[];
      groups: string[][];

      constructor(teams: string[][]) {
        this.teams = teams.flat();
        this.groups = teams;
      }

      generateSchedule(): string[][] {
        const schedule: string[][] = [];

        // Round-robin within each group
        for (const group of this.groups) {
          const groupSchedule = this.generateRoundRobin(group);
          schedule.push(...groupSchedule);
        }

        // Organize the schedule to alternate between groups
        const organizedSchedule = this.organizeSchedule(schedule);

        return organizedSchedule;
      }

      generateRoundRobin(group: string[]): string[][] {
        const roundRobinSchedule: string[][] = [];
        const groupSize = group.length;

        // Ensure each team plays against every other team exactly once
        for (let i = 0; i < groupSize - 1; i++) {
          for (let j = i + 1; j < groupSize; j++) {
            const match = [group[i], group[j]];
            roundRobinSchedule.push(match);
          }
        }

        // Shuffle the matches to avoid consecutive matches for the same team
        this.shuffle(roundRobinSchedule);

        return roundRobinSchedule;
      }

      shuffle(array: any[]): void {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
      }

      organizeSchedule(schedule: string[][]): string[][] {
        const organizedSchedule: string[][] = [];
        const groupsCount = this.groups.length;

        for (let i = 0; i < groupsCount; i++) {
          for (let j = i; j < schedule.length; j += groupsCount) {
            organizedSchedule.push(schedule[j]);
          }
        }

        return organizedSchedule;
      }

      countMatchesByTeam(schedule: string[][]): Map<string, number> {
        const matchesByTeam = new Map<string, number>();

        for (const match of schedule) {
          for (const team of match) {
            matchesByTeam.set(team, (matchesByTeam.get(team) || 0) + 1);
          }
        }

        return matchesByTeam;
      }
    }

    // Example usage
    const teamsInGroups = [
      ['TeamA', 'TeamB', 'TeamC', 'TeamD', 'TeamE'],
      ['TeamF', 'TeamG', 'TeamH', 'TeamI', 'TeamJ'],
      ['TeamK', 'TeamL', 'TeamM', 'TeamN', 'TeamO'],
      ['TeamP', 'TeamQ', 'TeamR', 'TeamS', 'TeamT'],
    ];

    const scheduler = new FootballTournamentScheduler(teamsInGroups);
    const tournamentSchedule = scheduler.generateSchedule();

    // Display the schedule in the console
    console.log('Tournament Schedule:');
    console.log(tournamentSchedule);
    console.log('Total Matches:', tournamentSchedule.length);

    // Count matches played by each team
    const matchesByTeam = scheduler.countMatchesByTeam(tournamentSchedule);
    console.log('Matches played by each team:');
    matchesByTeam.forEach((value, key) => {
      console.log(`${key}: ${value} matches`);
    });
  }, []);

  return <>
    <div className='relative px-10 py-6 w-full h-full'>
      <div className='absolute top-1/2 left-1/2'>
        <Spin spinning={loading} size={'large'} className='mt-4' />
      </div>
      <div>
        <div className='flex justify-between items-center w-full gap-x-4'>
          <div className='text-2xl'>TOURNAMENTS</div>
          <div className='flex space-x-3'>
            <Input
              size='large'
              placeholder='Search...'
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                size='large'
                className='font-bold text-md'
                onClick={() => {
                  navigate('/dashboard/tournaments/add-edit');
                }}
              >
                ADD NEW
              </Button>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-4'>{mapDataToCardFormat(tournaments)}</div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalTournaments}
          onChange={handlePageChange}
          className='mt-4'
        />
      </div>
    </div>
  </>;
};
