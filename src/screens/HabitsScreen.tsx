import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { theme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, Circle, Plus, Trash2, Flame } from 'lucide-react-native';
import dayjs from 'dayjs';

export const HabitsScreen = () => {
    const { habits, addHabit, toggleHabit, deleteHabit } = useAppStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [newHabitTitle, setNewHabitTitle] = useState('');

    const today = dayjs().format('YYYY-MM-DD');

    const handleAddHabit = () => {
        if (newHabitTitle.trim()) {
            addHabit({ title: newHabitTitle, frequency: 'daily' });
            setNewHabitTitle('');
            setModalVisible(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isCompletedToday = item.completedDates.includes(today);

        return (
            <NothingCard margin="sm" style={styles.habitCard}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => toggleHabit(item.id, today)}>
                        <View style={[
                            styles.checkCircle,
                            isCompletedToday && { backgroundColor: theme.colors.text }
                        ]}>
                            {isCompletedToday ? (
                                <CheckCircle2 size={24} color={theme.colors.background} />
                            ) : (
                                <Circle size={24} color={theme.colors.textSecondary} />
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <NothingText variant="bold" size={18}>{item.title}</NothingText>
                        <View style={styles.streakRow}>
                            <Flame size={14} color={theme.colors.primary} />
                            <NothingText size={12} color={theme.colors.textSecondary} style={{ marginLeft: 4 }}>
                                {item.streak} day streak
                            </NothingText>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => deleteHabit(item.id)}>
                        <Trash2 size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>
            </NothingCard>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <NothingText variant="dot" size={32}>HABITS</NothingText>
                <NothingText color={theme.colors.textSecondary}>Consistency is everything</NothingText>
            </View>

            <FlatList
                data={habits}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <NothingText align="center" color={theme.colors.textSecondary} style={{ marginTop: 40 }}>
                        No habits yet. Dot by dot, you build yourself.
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
                        <NothingText variant="bold" size={24} style={{ marginBottom: 20 }}>New Habit</NothingText>
                        <NothingInput
                            placeholder="What do you want to start?"
                            value={newHabitTitle}
                            onChangeText={setNewHabitTitle}
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <NothingButton label="Cancel" variant="ghost" onPress={() => setModalVisible(false)} />
                            <NothingButton label="Create" onPress={handleAddHabit} />
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
    habitCard: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    titleContainer: {
        flex: 1,
        marginLeft: 16,
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
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
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        gap: 12,
    }
});
