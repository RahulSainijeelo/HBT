import { create } from 'zustand';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: 1 | 2 | 3 | 4;
    category: string;
    dueDate?: string;
    subtasks?: { id: string; title: string; completed: boolean }[];
}

export interface Habit {
    id: string;
    title: string;
    frequency: 'daily' | 'weekly';
    completedDates: string[]; // Format: YYYY-MM-DD
    streak: number;
}

interface AppState {
    tasks: Task[];
    habits: Habit[];

    // Task Actions
    addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;

    // Habit Actions
    addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
    toggleHabit: (id: string, date: string) => void;
    deleteHabit: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    tasks: [],
    habits: [],

    addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9), completed: false }]
    })),

    toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
    })),

    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
    })),

    addHabit: (habit) => set((state) => ({
        habits: [...state.habits, { ...habit, id: Math.random().toString(36).substr(2, 9), completedDates: [], streak: 0 }]
    })),

    toggleHabit: (id, date) => set((state) => {
        const habits = state.habits.map((h) => {
            if (h.id === id) {
                const isCompleted = h.completedDates.includes(date);
                const newCompletedDates = isCompleted
                    ? h.completedDates.filter((d) => d !== date)
                    : [...h.completedDates, date];

                // Simple streak calculation (mock logic for now)
                const streak = newCompletedDates.length;

                return { ...h, completedDates: newCompletedDates, streak };
            }
            return h;
        });
        return { habits };
    }),

    deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id)
    })),
}));
