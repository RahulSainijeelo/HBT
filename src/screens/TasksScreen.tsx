import React from 'react';
import { View, FlatList, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react-native';
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
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { ManageLabelsModal } from '../components/tasks/ManageLabelsModal';
import { styles } from '../styles/TaskScreen.style';
import { getPriorityColor } from '../utils/TaskScreen.utils';
import { useAppStore } from '../store/useAppStore';
export const TasksScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
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
        currentMonth, setCurrentMonth,
        isRepeatEnabled, setIsRepeatEnabled,
        timeMode, setTimeMode,
        panResponder,
        allFilteredTasks,
        handleAddTask,
        onDateChange,
        onTimeChange,
        selectedTaskForView, setSelectedTaskForView,
        isDetailModalVisible, setIsDetailModalVisible,
        activeTask,
        handleTaskPress,
        handleAddSubtask,
        handleToggleSubtask,
        handleDeleteSubtask,
        deleteTask,
        handleUpdateTaskPriority,
        handleUpdateTaskLabel,
        handleUpdateTaskDate,
        handleUpdateTaskTime,
        handleOpenAddModal,
        newLabel, setNewLabel: setNewLabelProp,
        addLabel,
        deleteLabel,
        showManageLabelsModal, setShowManageLabelsModal,
    } = useTasksScreen();
    const insets = useSafeAreaInsets();

    React.useEffect(() => {
        if (route.params?.openAdd) {
            setIsAddModalVisible(true);
            navigation.setParams({ openAdd: undefined });
        }
    }, [route.params?.openAdd]);

    return (
        <>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={{ padding: 24 }}>
                    <NothingText variant="dot" style={{ fontFamily: 'ndot' }} size={32}>RISE TASKS</NothingText>
                </View>
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
                        <View style={styles.searchBarContainer}>
                            <View style={[
                                styles.searchBar,
                                {
                                    borderColor: theme.colors.border
                                }
                            ]}>
                                <Search size={20} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
                                <NothingInput
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'transparent',
                                        borderWidth: 0,
                                        height: 48,
                                        paddingHorizontal: 0,
                                        paddingTop: 0,
                                        marginBottom: -28,
                                    }}
                                />
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.manageButton,
                                    {
                                        borderColor: theme.colors.border
                                    }
                                ]}
                                onPress={() => setShowManageLabelsModal(true)}
                            >
                                <SlidersHorizontal size={20} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.labelList}>
                            <TouchableOpacity
                                onPress={() => setSelectedLabelFilter(null)}
                                style={[
                                    styles.labelChip,
                                    { backgroundColor: selectedLabelFilter === null ? theme.colors.primary : "transparent" }
                                ]}
                            >
                                <NothingText color={selectedLabelFilter === null ? theme.colors.background : theme.colors.text} size={12}>All</NothingText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setSelectedLabelFilter(selectedLabelFilter === 'Done' ? null : 'Done')}
                                style={[
                                    styles.labelChip,
                                    { backgroundColor: selectedLabelFilter === 'Done' ? theme.colors.primary : "transparent" }
                                ]}
                            >
                                <NothingText color={selectedLabelFilter === 'Done' ? theme.colors.background : theme.colors.text} size={12}>Done</NothingText>
                            </TouchableOpacity>
                            {labels.map(label => (
                                <TouchableOpacity
                                    key={label.id}
                                    onPress={() => setSelectedLabelFilter(selectedLabelFilter === label.name ? null : label.name)}
                                    style={[
                                        styles.labelChip,
                                        { backgroundColor: selectedLabelFilter === label.name ? theme.colors.primary : "transparent" }
                                    ]}
                                >
                                    <NothingText color={selectedLabelFilter === label.name ? theme.colors.background : theme.colors.text} size={12}>{label.name}</NothingText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={allFilteredTasks}
                    renderItem={({ item }) => (
                        <TaskItem
                            item={item}
                            theme={theme}
                            toggleTask={toggleTask}
                            deleteTask={deleteTask}
                            getPriorityColor={getPriorityColor}
                            onPress={handleTaskPress}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        allFilteredTasks.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <NothingText color={theme.colors.textSecondary}>No tasks found</NothingText>
                            </View>
                        ) : null
                    }
                />

                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                    onPress={handleOpenAddModal}
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
                newDate={isDetailModalVisible && activeTask ? activeTask.dueDate || dayjs().format('YYYY-MM-DD') : newDate}
                setNewDate={(date) => {
                    if (isDetailModalVisible && activeTask) {
                        handleUpdateTaskDate(activeTask.id, date);
                    } else {
                        setNewDate(date);
                    }
                }}
                newTime={isDetailModalVisible && activeTask ? activeTask.dueTime : newTime}
                setNewTime={(time) => {
                    if (isDetailModalVisible && activeTask) {
                        handleUpdateTaskTime(activeTask.id, time as any);
                    } else {
                        setNewTime(time as any);
                    }
                }}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                isRepeatEnabled={isRepeatEnabled}
                setIsRepeatEnabled={setIsRepeatEnabled}
                onAddTime={() => {
                    if (isDetailModalVisible && activeTask) {
                        setNewTime(activeTask.dueTime || dayjs().format('HH:mm'));
                    } else if (!newTime) {
                        setNewTime(dayjs().format('HH:mm'));
                    }
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
                setNewTime={(time) => {
                    if (isDetailModalVisible && activeTask) {
                        handleUpdateTaskTime(activeTask.id, time as any);
                    } else {
                        setNewTime(time as any);
                    }
                }}
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
                newLabel={isDetailModalVisible && activeTask ? activeTask.category : newLabel}
                setNewLabel={(label) => {
                    if (isDetailModalVisible && activeTask) {
                        handleUpdateTaskLabel(activeTask.id, label);
                    } else {
                        setNewLabelProp(label);
                    }
                }}
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

            <TaskDetailModal
                visible={isDetailModalVisible && !showAdvDateModal && !showAdvTimeModal && !showLabelPicker}
                onClose={() => setIsDetailModalVisible(false)}
                theme={theme}
                insets={insets}
                task={activeTask}
                onAddSubtask={handleAddSubtask}
                onToggleSubtask={handleToggleSubtask}
                onDeleteSubtask={handleDeleteSubtask}
                onUpdatePriority={handleUpdateTaskPriority}
                onUpdateLabel={() => setShowLabelPicker(true)}
                onUpdateDate={() => setShowAdvDateModal(true)}
                getPriorityColor={getPriorityColor}
            />

            <ManageLabelsModal
                visible={showManageLabelsModal}
                onClose={() => setShowManageLabelsModal(false)}
                theme={theme}
                insets={insets}
                labels={labels}
                addLabel={addLabel}
                deleteLabel={deleteLabel}
            />
        </>
    );
};
