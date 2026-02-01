import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { NothingText } from '../NothingText';
import { NothingButton } from '../NothingButton';
import { DurationModalProps } from '../../utils/TaskScreen.utils';
import { DurationModalStyle as styles } from '../../styles/styles';
import { ModalHandle } from './ModalHandle';

export const DurationModal: React.FC<DurationModalProps> = ({
    visible, onClose, theme, insets, duration, setDuration
}) => (
    <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
    >
        <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={onClose}
        >
            <ModalHandle theme={theme} />
            <View
                style={[
                    styles.addModalContent,
                    {
                        backgroundColor: theme.colors.surface1,
                        paddingBottom: (insets.bottom || 20) + 24,
                        borderColor: theme.colors.border
                    }
                ]}
                onStartShouldSetResponder={() => true}
            >
                <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>DURATION</NothingText>

                <View style={styles.durationChipContainer}>
                    {[5, 15, 30, 45, 60, 90, 120].map(m => (
                        <TouchableOpacity
                            key={m}
                            style={[styles.durationChip, duration === m && { backgroundColor: theme.colors.primary }]}
                            onPress={() => setDuration(m)}
                        >
                            <NothingText color={duration === m ? theme.colors.background : theme.colors.text}>
                                {m < 60 ? `${m}m` : `${m / 60}h`}
                            </NothingText>
                        </TouchableOpacity>
                    ))}
                </View>

                <NothingButton
                    label="Set Duration"
                    onPress={onClose}
                />
            </View>
        </TouchableOpacity>
    </Modal>
);

