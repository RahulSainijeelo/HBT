import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Animated, Dimensions, Vibration, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Pause, RotateCcw, Flame, Trophy, Settings, Trash2, Check, X, Plus, Sparkles, Activity } from 'lucide-react-native';
import { HabitDetailScreenStyles as styles } from '../styles/Habit.styles';
import dayjs from 'dayjs';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingButton } from '../components/NothingButton';
import { NothingInput } from '../components/NothingInput';
import { useAppStore } from '../store/useAppStore';
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

import { sensorService } from '../services/SensorService';

export const HabitDetailScreen = ({ route, navigation }: any) => {
    const { habitId } = route.params;
    const { theme } = useTheme();
    const { habits, updateHabit, deleteHabit, toggleHabit } = useAppStore();
    const habit = habits.find(h => h.id === habitId);

    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(habit?.timerGoal || 0);
    const [showSettings, setShowSettings] = useState(false);
    const [editTitle, setEditTitle] = useState(habit?.title || '');
    const [editGoal, setEditGoal] = useState(((habit?.timerGoal || 0) / 60).toString());

    // Sensor State
    const [liveData, setLiveData] = useState({
        steps: 0,
        activity: 0,
        lux: 0,
        noise: 0,
        distance: 0,
        location: null as { latitude: number; longitude: number } | null
    });

    const timerRef = useRef<any>(null);
    const today = dayjs().format('YYYY-MM-DD');
    const isCompletedToday = habit?.completedDates.includes(today) || false;

    // Sensor Effect
    useEffect(() => {
        if (!habit?.isSensorBased || isCompletedToday) {
            sensorService.stopPedometer();
            sensorService.stopNoiseSensor();
            sensorService.stopLocationTracking();
            return;
        }

        let interval: any;

        if (habit.sensorType === 'pedometer' || habit.sensorType === 'movement') {
            sensorService.startPedometer((steps, activity) => {
                setLiveData(prev => ({ ...prev, steps, activity }));
            });
        } else if (habit.sensorType === 'light') {
            interval = sensorService.startLightSensor((lux) => {
                setLiveData(prev => ({ ...prev, lux }));
            });
        } else if (habit.sensorType === 'noise') {
            sensorService.startNoiseSensor((noise) => {
                setLiveData(prev => ({ ...prev, noise }));
            });
        } else if (habit.sensorType === 'gps') {
            sensorService.startLocationTracking((lat, lng, distance) => {
                setLiveData(prev => ({
                    ...prev,
                    location: { latitude: lat, longitude: lng },
                    distance
                }));
            });
        }

        return () => {
            sensorService.stopPedometer();
            sensorService.stopLightSensor(interval);
            sensorService.stopNoiseSensor();
            sensorService.stopLocationTracking();
        };
    }, [habit?.id, isCompletedToday]);

    // Sync state when habit updates or timer goal changes
    useEffect(() => {
        if (habit) {
            setEditTitle(habit.title);
            setEditGoal(((habit.timerGoal || 0) / 60).toString());
            if (habit.type === 'timer' && !isTimerRunning) {
                setTimeLeft(habit.timerGoal || 0);
            }
        }
    }, [habit?.id, habit?.timerGoal]);

    // Separate effect for store updates to avoid render-phase updates
    useEffect(() => {
        if (!habit?.isSensorBased || isCompletedToday) return;

        if (habit.sensorType === 'pedometer' || habit.sensorType === 'movement') {
            const currentStoredSteps = habit.numericProgress?.[today] || 0;
            if (liveData.steps > currentStoredSteps) {
                useAppStore.getState().updateSensorProgress(habitId, today, liveData.steps);
            }
            if (habit.type === 'check' && liveData.steps >= 50) {
                toggleHabit(habitId, today);
                Vibration.vibrate(200);
            }
        } else if (habit.sensorType === 'gps') {
            const km = liveData.distance / 1000;
            const currentStoredKm = habit.numericProgress?.[today] || 0;
            if (km > currentStoredKm) {
                useAppStore.getState().updateSensorProgress(habitId, today, km);
            }
        } else if (habit.sensorType === 'noise' && habit.type === 'timer') {
            if (liveData.noise > 0 && liveData.noise < 45) {
                const timerId = setInterval(() => {
                    const currentProgress = habit.numericProgress?.[today] || 0;
                    useAppStore.getState().updateSensorProgress(habitId, today, currentProgress + 1);
                }, 1000);
                return () => clearInterval(timerId);
            }
        }
    }, [liveData.steps, liveData.distance, liveData.noise, habit?.id, isCompletedToday]);

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsTimerRunning(false);
                        Vibration.vibrate([0, 500, 200, 500]);
                        if (habit && !habit.completedDates.includes(today)) {
                            toggleHabit(habitId, today);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning]);

    if (!habit) return null;

    const handleSaveSettings = () => {
        if (editTitle.trim()) {
            updateHabit(habitId, {
                title: editTitle,
                timerGoal: habit.type === 'timer' ? parseInt(editGoal) * 60 : undefined
            });
            setShowSettings(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const progress = habit.type === 'timer' ? (timeLeft / (habit.timerGoal || 1)) : 0;

    const SensorInsight = () => {
        if (!habit.isSensorBased) return null;

        return (
            <NothingCard margin="md" style={{ backgroundColor: theme.colors.surface1, padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <Activity size={18} color={theme.colors.primary} />
                    <NothingText variant="bold" size={14} style={{ marginLeft: 8, fontFamily: 'ndot' }}>LIVE INSIGHTS</NothingText>
                    <View style={{ flex: 1 }} />
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.success, opacity: 0.8 }} />
                </View>

                {habit.sensorType === 'pedometer' || habit.sensorType === 'movement' ? (
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <View>
                                <NothingText variant="dot" size={48}>{liveData.steps}</NothingText>
                                <NothingText size={12} color={theme.colors.textSecondary}>STEPS DETECTED</NothingText>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <NothingText variant="bold" size={14}>{liveData.activity.toFixed(1)}%</NothingText>
                                <NothingText size={10} color={theme.colors.textSecondary}>ACTIVITY LEVEL</NothingText>
                            </View>
                        </View>
                        <View style={{ height: 40, flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginTop: 12 }}>
                            {Array.from({ length: 30 }).map((_, i) => (
                                <View
                                    key={i}
                                    style={{
                                        flex: 1,
                                        backgroundColor: theme.colors.primary,
                                        height: Math.max(4, Math.random() * (liveData.activity / 2)),
                                        opacity: 0.3 + (i / 30) * 0.7
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                ) : habit.sensorType === 'light' ? (
                    <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                        <NothingText variant="dot" size={64}>{liveData.lux}</NothingText>
                        <NothingText size={12} color={theme.colors.textSecondary} style={{ marginBottom: 16 }}>LUMEN INTENSITY (LUX)</NothingText>
                        <View style={{ width: '100%', height: 2, backgroundColor: theme.colors.border }}>
                            <View style={{ width: `${Math.min(100, liveData.lux / 10)}%`, height: '100%', backgroundColor: theme.colors.primary }} />
                        </View>
                    </View>
                ) : habit.sensorType === 'noise' ? (
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <NothingText variant="dot" size={48}>{liveData.noise}dB</NothingText>
                            <View style={{ flexDirection: 'row', gap: 4 }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            width: 8,
                                            height: 20 + Math.random() * 20,
                                            backgroundColor: liveData.noise > 60 ? theme.colors.error : theme.colors.success,
                                            opacity: 0.8
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
                        <NothingText size={12} color={theme.colors.textSecondary}>AMBIENT NOISE LEVEL</NothingText>
                    </View>
                ) : habit.sensorType === 'gps' ? (
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <NothingText variant="dot" size={32}>
                                    {liveData.distance < 1000
                                        ? `${Math.floor(liveData.distance)}m`
                                        : `${Math.floor(liveData.distance / 1000)}km ${Math.floor(liveData.distance % 1000)}m`
                                    }
                                </NothingText>
                                <NothingText size={12} color={theme.colors.textSecondary} style={{ marginTop: 4 }}>TOTAL DISTANCE TRACKED</NothingText>
                            </View>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center' }}>
                                <Activity size={20} color={theme.colors.primary} />
                            </View>
                        </View>
                        <View style={{ height: 1.5, backgroundColor: theme.colors.border, marginVertical: 12, opacity: 0.5 }} />
                        <View style={{ width: '100%', height: 4, backgroundColor: theme.colors.border, borderRadius: 2 }}>
                            <View style={{ width: `${Math.min(100, (liveData.distance / 1000) / (habit.numericGoal || 1) * 100)}%`, height: '100%', backgroundColor: theme.colors.primary, borderRadius: 2 }} />
                        </View>
                    </View>
                ) : null}
            </NothingCard>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={theme.colors.text} size={24} />
                </TouchableOpacity>
                <NothingText variant="bold" style={{ fontFamily: 'ndot' }} size={24}>{habit.title.toUpperCase()}</NothingText>
                <TouchableOpacity onPress={() => setShowSettings(true)}>
                    <Settings color={theme.colors.text} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

                <SensorInsight />

                <View style={styles.mainArea}>
                    {habit.type === 'timer' ? (
                        <View style={styles.timerContainer}>
                            <View style={[styles.circleOutline, { borderColor: theme.colors.surface2 }]}>
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
                                        setTimeLeft(0);
                                    }}
                                >
                                    <Check size={24} color={theme.colors.success} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : habit.type === 'numeric' ? (
                        <View style={styles.checkContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 32 }}>
                                {!habit.isSensorBased && (
                                    <TouchableOpacity
                                        style={[styles.largeCheckBtn, { width: 80, height: 80, borderRadius: 40, borderColor: theme.colors.border }]}
                                        onPress={() => useAppStore.getState().updateNumericProgress(habitId, today, -1)}
                                    >
                                        <X size={32} color={theme.colors.error} />
                                    </TouchableOpacity>
                                )}

                                <View style={{ alignItems: 'center' }}>
                                    <NothingText variant="dot" size={80}>
                                        {habit.isSensorBased ? (
                                            habit.sensorType === 'pedometer' ? liveData.steps :
                                                habit.sensorType === 'noise' ? liveData.noise :
                                                    habit.numericProgress?.[today] || 0
                                        ) : (
                                            habit.numericProgress?.[today] || 0
                                        )}
                                    </NothingText>
                                    <NothingText color={theme.colors.textSecondary}>{habit.numericUnit?.toUpperCase()}</NothingText>
                                </View>

                                {!habit.isSensorBased && (
                                    <TouchableOpacity
                                        style={[styles.largeCheckBtn, { width: 80, height: 80, borderRadius: 40, borderColor: theme.colors.border, backgroundColor: (habit.numericProgress?.[today] || 0) >= (habit.numericGoal || 1) ? theme.colors.success + '20' : 'transparent' }]}
                                        onPress={() => useAppStore.getState().updateNumericProgress(habitId, today, 1)}
                                    >
                                        <Plus size={32} color={theme.colors.success} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <NothingText variant="bold" style={{ marginTop: 24 }}>
                                GOAL: {habit.sensorType === 'gps' && habit.numericUnit === 'km'
                                    ? ((habit.numericGoal || 0) * 1000 >= 1000
                                        ? `${habit.numericGoal}km`
                                        : `${(habit.numericGoal || 0) * 1000}m`)
                                    : `${habit.numericGoal} ${habit.numericUnit}`
                                }
                            </NothingText>
                        </View>
                    ) : (
                        <View style={styles.checkContainer}>
                            {!habit.isSensorBased ? (
                                <>
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
                                </>
                            ) : (
                                <View style={{ alignItems: 'center' }}>
                                    <View style={[styles.largeCheckBtn, { borderColor: isCompletedToday ? theme.colors.success : theme.colors.border, backgroundColor: isCompletedToday ? theme.colors.success + '10' : 'transparent' }]}>
                                        {isCompletedToday ? (
                                            <Check size={80} color={theme.colors.success} strokeWidth={3} />
                                        ) : (
                                            <Activity size={80} color={theme.colors.surface2} />
                                        )}
                                    </View>
                                    <NothingText variant="bold" size={18} style={{ marginTop: 24, color: isCompletedToday ? theme.colors.success : theme.colors.text }}>
                                        {isCompletedToday ? 'GOAL REACHED' : 'WAITING FOR SENSOR...'}
                                    </NothingText>
                                    {!isCompletedToday && (
                                        <NothingText size={12} color={theme.colors.textSecondary} style={{ marginTop: 8, paddingHorizontal: 40, textAlign: 'center' }}>
                                            This habit is automatically verified by your sensors. Keep moving!
                                        </NothingText>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Atomic Habit Section */}
                {habit.cue && (
                    <View style={{ marginTop: 40 }}>
                        <NothingText variant="bold" size={20} style={[styles.sectionTitle, { fontFamily: 'ndot' }]}>THE HABIT LOOP</NothingText>
                        <View style={styles.loopContainer}>
                            <View style={[styles.loopStep, { borderColor: theme.colors.border }]}>
                                <View style={[styles.stepIcon, { backgroundColor: '#3B82F620' }]}>
                                    <Sparkles size={24} color="#3B82F6" />
                                </View>
                                <View style={styles.stepContent}>
                                    <NothingText variant="bold" size={14} color="#3B82F6">1. CUE</NothingText>
                                    <NothingText size={13} color={theme.colors.textSecondary}>{habit.cue}</NothingText>
                                </View>
                            </View>

                            <View style={[styles.loopStep, { borderColor: theme.colors.border }]}>
                                <View style={[styles.stepIcon, { backgroundColor: '#F472B620' }]}>
                                    <Flame size={24} color="#F472B6" />
                                </View>
                                <View style={styles.stepContent}>
                                    <NothingText variant="bold" size={14} color="#F472B6">2. CRAVING</NothingText>
                                    <NothingText size={13} color={theme.colors.textSecondary}>{habit.craving}</NothingText>
                                </View>
                            </View>

                            <View style={[styles.loopStep, { borderColor: theme.colors.border }]}>
                                <View style={[styles.stepIcon, { backgroundColor: '#A78BFA20' }]}>
                                    <Check size={24} color="#A78BFA" />
                                </View>
                                <View style={styles.stepContent}>
                                    <NothingText variant="bold" size={14} color="#A78BFA">3. RESPONSE</NothingText>
                                    <NothingText size={13} color={theme.colors.textSecondary}>{habit.response}</NothingText>
                                </View>
                            </View>

                            <View style={[styles.loopStep, { borderColor: theme.colors.border }]}>
                                <View style={[styles.stepIcon, { backgroundColor: '#34D39920' }]}>
                                    <Trophy size={24} color="#34D399" />
                                </View>
                                <View style={styles.stepContent}>
                                    <NothingText variant="bold" size={14} color="#34D399">4. REWARD</NothingText>
                                    <NothingText size={13} color={theme.colors.textSecondary}>{habit.reward}</NothingText>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.howToSection, { borderColor: theme.colors.primary + '40', backgroundColor: theme.colors.primary + '05' }]}>
                            <NothingText variant="bold" size={16} color={theme.colors.primary} style={{ marginBottom: 8 }}>How to Grow this Habit</NothingText>
                            <NothingText size={14} style={{ lineHeight: 20 }}>{habit.howToApply || 'Apply the 4 Laws of Behavior Change: Make it Obvious, Make it Attractive, Make it Easy, and Make it Satisfying.'}</NothingText>
                        </View>
                    </View>
                )}

                <NothingText variant="bold" size={14} style={styles.sectionTitle}>HISTORY</NothingText>
                <NothingCard style={styles.historyCard}>
                    <View style={styles.heatmap}>
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

            <Modal
                transparent={true}
                visible={showSettings}
                animationType="fade"
                onRequestClose={() => setShowSettings(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSettings(false)}
                >
                    <NothingCard
                        style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
                        padding="lg"
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.modalHeader}>
                            <NothingText variant="bold" style={{ fontFamily: 'ndot' }} size={20}>EDIT HABIT</NothingText>
                            <TouchableOpacity onPress={() => setShowSettings(false)}>
                                <X color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <NothingInput
                            placeholder="Habit Name"
                            value={editTitle}
                            onChangeText={setEditTitle}
                        />

                        {habit.type === 'timer' && (
                            <View style={{ marginTop: 16 }}>
                                <NothingText variant="bold" size={14} style={{ marginBottom: 12, fontFamily: 'ndot' }}>GOAL DURATION (MINS)</NothingText>
                                <NothingInput
                                    placeholder="10"
                                    value={editGoal}
                                    onChangeText={setEditGoal}
                                    keyboardType="numeric"
                                />
                            </View>
                        )}

                        <NothingButton
                            label="Save Changes"
                            onPress={handleSaveSettings}
                            style={{ marginTop: 24 }}
                        />

                        <TouchableOpacity
                            style={[styles.deleteBtn, { marginTop: 24 }]}
                            onPress={() => {
                                setShowSettings(false);
                                deleteHabit(habitId);
                                navigation.goBack();
                            }}
                        >
                            <Trash2 size={18} color={theme.colors.error} />
                            <NothingText color={theme.colors.error} size={14} style={{ marginLeft: 8 }}>Delete Habit</NothingText>
                        </TouchableOpacity>
                    </NothingCard>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

