import React from 'react';
import { useParams } from 'react-router-dom';

const LiveTV: React.FC = () => {
    
    const { id } = useParams<{ id: string }>();
    const matchId = id ? parseInt(id, 10) : 0;

    return (
        <div className='p-4 bg-blue-500'>
            <div className='flex justify-between text-5xl font-bold'>
                <div className='flex w-full justify-center items-center bg-slate-100'>
                    Team A
                </div>
                <div className='w-44 h-32 bg-black text-white flex flex-shrink-0 justify-center items-center'>
                    0 : 0
                </div>
                <div className='flex w-full justify-center items-center bg-slate-100'>
                    Team B
                </div>
            </div>
            <div>
                <div className='text-center text-3xl text-white'>
                    Nächste Spiele
                </div>
                <div className='text-3xl text-white'>
                    <div className='flex justify-center w-full gap-4 text-5xl'>
                        <div className='flex justify-end w-full'>
                            Team C
                        </div>
                        <div>
                            -
                        </div>
                        <div className='flex justify-start w-full'>
                            Team D
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTV;
