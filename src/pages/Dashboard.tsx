import { Button, FloatButton, Layout } from 'antd';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Club } from './Club';
import { Tournaments } from './Tournaments';
import { Matches } from './Matches';
import Players from './Players';
// import { Teams } from './Teams';
import Referees from './Referees';
import Stadiums from './Stadiums';
import StadiumAddEdit from './StadiumAddEdit';
import Users from './Users';
import UserAddEdit from './UserAddEdit';
import { Sidebar } from '../components/Sidebar';
import { CloseOutlined, CrownOutlined, MessageOutlined } from '@ant-design/icons';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useEffect, useRef, useState } from 'react';

import './chatscrollbar.css'
import { Profile } from './Profile';
import RefereeAddEdit from './RefereeAddEdit';
import PlayerAddEdit from './PlayerAddEdit';
import TournamentAddEdit from './TournamentAddEdit';
import TournamentManage from './TournamentManage';

const { Content } = Layout;

interface ChatBoxProps {
    closeChat: () => void; // Corrected type for closeChat prop
}

const ChatBox: React.FC<ChatBoxProps> = ({ closeChat }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleDrag = (e: DraggableEvent, ui: DraggableData) => {
        const { x, y } = ui;
        setPosition({ x, y });
    };

    useEffect(() => {
        // Scroll to the bottom when the component mounts or whenever the content changes
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [/* dependencies that trigger a scroll, e.g., content changes */]);

    return (
        <Draggable
            axis="x"
            position={position}
            onDrag={handleDrag}
        >
            <div className='bg-zinc-500 w-[350px] h-[500px] rounded shadow-2xl'>
                <div className='relative p-1'>
                    <div className='absolute right-1'>
                        <Button size='small' type='primary' onClick={closeChat} icon={<CloseOutlined />} />
                    </div>
                    <div className='flex justify-center w-full text-white'>
                        CHAT BOX
                    </div>
                </div>
                <div className='bg-green-100'>
                    <div className='flex'>
                        <Button type='primary' className='w-full font-semibold text-xs'>CHATS</Button>
                        <Button className='w-full font-semibold text-xs text-zinc-500'>MEMBERS</Button>
                    </div>
                </div>
                <div ref={containerRef} className='bg-[#F5F5F5] p-2 w-full h-full overflow-auto scrollbar-custom-style'>
                    <div className='flex'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='text-xs font-bold text-zinc-500'>
                                TechManTejas <span><CrownOutlined className='text-yellow-500' /></span>
                            </div>
                            <div className='max-w-[225px]'>
                                Hi my name is Tejas Vaij I am a developer of this website
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='max-w-[225px]'>
                                Hi wassup
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='text-xs font-bold text-zinc-500'>
                                TechManTejas <span><CrownOutlined className='text-yellow-500' /></span>
                            </div>
                            <div className='max-w-[225px]'>
                                Hi my name is Tejas Vaij I am a developer of this website
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='max-w-[225px]'>
                                Hi wassup
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='text-xs font-bold text-zinc-500'>
                                TechManTejas <span><CrownOutlined className='text-yellow-500' /></span>
                            </div>
                            <div className='max-w-[225px]'>
                                Hi my name is Tejas Vaij I am a developer of this website
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='max-w-[225px]'>
                                Hi wassup
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='text-xs font-bold text-zinc-500'>
                                TechManTejas <span><CrownOutlined className='text-yellow-500' /></span>
                            </div>
                            <div className='max-w-[225px]'>
                                Hi my name is Tejas Vaij I am a developer of this website
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='max-w-[225px]'>
                                Hi wassup
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='text-xs font-bold text-zinc-500'>
                                TechManTejas <span><CrownOutlined className='text-yellow-500' /></span>
                            </div>
                            <div className='max-w-[225px]'>
                                Hi my name is Tejas Vaij I am a developer of this website
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>Teams
                        <div className='m-1 p-2 bg-white rounded '>
                            <div className='max-w-[225px]'>
                                Hi wassup
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export const Dashboard = () => {
    const [isChatVisible, setChatVisible] = useState(false);

    console.log(isChatVisible)

    const openChat = () => {
        setChatVisible(true);
    };

    const closeChat = () => {
        setChatVisible(false);
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
                        <Route path="/tournaments/add-edit" element={<TournamentAddEdit />} />
                        <Route path="/tournaments/manage/*" element={<TournamentManage />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/players" element={<Players />} />
                        <Route path="/players/add-edit" element={<PlayerAddEdit />} />
                        {/* <Route path="/teams" element={<Teams />} /> */}
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
                <FloatButton type='primary' badge={{ count: 123, overflowCount: 99 }} onClick={openChat} icon={<MessageOutlined />} />
                {/* <FloatButton onClick={handleLogout} icon={<PoweroffOutlined/>}/> */}
            </FloatButton.Group>
        </Layout>
    );
};

