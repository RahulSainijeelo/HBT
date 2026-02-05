import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore, Habit } from '../store/useAppStore';
import { Plus, Check, Flame, X, Timer, Heart, Sparkles, Minus, TrendingUp, Compass, User as UserIcon, Activity } from 'lucide-react-native';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { HabitsScreenStyles as styles } from '../styles/Habit.styles';
import { COMMON_HABITS_TEMPLATES, HabitTemplate } from '../utils/HabitTemplates';

export const HabitsScreen = () => {
    const route = useRoute<any>();
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

    React.useEffect(() => {
        if (route.params?.openAdd) {
            setIsAddModalVisible(true);
            navigation.setParams({ openAdd: undefined });
        }

        // Handle deep link for specific sensor habit from widget
        if (route.params?.templateId) {
            const template = COMMON_HABITS_TEMPLATES.find(t => t.id === route.params.templateId);
            if (template) {
                // Check if already exists
                const existing = habits.find(h => h.sensorType === template.sensorType);
                if (existing) {
                    navigation.navigate('HabitDetail', { habitId: existing.id });
                } else {
                    setActiveTab('explore');
                    navigation.navigate('HabitKnowledge', { template });
                }
            }
            navigation.setParams({ templateId: undefined });
        }
    }, [route.params?.openAdd, route.params?.templateId]);

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

                    {item.isSensorBased ? (
                        <View style={{ alignItems: 'flex-end', justifyContent: 'center', paddingRight: 8 }}>
                            <NothingText size={10} color={theme.colors.primary} variant="bold">AUTO</NothingText>
                            <Activity size={20} color={theme.colors.primary + '50'} />
                        </View>
                    ) : item.type === 'numeric' ? (
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
                <NothingText variant="dot" style={{ fontFamily: 'ndot' }} size={32}>RISE HABITS</NothingText>
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
                showsVerticalScrollIndicator={false}
                data={activeTab === 'my' ? habits : [
                    { id: 'header_sensor', isHeader: true, title: 'PREMIUM SENSORS' },
                    ...COMMON_HABITS_TEMPLATES.filter(t => t.isSensorBased),
                    { id: 'header_regular', isHeader: true, title: 'REGULAR HABITS' },
                    ...COMMON_HABITS_TEMPLATES.filter(t => !t.isSensorBased)
                ] as any}
                renderItem={(activeTab === 'my' ? renderHabit : ({ item }: { item: any }) => {
                    if (item.isHeader) {
                        return (
                            <View style={{ paddingVertical: 12, paddingHorizontal: 4, marginTop: item.title === 'REGULAR HABITS' ? 16 : 0 }}>
                                {item.title === 'REGULAR HABITS' && <View style={{ height: 1, backgroundColor: theme.colors.border, opacity: 0.3, marginBottom: 16 }} />}
                                <NothingText variant="bold" size={12} color={theme.colors.textSecondary} style={{ letterSpacing: 3 }}>{item.title}</NothingText>
                            </View>
                        );
                    }

                    const isSensor = item.isSensorBased;

                    return (
                        <TouchableOpacity
                            onPress={() => {
                                const exists = isSensor && habits.some(h => h.sensorType === item.sensorType);
                                if (exists) {
                                    const habit = habits.find(h => h.sensorType === item.sensorType);
                                    if (habit) navigation.navigate('HabitDetail', { habitId: habit.id });
                                } else {
                                    handleTemplateSelect(item);
                                }
                            }}
                        >
                            <NothingCard
                                margin="xs"
                                style={[
                                    styles.habitCard,
                                    { padding: 12 },
                                    isSensor && {
                                        borderColor: theme.colors.primary + '80',
                                        borderWidth: 1.5,
                                        backgroundColor: theme.colors.surface1,
                                        shadowColor: theme.colors.primary,
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 10,
                                        elevation: 4
                                    }
                                ]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.templateIcon, {
                                        backgroundColor: item.color + '20',
                                        marginBottom: 0,
                                        marginRight: 16,
                                        borderColor: isSensor ? theme.colors.primary + '40' : 'transparent',
                                        borderWidth: isSensor ? 1 : 0
                                    }]}>
                                        <Sparkles size={18} color={item.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <NothingText variant="bold" size={16} color={isSensor ? theme.colors.text : theme.colors.text}>{item.title}</NothingText>
                                            {isSensor && (
                                                <View style={{ marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, backgroundColor: habits.some(h => h.sensorType === item.sensorType) ? theme.colors.success + '20' : theme.colors.primary + '20' }}>
                                                    <NothingText size={7} color={habits.some(h => h.sensorType === item.sensorType) ? theme.colors.success : theme.colors.primary} variant="bold" style={{ letterSpacing: 1 }}>
                                                        {habits.some(h => h.sensorType === item.sensorType) ? 'ADDED' : 'AUTO-LINK'}
                                                    </NothingText>
                                                </View>
                                            )}
                                        </View>
                                        <NothingText size={12} color={theme.colors.textSecondary} numberOfLines={1}>{item.description}</NothingText>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <NothingText size={10} color={item.category === 'Bad Habit' ? '#EF4444' : theme.colors.primary} variant="bold">
                                            {item.category.toUpperCase()}
                                        </NothingText>
                                        {isSensor && <Activity size={12} color={theme.colors.primary + '60'} style={{ marginTop: 4 }} />}
                                    </View>
                                </View>
                            </NothingCard>
                        </TouchableOpacity>
                    );
                }) as any}
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