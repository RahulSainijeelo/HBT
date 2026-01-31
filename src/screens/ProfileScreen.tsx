import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingButton } from '../components/NothingButton';
import { useAppStore } from '../store/useAppStore';
import { StorageService, UserProfile } from '../services/StorageService';
import { SettingsService } from '../services/SettingsService';
import { Download, LogOut, User, ShieldCheck, Check, Users } from 'lucide-react-native';

export const ProfileScreen = ({ navigation }: any) => {
    const { activeProfile, currentUser, logout, tasks, habits, login } = useAppStore();
    const { theme } = useTheme();
    const [isDefault, setIsDefault] = useState(false);
    const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);

    useEffect(() => {
        checkDefaultStatus();
        loadProfiles();
    }, [activeProfile]);

    const checkDefaultStatus = async () => {
        if (!activeProfile) return;
        const settings = await SettingsService.getSettings();
        // Check both ID (new) and Name (legacy fallback)
        setIsDefault(settings.defaultProfile === activeProfile.id || settings.defaultProfile === activeProfile.name);
    };

    const loadProfiles = async () => {
        const files = await StorageService.getProfiles();
        // Filter out current user by ID
        setAllProfiles(files.filter(p => p.id !== activeProfile?.id));
    };

    const toggleDefault = async (value: boolean) => {
        if (!activeProfile) return;

        if (value) {
            await SettingsService.updateSettings({ defaultProfile: activeProfile.id });
            setIsDefault(true);
            Alert.alert('Default Profile', `${activeProfile.name} is now the default profile.`);
        } else {
            await SettingsService.updateSettings({ defaultProfile: undefined });
            setIsDefault(false);
        }
    };

    const handleSwitchProfile = async (profile: UserProfile) => {
        Alert.alert(
            'Switch Profile',
            `Switch to ${profile.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Switch',
                    onPress: async () => {
                        await login(profile);
                        navigation.navigate('Main');
                    }
                }
            ]
        );
    };

    const handleDownload = async () => {
        if (activeProfile) {
            const path = await StorageService.exportProfile(activeProfile.id);
            Alert.alert('Download Ready', `Your data is saved at:\n${path}`);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to exit this profile?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout', style: 'destructive', onPress: () => {
                        logout();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <NothingText color={theme.colors.textSecondary}>BACK</NothingText>
                </TouchableOpacity>
                <NothingText variant="dot" size={32}>SYSTEM</NothingText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <NothingCard padding="lg" bordered={false} style={[styles.profileCard, { backgroundColor: theme.colors.surface1 }]}>
                    <View style={[styles.avatar, { borderColor: theme.colors.border }]}>
                        <User size={48} color={theme.colors.text} />
                    </View>
                    <NothingText variant="bold" size={24}>{activeProfile?.name || currentUser}</NothingText>
                    <NothingText color={theme.colors.textSecondary} size={12}>ID: {activeProfile?.id}</NothingText>
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

                {allProfiles.length > 0 && (
                    <View style={styles.section}>
                        <NothingText variant="medium" size={12} color={theme.colors.textSecondary} style={styles.sectionTitle}>
                            OTHER PROFILES
                        </NothingText>
                        {allProfiles.map(profile => (
                            <TouchableOpacity key={profile.id} onPress={() => handleSwitchProfile(profile)}>
                                <NothingCard margin="xs" style={styles.profileRow}>
                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Users size={18} color={theme.colors.textSecondary} />
                                            <NothingText style={styles.actionText}>{profile.name}</NothingText>
                                        </View>
                                        <NothingText color={theme.colors.primary} size={12}>SWITCH</NothingText>
                                    </View>
                                </NothingCard>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.actions}>
                    <NothingCard margin="xs" style={styles.actionItem}>
                        <View style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Check size={20} color={theme.colors.text} />
                                <NothingText style={styles.actionText}>Auto-Login Default</NothingText>
                            </View>
                            <Switch
                                value={isDefault}
                                onValueChange={toggleDefault}
                                trackColor={{ false: theme.colors.surface2, true: theme.colors.primary }}
                                thumbColor={theme.colors.background}
                            />
                        </View>
                    </NothingCard>

                    <TouchableOpacity onPress={handleDownload}>
                        <NothingCard margin="xs" style={styles.actionItem}>
                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Download size={20} color={theme.colors.text} />
                                    <NothingText style={styles.actionText}>Backup App Data</NothingText>
                                </View>
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
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 40,
    }
});
