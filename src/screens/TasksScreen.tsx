import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { theme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react-native';

export const TasksScreen = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [priority, setPriority] = useState<1 | 2 | 3 | 4>(4);

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            addTask({ title: newTaskTitle, priority, category: 'General' });
            setNewTaskTitle('');
            setPriority(4);
            setModalVisible(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <NothingCard margin="sm" style={styles.taskCard}>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => toggleTask(item.id)}>
                    {item.completed ? (
                        <CheckCircle2 size={24} color={theme.colors.success} />
                    ) : (
                        <Circle size={24} color={theme.colors.textSecondary} />
                    )}
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <NothingText
                        style={[
                            styles.taskTitle,
                            item.completed && { textDecorationLine: 'line-through', color: theme.colors.textSecondary }
                        ]}
                    >
                        {item.title}
                    </NothingText>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]} />
                </View>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Trash2 size={20} color={theme.colors.error} />
                </TouchableOpacity>
            </View>
        </NothingCard>
    );

    const getPriorityColor = (p: number) => {
        switch (p) {
            case 1: return theme.colors.primary;
            case 2: return '#FFA500';
            case 3: return '#FFFF00';
            default: return theme.colors.surface2;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <NothingText variant="dot" size={32}>TASKS</NothingText>
                <NothingText color={theme.colors.textSecondary}>{tasks.filter(t => !t.completed).length} items remaining</NothingText>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <NothingText align="center" color={theme.colors.textSecondary} style={{ marginTop: 40 }}>
                        Your list is empty. Reach for the dots.
                    </NothingText>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Plus size={32} color={theme.colors.background} />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <NothingCard style={styles.modalContent} padding="lg">
                        <NothingText variant="bold" size={24} style={{ marginBottom: 20 }}>New Task</NothingText>
                        <NothingInput
                            placeholder="What needs to be done?"
                            value={newTaskTitle}
                            onChangeText={setNewTaskTitle}
                            autoFocus
                        />

                        <NothingText variant="medium" style={{ marginVertical: 12 }}>Priority</NothingText>
                        <View style={styles.priorityRow}>
                            {[1, 2, 3, 4].map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    onPress={() => setPriority(p as any)}
                                    style={[
                                        styles.priorityButton,
                                        {
                                            borderColor: priority === p ? theme.colors.text : theme.colors.border,
                                            backgroundColor: priority === p ? theme.colors.text : 'transparent'
                                        }
                                    ]}
                                >
                                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(p) }]} />
                                    <NothingText color={priority === p ? theme.colors.background : theme.colors.text}>P{p}</NothingText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <NothingButton label="Cancel" variant="ghost" onPress={() => setModalVisible(false)} />
                            <NothingButton label="Add Task" onPress={handleAddTask} />
                        </View>
                    </NothingCard>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: 20,
        marginTop: 20,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    taskCard: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    taskTitle: {
        fontSize: 16,
    },
    priorityBadge: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.text,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingBottom: 40,
    },
    priorityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    priorityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    }
});
