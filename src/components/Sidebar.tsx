import { Layout, Menu } from 'antd';
import { BankOutlined, CalendarOutlined, DashboardOutlined, TeamOutlined, TrophyOutlined, UserOutlined, UserSwitchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import Logo from "../assets/images/logo.png"
import { useNavigate } from 'react-router-dom';
import SidebarBg from "../assets/images/sidebar.jpg"

const { Sider } = Layout;

export const Sidebar = () => {

    const navigate = useNavigate();

    const handleMenuClick = (key: string) => {
        // Navigate to the key of the clicked menu item
        navigate(`/dashboard/${key}`);
    };

    return (
        <>
            <div style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5)), url(${SidebarBg})`, backgroundSize: 'cover' }}>
                <button className='flex w-full justify-center items-center py-4' onClick={() => {
                    window.location.href = '/'
                }}>
                    <div className='m-1'>
                        <img src={Logo} className='h-10 w-10' />
                    </div>
                    <div className='font-bold text-base' >
                        TOURNAMENT
                    </div>
                </button>
                <Sider style={{ background: 'transparent' }}>
                    <Menu className='font-bold' style={{ background: 'transparent' }} mode="inline" defaultSelectedKeys={['club']} onClick={({ key }) => handleMenuClick(key)}>
                        <Menu.Item key="club" icon={<DashboardOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Club
                        </Menu.Item>
                        <Menu.Item key="tournaments" icon={<TrophyOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Tournaments
                        </Menu.Item>
                        <Menu.Item key="matches" icon={<CalendarOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Matches
                        </Menu.Item>
                        <Menu.Item key="players" icon={<UserOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Players
                        </Menu.Item>
                        <Menu.Item key="teams" icon={<TeamOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Teams
                        </Menu.Item>
                        <Menu.Item key="referees" icon={<UserSwitchOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Referees
                        </Menu.Item>
                        <Menu.Item key="stadiums" icon={<BankOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Stadiums
                        </Menu.Item>
                        <Menu.Item key="users" icon={<UsergroupAddOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Users
                        </Menu.Item>
                        <Menu.Item key="profile" icon={<UserOutlined className='shadow-lg p-2 rounded bg-green-500' style={{ color: 'white' }} />}>
                            Profile
                        </Menu.Item>
                    </Menu>
                </Sider>
            </div>
        </>
    );
};

