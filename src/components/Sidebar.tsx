import { Layout, Menu } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import Logo from "../assets/images/logo.png"
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

export const Sidebar = () => {

    const navigate = useNavigate();

    const handleMenuClick = (key: string) => {
        // Navigate to the key of the clicked menu item
        navigate(`/dashboard/${key}`);
    };

    return (
        <>
            <div>
                <button className='flex w-full justify-center items-center py-4'>
                    <div className='m-1'>
                        <img src={Logo} className='h-10 w-10' />
                    </div>
                    <div className='font-bold text-base'>
                        TOURNAMENT
                    </div>
                </button>
                <Sider >
                    <Menu mode="inline" defaultSelectedKeys={['club']} onClick={({ key }) => handleMenuClick(key)}>
                        <Menu.Item key="club" icon={<DashboardOutlined />}>
                            Club
                        </Menu.Item>
                        <Menu.Item key="tournaments" icon={<DashboardOutlined />} >
                            Tournaments
                        </Menu.Item>
                        <Menu.Item key="matches" icon={<DashboardOutlined />} >
                            Matches
                        </Menu.Item>
                        <Menu.Item key="players" icon={<DashboardOutlined />}>
                            Players
                        </Menu.Item>
                        <Menu.Item key="teams" icon={<DashboardOutlined />} >
                            Teams
                        </Menu.Item>
                        <Menu.Item key="referees" icon={<DashboardOutlined />} >
                            Referees
                        </Menu.Item>
                        <Menu.Item key="stadiums" icon={<DashboardOutlined />} >
                            Stadiums
                        </Menu.Item>
                        <Menu.Item key="media" icon={<DashboardOutlined />} >
                            Media
                        </Menu.Item>
                        <Menu.Item key="users" icon={<DashboardOutlined />} >
                            Users
                        </Menu.Item>
                    </Menu>
                </Sider>
            </div>
        </>
    );
};

