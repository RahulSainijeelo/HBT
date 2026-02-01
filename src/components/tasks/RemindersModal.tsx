import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Bell, CheckCircle2 } from 'lucide-react-native';
import { NothingText } from '../NothingText';
import { RemindersModalProps } from '../../utils/TaskScreen.utils';
import { RemindersModalStyle as styles } from './styles';

export const RemindersModal: React.FC<RemindersModalProps> = ({
    visible, onClose, theme, insets, selectedReminders, setSelectedReminders
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
            <View
                style={[
                    styles.addModalContent,
                    {
                        backgroundColor: theme.colors.surface1,
                        paddingBottom: (insets.bottom || 20) + 24,
                        width: '100%',
                        paddingHorizontal: 24,
                        paddingTop: 10,
                        borderColor: theme.colors.border
                    }
                ]}
                onStartShouldSetResponder={() => true}
            >
                <View style={styles.modalHandle} />
                <NothingText variant="bold" size={18} style={{ marginBottom: 16 }}>REMINDERS</NothingText>

                {['At time of event', '10 minutes before', '30 minutes before', '1 hour before', '1 day before'].map(r => (
                    <TouchableOpacity
                        key={r}
                        style={styles.dateOption}
                        onPress={() => {
                            if (selectedReminders.includes(r)) {
                                setSelectedReminders(selectedReminders.filter(item => item !== r));
                            } else {
                                setSelectedReminders([...selectedReminders, r]);
                            }
                        }}
                    >
                        <Bell size={20} color={selectedReminders.includes(r) ? theme.colors.primary : theme.colors.text} />
                        <NothingText style={styles.dateOptionText}>{r}</NothingText>
                        {selectedReminders.includes(r) && <CheckCircle2 size={20} color={theme.colors.primary} />}
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={{ marginTop: 24, alignSelf: 'center' }} onPress={onClose}>
                    <NothingText color={theme.colors.primary} variant="bold">DONE</NothingText>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
);