import { TextInputProps, TextProps, TouchableOpacityProps, ViewProps } from "react-native";

export interface NothingTextProps extends TextProps {
    variant?: 'dot' | 'regular' | 'medium' | 'bold';
    size?: number;
    color?: string;
    align?: 'left' | 'center' | 'right';
}

export interface NothingInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export interface NothingCardProps extends ViewProps {
    padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    bordered?: boolean;
    backgroundColor?: string;
    borderRadius?: 'sm' | 'md' | 'lg' | 'full';
}

export interface NothingButtonProps extends TouchableOpacityProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export const getFontFamily = (variant: 'dot' | 'regular' | 'medium' | 'bold') => {
    switch (variant) {
        case 'dot':
            return 'Courier';
        case 'medium':
            return 'System';
        case 'bold':
            return 'System';
        default:
            return 'System';
    }
};

export const getColors = (variant: 'primary' | 'secondary' | 'outline' | 'ghost', theme: any) => {
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