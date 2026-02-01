import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subTabs: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: 8,
        borderBottomWidth: 1,
    },
    tabItem: {
        paddingVertical: 12,
        marginRight: 24,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 13,
        letterSpacing: 1.5,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 2,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#FF0000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    browseContainer: {
        padding: 16,
        paddingBottom: 0,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 16,
        height: 48,
    },
    labelList: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    labelChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
    },
});
