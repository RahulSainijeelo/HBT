import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingInput } from '../components/NothingInput';
import { NothingButton } from '../components/NothingButton';
import { useAppStore } from '../store/useAppStore';
import { StorageService } from '../services/StorageService';
import { User, FileInput, ArrowRight } from 'lucide-react-native';
import DocumentPicker from 'react-native-document-picker';
import { NothingLogo } from '../components/NothingLogo';

export const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [existingProfiles, setExistingProfiles] = useState<string[]>([]);
    const { setCurrentUser } = useAppStore();

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        const profiles = await StorageService.getUserFiles();
        setExistingProfiles(profiles);
    };

    const handleCreateProfile = async () => {
        if (username.trim()) {
            await setCurrentUser(username.trim());
        } else {
            Alert.alert('Error', 'Please enter a username');
        }
    };

    const handleSelectProfile = async (name: string) => {
        await setCurrentUser(name);
    };

    const handleImportProfile = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });
            if (res.uri) {
                const importedName = await StorageService.importProfile(res.uri);
                await loadProfiles();
                Alert.alert('Success', `Imported profile: ${importedName}`);
            }
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.error(err);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <NothingLogo size={80} />
                    <NothingText variant="dot" size={32} style={styles.title}>IDENTITY</NothingText>
                    <NothingText color={theme.colors.textSecondary}>Choose your profile to begin</NothingText>
                </View>

                <NothingCard padding="lg" margin="sm">
                    <NothingText variant="bold" size={20} style={styles.sectionTitle}>New Profile</NothingText>
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
                        <NothingText variant="bold" size={20} style={styles.sectionTitle}>Switch Profile</NothingText>
                        {existingProfiles.map((profile) => (
                            <TouchableOpacity key={profile} onPress={() => handleSelectProfile(profile)}>
                                <NothingCard margin="xs" style={styles.profileItem}>
                                    <View style={styles.row}>
                                        <User size={20} color={theme.colors.text} />
                                        <NothingText style={styles.profileName}>{profile}</NothingText>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
        alignItems: 'center',
    },
    dotIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
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
