import { Form, Input, Button, Checkbox, Flex } from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';

import AuthImage from '../assets/images/authimage.jpg';
import Patch1 from '../assets/images/patch_1.png'
import Patch2 from '../assets/images/patch_2.png'
import Patch3 from '../assets/images/patch_3.png'
import Patch4 from '../assets/images/patch_4.png'
import { useState } from 'react';


export const Authentication = () => {

  const [isLogin, setIsLogin] = useState(true);

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const Login = () => {

    const onFinish = () => {
      // Handle form submission here
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
                name="email"
                rules={[{ required: true, message: 'Please enter your email!' }]}
              >
                <Input placeholder="Email" className='h-10' />
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
          <div className='my-6 text-center font-medium'>
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

    const onFinish = () => {
      // Handle form submission here
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
                  name="firstname"
                  rules={[{ required: true, message: 'Please enter your email!' }]}
                >
                  <Input placeholder="Firstname" className='h-10' />
                </Form.Item>

                <Form.Item
                  name="lastname"
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
          <div className='my-6 text-center font-medium'>
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
