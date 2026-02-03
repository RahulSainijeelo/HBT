import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { Plus, CheckSquare, RotateCcw, X } from 'lucide-react-native';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';

const { width, height } = Dimensions.get('window');

export const WidgetAddScreen = ({ navigation }: any) => {
    const { theme } = useTheme();

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });
        return () => backHandler.remove();
    }, [navigation]);

    const handleAddHabit = () => {
        navigation.replace('Main', { screen: 'Habits', params: { openAdd: true } });
    };

    const handleAddTask = () => {
        navigation.replace('Main', { screen: 'Tasks', params: { openAdd: true } });
    };

    const handleClose = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={handleClose}
            />

            <View style={[styles.bottomSheet, { backgroundColor: theme.colors.surface1 }]}>
                <View style={styles.handle} />

                <View style={styles.header}>
                    <NothingText variant="bold" size={20}>Add New</NothingText>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <X size={22} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.options}>
                    <TouchableOpacity
                        style={[styles.option, { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border }]}
                        onPress={handleAddTask}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                            <CheckSquare size={28} color={theme.colors.primary} />
                        </View>
                        <NothingText variant="bold" size={16} style={{ marginTop: 12 }}>Task</NothingText>
                        <NothingText color={theme.colors.textSecondary} size={11}>To-do item</NothingText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.option, { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border }]}
                        onPress={handleAddHabit}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E91E63' + '20' }]}>
                            <RotateCcw size={28} color="#E91E63" />
                        </View>
                        <NothingText variant="bold" size={16} style={{ marginTop: 12 }}>Habit</NothingText>
                        <NothingText color={theme.colors.textSecondary} size={11}>Recurring</NothingText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#333',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeBtn: {
        padding: 4,
    },
    options: {
        flexDirection: 'row',
        gap: 12,
    },
    option: {
        flex: 1,
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
