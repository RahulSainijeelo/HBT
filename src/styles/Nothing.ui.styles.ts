import { StyleSheet } from "react-native";

export const NothingButtonStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
});


export const NothingInputStyles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    error: {
        marginTop: 4,
        marginLeft: 4,
    },
});

export const NothingLogoStyles = StyleSheet.create({
    container: {
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    grid: {
        width: '60%',
        height: '60%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        margin: 4,
    }
});