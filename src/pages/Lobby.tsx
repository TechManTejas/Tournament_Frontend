import { Form, Input, Button, message } from 'antd';

import AuthImage from '../assets/images/authimage.jpg';
import Patch1 from '../assets/images/patch_1.png'
import Patch2 from '../assets/images/patch_2.png'
import Patch3 from '../assets/images/patch_3.png'
import Patch4 from '../assets/images/patch_4.png'

import axios from "../api/axios"
import { getCredentialsFromStorage, saveCredentialsToStorage } from '../utils/storage';
import { useEffect, useState } from 'react';
import { Context } from '../context/context.provider';

export const Lobby = () => {

    const { setUserVerified } = Context();

    const user_data = getCredentialsFromStorage()
    const user = user_data?.user
    const token = user_data?.token

    const [initialMessage, setInitialMessage] = useState('');

    const checkVerificationStatus = async () => {
        try {
            const response = await axios.get(`/user-lobby/${user?.id}/`);
            // Assuming your API response structure has a 'message' field
            console.log(response.data)

            if (response.data.verified) {
                message.success("Your account has been verified");
                setUserVerified(response.data.verified)
                if(token){
                    saveCredentialsToStorage({ token: user_data?.token, user: { ...response.data } })
                }
                window.location.href = '/'
            }

        } catch (error) {
            console.error('Error fetching initial message:', error);
        }
    };

    useEffect(() => {
        checkVerificationStatus()
        // Fetch the initial message value for the user
        const fetchInitialMessage = async () => {
            try {
                const response = await axios.get(`/user-lobby/${user?.id}/`);
                // Assuming your API response structure has a 'message' field
                setInitialMessage(response.data.message || '');
            } catch (error) {
                console.error('Error fetching initial message:', error);
            }
        };

        fetchInitialMessage();
    }, [user]);

    const Message = () => {
        const [form] = Form.useForm();

        const onFinish = async (values: { message: string }) => {
            try {
                // Send the message to the backend
                const response = await axios.patch(`/user-lobby/${user?.id}/`, {
                    message: values.message,
                });

                // Handle the response as needed
                console.log(response.data);

                // Optionally, show a success message
                message.success('Message sent successfully!');
            } catch (error) {
                // Handle errors
                console.error('Error sending message:', error);

                // Optionally, show an error message
                message.error('Failed to send message. Please try again.');
            }
        };

        return (
            <>
                <div className='bg-white p-16 rounded-2xl shadow-xl z-50'>
                    <div className='text-3xl my-6 text-center font-medium'>
                        Lobby
                    </div>

                    <div className='flex flex-col w-80 text-lg space-y-3'>
                        <Form
                            form={form}
                            initialValues={{ message: initialMessage }}
                            name="messageForm"
                            onFinish={onFinish}
                        >
                            <Form.Item>

                                <div className='flex justify-center items-center text-zinc-500'>
                                    <div className='mx-2'>Hello, you need the message us about who you are etc and after we active your account you can access the software</div>
                                </div>
                            </Form.Item>
                            <Form.Item
                                name="message"
                                rules={[{ required: true, message: 'Please enter your message!' }]}
                            >
                                <Input.TextArea placeholder="Enter your message" autoSize={{ minRows: 3, maxRows: 6 }} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='h-10 w-full font-semibold shadow-xl'>
                                    SEND MESSAGE
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="absolute top-4 left-4 text-white font-bold text-4xl shadow-white">
                TOURNAMENT
            </div>
            <div className="h-screen flex justify-center 
                flex-col
                lg:flex-row
            ">
                <div style={{ backgroundImage: `url(${AuthImage})` }} className=" -z-50 p-4 bg-cover bg-center
                    w-full h-screen fixed
                    lg:block lg:w-1/2 lg:h-full lg:static
                " />
                <div style={{
                    boxShadow: window.innerWidth > 1024 ? "rgba(0, 0, 0, 0.45) -20px 20px 100px 100px" : 'none'
                }} className="z-50 overflow-hidden
                    lg:w-1/2 lg:bg-[#F5F5F5] 
                    ">
                    <img src={Patch4} className='absolute top-0 -mt-60 hidden lg:block' />
                    <img src={Patch2} className='absolute top-0 right-0 -mt-60 hidden lg:block' />
                    <div className='h-full flex flex-col justify-center items-center '>
                        <Message />
                    </div>
                    <img src={Patch1} className='bottom-0 right-0 -mt-60 hidden lg:block' />
                    <img src={Patch3} className='absolute bottom-0 right-0 hidden lg:block' />
                </div>
            </div>
        </>
    );
};
