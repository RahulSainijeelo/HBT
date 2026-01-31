import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingButton } from '../components/NothingButton';
import { useAppStore, Habit } from '../store/useAppStore';
import { ArrowLeft, Play, Pause, RotateCcw, Flame, Trophy, Settings, Trash2, Check } from 'lucide-react-native';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

export const HabitDetailScreen = ({ route, navigation }: any) => {
    const { habitId } = route.params;
    const { theme } = useTheme();
    const { habits, updateHabit, deleteHabit, toggleHabit } = useAppStore();
    const habit = habits.find(h => h.id === habitId);

    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(habit?.timerGoal || 0);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        if (habit?.type === 'timer' && !isTimerRunning) {
            setTimeLeft(habit.timerGoal || 0);
        }
    }, [habit?.timerGoal]);

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Auto complete for today if timer finishes
            const today = dayjs().format('YYYY-MM-DD');
            if (!habit?.completedDates.includes(today)) {
                toggleHabit(habitId, today);
            }
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning, timeLeft]);

    if (!habit) return null;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const progress = habit.type === 'timer' ? (timeLeft / (habit.timerGoal || 1)) : 0;

    const today = dayjs().format('YYYY-MM-DD');
    const isCompletedToday = habit.completedDates.includes(today);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={theme.colors.text} size={24} />
                </TouchableOpacity>
                <NothingText variant="bold" size={20}>{habit.title.toUpperCase()}</NothingText>
                <TouchableOpacity onPress={() => {/* Show Settings Modal */ }}>
                    <Settings color={theme.colors.text} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Stats Summary */}
                <View style={styles.statsRow}>
                    <NothingCard style={styles.statCard}>
                        <Flame size={20} color={theme.colors.primary} />
                        <NothingText variant="bold" size={24} style={styles.statVal}>{habit.streak}</NothingText>
                        <NothingText size={10} color={theme.colors.textSecondary}>CURRENT STREAK</NothingText>
                    </NothingCard>

                    <NothingCard style={styles.statCard}>
                        <Trophy size={20} color="#FFD700" />
                        <NothingText variant="bold" size={24} style={styles.statVal}>{habit.bestStreak}</NothingText>
                        <NothingText size={10} color={theme.colors.textSecondary}>BEST STREAK</NothingText>
                    </NothingCard>
                </View>

                {/* Main Interaction Area */}
                <View style={styles.mainArea}>
                    {habit.type === 'timer' ? (
                        <View style={styles.timerContainer}>
                            <View style={[styles.circleOutline, { borderColor: theme.colors.surface2 }]}>
                                {/* Progress Indicator (Simple version for now) */}
                                <View style={[styles.progressOverlay, {
                                    height: CIRCLE_SIZE * (1 - progress),
                                    backgroundColor: theme.colors.background,
                                    opacity: 0.5
                                }]} />
                                <NothingText variant="dot" size={64}>{formatTime(timeLeft)}</NothingText>
                            </View>

                            <View style={styles.timerControls}>
                                <TouchableOpacity
                                    style={[styles.controlBtn, { backgroundColor: theme.colors.surface1 }]}
                                    onPress={() => {
                                        setIsTimerRunning(false);
                                        setTimeLeft(habit.timerGoal || 0);
                                    }}
                                >
                                    <RotateCcw size={24} color={theme.colors.text} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.playBtn, { backgroundColor: theme.colors.primary }]}
                                    onPress={() => setIsTimerRunning(!isTimerRunning)}
                                >
                                    {isTimerRunning ?
                                        <Pause size={32} color={theme.colors.background} fill={theme.colors.background} /> :
                                        <Play size={32} color={theme.colors.background} fill={theme.colors.background} />
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.controlBtn, { backgroundColor: theme.colors.surface1 }]}
                                    onPress={() => {
                                        setIsTimerRunning(false);
                                        setTimeLeft(0); // Manual complete
                                    }}
                                >
                                    <Check size={24} color={theme.colors.success} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.checkContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.largeCheckBtn,
                                    { borderColor: theme.colors.border },
                                    isCompletedToday && { backgroundColor: theme.colors.text, borderColor: theme.colors.text }
                                ]}
                                onPress={() => toggleHabit(habitId, today)}
                            >
                                <Check size={80} color={isCompletedToday ? theme.colors.background : theme.colors.surface2} strokeWidth={3} />
                            </TouchableOpacity>
                            <NothingText variant="bold" size={18} style={{ marginTop: 24 }}>
                                {isCompletedToday ? 'COMPLETED FOR TODAY' : 'MARK AS DONE'}
                            </NothingText>
                        </View>
                    )}
                </View>

                {/* History / Heatmap Placeholder */}
                <NothingText variant="bold" size={14} style={styles.sectionTitle}>HISTORY</NothingText>
                <NothingCard style={styles.historyCard}>
                    <View style={styles.heatmap}>
                        {/* 5x7 grid of dots for last 35 days */}
                        {Array.from({ length: 35 }).map((_, i) => {
                            const date = dayjs().subtract(34 - i, 'day').format('YYYY-MM-DD');
                            const active = habit.completedDates.includes(date);
                            return (
                                <View
                                    key={i}
                                    style={[
                                        styles.heatDot,
                                        { backgroundColor: active ? theme.colors.text : theme.colors.surface2 }
                                    ]}
                                />
                            );
                        })}
                    </View>
                </NothingCard>

                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => {
                        deleteHabit(habitId);
                        navigation.goBack();
                    }}
                >
                    <Trash2 size={20} color={theme.colors.error} />
                    <NothingText color={theme.colors.error} style={{ marginLeft: 8 }}>Delete Habit</NothingText>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        padding: 8,
    },
    scrollContent: {
        padding: 24,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    statVal: {
        marginVertical: 4,
    },
    mainArea: {
        alignItems: 'center',
        marginVertical: 40,
    },
    timerContainer: {
        alignItems: 'center',
        width: '100%',
    },
    circleOutline: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    progressOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    timerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginTop: 40,
    },
    playBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    controlBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkContainer: {
        alignItems: 'center',
    },
    largeCheckBtn: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        letterSpacing: 2,
        marginBottom: 12,
        marginTop: 20,
    },
    historyCard: {
        padding: 16,
    },
    heatmap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    heatDot: {
        width: 14,
        height: 14,
        borderRadius: 2,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 48,
        paddingVertical: 16,
        opacity: 0.6,
    }
});
