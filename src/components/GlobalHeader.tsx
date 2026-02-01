import React, { useState, useEffect } from 'react';
import { useTheme } from "../theme";
import { View, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';
import { NothingLogo } from './NothingLogo';
import { NothingText } from './NothingText';
import { styles } from '../navigation/AppNavigator';

export const GlobalHeader = ({ navigation }: any) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const fullText = "RISE";
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const animateText = () => {
            if (!isDeleting) {
                if (displayText.length < fullText.length) {
                    setDisplayText(fullText.substring(0, displayText.length + 1));
                    timeout = setTimeout(animateText, 200); // Writing speed
                } else {
                    timeout = setTimeout(() => setIsDeleting(true), 400); // Wait before delete
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(fullText.substring(0, displayText.length - 1));
                    timeout = setTimeout(animateText, 100); // Deleting speed
                } else {
                    setIsDeleting(false);
                    timeout = setTimeout(animateText, 500); // Wait before rewrite
                }
            }
        };

        timeout = setTimeout(animateText, 100);
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting]);

    return (
        <View style={[
            styles.header,
            {
                backgroundColor: theme.colors.background,
                paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 5),
                paddingBottom: 10,
                // borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }
        ]}>
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 12, padding: 5 }}>
                    <NothingLogo size={26} />
                    <NothingText
                        style={{
                            marginLeft: 7,
                            color: '#FF3B30', // Vibrant Red
                            fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'ndot',
                            fontSize: 30,
                            fontWeight: '600',
                            position: 'absolute',
                            bottom: 0,
                            left: 36
                        }}
                    >
                        {displayText}
                    </NothingText>
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <View style={[styles.profileBtn, { backgroundColor: theme.colors.surface1, borderColor: theme.colors.border }]}>
                    <User size={18} color={theme.colors.text} />
                </View>
            </TouchableOpacity>
        </View>
    );
};
