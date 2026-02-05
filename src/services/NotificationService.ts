import notifee, { AndroidImportance, TriggerType, TimestampTrigger, RepeatFrequency } from '@notifee/react-native';
import dayjs from 'dayjs';

class NotificationService {
    private channelId: string | null = null;

    // Initialize the notification channel (required for Android)
    async init() {
        if (this.channelId) return;

        this.channelId = await notifee.createChannel({
            id: 'rise-reminders',
            name: 'Rise Reminders',
            description: 'Task and Habit reminders from Rise',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        });

        console.log('NotificationService initialized with channel:', this.channelId);
    }

    // Request notification permission (Android 13+)
    async requestPermission(): Promise<boolean> {
        const settings = await notifee.requestPermission();
        return settings.authorizationStatus >= 1; // 1 = AUTHORIZED
    }

    // Schedule a notification for a specific time
    async scheduleNotification(params: {
        id: string;
        title: string;
        body: string;
        triggerTime: Date;
        data?: Record<string, string>;
    }) {
        await this.init();

        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: params.triggerTime.getTime(),
        };

        await notifee.createTriggerNotification(
            {
                id: params.id,
                title: params.title.toUpperCase(),
                body: params.body.toUpperCase(),
                android: {
                    channelId: this.channelId!,
                    smallIcon: 'ic_launcher',
                    color: '#FFFFFF',
                    pressAction: {
                        id: 'default',
                    },
                },
                data: params.data,
            },
            trigger
        );

        console.log(`Scheduled notification "${params.title}" for ${params.triggerTime}`);
    }

    // Schedule reminders for a task
    async scheduleTaskReminders(task: {
        id: string;
        title: string;
        dueDate?: string;
        dueTime?: string;
        reminders: string[];
    }) {
        if (!task.dueDate || !task.reminders || task.reminders.length === 0) {
            console.log('No reminders to schedule - missing date or reminders');
            return;
        }

        // Cancel any existing reminders for this task
        await this.cancelTaskReminders(task.id);

        // Parse the due datetime
        const dueTimeStr = task.dueTime || '09:00'; // Default to 9 AM
        const dueDateTime = dayjs(`${task.dueDate} ${dueTimeStr}`, 'YYYY-MM-DD HH:mm');

        console.log(`Scheduling reminders for "${task.title}" due at ${dueDateTime.format()}`);

        for (const reminder of task.reminders) {
            let triggerTime: dayjs.Dayjs | null = null;

            // Parse human-readable reminder strings
            if (reminder === 'At time of event') {
                triggerTime = dueDateTime;
            } else if (reminder === '10 minutes before' || reminder === '10m') {
                triggerTime = dueDateTime.subtract(10, 'minute');
            } else if (reminder === '30 minutes before' || reminder === '30m') {
                triggerTime = dueDateTime.subtract(30, 'minute');
            } else if (reminder === '1 hour before' || reminder === '1h') {
                triggerTime = dueDateTime.subtract(1, 'hour');
            } else if (reminder === '1 day before' || reminder === '1d') {
                triggerTime = dueDateTime.subtract(1, 'day');
            } else if (reminder.endsWith('m')) {
                const minutes = parseInt(reminder);
                triggerTime = dueDateTime.subtract(minutes, 'minute');
            } else if (reminder.endsWith('h')) {
                const hours = parseInt(reminder);
                triggerTime = dueDateTime.subtract(hours, 'hour');
            } else if (reminder.endsWith('d')) {
                const days = parseInt(reminder);
                triggerTime = dueDateTime.subtract(days, 'day');
            }

            if (!triggerTime) {
                console.log(`Unknown reminder format: ${reminder}`);
                continue;
            }

            // Only schedule if in the future
            if (triggerTime.isAfter(dayjs())) {
                console.log(`Scheduling reminder "${reminder}" for ${triggerTime.format()}`);
                await this.scheduleNotification({
                    id: `task-${task.id}-${reminder.replace(/\s/g, '_')}`,
                    title: '⏰ Task Reminder',
                    body: task.title,
                    triggerTime: triggerTime.toDate(),
                    data: { taskId: task.id, type: 'task' },
                });
            } else {
                console.log(`Skipping reminder "${reminder}" - time ${triggerTime.format()} is in the past`);
            }
        }

        // Show immediate confirmation that reminders were set
        await this.showNow('✅ Reminders Set', `${task.reminders.length} reminder(s) for "${task.title}"`);
    }

    // Schedule reminders for a habit
    async scheduleHabitReminders(habit: {
        id: string;
        title: string;
        reminders: string[];
        frequency: string;
    }) {
        if (!habit.reminders || habit.reminders.length === 0) {
            return;
        }

        // Cancel existing reminders
        await this.cancelHabitReminders(habit.id);

        // For habits, reminders are times of day (e.g., '08:00', '20:00')
        for (const reminderTime of habit.reminders) {
            const [hours, minutes] = reminderTime.split(':').map(Number);

            // Schedule for today or tomorrow if time has passed
            let triggerTime = dayjs().hour(hours).minute(minutes).second(0);
            if (triggerTime.isBefore(dayjs())) {
                triggerTime = triggerTime.add(1, 'day');
            }

            await this.scheduleNotification({
                id: `habit-${habit.id}-${reminderTime}`,
                title: '💪 Habit Reminder',
                body: `Time for: ${habit.title}`,
                triggerTime: triggerTime.toDate(),
                data: { habitId: habit.id, type: 'habit' },
            });
        }
    }

    // Cancel all reminders for a task
    async cancelTaskReminders(taskId: string) {
        const notifications = await notifee.getTriggerNotificationIds();
        const taskNotifications = notifications.filter(id => id.startsWith(`task-${taskId}-`));

        for (const id of taskNotifications) {
            await notifee.cancelNotification(id);
        }
    }

    // Cancel all reminders for a habit
    async cancelHabitReminders(habitId: string) {
        const notifications = await notifee.getTriggerNotificationIds();
        const habitNotifications = notifications.filter(id => id.startsWith(`habit-${habitId}-`));

        for (const id of habitNotifications) {
            await notifee.cancelNotification(id);
        }
    }

    // Cancel all notifications
    async cancelAll() {
        await notifee.cancelAllNotifications();
    }

    // Show an immediate notification (Nothing UI style)
    async showNow(title: string, body: string) {
        await this.init();

        await notifee.displayNotification({
            title: title.toUpperCase(),
            body: body.toUpperCase(),
            android: {
                channelId: this.channelId!,
                smallIcon: 'ic_launcher',
                color: '#FFFFFF',
            },
        });
    }
}

export const notificationService = new NotificationService();
