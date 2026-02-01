import { StyleSheet } from "react-native";

export const AddTaskModalStyle = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    addModalContent: {
        paddingHorizontal: 15,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'center',
        marginVertical: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    mainInput: {
        fontSize: 20,
        borderBottomWidth: 1,
        paddingBottom: 12,
        marginBottom: 24,
    },
    quickOptions: {
        marginBottom: 32,
    },
    optionBtn: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        width: 80,
        display: 'flex',
        gap: 4,
        flexDirection: 'row',
        marginRight: 8,
    },
    submitBtn: {
        marginTop: 8,
    },
});
export const DueDateModalStyle = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    addModalContent: {
        height: 'auto',
        marginBottom: 0,
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 10,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'center',
        marginVertical: 10,
    },
    dateChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginRight: 8,
    },
    addTimeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        marginBottom: 16
    },
    dateOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    dateOptionText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
});

export const DurationModalStyle = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    addModalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'center',
        marginVertical: 10,
    },
    durationChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    durationChipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24
    }
});


export const LabelPickerModalStyle = StyleSheet.create({
    closeButton: {
        marginTop: 16,
        alignSelf: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    addModalContent: {
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 10,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'center',
        marginVertical: 10,
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
});


export const RemindersModalStyle = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    addModalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'center',
        marginVertical: 10,
    },
    dateOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    dateOptionText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
});

export const TimeDialModalStyle = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    addModalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'center',
        marginVertical: 10,
    },
});
export const TaskItemStyle = StyleSheet.create({
    taskCard: {
        paddingVertical: 12,
    },
    taskMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});