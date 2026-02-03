import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, NativeModules, Platform } from 'react-native';
import { Tag, Check, X } from 'lucide-react-native';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');
const WidgetBridge = NativeModules.WidgetBridge;

export const WidgetLabelPickerScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { labels } = useAppStore();
    const [selectedLabel, setSelectedLabel] = useState<string>('All');

    // Load current selection from native side
    useEffect(() => {
        // We could load from native prefs, but for simplicity just default to "All"
    }, []);

    const handleSelectLabel = (labelName: string) => {
        setSelectedLabel(labelName);

        // Update native side
        if (Platform.OS === 'android' && WidgetBridge && typeof WidgetBridge.setWidgetLabel === 'function') {
            WidgetBridge.setWidgetLabel(labelName);
        }

        // Close modal
        navigation.goBack();
    };

    const allLabels = [{ id: 'all', name: 'All' }, ...labels];

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => navigation.goBack()}
            />

            <NothingCard padding="xl" bordered={true} style={[styles.card, { backgroundColor: theme.colors.surface1 }]}>
                <View style={styles.header}>
                    <NothingText variant="bold" size={24} style={{ fontFamily: 'ndot' }}>SELECT LABEL</NothingText>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <X size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.labelList} showsVerticalScrollIndicator={false}>
                    {allLabels.map((label) => (
                        <TouchableOpacity
                            key={label.id}
                            style={[styles.labelItem, { borderColor: theme.colors.border }]}
                            onPress={() => handleSelectLabel(label.name)}
                        >
                            <View style={styles.labelLeft}>
                                <Tag size={18} color={theme.colors.textSecondary} />
                                <NothingText style={{ marginLeft: 12 }}>{label.name}</NothingText>
                            </View>
                            {selectedLabel === label.name && (
                                <Check size={18} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </NothingCard>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: width * 0.85,
        maxHeight: '70%',
        borderRadius: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    labelList: {
        maxHeight: 400,
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
    },
    labelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
