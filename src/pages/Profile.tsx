import React from 'react'
import { clearUserDataFromStorage, getUserDataFromStorage } from '../utils/storage'
import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

export const Profile = () => {

    const handleLogout = () => {
        clearUserDataFromStorage()
        window.location.href = '/'
    };


    const user = getUserDataFromStorage()?.user

    return (
        <>
            <div className='flex flex-col gap-4'>
                <div className='text-3xl'>
                    {user?.username}
                </div>
                <div className='text-3xl'>
                    {user?.first_name} {user?.last_name}
                </div>
                <div className='text-3xl'>
                    {user?.email}
                </div>
                <div className='text-3xl font-semibold'>
                    {user?.role}
                </div>
                <div>
                    <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </>
    )
}
