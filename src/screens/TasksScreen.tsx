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

    // Advanced Date Modal State
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
    const [timeMode, setTimeMode] = useState<'hour' | 'minute'>('hour');

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

    const handleTimeGesture = (evt: any) => {
        const { locationX, locationY } = evt.nativeEvent;
        // Dial is 260x260, center 130,130
        const dx = locationX - 130;
        const dy = locationY - 130;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI; // -180 to 180

        let adjustedAngle = angle + 90;
        if (adjustedAngle < 0) adjustedAngle += 360;

        if (timeMode === 'hour') {
            const radius = Math.sqrt(dx * dx + dy * dy);
            let hour = Math.round(adjustedAngle / 30);
            if (hour === 0) hour = 12;

            // Check inner ring (radius < 85 is inner)
            // Outer ring radius is ~100, inner is ~65. Cutoff at 85 seems right.
            if (radius < 85) {
                if (hour === 12) hour = 0; // 00 hours
                else hour += 12; // 13-23
            }

            const currentM = newTime ? newTime.split(':')[1] : '00';
            setNewTime(`${hour.toString().padStart(2, '0')}:${currentM}`);
        } else {
            // Minute mode
            let minute = Math.round(adjustedAngle / 6);
            if (minute === 60) minute = 0;

            const currentH = newTime ? newTime.split(':')[0] : '12';
            setNewTime(`${currentH}:${minute.toString().padStart(2, '0')}`);
        }
    };

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => handleTimeGesture(evt),
        onPanResponderMove: (evt) => handleTimeGesture(evt),
    }), [timeMode, newTime]);

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowTimePicker(false);
        if (selectedDate) {
            setNewTime(dayjs(selectedDate).format('HH:mm'));
        }
    };

    const renderTask = ({ item }: { item: Task }) => (
        <NothingCard margin="xs" style={styles.taskCard}>
            <View style={styles.taskMain}>
                <TouchableOpacity onPress={() => toggleTask(item.id)} style={{ marginRight: 12 }}>
                    {item.completed ?
                        <CheckCircle2 size={24} color={theme.colors.success} /> :
                        <Circle size={24} color={theme.colors.textSecondary} />
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.taskTextContainer}
                    onPress={() => {
                        // Placeholder for details view - can be replaced with a modal later
                        console.log("Show details for", item.id);
                    }}
                >
                    <NothingText style={[styles.taskTitle, item.completed && { textDecorationLine: 'line-through', color: theme.colors.textSecondary }]}>
                        {item.title}
                    </NothingText>
                    {(item.dueDate || item.dueTime) && (
                        <NothingText size={12} color={theme.colors.textSecondary}>
                            {item.dueDate ? dayjs(item.dueDate).format('DD MMM') : ''}
                            {item.dueDate && item.dueTime ? ' • ' : ''}
                            {item.dueTime}
                        </NothingText>
                    )}
                </TouchableOpacity>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
            </View>
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
                <TouchableOpacity
                    style={[
                        styles.modalOverlay,
                        (showAdvDateModal || showAdvTimeModal || showDurationModal || showRemindersModal || showLabelPicker) && { opacity: 0 }
                    ]}
                    activeOpacity={1}
                    onPress={() => setIsAddModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior="padding"
                        style={{ width: '100%' }}
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
                    </KeyboardAvoidingView>
                </TouchableOpacity>
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
                                paddingTop: 24
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

                        {/* Shortcuts - No Changes */}
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

                        {/* Custom Calendar with Month Navigation */}
                        <View style={{ marginBottom: 24 }}>
                            {/* Month Navigation */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <TouchableOpacity onPress={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} style={{ padding: 4 }}>
                                    <ChevronDown size={24} color={theme.colors.text} style={{ transform: [{ rotate: '90deg' }] }} />
                                </TouchableOpacity>
                                <NothingText variant="bold" size={16}>
                                    {currentMonth.format('MMMM YYYY')}
                                </NothingText>
                                <TouchableOpacity onPress={() => setCurrentMonth(currentMonth.add(1, 'month'))} style={{ padding: 4 }}>
                                    <ChevronDown size={24} color={theme.colors.text} style={{ transform: [{ rotate: '-90deg' }] }} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                    <NothingText key={i} size={12} color={theme.colors.textSecondary} style={{ width: 40, textAlign: 'center' }}>{d}</NothingText>
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {Array.from({ length: 42 }).map((_, i) => {
                                    // Full Calendar Logic
                                    const startOfMonth = currentMonth.startOf('month');
                                    const startDay = startOfMonth.day(); // 0 is Sunday
                                    const date = startOfMonth.subtract(startDay, 'day').add(i, 'day');

                                    const isCurrentMonth = date.month() === currentMonth.month();
                                    const isSelected = newDate === date.format('YYYY-MM-DD');
                                    const isToday = date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');

                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 20,
                                                backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                                                borderWidth: isToday && !isSelected ? 1 : 0,
                                                borderColor: theme.colors.primary,
                                                opacity: isCurrentMonth ? 1 : 0.3
                                            }}
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
                                value={isRepeatEnabled}
                                onValueChange={setIsRepeatEnabled}
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
                onRequestClose={() => {
                    setShowAdvTimeModal(false);
                    setTimeMode('hour');
                }}
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
                        <NothingText variant="bold" size={18} style={{ marginBottom: 24 }}>
                            {newTime || '--:--'}
                        </NothingText>

                        {/* Time Mode Toggles */}
                        <View style={{ flexDirection: 'row', marginBottom: 24, backgroundColor: theme.colors.surface2, borderRadius: 12, padding: 4 }}>
                            <TouchableOpacity
                                style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: timeMode === 'hour' ? theme.colors.surface : 'transparent' }}
                                onPress={() => setTimeMode('hour')}
                            >
                                <NothingText variant="bold" color={timeMode === 'hour' ? theme.colors.text : theme.colors.textSecondary}>Hour</NothingText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: timeMode === 'minute' ? theme.colors.surface : 'transparent' }}
                                onPress={() => setTimeMode('minute')}
                            >
                                <NothingText variant="bold" color={timeMode === 'minute' ? theme.colors.text : theme.colors.textSecondary}>Minute</NothingText>
                            </TouchableOpacity>
                        </View>

                        {/* Custom Dial Container */}
                        <View
                            {...panResponder.panHandlers}
                            style={{ width: 260, height: 260, borderRadius: 130, backgroundColor: theme.colors.surface1, position: 'relative', marginBottom: 24 }}
                        >
                            {/* Central Dot */}
                            <View style={{ position: 'absolute', top: 127, left: 127, width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, zIndex: 10 }} />

                            {/* Connecting Line (Hand) */}
                            {newTime && (
                                <View style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    justifyContent: 'center', alignItems: 'center',
                                    zIndex: 5,
                                    transform: [{
                                        rotate: timeMode === 'hour'
                                            ? `${(parseInt(newTime.split(':')[0]) % 12) * 30 - 90}deg`
                                            : `${parseInt(newTime.split(':')[1]) * 6 - 90}deg`
                                    }]
                                }}>
                                    <View style={{
                                        width: timeMode === 'hour' && (parseInt(newTime.split(':')[0]) >= 13 || parseInt(newTime.split(':')[0]) === 0) ? 65 : 100, // Inner ring (13-23 + 00) vs Outer
                                        height: 2,
                                        backgroundColor: theme.colors.primary,
                                        transform: [{ translateX: (timeMode === 'hour' && (parseInt(newTime.split(':')[0]) >= 13 || parseInt(newTime.split(':')[0]) === 0) ? 65 : 100) / 2 }]
                                    }} />
                                </View>
                            )}

                            {/* Clock Face Numbers */}
                            {timeMode === 'hour' ? (
                                <>
                                    {/* Outer Ring (1-12) */}
                                    {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
                                        const angle = (i * 30 - 90) * (Math.PI / 180);
                                        const radius = 100;
                                        const x = 130 + radius * Math.cos(angle);
                                        const y = 130 + radius * Math.sin(angle);
                                        // Highlight selected hour
                                        const currentHour = newTime ? parseInt(newTime.split(':')[0]) : null;
                                        const isSelected = currentHour === h || (currentHour === 0 && h === 12);

                                        return (
                                            <TouchableOpacity
                                                key={h}
                                                style={{ position: 'absolute', left: x - 15, top: y - 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: isSelected ? theme.colors.primary : 'transparent' }}
                                                onPress={() => {
                                                    const m = newTime ? newTime.split(':')[1] : '00';
                                                    setNewTime(`${h.toString().padStart(2, '0')}:${m}`);
                                                    setTimeMode('minute');
                                                }}
                                            >
                                                <NothingText size={16} color={isSelected ? theme.colors.background : theme.colors.text}>{h}</NothingText>
                                            </TouchableOpacity>
                                        )
                                    })}
                                    {/* Inner Ring (13-00) */}
                                    {[0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((h, i) => {
                                        const angle = (i * 30 - 90) * (Math.PI / 180);
                                        const radius = 65;
                                        const x = 130 + radius * Math.cos(angle);
                                        const y = 130 + radius * Math.sin(angle);

                                        return (
                                            <TouchableOpacity
                                                key={h}
                                                style={{ position: 'absolute', left: x - 12, top: y - 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}
                                                onPress={() => {
                                                    const m = newTime ? newTime.split(':')[1] : '00';
                                                    setNewTime(`${h.toString().padStart(2, '0')}:${m}`);
                                                    setTimeMode('minute');
                                                }}
                                            >
                                                <NothingText size={12} color={theme.colors.textSecondary}>{h === 0 ? '00' : h}</NothingText>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </>
                            ) : (
                                // Minute View
                                [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m, i) => {
                                    const angle = (i * 30 - 90) * (Math.PI / 180);
                                    const radius = 100;
                                    const x = 130 + radius * Math.cos(angle);
                                    const y = 130 + radius * Math.sin(angle);
                                    const currentMinute = newTime ? parseInt(newTime.split(':')[1]) : null;
                                    const isSelected = currentMinute === m;

                                    return (
                                        <TouchableOpacity
                                            key={m}
                                            style={{ position: 'absolute', left: x - 15, top: y - 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: isSelected ? theme.colors.primary : 'transparent' }}
                                            onPress={() => {
                                                const h = newTime ? newTime.split(':')[0] : '12';
                                                setNewTime(`${h}:${m.toString().padStart(2, '0')}`);
                                            }}
                                        >
                                            <NothingText size={16} color={isSelected ? theme.colors.background : theme.colors.text}>{m.toString().padStart(2, '0')}</NothingText>
                                        </TouchableOpacity>
                                    )
                                })
                            )}
                        </View>
                        <TouchableOpacity style={{ marginTop: 24, alignSelf: 'center' }} onPress={() => setShowAdvTimeModal(false)}>
                            <NothingText color={theme.colors.primary} variant="bold">DONE</NothingText>
                        </TouchableOpacity>
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
            </Modal >

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
            </Modal >

            {/* Label Picker Modal */}
            < Modal
                transparent={true}
                visible={showLabelPicker}
                animationType="fade"
                onRequestClose={() => setShowLabelPicker(false)}
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowLabelPicker(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ width: '100%' }}
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
                    </KeyboardAvoidingView>
                </TouchableOpacity>
            </Modal >
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
        // backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
        padding: 0,
        margin: 0,
    },
    addModalContent: {
        // dynamic bg
        paddingTop: 20,
        paddingHorizontal: 15,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
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
