import { create } from 'zustand';
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
    reminders: string[];
}

interface AppState {
    activeProfile: { id: string; name: string } | null;

    // Deprecated, use activeProfile
    currentUser: string | null;

    tasks: Task[];
    habits: Habit[];
    labels: string[];

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
    addLabel: (label: string) => void;

    // Habit Actions
    addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
    toggleHabit: (id: string, date: string) => void;
    deleteHabit: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    activeProfile: null,
    currentUser: null, // Computed getter ideally, but for now duplicate sync
    tasks: [],
    habits: [],
    labels: ['Inbox', 'Work', 'Personal'],

    login: async (profile) => {
        set({ activeProfile: profile, currentUser: profile.name });
        await get().loadData(profile.id);
    },

    createProfile: async (name) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newProfile = { id, name };
        set({ activeProfile: newProfile, currentUser: name, tasks: [], habits: [], labels: ['Inbox', 'Work', 'Personal'] });
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
                labels: data.labels || ['Inbox', 'Work', 'Personal']
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

    addLabel: (label) => {
        set((state) => ({ labels: [...state.labels, label] }));
        get().saveData();
    },

    addHabit: (habit) => {
        set((state) => ({
            habits: [...state.habits, { ...habit, id: Math.random().toString(36).substr(2, 9), completedDates: [], streak: 0 }]
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

                    const streak = newCompletedDates.length;

                    return { ...h, completedDates: newCompletedDates, streak };
                }
                return h;
            });
            return { habits };
        });
        get().saveData();
    },

    deleteHabit: (id) => {
        set((state) => ({
            habits: state.habits.filter((h) => h.id !== id)
        }));
        get().saveData();
    },
}));
