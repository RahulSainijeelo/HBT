import React from 'react';
import { View, FlatList, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react-native';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NothingText } from '../components/NothingText';
import { NothingInput } from '../components/NothingInput';
import { useTasksScreen, SubTab } from '../hooks/useTasksScreen';
import { TaskItem } from '../components/tasks/TaskItem';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { DueDateModal } from '../components/tasks/DueDateModal';
import { TimeDialModal } from '../components/tasks/TimeDialModal';
import { DurationModal } from '../components/tasks/DurationModal';
import { RemindersModal } from '../components/tasks/RemindersModal';
import { LabelPickerModal } from '../components/tasks/LabelPickerModal';
import { styles } from './TaskScreen.style';

export const TasksScreen = () => {
    const {
        activeTab, setActiveTab,
        isAddModalVisible, setIsAddModalVisible,
        toggleTask, labels,
        theme,
        newTitle, setNewTitle,
        newDate, setNewDate,
        newTime, setNewTime,
        newPriority, setNewPriority,
        customLabel, setCustomLabel,
        searchQuery, setSearchQuery,
        selectedLabelFilter, setSelectedLabelFilter,
        showDatePicker, setShowDatePicker,
        showAdvDateModal, setShowAdvDateModal,
        showTimePicker, setShowTimePicker,
        showAdvTimeModal, setShowAdvTimeModal,
        showDurationModal, setShowDurationModal,
        duration, setDuration,
        showRemindersModal, setShowRemindersModal,
        selectedReminders, setSelectedReminders,
        showLabelPicker, setShowLabelPicker,
        showCompleted, setShowCompleted,
        currentMonth, setCurrentMonth,
        isRepeatEnabled, setIsRepeatEnabled,
        timeMode, setTimeMode,
        panResponder,
        activeTasks,
        completedTasks,
        handleAddTask,
        onDateChange,
        onTimeChange,
        addLabel,
        newLabel, setNewLabel,
    } = useTasksScreen();

    const insets = useSafeAreaInsets();

    const getPriorityColor = (p: number) => {
        switch (p) {
            case 1: return '#FF0000';
            case 2: return '#FFAB00';
            case 3: return '#0052CC';
            default: return '#333';
        }
    };

    return (
        <>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={[styles.subTabs, { borderBottomColor: theme.colors.border }]}>
                    {(['today', 'upcoming', 'browse'] as SubTab[]).map(tab => (
                        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
                            <NothingText
                                variant={activeTab === tab ? 'bold' : 'regular'}
                                color={activeTab === tab ? theme.colors.text : theme.colors.textSecondary}
                                style={styles.tabText}
                            >
                                {tab.toUpperCase()}
                            </NothingText>
                            {activeTab === tab && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {activeTab === 'browse' && (
                    <View style={[styles.browseContainer, { borderBottomColor: theme.colors.border }]}>
                        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface1 }]}>
                            <NothingInput
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.labelList}>
                            <TouchableOpacity
                                onPress={() => setSelectedLabelFilter(null)}
                                style={[
                                    styles.labelChip,
                                    { backgroundColor: selectedLabelFilter === null ? theme.colors.primary : theme.colors.surface2 }
                                ]}
                            >
                                <NothingText color={selectedLabelFilter === null ? theme.colors.background : theme.colors.text} size={12}>All</NothingText>
                            </TouchableOpacity>
                            {labels.map(label => (
                                <TouchableOpacity
                                    key={label}
                                    onPress={() => setSelectedLabelFilter(selectedLabelFilter === label ? null : label)}
                                    style={[
                                        styles.labelChip,
                                        { backgroundColor: selectedLabelFilter === label ? theme.colors.primary : theme.colors.surface2 }
                                    ]}
                                >
                                    <NothingText color={selectedLabelFilter === label ? theme.colors.background : theme.colors.text} size={12}>{label}</NothingText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <FlatList
                    data={activeTasks}
                    renderItem={({ item }) => <TaskItem item={item} theme={theme} toggleTask={toggleTask} getPriorityColor={getPriorityColor} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        activeTasks.length === 0 && completedTasks.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <NothingText color={theme.colors.textSecondary}>No tasks found</NothingText>
                            </View>
                        ) : null
                    }
                    ListFooterComponent={
                        completedTasks.length > 0 ? (
                            <View style={{ marginTop: 24 }}>
                                <TouchableOpacity
                                    onPress={() => setShowCompleted(!showCompleted)}
                                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                                >
                                    <NothingText variant="bold" color={theme.colors.textSecondary}>COMPLETED ({completedTasks.length})</NothingText>
                                    {showCompleted ? <ChevronUp size={16} color={theme.colors.textSecondary} style={{ marginLeft: 8 }} /> : <ChevronDown size={16} color={theme.colors.textSecondary} style={{ marginLeft: 8 }} />}
                                </TouchableOpacity>
                                {showCompleted && completedTasks.map(item => (
                                    <TaskItem key={item.id} item={item} theme={theme} toggleTask={toggleTask} getPriorityColor={getPriorityColor} />
                                ))}
                            </View>
                        ) : null
                    }
                />

                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Plus color={theme.colors.background} size={32} />
                </TouchableOpacity>
            </SafeAreaView>

            <AddTaskModal
                visible={isAddModalVisible && !showAdvDateModal && !showAdvTimeModal && !showDurationModal && !showRemindersModal && !showLabelPicker}
                onClose={() => setIsAddModalVisible(false)}
                theme={theme}
                insets={insets}
                newTitle={newTitle}
                setNewTitle={setNewTitle}
                newDate={newDate}
                newPriority={newPriority}
                setNewPriority={setNewPriority as any}
                duration={duration}
                selectedReminders={selectedReminders}
                newLabel={newLabel}
                onAddDate={() => setShowAdvDateModal(true)}
                onAddDuration={() => setShowDurationModal(true)}
                onAddReminders={() => setShowRemindersModal(true)}
                onAddLabel={() => setShowLabelPicker(true)}
                handleAddTask={handleAddTask}
                getPriorityColor={getPriorityColor}
            />

            <DueDateModal
                visible={showAdvDateModal}
                onClose={() => setShowAdvDateModal(false)}
                theme={theme}
                insets={insets}
                newDate={newDate}
                setNewDate={setNewDate}
                newTime={newTime}
                setNewTime={setNewTime as any}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                isRepeatEnabled={isRepeatEnabled}
                setIsRepeatEnabled={setIsRepeatEnabled}
                onAddTime={() => {
                    if (!newTime) setNewTime(dayjs().format('HH:mm'));
                    setShowAdvDateModal(false);
                    setShowAdvTimeModal(true);
                }}
            />

            <TimeDialModal
                visible={showAdvTimeModal}
                onClose={() => setShowAdvTimeModal(false)}
                theme={theme}
                insets={insets}
                timeMode={timeMode}
                setTimeMode={setTimeMode}
                newTime={newTime}
                setNewTime={setNewTime as any}
                panResponder={panResponder}
            />

            <DurationModal
                visible={showDurationModal}
                onClose={() => setShowDurationModal(false)}
                theme={theme}
                insets={insets}
                duration={duration}
                setDuration={setDuration}
            />

            <RemindersModal
                visible={showRemindersModal}
                onClose={() => setShowRemindersModal(false)}
                theme={theme}
                insets={insets}
                selectedReminders={selectedReminders}
                setSelectedReminders={setSelectedReminders}
            />

            <LabelPickerModal
                visible={showLabelPicker}
                onClose={() => setShowLabelPicker(false)}
                theme={theme}
                insets={insets}
                labels={labels}
                newLabel={newLabel}
                setNewLabel={setNewLabel}
                customLabel={customLabel}
                setCustomLabel={setCustomLabel}
                addLabel={addLabel}
            />

            {showDatePicker && (
                <DateTimePicker
                    value={dayjs(newDate).toDate()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={newTime ? dayjs(newDate + ' ' + newTime).toDate() : new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onTimeChange}
                />
            )}
        </>
    );
};
