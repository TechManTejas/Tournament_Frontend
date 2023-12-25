/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Teams } from './Teams';
import { TeamAddEdit } from './TeamAddEdit';
import { ITeamRecord } from '../types/team.types';

const ManageTournament: React.FC = () => {

    const { state } = useLocation();
    const tournament = state?.tournament;

    const [teamAddEdit, setTeamAddEdit] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState<ITeamRecord | undefined>(undefined)

    const [groupAddEdit, setGroupAddEdit] = useState(false)
    const [roundedAddEdit, setRoundedAddEdit] = useState(false)

    const toggleAddEdit = () =>{
        setTeamAddEdit(!teamAddEdit)
    }

    const handleSelectTeam = (team: ITeamRecord | undefined) => {
        setSelectedTeam(team)
        toggleAddEdit()
    }

    if (!tournament) {
        // Handle the case where no tournament is passed in state
        return <div>No tournament data available</div>;
    }

    return (
        <div className='flex flex-col gap-4 h-full'>
            <div className='border border-green-500 rounded-lg flex gap-2 bg-white'>
                <div>
                    <img src={tournament.logo} alt={`${tournament.name} Logo`} width="160px" className='object-cover border shadow-lg rounded-lg' />
                </div>
                <div className='flex justify-between w-full'>
                    <div className='p-2'>
                        <div className='text-3xl font-semibold'>{tournament.name} <span className='text-base font-normal'>({tournament.alias})</span></div>
                        <div></div>
                        <div><strong>Start Time:</strong> {tournament.start_time}</div>
                        <div><strong>Start Date:</strong> {tournament.start_date}</div>
                    </div>
                    <div className='p-2'>
                        <div><strong>Status:</strong> {tournament.status}</div>
                        <div><strong>Game Mode:</strong> {tournament.game_mode?.name}</div>
                    </div>
                    <div className='p-2 flex flex-col jus'>
                        <div><strong>Playing Time:</strong> {tournament.playing_time} minutes</div>
                        <div><strong>Pause Between Games:</strong> {tournament.pause_between_games} minutes</div>
                        <div><strong>Points for Winner:</strong> {tournament.points_winner}</div>
                        <div><strong>Points for Draw:</strong> {tournament.points_draw}</div>
                        <div><strong>Points for Defeat:</strong> {tournament.points_defeat}</div>
                        <div><strong>Timer:</strong> {tournament.timer}</div>
                    </div>
                </div>
            </div>
            <div className='flex gap-4 h-full'>
                <div className='bg-white rounded-lg flex-grow p-2'>
                    <Tabs defaultActiveKey="overview" type="card">
                        <TabPane
                            tab="Teams"
                            key="teams"
                        >
                            {
                                teamAddEdit ?
                                    <TeamAddEdit 
                                        toggleAddEdit={toggleAddEdit}
                                        selectedTeam={selectedTeam}
                                        tournament={tournament}
                                    />
                                    :
                                    <Teams 
                                        toggleAddEdit={toggleAddEdit}
                                        handleSelectTeam={handleSelectTeam}
                                        tournament={tournament}
                                    />
                            }
                        </TabPane>
                        <TabPane
                            tab="Groups"
                            key="groups"
                        >
                            <div
                                className='w-full h-full bg-red-100'
                            >
                                Matches content goes here.
                            </div>
                        </TabPane>
                        <TabPane
                            tab="Rounds"
                            key="rounds"
                        >
                            <div
                                className='w-full h-full bg-red-100'
                            >
                                Matches content goes here.
                            </div>
                        </TabPane>
                    </Tabs>
                </div>

            </div>
        </div>
    );
};

export default ManageTournament;
