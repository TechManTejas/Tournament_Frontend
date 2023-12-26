/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Flex, Form, Input, message } from 'antd';
import { ITeamRecord } from '../types/team.types';
import { ITournament } from '../types/tournament.types';
import axios from '../api/axios';
import { CloseOutlined, LeftOutlined, SearchOutlined } from '@ant-design/icons';
import { IRound } from '../types/round.types';
import { IGroup } from '../types/group.types';

interface RoundAddEditProps {
    toggleAddEdit: (selectedRound: IRound | null) => void;
    tournament: ITournament;
    selectedRound: IRound | null
    selectedGroup: IGroup | null
}

export const RoundsAddEdit: React.FC<RoundAddEditProps> = ({ toggleAddEdit, tournament, selectedRound, selectedGroup }) => {

    const group = selectedGroup
    console.log(group)

    const [form] = Form.useForm();
    const [selectedTeams, setSelectedTeams] = useState<ITeamRecord[]>([]);
    const [allTeams, setAllTeams] = useState<ITeamRecord[]>([]);

    // Fetch all teams for the tournament
    const fetchAllTeams = async () => {
        try {
            const response = await axios.get(`/teamrecord/?tournament_id=${tournament?.id}`);
            setAllTeams(response.data.results);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    // useEffect to fetch teams when the component mounts
    useEffect(() => {
        fetchAllTeams();

        // Set initial form values if group is not null
        if (group) {
            form.setFieldsValue({
                name: group.name,
            });
            setSelectedTeams(group.team_records);
        }
    }, []);

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

    const handleRemoveTeam = (teamId: number) => {
        // Remove the dropped team from the selectedTeams array
        setSelectedTeams((prevSelectedTeams) => prevSelectedTeams.filter((team) => team.id !== teamId));
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
                for (let i = 1; i <= 5; i++) {
                    const teamKey = `team_${i}`;
                    const orderKey = `team_${i}_order`;
                    team_records.push({ id: values[teamKey].id, order: values[orderKey] });
                }
                formData.append('team_records', JSON.stringify(team_records));

                if (group) {
                    // If selectedGroup is available, update the group
                    const response = await axios.patch(`/group/${group.id}/`, formData);
                    console.log(response.data);
                    message.success('Group updated successfully!');
                } else {
                    // If selectedGroup is not available, create a new group
                    const response = await axios.post('/group/', formData);
                    console.log(response.data);
                    message.success('Group added successfully!');
                }

                // Reset the form and close the modal
                form.resetFields();
                toggleAddEdit(selectedRound);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Error adding/updating group');
        }
    };

    // Function to render TeamSelection components in a loop
    const renderTeamSelections = (count: number) => {
        const teamSelections = [];

        for (let i = 1; i <= count; i++) {
            teamSelections.push(
                <TeamSelection
                    key={`team_${i}`}
                    label={`Selected Teams ${i}`}
                    form={form}
                    name={`team_${i}`}
                />
            );

            // Add a hidden input for each team to store its order
            teamSelections.push(
                <Form.Item
                    key={`team_${i}_order`}
                    name={`team_${i}_order`}
                    hidden
                    initialValue={i}
                >
                    <Input />
                </Form.Item>
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
                                {renderTeamSelections(5)}
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
                        <div className="overflow-y-auto overflow-x-hidden grid grid-cols-3 transition-all">
                            {allTeams.map((team) => (
                                <div
                                    key={team.id}
                                    className="text-xs hover:shadow-2xl hover:shadow-green-500 w-20 m-1 transition-all rounded"
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('application/json', JSON.stringify(team));
                                    }}
                                >
                                    <div className="w-full">
                                        <img className="w-full h-24 object-cover rounded-t" alt={team.name} src={team.logo} />
                                        <div className="text-center">{team.name}</div>
                                    </div>
                                </div>
                            ))}
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
    name: string; // Add the name prop
}

const TeamSelection: React.FC<TeamSelectionProps> = ({ label, form, name }) => {
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

        handleDragExitTabPane();
        forceUpdate((prev) => prev + 1);
    };

    const handleRemoveTeam = () => {
        handleDragExitTabPane();
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
