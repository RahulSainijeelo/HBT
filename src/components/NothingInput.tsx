import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { theme } from '../theme';
import { NothingText } from './NothingText';

interface NothingInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const NothingInput: React.FC<NothingInputProps> = ({
    label,
    error,
    style,
    ...props
}) => {
    return (
        <View style={styles.container}>
            {label && (
                <NothingText
                    variant="medium"
                    size={14}
                    color={theme.colors.textSecondary}
                    style={styles.label}
                >
                    {label}
                </NothingText>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: error ? theme.colors.error : theme.colors.border,
                        backgroundColor: theme.colors.surface1,
                        color: theme.colors.text,
                        borderRadius: theme.borderRadius.md,
                    },
                    style,
                ]}
                placeholderTextColor={theme.colors.textSecondary}
                {...props}
            />
            {error && (
                <NothingText size={12} color={theme.colors.error} style={styles.error}>
                    {error}
                </NothingText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    error: {
        marginTop: 4,
        marginLeft: 4,
    },
});
