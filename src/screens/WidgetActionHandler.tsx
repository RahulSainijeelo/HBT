import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../theme';
import dayjs from 'dayjs';

// This screen handles widget deep link actions
export const WidgetActionHandler = ({ route }: any) => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const { toggleTask, toggleHabit } = useAppStore();

    const params = route.params || {};
    const { itemId, itemType, action } = params;

    useEffect(() => {
        const handleAction = async () => {
            // Get action from path or determine from itemType
            const resolvedAction = action || route.path?.split('/')[0] || (itemType === 'habit' ? 'habit-detail' : 'toggle');

            console.log('WidgetActionHandler:', { itemId, itemType, resolvedAction });

            if (resolvedAction === 'toggle' && itemId) {
                // Toggle task completion
                if (itemType === 'task') {
                    toggleTask(itemId);
                } else if (itemType === 'habit') {
                    const today = dayjs().format('YYYY-MM-DD');
                    toggleHabit(itemId, today);
                }
                // Go back or to main
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    navigation.replace('Main');
                }
            } else if (resolvedAction === 'habit-detail' && itemId) {
                // Navigate to habit detail screen
                navigation.replace('HabitDetail', { habitId: itemId });
            } else {
                // Fallback to main
                navigation.replace('Main');
            }
        };

        handleAction();
    }, [itemId, itemType, action]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
