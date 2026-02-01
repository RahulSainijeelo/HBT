import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { NothingText } from '../NothingText';
import { TimeDialModalProps } from '../../utils/TaskScreen.utils';
import { TimeDialModalStyle as styles } from './styles';

export const TimeDialModal: React.FC<TimeDialModalProps> = ({
    visible, onClose, theme, insets, timeMode, setTimeMode, newTime, setNewTime, panResponder
}) => (
    <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
    >
        <TouchableOpacity
            style={[styles.modalOverlay, { justifyContent: 'flex-end' }]}
            activeOpacity={1}
            onPress={onClose}
        >
            <View
                style={[
                    styles.addModalContent,
                    {
                        backgroundColor: theme.colors.surface1,
                        alignItems: 'center',
                        paddingBottom: (insets.bottom || 20) + 24,

                        borderColor: theme.colors.border,
                    }
                ]}
                onStartShouldSetResponder={() => true}
            >
                <View style={styles.modalHandle} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                    <TouchableOpacity
                        onPress={() => setTimeMode('hour')}
                        style={{
                            backgroundColor: timeMode === 'hour' ? theme.colors.primary + '20' : 'transparent',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 8
                        }}
                    >
                        <NothingText
                            variant="bold"
                            size={48}
                            color={timeMode === 'hour' ? theme.colors.primary : theme.colors.textSecondary}
                        >
                            {newTime ? newTime.split(':')[0] : '--'}
                        </NothingText>
                    </TouchableOpacity>

                    <NothingText variant="bold" size={48} color={theme.colors.textSecondary} style={{ marginHorizontal: 4, paddingBottom: 8 }}>:</NothingText>

                    <TouchableOpacity
                        onPress={() => setTimeMode('minute')}
                        style={{
                            backgroundColor: timeMode === 'minute' ? theme.colors.primary + '20' : 'transparent',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 8
                        }}
                    >
                        <NothingText
                            variant="bold"
                            size={48}
                            color={timeMode === 'minute' ? theme.colors.primary : theme.colors.textSecondary}
                        >
                            {newTime ? newTime.split(':')[1] : '--'}
                        </NothingText>
                    </TouchableOpacity>
                </View>

                {/* Custom Dial Container */}
                <View style={{ width: 260, height: 260, borderRadius: 130, backgroundColor: theme.colors.surface1, position: 'relative', marginBottom: 24 }}>
                    <View {...panResponder.panHandlers} style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 20, elevation: 20 }} />
                    <View style={{ position: 'absolute', top: 127, left: 127, width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, zIndex: 10 }} />

                    {newTime && (
                        <View style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            justifyContent: 'center', alignItems: 'center',
                            zIndex: 5,
                            transform: [{
                                rotate: timeMode === 'hour'
                                    ? `${(parseInt(newTime.split(':')[0]) % 12) * 30 - 90}deg`
                                    : `${parseInt(newTime.split(':')[1]) * 6 - 90}deg`
                            }]
                        }}>
                            <View style={{
                                width: timeMode === 'hour' && (parseInt(newTime.split(':')[0]) >= 13 || parseInt(newTime.split(':')[0]) === 0) ? 65 : 100,
                                height: 2,
                                backgroundColor: theme.colors.primary,
                                transform: [{ translateX: (timeMode === 'hour' && (parseInt(newTime.split(':')[0]) >= 13 || parseInt(newTime.split(':')[0]) === 0) ? 65 : 100) / 2 }]
                            }} />
                        </View>
                    )}

                    {timeMode === 'hour' ? (
                        <>
                            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
                                const angle = (i * 30 - 90) * (Math.PI / 180);
                                const radius = 100;
                                const x = 130 + radius * Math.cos(angle);
                                const y = 130 + radius * Math.sin(angle);
                                const currentHour = newTime ? parseInt(newTime.split(':')[0]) : null;
                                const isSelected = currentHour === h || (currentHour === 0 && h === 12);

                                return (
                                    <View key={h} style={{ position: 'absolute', left: x - 15, top: y - 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: isSelected ? theme.colors.primary : 'transparent' }}>
                                        <NothingText size={16} color={isSelected ? theme.colors.background : theme.colors.text}>{h}</NothingText>
                                    </View>
                                )
                            })}
                            {[0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((h, i) => {
                                const angle = (i * 30 - 90) * (Math.PI / 180);
                                const radius = 65;
                                const x = 130 + radius * Math.cos(angle);
                                const y = 130 + radius * Math.sin(angle);
                                const currentHour = newTime ? parseInt(newTime.split(':')[0]) : null;
                                const isSelected = currentHour === h;

                                return (
                                    <View key={h} style={{ position: 'absolute', left: x - 12, top: y - 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: isSelected ? theme.colors.primary : 'transparent' }}>
                                        <NothingText size={12} color={isSelected ? theme.colors.background : theme.colors.textSecondary}>{h === 0 ? '00' : h}</NothingText>
                                    </View>
                                )
                            })}
                        </>
                    ) : (
                        [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m, i) => {
                            const angle = (i * 30 - 90) * (Math.PI / 180);
                            const radius = 100;
                            const x = 130 + radius * Math.cos(angle);
                            const y = 130 + radius * Math.sin(angle);
                            const currentMinute = newTime ? parseInt(newTime.split(':')[1]) : null;
                            const isSelected = currentMinute === m;

                            return (
                                <View key={m} style={{ position: 'absolute', left: x - 15, top: y - 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: isSelected ? theme.colors.primary : 'transparent' }}>
                                    <NothingText size={16} color={isSelected ? theme.colors.background : theme.colors.text}>{m.toString().padStart(2, '0')}</NothingText>
                                </View>
                            )
                        })
                    )}
                </View>
                <TouchableOpacity style={{ marginTop: 24, alignSelf: 'center' }} onPress={onClose}>
                    <NothingText color={theme.colors.primary} variant="bold">DONE</NothingText>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
);