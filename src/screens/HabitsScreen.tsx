import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore, Habit } from '../store/useAppStore';
import { Plus, Check, Flame, X, Timer, Heart, Sparkles, Minus, TrendingUp, Compass, User as UserIcon } from 'lucide-react-native';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { HabitsScreenStyles as styles } from '../styles/Habit.styles';
import { COMMON_HABITS_TEMPLATES, HabitTemplate } from '../utils/HabitTemplates';

export const HabitsScreen = () => {
    const navigation = useNavigation<any>();
    const { habits, addHabit, toggleHabit, updateNumericProgress } = useAppStore();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'my' | 'explore'>('my');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newFreq, setNewFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [newType, setNewType] = useState<'check' | 'timer' | 'numeric'>('check');
    const [newTimerGoal, setNewTimerGoal] = useState('10'); // minutes

    const [newNumericGoal, setNewNumericGoal] = useState('8');
    const [newNumericUnit, setNewNumericUnit] = useState('glasses');

    const handleAddHabit = () => {
        if (newTitle.trim()) {
            addHabit({
                title: newTitle,
                description: newDesc,
                frequency: newFreq,
                type: newType,
                timerGoal: newType === 'timer' ? parseInt(newTimerGoal) * 60 : undefined,
                numericGoal: newType === 'numeric' ? parseInt(newNumericGoal) : undefined,
                numericUnit: newType === 'numeric' ? newNumericUnit : undefined,
                reminders: [],
                color: theme.colors.primary,
            });
            setNewTitle('');
            setNewDesc('');
            setNewType('check');
            setNewTimerGoal('10');
            setNewNumericGoal('8');
            setNewNumericUnit('glasses');
            setIsAddModalVisible(false);
        }
    };

    const handleTemplateSelect = (template: HabitTemplate) => {
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
                            {item.type === 'numeric' && <TrendingUp size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />}
                            <NothingText variant="bold" size={18}>{item.title}</NothingText>
                        </View>
                        <View style={styles.streakContainer}>
                            <Flame size={14} color={theme.colors.primary} />
                            <NothingText size={12} color={theme.colors.textSecondary} style={styles.streakText}>
                                {item.streak} DAY STREAK
                            </NothingText>
                        </View>
                    </View>

                    {item.type === 'numeric' ? (
                        <View style={styles.numericControls}>
                            <TouchableOpacity
                                style={[styles.numericBtn, { borderColor: theme.colors.border }]}
                                onPress={() => updateNumericProgress(item.id, todayStr, -1)}
                            >
                                <Minus size={18} color={theme.colors.text} />
                            </TouchableOpacity>
                            <View style={styles.progressText}>
                                <NothingText variant="bold" size={16}>{item.numericProgress?.[todayStr] || 0}</NothingText>
                                <NothingText size={8} color={theme.colors.textSecondary}>{item.numericUnit?.toUpperCase()}</NothingText>
                            </View>
                            <TouchableOpacity
                                style={[styles.numericBtn, { borderColor: theme.colors.border, backgroundColor: (item.numericProgress?.[todayStr] || 0) >= (item.numericGoal || 1) ? theme.colors.primary : 'transparent' }]}
                                onPress={() => updateNumericProgress(item.id, todayStr, 1)}
                            >
                                <Plus size={18} color={(item.numericProgress?.[todayStr] || 0) >= (item.numericGoal || 1) ? theme.colors.background : theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    ) : (
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
                    )}
                </View>
            </NothingCard>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <NothingText variant="dot" size={32}>RISE HABITS</NothingText>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => setActiveTab('my')}
                    style={[styles.tab, activeTab === 'my' && { borderBottomColor: theme.colors.primary }]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UserIcon size={16} color={activeTab === 'my' ? theme.colors.text : theme.colors.textSecondary} style={{ marginRight: 8 }} />
                        <NothingText variant={activeTab === 'my' ? 'bold' : 'regular'} color={activeTab === 'my' ? theme.colors.text : theme.colors.textSecondary}>MY LIST</NothingText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('explore')}
                    style={[styles.tab, activeTab === 'explore' && { borderBottomColor: theme.colors.primary }]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Compass size={16} color={activeTab === 'explore' ? theme.colors.text : theme.colors.textSecondary} style={{ marginRight: 8 }} />
                        <NothingText variant={activeTab === 'explore' ? 'bold' : 'regular'} color={activeTab === 'explore' ? theme.colors.text : theme.colors.textSecondary}>EXPLORE</NothingText>
                    </View>
                </TouchableOpacity>
            </View>

            <FlatList
                data={(activeTab === 'my' ? habits : COMMON_HABITS_TEMPLATES) as any}
                renderItem={(activeTab === 'my' ? renderHabit : ({ item }: { item: HabitTemplate }) => (
                    <TouchableOpacity onPress={() => handleTemplateSelect(item)}>
                        <NothingCard margin="xs" style={[styles.habitCard, { padding: 12 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.templateIcon, { backgroundColor: item.color + '20', marginBottom: 0, marginRight: 16 }]}>
                                    <Sparkles size={18} color={item.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <NothingText variant="bold" size={16}>{item.title}</NothingText>
                                    <NothingText size={12} color={theme.colors.textSecondary} numberOfLines={1}>{item.description}</NothingText>
                                </View>
                                <NothingText size={10} color={item.category === 'Bad Habit' ? '#EF4444' : theme.colors.primary} variant="bold">
                                    {item.category.toUpperCase()}
                                </NothingText>
                            </View>
                        </NothingCard>
                    </TouchableOpacity>
                )) as any}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <NothingText color={theme.colors.textSecondary}>
                            {activeTab === 'my' ? 'No habits being tracked' : 'Loading common habits...'}
                        </NothingText>
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
                                <Check size={18} color={newType === 'check' ? theme.colors.text : theme.colors.textSecondary} />
                                <NothingText size={10} style={{ marginLeft: 6 }}>CHECK</NothingText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.typeBtn, newType === 'numeric' && { borderColor: theme.colors.text, backgroundColor: theme.colors.text + '10' }, { borderColor: theme.colors.border }]}
                                onPress={() => setNewType('numeric')}
                            >
                                <TrendingUp size={18} color={newType === 'numeric' ? theme.colors.text : theme.colors.textSecondary} />
                                <NothingText size={10} style={{ marginLeft: 6 }}>COUNT</NothingText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.typeBtn, newType === 'timer' && { borderColor: theme.colors.text, backgroundColor: theme.colors.text + '10' }, { borderColor: theme.colors.border }]}
                                onPress={() => setNewType('timer')}
                            >
                                <Timer size={18} color={newType === 'timer' ? theme.colors.text : theme.colors.textSecondary} />
                                <NothingText size={10} style={{ marginLeft: 6 }}>TIMER</NothingText>
                            </TouchableOpacity>
                        </View>

                        {newType === 'numeric' && (
                            <View style={{ marginBottom: 24, flexDirection: 'row', gap: 12 }}>
                                <View style={{ flex: 1 }}>
                                    <NothingText variant="bold" size={14} style={{ marginBottom: 8 }}>GOAL</NothingText>
                                    <NothingInput
                                        placeholder="8"
                                        value={newNumericGoal}
                                        onChangeText={setNewNumericGoal}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <NothingText variant="bold" size={14} style={{ marginBottom: 8 }}>UNIT</NothingText>
                                    <NothingInput
                                        placeholder="glasses"
                                        value={newNumericUnit}
                                        onChangeText={setNewNumericUnit}
                                    />
                                </View>
                            </View>
                        )}

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

