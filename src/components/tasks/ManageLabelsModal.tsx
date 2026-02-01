import React from 'react';
import { View, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Tag, Trash2, CheckCircle2 } from 'lucide-react-native';
import { NothingText } from '../NothingText';
import { NothingInput } from '../NothingInput';
import { NothingButton } from '../NothingButton';
import { LabelPickerModalStyle as styles } from '../../styles/styles';
import { ModalHandle } from './ModalHandle';
import { Label } from '../../store/useAppStore';

interface ManageLabelsModalProps {
    visible: boolean;
    onClose: () => void;
    theme: any;
    insets: any;
    labels: Label[];
    addLabel: (name: string) => void;
    deleteLabel: (id: string) => void;
}

export const ManageLabelsModal: React.FC<ManageLabelsModalProps> = ({
    visible, onClose, theme, insets, labels, addLabel, deleteLabel
}) => {
    const [newLabelName, setNewLabelName] = React.useState('');

    return (
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
                        <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>Your Labels</NothingText>
                        <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                            {labels.map(label => (
                                <View
                                    key={label.id}
                                    style={[styles.labelItem, { justifyContent: 'space-between' }]}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Tag size={16} color={theme.colors.textSecondary} />
                                        <NothingText style={{ marginLeft: 12 }}>{label.name}</NothingText>
                                    </View>

                                    {/* Don't allow deleting default labels if we want, but user said delete EXITING */}
                                    <TouchableOpacity
                                        onPress={() => deleteLabel(label.id)}
                                        style={{ padding: 8 }}
                                    >
                                        <Trash2 size={16} color={theme.colors.error || '#FF4444'} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={{ marginBottom: 16 }}>
                            <NothingInput
                                placeholder="New label name..."
                                value={newLabelName}
                                onChangeText={setNewLabelName}
                            />
                            <NothingButton
                                label="Add Label"
                                size="sm"
                                variant="secondary"
                                onPress={() => {
                                    if (newLabelName.trim()) {
                                        addLabel(newLabelName.trim());
                                        setNewLabelName('');
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
};
