/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Select, Space, message } from 'antd';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { IUser } from '../types/user.types';

const { Option } = Select;

const UserAddEdit: React.FC = () => {
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [userToEdit] = useState<IUser | undefined>(state?.user);
  const id = userToEdit?.id || undefined;

  useEffect(() => {
    form.setFieldsValue({
      ...userToEdit,
    });
  }, [userToEdit, form]);

  const goBack = () => {
    window.history.back();
  };

  const onFinish = async (values: any) => {

    values.verified = true

    try {
      if (id) {
        await axios.put(`/user/${id}/`, values);
        message.success('User Updated successfully!');
      } else {
        await axios.post('/user/', values);
        message.success('User Added successfully!');
        form.resetFields();
      }

      goBack();
    } catch (error) {
      console.error('Error:', error);
      message.error('Error adding/updating user');
    }
  };

  return (
    <div className="px-10 py-6">
      <div className="text-2xl font-light">{id ? 'EDIT USER' : 'ADD NEW USER'}</div>
      <Form form={form} onFinish={onFinish} layout="vertical" className="max-w-md mt-8">

        <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter the username' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Please enter the first name' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please enter the last name' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: !id, message: 'Please enter the password' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select the role' }]}>
          <Select placeholder="Select a role">
            <Option value="club_admin">Club Admin</Option>
            <Option value="club_user">Club User</Option>
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
      </Form>
    </div>
  );
};

export default UserAddEdit;
