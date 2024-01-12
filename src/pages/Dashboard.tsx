import { FloatButton, Layout } from 'antd';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Club } from './Club';
import { Tournaments } from './Tournaments';
import Players from './Players';
import Referees from './Referees';
import Stadiums from './Stadiums';
import StadiumAddEdit from './StadiumAddEdit';
import Users from './Users';
import UserAddEdit from './UserAddEdit';
import { Sidebar } from '../components/Sidebar';
import { MessageOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import './chatscrollbar.css'
import { Profile } from './Profile';
import RefereeAddEdit from './RefereeAddEdit';
import PlayerAddEdit from './PlayerAddEdit';
import TournamentAddEdit from './TournamentAddEdit';
import TournamentManage from './TournamentManage';
import { MatchDashboard } from './MatchDashboard';
import { StreamOperatorDashboard } from './StreamOperatorDashboard';
import { ChatBox } from '../components/ChatBox';

const { Content } = Layout;



export const Dashboard = () => {

    const [isChatVisible, setChatVisible] = useState(false);
    const [shouldHideSidebar, setShouldHideSidebar] = useState(false);
    const location = useLocation();

    const openChat = () => {
        setChatVisible(true);
    };

    const closeChat = () => {
        setChatVisible(false);
    };

    useEffect(() => {
        // Define routes where you want to hide the sidebar
        const routesWithoutSidebar = ['/dashboard/stream-operator', '/dashboard/match'];
    
        // Check if the current route should hide the sidebar
        setShouldHideSidebar(routesWithoutSidebar.includes(location.pathname));
      }, [location.pathname]);

    return (
        <Layout style={{ height: '100vh' }}>
            {!shouldHideSidebar && <Sidebar />}
            <Layout>
                <Content className='bg-[#F5F5F5] p-6'>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard/club" />} />
                        <Route path="/club" element={<Club />} />
                        <Route path="/tournaments" element={<Tournaments />} />
                        <Route path="/tournaments/add-edit" element={<TournamentAddEdit />} />
                        <Route path="/tournaments/manage/*" element={<TournamentManage />} />
                        <Route path="/match" element={<MatchDashboard />} />
                        <Route path="/stream-operator" element={<StreamOperatorDashboard />} />
                        <Route path="/players" element={<Players />} />
                        <Route path="/players/add-edit" element={<PlayerAddEdit />} />
                        <Route path="/referees" element={<Referees />} />
                        <Route path="/referees/add-edit" element={<RefereeAddEdit />} />
                        <Route path="/stadiums" element={<Stadiums />} />
                        <Route path="/stadiums/add-edit" element={<StadiumAddEdit />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/add-edit" element={<UserAddEdit />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </Content>
                <>
                </>
            </Layout>
            {isChatVisible &&
                <div className='absolute bottom-32 right-10'>
                    <ChatBox closeChat={closeChat} />
                </div>
            }
            <FloatButton.Group shape="circle">
                {/* To-do: Add Num of Messages <FloatButton type='primary' badge={{ count: 123, overflowCount: 99 }} onClick={openChat} icon={<MessageOutlined />} /> */}
                <FloatButton type='primary'  onClick={openChat} icon={<MessageOutlined />} />
            </FloatButton.Group>
        </Layout>
    );
};

