import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Platform, Switch, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore, Task } from '../store/useAppStore';
import { Plus, CheckCircle2, Circle, Calendar, Clock, Flag, Bell, Tag, X, Search, ChevronRight, Repeat, ChevronDown, ChevronUp } from 'lucide-react-native';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';

type SubTab = 'today' | 'upcoming' | 'browse';


export const TasksScreen = () => {
    const [activeTab, setActiveTab] = useState<SubTab>('today');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const { tasks, toggleTask, labels, addTask, addLabel } = useAppStore();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    // New task state
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [newTime, setNewTime] = useState<string | undefined>(undefined);
    const [newPriority, setNewPriority] = useState<1 | 2 | 3 | 4>(4);
    const [newLabel, setNewLabel] = useState('Inbox');
    const [customLabel, setCustomLabel] = useState('');

    // Browse State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLabelFilter, setSelectedLabelFilter] = useState<string | null>(null);

    // Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showAdvDateModal, setShowAdvDateModal] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showAdvTimeModal, setShowAdvTimeModal] = useState(false);
    const [showDurationModal, setShowDurationModal] = useState(false); // Changed from duration state usage
    const [duration, setDuration] = useState<number | null>(null);
    const [showRemindersModal, setShowRemindersModal] = useState(false);
    const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false); // For accordion

    const allFilteredTasks = tasks.filter(t => {
        if (activeTab === 'today') {
            // Updated: Today includes tasks for today AND tasks with no due date
            return t.dueDate === dayjs().format('YYYY-MM-DD') || !t.dueDate;
        }
        if (activeTab === 'upcoming') return t.dueDate && dayjs(t.dueDate).isAfter(dayjs(), 'day');
        // Browse Logic
        if (activeTab === 'browse') {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLabel = selectedLabelFilter ? t.category === selectedLabelFilter : true;
            return matchesSearch && matchesLabel;
        }
        return true;
    });

    const activeTasks = allFilteredTasks.filter(t => !t.completed);
    const completedTasks = allFilteredTasks.filter(t => t.completed);

    const handleAddTask = () => {
        if (newTitle.trim()) {
            addTask({
                title: newTitle,
                dueDate: newDate,
                dueTime: newTime,
                priority: newPriority,
                category: newLabel,
                reminders: selectedReminders,
                subtasks: []
            });
            setNewTitle('');
            setNewTime(undefined);
            setSelectedReminders([]);
            setIsAddModalVisible(false);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setNewDate(dayjs(selectedDate).format('YYYY-MM-DD'));
        }
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowTimePicker(false);
        if (selectedDate) {
            setNewTime(dayjs(selectedDate).format('HH:mm'));
        }
    };

    const renderTask = ({ item }: { item: Task }) => (
        <NothingCard margin="xs" style={styles.taskCard}>
            <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.taskMain}>
                <View style={styles.taskLeft}>
                    {item.completed ?
                        <CheckCircle2 size={24} color={theme.colors.success} /> :
                        <Circle size={24} color={theme.colors.textSecondary} />
                    }
                    <View style={styles.taskTextContainer}>
                        <NothingText style={[styles.taskTitle, item.completed && { textDecorationLine: 'line-through', color: theme.colors.textSecondary }]}>
                            {item.title}
                        </NothingText>
                        {item.dueDate && (
                            <NothingText size={12} color={theme.colors.textSecondary}>
                                {dayjs(item.dueDate).format('DD MMM')}
                            </NothingText>
                        )}
                    </View>
                </View>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
            </TouchableOpacity>
        </NothingCard>
    );

    return (
        <>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={[styles.subTabs, { borderBottomColor: theme.colors.border }]}>
                    {(['today', 'upcoming', 'browse'] as SubTab[]).map(tab => (
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
                            <NothingText
                                variant={activeTab === tab ? 'bold' : 'regular'}
                                color={activeTab === tab ? theme.colors.text : theme.colors.textSecondary}
                                style={styles.tabText}
                            >
                                {tab.toUpperCase()}
                            </NothingText>
                            {activeTab === tab && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {activeTab === 'browse' && (
                    <View style={[styles.browseContainer, { borderBottomColor: theme.colors.border }]}>
                        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface1 }]}>
                            <Search size={20} color={theme.colors.textSecondary} />
                            <NothingInput
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={styles.searchInput}
                            />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.labelList}>
                            <TouchableOpacity
                                onPress={() => setSelectedLabelFilter(null)}
                                style={[
                                    styles.labelChip,
                                    { backgroundColor: selectedLabelFilter === null ? theme.colors.primary : theme.colors.surface2 }
                                ]}
                            >
                                <NothingText color={selectedLabelFilter === null ? theme.colors.background : theme.colors.text} size={12}>All</NothingText>
                            </TouchableOpacity>
                            {labels.map(label => (
                                <TouchableOpacity
                                    key={label}
                                    onPress={() => setSelectedLabelFilter(selectedLabelFilter === label ? null : label)}
                                    style={[
                                        styles.labelChip,
                                        { backgroundColor: selectedLabelFilter === label ? theme.colors.primary : theme.colors.surface2 }
                                    ]}
                                >
                                    <NothingText color={selectedLabelFilter === label ? theme.colors.background : theme.colors.text} size={12}>{label}</NothingText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <FlatList
                    data={activeTasks}
                    renderItem={renderTask}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        activeTasks.length === 0 && completedTasks.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <NothingText color={theme.colors.textSecondary}>No tasks found</NothingText>
                            </View>
                        ) : null
                    }
                    ListFooterComponent={
                        completedTasks.length > 0 ? (
                            <View style={{ marginTop: 24 }}>
                                <TouchableOpacity
                                    onPress={() => setShowCompleted(!showCompleted)}
                                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                                >
                                    <NothingText variant="bold" color={theme.colors.textSecondary}>COMPLETED ({completedTasks.length})</NothingText>
                                    {showCompleted ? <ChevronUp size={16} color={theme.colors.textSecondary} style={{ marginLeft: 8 }} /> : <ChevronDown size={16} color={theme.colors.textSecondary} style={{ marginLeft: 8 }} />}
                                </TouchableOpacity>
                                {showCompleted && completedTasks.map(item => (
                                    <View key={item.id}>
                                        {renderTask({ item })}
                                    </View>
                                ))}
                            </View>
                        ) : null
                    }
                />

                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Plus color={theme.colors.background} size={32} />
                </TouchableOpacity>


            </SafeAreaView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddModalVisible}
                onRequestClose={() => setIsAddModalVisible(false)}
                statusBarTranslucent
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setIsAddModalVisible(false)}
                    >
                        <View
                            style={[
                                styles.addModalContent,
                                {
                                    backgroundColor: theme.colors.surface,
                                    paddingBottom: (insets.bottom || 20) + 24,
                                    width: '100%' // Ensure full width
                                }
                            ]}
                            onStartShouldSetResponder={() => true} // Prevent touch pass-through
                            onResponderTerminationRequest={() => false}
                        >
                            <View style={styles.modalHeader}>
                                <NothingText variant="bold" size={20}>NEW TASK</NothingText>
                                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                                    <X color={theme.colors.text} size={24} />
                                </TouchableOpacity>
                            </View>

                            <NothingInput
                                placeholder="What's up?"
                                autoFocus
                                value={newTitle}
                                onChangeText={setNewTitle}
                                style={[styles.mainInput, { borderColor: theme.colors.border }]}
                            />

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickOptions}>
                                <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={() => setShowAdvDateModal(true)}>
                                    <Calendar size={18} color={newDate === dayjs().format('YYYY-MM-DD') ? theme.colors.primary : theme.colors.text} />
                                    <NothingText style={{ fontSize: 10, marginTop: 4, color: theme.colors.textSecondary }}>
                                        {dayjs(newDate).format('DD MMM')}
                                    </NothingText>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={() => setShowDurationModal(true)}>
                                    <Clock size={16} color={duration ? theme.colors.primary : theme.colors.text} />
                                    <NothingText style={{ fontSize: 10, color: theme.colors.textSecondary }}>
                                        {duration ? (duration < 60 ? `${duration}m` : `${duration / 60}h`) : 'Duration'}
                                    </NothingText>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={() => setNewPriority(newPriority === 1 ? 4 : (newPriority - 1) as any)}>
                                    <Flag size={18} color={getPriorityColor(newPriority)} />
                                    <NothingText style={{ fontSize: 10, marginTop: 4, color: theme.colors.textSecondary }}>P{newPriority}</NothingText>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={() => setShowRemindersModal(true)}>
                                    <Bell size={18} color={selectedReminders.length > 0 ? theme.colors.primary : theme.colors.text} />
                                    <NothingText style={{ fontSize: 10, marginTop: 4, color: theme.colors.textSecondary }}>Alert</NothingText>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={() => setShowLabelPicker(true)}>
                                    <Tag size={18} color={theme.colors.text} />
                                    <NothingText style={{ fontSize: 10, marginTop: 4, color: theme.colors.textSecondary }}>
                                        {newLabel}
                                    </NothingText>
                                </TouchableOpacity>
                            </ScrollView>

                            <NothingButton
                                label="Add Task"
                                onPress={handleAddTask}
                                style={styles.submitBtn}
                            />
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
                {showDatePicker && (
                    <DateTimePicker
                        value={dayjs(newDate).toDate()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={newTime ? dayjs(newDate + ' ' + newTime).toDate() : new Date()}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onTimeChange}
                    />
                )}
            </Modal>

            {/* Advanced Date Modal */}
            <Modal
                transparent={true}
                visible={showAdvDateModal}
                animationType="fade"
                onRequestClose={() => setShowAdvDateModal(false)}
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={[styles.modalOverlay, { justifyContent: 'flex-end' }]}
                    activeOpacity={1}
                    onPress={() => setShowAdvDateModal(false)}
                >
                    <View
                        style={[
                            styles.addModalContent,
                            {
                                backgroundColor: theme.colors.surface,
                                height: 'auto',
                                marginBottom: 0,
                                paddingBottom: (insets.bottom || 20) + 24,
                                width: '100%',
                                paddingHorizontal: 24,
                                paddingTop: 24 // Re-adding padding that NothingCard provided
                            }
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <NothingText variant="bold" size={20}>DUE DATE</NothingText>
                            <TouchableOpacity onPress={() => setShowAdvDateModal(false)}>
                                <NothingText color={theme.colors.primary} variant="bold">DONE</NothingText>
                            </TouchableOpacity>
                        </View>

                        {/* Shortcuts */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                            <TouchableOpacity style={[styles.dateChip, newDate === dayjs().format('YYYY-MM-DD') && { backgroundColor: theme.colors.primary }]} onPress={() => setNewDate(dayjs().format('YYYY-MM-DD'))}>
                                <NothingText size={12} color={newDate === dayjs().format('YYYY-MM-DD') ? theme.colors.background : theme.colors.text}>Today</NothingText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.dateChip, newDate === dayjs().add(1, 'day').format('YYYY-MM-DD') && { backgroundColor: theme.colors.primary }]} onPress={() => setNewDate(dayjs().add(1, 'day').format('YYYY-MM-DD'))}>
                                <NothingText size={12} color={newDate === dayjs().add(1, 'day').format('YYYY-MM-DD') ? theme.colors.background : theme.colors.text}>Tomorrow</NothingText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.dateChip, newDate === dayjs().add(1, 'week').startOf('week').add(1, 'day').format('YYYY-MM-DD') && { backgroundColor: theme.colors.primary }]} onPress={() => setNewDate(dayjs().add(1, 'week').startOf('week').add(1, 'day').format('YYYY-MM-DD'))}>
                                <NothingText size={12} color={newDate === dayjs().add(1, 'week').startOf('week').add(1, 'day').format('YYYY-MM-DD') ? theme.colors.background : theme.colors.text}>Next Week</NothingText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.dateChip, !newDate && { backgroundColor: theme.colors.primary }]} onPress={() => setNewDate('')}>
                                <NothingText size={12} color={!newDate ? theme.colors.background : theme.colors.text}>No Date</NothingText>
                            </TouchableOpacity>
                        </ScrollView>

                        {/* Custom Calendar (Simple Month Grid) */}
                        <View style={{ marginBottom: 24 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                    <NothingText key={i} size={12} color={theme.colors.textSecondary} style={{ width: 40, textAlign: 'center' }}>{d}</NothingText>
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {Array.from({ length: 35 }).map((_, i) => {
                                    // Simplified Calendar Logic (Starts from current month start)
                                    const date = dayjs().startOf('month').add(i - dayjs().startOf('month').day(), 'day');
                                    const isSelected = newDate === date.format('YYYY-MM-DD');
                                    const isToday = date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: isSelected ? theme.colors.primary : 'transparent', borderWidth: isToday && !isSelected ? 1 : 0, borderColor: theme.colors.primary }}
                                            onPress={() => setNewDate(date.format('YYYY-MM-DD'))}
                                        >
                                            <NothingText size={14} color={isSelected ? theme.colors.background : theme.colors.text}>
                                                {date.date()}
                                            </NothingText>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Add Time Button */}
                        <TouchableOpacity style={styles.addTimeBtn} onPress={() => { setShowAdvDateModal(false); setShowAdvTimeModal(true); }}>
                            <Clock size={20} color={newTime ? theme.colors.primary : theme.colors.text} />
                            <NothingText style={{ marginLeft: 12, flex: 1 }}>{newTime ? newTime : 'Add Time'}</NothingText>
                            <ChevronRight size={16} color={theme.colors.textSecondary} />
                        </TouchableOpacity>

                        <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 8 }} />

                        <View style={styles.dateOption}>
                            <Repeat size={20} color={theme.colors.text} />
                            <NothingText style={styles.dateOptionText}>Repeat</NothingText>
                            <Switch
                                trackColor={{ false: theme.colors.surface2, true: theme.colors.primary }}
                                thumbColor={Platform.OS === 'android' ? theme.colors.surface : ''}
                                value={false}
                                onValueChange={() => { }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
            {/* Advanced Time Modal (Dial) */}
            <Modal
                transparent={true}
                visible={showAdvTimeModal}
                animationType="fade"
                onRequestClose={() => setShowAdvTimeModal(false)}
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={[styles.modalOverlay, { justifyContent: 'flex-end' }]}
                    activeOpacity={1}
                    onPress={() => setShowAdvTimeModal(false)}
                >
                    <View
                        style={[
                            styles.addModalContent,
                            {
                                backgroundColor: theme.colors.surface,
                                alignItems: 'center',
                                paddingBottom: (insets.bottom || 20) + 24,
                                width: '100%',
                                paddingHorizontal: 24,
                                paddingTop: 24
                            }
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        <NothingText variant="bold" size={18} style={{ marginBottom: 24 }}>SET TIME</NothingText>

                        {/* Dial UI - Simplified for "Nothing" Aesthetic (Digital Grid/Radial) */}
                        <View style={{ width: 280, height: 280, borderRadius: 140, backgroundColor: theme.colors.surface1, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                            {/* Hand/Center */}
                            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.primary, position: 'absolute' }} />

                            {/* Hours */}
                            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
                                const angle = (i * 30 - 90) * (Math.PI / 180);
                                const radius = 110;
                                const x = 140 + radius * Math.cos(angle) - 20;
                                const y = 140 + radius * Math.sin(angle) - 20;
                                const isSelected = newTime && parseInt(newTime.split(':')[0]) % 12 === h % 12;
                                return (
                                    <TouchableOpacity
                                        key={h}
                                        style={{ position: 'absolute', left: x, top: y, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: isSelected ? theme.colors.primary : 'transparent' }}
                                        onPress={() => {
                                            const m = newTime ? newTime.split(':')[1] : '00';
                                            const isPM = newTime ? parseInt(newTime.split(':')[0]) >= 12 : false;
                                            const hour = isPM && h !== 12 ? h + 12 : (h === 12 && !isPM ? 0 : h);
                                            setNewTime(`${hour.toString().padStart(2, '0')}:${m}`);
                                        }}
                                    >
                                        <NothingText variant={isSelected ? 'bold' : 'regular'} color={isSelected ? theme.colors.background : theme.colors.text}>{h}</NothingText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                            <NothingText size={32} variant="bold">{newTime || '--:--'}</NothingText>
                            <TouchableOpacity
                                style={{ marginLeft: 16, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: theme.colors.surface1, borderRadius: 8 }}
                                onPress={() => {
                                    if (newTime) {
                                        const [h, m] = newTime.split(':').map(Number);
                                        const isPM = h >= 12;
                                        const newH = isPM ? h - 12 : h + 12;
                                        setNewTime(`${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
                                    }
                                }}
                            >
                                <NothingText variant="bold" color={theme.colors.primary}>{newTime ? (parseInt(newTime.split(':')[0]) >= 12 ? 'PM' : 'AM') : '--'}</NothingText>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => setShowAdvTimeModal(false)}>
                                <NothingText color={theme.colors.textSecondary}>CANCEL</NothingText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowAdvTimeModal(false)}>
                                <NothingText color={theme.colors.primary} variant="bold">DONE</NothingText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Duration Modal */}
            <Modal
                transparent={true}
                visible={showDurationModal}
                animationType="fade"
                onRequestClose={() => setShowDurationModal(false)}
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowDurationModal(false)}
                >
                    <View
                        style={[
                            styles.addModalContent,
                            {
                                backgroundColor: theme.colors.surface,
                                paddingBottom: (insets.bottom || 20) + 24,
                                width: '100%',
                                paddingHorizontal: 24,
                                paddingTop: 24
                            }
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>DURATION</NothingText>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                            {[5, 15, 30, 45, 60, 90, 120].map(m => (
                                <TouchableOpacity
                                    key={m}
                                    style={[styles.durationChip, duration === m && { backgroundColor: theme.colors.primary }]}
                                    onPress={() => setDuration(m)}
                                >
                                    <NothingText color={duration === m ? theme.colors.background : theme.colors.text}>
                                        {m < 60 ? `${m}m` : `${m / 60}h`}
                                    </NothingText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <NothingButton
                            label="Set Duration"
                            onPress={() => setShowDurationModal(false)}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Reminders Modal */}
            <Modal
                transparent={true}
                visible={showRemindersModal}
                animationType="fade"
                onRequestClose={() => setShowRemindersModal(false)}
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowRemindersModal(false)}
                >
                    <View
                        style={[
                            styles.addModalContent,
                            {
                                backgroundColor: theme.colors.surface,
                                paddingBottom: (insets.bottom || 20) + 24,
                                width: '100%',
                                paddingHorizontal: 24,
                                paddingTop: 24
                            }
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>REMINDERS</NothingText>

                        {['At time of event', '10 minutes before', '30 minutes before', '1 hour before', '1 day before'].map(r => (
                            <TouchableOpacity
                                key={r}
                                style={styles.dateOption}
                                onPress={() => {
                                    if (selectedReminders.includes(r)) {
                                        setSelectedReminders(selectedReminders.filter(item => item !== r));
                                    } else {
                                        setSelectedReminders([...selectedReminders, r]);
                                    }
                                }}
                            >
                                <Bell size={20} color={selectedReminders.includes(r) ? theme.colors.primary : theme.colors.text} />
                                <NothingText style={styles.dateOptionText}>{r}</NothingText>
                                {selectedReminders.includes(r) && <CheckCircle2 size={20} color={theme.colors.primary} />}
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity style={{ marginTop: 24, alignSelf: 'center' }} onPress={() => setShowRemindersModal(false)}>
                            <NothingText color={theme.colors.primary} variant="bold">DONE</NothingText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Label Picker Modal */}
            <Modal
                transparent={true}
                visible={showLabelPicker}
                animationType="fade"
                onRequestClose={() => setShowLabelPicker(false)}
                statusBarTranslucent
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowLabelPicker(false)}
                    >
                        <View
                            style={[
                                styles.addModalContent,
                                {
                                    backgroundColor: theme.colors.surface,
                                    paddingBottom: (insets.bottom || 20) + 24,
                                    width: '100%',
                                    paddingHorizontal: 24,
                                    paddingTop: 24
                                }
                            ]}
                            onStartShouldSetResponder={() => true}
                        >
                            <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>SELECT LABEL</NothingText>

                            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                                {labels.map(label => (
                                    <TouchableOpacity
                                        key={label}
                                        style={styles.labelItem}
                                        onPress={() => { setNewLabel(label); setShowLabelPicker(false); }}
                                    >
                                        <Tag size={16} color={theme.colors.textSecondary} />
                                        <NothingText style={{ marginLeft: 12 }}>{label}</NothingText>
                                        {newLabel === label && <CheckCircle2 size={16} color={theme.colors.primary} style={{ marginLeft: 'auto' }} />}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 16 }}>
                                <NothingInput
                                    placeholder="Create new label..."
                                    value={customLabel}
                                    onChangeText={setCustomLabel}
                                />
                                <NothingButton
                                    label="Create Label"
                                    size="sm"
                                    variant="secondary"
                                    onPress={() => {
                                        if (customLabel.trim()) {
                                            addLabel(customLabel.trim());
                                            setNewLabel(customLabel.trim());
                                            setCustomLabel('');
                                            setShowLabelPicker(false);
                                        }
                                    }}
                                />
                            </View>

                            <TouchableOpacity style={{ marginTop: 16, alignSelf: 'center' }} onPress={() => setShowLabelPicker(false)}>
                                <NothingText color={theme.colors.textSecondary}>CLOSE</NothingText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

const getPriorityColor = (p: number) => {
    switch (p) {
        case 1: return '#FF0000';
        case 2: return '#FFAB00';
        case 3: return '#0052CC';
        default: return '#333';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subTabs: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 8,
        borderBottomWidth: 1,
    },
    tabItem: {
        paddingVertical: 12,
        marginRight: 24,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 13,
        letterSpacing: 1.5,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 2,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    taskCard: {
        paddingVertical: 12,
    },
    taskMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskTextContainer: {
        marginLeft: 16,
    },
    taskTitle: {
        fontSize: 16,
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#FF0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
        padding: 0,
        margin: 0,
    },
    addModalContent: {
        // dynamic bg
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    mainInput: {
        fontSize: 20,
        borderBottomWidth: 1,
        paddingBottom: 12,
        marginBottom: 24,
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    quickOptions: {
        marginBottom: 32,
    },
    optionBtn: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        width: '20%',
        display: 'flex',
        gap: 4,
        flexDirection: 'row',
        marginRight: 2,
    },
    submitBtn: {
        marginTop: 8,
    },
    browseContainer: {
        padding: 16,
        paddingBottom: 0,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 16,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        borderBottomWidth: 0,
        marginBottom: 0,
        paddingBottom: 0,
        fontSize: 16,
    },
    labelList: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    labelChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
    },
    dateOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    dateOptionText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    durationChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
    },
    dateChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginRight: 8,
    },
    addTimeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
        marginBottom: 16
    }
});
