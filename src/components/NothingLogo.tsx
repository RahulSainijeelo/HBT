import { View, Image } from 'react-native';
import { useTheme } from '../theme';

export const NothingLogo = ({ size = 60 }: { size?: number }) => {
    const { theme } = useTheme();

    return (
        <View style={{
            width: size,
            height: size,
            borderRadius: size / 4, // Slightly rounded corners for a modern look
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Image
                source={require('../assets/logo.png')}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                resizeMode="contain"
            />
        </View>
    );
};
