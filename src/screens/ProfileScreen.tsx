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
import { Download, LogOut, User, ShieldCheck, Check, Users, Github, Coffee, Heart } from 'lucide-react-native';
import { ProfileScreenStyle as styles } from '../styles/ProfileScreen.style';
import { requestStoragePermission } from '../utils/permissions';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Linking, Platform } from 'react-native';

export const ProfileScreen = ({ navigation }: any) => {
    const { activeProfile, currentUser, logout, tasks, habits, login } = useAppStore();
    const { theme } = useTheme();
    const [isDefault, setIsDefault] = useState(false);
    const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmData, setConfirmData] = useState<{ title: string; message: string; onConfirm: () => void; type?: 'danger' | 'info' }>({
        title: '',
        message: '',
        onConfirm: () => { },
    });

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
        setConfirmData({
            title: 'Switch Profile',
            message: `Do you want to switch to ${profile.name}? Any unsaved changes might be lost.`,
            type: 'info',
            onConfirm: async () => {
                setConfirmVisible(false);
                await login(profile);
                navigation.navigate('Main');
            }
        });
        setConfirmVisible(true);
    };

    const handleDownload = async () => {
        if (!activeProfile) return;

        const hasPermission = await requestStoragePermission();
        if (!hasPermission && Platform.OS === 'android') {
            Alert.alert('Permission Denied', 'Storage permission is required to save the backup.');
            return;
        }

        try {
            const path = await StorageService.exportProfile(activeProfile.id);
            Alert.alert('Backup Successful', `Your data report has been saved to the Downloads folder:\n\n${path}`);
        } catch (e) {
            Alert.alert('Backup Failed', 'An error occurred while creating the backup.');
        }
    };

    const handleLogout = () => {
        setConfirmData({
            title: 'Logout',
            message: 'Are you sure you want to exit your profile? You will need to login again to access your data.',
            type: 'danger',
            onConfirm: () => {
                setConfirmVisible(false);
                logout();
                navigation.replace('Login');
            }
        });
        setConfirmVisible(true);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <NothingText color={theme.colors.primary} size={20} style={{ fontFamily: 'ndot' }}>BACK</NothingText>
                </TouchableOpacity>
                {/* <NothingText variant="dot" size={32}>SYSTEM</NothingText> */}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <NothingCard padding="lg" bordered={false} style={[styles.profileCard, { backgroundColor: theme.colors.surface1, borderColor: theme.colors.primary, borderWidth: 1 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <View style={[styles.avatar, { borderColor: theme.colors.border }]}>
                            <User size={48} color={theme.colors.text} />
                        </View>
                        <View>
                            <NothingText variant="bold" style={{ fontFamily: 'ndot' }} size={40}>{activeProfile?.name || currentUser}</NothingText>
                            <NothingText color={theme.colors.textSecondary} size={12}>ID: {activeProfile?.id}</NothingText>
                        </View>
                    </View>
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

                {/* Developer Footer */}
                <View style={[styles.footer, { paddingBottom: 40, marginTop: 32 }]}>
                    <View style={{ height: 1, backgroundColor: theme.colors.border, width: '100%', marginBottom: 24, opacity: 0.5 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <NothingText size={10} color={theme.colors.textSecondary}>MADE WITH</NothingText>
                        <Heart size={12} color={theme.colors.error} fill={theme.colors.error} />
                        <NothingText size={10} color={theme.colors.textSecondary}>BY</NothingText>
                        <NothingText variant="bold" size={12} style={{ letterSpacing: 1 }}>RAHUL SAINI</NothingText>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 16 }}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/RahulSainijeelo')}>
                            <Github size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.buymeacoffee.com/rahulsainidev')}>
                            <Coffee size={24} color="#FFDD00" fill="#FFDD00" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <ConfirmationModal
                visible={confirmVisible}
                title={confirmData.title}
                message={confirmData.message}
                type={confirmData.type}
                onConfirm={confirmData.onConfirm}
                onCancel={() => setConfirmVisible(false)}
            />
        </SafeAreaView>
    );
};

