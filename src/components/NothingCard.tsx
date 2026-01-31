import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme';

interface NothingCardProps extends ViewProps {
    padding?: keyof typeof theme.spacing;
    margin?: keyof typeof theme.spacing;
    bordered?: boolean;
    backgroundColor?: string;
    borderRadius?: keyof typeof theme.borderRadius;
}

export const NothingCard: React.FC<NothingCardProps> = ({
    children,
    padding = 'md',
    margin,
    bordered = true,
    backgroundColor = theme.colors.surface,
    borderRadius = 'lg',
    style,
    ...props
}) => {
    return (
        <View
            style={[
                styles.card,
                {
                    padding: theme.spacing[padding],
                    margin: margin ? theme.spacing[margin] : 0,
                    borderWidth: bordered ? 1 : 0,
                    backgroundColor,
                    borderRadius: theme.borderRadius[borderRadius],
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderColor: theme.colors.border,
        overflow: 'hidden',
    },
});
