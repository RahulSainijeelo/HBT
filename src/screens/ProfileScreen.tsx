import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingButton } from '../components/NothingButton';
import { useAppStore } from '../store/useAppStore';
import { StorageService } from '../services/StorageService';
import { Download, LogOut, User, ShieldCheck } from 'lucide-react-native';

export const ProfileScreen = ({ navigation }: any) => {
    const { currentUser, logout, tasks, habits } = useAppStore();

    const handleDownload = async () => {
        if (currentUser) {
            const path = await StorageService.exportProfile(currentUser);
            Alert.alert('Download Ready', `Your data is saved at:\n${path}`);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to exit this profile?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <NothingText color={theme.colors.textSecondary}>BACK</NothingText>
                </TouchableOpacity>
                <NothingText variant="dot" size={32}>SYSTEM</NothingText>
            </View>

            <View style={styles.content}>
                <NothingCard padding="lg" bordered={false} style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <User size={48} color={theme.colors.text} />
                    </View>
                    <NothingText variant="bold" size={24}>{currentUser}</NothingText>
                    <NothingText color={theme.colors.textSecondary}>Active Profile</NothingText>
                </NothingCard>

                <View style={styles.statsRow}>
                    <NothingCard style={styles.statBox}>
                        <NothingText variant="dot" size={20}>{tasks.length}</NothingText>
                        <NothingText size={10} color={theme.colors.textSecondary}>TASKS</NothingText>
                    </NothingCard>
                    <NothingCard style={styles.statBox}>
                        <NothingText variant="dot" size={20}>{habits.length}</NothingText>
                        <NothingText size={10} color={theme.colors.textSecondary}>HABITS</NothingText>
                    </NothingCard>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={handleDownload}>
                        <NothingCard margin="xs" style={styles.actionItem}>
                            <View style={styles.row}>
                                <Download size={20} color={theme.colors.text} />
                                <NothingText style={styles.actionText}>Backup App Data</NothingText>
                            </View>
                        </NothingCard>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <NothingCard margin="xs" style={styles.actionItem}>
                            <View style={styles.row}>
                                <ShieldCheck size={20} color={theme.colors.text} />
                                <NothingText style={styles.actionText}>Privacy & Security</NothingText>
                            </View>
                        </NothingCard>
                    </TouchableOpacity>

                    <NothingButton
                        label="Logout Profile"
                        onPress={handleLogout}
                        variant="outline"
                        style={styles.logoutBtn}
                        icon={<LogOut size={20} color={theme.colors.primary} />}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
        backgroundColor: theme.colors.surface1,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: theme.colors.border,
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
    actions: {
        marginTop: 20,
    },
    actionItem: {
        paddingVertical: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 16,
        fontSize: 16,
    },
    logoutBtn: {
        marginTop: 40,
    }
});
