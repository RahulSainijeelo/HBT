import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, NativeModules, Platform, BackHandler } from 'react-native';
import { Tag, Check, X } from 'lucide-react-native';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';
import { NothingCard } from '../components/NothingCard';
import { useAppStore } from '../store/useAppStore';

const { width, height } = Dimensions.get('window');
const WidgetBridge = NativeModules.WidgetBridge;

export const WidgetLabelPickerScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { labels } = useAppStore();
    const [selectedLabel, setSelectedLabel] = useState<string>('All');

    // Handle back button to close
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });
        return () => backHandler.remove();
    }, [navigation]);

    const handleSelectLabel = (labelName: string) => {
        setSelectedLabel(labelName);

        // Update native side
        if (Platform.OS === 'android' && WidgetBridge && typeof WidgetBridge.setWidgetLabel === 'function') {
            WidgetBridge.setWidgetLabel(labelName);
        }

        // Small delay then close
        setTimeout(() => {
            navigation.goBack();
        }, 100);
    };

    const handleClose = () => {
        navigation.goBack();
    };

    const allLabels = [{ id: 'all', name: 'All' }, ...labels];

    return (
        <View style={styles.overlay}>
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={handleClose}
            />

            <View style={[styles.bottomSheet, { backgroundColor: theme.colors.surface1 }]}>
                <View style={styles.handle} />

                <View style={styles.header}>
                    <NothingText variant="bold" size={20}>Filter by Label</NothingText>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <X size={22} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.labelList} showsVerticalScrollIndicator={false}>
                    {allLabels.map((label) => (
                        <TouchableOpacity
                            key={label.id}
                            style={[
                                styles.labelItem,
                                {
                                    backgroundColor: selectedLabel === label.name
                                        ? theme.colors.primary + '20'
                                        : 'transparent',
                                    borderColor: theme.colors.border
                                }
                            ]}
                            onPress={() => handleSelectLabel(label.name)}
                        >
                            <View style={styles.labelLeft}>
                                <View style={[styles.labelDot, { backgroundColor: theme.colors.primary }]} />
                                <NothingText style={{ marginLeft: 12 }}>{label.name}</NothingText>
                            </View>
                            {selectedLabel === label.name && (
                                <Check size={18} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
        maxHeight: height * 0.6,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#333',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    closeBtn: {
        padding: 4,
    },
    labelList: {
        maxHeight: 400,
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    labelLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    }
});
