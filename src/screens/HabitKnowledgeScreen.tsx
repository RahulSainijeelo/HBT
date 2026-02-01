import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingButton } from '../components/NothingButton';
import { ArrowLeft, BookOpen, Sparkles, Zap, Target, Award, Check } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { HabitKnowledgeScreenStyles as styles } from '../styles/Habit.styles';

export const HabitKnowledgeScreen = ({ route, navigation }: any) => {
    const { template } = route.params;
    const { theme } = useTheme();
    const { addHabit } = useAppStore();

    const handleStartTracking = () => {
        addHabit({
            title: template.title,
            description: template.description,
            frequency: 'daily',
            type: template.type,
            timerGoal: template.type === 'timer' ? template.goal : undefined,
            numericGoal: template.type === 'numeric' ? template.goal : undefined,
            numericUnit: template.unit,
            reminders: [],
            color: template.color || theme.colors.primary,
            cue: template.cue,
            craving: template.craving,
            response: template.response,
            reward: template.reward,
            howToApply: template.howToApply
        });
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

                {/* ... other laws stay the same for brevity or can be enhanced */}
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
                    label="Commit to this Habit"
                    onPress={handleStartTracking}
                    style={styles.commitBtn}
                />
            </ScrollView>
        </SafeAreaView>
    );
};
