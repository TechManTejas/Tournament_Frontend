/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Select, TimePicker, Button, RadioChangeEvent, Radio, Form, Tabs, Input, Table, Space, ColorPicker, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { DeleteOutlined, EditOutlined, MenuFoldOutlined, PauseCircleOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import { useLocation } from 'react-router-dom';
import axios from "../api/axios"
import { IReferee } from '../types/referee.types';
import { IStadium } from '../types/stadium.types';
import { ITournament } from '../types/tournament.types';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { IPlayer } from '../types/player.types';
import { IGroupTeam } from '../types/group.types';
import { confirmation } from '../components/Confirmation';

const { Option } = Select;

let colorA = '#ff0000';
let colorB = '#0000ff';

export const MatchDashboard: React.FC = () => {

    const location = useLocation();
    const { matchRecord, tournament, schedule } = location.state;

    const match_id = matchRecord.teamAGroupRecord.id + "-" + matchRecord.teamBGroupRecord.id


    const [updater, setUpdater] = useState<number>(0)

    const [matchData, setMatchData] = useState()
    const [teamAPlayers, setTeamAPlayers] = useState<IPlayer[]>([])
    const [teamBPlayers, setTeamBPlayers] = useState<IPlayer[]>([])

    const [teamAGoals, setTeamAGoals] = useState([]);
    const [teamBGoals, setTeamBGoals] = useState([]);
    const [nextMatches, setNextMatches] = useState([]);

    const [stadiums, setStadiums] = useState<IStadium[]>([]);
    const [referees, setReferees] = useState<IReferee[]>([]);

    const [formColorTeamA] = Form.useForm();
    const [formGoalTeamA] = Form.useForm();
    const [formPenaltyTeamA] = Form.useForm();
    const [formSubstitutionTeamA] = Form.useForm();

    const [formColorTeamB] = Form.useForm();
    const [formGoalTeamB] = Form.useForm();
    const [formPenaltyTeamB] = Form.useForm();
    const [formSubstitutionTeamB] = Form.useForm();

    const [colorPickerValueTeamA, setColorPickerValueTeamA] = useState<string>('#ff0000'); // Initial color for Team A
    const [colorPickerValueTeamB, setColorPickerValueTeamB] = useState<string>('#0000ff'); // Initial color for Team B

    const [formComment] = Form.useForm();

    const [activeTab, setActiveTab] = useState('1');

    const [matchCardSocket, setMatchCardSocket] = useState<W3CWebSocket | null>(null);
    const [scoreCardSocket, setScoreCardSocket] = useState<W3CWebSocket | null>(null);
    const [scheduleCardSocket, setScheduleSocket] = useState<W3CWebSocket | null>(null);
    const [goalScorerCardSocket, setGoalScorerCardSocket] = useState<W3CWebSocket | null>(null);

    const connectMatchSocket = () => {
        const newMatchSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/matchcard/${tournament.id}/`);

        newMatchSocket.onopen = () => {
            console.log('Match WebSocket connected');
            // Send a message to the server after connection
            const message = {
                data: {
                    teamA: {
                        name: matchRecord.teamAGroupRecord.team_record.name,
                        logo: matchRecord.teamAGroupRecord.team_record.logo,
                    },
                    teamB: {
                        name: matchRecord.teamBGroupRecord.team_record.name,
                        logo: matchRecord.teamBGroupRecord.team_record.logo,
                    },
                },
            };
            newMatchSocket.send(JSON.stringify(message));
        };

        setMatchCardSocket(newMatchSocket);
    };
    const connectScoreCardSocket = () => {
        const newScoreCardSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/scorecard/${tournament.id}/`);

        newScoreCardSocket.onopen = () => {
            console.log('ScoreCard WebSocket connected');

            // Send a message to the server after connection
            const message = {
                data: {
                    teamA: {
                        shortName: matchRecord.teamAGroupRecord.team_record.short_name,
                        score: teamAGoals.length, // Initial score, replace with the actual initial score
                        color: colorA, // Replace with the actual color
                    },
                    teamB: {
                        shortName: matchRecord.teamBGroupRecord.team_record.short_name,
                        score: teamBGoals.length, // Initial score, replace with the actual initial score
                        color: colorB, // Replace with the actual color
                    },
                },
            };

            newScoreCardSocket.send(JSON.stringify(message));
        };

        setScoreCardSocket(newScoreCardSocket);
    };
    const connectScheduleSocket = () => {
        const newScheduleSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/schedulecard/${tournament.id}/`);

        newScheduleSocket.onopen = () => {
            console.log('Schedule WebSocket connected');
            // Send schedule information to the server after connection
            const message = {
                data: {
                    // Replace the following with your actual schedule information
                    matches: nextMatches.map(match => ({
                        teamA: {
                            name: match.teamAGroupRecord.team_record.name,
                            logo: match.teamAGroupRecord.team_record.logo,
                        },
                        teamB: {
                            name: match.teamBGroupRecord.team_record.name,
                            logo: match.teamBGroupRecord.team_record.logo,
                        },
                        group: match.group, // Add other relevant fields as needed
                    })),
                },
            };
            newScheduleSocket.send(JSON.stringify(message));
        };

        setScheduleSocket(newScheduleSocket);
    };
    const connectGoalScorerCardSocket = () => {
        const newGoalScorerCardSocket = new W3CWebSocket(`${import.meta.env.VITE_BASE_SOCKET_URL}/ws/goalscorercard/${tournament.id}/`);

        newGoalScorerCardSocket.onopen = () => {
            console.log('Goal Scorer Card WebSocket connected');
            // Send a message to the server after connection
            const message = {
                data: {
                    teamA: {
                        score: teamAGoals.length,
                        name: matchRecord.teamAGroupRecord.team_record.name,
                        logo: matchRecord.teamAGroupRecord.team_record.logo,
                        goals: teamAGoals.map(goal => ({
                            player: goal.player.name,
                            minute: 'time'
                        })),
                    },
                    teamB: {
                        score: teamBGoals.length,
                        name: matchRecord.teamBGroupRecord.team_record.name,
                        logo: matchRecord.teamBGroupRecord.team_record.logo,
                        goals: teamBGoals.map(goal => ({
                            player: goal.player.name,
                            minute: 'time'
                        })),
                    },
                },
            };

            newGoalScorerCardSocket.send(JSON.stringify(message));
        };

        setGoalScorerCardSocket(newGoalScorerCardSocket);
    };

    const sendMatchInformationAgain = () => {
        if (matchCardSocket) {
            // Send information again
            const message = {
                data: {
                    teamA: {
                        name: matchRecord.teamAGroupRecord.team_record.name,
                        logo: matchRecord.teamAGroupRecord.team_record.logo,
                    },
                    teamB: {
                        name: matchRecord.teamBGroupRecord.team_record.name,
                        logo: matchRecord.teamBGroupRecord.team_record.logo,
                    },
                },
            };
            matchCardSocket.send(JSON.stringify(message));
        }
    };
    const sendScoreInformationAgain = () => {
        if (scoreCardSocket) {
            // Send updated scores
            const message = {
                data: {
                    teamA: {
                        shortName: matchRecord.teamAGroupRecord.team_record.short_name,
                        score: teamAGoals.length, // Replace with the updated score
                        color: colorA, // Replace with the updated color
                    },
                    teamB: {
                        shortName: matchRecord.teamBGroupRecord.team_record.short_name,
                        score: teamBGoals.length, // Replace with the updated score
                        color: colorB, // Replace with the updated color
                    },
                },
            };
            scoreCardSocket.send(JSON.stringify(message));
        }
    };
    const sendScheduleInformationAgain = () => {
        if (scheduleCardSocket) {
            // Send updated schedule information
            const message = {
                data: {
                    // Replace the following with your actual schedule information
                    matches: nextMatches.map(match => ({
                        teamA: {
                            name: match.teamAGroupRecord.team_record.name,
                            logo: match.teamAGroupRecord.team_record.logo,
                        },
                        teamB: {
                            name: match.teamBGroupRecord.team_record.name,
                            logo: match.teamBGroupRecord.team_record.logo,
                        },
                        group: match.group, // Add other relevant fields as needed
                    })),
                },
            };

            console.log(message)
            scheduleCardSocket.send(JSON.stringify(message));
        }
    };
    const sendGoalScorerInformationAgain = () => {
        if (goalScorerCardSocket) {
            // Send updated goal scorer information
            const message = {
                data: {
                    teamA: {
                        score: teamAGoals.length,
                        name: matchRecord.teamAGroupRecord.team_record.name,
                        logo: matchRecord.teamAGroupRecord.team_record.logo,
                        goals: teamAGoals.map(goal => ({
                            player: goal.player.name,
                            minute: 'time'
                        })),
                    },
                    teamB: {
                        score: teamBGoals.length,
                        name: matchRecord.teamBGroupRecord.team_record.name,
                        logo: matchRecord.teamBGroupRecord.team_record.logo,
                        goals: teamBGoals.map(goal => ({
                            player: goal.player.name,
                            minute: 'time'
                        })),
                    },
                },
            };
            goalScorerCardSocket.send(JSON.stringify(message));
        }
    };

    useEffect(() => {
        // Connect WebSocket when the component mounts
        connectMatchSocket();

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            if (matchCardSocket) {
                matchCardSocket.close();
            }
        };
    }, [matchRecord, tournament]);

    useEffect(() => {
        // Connect WebSocket when the component mounts
        connectScoreCardSocket();

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            if (scoreCardSocket) {
                scoreCardSocket.close();
            }
        };
    }, [matchRecord, tournament]);

    useEffect(() => {
        // Connect WebSocket when the component mounts
        connectScheduleSocket();

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            if (scheduleCardSocket) {
                scheduleCardSocket.close();
            }
        };
    }, [matchRecord, tournament, schedule]);

    useEffect(() => {
        // Connect WebSocket when the component mounts
        connectGoalScorerCardSocket();

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            if (goalScorerCardSocket) {
                goalScorerCardSocket.close();
            }
        };
    }, [matchRecord, tournament, teamAGoals, teamBGoals]);

    // Function to fetch stadiums
    const fetchStadiums = async () => {
        try {
            const response = await axios.get('/stadium-all/');
            console.log(response.data)
            setStadiums(response.data);
        } catch (error) {
            console.error('Error fetching stadiums:', error);
        }
    };

    // Function to fetch referees
    const fetchReferees = async () => {
        try {
            const response = await axios.get('/referee-all/');
            console.log(response.data)
            setReferees(response.data);
        } catch (error) {
            console.error('Error fetching referees:', error);
        }
    };

    const fetchGoalRecords = async () => {
        try {
            // Make a GET request to fetch all goal records for the current match
            const response = await axios.get(`/matchgoalrecord/?match=${match_id}`);
            console.log(response.data);

            // Filter goal records based on group_team_record
            const allGoals = response.data;
            const teamAGoalsFiltered = allGoals.filter(goal => goal.group_team_record === matchRecord.teamAGroupRecord.id);
            const teamBGoalsFiltered = allGoals.filter(goal => goal.group_team_record === matchRecord.teamBGroupRecord.id);

            // Filter out own goals
            const teamAGoalsWithoutOwnGoals = teamAGoalsFiltered.filter(goal => !goal.is_own_goal);
            const teamBGoalsWithoutOwnGoals = teamBGoalsFiltered.filter(goal => !goal.is_own_goal);

            // Set the filtered goals in state
            setTeamAGoals(teamAGoalsWithoutOwnGoals);
            setTeamBGoals(teamBGoalsWithoutOwnGoals);

            sendScoreInformationAgain()

            // Handle the fetched goal records, you may want to set them in state or perform other actions
        } catch (error) {
            console.error('Error fetching goal records:', error);
        }
    };

    const findNextMatches = () => {
        const matchIndex = schedule.findIndex(match => {
            const currentMatchId = `${match.teamAGroupRecord.id}-${match.teamBGroupRecord.id}`;
            return currentMatchId === match_id;
        });

        // If the match with the specified matchId is found
        if (matchIndex !== -1) {
            // Extract the next 4 matches if they exist
            const nextMatchesData = schedule.slice(matchIndex + 1, matchIndex + 5);

            // Set the nextMatches state
            setNextMatches(nextMatchesData);
        } else {
            console.log('Match not found in the schedule.');
        }
    };

    const getOrCreateMatchRecord = async (groupAId: number, groupBId: number) => {
        const matchId = `${groupAId}-${groupBId}`;

        try {
            // Attempt to fetch the match record
            const response = await axios.get(`/match/${matchId}/`);
            console.log(response.data)
            setMatchData(response.data)

            // Set initial values for the formComment
            formComment.setFieldsValue({
                gameStatus: response.data.status,
                stadium: response.data.stadium.id,
                refereeHead: response.data.referee_head.id,
                refereeAssistant1: response.data.referee_assistant.id,
                refereeAssistant2: response.data.referee_assistant_2.id,
                refereeAssistant3: response.data.referee_assistant_3.id,
            });

            setColorPickerValueTeamA(response.data.jersey_color_A)
            setColorPickerValueTeamB(response.data.jersey_color_B)

            // If the match record exists, return it
            return response.data;
        } catch (error) {
            // If the match record doesn't exist, create it
            const newMatchRecord = {
                teamA: matchRecord.teamAGroupRecord.id,
                teamB: matchRecord.teamBGroupRecord.id,
                id: matchId,
            };

            // Make a POST request to create the match record
            await axios.post('/match/', newMatchRecord);

            // Return the newly created match record
            return newMatchRecord;
        }
    };

    const updateStatus = async (values: any) => {

        try {

            const updateData = {
                id: match_id,
                status: values.gameStatus,
                stadium: values.stadium,
                refereeHead: values.refereeHead,
                refereeAssistant1: values.refereeAssistant1,
                refereeAssistant2: values.refereeAssistant2,
                refereeAssistant3: values.refereeAssistant3,
            };

            console.log(updateData)

            // Make an axios PUT request to update the status
            await axios.put(`/match/${match_id}/`, updateData);

            // Show Ant Design success message
            message.success('Status updated successfully');

            // Add any additional logic or UI updates after a successful update

            console.log('Status updated successfully');
        } catch (error) {
            // Handle validation or axios error
            console.error('Error updating status:', error);
        }
    };

    const updateTeamJerseyColorA = async (values: any) => {
        try {

            console.log(values);

            // Make an axios PUT request to update the jersey color for Team A
            const updateData = {
                id: match_id,
                jersey_color_A: colorPickerValueTeamA,
            };

            await axios.put(`/match/${match_id}/`, updateData);

            // Add any additional logic or UI updates after a successful update
            console.log('Jersey color for Team A updated successfully');

            // Display success message using Ant Design message
            message.success('Jersey color for Team A updated successfully');
        } catch (error) {
            // Handle validation or axios error
            console.error('Error updating jersey color for Team A:', error);
        }
    };

    const updateTeamJerseyColorB = async (values: any) => {
        try {

            console.log(values);

            // Make an axios PUT request to update the jersey color for Team A
            const updateData = {
                id: match_id,
                jersey_color_B: colorPickerValueTeamB,
            };

            await axios.put(`/match/${match_id}/`, updateData);

            // Add any additional logic or UI updates after a successful update
            console.log('Jersey color for Team B updated successfully');

            // Display success message using Ant Design message
            message.success('Jersey color for Team B updated successfully');
        } catch (error) {
            // Handle validation or axios error
            console.error('Error updating jersey color for Team B:', error);
        }
    };

    const createMatchGoalRecordTeamA = async (values: any) => {
        try {
            const playerId = values.selectOption;

            const goalRecordData = {
                match: match_id,
                group_team_record: matchRecord.teamAGroupRecord.id,
                other_group_team_record: matchRecord.teamBGroupRecord.id,
                player: playerId,
                is_penalty_goal: values.radioValue === 3,
                is_own_goal: values.radioValue === 2,
                is_standard_goal: values.radioValue === 1,
            };

            console.log(goalRecordData);

            // Make a POST request to create the MatchGoalRecord
            await axios.post('/matchgoalrecord/', goalRecordData);

            // Display success message using Ant Design message
            message.success('Goal recorded successfully');

            setUpdater(updater + 1)

            // Add any additional logic or UI updates after a successful goal record creation
            console.log('Goal recorded successfully');
        } catch (error) {
            // Handle validation or axios error
            console.error('Error recording goal:', error);

            // Display error message using Ant Design message
            message.error('Error recording goal. Please try again.');
        }
    };

    const createMatchGoalRecordTeamB = async (values: any) => {
        try {
            const playerId = values.selectOption;

            const goalRecordData = {
                match: match_id,
                group_team_record: matchRecord.teamBGroupRecord.id,
                other_group_team_record: matchRecord.teamAGroupRecord.id,
                player: playerId,
                is_penalty_goal: values.radioValue === 3,
                is_own_goal: values.radioValue === 2,
                is_standard_goal: values.radioValue === 1,
            };

            console.log(goalRecordData);

            // Make a POST request to create the MatchGoalRecord
            await axios.post('/matchgoalrecord/', goalRecordData);

            // Display success message using Ant Design message
            message.success('Goal recorded successfully');

            setUpdater(updater + 1)

            // Add any additional logic or UI updates after a successful goal record creation
            console.log('Goal recorded successfully');
        } catch (error) {
            // Handle validation or axios error
            console.error('Error recording goal:', error);

            // Display error message using Ant Design message
            message.error('Error recording goal. Please try again.');
        }
    };

    const finalizeMatch = async () => {
        try {
            // Ask for confirmation before finalizing the match
            const isConfirmed = await confirmation('Are you sure you want to finalize the match?');

            if (!isConfirmed) {
                // If not confirmed, return without finalizing the match
                return;
            }

            // Determine the winning team based on the highest score
            const teamAScore = teamAGoals.length;
            const teamBScore = teamBGoals.length;

            let winningTeamId;
            if (teamAScore > teamBScore) {
                winningTeamId = matchRecord.teamAGroupRecord.id;
            } else if (teamBScore > teamAScore) {
                winningTeamId = matchRecord.teamBGroupRecord.id;
            } else {
                // Handle the case of a draw (if needed)
                // You might want to implement additional logic for a draw
            }

            // Update the group_team_record with the points after winning
            const winningTeamRecord = {
                id: winningTeamId,
                points: tournament.points_winner,
            };

            // Make an axios PUT request to update the winning team's group_team_record
            await axios.put(`/group-team/${winningTeamId}/`, winningTeamRecord);

            // Update the match status to "Ended"
            const updatedMatchStatus = {
                id: match_id,
                status: "Ended",
            };

            // Make an axios PUT request to update the match status
            await axios.put(`/match/${match_id}/`, updatedMatchStatus);

            // Show success message using Ant Design message
            message.success('Match finalized successfully');

            window.location.href = 'dashboard/tournaments/manage'

            // Additional logic or UI updates after a successful update
            console.log('Match finalized successfully');
        } catch (error) {
            // Handle validation or axios error
            console.error('Error finalizing match:', error);
        }
    };

    useEffect(() => {
        findNextMatches();
        fetchGoalRecords();
    }, [matchRecord, updater]);

    useEffect(() => {
        fetchStadiums();
        fetchReferees();
        getOrCreateMatchRecord(matchRecord.teamAGroupRecord.id, matchRecord.teamBGroupRecord.id)
    }, [matchRecord])

    useEffect(() => {
        const team_record_A = matchRecord.teamAGroupRecord.team_record;
        const team_record_B = matchRecord.teamBGroupRecord.team_record;

        // Create a list of playing players excluding null values
        const playingPlayersA: IPlayer[] = [
            team_record_A.playing_player_1,
            team_record_A.playing_player_2,
            team_record_A.playing_player_3,
            team_record_A.playing_player_4,
            team_record_A.playing_player_5,
            team_record_A.playing_player_6,
            team_record_A.playing_player_7,
            team_record_A.playing_player_8,
            team_record_A.playing_player_9,
            team_record_A.playing_player_10,
            team_record_A.playing_player_11,
        ].filter((player) => player !== null);

        const playingPlayersB: IPlayer[] = [
            team_record_B.playing_player_1,
            team_record_B.playing_player_2,
            team_record_B.playing_player_3,
            team_record_B.playing_player_4,
            team_record_B.playing_player_5,
            team_record_B.playing_player_6,
            team_record_B.playing_player_7,
            team_record_B.playing_player_8,
            team_record_B.playing_player_9,
            team_record_B.playing_player_10,
            team_record_B.playing_player_11,
        ].filter((player) => player !== null);

        // Create a list of substitute players excluding null values
        const substitutePlayersA: IPlayer[] = [
            team_record_B.substitute_player_1,
            team_record_B.substitute_player_2,
            team_record_B.substitute_player_3,
            team_record_B.substitute_player_4,
            team_record_B.substitute_player_5,
        ].filter((player) => player !== null);

        const substitutePlayersB: IPlayer[] = [
            team_record_B.substitute_player_1,
            team_record_B.substitute_player_2,
            team_record_B.substitute_player_3,
            team_record_B.substitute_player_4,
            team_record_B.substitute_player_5,
        ].filter((player) => player !== null);

        setTeamAPlayers([...playingPlayersA, ...substitutePlayersA])
        setTeamBPlayers([...playingPlayersB, ...substitutePlayersB])
    }, [matchRecord]);

    // const tabData = Array.from({ length: 100 }, (_, index) => index + 1);

    return (
        <div className='rounded-lg flex flex-col' style={{ background: `linear-gradient(to right, rgba(${parseInt(colorPickerValueTeamA.slice(-6, -4), 16)}, ${parseInt(colorPickerValueTeamA.slice(-4, -2), 16)}, ${parseInt(colorPickerValueTeamA.slice(-2), 16)}, 0.5), rgba(${parseInt(colorPickerValueTeamB.slice(-6, -4), 16)}, ${parseInt(colorPickerValueTeamB.slice(-4, -2), 16)}, ${parseInt(colorPickerValueTeamB.slice(-2), 16)}, 0.5))` }}>
            {/* <div className='bg-white rounded p-1 flex gap-1'>
                <Tabs
                    type="card"
                    tabBarGutter={5}
                    className='flex-grow-0 overflow-x-auto'
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                >
                    {tabData.map((tabKey) => (
                        <TabPane tab={"T v B"} key={tabKey.toString()} />
                    ))}
                </Tabs>
            </div> */}
            <div className='flex gap-4 h-full'>
                {/* Team A */}
                <div className='w-80 h-full rounded p-2'>
                    <div className='text-center text-xl mb-1'>
                        {matchRecord.teamA} - ({teamAGoals.length})
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Form form={formColorTeamA} onFinish={updateTeamJerseyColorA}>
                            <div className='bg-white p-4 rounded shadow flex gap-2'>
                                <Form.Item
                                    className='p-0 m-0'
                                    name="colorPicker"
                                    label="Select Jersey Color"
                                    initialValue={colorPickerValueTeamA}
                                >
                                    <ColorPicker onChange={(color) => {
                                        setColorPickerValueTeamA(color.toHexString())
                                        colorA = color.toHexString()
                                    }} />
                                </Form.Item>

                                <Form.Item
                                    className='p-0 m-0'
                                >
                                    <Button type="primary" htmlType="submit" className='w-full'>
                                        SET
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>

                        <Form form={formGoalTeamA} onFinish={createMatchGoalRecordTeamA}>
                            <div className='bg-white p-4 rounded shadow'>
                                <div className='flex justify-between mb-1'>
                                    <div className='font-bold text-primary'>GOAL</div>
                                    <div>
                                        <Button size='small' type='primary' icon={<MenuFoldOutlined />} />
                                    </div>
                                </div>
                                {/* SELECT input */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="selectOption"
                                    rules={[{ required: true, message: 'Please select an option' }]}
                                >
                                    <Select
                                        id="selectOption"
                                        placeholder="Select a Player"
                                        className='w-full mb-2'
                                    >
                                        {teamAPlayers.map((player) => (
                                            <Option key={player.id} value={player.id}>
                                                {`${player.name} - ${player.squad_number}`}
                                            </Option>
                                        ))}
                                    </Select>

                                </FormItem>
                                {/* RADIO GROUP */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="radioValue"
                                    rules={[{ required: true, message: 'Please select a radio option' }]}
                                >
                                    <Radio.Group defaultValue={1} onChange={(e: RadioChangeEvent) => formGoalTeamA.setFieldsValue({ radioValue: e.target.value })} className='mb-2'>
                                        <Radio value={1}>Standard</Radio>
                                        <Radio value={2}>Own</Radio>
                                        <Radio value={3}>Penalty</Radio>
                                    </Radio.Group>
                                </FormItem>
                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    GOAL!
                                </Button>
                            </div>
                        </Form>

                        <Form form={formPenaltyTeamA} onFinish={() => { }}>
                            <div className='bg-white p-4 rounded shadow mt-4'>
                                <div className='flex justify-between mb-1'>
                                    <div className='font-bold text-primary'>CARD / PENALTY</div>
                                    <div>
                                        <Button size='small' type='primary' icon={<MenuFoldOutlined />} />
                                    </div>
                                </div>

                                {/* SELECT PLAYER input */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="penaltyPlayer"
                                    rules={[{ required: true, message: 'Please select a player for the penalty' }]}
                                >
                                    <Select
                                        id="penaltyPlayer"
                                        placeholder="Select a Player"
                                        className='w-full mb-2'
                                    >
                                        <Option value="player1">Player 1</Option>
                                        <Option value="player2">Player 2</Option>
                                        <Option value="player3">Player 3</Option>
                                    </Select>
                                </FormItem>

                                {/* RADIO GROUP */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="penaltyCard"
                                    rules={[{ required: true, message: 'Please select a card for the penalty' }]}
                                >
                                    <Select
                                        id="penaltyCard"
                                        placeholder="Select a Card"
                                        className='w-full mb-2'
                                    >
                                        <Option value="yellow">Yellow Card</Option>
                                        <Option value="red">Red Card</Option>
                                    </Select>
                                </FormItem>

                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    Add Penalty
                                </Button>
                            </div>
                        </Form>

                        <Form form={formSubstitutionTeamA} onFinish={() => { }}>
                            <div className='bg-white p-4 rounded shadow mt-4'>
                                <div className='flex justify-between mb-1'>
                                    <div className='font-bold text-primary'>SUBSTITUTION</div>
                                    <div>
                                        <Button size='small' type='primary' icon={<MenuFoldOutlined />} />
                                    </div>
                                </div>
                                {/* SELECT PLAYER 1 input */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="substitutionPlayer1"
                                    rules={[{ required: true, message: 'Please select the first player for substitution' }]}
                                >
                                    <Select
                                        id="substitutionPlayer1"
                                        placeholder="Select Player 1"
                                        className='w-full mb-2'
                                    >
                                        <Option value="subPlayer1">Substitute Player 1</Option>
                                        <Option value="subPlayer2">Substitute Player 2</Option>
                                        <Option value="subPlayer3">Substitute Player 3</Option>
                                    </Select>
                                </FormItem>

                                {/* SELECT PLAYER 2 input */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="substitutionPlayer2"
                                    rules={[{ required: true, message: 'Please select the second player for substitution' }]}
                                >
                                    <Select
                                        id="substitutionPlayer2"
                                        placeholder="Select Player 2"
                                        className='w-full mb-2'
                                    >
                                        <Option value="subPlayer1">Substitute Player 1</Option>
                                        <Option value="subPlayer2">Substitute Player 2</Option>
                                        <Option value="subPlayer3">Substitute Player 3</Option>
                                    </Select>
                                </FormItem>

                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    Make Substitution
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>

                {/* CENTER */}
                <div className='flex flex-col justify-evenly flex-grow rounded p-2 gap-4'>

                    {matchData && matchData.status !== "Ended" &&
                        <div className='flex justify-center'>
                            <div className='border bg-white rounded p-2 shadow'>
                                <Button className='font-bold bg-red-500 border-red-500 text-white' onClick={finalizeMatch}>
                                    FINALISE MATCH
                                </Button>
                            </div>
                        </div>
                    }

                    <div className='flex flex-wrap justify-center gap-2'>
                        <Button type='primary' onClick={sendMatchInformationAgain}>
                            FORCE MATCH CARD
                        </Button>
                        <Button type='primary' onClick={sendScoreInformationAgain}>
                            FORCE SCORE CARD
                        </Button>
                        <Button type='primary' onClick={sendScheduleInformationAgain}>
                            FORCE SCHEDULE CARD
                        </Button>
                        <Button type='primary' onClick={sendGoalScorerInformationAgain}>
                            FORCE GOAL SCORER CARD
                        </Button>
                    </div>

                    <div className='flex flex-col items-center justify-center'>
                        <div className='font-bold'>LIVE @</div>
                        <a className='text-xl' href={`${import.meta.env.VITE_HOST_BASE_URL}/live/${tournament.id}`}>
                            {import.meta.env.VITE_HOST_BASE_URL}/live/{tournament.id}
                        </a>
                    </div>

                    <div className='flex justify-center'>
                        <div className='border bg-white rounded p-2 shadow'>
                            <div className='flex items-center gap-1'>
                                <Button type='primary' className='font-bold'>-1</Button>
                                <Button type='primary' className='font-bold'>-5</Button>
                                <Button type='primary' className='font-bold'>-10</Button>
                                <div className='text-2xl font-bold w-20 text-center'>00:00</div>
                                <Button type='primary' className='font-bold'>+1</Button>
                                <Button type='primary' className='font-bold'>+5</Button>
                                <Button type='primary' className='font-bold'>+10</Button>
                            </div>
                            <div className='m-1' />
                            <div className='flex items-center gap-1'>
                                <Button type='primary' className='font-bold' icon={<PlayCircleOutlined />} />
                                <Button className='font-bold bg-blue-500 border-blue-500 text-white' icon={<PauseCircleOutlined />} />
                                <div className='w-72 border border-green-500 h-8 rounded flex justify-center items-center'>
                                    Paused
                                </div>
                                <Button className='font-bold bg-red-500 border-red-500 text-white' icon={<ReloadOutlined />} />
                            </div>
                        </div>
                    </div>

                    <div className='w-full bg-white rounded shadow border p-2'>
                        <Form form={formComment} onFinish={updateStatus}>
                            <Form.Item
                                name="gameStatus"
                                label="Game Status"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select the game status" defaultValue={"Not Started"}>
                                    <Option value="notStarted">Not Started</Option>
                                    <Option value="started">Started</Option>
                                    <Option value="halftime">Halftime</Option>
                                    {/* <Option value="ended">Ended</Option> */}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="stadium"
                                label="Stadium"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select the stadium">
                                    {stadiums.map((stadium) => (
                                        <Option key={stadium.id} value={stadium.id}>
                                            {stadium.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="refereeHead"
                                label="Referee Head"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select a referee head">
                                    {referees.map((referee) => (
                                        <Option key={referee.id} value={referee.id}>
                                            {referee.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="refereeAssistant1"
                                label="Referee Assistant 1"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select a referee assistant 1">
                                    {referees.map((referee) => (
                                        <Option key={referee.id} value={referee.id}>
                                            {referee.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="refereeAssistant2"
                                label="Referee Assistant 2"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select a referee assistant 2">
                                    {referees.map((referee) => (
                                        <Option key={referee.id} value={referee.id}>
                                            {referee.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="refereeAssistant3"
                                label="Referee Assistant 3"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select a referee assistant 3">
                                    {referees.map((referee) => (
                                        <Option key={referee.id} value={referee.id}>
                                            {referee.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item className='p-0 m-2'>
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    Update Status
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    {/* <div className='flex w-full bg-white rounded shadow border'>
                        <div className='border-r p-2 w-2/5'>
                            <Form layout='vertical' form={formComment} onFinish={() => handleButtonClick(formComment)}>
                                <Form.Item
                                    name="commentTime"
                                    label="Comment Time"
                                    className='p-0 m-2'
                                    rules={[{ required: true, message: 'Please select a time for the comment' }]}
                                >
                                    <TimePicker format="HH:mm" placeholder="Select a time" className='w-full' />
                                </Form.Item>

                                <Form.Item
                                    name="commentType"
                                    label="Type of Comment"
                                    className='p-0 m-2'
                                    rules={[{ required: true, message: 'Please select a comment type' }]}
                                >
                                    <Select placeholder="Select a comment type">
                                        <Option value="positive">Positive</Option>
                                        <Option value="negative">Negative</Option>
                                        <Option value="neutral">Neutral</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="commentText"
                                    label="Comment Text"
                                    className='p-0 m-2'
                                    rules={[{ required: true, message: 'Please enter a comment' }]}
                                >
                                    <Input.TextArea placeholder="Enter your comment" rows={2} />
                                </Form.Item>


                                <Form.Item className='p-0 m-2'>
                                    <Button type="primary" htmlType="button" onClick={updateStatus} className='w-full'>
                                        Update Status
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>

                        <div className='p-2 w-3/5'>
                            <Table
                                columns={
                                    [
                                        {
                                            title: 'Comment',
                                            dataIndex: 'comment',
                                            key: 'comment',
                                        },
                                        {
                                            title: 'Actions',
                                            key: 'actions',
                                            render: (text, record) => (
                                                <Space>
                                                    <Button type="primary" icon={<EditOutlined />} onClick={() => {
                                                        console.log(text, record)
                                                    }} />
                                                    <Button icon={<DeleteOutlined />} onClick={() => {
                                                        console.log(text, record)
                                                    }} />
                                                </Space>
                                            ),
                                        },
                                    ]
                                }
                                dataSource={[
                                    {
                                        key: '1',
                                        comment: 'This is a sample comment 1',
                                    },
                                    {
                                        key: '2',
                                        comment: 'This is a sample comment 2',
                                    }
                                ]}
                                pagination={false}
                            />
                        </div>
                    </div> */}
                </div>

                {/* Team B */}
                <div className='w-80 h-full rounded p-2'>
                    <div className='text-center text-xl mb-1'>
                        {matchRecord.teamB} - ({teamBGoals.length})
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Form form={formColorTeamB} onFinish={updateTeamJerseyColorB}>
                            <div className='bg-white p-4 rounded shadow flex gap-2'>
                                <Form.Item
                                    className='p-0 m-0'
                                    name="colorPicker"
                                    label="Select Jersey Color"
                                    initialValue={colorPickerValueTeamB}
                                >
                                    <ColorPicker onChange={(color) => {
                                        setColorPickerValueTeamB(color.toHexString())
                                        colorB = color.toHexString()
                                    }} />
                                </Form.Item>

                                <Form.Item
                                    className='p-0 m-0'
                                >
                                    <Button type="primary" htmlType="submit" className='w-full'>
                                        SET
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>

                        <Form form={formGoalTeamB} onFinish={createMatchGoalRecordTeamB}>
                            <div className='bg-white p-4 rounded shadow'>
                                <div className='flex justify-between mb-1'>
                                    <div className='font-bold text-primary'>GOAL</div>
                                    <div>
                                        <Button size='small' type='primary' icon={<MenuFoldOutlined />} />
                                    </div>
                                </div>
                                {/* SELECT input */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="selectOption"
                                    rules={[{ required: true, message: 'Please select an option' }]}
                                >
                                    <Select
                                        id="selectOption"
                                        placeholder="Select a Player"
                                        className='w-full mb-2'
                                    >
                                        {teamBPlayers.map((player) => (
                                            <Option key={player.id} value={player.id}>
                                                {`${player.name} - ${player.squad_number}`}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                                {/* RADIO GROUP */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="radioValue"
                                    rules={[{ required: true, message: 'Please select a radio option' }]}
                                >
                                    <Radio.Group defaultValue={1} onChange={(e: RadioChangeEvent) => formGoalTeamA.setFieldsValue({ radioValue: e.target.value })} className='mb-2'>
                                        <Radio value={1}>Standard</Radio>
                                        <Radio value={2}>Own</Radio>
                                        <Radio value={3}>Penalty</Radio>
                                    </Radio.Group>
                                </FormItem>
                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    GOAL!
                                </Button>
                            </div>
                        </Form>

                        <Form form={formPenaltyTeamB} onFinish={() => { }}>
                            <div className='bg-white p-4 rounded shadow mt-4'>
                                <div className='flex justify-between mb-1'>
                                    <div className='font-bold text-primary'>CARD / PENALTY</div>
                                    <div>
                                        <Button size='small' type='primary' icon={<MenuFoldOutlined />} />
                                    </div>
                                </div>

                                {/* SELECT PLAYER input */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="penaltyPlayer"
                                    rules={[{ required: true, message: 'Please select a player for the penalty' }]}
                                >
                                    <Select
                                        id="penaltyPlayer"
                                        placeholder="Select a Player"
                                        className='w-full mb-2'
                                    >
                                        <Option value="player1">Player 1</Option>
                                        <Option value="player2">Player 2</Option>
                                        <Option value="player3">Player 3</Option>
                                    </Select>
                                </FormItem>

                                {/* RADIO GROUP */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="penaltyCard"
                                    rules={[{ required: true, message: 'Please select a card for the penalty' }]}
                                >
                                    <Select
                                        id="penaltyCard"
                                        placeholder="Select a Card"
                                        className='w-full mb-2'
                                    >
                                        <Option value="yellow">Yellow Card</Option>
                                        <Option value="red">Red Card</Option>
                                    </Select>
                                </FormItem>

                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    Add Penalty
                                </Button>
                            </div>
                        </Form>

                        <Form form={formSubstitutionTeamB} onFinish={() => { }}>
                            <div className='bg-white p-4 rounded shadow mt-4'>
                                <div className='flex justify-between mb-1'>
                                    <div className='font-bold text-primary'>SUBSTITUTION</div>
                                    <div>
                                        <Button size='small' type='primary' icon={<MenuFoldOutlined />} />
                                    </div>
                                </div>
                                {/* SELECT PLAYER 1 input */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="substitutionPlayer1"
                                    rules={[{ required: true, message: 'Please select the first player for substitution' }]}
                                >
                                    <Select
                                        id="substitutionPlayer1"
                                        placeholder="Select Player 1"
                                        className='w-full mb-2'
                                    >
                                        <Option value="subPlayer1">Substitute Player 1</Option>
                                        <Option value="subPlayer2">Substitute Player 2</Option>
                                        <Option value="subPlayer3">Substitute Player 3</Option>
                                    </Select>
                                </FormItem>

                                {/* SELECT PLAYER 2 input */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="substitutionPlayer2"
                                    rules={[{ required: true, message: 'Please select the second player for substitution' }]}
                                >
                                    <Select
                                        id="substitutionPlayer2"
                                        placeholder="Select Player 2"
                                        className='w-full mb-2'
                                    >
                                        <Option value="subPlayer1">Substitute Player 1</Option>
                                        <Option value="subPlayer2">Substitute Player 2</Option>
                                        <Option value="subPlayer3">Substitute Player 3</Option>
                                    </Select>
                                </FormItem>

                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    Make Substitution
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
