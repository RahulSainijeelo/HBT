import { create } from 'zustand';
import { StorageService } from '../services/StorageService';

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 1 | 2 | 3 | 4;
    category: string; // Used for Labels
    dueDate?: string; // YYYY-MM-DD
    dueTime?: string; // HH:mm
    duration?: number; // in minutes
    repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
    reminders: string[]; // ISO strings
    subtasks: { id: string; title: string; completed: boolean }[];
}

export interface Habit {
    id: string;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    targetDays?: number; // e.g. 3 times a week
    completedDates: string[]; // Format: YYYY-MM-DD
    streak: number;
    reminders: string[];
}

interface AppState {
    currentUser: string | null;
    tasks: Task[];
    habits: Habit[];
    labels: string[];

    // Auth/Profile Actions
    setCurrentUser: (username: string) => Promise<void>;
    logout: () => void;
    loadData: (username: string) => Promise<void>;
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
    currentUser: null,
    tasks: [],
    habits: [],
    labels: ['Inbox', 'Work', 'Personal'],

    setCurrentUser: async (username) => {
        set({ currentUser: username });
        await get().loadData(username);
    },

    logout: () => set({ currentUser: null, tasks: [], habits: [] }),

    loadData: async (username) => {
        const data = await StorageService.loadUserData(username);
        if (data) {
            set({
                tasks: data.tasks || [],
                habits: data.habits || [],
                labels: data.labels || ['Inbox', 'Work', 'Personal']
            });
        } else {
            set({ tasks: [], habits: [] });
        }
    },

    saveData: async () => {
        const { currentUser, tasks, habits, labels } = get();
        if (currentUser) {
            await StorageService.saveUserData(currentUser, { tasks, habits, labels });
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

                    // Simple streak calculation (can be improved)
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
