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
    dueTime?: string;
    priority?: number;
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

            // Include ALL tasks with full details
            const widgetTasks: WidgetItem[] = (tasks || []).map(t => ({
                id: t.id,
                title: t.title,
                status: t.completed ? 'completed' : 'pending',
                type: 'task' as const,
                category: t.category || 'Inbox',
                dueDate: t.dueDate || today,
                dueTime: t.dueTime || undefined,
                priority: t.priority || 4
            }));

            // Include all habits
            const widgetHabits: WidgetItem[] = (habits || []).map(h => ({
                id: h.id,
                title: h.title,
                status: h.completedDates?.includes(today) ? 'completed' : 'pending',
                type: 'habit' as const,
                dueDate: today, // Habits are always for today
                priority: 4 // Habits don't have priority
            }));

            const allItems = [...widgetTasks, ...widgetHabits];

            // Sort by date
            allItems.sort((a, b) => {
                const dateA = a.dueDate || today;
                const dateB = b.dueDate || today;
                return dateA.localeCompare(dateB);
            });

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

            // Dedicated payload for the 5 new sensor widgets
            const sensorData: any = {};
            const sensorTypes = ['pedometer', 'gps', 'noise', 'movement', 'screen'];

            sensorTypes.forEach(type => {
                const habit = (habits || []).find(h => h.sensorType === type);
                if (habit) {
                    let progress = habit.numericProgress?.[today] || 0;
                    let goal = habit.numericGoal || 1;
                    let unit = habit.numericUnit || '';

                    // For Check habits like movement/screen, use steps or completion
                    if (type === 'movement') {
                        progress = habit.numericProgress?.[today] || 0;
                        goal = 50;
                        unit = 'steps';
                    }

                    sensorData[type] = {
                        id: habit.id,
                        title: habit.title,
                        progress,
                        goal,
                        unit,
                        isCompleted: habit.completedDates?.includes(today) || false
                    };
                } else {
                    sensorData[type] = { exists: false };
                }
            });

            if (typeof WidgetBridge.setSensorData === 'function') {
                WidgetBridge.setSensorData(JSON.stringify(sensorData));
            } else {
                // Fallback: Store in general data if dedicated method not yet in native bridge
                WidgetBridge.setWidgetData(JSON.stringify({ ...limitedItems, sensorData }));
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
