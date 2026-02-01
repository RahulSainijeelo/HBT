import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CheckCircle2, Circle, Trash2, Check } from 'lucide-react-native';
import dayjs from 'dayjs';
import { NothingText } from '../NothingText';
import { NothingCard } from '../NothingCard';
import { TaskItemProps as BaseTaskItemProps } from '../../utils/TaskScreen.utils';
import { TaskItemStyle as styles } from '../../styles/styles';

interface TaskItemProps extends BaseTaskItemProps {
    onPress: (taskId: string) => void;
    deleteTask: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ item, theme, toggleTask, deleteTask, getPriorityColor, onPress }) => {

    const renderLeftActions = (_progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <TouchableOpacity
                style={[styles.swipeAction, { backgroundColor: theme.colors.error, width: 80, justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => deleteTask(item.id)}
            >
                <Animated.View style={{ transform: [{ translateX: trans }] }}>
                    <Trash2 size={24} color="#FFF" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderRightActions = (_progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [-101, -100, -50, 0],
            outputRange: [-1, 0, 0, 20],
        });
        return (
            <TouchableOpacity
                style={[styles.swipeAction, { backgroundColor: theme.colors.primary, width: 80, justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => toggleTask(item.id)}
            >
                <Animated.View style={{ transform: [{ translateX: trans }] }}>
                    <Check size={24} color="#FFF" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            friction={2}
            leftThreshold={40}
            rightThreshold={40}
            onSwipeableOpen={(direction) => {
                if (direction === 'left') {
                    // deleteTask(item.id); // Uncomment if you want auto-delete on full swipe
                } else if (direction === 'right') {
                    // toggleTask(item.id); // Uncomment if you want auto-toggle on full swipe
                }
            }}
        >
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
                        {(item.dueDate || item.dueTime || item.duration) && (
                            <NothingText size={12} color={theme.colors.textSecondary}>
                                {item.dueDate ? dayjs(item.dueDate).format('DD MMM') : ''}
                                {item.dueDate && item.dueTime ? ' • ' : ''}
                                {item.dueTime}
                                {item.duration ? ` • ${item.duration}m` : ''}
                            </NothingText>
                        )}
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <NothingText size={12} color={theme.colors.textSecondary}>P{item.priority}</NothingText>
                        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
                    </View>
                </View>
            </NothingCard>
        </Swipeable>
    );
};