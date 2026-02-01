import React, { useState } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { X, Plus, Trash2, Calendar, Tag, AlertCircle, CheckCircle2, Circle } from 'lucide-react-native';
import dayjs from 'dayjs';
import { NothingText } from '../NothingText';
import { ModalHandle } from './ModalHandle';
import { Task } from '../../store/useAppStore';

interface TaskDetailModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    insets: any;
    task: Task | undefined;
    onAddSubtask: (taskId: string, title: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    onDeleteSubtask: (taskId: string, subtaskId: string) => void;
    getPriorityColor: (priority: number) => string;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    visible,
    onClose,
    theme,
    insets,
    task,
    onAddSubtask,
    onToggleSubtask,
    onDeleteSubtask,
    getPriorityColor,
}) => {
    const [newStep, setNewStep] = useState('');

    if (!task) return null;

    const handleAddStep = () => {
        if (newStep.trim()) {
            onAddSubtask(task.id, newStep.trim());
            setNewStep('');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.dismissArea}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: theme.colors.surface,
                            paddingBottom: insets.bottom + 20,
                        },
                    ]}
                >
                    <ModalHandle theme={theme} />

                    <View style={styles.header}>
                        <NothingText variant="bold" size={24} style={styles.title}>
                            {task.title}
                        </NothingText>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Calendar size={16} color={theme.colors.textSecondary} />
                                <NothingText size={14} color={theme.colors.textSecondary} style={styles.metaText}>
                                    {task.dueDate ? dayjs(task.dueDate).format('DD MMM YYYY') : 'No Date'}
                                </NothingText>
                            </View>
                            <View style={styles.metaItem}>
                                <Tag size={16} color={theme.colors.textSecondary} />
                                <NothingText size={14} color={theme.colors.textSecondary} style={styles.metaText}>
                                    {task.category}
                                </NothingText>
                            </View>
                            <View style={styles.metaItem}>
                                <AlertCircle size={16} color={getPriorityColor(task.priority)} />
                                <NothingText size={14} color={getPriorityColor(task.priority)} style={styles.metaText}>
                                    P{task.priority}
                                </NothingText>
                            </View>
                            {task.duration && (
                                <View style={styles.metaItem}>
                                    <AlertCircle size={16} color={getPriorityColor(task.priority)} />
                                    <NothingText size={14} color={getPriorityColor(task.priority)} style={styles.metaText}>
                                        {task.duration}
                                    </NothingText>
                                </View>
                            )}
                        </View>

                        <NothingText variant="bold" size={18} style={styles.sectionTitle}>
                            STEPS
                        </NothingText>

                        {task.subtasks?.map((step) => (
                            <View key={step.id} style={styles.stepItem}>
                                <TouchableOpacity
                                    onPress={() => onToggleSubtask(task.id, step.id)}
                                    style={styles.stepToggle}
                                >
                                    {step.completed ? (
                                        <CheckCircle2 size={20} color={theme.colors.success} />
                                    ) : (
                                        <Circle size={20} color={theme.colors.textSecondary} />
                                    )}
                                </TouchableOpacity>
                                <NothingText
                                    style={[
                                        styles.stepTitle,
                                        step.completed && { textDecorationLine: 'line-through', color: theme.colors.textSecondary }
                                    ]}
                                >
                                    {step.title}
                                </NothingText>
                                <TouchableOpacity
                                    onPress={() => onDeleteSubtask(task.id, step.id)}
                                    style={styles.deleteBtn}
                                >
                                    <Trash2 size={18} color={theme.colors.error} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <View style={[styles.addStepRow, { borderBottomColor: theme.colors.border }]}>
                            <Plus size={20} color={theme.colors.primary} />
                            <TextInput
                                style={[styles.input, { color: theme.colors.text }]}
                                placeholder="Add a step..."
                                placeholderTextColor={theme.colors.textSecondary}
                                value={newStep}
                                onChangeText={setNewStep}
                                onSubmitEditing={handleAddStep}
                                blurOnSubmit={false}
                            />
                            {newStep.length > 0 && (
                                <TouchableOpacity onPress={handleAddStep}>
                                    <NothingText color={theme.colors.primary} variant="bold">ADD</NothingText>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    title: {
        flex: 1,
        marginRight: 15,
    },
    closeBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        gap: 15,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        marginLeft: 6,
    },
    sectionTitle: {
        marginBottom: 12,
        letterSpacing: 1,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    stepToggle: {
        marginRight: 12,
    },
    stepTitle: {
        flex: 1,
        fontSize: 16,
    },
    deleteBtn: {
        padding: 8,
    },
    addStepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        paddingVertical: 8,
    },
});
