import { create } from 'zustand';
import dayjs from 'dayjs';
import { StorageService } from '../services/StorageService';

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
    streak: number;
    bestStreak: number;
    reminders: string[];
    type: 'check' | 'timer';
    timerGoal?: number; // in seconds
    accumulatedTimeToday?: number; // for the current day
    color?: string;
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
    addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'bestStreak' | 'accumulatedTimeToday'>) => void;
    toggleHabit: (id: string, date: string) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
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

    logout: () => set({ activeProfile: null, currentUser: null, tasks: [], habits: [] }),

    loadData: async (id) => {
        const data = await StorageService.loadUserData(id);
        if (data) {
            set({
                // If the loaded data has a name, update our state
                activeProfile: { id: id, name: data.name || get().activeProfile?.name || id },
                currentUser: data.name || get().currentUser,
                tasks: data.tasks || [],
                habits: data.habits || [],
                labels: data.labels && Array.isArray(data.labels) && typeof data.labels[0] === 'object'
                    ? data.labels
                    : (data.labels || DEFAULT_LABELS).map((l: any) => typeof l === 'string' ? { id: Math.random().toString(36).substr(2, 9), name: l } : l)
            });
        } else {
            set({ tasks: [], habits: [] });
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
        }
    },

    addTask: (task) => {
        set((state) => ({
            tasks: [...state.tasks, {
                ...task,
                id: Math.random().toString(36).substr(2, 9),
                completed: false,
                subtasks: task.subtasks || []
            }]
        }));
        get().saveData();
    },

    updateTask: (id, updates) => {
        set((state) => ({
            tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
        get().saveData();
    },

    toggleTask: (id) => {
        set((state) => ({
            tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
        get().saveData();
    },

    deleteTask: (id) => {
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
        set((state) => ({
            habits: [...state.habits, {
                ...habit,
                id: Math.random().toString(36).substr(2, 9),
                completedDates: [],
                streak: 0,
                bestStreak: 0,
                accumulatedTimeToday: 0
            }]
        }));
        get().saveData();
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
                    // This is a simple version: sort and count back from today
                    const sortedDates = [...newCompletedDates].sort((a, b) => b.localeCompare(a));
                    let streak = 0;
                    if (sortedDates.length > 0) {
                        const today = dayjs().format('YYYY-MM-DD');
                        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

                        // If not completed today or yesterday, streak is broken (unless it's currently today)
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

    updateHabit: (id, updates) => {
        set((state) => ({
            habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h)
        }));
        get().saveData();
    },

    deleteHabit: (id) => {
        set((state) => ({
            habits: state.habits.filter((h) => h.id !== id)
        }));
        get().saveData();
    },
}));
