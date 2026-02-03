import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme';
import { NothingText } from './NothingText';
import { NothingButton } from './NothingButton';
import { ShieldAlert, Settings, HardDrive, X } from 'lucide-react-native';
import { openSettings } from 'react-native-permissions';

const { width } = Dimensions.get('window');

interface NothingPermissionModalProps {
    isVisible: boolean;
    type: 'permission_blocked' | 'hardware_missing' | 'direct_request';
    sensorName: string;
    onClose: () => void;
    onPrimaryAction?: () => void;
}

export const NothingPermissionModal: React.FC<NothingPermissionModalProps> = ({
    isVisible,
    type,
    sensorName,
    onClose,
    onPrimaryAction
}) => {
    const { theme } = useTheme();

    const getContent = () => {
        switch (type) {
            case 'permission_blocked':
                return {
                    title: 'ACCESS BLOCKED',
                    description: `Rise needs the ${sensorName} sensor to verify this habit. Access has been restricted in system settings.`,
                    icon: <Settings size={48} color={theme.colors.error} />,
                    primaryLabel: 'OPEN SETTINGS',
                    action: () => openSettings().catch(() => console.warn('cannot open settings'))
                };
            case 'hardware_missing':
                return {
                    title: 'SENSOR NOT FOUND',
                    description: `Sorry, this device doesn't seem to have a ${sensorName} sensor. This habit cannot be verified automatically.`,
                    icon: <HardDrive size={48} color={theme.colors.textSecondary} />,
                    primaryLabel: 'CHOOSE ANOTHER',
                    action: onClose
                };
            case 'direct_request':
                return {
                    title: 'SENSOR ACCESS',
                    description: `Rise uses the ${sensorName} sensor to track your habit progress automatically. We value your privacy and only use this data locally.`,
                    icon: <ShieldAlert size={48} color={theme.colors.primary} />,
                    primaryLabel: 'GRANT ACCESS',
                    action: onPrimaryAction || onClose
                };
        }
    };

    const content = getContent();

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={[styles.modalBox, { backgroundColor: theme.colors.surface1, borderColor: theme.colors.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.iconContainer}>
                        {content.icon}
                    </View>

                    <NothingText variant="dot" size={24} style={styles.title}>
                        {content.title}
                    </NothingText>

                    <NothingText color={theme.colors.textSecondary} style={styles.description}>
                        {content.description}
                    </NothingText>

                    <NothingButton
                        label={content.primaryLabel}
                        onPress={content.action}
                        style={styles.actionBtn}
                    />

                    <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                        <NothingText color={theme.colors.textSecondary} size={14}>CANCEL</NothingText>
                    </TouchableOpacity>
                </View>
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
    modalBox: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        borderWidth: 1,
        padding: 32,
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 4,
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: 'ndot',
    },
    description: {
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    actionBtn: {
        width: '100%',
    },
    cancelBtn: {
        marginTop: 20,
        padding: 8,
    }
});
