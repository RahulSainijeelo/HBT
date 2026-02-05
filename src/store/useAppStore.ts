import { create } from 'zustand';
import dayjs from 'dayjs';
import { StorageService } from '../services/StorageService';
import { WidgetService } from '../services/WidgetService';
import { notificationService } from '../services/NotificationService';

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 1 | 2 | 3 | 4;
    category: string;
    dueDate?: string;
    dueTime?: string;
    duration?: number;
    repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
    reminders: string[];
    subtasks: { id: string; title: string; completed: boolean }[];
}

export interface Habit {
    id: string;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    targetDays?: number;
    completedDates: string[];
    numericProgress?: Record<string, number>;
    streak: number;
    bestStreak: number;
    reminders: string[];
    type: 'check' | 'timer' | 'numeric';
    timerGoal?: number; // in seconds
    numericGoal?: number;
    numericUnit?: string;
    accumulatedTimeToday?: number; // for legacy timer
    timerProgress?: Record<string, number>; // New: { "date": seconds }
    color?: string;
    // Atomic Habit breakdown
    cue?: string;
    craving?: string;
    response?: string;
    reward?: string;
    howToApply?: string;
    // Sensor Information
    isSensorBased?: boolean;
    sensorType?: 'pedometer' | 'light' | 'screen' | 'noise' | 'movement' | 'gps';
}

export interface Label {
    id: string;
    name: string;
}

interface AppState {
    activeProfile: { id: string; name: string } | null;

    // Deprecated, use activeProfile
    currentUser: string | null;

    tasks: Task[];
    habits: Habit[];
    labels: Label[];

    // Auth/Profile Actions
    login: (profile: { id: string; name: string }) => Promise<void>;
    createProfile: (name: string) => Promise<void>; // New action

    // Legacy support wrapper
    setCurrentUser: (username: string) => Promise<void>;

    logout: () => void;
    loadData: (id: string) => Promise<void>;
    saveData: () => Promise<void>;

    // Task Actions
    addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    addLabel: (name: string) => void;
    deleteLabel: (id: string) => void;

    // Habit Actions
    addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'bestStreak'>) => void;
    toggleHabit: (id: string, date: string) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    updateNumericProgress: (id: string, date: string, amount: number) => void;
    updateTimerProgress: (id: string, date: string, seconds: number) => void;
    updateSensorProgress: (id: string, date: string, value: number) => void;
    deleteHabit: (id: string) => void;
}

const DEFAULT_LABELS: Label[] = [
    { id: 'l1', name: 'Inbox' },
    { id: 'l2', name: 'Work' },
    { id: 'l3', name: 'Personal' }
];

