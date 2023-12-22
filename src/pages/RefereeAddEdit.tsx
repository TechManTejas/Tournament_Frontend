/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Space, message } from 'antd';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { IReferee } from '../types/referee.types';

const RefereeAddEdit: React.FC = () => {
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [refereeToEdit] = useState<IReferee | undefined>(state?.referee);
  const id = refereeToEdit?.id || undefined;

  useEffect(() => {
    form.setFieldsValue({
      ...refereeToEdit,
    });
  }, [refereeToEdit, form]);

  const goBack = () => {
    window.history.back();
  };

  const onFinish = async (values: any) => {
    try {
      if (id) {
        await axios.put(`/referee/${id}/`, values);
        message.success('Referee Updated successfully!');
      } else {
        await axios.post('/referee/', values);
        message.success('Referee Added successfully!');
        form.resetFields();
      }

      goBack();
    } catch (error) {
      console.error('Error:', error);
      message.error('Error adding/updating referee');
    }
  };

  return (
    <div className="px-10 py-6">
      <div className="text-2xl font-light">{id ? 'EDIT REFEREE' : 'ADD NEW REFEREE'}</div>
      <Form form={form} onFinish={onFinish} layout="vertical" className="max-w-md mt-8">

        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
          <Input />
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

export default RefereeAddEdit;
