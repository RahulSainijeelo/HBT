import React, { useState, useEffect } from 'react';
import { useTheme } from "../theme";
import { View, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Clock } from 'lucide-react-native';
import { NothingLogo } from './NothingLogo';
import { NothingText } from './NothingText';
import { styles } from '../navigation/AppNavigator';
import { useAppStore } from '../store/useAppStore';
import dayjs from 'dayjs';

export const GlobalHeader = ({ navigation }: any) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { activeProfile } = useAppStore();
    const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'));

    const fullText = "Rise";
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs().format('HH:mm:ss'));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let timeout: any;

        const animateText = () => {
            if (!isDeleting) {
                if (displayText.length < fullText.length) {
                    setDisplayText(fullText.substring(0, displayText.length + 1));
                    timeout = setTimeout(animateText, 200); // Writing speed
                } else {
                    timeout = setTimeout(() => setIsDeleting(true), 1500); // Wait before delete
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
                borderBottomWidth: 0.5,
                borderBottomColor: theme.colors.border,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }
        ]}>
            {/* Left Section: Branding */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    backgroundColor: theme.colors.surface1
                }}>
                    <NothingLogo size={20} />
                    <NothingText
                        style={{
                            marginLeft: 6,
                            color: '#FF3B30', // Vibrant Red
                            fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'ndot',
                            fontSize: 18,
                            fontWeight: '600',
                        }}
                    >
                        {displayText}
                    </NothingText>
                </View>
            </View>
            {/* Right Section: User & Profile */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                <View style={{ alignItems: 'flex-end' }}>
                    <NothingText variant="bold" size={12}>{activeProfile?.name?.toUpperCase() || 'USER'}</NothingText>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View style={[styles.profileBtn, {
                        backgroundColor: theme.colors.surface1,
                        borderColor: theme.colors.border,
                        width: 32,
                        height: 32,
                        borderRadius: 16
                    }]}>
                        <User size={16} color={theme.colors.text} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};
