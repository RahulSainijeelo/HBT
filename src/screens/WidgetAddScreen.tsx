import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Plus, CheckSquare, RotateCcw, X } from 'lucide-react-native';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';

const { width, height } = Dimensions.get('window');

export const WidgetAddScreen = ({ navigation }: any) => {
    const { theme } = useTheme();

    const handleAddHabit = () => {
        navigation.replace('Main', { screen: 'Habits', params: { openAdd: true } });
    };

    const handleAddTask = () => {
        navigation.replace('Main', { screen: 'Tasks', params: { openAdd: true } });
    };

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => navigation.goBack()}
            />

            <NothingCard padding="xl" bordered={true} style={[styles.card, { backgroundColor: theme.colors.surface1 }]}>
                <View style={styles.header}>
                    <NothingText variant="bold" size={24} style={{ fontFamily: 'ndot' }}>ADD NEW</NothingText>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <X size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.options}>
                    <TouchableOpacity style={[styles.option, { borderColor: theme.colors.border }]} onPress={handleAddTask}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '1A' }]}>
                            <CheckSquare size={32} color={theme.colors.primary} />
                        </View>
                        <NothingText variant="bold" size={18}>TASK</NothingText>
                        <NothingText color={theme.colors.textSecondary} size={12}>TO-DO LIST</NothingText>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.option, { borderColor: theme.colors.border }]} onPress={handleAddHabit}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.error + '1A' }]}>
                            <RotateCcw size={32} color={theme.colors.error} />
                        </View>
                        <NothingText variant="bold" size={18}>HABIT</NothingText>
                        <NothingText color={theme.colors.textSecondary} size={12}>RECURRING</NothingText>
                    </TouchableOpacity>
                </View>
            </NothingCard>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: width * 0.85,
        borderRadius: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    options: {
        flexDirection: 'row',
        gap: 16,
    },
    option: {
        flex: 1,
        aspectRatio: 1,
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    }
});
