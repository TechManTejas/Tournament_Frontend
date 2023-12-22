/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { getUserDataFromStorage } from '../utils/storage';


// Create the context
const MyContext = createContext<any | undefined>(undefined);

// Create a provider component
export const MyContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const storage_data = getUserDataFromStorage();
    const token = storage_data?.token
    const user = storage_data?.user
    
    const [userAuthenticated, setUserAuthenticated] = useState<boolean>(!!token ?? false)
    const [userVerified, setUserVerified] = useState<boolean>(user?.verified ?? false)

    const contextValue: any = {
        userAuthenticated,
        setUserAuthenticated,
        userVerified,
        setUserVerified
    };

    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
};

// Create a custom hook to use the context
export const Context = (): any => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error('useMyContext must be used within a MyContextProvider');
    }
    return context;
};