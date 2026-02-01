import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { NothingButton } from '../components/NothingButton';
import { ArrowLeft, BookOpen, Sparkles, Zap, Target, Award } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { HabitKnowledgeScreenStyles as styles } from '../styles/Habit.styles';

export const HabitKnowledgeScreen = ({ route, navigation }: any) => {
    const { template } = route.params;
    const { theme } = useTheme();
    const { addHabit } = useAppStore();

    const handleStartTracking = () => {
        addHabit({
            title: template.title,
            description: template.desc,
            frequency: 'daily',
            type: template.type,
            timerGoal: template.timerGoal,
            reminders: [],
            color: template.color || theme.colors.primary,
        });
        navigation.navigate('Main', { screen: 'Habits' });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={theme.colors.text} size={24} />
                </TouchableOpacity>
                <NothingText variant="bold" size={20}>KNOWLEDGE BASE</NothingText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.introSection}>
                    <NothingText variant="dot" size={48} style={styles.title}>{template.title.toUpperCase()}</NothingText>
                    <NothingText color={theme.colors.textSecondary} size={16}>{template.desc}</NothingText>
                </View>

                <NothingCard style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Sparkles size={18} color={theme.colors.primary} />
                        <NothingText variant="bold" style={{ marginLeft: 8 }}>THE BENEFITS</NothingText>
                    </View>
                    <NothingText size={14} color={theme.colors.textSecondary}>
                        Consistency in this habit leads to compounding results. Focus on the 1% improvement every day rather than immediate transformation.
                    </NothingText>
                </NothingCard>

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
                        <Target size={20} color={theme.colors.text} />
                    </View>
                    <View style={styles.lawText}>
                        <NothingText variant="bold" size={16}>2nd Law: Make it Attractive</NothingText>
                        <NothingText size={12} color={theme.colors.textSecondary}>Pair it with something you want. Use temptation bundling.</NothingText>
                    </View>
                </View>

                <View style={styles.lawRow}>
                    <View style={[styles.lawIcon, { backgroundColor: theme.colors.surface1 }]}>
                        <BookOpen size={20} color={theme.colors.text} />
                    </View>
                    <View style={styles.lawText}>
                        <NothingText variant="bold" size={16}>3rd Law: Make it Easy</NothingText>
                        <NothingText size={12} color={theme.colors.textSecondary}>Start with the 2-minute rule. Focus on just showing up.</NothingText>
                    </View>
                </View>

                <View style={styles.lawRow}>
                    <View style={[styles.lawIcon, { backgroundColor: theme.colors.surface1 }]}>
                        <Award size={20} color={theme.colors.text} />
                    </View>
                    <View style={styles.lawText}>
                        <NothingText variant="bold" size={16}>4th Law: Make it Satisfying</NothingText>
                        <NothingText size={12} color={theme.colors.textSecondary}>Use a habit tracker to see your progress instantly.</NothingText>
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
