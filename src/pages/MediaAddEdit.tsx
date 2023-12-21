/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, message, Upload } from 'antd';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import { IMedia } from '../types/media.types';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const MediaAddEdit: React.FC = () => {
  const { state } = useLocation();

  const goBack = () => {
    window.history.back();
  };

  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
  const mediaToEdit: IMedia = state?.media;

  const id = mediaToEdit?.id || undefined;

  const initialValues = {
    name: '',
    type: '',
    category: '',
    verified: false,
    image: undefined,
  };

  useEffect(() => {
    if (mediaToEdit) {
        setPreviewImage(mediaToEdit.image)
      form.setFieldsValue({
        ...mediaToEdit,
      });
    } else {
      form.setFieldsValue(initialValues);
    }
  }, [mediaToEdit, form]);

  const beforeUpload = (file: File) => {
    // Display a preview of the image before uploading
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    return false; // Prevent default upload behavior
  };

  const handleChange = (info: any) => {
    // Handle changes in the uploaded file list
    if (info.fileList.length === 0) {
      // If no files are present, reset the preview image
      setPreviewImage(undefined);
    }
  };

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();

      // Append form values to FormData
      Object.keys(values).forEach((key) => {
        if (key === 'image') {
          // Handle image upload
          if (values[key]) {
            formData.append(key, values[key][0].originFileObj);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      if (id) {
        await axios.put(`/media/${id}/`, formData);
        message.success('Media Updated successfully!');
      } else {
        await axios.post('/media/', formData);
        message.success('Media Added successfully!');
        form.resetFields();
      }

      goBack();
    } catch (error) {
      console.error('Error:', error);
      message.error('Error adding/updating media');
    }
  };

  return (
    <div className="px-10 py-6">
      <div className="text-2xl font-light">{id ? 'EDIT MEDIA' : 'ADD NEW MEDIA'}</div>
      <Form form={form} onFinish={onFinish} layout="vertical" className="max-w-md mt-8">
        <Form.Item name="name" label="Media Name" rules={[{ required: true, message: 'Please enter the media name' }]}>
          <Input className="w-full" />
        </Form.Item>

        <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please enter the media type' }]}>
          <Input className="w-full" />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter the media category' }]}>
          <Input className="w-full" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Dragger
            beforeUpload={beforeUpload}
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            onChange={handleChange}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image file to this area to upload</p>
          </Dragger>
          {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100%', marginTop: 16 }} />}
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

export default MediaAddEdit;
