import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../theme';

interface NothingCardProps extends ViewProps {
    padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    bordered?: boolean;
    backgroundColor?: string;
    borderRadius?: 'sm' | 'md' | 'lg' | 'full';
}

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
            style={[
                styles.card,
                {
                    padding: theme.spacing[padding],
                    margin: margin ? theme.spacing[margin] : 0,
                    borderWidth: bordered ? 1 : 0,
                    borderColor: theme.colors.border,
                    backgroundColor: finalBg,
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
        overflow: 'hidden',
    },
});
