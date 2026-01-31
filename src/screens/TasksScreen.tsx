import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore, Task } from '../store/useAppStore';
import { Plus, CheckCircle2, Circle, Calendar, Clock, Flag, Bell, Tag, X, Search, ChevronRight, Repeat } from 'lucide-react-native';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';

type SubTab = 'today' | 'upcoming' | 'browse';


export const TasksScreen = () => {
    const [activeTab, setActiveTab] = useState<SubTab>('today');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const { tasks, toggleTask, labels, addTask, addLabel } = useAppStore();
    const { theme } = useTheme();
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
    const [duration, setDuration] = useState<number | null>(null);
    const [showRemindersModal, setShowRemindersModal] = useState(false);
    const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
    const [showLabelPicker, setShowLabelPicker] = useState(false);

    const filteredTasks = tasks.filter(t => {
        if (activeTab === 'today') return t.dueDate === dayjs().format('YYYY-MM-DD');
        if (activeTab === 'upcoming') return t.dueDate && dayjs(t.dueDate).isAfter(dayjs(), 'day');
        // Browse Logic
        if (activeTab === 'browse') {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLabel = selectedLabelFilter ? t.category === selectedLabelFilter : true;
            return matchesSearch && matchesLabel;
        }
        return true;
    });

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
                data={filteredTasks}
                renderItem={renderTask}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <NothingText color={theme.colors.textSecondary}>No tasks found</NothingText>
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
                    <NothingCard style={[styles.addModalContent, { backgroundColor: theme.colors.surface }]} padding="lg">
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

                            <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={() => setShowAdvTimeModal(true)}>
                                <Clock size={18} color={newTime ? theme.colors.primary : theme.colors.text} />
                                <NothingText style={{ fontSize: 10, marginTop: 4, color: theme.colors.textSecondary }}>
                                    {newTime || 'Time'}
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
                    </NothingCard>
                </View>
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
            >
                <View style={styles.modalOverlay}>
                    <NothingCard style={[styles.addModalContent, { backgroundColor: theme.colors.surface }]} padding="lg">
                        <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>DUE DATE</NothingText>

                        <TouchableOpacity style={styles.dateOption} onPress={() => { setNewDate(dayjs().format('YYYY-MM-DD')); setShowAdvDateModal(false); }}>
                            <Calendar size={20} color={theme.colors.primary} />
                            <NothingText style={styles.dateOptionText}>Today</NothingText>
                            <NothingText color={theme.colors.textSecondary}>{dayjs().format('ddd')}</NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.dateOption} onPress={() => { setNewDate(dayjs().add(1, 'day').format('YYYY-MM-DD')); setShowAdvDateModal(false); }}>
                            <Calendar size={20} color={theme.colors.text} />
                            <NothingText style={styles.dateOptionText}>Tomorrow</NothingText>
                            <NothingText color={theme.colors.textSecondary}>{dayjs().add(1, 'day').format('ddd')}</NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.dateOption} onPress={() => { setNewDate(dayjs().add(1, 'week').startOf('week').add(1, 'day').format('YYYY-MM-DD')); setShowAdvDateModal(false); }}>
                            <Calendar size={20} color={theme.colors.text} />
                            <NothingText style={styles.dateOptionText}>Next Week</NothingText>
                            <NothingText color={theme.colors.textSecondary}>{dayjs().add(1, 'week').startOf('week').add(1, 'day').format('ddd')}</NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.dateOption} onPress={() => { setNewDate(''); setShowAdvDateModal(false); }}>
                            <X size={20} color={theme.colors.textSecondary} />
                            <NothingText style={styles.dateOptionText}>No Date</NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.dateOption, { borderBottomWidth: 0 }]} onPress={() => { setShowAdvDateModal(false); setShowDatePicker(true); }}>
                            <Calendar size={20} color={theme.colors.text} />
                            <NothingText style={styles.dateOptionText}>Pick Date...</NothingText>
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

                        <TouchableOpacity style={{ marginTop: 16, alignSelf: 'center' }} onPress={() => setShowAdvDateModal(false)}>
                            <NothingText color={theme.colors.textSecondary}>CANCEL</NothingText>
                        </TouchableOpacity>
                    </NothingCard>
                </View>
            </Modal>

            {/* Advanced Time Modal */}
            <Modal
                transparent={true}
                visible={showAdvTimeModal}
                animationType="fade"
                onRequestClose={() => setShowAdvTimeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <NothingCard style={[styles.addModalContent, { backgroundColor: theme.colors.surface }]} padding="lg">
                        <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>DUE TIME</NothingText>

                        <View style={{ marginBottom: 24, alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ padding: 16, backgroundColor: theme.colors.surface1, borderRadius: 12, width: '100%', alignItems: 'center' }}
                                onPress={() => { setShowAdvTimeModal(false); setShowTimePicker(true); }}
                            >
                                <NothingText size={32} variant="bold" color={newTime ? theme.colors.primary : theme.colors.text}>
                                    {newTime || '--:--'}
                                </NothingText>
                                <NothingText size={12} color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
                                    TAP TO CHANGE TIME
                                </NothingText>
                            </TouchableOpacity>
                        </View>

                        <NothingText size={14} color={theme.colors.textSecondary} style={{ marginBottom: 12 }}>DURATION</NothingText>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                            {[15, 30, 45, 60, 90, 120].map(m => (
                                <TouchableOpacity
                                    key={m}
                                    style={[
                                        styles.durationChip,
                                        { backgroundColor: duration === m ? theme.colors.primary : theme.colors.surface1 }
                                    ]}
                                    onPress={() => setDuration(duration === m ? null : m)}
                                >
                                    <NothingText size={12} color={duration === m ? theme.colors.background : theme.colors.text}>
                                        {m < 60 ? `${m}m` : `${m / 60}h`}
                                    </NothingText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => { setNewTime(undefined); setDuration(null); setShowAdvTimeModal(false); }}>
                                <NothingText color={theme.colors.textSecondary}>CLEAR</NothingText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowAdvTimeModal(false)}>
                                <NothingText color={theme.colors.primary} variant="bold">DONE</NothingText>
                            </TouchableOpacity>
                        </View>
                    </NothingCard>
                </View>
            </Modal>

            {/* Reminders Modal */}
            <Modal
                transparent={true}
                visible={showRemindersModal}
                animationType="fade"
                onRequestClose={() => setShowRemindersModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <NothingCard style={[styles.addModalContent, { backgroundColor: theme.colors.surface }]} padding="lg">
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
                    </NothingCard>
                </View>
            </Modal>

            {/* Label Picker Modal */}
            <Modal
                transparent={true}
                visible={showLabelPicker}
                animationType="fade"
                onRequestClose={() => setShowLabelPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <NothingCard style={[styles.addModalContent, { backgroundColor: theme.colors.surface }]} padding="lg">
                        <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>SELECT LABEL</NothingText>

                        <ScrollView style={{ maxHeight: 200 }}>
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
                    </NothingCard>
                </View>
            </Modal>
        </SafeAreaView >
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
        justifyContent: 'center',
        padding: 20,
    },
    addModalContent: {
        // dynamic bg
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
    }
});
