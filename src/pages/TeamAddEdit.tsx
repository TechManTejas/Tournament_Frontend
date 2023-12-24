/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, LeftOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, Upload, message } from 'antd'
import { useEffect, useRef, useState } from 'react';
import { IPlayer } from '../types/player.types';
import axios from "../api/axios"
import { ITeamRecord } from '../types/team.types';

interface TeamAddEditProps {
    toggleAddEdit: () => void;
    selectedTeam: ITeamRecord | undefined
}


export const TeamAddEdit: React.FC<TeamAddEditProps> = ({ toggleAddEdit, selectedTeam }) => {

    const team = selectedTeam ?? null
    const id = team?.id
    console.log(team)

    const [form] = Form.useForm();
    const [uploadedImage, setUploadedImage] = useState<string | null>(selectedTeam?.logo || null);
    const [playerData, setPlayerData] = useState<IPlayer[]>([]);


    useEffect(() => {
        // Fetch player data from the /player endpoint
        axios.get('/player/')
            .then(response => {

                console.log(response.data)
                setPlayerData(response.data.results);
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
            });
    }, []);

    const onFinish = async (values: any) => {

        console.log(values)

        // try {
        //     const formData = new FormData();
        //     if (values?.logo?.file?.originFileObj) {
        //         formData.append('logo', values?.logo?.file?.originFileObj);
        //     }
        //     formData.append('name', values.name);
        //     formData.append('name', values.name);
        //     formData.append('short_name', values.short_name);

        //     if (id) {
        //         await axios.patch(`/teamrecord/${id}/`, formData);
        //         message.success('Team Updated successfully!');
        //     } else {
        //         await axios.post('/teamrecord/', formData);
        //         message.success('Team Added successfully!');
        //         form.resetFields();
        //     }

        //     toggleAddEdit();
        // } catch (error) {
        //     console.error('Error:', error);
        //     message.error('Error adding/updating team');
        // }
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
                <div className='flex justify-end'>
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
                <div className='flex'>
                    <div className='flex-grow p-4' style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url(${uploadedImage})`, backgroundSize: 'cover' }}>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            initialValues={selectedTeam}
                            layout='vertical'
                            className="mt-8 backdrop-blur-sm p-4 rounded-xl"
                        >

                            <Flex gap={20}>
                                <Form.Item
                                    name="logo"
                                    label="Team Logo"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e.fileList}
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
                            </Flex>

                            <Flex className='flex-wrap'>
                                <PlayerSelection label="Playing Player 1" name="playing_player_1" form={form} />
                                <PlayerSelection label="Playing Player 2" name="playing_player_2" form={form} />
                                <PlayerSelection label="Playing Player 3" name="playing_player_3" form={form} />
                                <PlayerSelection label="Playing Player 4" name="playing_player_4" form={form} />
                                <PlayerSelection label="Playing Player 5" name="playing_player_5" form={form} />
                                <PlayerSelection label="Playing Player 6" name="playing_player_6" form={form} />
                                <PlayerSelection label="Playing Player 7" name="playing_player_7" form={form} />
                                <PlayerSelection label="Playing Player 8" name="playing_player_8" form={form} />
                                <PlayerSelection label="Playing Player 9" name="playing_player_9" form={form} />
                                <PlayerSelection label="Playing Player 10" name="playing_player_10" form={form} />
                                <PlayerSelection label="Playing Player 11" name="playing_player_11" form={form} />

                                <PlayerSelection label="Substitute Player 1" name="substitute_player_1" form={form} />
                                <PlayerSelection label="Substitute Player 2" name="substitute_player_2" form={form} />
                                <PlayerSelection label="Substitute Player 3" name="substitute_player_3" form={form} />
                                <PlayerSelection label="Substitute Player 4" name="substitute_player_4" form={form} />
                                <PlayerSelection label="Substitute Player 5" name="substitute_player_5" form={form} />
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
                            />
                        </div>
                        <div className='overflow-y-auto overflow-x-hidden grid grid-cols-3'>
                            <>
                                {playerData.map((item, index) => (
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
                                    </div>
                                ))}
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

interface PlayerSelectionProps {
    label: string;
    name: string;
    form: any; // Replace with the actual type of your form instance
}

const PlayerSelection: React.FC<PlayerSelectionProps> = ({ label, name, form }) => {
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
