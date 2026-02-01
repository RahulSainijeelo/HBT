import { useTheme } from "../theme";
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { User } from 'lucide-react-native';
import { NothingLogo } from './NothingLogo';
import { styles } from '../navigation/AppNavigator'
export const GlobalHeader = ({ navigation }: any) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.header, { backgroundColor: theme.colors.background, paddingTop: Platform.OS === 'ios' ? 50 : 20 }]}>
            <NothingLogo size={36} />
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <View style={[styles.profileBtn, { backgroundColor: theme.colors.surface1, borderColor: theme.colors.border }]}>
                    <User size={18} color={theme.colors.text} />
                </View>
            </TouchableOpacity>
        </View>
    );
};
