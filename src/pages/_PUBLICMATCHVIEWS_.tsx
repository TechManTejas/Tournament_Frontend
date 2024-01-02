import React from 'react';
import { Table } from 'antd';

const PUBLICMATCHVIEWS: React.FC = () => {
  // Sample data for the football tournament scoreboard
  const dataSource = [
    {
      key: '1',
      team: 'Team A',
      points: 3,
      goalsFor: 5,
      goalsAgainst: 2,
    },
    {
      key: '2',
      team: 'Team B',
      points: 1,
      goalsFor: 3,
      goalsAgainst: 3,
    },
    {
      key: '3',
      team: 'Team C',
      points: 0,
      goalsFor: 1,
      goalsAgainst: 4,
    },
    // Add more teams as needed
  ];

  // Columns configuration for the Ant Design table
  const columns = [
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: 'Goals For',
      dataIndex: 'goalsFor',
      key: 'goalsFor',
    },
    {
      title: 'Goals Against',
      dataIndex: 'goalsAgainst',
      key: 'goalsAgainst',
    },
  ];

  return (
    <div className='border border-black rounded-xl m-6 flex justify-center items-center h-[calc(100vh-50px)]'>
      <Table dataSource={dataSource} columns={columns} pagination={false}/>
    </div>
  );
};

export default PUBLICMATCHVIEWS;
