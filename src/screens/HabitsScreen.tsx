import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore, Habit } from '../store/useAppStore';
import { Plus, Check, Flame, X, Timer, Heart, Sparkles } from 'lucide-react-native';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { HabitsScreenStyles as styles } from '../styles/Habit.styles';

const DISCOVERY_TEMPLATES = [
    { title: 'Morning Water', desc: 'Drink 500ml water', type: 'check', color: '#60A5FA' },
    { title: 'Meditation', desc: 'Calm your mind', type: 'timer', timerGoal: 600, color: '#F472B6' },
    { title: 'Read 10 Pages', desc: 'Daily knowledge', type: 'check', color: '#34D399' },
    { title: 'Coding Practice', desc: 'Master your craft', type: 'timer', timerGoal: 3600, color: '#A78BFA' },
];

export const HabitsScreen = () => {
    const navigation = useNavigation<any>();
    const { habits, addHabit, toggleHabit } = useAppStore();
    const { theme } = useTheme();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newFreq, setNewFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [newType, setNewType] = useState<'check' | 'timer'>('check');
    const [newTimerGoal, setNewTimerGoal] = useState('10'); // minutes

    const handleAddHabit = () => {
        if (newTitle.trim()) {
            addHabit({
                title: newTitle,
                description: newDesc,
                frequency: newFreq,
                type: newType,
                timerGoal: newType === 'timer' ? parseInt(newTimerGoal) * 60 : undefined,
                reminders: [],
                color: theme.colors.primary,
            });
            setNewTitle('');
            setNewDesc('');
            setNewType('check');
            setNewTimerGoal('10');
            setIsAddModalVisible(false);
        }
    };

    const handleTemplateSelect = (template: typeof DISCOVERY_TEMPLATES[0]) => {
        navigation.navigate('HabitKnowledge', { template });
    };

    const todayStr = dayjs().format('YYYY-MM-DD');

    const renderHabit = ({ item }: { item: Habit }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
        >
            <NothingCard margin="xs" style={styles.habitCard}>
                <View style={styles.habitMain}>
                    <View style={styles.habitInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {item.type === 'timer' && <Timer size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />}
                            <NothingText variant="bold" size={18}>{item.title}</NothingText>
                        </View>
                        <View style={styles.streakContainer}>
                            <Flame size={14} color={theme.colors.primary} />
                            <NothingText size={12} color={theme.colors.textSecondary} style={styles.streakText}>
                                {item.streak} DAY STREAK
                            </NothingText>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => toggleHabit(item.id, todayStr)}
                        style={[
                            styles.checkBtn,
                            { borderColor: theme.colors.border },
                            item.completedDates.includes(todayStr) && { backgroundColor: theme.colors.text, borderColor: theme.colors.text }
                        ]}
                    >
                        <Check
                            color={item.completedDates.includes(todayStr) ? theme.colors.background : theme.colors.textSecondary}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
            </NothingCard>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <NothingText variant="dot" size={32}>TRACKER</NothingText>
            </View>

            <FlatList
                data={habits}
                renderItem={renderHabit}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
                    <View style={styles.discoverySection}>
                        <View style={styles.sectionHeader}>
                            <Sparkles size={18} color={theme.colors.primary} />
                            <NothingText variant="bold" style={{ marginLeft: 8 }}>DISCOVER</NothingText>
                        </View>
                        <FlatList
                            horizontal
                            data={DISCOVERY_TEMPLATES}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.title}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleTemplateSelect(item)}>
                                    <NothingCard style={[styles.templateCard, { borderColor: theme.colors.border }]}>
                                        <View style={[styles.templateIcon, { backgroundColor: item.color + '20' }]}>
                                            <Heart size={18} color={item.color} />
                                        </View>
                                        <NothingText variant="bold" size={14} numberOfLines={1}>{item.title}</NothingText>
                                        <NothingText size={10} color={theme.colors.textSecondary}>{item.type.toUpperCase()}</NothingText>
                                    </NothingCard>
                                </TouchableOpacity>
                            )}
                        />
                        <View style={styles.sectionHeader}>
                            <NothingText variant="bold">MY HABITS</NothingText>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <NothingText color={theme.colors.textSecondary}>No habits being tracked</NothingText>
                    </View>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => setIsAddModalVisible(true)}
            >
                <Plus color={theme.colors.background} size={32} />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddModalVisible}
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <NothingCard style={[styles.modalContent, { backgroundColor: theme.colors.surface }]} padding="lg">
                        <View style={styles.modalHeader}>
                            <NothingText variant="bold" size={20}>NEW HABIT</NothingText>
                            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                                <X color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <NothingInput
                            placeholder="Habit Name"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        <NothingInput
                            placeholder="Description (Optional)"
                            value={newDesc}
                            onChangeText={setNewDesc}
                            multiline
                        />

                        <View style={styles.freqRow}>
                            {(['daily', 'weekly', 'monthly'] as const).map(f => (
                                <TouchableOpacity
                                    key={f}
                                    onPress={() => setNewFreq(f)}
                                    style={[
                                        styles.freqChip,
                                        { borderColor: theme.colors.border },
                                        newFreq === f && { backgroundColor: theme.colors.text, borderColor: theme.colors.text }
                                    ]}
                                >
                                    <NothingText size={12} color={newFreq === f ? theme.colors.background : theme.colors.text}>
                                        {f.toUpperCase()}
                                    </NothingText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <NothingText variant="bold" size={14} style={{ marginBottom: 12 }}>GOAL TYPE</NothingText>
                        <View style={styles.typeRow}>
                            <TouchableOpacity
                                style={[styles.typeBtn, newType === 'check' && { borderColor: theme.colors.text, backgroundColor: theme.colors.text + '10' }, { borderColor: theme.colors.border }]}
                                onPress={() => setNewType('check')}
                            >
                                <Check size={20} color={newType === 'check' ? theme.colors.text : theme.colors.textSecondary} />
                                <NothingText size={12} style={{ marginLeft: 8 }}>CHECKBOX</NothingText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.typeBtn, newType === 'timer' && { borderColor: theme.colors.text, backgroundColor: theme.colors.text + '10' }, { borderColor: theme.colors.border }]}
                                onPress={() => setNewType('timer')}
                            >
                                <Timer size={20} color={newType === 'timer' ? theme.colors.text : theme.colors.textSecondary} />
                                <NothingText size={12} style={{ marginLeft: 8 }}>TIMER</NothingText>
                            </TouchableOpacity>
                        </View>

                        {newType === 'timer' && (
                            <View style={{ marginBottom: 24 }}>
                                <NothingText variant="bold" size={14} style={{ marginBottom: 12 }}>GOAL DURATION (MINS)</NothingText>
                                <NothingInput
                                    placeholder="10"
                                    value={newTimerGoal}
                                    onChangeText={setNewTimerGoal}
                                    keyboardType="numeric"
                                />
                            </View>
                        )}

                        <NothingButton
                            label="Start Tracking"
                            onPress={handleAddHabit}
                            style={styles.submitBtn}
                        />
                    </NothingCard>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

