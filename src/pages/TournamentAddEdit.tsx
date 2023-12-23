/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Space, message, Upload, TimePicker, DatePicker, InputNumber, Select } from 'antd';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { GameMode, ITournament } from '../types/tournament.types';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment'
import GameModeSelector from '../components/GameModeSelector';

const { Option } = Select;

const TournamentAddEdit: React.FC = () => {
    const { state } = useLocation();
    console.log(state)

    const [form] = Form.useForm();
    const [tournamentToEdit] = useState<ITournament | undefined>(state?.tournament);
    const [uploadedLogo, setUploadedLogo] = useState<string | null>(null); // State variable for the uploaded logo
    const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null); // State variable for the selected game mode
    const id = tournamentToEdit?.id || undefined;

    useEffect(() => {
        form.setFieldsValue({
            ...tournamentToEdit,
            start_time: tournamentToEdit?.start_time ? moment(tournamentToEdit.start_time, 'HH:mm:ss') : undefined,
            start_date: tournamentToEdit?.start_date ? moment(tournamentToEdit.start_date, 'YYYY-MM-DD') : undefined,
        });
    }, [tournamentToEdit, form]);

    const goBack = () => {
        window.history.back();
    };

    const onFinish = async (values: any) => {

        console.log(values)

        try {
            const formData = new FormData();
            if (values?.logo?.file?.originFileObj) {
                formData.append('logo', values?.logo?.file?.originFileObj);
            }
            formData.append('name', values.name);
            formData.append('alias', values.alias);
            formData.append('start_time', values.start_time.format('HH:mm:ss'));
            formData.append('start_date', values.start_date.format('YYYY-MM-DD'));
            formData.append('playing_time', values.playing_time);
            formData.append('pause_between_games', values.pause_between_games);
            formData.append('points_draw', values.points_draw);
            formData.append('points_winner', values.points_winner);
            formData.append('points_defeat', values.points_defeat);
            formData.append('timer', values.timer);
            formData.append('game_mode', values.game_mode);

            // Add other tournament fields to formData as needed

            if (id) {
                await axios.patch(`/tournament/${id}/`, formData);
                message.success('Tournament Updated successfully!');
            } else {
                await axios.post('/tournament/', formData);
                message.success('Tournament Added successfully!');
                form.resetFields();
            }

            goBack();
        } catch (error) {
            console.error('Error:', error);
            message.error('Error adding/updating tournament');
        }
    };

    const beforeUpload = (file: File) => {
        // Allow only one file to be uploaded
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Logo must be smaller than 10MB!');
        }

        return isLt10M;
    };

    const customRequest = ({ file, onSuccess }: any) => {
        console.log(file);
        setUploadedLogo(URL.createObjectURL(file));
        onSuccess('ok');
    };

    const uploadProps = {
        beforeUpload,
        customRequest,
        maxCount: 1,
    };

    const onGameModeSelect = (gameMode: GameMode) => {
        setSelectedGameMode(gameMode);
        form.setFieldValue('game_mode', gameMode.id)
        form.validateFields(['game_mode']);
        console.log('Form fields:', form.getFieldsValue());
    };

    return (
        <div className="px-10 py-6 rounded-3xl h-full w-full" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url(${uploadedLogo || tournamentToEdit?.logo})`, backgroundSize: 'cover' }}>
            <div className="text-2xl font-light">{id ? 'EDIT TOURNAMENT' : 'ADD NEW TOURNAMENT'}</div>
            <Form form={form} onFinish={onFinish} layout="vertical" className="mt-8 backdrop-blur-xl p-4 rounded-xl flex gap-10" encType="multipart/form-data">
                <div className='w-full'>
                    <Form.Item name="logo" label="Logo">
                        <Upload {...uploadProps} listType="picture">
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>

                    <div className='flex gap-10'>
                        <Form.Item className='w-full' name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item className='w-full' name="alias" label="Alias" rules={[{ required: true, message: 'Please enter the alias' }]}>
                            <Input />
                        </Form.Item>
                    </div>

                    <div className='flex gap-10'>
                        <Form.Item className='w-full' name="start_time" label="Start Time" rules={[{ required: true, message: 'Please select the start time' }]}>
                            <TimePicker className='w-full' format="HH:mm:ss" />
                        </Form.Item>

                        <Form.Item className='w-full' name="start_date" label="Start Date" rules={[{ required: true, message: 'Please select the start date' }]}>
                            <DatePicker className='w-full' format="YYYY-MM-DD" />
                        </Form.Item>
                    </div>

                    <div className='flex gap-10'>
                        <Form.Item className='w-full' name="playing_time" label="Playing Time (minutes)" rules={[{ required: true, message: 'Please enter the playing time' }]}>
                            <InputNumber className='w-full' />
                        </Form.Item>

                        <Form.Item className='w-full' name="pause_between_games" label="Pause Between Games (minutes)" rules={[{ required: true, message: 'Please enter the pause between games' }]}>
                            <InputNumber className='w-full' />
                        </Form.Item>
                    </div>

                    <div className='flex gap-10'>
                        <Form.Item className='w-full' name="points_winner" label="Points for Winner" rules={[{ required: true, message: 'Please enter points for the winner' }]}>
                            <InputNumber className='w-full' />
                        </Form.Item>

                        <Form.Item className='w-full' name="points_draw" label="Points for Draw" rules={[{ required: true, message: 'Please enter points for a draw' }]}>
                            <InputNumber className='w-full' />
                        </Form.Item>

                        <Form.Item className='w-full' name="points_defeat" label="Points for Defeat" rules={[{ required: true, message: 'Please enter points for defeat' }]}>
                            <InputNumber className='w-full' />
                        </Form.Item>
                    </div>

                    <Form.Item name="timer" label="Timer" rules={[{ required: true, message: 'Please select the timer type' }]}>
                        <Select>
                            <Option value="up">Runs Up</Option>
                            <Option value="down">Runs Down</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space className="space-x-4">
                            <Button type="primary" htmlType="submit" className="font-semibold w-28 h-10">
                                {id ? 'SAVE' : 'ADD'}
                            </Button>
                            <Button className="font-semibold w-28 h-10" onClick={goBack}>
                                CANCEL
                            </Button>
                        </Space>
                    </Form.Item>
                </div>
                <div className='w-full p-4 rounded-xl'>
                    <Form.Item
                        name="game_mode"
                        label="Game Mode"
                        rules={[{ required: true, message: 'Please select a game mode' }]}
                    >
                        <GameModeSelector selectedGameMode={selectedGameMode} onSelect={onGameModeSelect} />
                    </Form.Item>

                </div>
            </Form>
        </div>
    );
};

export default TournamentAddEdit;