export const useAppStore = create<AppState>((set, get) => ({
    activeProfile: null,
    currentUser: null, // Computed getter ideally, but for now duplicate sync
    tasks: [],
    habits: [],
    labels: DEFAULT_LABELS,

    login: async (profile) => {
        set({ activeProfile: profile, currentUser: profile.name });
        await get().loadData(profile.id);

        // Auto-set as default if no default exists
        const { SettingsService } = await import('../services/SettingsService');
        const settings = await SettingsService.getSettings();
        if (!settings.defaultProfile) {
            await SettingsService.updateSettings({ defaultProfile: profile.id });
            console.log(`Auto-set ${profile.name} as default profile`);
        }
    },

    createProfile: async (name) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newProfile = { id, name };
        set({ activeProfile: newProfile, currentUser: name, tasks: [], habits: [], labels: DEFAULT_LABELS });
        await get().saveData();
    },

    // Legacy Support (Try to find ID by name or treat as legacy ID)
    setCurrentUser: async (usernameOrId) => {
        // This is a bit ambiguous now. If called from old code, it expects a username.
        // We will assume it might be a legacy ID.
        // Ideally we shouldn't use this anymore.
        set({ currentUser: usernameOrId, activeProfile: { id: usernameOrId, name: usernameOrId } });
        await get().loadData(usernameOrId);
    },

    logout: () => {
        WidgetService.clearWidgetData();
        set({ activeProfile: null, currentUser: null, tasks: [], habits: [] });
    },

    loadData: async (id) => {
        const data = await StorageService.loadUserData(id);
        if (data) {
            const tasks = data.tasks || [];
            const habits = data.habits || [];
            set({
                // If the loaded data has a name, update our state
                activeProfile: { id: id, name: data.name || get().activeProfile?.name || id },
                currentUser: data.name || get().currentUser,
                tasks,
                habits,
                labels: data.labels && Array.isArray(data.labels) && typeof data.labels[0] === 'object'
                    ? data.labels
                    : (data.labels || DEFAULT_LABELS).map((l: any) => typeof l === 'string' ? { id: Math.random().toString(36).substr(2, 9), name: l } : l)
            });
            // Update widget with loaded data
            const loadedLabels = data.labels && Array.isArray(data.labels) ? data.labels : DEFAULT_LABELS;
            WidgetService.updateWidget(tasks, habits, loadedLabels);
        } else {
            set({ tasks: [], habits: [] });
            WidgetService.updateWidget([], [], DEFAULT_LABELS);
        }
    },

    saveData: async () => {
        const { activeProfile, tasks, habits, labels } = get();
        if (activeProfile) {
            const dataToSave = {
                id: activeProfile.id,
                name: activeProfile.name,
                tasks,
                habits,
                labels
            };
            await StorageService.saveUserData(activeProfile.id, dataToSave);
            WidgetService.updateWidget(tasks, habits, labels);
        }
    },

    addTask: (task) => {
        const newId = Math.random().toString(36).substr(2, 9);
        set((state) => ({
            tasks: [...state.tasks, {
                ...task,
                id: newId,
                completed: false,
                subtasks: task.subtasks || []
            }]
        }));
        get().saveData();

        // Schedule reminders for this task
        if (task.reminders && task.reminders.length > 0) {
            notificationService.scheduleTaskReminders({
                id: newId,
                title: task.title,
                dueDate: task.dueDate,
                dueTime: task.dueTime,
                reminders: task.reminders
            });
        }
    },

    updateTask: (id, updates) => {
        set((state) => ({
            tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
        get().saveData();

        // Re-schedule reminders if task details changed
        const updatedTask = get().tasks.find(t => t.id === id);
        if (updatedTask && updatedTask.reminders && updatedTask.reminders.length > 0) {
            notificationService.scheduleTaskReminders(updatedTask);
        }
    },

    toggleTask: (id) => {
        set((state) => ({
            tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
        get().saveData();
    },

    deleteTask: (id) => {
        // Cancel reminders before deleting
        notificationService.cancelTaskReminders(id);

        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id)
        }));
        get().saveData();
    },

    addLabel: (name) => {
        set((state) => ({
            labels: [...state.labels, { id: Math.random().toString(36).substr(2, 9), name }]
        }));
        get().saveData();
    },

    deleteLabel: (id) => {
        set((state) => ({
            labels: state.labels.filter((l) => l.id !== id)
        }));
        get().saveData();
    },

    addHabit: (habit) => {
        const newId = Math.random().toString(36).substr(2, 9);
        set((state) => ({
            habits: [...state.habits, {
                ...habit,
                id: newId,
                completedDates: [],
                numericProgress: {},
                timerProgress: {},
                streak: 0,
                bestStreak: 0,
            }]
        }));
        get().saveData();

        // Schedule reminders for this habit
        if (habit.reminders && habit.reminders.length > 0) {
            notificationService.scheduleHabitReminders({
                id: newId,
                title: habit.title,
                reminders: habit.reminders,
                frequency: habit.frequency
            });
        }
    },

    toggleHabit: (id, date) => {
        set((state) => {
            const habits = state.habits.map((h) => {
                if (h.id === id) {
                    const isCompleted = h.completedDates.includes(date);
                    const newCompletedDates = isCompleted
                        ? h.completedDates.filter((d) => d !== date)
                        : [...h.completedDates, date];

                    // Recalculate streak correctly (contiguous days)
                    const sortedDates = [...newCompletedDates].sort((a, b) => b.localeCompare(a));
                    let streak = 0;
                    if (sortedDates.length > 0) {
                        const today = dayjs().format('YYYY-MM-DD');
                        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

                        if (sortedDates[0] === today || sortedDates[0] === yesterday) {
                            streak = 1;
                            for (let i = 0; i < sortedDates.length - 1; i++) {
                                const curr = dayjs(sortedDates[i]);
                                const next = dayjs(sortedDates[i + 1]);
                                if (curr.subtract(1, 'day').format('YYYY-MM-DD') === next.format('YYYY-MM-DD')) {
                                    streak++;
                                } else {
                                    break;
                                }
                            }
                        }
                    }

                    const bestStreak = Math.max(h.bestStreak || 0, streak);

                    return { ...h, completedDates: newCompletedDates, streak, bestStreak };
                }
                return h;
            });
            return { habits };
        });
        get().saveData();
    },

    updateNumericProgress: (id, date, amount) => {
        set((state) => {
            const habits = state.habits.map((h) => {
                if (h.id === id && h.type === 'numeric') {
                    const currentProgress = h.numericProgress?.[date] || 0;
                    const newProgress = Math.max(0, currentProgress + amount);
                    const numericProgress = { ...h.numericProgress, [date]: newProgress };

                    // Check if goal reached to update completedDates
                    const isCompleted = h.completedDates.includes(date);
                    const goalReached = newProgress >= (h.numericGoal || 1);
                    let newCompletedDates = [...h.completedDates];

                    if (goalReached && !isCompleted) {
                        newCompletedDates.push(date);
                    } else if (!goalReached && isCompleted) {
                        newCompletedDates = newCompletedDates.filter(d => d !== date);
                    }

                    // For numeric habits, we don't recalculate streak here because toggleHabit handles it via completedDates
                    // But we SHOULD trigger the same streak logic if completedDates changed.
                    // Instead of duplicating, we'll let the component call toggleHabit or we can refactor.
                    // For now, let's just update the habit.

                    return { ...h, numericProgress, completedDates: newCompletedDates };
                }
                return h;
            });
            return { habits };
        });
        // We need to trigger streak recalculation if completedDates changed
        // Actually, let's just call toggleHabit internally if we want, or just re-calc here.
        // I'll re-run streak calc for consistency.
        set((state) => ({
            habits: state.habits.map(h => {
                if (h.id === id) {
                    const sortedDates = [...h.completedDates].sort((a, b) => b.localeCompare(a));
                    let streak = 0;
                    if (sortedDates.length > 0) {
                        const today = dayjs().format('YYYY-MM-DD');
                        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
                        if (sortedDates[0] === today || sortedDates[0] === yesterday) {
                            streak = 1;
                            for (let i = 0; i < sortedDates.length - 1; i++) {
                                const curr = dayjs(sortedDates[i]);
                                const next = dayjs(sortedDates[i + 1]);
                                if (curr.subtract(1, 'day').format('YYYY-MM-DD') === next.format('YYYY-MM-DD')) {
                                    streak++;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                    const bestStreak = Math.max(h.bestStreak || 0, streak);
                    return { ...h, streak, bestStreak };
                }
                return h;
            })
        }));
        get().saveData();
    },

    updateTimerProgress: (id, date, seconds) => {
        set((state) => {
            const habits = state.habits.map((h) => {
                if (h.id === id && h.type === 'timer') {
                    const currentProgress = h.timerProgress?.[date] || 0;
                    const newProgress = currentProgress + seconds;
                    const timerProgress = { ...h.timerProgress, [date]: newProgress };

                    const isCompleted = h.completedDates.includes(date);
                    const goalReached = newProgress >= (h.timerGoal || 1);
                    let newCompletedDates = [...h.completedDates];

                    if (goalReached && !isCompleted) {
                        newCompletedDates.push(date);
                    } else if (!goalReached && isCompleted) {
                        newCompletedDates = newCompletedDates.filter(d => d !== date);
                    }

                    return { ...h, timerProgress, completedDates: newCompletedDates };
                }
                return h;
            });
            return { habits };
        });
        // Streak logic again
        set((state) => ({
            habits: state.habits.map(h => {
                if (h.id === id) {
                    const sortedDates = [...h.completedDates].sort((a, b) => b.localeCompare(a));
                    let streak = 0;
                    if (sortedDates.length > 0) {
                        const today = dayjs().format('YYYY-MM-DD');
                        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
                        if (sortedDates[0] === today || sortedDates[0] === yesterday) {
                            streak = 1;
                            for (let i = 0; i < sortedDates.length - 1; i++) {
                                const curr = dayjs(sortedDates[i]);
                                const next = dayjs(sortedDates[i + 1]);
                                if (curr.subtract(1, 'day').format('YYYY-MM-DD') === next.format('YYYY-MM-DD')) {
                                    streak++;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                    const bestStreak = Math.max(h.bestStreak || 0, streak);
                    return { ...h, streak, bestStreak };
                }
                return h;
            })
        }));
        get().saveData();
    },

    updateHabit: (id, updates) => {
        set((state) => ({
            habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h)
        }));
        get().saveData();
    },

    updateSensorProgress: (id, date, value) => {
        set((state) => ({
            habits: state.habits.map(h => {
                if (h.id === id) {
                    const numericProgress = { ...h.numericProgress };
                    numericProgress[date] = value;

                    // Simple completion logic: if current value >= goal, mark completed
                    let newCompletedDates = [...h.completedDates];
                    const goalReached = value >= (h.numericGoal || 1);
                    const isCompleted = newCompletedDates.includes(date);

                    if (goalReached && !isCompleted) {
                        newCompletedDates.push(date);
                    } else if (!goalReached && isCompleted) {
                        newCompletedDates = newCompletedDates.filter(d => d !== date);
                    }

                    return { ...h, numericProgress, completedDates: newCompletedDates };
                }
                return h;
            })
        }));
        // Re-calculate streak (can be refactored into a reusable helper)
        set((state) => ({
            habits: state.habits.map(h => {
                if (h.id === id) {
                    const sortedDates = [...h.completedDates].sort((a, b) => b.localeCompare(a));
                    let streak = 0;
                    if (sortedDates.length > 0) {
                        const today = dayjs().format('YYYY-MM-DD');
                        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
                        if (sortedDates[0] === today || sortedDates[0] === yesterday) {
                            streak = 1;
                            for (let i = 0; i < sortedDates.length - 1; i++) {
                                const curr = dayjs(sortedDates[i]);
                                const next = dayjs(sortedDates[i + 1]);
                                if (curr.subtract(1, 'day').format('YYYY-MM-DD') === next.format('YYYY-MM-DD')) {
                                    streak++;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                    const bestStreak = Math.max(h.bestStreak || 0, streak);
                    return { ...h, streak, bestStreak };
                }
                return h;
            })
        }));
        get().saveData();
    },

    deleteHabit: (id) => {
        // Cancel reminders before deleting
        notificationService.cancelHabitReminders(id);

        set((state) => ({
            habits: state.habits.filter((h) => h.id !== id)
        }));
        get().saveData();
    },
}));
