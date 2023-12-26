/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { ITournament } from "../types/tournament.types";
import axios from "../api/axios"
import { IRound } from "../types/round.types";
import { IGroup } from "../types/group.types";
import { ColumnsType } from "antd/es/table";
import { confirmation } from "../components/Confirmation";
import { getUserDataFromStorage } from "../utils/storage";

interface RoundsProps {
    toggleAddEdit: (selectedRound: IRound) => void;
    handleSelectGroup: (group: IGroup | null) => void;
    tournament: ITournament;
}

export const Rounds: React.FC<RoundsProps> = ({ toggleAddEdit, handleSelectGroup, tournament }) => {

    const isClubAdmin = getUserDataFromStorage()?.user?.role === 'club_admin'

    const [selectedRound, setSelectedRound] = useState<IRound | null>(null);
    const [rounds, setRounds] = useState<IRound[]>([])
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [isAddRoundModalVisible, setAddRoundModalVisible] = useState(false);
    const [newRoundName, setNewRoundName] = useState("");
    const [numberOfTeamsInGroup, setNumberOfTeamsInGroup] = useState<number>(0);

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
        if (!newRoundName) {
            // Handle the case where the round name is empty
            message.error('Please enter a round name');
            return;
        }

        try {
            // Send a request to create a new round
            const response = await axios.post("/round/", {
                tournament_id: tournament.id,
                name: newRoundName,
            });
            const newRound = response.data

            // Fetch the updated list of rounds after creating a new round
            fetchRounds()

            // Update state with the new round name
            setSelectedRound(newRound);
            setNewRoundName("");
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

                console.log(fetchedGroups)

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

    return (
        <>
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
                        <Input
                            placeholder="Enter the name of the round"
                            value={newRoundName}
                            onChange={(e) => setNewRoundName(e.target.value)}
                        />
                    </Modal>
                </div>
            </div>
            {selectedRound &&
                <div className="h-full">

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

                    <div className="bg-[#F5F5F5] h-screen rounded p-2 flex flex-col gap-10">
                        {groups.map((group) => (
                            <div key={group.id} className="flex flex-col gap-4">
                                <div className="flex gap-1 items-center">
                                    <div className='text-2xl'>{group.name}</div>
                                    {/* Add more details or information about the group as needed */}
                                </div>

                                <div className="bg-[#F5F5F5] rounded p-2 flex gap-10">
                                    <Table
                                        className="w-full"
                                        columns={columns}
                                        dataSource={group.team_records.map((teamRecord) => ({
                                            key: teamRecord.id,
                                            name: teamRecord.name,
                                            logo: teamRecord.logo,
                                            points: 0,
                                            goalsPlus: 0,
                                            goalsMinus: 0,
                                        }))}
                                        pagination={false}
                                    />
                                    <div className="flex flex-col gap-1 justify-center items-center">
                                        <Button
                                            type="primary"
                                            className="rounded w-10 h-10 flex justify-center items-center"
                                            onClick={() => {
                                                handleSelectGroup(group)
                                                toggleAddEdit(selectedRound)
                                            }}
                                        >
                                            <EditOutlined />
                                        </Button>
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
                </div>
            }
        </>
    )
}
