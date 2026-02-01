import React from 'react';
import { View, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Tag, CheckCircle2 } from 'lucide-react-native';
import { NothingText } from '../NothingText';
import { NothingInput } from '../NothingInput';
import { NothingButton } from '../NothingButton';
import { LabelPickerModalProps } from '../../utils/TaskScreen.utils';
import { LabelPickerModalStyle as styles } from '../../styles/styles';
import { ModalHandle } from './ModalHandle';

export const LabelPickerModal: React.FC<LabelPickerModalProps> = ({
    visible, onClose, theme, insets, labels, newLabel, setNewLabel, customLabel, setCustomLabel, addLabel
}) => (
    <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent
    >
        <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={onClose}
        >
            <KeyboardAvoidingView
                behavior="padding"
                style={{ width: '100%' }}
            >
                <ModalHandle theme={theme} />
                <View
                    style={[
                        styles.addModalContent,
                        {
                            backgroundColor: theme.colors.surface1,
                            paddingBottom: (insets.bottom || 20) + 24,
                            borderColor: theme.colors.border,
                        }
                    ]}
                    onStartShouldSetResponder={() => true}
                    onResponderTerminationRequest={() => false}
                >
                    <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>ADD LABEL</NothingText>

                    <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                        {labels.map(label => (
                            <TouchableOpacity
                                key={label.id}
                                style={styles.labelItem}
                                onPress={() => { setNewLabel(label.name); onClose(); }}
                            >
                                <Tag size={16} color={theme.colors.textSecondary} />
                                <NothingText style={{ marginLeft: 12 }}>{label.name}</NothingText>
                                {newLabel === label.name && <CheckCircle2 size={16} color={theme.colors.primary} style={{ marginLeft: 'auto' }} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 16 }}>
                        <NothingInput
                            placeholder="Create new label..."
                            value={customLabel}
                            onChangeText={setCustomLabel}
                        />
                        <NothingButton
                            label="Create Label"
                            size="sm"
                            variant="secondary"
                            onPress={() => {
                                if (customLabel.trim()) {
                                    addLabel(customLabel.trim());
                                    setNewLabel(customLabel.trim());
                                    setCustomLabel('');
                                    onClose();
                                }
                            }}
                        />
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <NothingText color={theme.colors.textSecondary}>CLOSE</NothingText>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableOpacity>
    </Modal>
);

