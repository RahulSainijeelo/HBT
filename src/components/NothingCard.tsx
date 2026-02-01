import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../theme';
import { NothingCardProps } from '../utils/Nothing.ui.utils';

export const NothingCard: React.FC<NothingCardProps> = ({
    children,
    padding = 'md',
    margin,
    bordered = true,
    backgroundColor,
    borderRadius = 'lg',
    style,
    ...props
}) => {
    const { theme } = useTheme();
    const finalBg = backgroundColor || theme.colors.surface;

    return (
        <View
            style={{
                overflow: 'hidden',
                padding: theme.spacing[padding],
                margin: margin ? theme.spacing[margin] : 0,
                borderWidth: bordered ? 1 : 0,
                borderColor: theme.colors.border,
                backgroundColor: finalBg,
                borderRadius: theme.borderRadius[borderRadius],
                ...style,
            }}
            {...props}
        >
            {children}
        </View>
    );
};
