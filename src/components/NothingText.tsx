import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../theme';
import { getFontFamily, NothingTextProps } from '../utils/Nothing.ui.utils';

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

    const textStyle = [
        {
            fontSize: size,
            color: finalColor,
            textAlign: align,
            fontFamily: getFontFamily(variant),
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
