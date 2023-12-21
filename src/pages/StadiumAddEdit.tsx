/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Select, Space, message, Image } from 'antd';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { IStadium } from '../types/stadium.types';
import { IMedia } from '../types/media.types';

const { Option } = Select;

const StadiumAddEdit: React.FC = () => {
    
    const { state } = useLocation();

    console.log(state)

    const goBack = () => {
        window.history.back();
    };

    const [form] = Form.useForm();
    const [mediaList, setMediaList] = useState<IMedia[]>([]);
    const [selectedImage, setSelectedImage] = useState<IMedia| undefined>(undefined);
    const stadiumToEdit: IStadium = state?.stadium;

    const id = stadiumToEdit?.id || undefined;

    const initialValues = {
        name: '',
        image: undefined,
        address: '',
    };

    useEffect(() => {
        form.setFieldsValue({
            ...stadiumToEdit
        });

        // Fetch the list of media options
        fetchMediaList();
    }, [stadiumToEdit, form]);

    const fetchMediaList = async () => {
        try {
            const response = await axios.get('/media/');
            setMediaList(response.data.results);
        } catch (error) {
            console.error('Error fetching media list:', error);
        }
    };

    const handleImageSelect = (id: number) => {
        const selectedMedia = mediaList.find((media) => media.id === id);
        if (selectedMedia) {
            setSelectedImage(selectedMedia);
        }
    };

    const onFinish = async (values: any) => {

        values.image = selectedImage?.id

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

                <Form.Item
                    name="image"
                    label="Stadium Image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                >
                    <Select
                        showSearch
                        placeholder="Select a media image"
                        optionFilterProp="children"
                        onChange={handleImageSelect}
                    >
                        {mediaList.map((media) => (
                            <Option key={media.id} value={media.id}>
                                {media.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {selectedImage && (
                    <Form.Item label="Selected Image Preview">
                        <Image src={selectedImage.image} alt="Selected Image Preview" />
                    </Form.Item>
                )}

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
