import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const APP_FOLDER_NAME = 'HBT_Data';
const BASE_PATH = `${RNFS.DocumentDirectoryPath}/${APP_FOLDER_NAME}`;

export class StorageService {
    static async init() {
        if (!RNFS || !RNFS.exists) {
            console.warn('RNFS native module is not ready. Storage will be disabled.');
            return false;
        }
        try {
            const exists = await RNFS.exists(BASE_PATH);
            if (!exists) {
                await RNFS.mkdir(BASE_PATH);
            }
            return true;
        } catch (e) {
            console.warn('Failed to init storage:', e);
            return false;
        }
    }

    static async getUserFiles() {
        const ready = await this.init();
        if (!ready) return [];
        try {
            const files = await RNFS.readDir(BASE_PATH);
            return files
                .filter(f => f.isFile() && f.name.endsWith('.json'))
                .map(f => f.name.replace('.json', ''));
        } catch (e) {
            console.error('Failed to read profiles:', e);
            return [];
        }
    }

    static async saveUserData(username: string, data: any) {
        await this.init();
        const filePath = `${BASE_PATH}/${username}.json`;
        await RNFS.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    static async loadUserData(username: string) {
        const filePath = `${BASE_PATH}/${username}.json`;
        const exists = await RNFS.exists(filePath);
        if (exists) {
            const content = await RNFS.readFile(filePath, 'utf8');
            return JSON.parse(content);
        }
        return null;
    }

    static async exportProfile(username: string) {
        const sourcePath = `${BASE_PATH}/${username}.json`;
        // On Android, we can just point the user to the Downloads/HBT_Data folder
        // but for "downloading" from profile, we might use a Share tool or copy to a specific location.
        return sourcePath;
    }

    static async importProfile(sourceUri: string) {
        await this.init();
        let fileName = 'imported_profile.json';

        // Simple heuristic to try and get a name, though with content:// logic it's harder
        // Ideally we would read the content and get the name from the JSON

        try {
            const content = await RNFS.readFile(sourceUri, 'utf8');
            // Try to parse to validate and get username if possible?
            // For now, let's just make sure we don't overwrite blindly or fail on existing
            const timestamp = new Date().getTime();
            fileName = `imported_${timestamp}.json`;
            const destPath = `${BASE_PATH}/${fileName}`;

            await RNFS.writeFile(destPath, content, 'utf8');
            return fileName.replace('.json', '');
        } catch (e) {
            console.error('Import failed', e);
            throw e;
        }
    }
}
