import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface NothingTextProps extends TextProps {
    variant?: 'dot' | 'regular' | 'medium' | 'bold';
    size?: number;
    color?: string;
    align?: 'left' | 'center' | 'right';
}

export const NothingText: React.FC<NothingTextProps> = ({
    children,
    variant = 'regular',
    size = 16,
    color = theme.colors.text,
    align = 'left',
    style,
    ...props
}) => {
    const getFontFamily = () => {
        switch (variant) {
            case 'dot':
                // If we install NDot, we would put it here.
                // For now, using a clean monospace fallback often gives a similar technical feel.
                return 'Courier';
            case 'medium':
                return theme.fonts.medium;
            case 'bold':
                return theme.fonts.bold;
            default:
                return theme.fonts.regular;
        }
    };

    const textStyle = [
        {
            fontSize: size,
            color,
            textAlign: align,
            fontFamily: getFontFamily(),
            letterSpacing: variant === 'dot' ? 2 : 0,
        },
        style,
    ];

    return (
        <Text style={textStyle} {...props}>
            {children}
        </Text>
    );
};
