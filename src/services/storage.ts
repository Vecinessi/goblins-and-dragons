export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage`, error);
            return defaultValue;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage`, error);
        }
    },

    remove: (key: string): void => {
        localStorage.removeItem(key);
    }
};

export const STORAGE_KEYS = {
    USER: 'gnd_user',
    CAMPAIGNS: 'gnd_campaigns'
};
