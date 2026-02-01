import { StyleSheet } from "react-native";
import { theme } from "../theme";

export const DashboardScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        marginTop: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        marginTop: 24,
        marginBottom: 16,
        marginLeft: 4,
    },
    itemCard: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        marginLeft: 12,
    },
    habitsRow: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    habitWidget: {
        width: 140,
        height: 140,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    streakText: {
        marginTop: 12,
        marginBottom: 4,
    }
});
