import dayjs from "dayjs";
import { Task } from "../store/useAppStore";

export interface TaskItemProps {
    item: Task;
    theme: any;
    toggleTask: (id: string) => void;
    getPriorityColor: (p: number) => string;
}

export interface LabelPickerModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    insets: any;
    labels: string[];
    newLabel: string;
    setNewLabel: (l: string) => void;
    customLabel: string;
    setCustomLabel: (l: string) => void;
    addLabel: (l: string) => void;
}

export interface RemindersModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    insets: any;
    selectedReminders: string[];
    setSelectedReminders: (r: string[]) => void;
}

export interface DurationModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    insets: any;
    duration: number | null;
    setDuration: (m: number) => void;
}

export interface TimeDialModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    insets: any;
    timeMode: 'hour' | 'minute';
    setTimeMode: (m: 'hour' | 'minute') => void;
    newTime: string | undefined;
    setNewTime: (t: string) => void;
    panResponder: any;
}

export interface DueDateModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    insets: any;
    newDate: string;
    setNewDate: (d: string) => void;
    newTime: string | undefined;
    setNewTime: (t: string) => void;
    currentMonth: dayjs.Dayjs;
    setCurrentMonth: (m: dayjs.Dayjs) => void;
    isRepeatEnabled: boolean;
    setIsRepeatEnabled: (v: boolean) => void;
    onAddTime: () => void;
}

export
    interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    insets: any;
    newTitle: string;
    setNewTitle: (t: string) => void;
    newDate: string;
    newPriority: 1 | 2 | 3 | 4;
    setNewPriority: (p: 1 | 2 | 3 | 4) => void;
    duration: number | null;
    selectedReminders: string[];
    newLabel: string;
    onAddDate: () => void;
    onAddDuration: () => void;
    onAddReminders: () => void;
    onAddLabel: () => void;
    handleAddTask: () => void;
    getPriorityColor: (p: number) => string;
}