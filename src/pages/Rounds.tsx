/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, PlusOutlined, ScheduleOutlined, SearchOutlined, TeamOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { ITournament } from "../types/tournament.types";
import axios from "../api/axios"
import { IRound } from "../types/round.types";
import { IGroup } from "../types/group.types";
import { ColumnsType } from "antd/es/table";
import { confirmation } from "../components/Confirmation"
import { Match, generateMatchSchedule } from "../utils/round_robin_schedule";
import { usePDF } from 'react-to-pdf';

interface RoundsProps {
    toggleAddEdit: (selectedRound: IRound) => void;
    handleSelectGroup: (group: IGroup | null) => void;
    tournament: ITournament;
}

export const Rounds: React.FC<RoundsProps> = ({ toggleAddEdit, handleSelectGroup, tournament }) => {

    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

    const [selectedRound, setSelectedRound] = useState<IRound | null>(null);
    const [rounds, setRounds] = useState<IRound[]>([])
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [isAddRoundModalVisible, setAddRoundModalVisible] = useState(false);
    const [newRoundName, setNewRoundName] = useState("");
    const [numberOfTeamsInGroup, setNumberOfTeamsInGroup] = useState<number>(2);
    const [selectedSubMenu, setSelectedSubMenu] = useState('groups');
    const [scheduleData, setScheduleData] = useState<Match[]>([]);

    const handleSelectSubMenu = (value: string) => {
        setSelectedSubMenu(value);
    };

    const columns: ColumnsType<any> = [
        {
            title: 'Team',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <div className="flex items-center">
                    <img
                        src={record.logo}  // Assuming the 'logo' property is available in the team_record object
                        alt={text}
                        className="mr-2"
                        style={{ width: '24px', height: '24px' }}
                    />
                    {text}
                </div>
            ),
        },
        {
            title: 'Points',
            dataIndex: 'points',
            key: 'points',
            render: (text: number) => <span>{text}</span>,
        },
        {
            title: 'Goals +',
            dataIndex: 'goalsPlus',
            key: 'goalsPlus',
            render: (text: number) => <span>{text}</span>,
        },
        {
            title: 'Goals -',
            dataIndex: 'goalsMinus',
            key: 'goalsMinus',
            render: (text: number) => <span>{text}</span>,
        }
    ];

    const handleDeleteGroup = async (groupId: number) => {
        try {
            await axios.delete(`/group/${groupId}/`);
            setGroups((prevGroups) => prevGroups.filter((g) => g.id !== groupId));
            message.success('Group deleted successfully!');
        } catch (error) {
            console.error('Error deleting group:', error);
            message.error('Error deleting group. Please try again.');
        }
    };

    const handleDeleteConfirmation = async (groupId: number) => {
        const shouldDelete = await confirmation('Are you sure you want to delete this Group?');
        if (shouldDelete) {
            handleDeleteGroup(groupId);
        }
    };

    const handleButtonClick = (round: IRound) => {
        setSelectedRound(round);
    };

    const showAddRoundModal = () => {
        setAddRoundModalVisible(true);
    };

    const handleAddRoundOk = async () => {
        if (!newRoundName || numberOfTeamsInGroup <= 1) {
            // Handle the case where the round name is empty
            message.error('Please enter a round name and a valid number of teams in a group');
            return;
        }

        try {
            // Send a request to create a new round
            const response = await axios.post("/round/", {
                tournament_id: tournament.id,
                name: newRoundName,
                no_of_groups: numberOfTeamsInGroup,
            });
            const newRound = response.data

            // Fetch the updated list of rounds after creating a new round
            fetchRounds()

            // Update state with the new round name
            setSelectedRound(newRound);
            setNewRoundName("");
            setNumberOfTeamsInGroup(0);
            setAddRoundModalVisible(false);

            // Display a success message or handle any additional actions
            message.success(`Round "${newRoundName}" created successfully.`);
        } catch (error) {
            // Handle error responses from the server
            console.error("Error creating round:", error);
            message.error("An error occurred while creating the round. Please try again.");
        }
    };

    const handleAddRoundCancel = () => {
        setNewRoundName("");
        setAddRoundModalVisible(false);
    };

    const handleDeleteRound = async (roundName: string) => {
        try {
            // Send a request to delete the selected round
            await axios.delete(`/round/${rounds.find((round: IRound) => round.name === roundName)?.id}/`);

            // Fetch the updated list of rounds after deleting a round
            fetchRounds()

            // Determine the index of the currently selected button
            const selectedIndex = rounds.findIndex((round: IRound) => round.name === roundName);

            // Update state to reflect the changes
            setSelectedRound(null);

            if (selectedIndex !== undefined && selectedIndex !== null && selectedIndex >= 0) {
                // Select the previous button if it exists
                setSelectedRound(rounds[selectedIndex - 1] || null);
            }

            // Display a success message or handle any additional actions
            message.success(`Round "${roundName}" deleted successfully.`);
        } catch (error) {
            // Handle error responses from the server
            console.error("Error deleting round:", error);
            message.error("An error occurred while deleting the round. Please try again.");
        }
    };

    const fetchRounds = async () => {
        try {
            // Fetch all rounds for the tournament
            const response = await axios.get(`/round/?tournament_id=${tournament.id}`);
            const fetchedRounds = response.data;

            // Set the rounds state
            setRounds(fetchedRounds);

            // Set the selected round to the first round if it exists
            if (fetchedRounds.length > 0) {
                setSelectedRound(fetchedRounds[0]);
            }
        } catch (error) {
            // Handle error responses from the server
            console.error("Error fetching rounds:", error);
            message.error("An error occurred while fetching rounds. Please try again.");
        }
    };

    const fetchGroups = async () => {
        try {
            if (selectedRound) {
                // Fetch groups for the selected round
                const response = await axios.get(`/group/?tournament_id=${tournament.id}&round_id=${selectedRound.id}`);
                const fetchedGroups = response.data;

                // Set the groups state
                setGroups(fetchedGroups);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            message.error("An error occurred while fetching groups. Please try again.");
        }
    };

    useEffect(() => {
        fetchRounds();
    }, [tournament.id]);

    useEffect(() => {
        fetchGroups();
    }, [selectedRound]);

    useEffect(() => {
        schedule();
    }, [selectedSubMenu, selectedRound]);


    const schedule = () => {
        console.log(groups);

        const matchSchedule: Match[] = generateMatchSchedule(groups, tournament);

        // Display the generated match schedule
        console.log("Match Schedule:");
        matchSchedule.forEach((match) => {
            console.log(`${match.time} - ${match.teamA} vs ${match.teamB} in ${match.group}`);
        });

        setScheduleData(matchSchedule);
    };

    const handleStartTournament = async () => {
        try {
            // Send a PATCH request to start the tournament
            await axios.patch(`/tournament/${tournament.id}/`, {
                // Add any additional data you want to send in the request body
                // For example, you might want to set a 'status' to 'active' or something similar
                status: 'Started',
            });

            // Optionally, you can fetch the updated tournament data after starting the tournament
            // and update the 'tournament' state or perform any additional actions
            // const updatedTournament = await axios.get(`/tournament/${tournament.id}`);
            // setTournament(updatedTournament.data);
            window.location.href = '/dashboard/tournament'

            // Display a success message or handle any additional actions
            message.success('Tournament started successfully!');
        } catch (error) {
            // Handle error responses from the server
            console.error('Error starting tournament:', error);
            message.error('An error occurred while starting the tournament. Please try again.');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className='flex gap-4'>
                <div className="flex gap-1 ">
                    {rounds.map((round: IRound) => (
                        <div key={round.id}>
                            <div className='flex gap-1 items-center'>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="delete" danger onClick={() => handleDeleteRound(round.name)}>
                                                Delete Round
                                            </Menu.Item>
                                            {/* Add more menu items as needed */}
                                        </Menu>
                                    }
                                    trigger={['contextMenu']}
                                >
                                    <Button type={selectedRound === round ? 'primary' : 'dashed'} onClick={() => {
                                        handleButtonClick(round)
                                    }}>
                                        {round.name}
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                    ))}
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        className='font-bold text-md'
                        onClick={showAddRoundModal}
                    />
                    <Modal
                        title="Add Round"
                        open={isAddRoundModalVisible}
                        onOk={handleAddRoundOk}
                        onCancel={handleAddRoundCancel}
                    >
                        <div className="flex flex-col">
                            <label className="mb-2 text-zinc-500">Round Name:</label>
                            <Input
                                placeholder="Enter the name of the round"
                                value={newRoundName}
                                onChange={(e) => setNewRoundName(e.target.value)}
                            />
                        </div>
                        <div className="m-4" />
                        <div className="flex flex-col">
                            <label className="mb-2 text-zinc-500">Number of Teams in a Group:</label>
                            <Input
                                type="number"
                                placeholder="Enter the number of teams in a group"
                                value={numberOfTeamsInGroup}
                                onChange={(e) => setNumberOfTeamsInGroup(parseInt(e.target.value, 10))}
                            />
                        </div>
                    </Modal>
                </div>
            </div>
            {selectedRound &&
                <div className="h-full">

                    <div className="flex justify-between">
                        <div className="flex gap-4">
                            <Button.Group>
                                <Button
                                    type={selectedSubMenu === 'groups' ? 'primary' : 'default'}
                                    icon={<TeamOutlined />}
                                    onClick={() => handleSelectSubMenu('groups')}
                                >
                                    GROUPS
                                </Button>
                                <Button
                                    type={selectedSubMenu === 'schedule' ? 'primary' : 'default'}
                                    icon={<ScheduleOutlined />}
                                    onClick={() => handleSelectSubMenu('schedule')}
                                >
                                    SCHEDULE
                                </Button>
                                {/* <Button
                                    type={selectedSubMenu === 'results' ? 'primary' : 'default'}
                                    icon={<BarChartOutlined />}
                                    onClick={() => handleSelectSubMenu('results')}
                                >
                                    RESULTS
                                </Button> */}
                            </Button.Group>
                        </div>
                        <div className='flex justify-end'>
                            <div className='flex gap-4'>
                                <Input
                                    prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder='Search...'
                                    className='mb-2'
                                    onChange={(e) => (e.target.value)}
                                />
                                <Button
                                    type='primary'
                                    icon={<PlusOutlined />}
                                    className='font-bold text-md'
                                    onClick={() => {
                                        handleSelectGroup(null)
                                        toggleAddEdit(selectedRound)
                                    }}
                                >
                                    ADD GROUP
                                </Button>
                            </div>
                        </div>
                    </div>

                    {
                        selectedSubMenu === "groups" &&
                        <>
                            <div className=" h-screen rounded p-2 flex flex-col gap-10">
                                {groups.map((group) => (
                                    <div key={group.id} className="flex flex-col gap-4">
                                        <div className="flex gap-1 items-center">
                                            <div className='text-2xl'>{group.name}</div>
                                            {/* Add more details or information about the group as needed */}
                                        </div>

                                        <div className=" rounded p-2 flex gap-10">
                                            <Table
                                                className="w-full"
                                                columns={columns}
                                                dataSource={group.group_team_records.map((groupTeamRecord) => ({
                                                    key: groupTeamRecord.id,
                                                    name: groupTeamRecord.team_record.name,
                                                    logo: groupTeamRecord.team_record.logo,
                                                    points: groupTeamRecord.points,
                                                    goalsPlus: groupTeamRecord.goals_pos,
                                                    goalsMinus: groupTeamRecord.goals_neg,
                                                }))}
                                                pagination={false}
                                            />
                                            <div className="flex flex-col gap-1 justify-center items-center">
                                                {/* <Button
                                            type="primary"
                                            className="rounded w-10 h-10 flex justify-center items-center"
                                            onClick={() => {
                                                handleSelectGroup(group)
                                                toggleAddEdit(selectedRound)
                                            }}
                                        >
                                            <EditOutlined />
                                        </Button> */}
                                                <Button
                                                    type="primary"
                                                    className="rounded w-10 h-10 flex justify-center items-center"
                                                    onClick={() => handleDeleteConfirmation(group.id)}
                                                >
                                                    <DeleteOutlined />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                    {
                        selectedSubMenu === "schedule" &&
                        <>
                            {tournament.status === "Not Started" &&
                                <div className="py-2 flex justify-between gap-4">
                                    <Button className="bg-red-500 text-white" onClick={handleStartTournament}>START TOURNAMENT</Button>
                                    <Button onClick={() => toPDF()}>Download PDF</Button>
                                </div>
                            }
                            <div ref={targetRef} className=" h-screen rounded p-2 flex flex-col gap-10">
                                {scheduleData.length > 0 && (
                                    <Table
                                        className="w-full"
                                        columns={
                                            [
                                                {
                                                    title: 'No.',
                                                    dataIndex: 'no',
                                                    key: 'no',
                                                    align: 'center',
                                                },
                                                {
                                                    title: 'Time',
                                                    dataIndex: 'time',
                                                    key: 'time',
                                                    align: 'center',
                                                },
                                                {
                                                    title: 'Group',
                                                    dataIndex: 'group',
                                                    key: 'group',
                                                    align: 'center',
                                                },
                                                {
                                                    title: 'Team A',
                                                    dataIndex: 'teamA',
                                                    key: 'teamA',
                                                    align: 'center',
                                                },
                                                {
                                                    title: 'Team B',
                                                    dataIndex: 'teamB',
                                                    key: 'teamB',
                                                    align: 'center',
                                                },
                                                {
                                                    title: 'Actions',
                                                    key: 'actions',
                                                    align: 'center',
                                                    render: (_: any, record: Match) => (
                                                        <div>
                                                            <Button type="primary" onClick={() => {

                                                                const { group, teamA, teamB } = record;

                                                                // Extracting the team IDs from teamA and teamB
                                                                const teamAId = groups.find(g => g.name === group)?.group_team_records.find(t => t.team_record.name === teamA)?.id;
                                                                const teamBId = groups.find(g => g.name === group)?.group_team_records.find(t => t.team_record.name === teamB)?.id;

                                                                console.log("Match Dashboard Clicked:");
                                                                console.log("Tournament:", tournament);
                                                                console.log("Group:", group);
                                                                console.log("Teams:", teamA, "vs", teamB);
                                                                console.log("Team A ID:", teamAId);
                                                                console.log("Team B ID:", teamBId);

                                                            }}>
                                                                Match Dashboard
                                                            </Button>
                                                            <Button onClick={() => { }}>
                                                                Stream Operator
                                                            </Button>
                                                        </div>
                                                    ),
                                                },
                                            ]

                                        }
                                        dataSource={scheduleData}
                                        pagination={false}
                                    />
                                )}
                            </div>
                        </>
                    }
                    {/* {
                        selectedSubMenu === "results" &&
                        <>
                            <div className="bg-[#F5F5F5] h-screen rounded p-2 flex flex-col gap-10">
                                results
                            </div>
                        </>
                    } */}
                </div>
            }
        </div>
    )
}
