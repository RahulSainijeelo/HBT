import { NativeModules, Platform } from 'react-native';
import dayjs from 'dayjs';

// Accessing NativeModules safely
const WidgetBridge = NativeModules.WidgetBridge;

export interface WidgetItem {
    id: string;
    title: string;
    status: 'pending' | 'completed';
    type: 'task' | 'habit';
    category?: string;
    dueDate?: string;
}

export interface WidgetLabel {
    id: string;
    name: string;
}

export const WidgetService = {
    updateWidget: (tasks: any[], habits: any[], labels?: any[]) => {
        // Guard against non-Android or missing native module
        if (Platform.OS !== 'android') return;
        if (!WidgetBridge || typeof WidgetBridge.setWidgetData !== 'function') {
            console.warn('WidgetBridge native module not found or missing setWidgetData method');
            return;
        }

        try {
            const today = dayjs().format('YYYY-MM-DD');

            // Include ALL tasks (not just today's) so widget can filter by label
            const widgetTasks: WidgetItem[] = (tasks || []).map(t => ({
                id: t.id,
                title: t.title,
                status: t.completed ? 'completed' : 'pending',
                type: 'task' as const,
                category: t.category || 'Inbox',
                dueDate: t.dueDate
            }));

            // Include all habits
            const widgetHabits: WidgetItem[] = (habits || []).map(h => ({
                id: h.id,
                title: h.title,
                status: h.completedDates?.includes(today) ? 'completed' : 'pending',
                type: 'habit' as const
            }));

            const allItems = [...widgetTasks, ...widgetHabits];

            // Limit to a reasonable number of items
            const limitedItems = allItems.slice(0, 100);

            // Also send labels if available
            const widgetLabels: WidgetLabel[] = (labels || []).map(l => ({
                id: l.id,
                name: l.name
            }));

            console.log('WidgetService: Sending', limitedItems.length, 'items and', widgetLabels.length, 'labels');

            WidgetBridge.setWidgetData(JSON.stringify(limitedItems));

            // Send labels separately if the method exists
            if (typeof WidgetBridge.setWidgetLabels === 'function') {
                WidgetBridge.setWidgetLabels(JSON.stringify(widgetLabels));
            }
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
