/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Space, message, Upload } from 'antd';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { IStadium } from '../types/stadium.types';
import { UploadOutlined } from '@ant-design/icons';

const StadiumAddEdit: React.FC = () => {
    const { state } = useLocation();
    const [form] = Form.useForm();
    const [stadiumToEdit] = useState<IStadium | undefined>(state?.stadium);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null); // State variable for the uploaded image
    const id = stadiumToEdit?.id || undefined;

    useEffect(() => {
        form.setFieldsValue({
            ...stadiumToEdit,
        });
    }, [stadiumToEdit, form]);

    const goBack = () => {
        window.history.back();
    };

    const onFinish = async (values: any) => {
        try {
            const formData = new FormData();
            if (values?.image?.file?.originFileObj) {
                formData.append('image', values?.image?.file?.originFileObj);
            }
            formData.append('name', values.name);
            formData.append('address', values.address);

            if (id) {
                await axios.patch(`/stadium/${id}/`, formData);
                message.success('Stadium Updated successfully!');
            } else {
                await axios.post('/stadium/', formData);
                message.success('Stadium Added successfully!');
                form.resetFields();
            }

            goBack();
        } catch (error) {
            console.error('Error:', error);
            message.error('Error adding/updating stadium');
        }
    };

    const beforeUpload = (file: File) => {
        // Allow only one file to be uploaded
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 101MB!');
        }

        return isLt10M;
    };

    const customRequest = ({ file, onSuccess }: any) => {
        console.log(file)
        setUploadedImage(URL.createObjectURL(file))
        onSuccess("ok");
    };

    const uploadProps = {
        beforeUpload,
        customRequest,
        maxCount: 1,
    };

    return (
        <div className="px-10 py-6 h-full rounded-3xl" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url(${uploadedImage || stadiumToEdit?.image})`, backgroundSize: 'cover' }}>
            <div className="text-2xl font-light">{id ? 'EDIT STADIUM' : 'ADD NEW STADIUM'}</div>
            <Form form={form} onFinish={onFinish} layout="vertical" className="max-w-md mt-8 backdrop-blur-xl p-4 rounded-xl" encType="multipart/form-data">

                {/* Image Upload using Ant Design Upload component */}
                <Form.Item name="image" label="Image">
                    <Upload {...uploadProps} listType="picture">
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item>

                {/* Name Input */}
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
                    <Input />
                </Form.Item>

                {/* Address Input */}
                <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter the address' }]}>
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
