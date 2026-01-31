import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { theme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore, Task } from '../store/useAppStore';
import { Plus, CheckCircle2, Circle, Calendar, Clock, Flag, Bell, Tag, ChevronRight, X } from 'lucide-react-native';
import dayjs from 'dayjs';

type SubTab = 'today' | 'upcoming' | 'browse';

export const TasksScreen = () => {
    const [activeTab, setActiveTab] = useState<SubTab>('today');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const { tasks, toggleTask, deleteTask, labels, addTask } = useAppStore();

    // New task state
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [newPriority, setNewPriority] = useState<1 | 2 | 3 | 4>(4);
    const [newLabel, setNewLabel] = useState('Inbox');

    const filteredTasks = tasks.filter(t => {
        if (activeTab === 'today') return t.dueDate === dayjs().format('YYYY-MM-DD');
        if (activeTab === 'upcoming') return t.dueDate && dayjs(t.dueDate).isAfter(dayjs(), 'day');
        return true; // Browse shows all for now
    });

    const handleAddTask = () => {
        if (newTitle.trim()) {
            addTask({
                title: newTitle,
                dueDate: newDate,
                priority: newPriority,
                category: newLabel,
                reminders: [],
                subtasks: []
            });
            setNewTitle('');
            setIsAddModalVisible(false);
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
                        <NothingText style={[styles.taskTitle, item.completed && styles.completedText]}>
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
        <SafeAreaView style={styles.container}>
            <View style={styles.subTabs}>
                {(['today', 'upcoming', 'browse'] as SubTab[]).map(tab => (
                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
                        <NothingText
                            variant={activeTab === tab ? 'bold' : 'regular'}
                            color={activeTab === tab ? theme.colors.text : theme.colors.textSecondary}
                            style={styles.tabText}
                        >
                            {tab.toUpperCase()}
                        </NothingText>
                        {activeTab === tab && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                ))}
            </View>

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
                style={styles.fab}
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
                    <NothingCard style={styles.addModalContent} padding="lg">
                        <View style={styles.modalHeader}>
                            <NothingText variant="bold" size={20}>NEW TASK</NothingText>
                            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                                <X color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <NothingInput
                            placeholder="What needs to be done?"
                            autoFocus
                            value={newTitle}
                            onChangeText={setNewTitle}
                            style={styles.mainInput}
                        />

                        <View style={styles.quickOptions}>
                            <TouchableOpacity style={styles.optionBtn} onPress={() => setNewDate(dayjs().format('YYYY-MM-DD'))}>
                                <Calendar size={18} color={newDate === dayjs().format('YYYY-MM-DD') ? theme.colors.primary : theme.colors.text} />
                                <NothingText style={styles.optionLabel}>Date</NothingText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionBtn}>
                                <Clock size={18} color={theme.colors.text} />
                                <NothingText style={styles.optionLabel}>Time</NothingText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionBtn} onPress={() => setNewPriority(newPriority === 1 ? 4 : (newPriority - 1) as any)}>
                                <Flag size={18} color={getPriorityColor(newPriority)} />
                                <NothingText style={styles.optionLabel}>P{newPriority}</NothingText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionBtn}>
                                <Bell size={18} color={theme.colors.text} />
                                <NothingText style={styles.optionLabel}>Alert</NothingText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionBtn}>
                                <Tag size={18} color={theme.colors.text} />
                                <NothingText style={styles.optionLabel}>Label</NothingText>
                            </TouchableOpacity>
                        </View>

                        <NothingButton
                            label="Add Task"
                            onPress={handleAddTask}
                            style={styles.submitBtn}
                        />
                    </NothingCard>
                </View>
            </Modal>
        </SafeAreaView>
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
        backgroundColor: theme.colors.background,
    },
    subTabs: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
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
        backgroundColor: theme.colors.primary,
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
    completedText: {
        textDecorationLine: 'line-through',
        color: theme.colors.textSecondary,
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
        backgroundColor: theme.colors.primary,
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
        backgroundColor: theme.colors.surface,
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
        borderColor: theme.colors.border,
        paddingBottom: 12,
        marginBottom: 24,
    },
    quickOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    optionBtn: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 12,
        backgroundColor: theme.colors.surface1,
        width: '18%',
    },
    optionLabel: {
        fontSize: 10,
        marginTop: 4,
        color: theme.colors.textSecondary,
    },
    submitBtn: {
        marginTop: 8,
    }
});
