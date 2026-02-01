import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { useAppStore } from '../store/useAppStore';
import { Circle } from 'lucide-react-native';
import { DashboardScreenStyles as styles } from '../styles/DashboardScreen.styles';

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
