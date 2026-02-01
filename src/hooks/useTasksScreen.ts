import { useState, useRef } from 'react';
import { PanResponder, Platform } from 'react-native';
import dayjs from 'dayjs';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../theme';

export type SubTab = 'today' | 'upcoming' | 'browse';

export const useTasksScreen = () => {
    const [activeTab, setActiveTab] = useState<SubTab>('today');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const { tasks, toggleTask, labels, addTask, addLabel } = useAppStore();
    const { theme } = useTheme();

    // New task state
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [newTime, setNewTime] = useState<string | undefined>(undefined);
    const [newPriority, setNewPriority] = useState<1 | 2 | 3 | 4>(4);
    const [newLabel, setNewLabel] = useState('Inbox');
    const [customLabel, setCustomLabel] = useState('');

    // Browse State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLabelFilter, setSelectedLabelFilter] = useState<string | null>(null);

    // Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showAdvDateModal, setShowAdvDateModal] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showAdvTimeModal, setShowAdvTimeModal] = useState(false);
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [duration, setDuration] = useState<number | null>(null);
    const [showRemindersModal, setShowRemindersModal] = useState(false);
    const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    // Advanced Date Modal State
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
    const [timeMode, setTimeMode] = useState<'hour' | 'minute'>('hour');

    const timeModeRef = useRef(timeMode);
    timeModeRef.current = timeMode;
    const newTimeRef = useRef(newTime);
    newTimeRef.current = newTime;

    const handleTimeDrag = (x: number, y: number) => {
        const centerX = 130;
        const centerY = 130;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = angle + 90;
        if (angle < 0) angle += 360;

        if (timeModeRef.current === 'minute') {
            let minute = Math.round(angle / 6);
            if (minute === 60) minute = 0;
            const h = newTimeRef.current ? newTimeRef.current.split(':')[0] : '12';
            setNewTime(`${h}:${minute.toString().padStart(2, '0')}`);
        } else {
            let hourIndex = Math.round(angle / 30) % 12;
            let hour = 0;

            if (distance < 82.5) {
                const innerHours = [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                hour = innerHours[hourIndex];
            } else {
                const outerHours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                hour = outerHours[hourIndex];
            }

            const m = newTimeRef.current ? newTimeRef.current.split(':')[1] : '00';
            setNewTime(`${hour.toString().padStart(2, '0')}:${m}`);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                handleTimeDrag(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
            },
            onPanResponderMove: (evt) => {
                handleTimeDrag(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
            },
        })
    ).current;

    const allFilteredTasks = tasks.filter(t => {
        if (activeTab === 'today') {
            return t.dueDate === dayjs().format('YYYY-MM-DD') || !t.dueDate;
        }
        if (activeTab === 'upcoming') return t.dueDate && dayjs(t.dueDate).isAfter(dayjs(), 'day');
        if (activeTab === 'browse') {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLabel = selectedLabelFilter ? t.category === selectedLabelFilter : true;
            return matchesSearch && matchesLabel;
        }
        return true;
    });

    const activeTasks = allFilteredTasks.filter(t => !t.completed);
    const completedTasks = allFilteredTasks.filter(t => t.completed);

    const handleAddTask = () => {
        if (newTitle.trim()) {
            addTask({
                title: newTitle,
                dueDate: newDate,
                dueTime: newTime,
                priority: newPriority,
                category: newLabel,
                reminders: selectedReminders,
                subtasks: []
            });
            setNewTitle('');
            setNewTime(undefined);
            setSelectedReminders([]);
            setIsAddModalVisible(false);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setNewDate(dayjs(selectedDate).format('YYYY-MM-DD'));
        }
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowTimePicker(false);
        if (selectedDate) {
            setNewTime(dayjs(selectedDate).format('HH:mm'));
        }
    };

    return {
        activeTab, setActiveTab,
        isAddModalVisible, setIsAddModalVisible,
        tasks, toggleTask, labels, addTask, addLabel,
        theme,
        newTitle, setNewTitle,
        newDate, setNewDate,
        newTime, setNewTime,
        newPriority, setNewPriority,
        newLabel, setNewLabel,
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
        handleTimeDrag,
        panResponder,
        activeTasks,
        completedTasks,
        handleAddTask,
        onDateChange,
        onTimeChange
    };
};
