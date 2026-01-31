import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { theme } from '../theme';
import { NothingText } from './NothingText';

interface NothingButtonProps extends TouchableOpacityProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export const NothingButton: React.FC<NothingButtonProps> = ({
    label,
    variant = 'primary',
    size = 'md',
    icon,
    style,
    ...props
}) => {
    const getColors = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: theme.colors.text,
                    text: theme.colors.background,
                    border: theme.colors.text,
                };
            case 'secondary':
                return {
                    background: theme.colors.surface2,
                    text: theme.colors.text,
                    border: theme.colors.surface2,
                };
            case 'outline':
                return {
                    background: 'transparent',
                    text: theme.colors.text,
                    border: theme.colors.text,
                };
            case 'ghost':
                return {
                    background: 'transparent',
                    text: theme.colors.text,
                    border: 'transparent',
                };
            default:
                return {
                    background: theme.colors.text,
                    text: theme.colors.background,
                    border: theme.colors.text,
                };
        }
    };

    const colors = getColors();

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

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
});
