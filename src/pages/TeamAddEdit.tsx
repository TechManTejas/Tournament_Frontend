/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, LeftOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Checkbox, Flex, Form, Input, Pagination, Spin, Upload, message } from 'antd'
import { useEffect, useRef, useState } from 'react';
import { IPlayer } from '../types/player.types';
import axios from "../api/axios"
import { ITeamRecord } from '../types/team.types';
import { ITournament } from '../types/tournament.types';

interface TeamAddEditProps {
    toggleAddEdit: () => void;
    selectedTeam: ITeamRecord | undefined;
    tournament: ITournament | undefined;
}


export const TeamAddEdit: React.FC<TeamAddEditProps> = ({ toggleAddEdit, selectedTeam, tournament }) => {

    const team = selectedTeam ?? null
    const id = team?.id

    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(selectedTeam?.logo || null);
    const [playerData, setPlayerData] = useState<IPlayer[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<IPlayer[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPlayers, setTotalPlayers] = useState<number>(0);
    const [searchText, setSearchText] = useState<string>('');
    const pageSize: number = 10

    const fetchData = async (page: number = 1, search: string = '') => {
        try {
            setLoading(true);
            const response = await axios.get('/player/', {
                params: {
                    page,
                    search,
                    assigned: true,
                    tournament_id: tournament?.id
                },
            });
            console.log(response);
            setPlayerData(response.data.results);
            setTotalPlayers(response.data.count);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching player data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchText]);

    const handlePageChange = (page: number) => {
        fetchData(page, searchText);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        fetchData(1, value);
    };

    const onFinish = async (values: any) => {

        console.log(values)

        try {
            const formData = new FormData();
            if (values?.logo?.file?.originFileObj) {
                formData.append('logo', values?.logo?.file?.originFileObj);
            }
            if (tournament?.id) {
                formData.append('tournament', tournament?.id.toString())
            }
            formData.append('name', values.name);
            formData.append('short_name', values.short_name);

            // Add playing and substitute players to formData
            for (let i = 1; i <= 11; i++) {
                const playingPlayerKey = `playing_player_${i}`;
                formData.append(playingPlayerKey, values[playingPlayerKey]?.id);
            }

            for (let i = 1; i <= 5; i++) {
                const substitutePlayerKey = `substitute_player_${i}`;
                formData.append(substitutePlayerKey, values[substitutePlayerKey]?.id);
            }

            formData.append('save_team', values.save_team === undefined ? false : values.save_team);

            console.log(formData);

            if (id) {
                await axios.patch(`/teamrecord/${id}/`, formData);
                message.success('Team Updated successfully!');
            } else {
                await axios.post('/teamrecord/', formData);
                message.success('Team Added successfully!');
                form.resetFields();
            }

            toggleAddEdit();
        } catch (error) {
            console.error('Error:', error);
            message.error('Error adding/updating team');
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

    const beforeUpload = (file: File) => {
        // Allow only one file to be uploaded
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 10MB!');
        }

        return isLt10M;
    };

    const customRequest = ({ file, onSuccess }: any) => {
        setUploadedImage(URL.createObjectURL(file));
        onSuccess('ok');
    };

    const uploadProps = {
        beforeUpload,
        customRequest,
        maxCount: 1,
    };

    return (
        <>
            <div className='flex flex-col gap-4'>
                <div className='flex'>
                    <div className='flex gap-4'>
                        <Button
                            icon={<LeftOutlined />}
                            className='font-bold text-md'
                            onClick={toggleAddEdit}
                        >
                            BACK
                        </Button>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <div className='flex-grow p-4' style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url(${uploadedImage})`, backgroundSize: '' }}>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            initialValues={selectedTeam}
                            layout='vertical'
                            className="mt-8 backdrop-blur-md p-4 rounded-xl"
                        >

                            <Flex gap={20} className='items-end'>
                                <Form.Item
                                    name="logo"
                                    label="Team Logo"
                                    rules={[{ required: true, message: 'Please upload the team logo!' }]}
                                >
                                    <Upload {...uploadProps} listType="picture">
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    className='flex-grow'
                                    name="name"
                                    label="Team Name"
                                    rules={[{ required: true, message: 'Please enter the team name!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="short_name"
                                    label="Short Name"
                                    rules={[{ required: true, message: 'Please enter the short name!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="save_team"
                                    valuePropName="checked"
                                    initialValue={selectedTeam?.save_team}
                                    getValueFromEvent={(e) => e.target.checked}
                                    className="mt-4"
                                >
                                    <Checkbox>Save Team</Checkbox>
                                </Form.Item>
                            </Flex>

                            <Flex className='flex-wrap'>
                                <PlayerSelection label="Playing Player 1" name="playing_player_1" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 2" name="playing_player_2" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 3" name="playing_player_3" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 4" name="playing_player_4" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 5" name="playing_player_5" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 6" name="playing_player_6" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 7" name="playing_player_7" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 8" name="playing_player_8" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 9" name="playing_player_9" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 10" name="playing_player_10" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Playing Player 11" name="playing_player_11" form={form} setSelectedPlayers={setSelectedPlayers} />

                                <PlayerSelection label="Substitute Player 1" name="substitute_player_1" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Substitute Player 2" name="substitute_player_2" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Substitute Player 3" name="substitute_player_3" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Substitute Player 4" name="substitute_player_4" form={form} setSelectedPlayers={setSelectedPlayers} />
                                <PlayerSelection label="Substitute Player 5" name="substitute_player_5" form={form} setSelectedPlayers={setSelectedPlayers} />
                            </Flex>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    SAVE
                                </Button>
                            </Form.Item>
                        </Form>

                    </div>
                    <div className='bg-white border border-green-500 rounded-lg p-2 w-[300px] flex-shrink-0'>
                        <div>
                            <Input
                                prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='Search...'
                                className='mb-2'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div className='overflow-y-auto overflow-x-hidden grid grid-cols-3 transition-all'>
                            <>
                                {loading ? (
                                    <Spin size="large" />
                                ) : (
                                    playerData
                                        .filter(item => !selectedPlayers.some(selected => selected.id === item.id))
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className='text-xs hover:shadow-2xl hover:shadow-green-500 w-20 m-1 transition-all rounded'
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('application/json', JSON.stringify(item));
                                                    handleDragStart(e)
                                                }}
                                                onDragEnd={(e) => {
                                                    handleDragEnd(e)
                                                }}
                                            >
                                                <div className='w-full'>
                                                    <img className='w-full h-24 object-cover rounded-t' alt={item.name} src={item.image} />
                                                    <div className='text-center'>
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>)
                                        )
                                )
                                }
                            </>
                        </div>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalPlayers}
                            onChange={handlePageChange}
                            className='mt-4'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

interface PlayerSelectionProps {
    label: string;
    name: string;
    form: any;
    setSelectedPlayers: React.Dispatch<React.SetStateAction<IPlayer[]>>; // Add this prop
}

const PlayerSelection: React.FC<PlayerSelectionProps> = ({ label, name, form, setSelectedPlayers }) => {
    const playerRef = useRef<HTMLDivElement | null>(null);

    const [, forceUpdate] = useState(0);

    const handleDragOverTabPane = () => {
        // Add styles or perform actions when the drag enters the component
        if (playerRef.current) {
            playerRef.current.style.border = '2px solid green';
        }
    };

    const handleDragExitTabPane = () => {
        // Remove styles or perform actions when the drag leaves the component
        if (playerRef.current) {
            playerRef.current.style.border = 'none';
        }
    };

    return (
        <Form.Item
            label={label}
            name={name}
            rules={[{ required: true, message: `Select a player!` }]}
        >
            <div
                ref={playerRef}
                className='w-24 h-40 flex justify-center items-center'
                onDrop={(e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    // Get the transferred data
                    const transferredData = e.dataTransfer.getData('application/json');
                    const playerData = JSON.parse(transferredData);

                    // Handle the dropped data as needed
                    console.log(`Dropped data for ${label}:`, playerData);

                    // Add the dropped player to the selectedPlayers array
                    setSelectedPlayers((prevSelectedPlayers) => [...prevSelectedPlayers, playerData]);

                    // You can now use `playerData` as needed, for example, set it in the form
                    form.setFieldsValue({ [name]: playerData });

                    // Optionally, you can clear the border style or perform other actions
                    handleDragExitTabPane();
                    forceUpdate((prev) => prev + 1);
                }}
                onDragOver={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDragOverTabPane();
                }}
                onDragLeave={handleDragExitTabPane}
            >
                {form.getFieldValue(name) ? (
                    <div className='bg-slate-200 rounded'>
                        <img
                            className='w-20 h-24 object-cover mb-2 rounded-t'
                            alt={form.getFieldValue(name).name}
                            src={form.getFieldValue(name).image}
                        />
                        <div className='text-center'>{form.getFieldValue(name).name}</div>
                        <Button
                            type="link"
                            icon={<CloseOutlined />}
                            className="absolute top-0 right-0"
                            onClick={() => {
                                // Remove the dropped player from the selectedPlayers array
                                const player = form.getFieldValue(name)
                                console.log(player.id)
                                setSelectedPlayers((prevSelectedPlayers) => prevSelectedPlayers.filter(item => item.id !== player.id));

                                form.setFieldsValue({ [name]: null });
                                forceUpdate((prev) => prev + 1);
                            }}
                        />
                    </div>
                ) : (
                    <div className='border-2 w-full h-full flex justify-center items-center'></div>
                )}
            </div>
        </Form.Item>
    );
};
