import React, { useState } from 'react';
import { View, Modal, ScrollView, TouchableOpacity, Platform } from 'react-native';
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
    const [currentTime, setCurrentTime] = useState(dayjs());
    const { tasks, habits } = useAppStore();
    const { theme } = useTheme();

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const dayTasks = tasks.filter(t => t.dueDate === selectedDate);
    const dayHabits = habits.filter(h => h.completedDates.includes(selectedDate));

    const onDayPress = (day: any) => {
        setSelectedDate(day.dateString);
        setModalVisible(true);
    };

    // Mark dates with tasks/habits
    const markedDates: any = {};

    // Process tasks
    tasks.forEach(t => {
        if (t.dueDate) {
            const dots = markedDates[t.dueDate]?.dots || [];
            if (t.completed) {
                dots.push({ key: `task-${t.id}`, color: '#007AFF', selectedDotColor: theme.colors.background });
            } else {
                dots.push({ key: `task-${t.id}`, color: theme.colors.textSecondary, selectedDotColor: theme.colors.background });
            }
            markedDates[t.dueDate] = {
                ...markedDates[t.dueDate],
                dots
            };
        }
    });

    // Process habits
    habits.forEach(h => {
        h.completedDates.forEach(date => {
            const dots = markedDates[date]?.dots || [];
            dots.push({ key: `habit-${h.id}`, color: theme.colors.success, selectedDotColor: theme.colors.background });
            markedDates[date] = {
                ...markedDates[date],
                dots
            };
        });
    });

    markedDates[selectedDate] = {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary,
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <View style={{ marginBottom: 16, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <NothingText variant="dot" size={64} color={theme.colors.text}>
                            {currentTime.format('HH:mm')}
                        </NothingText>
                        <NothingText variant="dot" size={24} color="#FF3B30" style={{ marginLeft: 4 }}>
                            {currentTime.format('ss')}
                        </NothingText>
                    </View>
                    <NothingText variant="medium" color={theme.colors.textSecondary} size={14} style={{ letterSpacing: 4, marginTop: -8 }}>
                        {currentTime.format('dddd, MMMM D').toUpperCase()}
                    </NothingText>
                </View>

                <View style={{ height: 1, backgroundColor: theme.colors.border, marginBottom: 24, opacity: 0.5 }} />

                <NothingText variant="dot" style={{ fontFamily: 'ndot' }} size={24}>OVERVIEW</NothingText>
            </View>

            <View style={styles.calendarContainer}>
                <Calendar
                    key={theme.dark ? 'dark' : 'light'}
                    markingType="multi-dot"
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
                        textDayFontFamily: Platform.OS === 'ios' ? 'System' : 'ndot',
                        textMonthFontFamily: Platform.OS === 'ios' ? 'System' : 'ndot',
                        textDayHeaderFontFamily: Platform.OS === 'ios' ? 'System' : 'ndot',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 14,
                        'stylesheet.calendar.header': {
                            header: {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingLeft: 10,
                                paddingRight: 10,
                                marginTop: 6,
                                alignItems: 'center'
                            },
                        }
                    } as any}
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
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={{ width: '100%' }}>
                        <View style={{
                            alignSelf: 'center',
                            width: 40,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: theme.colors.border,
                            marginBottom: 8
                        }} />
                        <NothingCard
                            style={[styles.modalContent, { backgroundColor: theme.colors.surface1, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 }]}
                            padding="lg"
                            onStartShouldSetResponder={() => true}
                        >
                            <View style={styles.modalHeader}>
                                <View>
                                    <NothingText variant="bold" size={24}>{dayjs(selectedDate).format('DD MMM')}</NothingText>
                                    <NothingText color={theme.colors.textSecondary} size={12}>{dayjs(selectedDate).format('dddd').toUpperCase()}</NothingText>
                                </View>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 8 }}>
                                    <X color={theme.colors.text} size={24} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                    <CheckCircle2 size={14} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                                    <NothingText variant="medium" style={[styles.sectionTitle, { color: theme.colors.textSecondary, marginBottom: 0 }]}>TASKS</NothingText>
                                </View>
                                {dayTasks.length > 0 ? dayTasks.map(t => (
                                    <NothingCard key={t.id} margin="xs" bordered={true} backgroundColor={theme.colors.surface2} style={{ padding: 12 }}>
                                        <View style={styles.row}>
                                            {t.completed ? <CheckCircle2 size={18} color={theme.colors.success} strokeWidth={3} /> : <Circle size={18} color={theme.colors.textSecondary} />}
                                            <NothingText style={[styles.itemText, t.completed && { textDecorationLine: 'line-through', opacity: 0.6 }]}>{t.title}</NothingText>
                                        </View>
                                    </NothingCard>
                                )) : (
                                    <View style={{ padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, alignItems: 'center' }}>
                                        <NothingText color={theme.colors.textSecondary} size={12}>No tasks scheduled for today</NothingText>
                                    </View>
                                )}

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 32, marginBottom: 12 }}>
                                    <Flame size={14} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                                    <NothingText variant="medium" style={[styles.sectionTitle, { color: theme.colors.textSecondary, marginBottom: 0 }]}>HABITS</NothingText>
                                </View>
                                {dayHabits.length > 0 ? dayHabits.map(h => (
                                    <NothingCard key={h.id} margin="xs" bordered={true} backgroundColor={theme.colors.surface2} style={{ padding: 12 }}>
                                        <View style={styles.row}>
                                            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: theme.colors.success + '20', justifyContent: 'center', alignItems: 'center' }}>
                                                <Flame size={12} color={theme.colors.success} />
                                            </View>
                                            <NothingText style={styles.itemText}>{h.title}</NothingText>
                                        </View>
                                    </NothingCard>
                                )) : (
                                    <View style={{ padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, alignItems: 'center' }}>
                                        <NothingText color={theme.colors.textSecondary} size={12}>No habits completed yet</NothingText>
                                    </View>
                                )}
                            </ScrollView>
                        </NothingCard>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};
