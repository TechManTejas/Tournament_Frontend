import { Layout } from 'antd';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Club } from './Club';
import { Tournaments } from './Tournaments';
import { Matches } from './Matches';
import { Players } from './Players';
import { Teams } from './Teams';
import { Referees } from './Referees';
import Stadiums  from './Stadiums';
import StadiumAddEdit  from './StadiumAddEdit';
import Media from './Media';
import MediaAddEdit from './MediaAddEdit';
import Users from './Users';
import UserAddEdit from './UserAddEdit';
import { Sidebar } from '../components/Sidebar';

const { Content } = Layout;

export const Dashboard = () => {

    return (
        <Layout style={{ minHeight: '100vh' }} className='bg-white'>
            <Sidebar/>
            <Layout>
                <Content className='bg-[#F5F5F5] p-4'>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard/club" />} />
                        <Route path="/club" element={<Club/>} />
                        <Route path="/tournaments" element={<Tournaments/>} />
                        <Route path="/matches" element={<Matches/>} />
                        <Route path="/players" element={<Players/>} />
                        <Route path="/teams" element={<Teams/>} />
                        <Route path="/referees" element={<Referees/>} />
                        <Route path="/stadiums" element={<Stadiums/>} />
                        <Route path="/stadiums/add-edit" element={<StadiumAddEdit/>} />
                        <Route path="/media" element={<Media/>} />
                        <Route path="/media/add-edit" element={<MediaAddEdit/>} />
                        <Route path="/users" element={<Users/>} />
                        <Route path="/users/add-edit" element={<UserAddEdit/>} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

