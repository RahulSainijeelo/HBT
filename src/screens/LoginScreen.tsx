import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore } from '../store/useAppStore';
import { StorageService, UserProfile } from '../services/StorageService';
import { User, FileInput, ArrowRight } from 'lucide-react-native';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { NothingLogo } from '../components/NothingLogo';
import { LoginScreenStyles as styles } from '../styles/LoginScreen.styles';

export const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [existingProfiles, setExistingProfiles] = useState<UserProfile[]>([]);
    const { login, createProfile } = useAppStore();
    const { theme, isDark } = useTheme();

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        const profiles = await StorageService.getProfiles();
        setExistingProfiles(profiles);
    };

    const handleCreateProfile = async () => {
        if (username.trim()) {
            await createProfile(username.trim());
            // No need to reload profiles, we are logging in immediately
            navigation.replace('Main');
        } else {
            Alert.alert('Error', 'Please enter a username');
        }
    };

    const handleSelectProfile = async (profile: UserProfile) => {
        await login(profile);
        navigation.replace('Main');
    };

    const handleImportProfile = async () => {
        try {
            const [res] = await pick({
                type: [types.allFiles],
            });
            if (res.uri) {
                const importedProfile = await StorageService.importProfile(res.uri);
                await login(importedProfile); // Auto-login imported user
                navigation.replace('Main');
            }
        } catch (err) {
            if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
                // Ignore cancel
            } else {
                console.error(err);
                Alert.alert('Import Failed', 'Could not import the selected file. Ensure it is a valid Rise profile.');
            }
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} >
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor="transparent"
                translucent
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
            >
                <View style={styles.header}>
                    <NothingLogo size={80} />
                    <NothingText variant="dot" size={32} style={[styles.title, { color: theme.colors.primary, fontFamily: 'ndot' }]}>RISE</NothingText>
                    <NothingText color={theme.colors.textSecondary} style={{ fontFamily: 'ndot' }}>Choose your profile to begin</NothingText>
                </View>

                <NothingCard padding="lg" margin="sm">
                    <NothingText variant="bold" size={20} style={[styles.sectionTitle, { fontFamily: 'ndot' }]}>New Profile</NothingText>
                    <NothingInput
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <NothingButton
                        label="Create & Enter"
                        onPress={handleCreateProfile}
                        icon={<ArrowRight size={20} color={theme.colors.background} />}
                    />
                </NothingCard>

                {existingProfiles.length > 0 && (
                    <View style={styles.profilesSection}>
                        <NothingText variant="bold" size={20} style={[styles.sectionTitle, { fontFamily: 'ndot' }]}>Switch Profile</NothingText>
                        {existingProfiles.map((profile) => (
                            <TouchableOpacity key={profile.id} onPress={() => handleSelectProfile(profile)}>
                                <NothingCard margin="xs" style={styles.profileItem}>
                                    <View style={styles.row}>
                                        <User size={20} color={theme.colors.text} />
                                        <NothingText style={styles.profileName}>{profile.name}</NothingText>
                                        <NothingText size={10} color={theme.colors.textSecondary} style={{ marginLeft: 'auto' }}>
                                            ID: {profile.id.substring(0, 5)}...
                                        </NothingText>
                                    </View>
                                </NothingCard>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.footer}>
                    <NothingButton
                        label="Import Profile File"
                        variant="outline"
                        onPress={handleImportProfile}
                        icon={<FileInput size={20} color={theme.colors.text} />}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};