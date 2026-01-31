import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore, Habit } from '../store/useAppStore';
import { Plus, Check, Flame, Calendar, Bell, ChevronRight, X } from 'lucide-react-native';
import dayjs from 'dayjs';

export const HabitsScreen = () => {
    const { habits, addHabit, toggleHabit, deleteHabit } = useAppStore();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newFreq, setNewFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    const handleAddHabit = () => {
        if (newTitle.trim()) {
            addHabit({
                title: newTitle,
                description: newDesc,
                frequency: newFreq,
                reminders: [],
            });
            setNewTitle('');
            setNewDesc('');
            setIsAddModalVisible(false);
        }
    };

    const todayStr = dayjs().format('YYYY-MM-DD');

    const renderHabit = ({ item }: { item: Habit }) => (
        <NothingCard margin="xs" style={styles.habitCard}>
            <View style={styles.habitMain}>
                <View style={styles.habitInfo}>
                    <NothingText variant="bold" size={18}>{item.title}</NothingText>
                    <View style={styles.streakContainer}>
                        <Flame size={14} color={theme.colors.primary} />
                        <NothingText size={12} color={theme.colors.textSecondary} style={styles.streakText}>
                            {item.streak} DAY STREAK
                        </NothingText>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => toggleHabit(item.id, todayStr)}
                    style={[
                        styles.checkBtn,
                        item.completedDates.includes(todayStr) && styles.checkBtnActive
                    ]}
                >
                    <Check
                        color={item.completedDates.includes(todayStr) ? theme.colors.background : theme.colors.textSecondary}
                        size={24}
                    />
                </TouchableOpacity>
            </View>
        </NothingCard>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <NothingText variant="dot" size={32}>TRACKER</NothingText>
            </View>

            <FlatList
                data={habits}
                renderItem={renderHabit}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <NothingText color={theme.colors.textSecondary}>No habits being tracked</NothingText>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setIsAddModalVisible(true)}
            >
                <Plus color={theme.colors.background} size={32} />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddModalVisible}
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <NothingCard style={styles.modalContent} padding="lg">
                        <View style={styles.modalHeader}>
                            <NothingText variant="bold" size={20}>NEW HABIT</NothingText>
                            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                                <X color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <NothingInput
                            placeholder="Habit Name"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        <NothingInput
                            placeholder="Description (Optional)"
                            value={newDesc}
                            onChangeText={setNewDesc}
                            multiline
                        />

                        <View style={styles.freqRow}>
                            {(['daily', 'weekly', 'monthly'] as const).map(f => (
                                <TouchableOpacity
                                    key={f}
                                    onPress={() => setNewFreq(f)}
                                    style={[styles.freqChip, newFreq === f && styles.freqChipActive]}
                                >
                                    <NothingText size={12} color={newFreq === f ? theme.colors.background : theme.colors.text}>
                                        {f.toUpperCase()}
                                    </NothingText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <NothingButton
                            label="Start Tracking"
                            onPress={handleAddHabit}
                            style={styles.submitBtn}
                        />
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
        padding: 24,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    habitCard: {
        paddingVertical: 16,
    },
    habitMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    habitInfo: {
        flex: 1,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    streakText: {
        marginLeft: 6,
        letterSpacing: 1,
    },
    checkBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkBtnActive: {
        backgroundColor: theme.colors.text,
        borderColor: theme.colors.text,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    freqRow: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 24,
    },
    freqChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: 8,
    },
    freqChipActive: {
        backgroundColor: theme.colors.text,
        borderColor: theme.colors.text,
    },
    submitBtn: {
        marginTop: 8,
    }
});
