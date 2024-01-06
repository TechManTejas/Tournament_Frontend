/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Flex, Form, Input, message } from 'antd';
import { ITeamRecord } from '../types/team.types';
import { ITournament } from '../types/tournament.types';
import axios from '../api/axios';
import { CloseOutlined, LeftOutlined, SearchOutlined } from '@ant-design/icons';
import { IRound } from '../types/round.types';
import { IGroup } from '../types/group.types';
import { Pagination } from 'antd';


interface RoundAddEditProps {
    toggleAddEdit: (selectedRound: IRound | null) => void;
    tournament: ITournament;
    selectedRound: IRound | null
    selectedGroup: IGroup | null
}

export const RoundsAddEdit: React.FC<RoundAddEditProps> = ({ toggleAddEdit, tournament, selectedRound, selectedGroup }) => {

    const round = selectedRound
    const group = selectedGroup

    const [form] = Form.useForm();
    const [selectedTeams, setSelectedTeams] = useState<ITeamRecord[]>([]);
    const [allTeams, setAllTeams] = useState<ITeamRecord[]>([]);
    const [totalTeams, setTotalTeams] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10; // Adjust as needed

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Fetch all teams for the tournament
    const fetchAllTeams = async () => {
        try {
            const response = await axios.get(`/teamrecord/?tournament_id=${tournament?.id}&page=${currentPage}&pageSize=${pageSize}`);
            setAllTeams(response.data.results);
            setTotalTeams(response.data.count)
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    // useEffect to fetch teams when the component mounts
    useEffect(() => {
        fetchAllTeams();

        // Set initial form values if selectedGroup is not null
        if (group) {
            console.log(group)
            form.setFieldsValue({
                name: group.name,
            });

            // Map the group's team records to set values for team_1, team_2, team_3, etc.
            group.group_team_records.forEach((record, index) => {
                const teamKey = `team_${index + 1}`;
                form.setFieldsValue({ [teamKey]: record.team_record });
            });

            setSelectedTeams(group.group_team_records.map((record) => record.team_record));
        }
    }, [currentPage]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const transferredData = e.dataTransfer.getData('application/json');
        const teamData = JSON.parse(transferredData);

        // Add the dropped team to the selectedTeams array
        setSelectedTeams((prevSelectedTeams) => [...prevSelectedTeams, teamData]);

        // You can use the teamData as needed, for example, set it in the form
        form.setFieldsValue({ team: teamData });
    };

    const onFinish = async (values: any) => {

        console.log(values)

        try {
            // Create formData
            if (selectedRound) {

                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('tournament_id', tournament.id.toString());
                formData.append('round_id', selectedRound.id.toString());

                const team_records = []
                for (let i = 1; i <= selectedRound.no_of_groups; i++) {
                    const teamKey = `team_${i}`;
                    team_records.push({ id: values[teamKey].id, order: i })
                }
                formData.append('group_team_records', JSON.stringify(team_records));

                formData.forEach((value, key) => {
                    console.log(key, value);
                });

                // if (group) {
                //     // If selectedGroup is available, update the group
                //     const response = await axios.patch(`/group/${group.id}/`, formData);
                //     console.log(response.data);
                //     message.success('Group updated successfully!');
                // } else {
                //     // If selectedGroup is not available, create a new group
                //     const response = await axios.post('/group/', formData);
                //     console.log(response.data);
                //     message.success('Group added successfully!');
                // }

                // // Reset the form and close the modal
                // form.resetFields();
                // toggleAddEdit(selectedRound);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Error adding/updating group');
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.opacity = '1';
    };

    // Function to render TeamSelection components in a loop
    const renderTeamSelections = (count: number | undefined) => {
        const teamSelections = [];

        for (let i = 1; i <= count!; i++) {
            teamSelections.push(
                <TeamSelection
                    key={`team_${i}`}
                    label={`Selected Teams ${i}`}
                    form={form}
                    name={`team_${i}`}
                    setSelectedTeams={setSelectedTeams}
                />
            );
        }

        return teamSelections;
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className='flex items-center gap-4'>
                    <div className='flex gap-4'>
                        <Button
                            icon={<LeftOutlined />}
                            className='font-bold text-md'
                            onClick={() => {
                                toggleAddEdit(selectedRound)
                            }}
                        >
                            BACK
                        </Button>
                    </div>
                    <div className='font-bold text-2xl text-green-500'>
                        {selectedRound?.name}
                    </div>
                </div>
                <div className='flex gap-2'>
                    <div className='flex-grow p-4'>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            // initialValues={/* set initial values as needed */}
                            layout='vertical'
                            className="mt-8 backdrop-blur-md p-4 rounded-xl"
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter the group name!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Flex>
                                {renderTeamSelections(round?.no_of_groups)}
                            </Flex>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div
                        className="bg-white border border-green-500 rounded-lg p-2 w-[300px] flex-shrink-0"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <div>
                            <Input
                                prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='Search...'
                                className='mb-2'
                            />
                        </div>
                        <div>

                            <div className="overflow-y-auto overflow-x-hidden grid grid-cols-3 transition-all">
                                {allTeams
                                    .filter(item => !selectedTeams.some(selected => selected.id === item.id))
                                    .map((team) => (
                                        <div
                                            key={team.id}
                                            className="text-xs hover:shadow-2xl hover:shadow-green-500 w-20 m-1 transition-all rounded"
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('application/json', JSON.stringify(team));
                                                handleDragStart(e)
                                            }}
                                            onDragEnd={(e) => {
                                                handleDragEnd(e)
                                            }}
                                        >
                                            <div className="w-full">
                                                <img className="w-full h-24 object-cover rounded-t" alt={team.name} src={team.logo} />
                                                <div className="text-center">{team.name}</div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <Pagination
                                current={currentPage}
                                total={totalTeams}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

interface TeamSelectionProps {
    label: string;
    form: any;
    name: string;
    setSelectedTeams: React.Dispatch<React.SetStateAction<ITeamRecord[]>>; // Add this prop
}

const TeamSelection: React.FC<TeamSelectionProps> = ({ label, form, name, setSelectedTeams }) => {
    const teamRef = useRef<HTMLDivElement | null>(null);

    const [, forceUpdate] = useState(0);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        handleDragOverTabPane();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const transferredData = e.dataTransfer.getData('application/json');
        const teamData = JSON.parse(transferredData);

        // You can use the teamData as needed, for example, set it in the form
        form.setFieldsValue({ [name]: teamData }); // Use the name prop here

        // Add the dropped player to the selectedTeams array
        setSelectedTeams((prevSelectedTeams) => [...prevSelectedTeams, teamData]);

        handleDragExitTabPane();
        forceUpdate((prev) => prev + 1);
    };

    const handleRemoveTeam = () => {
        handleDragExitTabPane();

        const team = form.getFieldValue(name)
        setSelectedTeams((prevSelectedTeams) => prevSelectedTeams.filter(item => item.id !== team.id));

        // You can remove the teamData from the form or perform other actions
        form.setFieldsValue({ [name]: null }); // Use the name prop here
        forceUpdate((prev) => prev + 1);
    };

    const handleDragOverTabPane = () => {
        // Add styles or perform actions when the drag enters the component
        if (teamRef.current) {
            teamRef.current.style.border = '2px solid green';
        }
    };

    const handleDragExitTabPane = () => {
        // Remove styles or perform actions when the drag leaves the component
        if (teamRef.current) {
            teamRef.current.style.border = 'none';
        }
    };

    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required: true, message: `Select a team!` }]}
        >
            <div
                ref={teamRef}
                className='w-24 h-40 flex justify-center items-center'
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragExitTabPane}
            >
                {form.getFieldValue(name) ? (
                    <div className='bg-slate-200 rounded relative m-1'>
                        {/* Adjust the image source and content based on your teamData structure */}
                        <img
                            className='w-20 h-24 object-cover mb-2 rounded-t'
                            alt={form.getFieldValue(name).name}
                            src={form.getFieldValue(name).logo}
                        />
                        <div className='text-center'>{form.getFieldValue(name).name}</div>
                        <Button
                            type='link'
                            icon={<CloseOutlined />}
                            className='absolute top-0 right-0'
                            onClick={handleRemoveTeam}
                        />
                    </div>
                ) : (
                    <div className='border-2 w-full h-full flex justify-center items-center'></div>
                )}
            </div>
        </Form.Item>
    );
};
