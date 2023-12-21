import { IUser } from "../types/user.types";

export const storageKey = 'user_data';

export interface UserData {
    user: IUser;
    token: string;
}

export const saveCredentialsToStorage = (user_data: UserData) => {
    const storage = localStorage
    storage.setItem(storageKey, JSON.stringify(user_data));
};

export const getCredentialsFromStorage = (): UserData | null => {
    const storage_data = localStorage.getItem(storageKey);

    if (storage_data) {
        try {
            return JSON.parse(storage_data);
        } catch (error) {
            console.error('Error parsing stored credentials:', error);
        }
    }

    return null;
};

export const clearCredentialsFromStorage = () => {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
};
