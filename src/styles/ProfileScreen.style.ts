import { StyleSheet } from "react-native";

export const ProfileScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        padding: 24,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderStyle: 'dotted',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statBox: {
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
        paddingVertical: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        marginLeft: 4,
        letterSpacing: 1,
    },
    profileRow: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    actions: {
        marginTop: 0,
    },
    actionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 16,
        fontSize: 16,
    },
    logoutBtn: {
        marginTop: 40,
        marginBottom: 20,
    },
    footer: {
        alignItems: 'center',
        paddingHorizontal: 24,
    }
});