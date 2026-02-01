import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';
import { NothingText } from './NothingText';
import { NothingButtonStyles as styles } from '../styles/Nothing.ui.styles';
import { getColors, NothingButtonProps } from '../utils/Nothing.ui.utils';

export const NothingButton: React.FC<NothingButtonProps> = ({
    label,
    variant = 'primary',
    size = 'md',
    icon,
    style,
    ...props
}) => {
    const { theme } = useTheme();
    const colors = getColors(variant, theme);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                styles.button,
                {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: variant === 'outline' ? 1 : 0,
                    paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
                    paddingHorizontal: size === 'sm' ? 16 : size === 'lg' ? 32 : 24,
                    borderRadius: theme.borderRadius.full,
                },
                style,
            ]}
            {...props}
        >
            <View style={styles.content}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <NothingText
                    variant="medium"
                    color={colors.text}
                    size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
                >
                    {label}
                </NothingText>
            </View>
        </TouchableOpacity>
    );
};

