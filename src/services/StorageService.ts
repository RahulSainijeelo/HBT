import RNFS from 'react-native-fs';

const APP_FOLDER_NAME = 'HBT_Data';
const BASE_PATH = `${RNFS.DocumentDirectoryPath}/${APP_FOLDER_NAME}`;

export interface UserProfile {
    id: string;
    name: string;
}

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

    // Scans all JSON files and returns basic identity info
    static async getProfiles(): Promise<UserProfile[]> {
        const ready = await this.init();
        if (!ready) return [];
        try {
            const files = await RNFS.readDir(BASE_PATH);
            const jsonFiles = files.filter(f => f.isFile() && f.name.endsWith('.json') && f.name !== 'system_settings.json');

            const profiles: UserProfile[] = [];

            for (const file of jsonFiles) {
                try {
                    const content = await RNFS.readFile(file.path, 'utf8');
                    const data = JSON.parse(content);

                    if (data.id && data.name) {
                        profiles.push({ id: data.id, name: data.name });
                    } else {
                        // Migration/Legacy fallback: use filename as ID and Name
                        const legacyName = file.name.replace('.json', '');
                        profiles.push({ id: legacyName, name: legacyName });
                    }
                } catch (readErr) {
                    console.warn(`Failed to read/parse profile ${file.name}`, readErr);
                }
            }
            return profiles;
        } catch (e) {
            console.error('Failed to read profiles directory:', e);
            return [];
        }
    }

    // Backward compatibility for LoginScreen until fully refactored
    static async getUserFiles() {
        const profiles = await this.getProfiles();
        return profiles.map(p => p.name);
    }

    static async saveUserData(userId: string, data: any) {
        await this.init();
        const filePath = `${BASE_PATH}/${userId}.json`;
        await RNFS.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    // Load full data by ID
    static async loadUserData(userId: string) {
        // Fallback for legacy filenames that might not match an ID structure yet
        let filePath = `${BASE_PATH}/${userId}.json`;

        let exists = await RNFS.exists(filePath);
        if (!exists) {
            // Try treating logic: maybe userId IS the filename (legacy)
        }

        if (exists) {
            const content = await RNFS.readFile(filePath, 'utf8');
            return JSON.parse(content);
        }
        return null;
    }

    static async exportProfile(userId: string) {
        const sourcePath = `${BASE_PATH}/${userId}.json`;
        return sourcePath;
    }

    static async importProfile(sourceUri: string) {
        await this.init();
        try {
            const content = await RNFS.readFile(sourceUri, 'utf8');
            const data = JSON.parse(content);

            // Validate basic structure
            if (!data.id || !data.name) {
                throw new Error("Invalid profile format: missing id or name");
            }

            const fileName = `${data.id}.json`;
            const destPath = `${BASE_PATH}/${fileName}`;
            await RNFS.writeFile(destPath, content, 'utf8');

            return { id: data.id, name: data.name };
        } catch (e) {
            console.error('Import failed', e);
            throw e;
        }
    }
}
