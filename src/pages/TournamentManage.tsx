/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row, Tabs } from 'antd';
import Meta from 'antd/es/card/Meta';
import TabPane from 'antd/es/tabs/TabPane';
import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ManageTournament: React.FC = () => {
    const { state } = useLocation();
    const tabPaneRef = useRef<HTMLDivElement | null>(null);

    console.log(state)

    const tournament = state?.tournament;

    if (!tournament) {
        // Handle the case where no tournament is passed in state
        return <div>No tournament data available</div>;
    }
    const data = [
        { id: 1, logo: 'logo1.png', text: 'Card 1' },
        { id: 2, logo: 'logo2.png', text: 'Card 2' },
        // Add more data as needed
    ];

    const handleDragStart = (e: React.DragEvent, item: any) => {
        const target = e.currentTarget as HTMLDivElement;
        // Set opacity to 0 to make the card not visible during drag
        target.style.opacity = '0.5';

        console.log(item)
    };

    const handleDragEnterTabPane = (e: React.DragEvent) => {
        console.log(e)
        // Add styles or perform actions when the drag enters the TabPane
        if (tabPaneRef.current) {
            tabPaneRef.current.style.border = '2px solid green';
        }
    };

    const handleDragLeaveTabPane = () => {
        // Remove styles or perform actions when the drag leaves the TabPane
        if (tabPaneRef.current) {
            tabPaneRef.current.style.border = 'none';
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.currentTarget as HTMLDivElement;
        // Reset opacity to 1 when drag ends
        target.style.opacity = '1';

        // Reset styles or perform additional actions when the drag ends
        if (tabPaneRef.current) {
            tabPaneRef.current.style.border = 'none';
        }

        // Get the id from the data transfer object
        const id = e.dataTransfer.getData('text/plain');
        console.log("Dragged Card ID:", id);
    };
    return (
        <div className='flex flex-col gap-4 h-full'>
            <div className='border border-green-500 rounded-lg flex gap-2 bg-white'>
                <div>
                    <img src={tournament.logo} alt={`${tournament.name} Logo`} width="160px" className='object-cover border shadow-lg rounded-lg' />
                </div>
                <div className='flex justify-between w-full'>
                    <div className='p-2'>
                        <div className='text-3xl font-semibold'>{tournament.name} <span className='text-base font-normal'>({tournament.alias})</span></div>
                        <div></div>
                        <div><strong>Start Time:</strong> {tournament.start_time}</div>
                        <div><strong>Start Date:</strong> {tournament.start_date}</div>
                    </div>
                    <div className='p-2'>
                        <div><strong>Status:</strong> {tournament.status}</div>
                        <div><strong>Game Mode:</strong> {tournament.game_mode?.name}</div>
                    </div>
                    <div className='p-2 flex flex-col jus'>
                        <div><strong>Playing Time:</strong> {tournament.playing_time} minutes</div>
                        <div><strong>Pause Between Games:</strong> {tournament.pause_between_games} minutes</div>
                        <div><strong>Points for Winner:</strong> {tournament.points_winner}</div>
                        <div><strong>Points for Draw:</strong> {tournament.points_draw}</div>
                        <div><strong>Points for Defeat:</strong> {tournament.points_defeat}</div>
                        <div><strong>Timer:</strong> {tournament.timer}</div>
                    </div>
                </div>
            </div>
            <div className='flex gap-4  h-full'>
                <div className='bg-white rounded-lg flex-grow p-2'>
                    <Tabs defaultActiveKey="overview" type="card">
                        <TabPane
                            tab="Teams"
                            key="teams"
                        >
                            <div
                                ref={tabPaneRef}
                                className='w-full h-full bg-red-100'
                                onDragEnter={handleDragEnterTabPane}
                                onDragLeave={handleDragLeaveTabPane}
                            >
                                Matches content goes here.
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div className='bg-white border border-green-500 rounded-lg p-2'>
                    {/* Search Component */}
                    <Input
                        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder='Search...'
                        className='mb-2'
                    />

                    {/* Card Grid */}
                    <Row gutter={[16, 16]}>
                        {data.map((item) => (
                            <Col key={item.id} span={8}>
                                <Card
                                    hoverable
                                    draggable
                                    onDragStart={(e) => {
                                        handleDragStart(e, item)
                                    }}
                                    onDragEnd={(e) => {
                                        handleDragEnd(e)
                                    }}
                                    cover={<img alt={item.text} src={item.logo} />}
                                >
                                    <Meta title={item.text} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default ManageTournament;
