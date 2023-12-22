/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect  } from 'react';
import { Button, Input, Form, Space, message } from 'antd';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { IStadium } from '../types/stadium.types';
import { getUserDataFromStorage } from '../utils/storage';


const StadiumAddEdit: React.FC = () => {

    const { state } = useLocation();

    console.log(state)

    const goBack = () => {
        window.history.back();
    };

    const [form] = Form.useForm();
    const stadiumToEdit: IStadium = state?.stadium;

    const id = stadiumToEdit?.id || undefined;

    useEffect(() => {
        form.setFieldsValue({
            ...stadiumToEdit
        });
    }, [stadiumToEdit, form]);


    const onFinish = async (values: any) => {

        values.club = getUserDataFromStorage()?.user?.club?.id

        try {
            if (id) {
                await axios.put(`/stadium/${id}/`, values);
                message.success('Stadium Updated successfully!');
            } else {
                await axios.post('/stadium/', values);
                message.success('Stadium Added successfully!');
                form.resetFields();
            }

            goBack();
        } catch (error) {
            console.error('Error:', error);
            message.error('Error adding/updating stadium');
        }
    };

    return (
        <div className="px-10 py-6">
            <div className="text-2xl font-light">{id ? 'EDIT STADIUM' : 'ADD NEW STADIUM'}</div>
            <Form form={form} onFinish={onFinish} layout="vertical" className="max-w-md mt-8">
                <Form.Item name="name" label="Stadium Name" rules={[{ required: true, message: 'Please enter the stadium name' }]}>
                    <Input />
                </Form.Item>


                <Form.Item name="address" label="Stadium Address" rules={[{ required: true, message: 'Please enter the stadium address' }]}>
                    <Input.TextArea />
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
            </Form>
        </div>
    );
};

export default StadiumAddEdit;
