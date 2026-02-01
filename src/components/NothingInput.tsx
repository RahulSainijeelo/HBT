import React from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { NothingText } from './NothingText';
import { NothingInputStyles as styles } from '../styles/Nothing.ui.styles';
import { NothingInputProps } from '../utils/Nothing.ui.utils';


export const NothingInput: React.FC<NothingInputProps> = ({
    label,
    error,
    style,
    ...props
}) => {
    const { theme } = useTheme();

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

