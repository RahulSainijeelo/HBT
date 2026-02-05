import { PermissionsAndroid, Platform } from 'react-native';

export const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    // Android 10+ (API 29+) uses scoped storage, doesn't need WRITE_EXTERNAL_STORAGE for Downloads
    const sdkVersion = Platform.Version;
    if (typeof sdkVersion === 'number' && sdkVersion >= 29) {
        // No permission needed for Downloads folder on Android 10+
        return true;
    }

    // For Android 9 and below
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        return (
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        );
    } catch (err) {
        console.warn(err);
        return false;
    }
};
