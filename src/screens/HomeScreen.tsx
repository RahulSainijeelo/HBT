import React, { useState } from 'react';
import { View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { Calendar } from 'react-native-calendars';
import { useAppStore } from '../store/useAppStore';
import { X, CheckCircle2, Circle, Flame } from 'lucide-react-native';
import dayjs from 'dayjs';
import { styles } from '../styles/HomeScreen.styles';

export const HomeScreen = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [modalVisible, setModalVisible] = useState(false);
    const { tasks, habits } = useAppStore();
    const { theme } = useTheme();

    const dayTasks = tasks.filter(t => t.dueDate === selectedDate);
    const dayHabits = habits.filter(h => h.completedDates.includes(selectedDate));

    const onDayPress = (day: any) => {
        setSelectedDate(day.dateString);
        setModalVisible(true);
    };

    // Mark dates with tasks/habits
    const markedDates: any = {};
    tasks.forEach(t => {
        if (t.dueDate) {
            markedDates[t.dueDate] = {
                marked: true,
                dotColor: theme.colors.textSecondary
            };
        }
    });

    markedDates[selectedDate] = {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary,
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <NothingText variant="dot" style={{ fontFamily: 'ndot' }} size={32}>Rise</NothingText>
                <NothingText color={theme.colors.textSecondary}>{dayjs().format('MMMM YYYY')}</NothingText>
            </View>

            <View style={styles.calendarContainer}>
                <Calendar
                    theme={{
                        backgroundColor: theme.colors.background,
                        calendarBackground: theme.colors.background,
                        textSectionTitleColor: theme.colors.textSecondary,
                        selectedDayBackgroundColor: theme.colors.primary,
                        selectedDayTextColor: theme.colors.background,
                        todayTextColor: theme.colors.primary,
                        dayTextColor: theme.colors.text,
                        textDisabledColor: theme.colors.surface2,
                        dotColor: theme.colors.primary,
                        selectedDotColor: theme.colors.background,
                        monthTextColor: theme.colors.text,
                        indicatorColor: theme.colors.text,
                        textDayFontFamily: 'System',
                        textMonthFontFamily: 'System',
                        textDayHeaderFontFamily: 'System',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 14
                    }}
                    markedDates={markedDates}
                    onDayPress={onDayPress}
                    enableSwipeMonths={true}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <NothingCard style={styles.modalContent} padding="lg">
                        <View style={styles.modalHeader}>
                            <NothingText variant="bold" size={24}>{dayjs(selectedDate).format('DD MMM')}</NothingText>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X color={theme.colors.text} size={28} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <NothingText variant="medium" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>TASKS</NothingText>
                            {dayTasks.length > 0 ? dayTasks.map(t => (
                                <NothingCard key={t.id} margin="xs" bordered={false} backgroundColor={theme.colors.surface1}>
                                    <View style={styles.row}>
                                        {t.completed ? <CheckCircle2 size={18} color={theme.colors.success} /> : <Circle size={18} color={theme.colors.textSecondary} />}
                                        <NothingText style={styles.itemText}>{t.title}</NothingText>
                                    </View>
                                </NothingCard>
                            )) : <NothingText color={theme.colors.textSecondary} style={styles.emptyText}>No tasks for this day.</NothingText>}

                            <NothingText variant="medium" style={[styles.sectionTitle, { marginTop: 24, color: theme.colors.textSecondary }]}>HABITS</NothingText>
                            {dayHabits.length > 0 ? dayHabits.map(h => (
                                <NothingCard key={h.id} margin="xs" bordered={false} backgroundColor={theme.colors.surface1}>
                                    <View style={styles.row}>
                                        <Flame size={18} color={theme.colors.primary} />
                                        <NothingText style={styles.itemText}>{h.title}</NothingText>
                                    </View>
                                </NothingCard>
                            )) : <NothingText color={theme.colors.textSecondary} style={styles.emptyText}>No habits completed.</NothingText>}
                        </ScrollView>
                    </NothingCard>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
