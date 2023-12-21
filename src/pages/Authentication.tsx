import { Form, Input, Button, Checkbox, Flex, message } from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import axios from 'axios';

import AuthImage from '../assets/images/authimage.jpg';
import Patch1 from '../assets/images/patch_1.png'
import Patch2 from '../assets/images/patch_2.png'
import Patch3 from '../assets/images/patch_3.png'
import Patch4 from '../assets/images/patch_4.png'
import { useState } from 'react';
import { Context } from '../context/context.provider';
import { saveCredentialsToStorage } from '../utils/storage';

export const Authentication = () => {

  const { setUserAuthenticated, setAuthenticatedVerified } = Context();

  const [isLogin, setIsLogin] = useState(true);

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const Login = () => {

    const onFinish = async (values: { username: string, password: string, remember: boolean }) => {
      try {
        // Send login request to Django API
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/`, {
          username: values.username,
          password: values.password,
        });
        
        console.log(response.data.user.verified)
        saveCredentialsToStorage(response.data, values.remember);
        setAuthenticatedVerified(response.data.user.verified)
        setUserAuthenticated(!!response.data.user)
        window.location.href = '/lobby'

        // Optionally, show a success message
        message.success('Login successful!');
      } catch (error) {
        // Handle login errors
        console.error('Error logging in:', error);

        // Optionally, show an error message
        message.error('Failed to login. Please check your credentials.');
      }
    };

    return (
      <>
        <div className='bg-white p-16 rounded-2xl shadow-xl z-50'>
          <div className='text-3xl my-6 text-center font-medium'>
            Login
          </div>
          <div className='flex flex-col w-80 text-lg space-y-3'>
            <Form
              name="loginForm"
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please enter your username!' }]}
              >
                <Input placeholder="Username" className='h-10' />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password placeholder="Password" className='h-10' />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox className='text-zinc-500'>Remember me</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className='h-10 w-full font-semibold shadow-xl'>
                  LOGIN
                </Button>
              </Form.Item>
            </Form>
            <div className='text-xs flex justify-center items-center text-zinc-500'>
              <hr className='flex-grow border-t' />
              <div className='mx-2'>or login with</div>
              <hr className='flex-grow border-t' />
            </div>
            <div className='flex justify-between space-x-4'>
              <Button className='w-1/2 h-10 rounded-lg border-red-500 text-red-500' icon={<GoogleOutlined />} onClick={() => { }}>
                Google
              </Button>

              <Button className='w-1/2 h-10 rounded-lg border-blue-500 text-blue-500' icon={<FacebookOutlined />} onClick={() => { }}>
                Facebook
              </Button>
            </div>
          </div>
          <div className='my-6 text-center'>
            Don't have an account?
            <button className='mx-1 text-primary underline hover:text-green-500' onClick={switchForm}>
              Register Now
            </button>
          </div>
        </div>
      </>
    )
  }

  const Signup = () => {

    const onFinish = async (values: { first_name: string, last_name: string, username: string, email: string, password: string, confirmpassword: string }) => {
      // Check if password and confirmPassword match
      if (values.password !== values.confirmpassword) {
        // Show an error message if passwords do not match
        message.error('Password and Confirm Password do not match. Please check your information.');
        return;
      }

      try {
        // Send signup request to Django API
        await axios.post(`${import.meta.env.VITE_BASE_URL}/user/`, {
          first_name: values.first_name,
          last_name: values.last_name,
          username: values.username,
          email: values.email,
          password: values.password
        });

        // Optionally, show a success message
        message.success('Signup successful! Please login.');
        setIsLogin(true)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response && error.response.status === 400 && error.response.data.username) {
          // If the error is due to the username already existing, set the state
          message.error('A User with that username already exists, please try with a different username');
        } else {
          console.error('Error logging in:', error);
          message.error('Failed to login. Please check your credentials.');
        }
      }
    };


    return (
      <>
        <div className='bg-white p-16 rounded-2xl shadow-xl z-50'>
          <div className='text-3xl my-6 text-center font-medium'>
            Signup
          </div>
          <div className='flex flex-col w-80 text-lg space-y-3'>
            <Form
              name="signupForm"
              onFinish={onFinish}
            >
              <Flex className='space-x-4'>
                <Form.Item
                  name="first_name"
                  rules={[{ required: true, message: 'Please enter your email!' }]}
                >
                  <Input placeholder="Firstname" className='h-10' />
                </Form.Item>

                <Form.Item
                  name="last_name"
                  rules={[{ required: true, message: 'Please enter your email!' }]}
                >
                  <Input placeholder="Lastname" className='h-10' />
                </Form.Item>
              </Flex>

              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please enter your email!' }]}
              >
                <Input placeholder="Email" className='h-10' />
              </Form.Item>

              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please enter your username!' }]}
              >
                <Input placeholder="Username" className='h-10' />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password placeholder="Password" className='h-10' visibilityToggle={false} />
              </Form.Item>

              <Form.Item
                name="confirmpassword"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password placeholder="Confirm Password" className='h-10' visibilityToggle={false} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className='h-10 w-full font-semibold shadow-xl'>
                  SIGNUP
                </Button>
              </Form.Item>
            </Form>
            <div className='text-xs flex justify-center items-center text-zinc-500'>
              <hr className='flex-grow border-t' />
              <div className='mx-2'>or signup with</div>
              <hr className='flex-grow border-t' />
            </div>
            <div className='flex justify-between space-x-4'>
              <Button className='w-1/2 h-10 rounded-lg border-red-500 text-red-500' icon={<GoogleOutlined />} onClick={() => { }}>
                Google
              </Button>

              <Button className='w-1/2 h-10 rounded-lg border-blue-500 text-blue-500' icon={<FacebookOutlined />} onClick={() => { }}>
                Facebook
              </Button>
            </div>
          </div>
          <div className='my-6 text-center'>
            Already have an account?
            <button className='mx-1 text-primary underline hover:text-green-500' onClick={switchForm}>
              Login Now
            </button>
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
            {isLogin ? <Login /> : <Signup />}
          </div>
          <img src={Patch1} className='bottom-0 right-0 -mt-60 hidden lg:block' />
          <img src={Patch3} className='absolute bottom-0 right-0 hidden lg:block' />
        </div>
      </div>
    </>
  );
};
