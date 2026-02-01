import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NothingText } from './NothingText';
import { NothingCard } from './NothingCard';
import { useTheme } from '../theme';
import { AlertTriangle } from 'lucide-react-native';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'CONFIRM',
    cancelLabel = 'CANCEL',
    type = 'info'
}) => {
    const { theme } = useTheme();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <NothingCard padding="lg" bordered={true} style={[styles.card, { backgroundColor: theme.colors.surface1 }]}>
                    <View style={styles.header}>
                        <AlertTriangle size={24} color={type === 'danger' ? theme.colors.error : theme.colors.primary} />
                        <NothingText variant="bold" style={{ marginLeft: 8, fontFamily: 'ndot' }} size={24}>{title.toUpperCase()}</NothingText>
                    </View>

                    <NothingText color={theme.colors.textSecondary} style={styles.message}>
                        {message}
                    </NothingText>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={[styles.btn, { borderColor: theme.colors.border }]}
                        >
                            <NothingText variant="bold" color={theme.colors.textSecondary} style={{ fontFamily: 'ndot' }}>{cancelLabel}</NothingText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={[
                                styles.btn,
                                {
                                    backgroundColor: type === 'danger' ? theme.colors.error : theme.colors.primary,
                                    borderColor: type === 'danger' ? theme.colors.error : theme.colors.primary
                                }
                            ]}
                        >
                            <NothingText variant="bold" color={theme.colors.background} style={{ fontFamily: 'ndot' }}>{confirmLabel}</NothingText>
                        </TouchableOpacity>
                    </View>
                </NothingCard>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    message: {
        lineHeight: 20,
        marginBottom: 32,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    btn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    }
});
