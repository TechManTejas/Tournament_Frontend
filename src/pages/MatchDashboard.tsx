/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Select, TimePicker, Button, RadioChangeEvent, Radio, Form, Tabs, Input, Table, Space, ColorPicker } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { DeleteOutlined, EditOutlined, MenuFoldOutlined, PauseCircleOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';

const { Option } = Select;

export const MatchDashboard: React.FC = () => {

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

    const handleButtonClick = (formInstance: any) => {
        formInstance.validateFields().then((values: any) => {
            // Handle form submission
            console.log('Form values:', values);
            // Add your logic for form submission
        });
    };

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
                <div className='w-72 h-full rounded p-2'>
                    <div className='text-center text-xl mb-1'>
                        Team A (3)
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Form form={formColorTeamA} onFinish={() => handleButtonClick(formColorTeamA)}>
                            <div className='bg-white p-4 rounded shadow flex gap-2'>
                                <Form.Item
                                    className='p-0 m-0'
                                    name="colorPicker"
                                    label="Select Jersey Color"
                                    initialValue={colorPickerValueTeamA}
                                >
                                    <ColorPicker onChange={(color) => setColorPickerValueTeamA(color.toHexString())} />
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

                        <Form form={formGoalTeamA} onFinish={() => handleButtonClick(formGoalTeamA)}>
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
                                        <Option value="option1">Option 1</Option>
                                        <Option value="option2">Option 2</Option>
                                        <Option value="option3">Option 3</Option>
                                    </Select>
                                </FormItem>
                                {/* RADIO GROUP */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="radioValue"
                                    rules={[{ required: true, message: 'Please select a radio option' }]}
                                >
                                    <Radio.Group defaultValue={1} onChange={(e: RadioChangeEvent) => formGoalTeamA.setFieldsValue({ radioValue: e.target.value })} className='mb-2'>
                                        <Radio value={1}>Own</Radio>
                                        <Radio value={2}>Penalty?</Radio>
                                    </Radio.Group>
                                </FormItem>
                                {/* TIME INPUT */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="matchTime"
                                    rules={[{ required: true, message: 'Please select a time' }]}
                                >
                                    <TimePicker
                                        id="matchTime"
                                        placeholder="Select a time"
                                        format="HH:mm"
                                        className='w-full mb-2'
                                    />
                                </FormItem>
                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    GOAL!
                                </Button>
                            </div>
                        </Form>

                        <Form form={formPenaltyTeamA} onFinish={() => handleButtonClick(formPenaltyTeamA)}>
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

                                {/* TIME INPUT */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="penaltyTime"
                                    rules={[{ required: true, message: 'Please select a time for the penalty' }]}
                                >
                                    <TimePicker
                                        id="penaltyTime"
                                        placeholder="Select a time"
                                        format="HH:mm"
                                        className='w-full mb-2'
                                    />
                                </FormItem>

                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    Add Penalty
                                </Button>
                            </div>
                        </Form>

                        <Form form={formSubstitutionTeamA} onFinish={() => handleButtonClick(formSubstitutionTeamA)}>
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
                        <Form form={formComment} onFinish={() => handleButtonClick(formComment)}>
                            <Form.Item
                                name="gameStatus"
                                label="Game Status"
                                className='p-0 m-2'
                                rules={[{ required: true, message: 'Please select the game status' }]}
                            >
                                <Select placeholder="Select the game status">
                                    <Option value="notStarted">Not Started</Option>
                                    <Option value="started">Started</Option>
                                    <Option value="halftime">Halftime</Option>
                                    <Option value="ended">Ended</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="stadium"
                                label="Stadium"
                                className='p-0 m-2'
                                rules={[{ required: true, message: 'Please select the stadium' }]}
                            >
                                <Select placeholder="Select the stadium">
                                    <Option value="notStarted">Not Started</Option>
                                    <Option value="started">Started</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="refereeHead"
                                label="Referee Head"
                                className='p-0 m-2'
                                rules={[{ required: true, message: 'Please select a referee head' }]}
                            >
                                <Select placeholder="Select a referee head">
                                    <Option value="notStarted">Not Started</Option>
                                    <Option value="started">Started</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="refereeAssistant1"
                                label="Referee Assistant 1"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select a referee assistant 1">
                                    <Option value="notStarted">Not Started</Option>
                                    <Option value="started">Started</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="refereeAssistant2"
                                label="Referee Assistant 2"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select a referee assistant 2">
                                    <Option value="notStarted">Not Started</Option>
                                    <Option value="started">Started</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="refereeAssistant3"
                                label="Referee Assistant 3"
                                className='p-0 m-2'
                            >
                                <Select placeholder="Select a referee assistant 3">
                                    <Option value="notStarted">Not Started</Option>
                                    <Option value="started">Started</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item className='p-0 m-2'>
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    Update Status
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    <div className='flex w-full bg-white rounded shadow border'>
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
                                    <Button type="primary" htmlType="submit" className='w-full'>
                                        Submit Comment
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
                    </div>

                </div>

                {/* Team B */}
                <div className='w-72 h-full rounded p-2'>
                    <div className='text-center text-xl mb-1'>
                        Team B (2)
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Form form={formColorTeamB} onFinish={() => handleButtonClick(formColorTeamB)}>
                            <div className='bg-white p-4 rounded shadow flex gap-2'>
                                <Form.Item
                                    className='p-0 m-0'
                                    name="colorPicker"
                                    label="Select Jersey Color"
                                    initialValue={colorPickerValueTeamB}
                                >
                                    <ColorPicker onChange={(color) => setColorPickerValueTeamB(color.toHexString())} />
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

                        <Form form={formGoalTeamB} onFinish={() => handleButtonClick(formGoalTeamB)}>
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
                                        <Option value="option1">Option 1</Option>
                                        <Option value="option2">Option 2</Option>
                                        <Option value="option3">Option 3</Option>
                                    </Select>
                                </FormItem>
                                {/* RADIO GROUP */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="radioValue"
                                    rules={[{ required: true, message: 'Please select a radio option' }]}
                                >
                                    <Radio.Group defaultValue={1} onChange={(e: RadioChangeEvent) => formGoalTeamA.setFieldsValue({ radioValue: e.target.value })} className='mb-2'>
                                        <Radio value={1}>Own</Radio>
                                        <Radio value={2}>Penalty?</Radio>
                                    </Radio.Group>
                                </FormItem>
                                {/* TIME INPUT */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="matchTime"
                                    rules={[{ required: true, message: 'Please select a time' }]}
                                >
                                    <TimePicker
                                        id="matchTime"
                                        placeholder="Select a time"
                                        format="HH:mm"
                                        className='w-full mb-2'
                                    />
                                </FormItem>
                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    GOAL!
                                </Button>
                            </div>
                        </Form>

                        <Form form={formPenaltyTeamB} onFinish={() => handleButtonClick(formPenaltyTeamB)}>
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

                                {/* TIME INPUT */}
                                <FormItem
                                    className='p-0 m-0'
                                    name="penaltyTime"
                                    rules={[{ required: true, message: 'Please select a time for the penalty' }]}
                                >
                                    <TimePicker
                                        id="penaltyTime"
                                        placeholder="Select a time"
                                        format="HH:mm"
                                        className='w-full mb-2'
                                    />
                                </FormItem>

                                {/* BUTTON */}
                                <Button type="primary" htmlType="submit" className='w-full'>
                                    Add Penalty
                                </Button>
                            </div>
                        </Form>

                        <Form form={formSubstitutionTeamB} onFinish={() => handleButtonClick(formSubstitutionTeamB)}>
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
