import { Layout, Menu } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

import Logo from "../assets/images/logo.png"

const { Sider, Content } = Layout;

export const Dashboard = () => {

    return (
        <Layout style={{ minHeight: '100vh' }} className='bg-white'>
            <div>
                <button className='flex w-full justify-center items-center py-4'>
                    <div className='m-1'>
                        <img src={Logo} className='h-10 w-10'/>
                    </div>
                    <div className='font-bold text-base'>
                        TOURNAMENT
                    </div>
                </button>
                <Sider theme='light' className='font-semibold'>
                    <Menu mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<DashboardOutlined />}>
                            Dashboard
                        </Menu.Item>
                        <Menu.Item key="342" icon={<DashboardOutlined />}>
                            Dashboard
                        </Menu.Item>
                        <Menu.Item key="2" icon={<DashboardOutlined />} >
                            Dashboard
                        </Menu.Item>
                    </Menu>
                </Sider>
            </div>
            <Layout>
                <Content className='bg-[#F5F5F5] p-4'>
                    Content Area
                </Content>
            </Layout>
        </Layout>
    );
};

