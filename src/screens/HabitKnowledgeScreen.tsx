import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingButton } from '../components/NothingButton';
import { NothingInput } from '../components/NothingInput';
import { ArrowLeft, Zap, Check, ShieldCheck, Activity, Target } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { HabitKnowledgeScreenStyles as styles } from '../styles/Habit.styles';
import { request, PERMISSIONS, RESULTS, Permission, check } from 'react-native-permissions';
import { NothingPermissionModal } from '../components/NothingPermissionModal';

export const HabitKnowledgeScreen = ({ route, navigation }: any) => {
    const { template } = route.params;
    const { theme } = useTheme();
    const { addHabit } = useAppStore();
    const [goalValue, setGoalValue] = useState(template.goal?.toString() || "");

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        visible: boolean;
        type: 'permission_blocked' | 'hardware_missing' | 'direct_request';
        sensorName: string;
    }>({
        visible: false,
        type: 'direct_request',
        sensorName: template.sensorType || 'sensor'
    });

    const handleStartTracking = async () => {
        console.log("handleStartTracking triggered for:", template.title);
        // Handle Permissions
        if (template.isSensorBased && template.requiredPermissions) {
            console.log("Checking permissions for sensor habit...");
            try {
                for (const permStr of template.requiredPermissions) {
                    let permission: Permission | null = null;

                    if (Platform.OS === 'android') {
                        if (permStr === 'android.permission.ACTIVITY_RECOGNITION') permission = PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION;
                        if (permStr === 'android.permission.RECORD_AUDIO') permission = PERMISSIONS.ANDROID.RECORD_AUDIO;
                        if (permStr === 'android.permission.ACCESS_FINE_LOCATION') permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
                    } else if (Platform.OS === 'ios') {
                        if (permStr === 'ios.permission.MOTION') permission = PERMISSIONS.IOS.MOTION;
                        if (permStr === 'ios.permission.MICROPHONE') permission = PERMISSIONS.IOS.MICROPHONE;
                        if (permStr === 'ios.permission.LOCATION') permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
                    }

                    if (permission) {
                        console.log(`Checking permission: ${permStr}`);
                        const status = await check(permission);
                        console.log(`Status for ${permStr}: ${status}`);

                        if (status === RESULTS.UNAVAILABLE) {
                            console.log("Hardware missing modal triggered");
                            setModalConfig({ visible: true, type: 'hardware_missing', sensorName: template.sensorType || 'sensor' });
                            return;
                        }

                        if (status === RESULTS.BLOCKED) {
                            console.log("Permission blocked modal triggered");
                            setModalConfig({ visible: true, type: 'permission_blocked', sensorName: template.sensorType || 'sensor' });
                            return;
                        }

                        if (status === RESULTS.DENIED) {
                            console.log(`Requesting permission: ${permStr}`);
                            const result = await request(permission);
                            console.log(`Result for ${permStr}: ${result}`);
                            if (result === RESULTS.BLOCKED) {
                                setModalConfig({ visible: true, type: 'permission_blocked', sensorName: template.sensorType || 'sensor' });
                                return;
                            }
                            if (result !== RESULTS.GRANTED && result !== RESULTS.LIMITED) {
                                return;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Permission request failed", error);
                Alert.alert("Error", "Failed to check permissions. Please try again.");
                return;
            }
        }

        console.log("Proceeding to add habit...");
        const finalGoal = parseInt(goalValue) || template.goal;

        addHabit({
            title: template.title,
            description: template.description,
            frequency: 'daily',
            type: template.type,
            timerGoal: template.type === 'timer' ? finalGoal : undefined,
            numericGoal: template.type === 'numeric' ? finalGoal : undefined,
            numericUnit: template.unit,
            reminders: [],
            color: template.color || theme.colors.primary,
            cue: template.cue,
            craving: template.craving,
            response: template.response,
            reward: template.reward,
            howToApply: template.howToApply,
            isSensorBased: template.isSensorBased,
            sensorType: template.sensorType,
        } as any);

        console.log("Habit added, navigating back...");
        navigation.navigate('Main', { screen: 'Habits' });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={theme.colors.text} size={24} />
                </TouchableOpacity>
                <NothingText variant="bold" size={24} style={{ color: theme.colors.text, fontFamily: 'ndot' }}>RISE INSIGHTS</NothingText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.introSection, { borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 24 }]}>
                    <NothingText variant="dot" size={48} style={[styles.title, { fontFamily: 'ndot' }]}>{template.title.toUpperCase()}</NothingText>
                    <NothingText color={theme.colors.textSecondary} size={16} style={{ lineHeight: 24 }}>{template.description}</NothingText>
                </View>

                {/* GOAL ADJUSTMENT SECTION */}
                <View style={{ marginTop: 24, paddingHorizontal: 4 }}>
                    <NothingText variant="bold" size={14} style={styles.subTitle}>SET YOUR GOAL</NothingText>
                    <NothingCard padding="md" style={{ backgroundColor: theme.colors.surface1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <NothingText size={12} color={theme.colors.textSecondary}>
                                    {template.type === 'timer' ? 'DURATION (SECONDS)' : `TARGET ${template.unit?.toUpperCase() || ''}`}
                                </NothingText>
                                <NothingInput
                                    value={goalValue}
                                    onChangeText={setGoalValue}
                                    keyboardType="numeric"
                                    placeholder="Enter goal"
                                    style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 4 }}
                                />
                            </View>
                            <Target size={32} color={theme.colors.primary} style={{ opacity: 0.5 }} />
                        </View>
                        {template.isSensorBased && (
                            <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <ShieldCheck size={14} color={theme.colors.primary} />
                                <NothingText size={10} color={theme.colors.primary} style={{ marginLeft: 6 }}>
                                    VERIFIED BY {template.sensorType?.toUpperCase()} SENSOR
                                </NothingText>
                            </View>
                        )}
                    </NothingCard>
                </View>

                {/* THE LOOP SECTION */}
                <View style={{ marginTop: 24 }}>
                    <NothingText variant="bold" size={14} style={styles.subTitle}>THE HABIT LOOP</NothingText>

                    <View style={{ gap: 16 }}>
                        <NothingCard padding="md" style={{ borderColor: '#3B82F640', borderWidth: 1 }}>
                            <NothingText variant="bold" color="#3B82F6">CUE</NothingText>
                            <NothingText size={14}>{template.cue}</NothingText>
                        </NothingCard>

                        <NothingCard padding="md" style={{ borderColor: '#F472B640', borderWidth: 1 }}>
                            <NothingText variant="bold" color="#F472B6">CRAVING</NothingText>
                            <NothingText size={14}>{template.craving}</NothingText>
                        </NothingCard>

                        <NothingCard padding="md" style={{ borderColor: '#A78BFA40', borderWidth: 1 }}>
                            <NothingText variant="bold" color="#A78BFA">RESPONSE</NothingText>
                            <NothingText size={14}>{template.response}</NothingText>
                        </NothingCard>

                        <NothingCard padding="md" style={{ borderColor: '#34D39940', borderWidth: 1 }}>
                            <NothingText variant="bold" color="#34D399">REWARD</NothingText>
                            <NothingText size={14}>{template.reward}</NothingText>
                        </NothingCard>
                    </View>
                </View>

                <View style={{ height: 32 }} />

                <NothingText variant="bold" size={14} style={styles.subTitle}>ATOMIC HABITS: THE 4 LAWS</NothingText>

                <View style={styles.lawRow}>
                    <View style={[styles.lawIcon, { backgroundColor: theme.colors.surface1 }]}>
                        <Zap size={20} color={theme.colors.text} />
                    </View>
                    <View style={styles.lawText}>
                        <NothingText variant="bold" size={16}>1st Law: Make it Obvious</NothingText>
                        <NothingText size={12} color={theme.colors.textSecondary}>Design your environment. Place your visual cues front and center.</NothingText>
                    </View>
                </View>

                <View style={styles.lawRow}>
                    <View style={[styles.lawIcon, { backgroundColor: theme.colors.surface1 }]}>
                        <Check size={20} color={theme.colors.text} />
                    </View>
                    <View style={styles.lawText}>
                        <NothingText variant="bold" size={16}>How to Apply</NothingText>
                        <NothingText size={12} color={theme.colors.textSecondary}>{template.howToApply}</NothingText>
                    </View>
                </View>

                <NothingButton
                    label={template.isSensorBased ? "Grant Access & Commit" : "Commit to this Habit"}
                    onPress={handleStartTracking}
                    style={styles.commitBtn}
                />
            </ScrollView>

            <NothingPermissionModal
                isVisible={modalConfig.visible}
                type={modalConfig.type}
                sensorName={modalConfig.sensorName}
                onClose={() => setModalConfig({ ...modalConfig, visible: false })}
            />
        </SafeAreaView>
    );
};
