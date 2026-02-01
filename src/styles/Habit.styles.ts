import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

export const HabitDetailScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        padding: 8,
    },
    scrollContent: {
        padding: 24,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    statVal: {
        marginVertical: 4,
    },
    mainArea: {
        alignItems: 'center',
        marginVertical: 40,
    },
    timerContainer: {
        alignItems: 'center',
        width: '100%',
    },
    circleOutline: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    progressOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    timerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginTop: 40,
    },
    playBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    controlBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkContainer: {
        alignItems: 'center',
    },
    largeCheckBtn: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        letterSpacing: 2,
        marginBottom: 12,
        marginTop: 20,
    },
    historyCard: {
        padding: 16,
    },
    heatmap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    heatDot: {
        width: 14,
        height: 14,
        borderRadius: 2,
    },
    deleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 48,
        paddingVertical: 16,
        opacity: 0.6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        // dynamic
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    }
});

export const HabitKnowledgeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        padding: 8,
    },
    scrollContent: {
        padding: 24,
    },
    introSection: {
        marginBottom: 32,
    },
    title: {
        marginBottom: 8,
    },
    sectionCard: {
        padding: 20,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    subTitle: {
        letterSpacing: 1.5,
        marginBottom: 20,
    },
    lawRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    lawIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    lawText: {
        flex: 1,
    },
    commitBtn: {
        marginTop: 20,
        marginBottom: 40,
    }
});

export const HabitsScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    habitCard: {
        paddingVertical: 16,
    },
    habitMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    habitInfo: {
        flex: 1,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    streakText: {
        marginLeft: 6,
        letterSpacing: 1,
    },
    checkBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        // dynamic
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    freqRow: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 24,
    },
    freqChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    submitBtn: {
        marginTop: 8,
    },
    discoverySection: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 12,
    },
    templateCard: {
        width: 140,
        padding: 12,
        marginRight: 12,
        borderWidth: 1,
    },
    templateIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    typeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    }
}); 