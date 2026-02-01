import React from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { ChevronDown, Clock, ChevronRight, Repeat } from 'lucide-react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import { NothingText } from '../NothingText';
import { DueDateModalProps } from '../../utils/TaskScreen.utils';
import { DueDateModalStyle as styles } from '../../styles/styles';
import { ModalHandle } from './ModalHandle';

export const DueDateModal: React.FC<DueDateModalProps> = ({
    visible, onClose, theme, insets, newDate, setNewDate, newTime, setNewTime,
    currentMonth, setCurrentMonth, isRepeatEnabled, setIsRepeatEnabled, onAddTime
}) => (
    <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
    >
        <TouchableOpacity
            style={[styles.modalOverlay, { justifyContent: 'flex-end' }]}
            activeOpacity={1}
            onPress={onClose}
        >
            <ModalHandle theme={theme} />
            <View
                style={[
                    styles.addModalContent,
                    {
                        backgroundColor: theme.colors.surface1,
                        paddingBottom: (insets.bottom || 20) + 24,
                        borderColor: theme.colors.border
                    }
                ]}
                onStartShouldSetResponder={() => true}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <NothingText variant="bold" size={20}>DUE DATE</NothingText>
                    <TouchableOpacity onPress={onClose}>
                        <NothingText color={theme.colors.primary} variant="bold">DONE</NothingText>
                    </TouchableOpacity>
                </View>

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

                <PanGestureHandler
                    activeOffsetX={[-20, 20]}
                    onHandlerStateChange={(e: any) => {
                        if (e.nativeEvent.state === State.END) {
                            if (e.nativeEvent.translationX > 50) {
                                setCurrentMonth(currentMonth.subtract(1, 'month'));
                            } else if (e.nativeEvent.translationX < -50) {
                                setCurrentMonth(currentMonth.add(1, 'month'));
                            }
                        }
                    }}
                >
                    <View style={{ marginBottom: 24 }}>
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

                        <View style={{ width: 280, alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                    <NothingText key={i} size={12} color={theme.colors.textSecondary} style={{ width: 40, textAlign: 'center' }}>{d}</NothingText>
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {Array.from({ length: 42 }).map((_, i) => {
                                    const startOfMonth = currentMonth.startOf('month');
                                    const startDay = startOfMonth.day();
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
                    </View>
                </PanGestureHandler>

                <TouchableOpacity style={styles.addTimeBtn} onPress={onAddTime}>
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
);