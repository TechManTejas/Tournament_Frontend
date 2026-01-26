import { IUser } from "../types/user.types";

export const storageKey = 'tournament-user-data';
export const storagePreferencesKey = 'tournament-preferences';
export const storageCacheKey = 'tournament-cache';

export interface UserData {
    user: IUser;
    token: string;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    emailNotifications: boolean;
    timezone: string;
}

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

export const saveUserDataToStorage = (user_data: UserData): void => {
    try {
        const storage = localStorage;
        storage.setItem(storageKey, JSON.stringify(user_data));
    } catch (error) {
        console.error('Error saving user data to storage:', error);
        throw new Error('Failed to save user data');
    }
};

export const getUserDataFromStorage = (): UserData | null => {
    const storage_data = localStorage.getItem(storageKey);

    if (storage_data) {
        try {
            const parsed = JSON.parse(storage_data);
            // Validate the structure
            if (parsed && typeof parsed === 'object' && parsed.user && parsed.token) {
                return parsed as UserData;
            }
            console.warn('Invalid user data structure in storage');
            return null;
        } catch (error) {
            console.error('Error parsing stored credentials:', error);
            // Clear corrupted data
            clearUserDataFromStorage();
        }
    }

    return null;
};

export const clearUserDataFromStorage = (): void => {
    try {
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.error('Error clearing user data from storage:', error);
    }
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
    try {
        localStorage.setItem(storagePreferencesKey, JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving user preferences:', error);
        throw new Error('Failed to save preferences');
    }
};

export const getUserPreferences = (): UserPreferences | null => {
    try {
        const stored = localStorage.getItem(storagePreferencesKey);
        if (stored) {
            return JSON.parse(stored) as UserPreferences;
        }
    } catch (error) {
        console.error('Error retrieving user preferences:', error);
    }
    return null;
};

export const getDefaultPreferences = (): UserPreferences => {
    return {
        theme: 'auto',
        language: 'en',
        notifications: true,
        emailNotifications: false,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
};

export const clearUserPreferences = (): void => {
    try {
        localStorage.removeItem(storagePreferencesKey);
    } catch (error) {
        console.error('Error clearing user preferences:', error);
    }
};

export const saveToCache = <T>(key: string, data: T, ttlMinutes: number = 60): void => {
    try {
        const cacheData: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + ttlMinutes * 60 * 1000,
        };
        const cache = getCacheStorage();
        cache[key] = cacheData;
        localStorage.setItem(storageCacheKey, JSON.stringify(cache));
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
};

export const getFromCache = <T>(key: string): T | null => {
    try {
        const cache = getCacheStorage();
        const entry = cache[key] as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            // Cache expired, remove it
            delete cache[key];
            localStorage.setItem(storageCacheKey, JSON.stringify(cache));
            return null;
        }

        return entry.data;
    } catch (error) {
        console.error('Error retrieving from cache:', error);
        return null;
    }
};

export const clearCache = (key?: string): void => {
    try {
        if (key) {
            const cache = getCacheStorage();
            delete cache[key];
            localStorage.setItem(storageCacheKey, JSON.stringify(cache));
        } else {
            localStorage.removeItem(storageCacheKey);
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

export const clearAllStorage = (): void => {
    try {
        clearUserDataFromStorage();
        clearUserPreferences();
        clearCache();
    } catch (error) {
        console.error('Error clearing all storage:', error);
    }
};

const getCacheStorage = (): Record<string, CacheEntry<unknown>> => {
    try {
        const stored = localStorage.getItem(storageCacheKey);
        if (stored) {
            return JSON.parse(stored) as Record<string, CacheEntry<unknown>>;
        }
    } catch (error) {
        console.error('Error retrieving cache storage:', error);
    }
    return {};
};

export const isStorageAvailable = (): boolean => {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};

export const getStorageSize = (): number => {
    try {
        let total = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    } catch (error) {
        console.error('Error calculating storage size:', error);
        return 0;
    }
};
