import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

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
    color,
    align = 'left',
    style,
    ...props
}) => {
    const { theme } = useTheme();
    const finalColor = color || theme.colors.text;

    const getFontFamily = () => {
        switch (variant) {
            case 'dot':
                return 'Courier'; // Fallback for dot matrix
            case 'medium':
                // Assuming theme.fonts is defined, but if not, fallback to default system font
                return 'System';
            case 'bold':
                return 'System';
            default:
                return 'System';
        }
    };

    const textStyle = [
        {
            fontSize: size,
            color: finalColor,
            textAlign: align,
            fontFamily: getFontFamily(),
            letterSpacing: variant === 'dot' ? 2 : 0,
            fontWeight: variant === 'bold' ? 'bold' : variant === 'medium' ? '500' : 'normal'
        },
        style,
    ];

    return (
        <Text style={textStyle as any} {...props}>
            {children}
        </Text>
    );
};
