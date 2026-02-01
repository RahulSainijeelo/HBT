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
import { X, Plus, Trash2, Calendar, Tag, AlertCircle, CheckCircle2, Circle, Flag } from 'lucide-react-native';
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
    onUpdatePriority: (taskId: string, priority: 1 | 2 | 3 | 4) => void;
    onUpdateLabel: (taskId: string) => void; // Trigger label picker
    onUpdateDate: (taskId: string) => void;  // Trigger date picker
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
    onUpdatePriority,
    onUpdateLabel,
    onUpdateDate,
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
            statusBarTranslucent
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ width: '100%' }}
                >
                    <ModalHandle theme={theme} />
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: theme.colors.surface1,
                                paddingBottom: (insets.bottom || 20) + 24,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        onStartShouldSetResponder={() => true}
                        onResponderTerminationRequest={() => false}
                    >
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
                                <TouchableOpacity
                                    style={[styles.metaItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
                                    onPress={() => onUpdateDate(task.id)}
                                >
                                    <Calendar size={16} color={theme.colors.textSecondary} />
                                    <View style={styles.metaTextContainer}>
                                        <NothingText size={10} color={theme.colors.textSecondary}>DATE</NothingText>
                                        <NothingText size={14} color={theme.colors.text}>
                                            {task.dueDate ? dayjs(task.dueDate).format('DD MMM') : 'No Date'}
                                        </NothingText>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.metaItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
                                    onPress={() => onUpdateLabel(task.id)}
                                >
                                    <Tag size={16} color={theme.colors.textSecondary} />
                                    <View style={styles.metaTextContainer}>
                                        <NothingText size={10} color={theme.colors.textSecondary}>LABEL</NothingText>
                                        <NothingText size={14} color={theme.colors.text}>
                                            {task.category}
                                        </NothingText>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.metaItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
                                    onPress={() => onUpdatePriority(task.id, (task.priority === 1 ? 4 : task.priority - 1) as any)}
                                >
                                    <Flag size={16} color={getPriorityColor(task.priority)} />
                                    <View style={styles.metaTextContainer}>
                                        <NothingText size={10} color={theme.colors.textSecondary}>PRIORITY</NothingText>
                                        <NothingText size={14} color={getPriorityColor(task.priority)}>
                                            P{task.priority}
                                        </NothingText>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <NothingText variant="bold" size={16} style={styles.sectionTitle}>
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
                    </View>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 20,
    },
    title: {
        flex: 1,
        marginRight: 15,
    },
    closeBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 8,
    },
    metaItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 12,
    },
    metaTextContainer: {
        marginLeft: 8,
    },
    sectionTitle: {
        marginBottom: 12,
        letterSpacing: 1,
        color: 'rgba(255,255,255,0.4)',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
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
        marginTop: 8,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        paddingVertical: 8,
    },
});
