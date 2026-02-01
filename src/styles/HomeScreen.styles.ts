import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        marginTop: 20,
    },
    calendarContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '70%',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 12,
        letterSpacing: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        marginLeft: 12,
    },
    emptyText: {
        marginLeft: 4,
        fontStyle: 'italic',
    }
});
