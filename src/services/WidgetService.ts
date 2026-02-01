import { NativeModules, Platform } from 'react-native';
import dayjs from 'dayjs';

const { WidgetBridge } = NativeModules;

export interface WidgetItem {
    id: string;
    title: string;
    status: 'pending' | 'completed';
    type: 'task' | 'habit';
}

export const WidgetService = {
    updateWidget: (tasks: any[], habits: any[]) => {
        if (Platform.OS !== 'android' || !WidgetBridge) return;

        const today = dayjs().format('YYYY-MM-DD');

        // Filter tasks and habits for today
        const widgetTasks: WidgetItem[] = tasks
            .filter(t => t.dueDate === today) // Fix: use dueDate instead of date
            .map(t => ({
                id: t.id,
                title: t.title,
                status: t.completed ? 'completed' : 'pending',
                type: 'task' as const
            }));

        const widgetHabits: WidgetItem[] = habits.map(h => ({
            id: h.id,
            title: h.title, // Fix: use title instead of name
            status: h.completedDates?.includes(today) ? 'completed' : 'pending', // Fix: use completedDates array
            type: 'habit' as const
        }));

        const allItems = [...widgetTasks, ...widgetHabits];

        try {
            WidgetBridge.setWidgetData(JSON.stringify(allItems));
        } catch (e) {
            console.error('Failed to update widget data', e);
        }
    }
};
