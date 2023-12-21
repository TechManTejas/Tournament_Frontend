import { FloatButton, Layout } from 'antd';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Club } from './Club';
import { Tournaments } from './Tournaments';
import { Matches } from './Matches';
import { Players } from './Players';
import { Teams } from './Teams';
import { Referees } from './Referees';
import Stadiums from './Stadiums';
import StadiumAddEdit from './StadiumAddEdit';
import Users from './Users';
import UserAddEdit from './UserAddEdit';
import { Sidebar } from '../components/Sidebar';
import { MessageOutlined } from '@ant-design/icons';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useState } from 'react';

const { Content } = Layout;


const ChatBox: React.FC = () => {
    const [position, setPosition] = useState({ x: window.innerWidth/2, y: -window.innerHeight/1.25 });

    const handleDrag = (e: DraggableEvent, ui: DraggableData) => {
        const { x, y } = ui;
        setPosition({ x, y });
    };

    return (
        <Draggable position={position} onDrag={handleDrag}>
            <div className='bg-red-300 w-[400px] h-[600px] rounded'>
                <div>Drag here to move</div>
                <input/>
            </div>
        </Draggable>
    );
};

export const Dashboard = () => {
    const [isChatVisible, setChatVisible] = useState(false);

    console.log(isChatVisible)

    const handleChat = () => {
        setChatVisible(true);
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Sidebar />
            <Layout>
                <Content className='bg-[#F5F5F5] p-6'>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard/club" />} />
                        <Route path="/club" element={<Club />} />
                        <Route path="/tournaments" element={<Tournaments />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/players" element={<Players />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/referees" element={<Referees />} />
                        <Route path="/stadiums" element={<Stadiums />} />
                        <Route path="/stadiums/add-edit" element={<StadiumAddEdit />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/add-edit" element={<UserAddEdit />} />
                    </Routes>
                    <>
                        <FloatButton.Group shape="circle">
                            <FloatButton type='primary' badge={{ count: 123, overflowCount: 99 }} onClick={handleChat} icon={<MessageOutlined />} />
                            {/* <FloatButton onClick={handleLogout} icon={<PoweroffOutlined/>}/> */}
                        </FloatButton.Group>
                        {/* Render the ChatBox component based on the state */}
                        <ChatBox/>
                    </>
                </Content>
            </Layout>
        </Layout>
    );
};

