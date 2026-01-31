import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const APP_FOLDER_NAME = 'HBT_Data';
const BASE_PATH = Platform.OS === 'android'
    ? `${RNFS.DownloadDirectoryPath}/${APP_FOLDER_NAME}`
    : `${RNFS.DocumentDirectoryPath}/${APP_FOLDER_NAME}`;

export class StorageService {
    static async init() {
        const exists = await RNFS.exists(BASE_PATH);
        if (!exists) {
            await RNFS.mkdir(BASE_PATH);
        }
    }

    static async getUserFiles() {
        await this.init();
        const files = await RNFS.readDir(BASE_PATH);
        return files
            .filter(f => f.isFile() && f.name.endsWith('.json'))
            .map(f => f.name.replace('.json', ''));
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

    static async importProfile(sourcePath: string) {
        const fileName = sourcePath.split('/').pop() || 'imported_user.json';
        const destPath = `${BASE_PATH}/${fileName}`;
        await RNFS.copyFile(sourcePath, destPath);
        return fileName.replace('.json', '');
    }
}
