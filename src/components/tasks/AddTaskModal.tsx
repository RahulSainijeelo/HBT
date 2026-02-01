import React from 'react';
import { View, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Calendar, Clock, Flag, Bell, Tag } from 'lucide-react-native';
import dayjs from 'dayjs';
import { NothingText } from '../NothingText';
import { NothingInput } from '../NothingInput';
import { NothingButton } from '../NothingButton';
import { AddTaskModalProps } from '../../utils/TaskScreen.utils';
import { AddTaskModalStyle as styles } from './styles';

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
    visible, onClose, theme, insets, newTitle, setNewTitle, newDate, newPriority, setNewPriority,
    duration, selectedReminders, newLabel, onAddDate, onAddDuration, onAddReminders, onAddLabel, handleAddTask, getPriorityColor
}) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
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
                <View
                    style={[
                        styles.addModalContent,
                        {
                            backgroundColor: theme.colors.surface1,
                            paddingBottom: (insets.bottom || 20) + 24,
                            width: '100%',
                            borderColor: theme.colors.border
                        }
                    ]}
                    onStartShouldSetResponder={() => true}
                    onResponderTerminationRequest={() => false}
                >
                    <View style={styles.modalHandle} />
                    <View style={styles.modalHeader}>
                        <NothingText variant="bold" size={20}>NEW TASK</NothingText>
                        <TouchableOpacity onPress={onClose}>
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
                        <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={onAddDate}>
                            <Calendar size={18} color={newDate === dayjs().format('YYYY-MM-DD') ? theme.colors.primary : theme.colors.text} />
                            <NothingText style={{ fontSize: 10, marginTop: 4, color: theme.colors.textSecondary }}>
                                {dayjs(newDate).format('DD MMM')}
                            </NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={onAddDuration}>
                            <Clock size={16} color={duration ? theme.colors.primary : theme.colors.text} />
                            <NothingText style={{ fontSize: 10, color: theme.colors.textSecondary }}>
                                {duration ? (duration < 60 ? `${duration}m` : `${duration / 60}h`) : 'Duration'}
                            </NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={() => setNewPriority(newPriority === 1 ? 4 : (newPriority - 1) as any)}>
                            <Flag size={18} color={getPriorityColor(newPriority)} />
                            <NothingText style={{ fontSize: 10, marginTop: 4, color: theme.colors.textSecondary }}>P{newPriority}</NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={onAddReminders}>
                            <Bell size={18} color={selectedReminders.length > 0 ? theme.colors.primary : theme.colors.text} />
                            <NothingText style={{ fontSize: 10, marginTop: 4, color: theme.colors.textSecondary }}>Alert</NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.optionBtn, { backgroundColor: theme.colors.surface1 }]} onPress={onAddLabel}>
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
    </Modal>
);