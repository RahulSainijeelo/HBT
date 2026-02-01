import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import dayjs from 'dayjs';
import { NothingText } from '../NothingText';
import { NothingCard } from '../NothingCard';
import { TaskItemProps as BaseTaskItemProps } from '../../utils/TaskScreen.utils';
import { TaskItemStyle as styles } from '../../styles/styles';

interface TaskItemProps extends BaseTaskItemProps {
    onPress: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ item, theme, toggleTask, getPriorityColor, onPress }) => (
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
                onPress={() => onPress(item.id)}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <NothingText size={12} color={theme.colors.textSecondary}>P{item.priority}</NothingText>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
            </View>

        </View>
    </NothingCard>
);