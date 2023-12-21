/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Select, Space, message } from 'antd';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { IUser } from '../types/user.types';

const { Option } = Select;

const UserAddEdit: React.FC = () => {
  const { state } = useLocation();

  console.log(state);

  const goBack = () => {
    window.history.back();
  };

  const [form] = Form.useForm();
  const [userToEdit, setUserToEdit] = useState<IUser | undefined>(state?.user);

  const id = userToEdit?.id || undefined;

  const initialValues = {
    username: '',
    role: '',
    verified: false,
    message: '',
  };

  useEffect(() => {
    form.setFieldsValue({
      ...userToEdit,
    });
  }, [userToEdit, form]);

  const onFinish = async (values: any) => {
    try {
      if (id) {
        await axios.put(`/users/${id}/`, values);
        message.success('User Updated successfully!');
      } else {
        await axios.post('/users/', values);
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

        <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please enter the role' }]}>
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
