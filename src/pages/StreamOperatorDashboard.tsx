import React, { useState } from 'react';
import { Form, Select, Button, Switch } from 'antd';
const { Option } = Select;

export const StreamOperatorDashboard: React.FC = () => {
    const [form] = Form.useForm();

    const [isLive, setIsLive] = useState(false);

    const handleToggleSwitch = (checked: boolean) => {
        setIsLive(checked);
    };

    const handlePushAdvertise = (values: { adSelect: string }) => {
        // Add your logic to handle pushing the advertisement
        console.log('Advertisement pushed:', values.adSelect);
    };

    return (
        <>
            <div className='h-full rounded-xl'>
                <div className='border border-black rounded-xl h-[calc(100%-120px)]'>
                    
                </div>
                <div className='flex justify-between p-4 border border-red-500 shadow rounded-xl w-full bottom-0 bg-transparent backdrop-blur-3xl h-30'>

                    <div className='flex gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div>
                                <Button type='primary'>Scoreboard</Button>
                            </div>
                            <div>
                                <Switch checked={isLive} onChange={handleToggleSwitch} className='bg-red-500' />
                            </div>
                            <div>
                                {isLive ? 'Live' : 'Inactive'}
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div>
                                <Button type='primary'>TABLE A</Button>
                            </div>
                            <div>
                                <Switch checked={isLive} onChange={handleToggleSwitch} className='bg-red-500' />
                            </div>
                            <div>
                                {isLive ? 'Live' : 'Inactive'}
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div>
                                <Button type='primary'>TABLE B</Button>
                            </div>
                            <div>
                                <Switch checked={isLive} onChange={handleToggleSwitch} className='bg-red-500' />
                            </div>
                            <div>
                                {isLive ? 'Live' : 'Inactive'}
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div>
                            Message from Tournament Leader:
                        </div>
                        <div className='text-center text-xl font-semibold'>
                            GOAL TEJAS VAIJ!!!
                        </div>
                        <Button type='primary'>PUSH LIVE</Button>
                    </div>

                    <div>
                        <Form layout='vertical' form={form} onFinish={handlePushAdvertise}>
                            <Form.Item name="adSelect" label="Select Ad:" className='m-0 p-0'>
                                <Select style={{ width: 200 }}>
                                    <Option value='ad1'>Advertisement 1</Option>
                                    <Option value='ad2'>Advertisement 2</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item className='m-0 p-0'>
                                <Button type='primary' htmlType='submit'>
                                    PUSH ADVERTISEMENT
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                </div>
            </div>
        </>
    );
};
