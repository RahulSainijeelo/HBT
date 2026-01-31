import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const APP_FOLDER_NAME = 'HBT_Data';
const SETTINGS_FILE = 'system_settings.json';
const BASE_PATH = Platform.OS === 'android'
    ? `${RNFS.DownloadDirectoryPath}/${APP_FOLDER_NAME}`
    : `${RNFS.DocumentDirectoryPath}/${APP_FOLDER_NAME}`;

export interface AppSettings {
    defaultProfile?: string;
    themeMode?: 'system' | 'light' | 'dark';
}

export class SettingsService {
    static async init() {
        if (!RNFS || !RNFS.exists) return false;
        try {
            const exists = await RNFS.exists(BASE_PATH);
            if (!exists) {
                await RNFS.mkdir(BASE_PATH);
            }
            return true;
        } catch (e) {
            console.warn('Failed to init settings:', e);
            return false;
        }
    }

    static async getSettings(): Promise<AppSettings> {
        if (!await this.init()) return {};
        const filePath = `${BASE_PATH}/${SETTINGS_FILE}`;
        try {
            if (await RNFS.exists(filePath)) {
                const content = await RNFS.readFile(filePath, 'utf8');
                return JSON.parse(content);
            }
        } catch (e) {
            console.warn('Failed to read settings:', e);
        }
        return {};
    }

    static async updateSettings(newSettings: Partial<AppSettings>) {
        if (!await this.init()) return;
        const current = await this.getSettings();
        const updated = { ...current, ...newSettings };
        const filePath = `${BASE_PATH}/${SETTINGS_FILE}`;
        try {
            await RNFS.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf8');
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }
}
