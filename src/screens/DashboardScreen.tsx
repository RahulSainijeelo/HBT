import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, Circle } from 'lucide-react-native';

export const DashboardScreen = () => {
    const { tasks, habits } = useAppStore();

    const todayTasks = tasks.filter(t => !t.completed).slice(0, 3);
    const activeHabits = habits.slice(0, 3);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <NothingText variant="dot" size={32}>BOARD</NothingText>
                    <NothingText color={theme.colors.textSecondary}>Daily Overview</NothingText>
                </View>

                <NothingText variant="bold" size={20} style={styles.sectionTitle}>High Priority Tasks</NothingText>
                {todayTasks.length > 0 ? (
                    todayTasks.map((task) => (
                        <NothingCard key={task.id} margin="sm" style={styles.itemCard}>
                            <View style={styles.row}>
                                <Circle size={20} color={theme.colors.textSecondary} />
                                <NothingText style={styles.itemText}>{task.title}</NothingText>
                            </View>
                        </NothingCard>
                    ))
                ) : (
                    <NothingCard margin="sm" bordered={false} backgroundColor="transparent">
                        <NothingText color={theme.colors.textSecondary}>No urgent tasks. Relax.</NothingText>
                    </NothingCard>
                )}

                <NothingText variant="bold" size={20} style={styles.sectionTitle}>Daily Habits</NothingText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.habitsRow}>
                    {activeHabits.map((habit) => (
                        <NothingCard key={habit.id} style={styles.habitWidget}>
                            <NothingText variant="bold" size={18}>{habit.title}</NothingText>
                            <NothingText size={24} style={styles.streakText}>{habit.streak}d</NothingText>
                            <NothingText size={12} color={theme.colors.textSecondary}>Streak</NothingText>
                        </NothingCard>
                    ))}
                    {activeHabits.length === 0 && (
                        <NothingText color={theme.colors.textSecondary} style={{ marginLeft: 16 }}>Start a habit to see streaks here.</NothingText>
                    )}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        marginTop: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        marginTop: 24,
        marginBottom: 16,
        marginLeft: 4,
    },
    itemCard: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        marginLeft: 12,
    },
    habitsRow: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    habitWidget: {
        width: 140,
        height: 140,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    streakText: {
        marginTop: 12,
        marginBottom: 4,
    }
});
