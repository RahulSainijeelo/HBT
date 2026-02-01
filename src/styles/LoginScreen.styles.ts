import { StyleSheet } from "react-native";

export const LoginScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        marginBottom: 8,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    profilesSection: {
        marginTop: 32,
    },
    profileItem: {
        paddingVertical: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileName: {
        marginLeft: 12,
        fontSize: 18,
    },
    footer: {
        marginTop: 40,
    }
});