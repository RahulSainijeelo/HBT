import { StyleSheet } from "react-native";
import { theme } from "../theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subTabs: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        borderBottomWidth: 1,
    },
    tabItem: {
        paddingBottom: 8,
        marginRight: 24,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 15,
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
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 48,
        borderWidth: 1,
    },
    manageButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
        borderWidth: 1,
    },
    labelList: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    labelChip: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
    },
});
