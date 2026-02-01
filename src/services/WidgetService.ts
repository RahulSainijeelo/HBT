import { NativeModules, Platform } from 'react-native';
import dayjs from 'dayjs';

// Accessing NativeModules safely
const WidgetBridge = NativeModules.WidgetBridge;

export interface WidgetItem {
    id: string;
    title: string;
    status: 'pending' | 'completed';
    type: 'task' | 'habit';
}

export const WidgetService = {
    updateWidget: (tasks: any[], habits: any[]) => {
        // Guard against non-Android or missing native module
        if (Platform.OS !== 'android') return;
        if (!WidgetBridge || typeof WidgetBridge.setWidgetData !== 'function') {
            console.warn('WidgetBridge native module not found or missing setWidgetData method');
            return;
        }

        try {
            const today = dayjs().format('YYYY-MM-DD');

            // Filter tasks and habits for today
            const widgetTasks: WidgetItem[] = (tasks || [])
                .filter(t => t.dueDate === today)
                .map(t => ({
                    id: t.id,
                    title: t.title,
                    status: t.completed ? 'completed' : 'pending',
                    type: 'task' as const
                }));

            const widgetHabits: WidgetItem[] = (habits || []).map(h => ({
                id: h.id,
                title: h.title,
                status: h.completedDates?.includes(today) ? 'completed' : 'pending',
                type: 'habit' as const
            }));

            const allItems = [...widgetTasks, ...widgetHabits];

            // Limit to a reasonable number of items to avoid extreme string sizes
            const limitedItems = allItems.slice(0, 50);

            WidgetBridge.setWidgetData(JSON.stringify(limitedItems));
        } catch (e) {
            console.error('WidgetService: Failed to update widget data', e);
        }
    },

    // Call this on logout or when no user is logged in
    clearWidgetData: () => {
        if (Platform.OS !== 'android') return;
        if (!WidgetBridge || typeof WidgetBridge.setWidgetData !== 'function') return;

        try {
            // Send a special marker to indicate not logged in
            WidgetBridge.setWidgetData(JSON.stringify([{ id: '__not_logged_in__', title: 'LOGIN', status: 'pending', type: 'task' }]));
        } catch (e) {
            console.error('WidgetService: Failed to clear widget data', e);
        }
    }
};
