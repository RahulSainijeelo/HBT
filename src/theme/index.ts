import { useColorScheme } from 'react-native';
import { create } from 'zustand';

export const palette = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#D71921', // Nothing Red
    surfaceDark: '#121212',
    surfaceLight: '#F5F5F5',
    surface1Dark: '#1C1C1C',
    surface1Light: '#E8E8E8',
    surface2Dark: '#2C2C2C',
    surface2Light: '#DBDBDB',
    textDark: '#FFFFFF',
    textLight: '#000000',
    textSecDark: '#A0A0A0',
    textSecLight: '#666666',
    borderDark: '#333333',
    borderLight: '#CCCCCC',
};

export const darkTheme = {
    dark: true,
    colors: {
        background: palette.black,
        surface: palette.surfaceDark,
        surface1: palette.surface1Dark,
        surface2: palette.surface2Dark,
        text: palette.textDark,
        textSecondary: palette.textSecDark,
        primary: palette.red,
        accent: palette.red,
        border: palette.borderDark,
        error: '#FF4444',
        success: '#44FF44',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    borderRadius: { sm: 8, md: 16, lg: 24, full: 9999 },
};

export const lightTheme = {
    dark: false,
    colors: {
        background: palette.white,
        surface: palette.surfaceLight,
        surface1: palette.surface1Light,
        surface2: palette.surface2Light,
        text: palette.textLight,
        textSecondary: palette.textSecLight,
        primary: palette.red,
        accent: palette.red,
        border: palette.borderLight,
        error: '#D32F2F',
        success: '#388E3C',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    borderRadius: { sm: 8, md: 16, lg: 24, full: 9999 },
};

// Store to manage theme state if we want manual override later
interface ThemeStore {
    mode: 'system' | 'light' | 'dark';
    setMode: (mode: 'system' | 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    mode: 'system',
    setMode: (mode) => set({ mode }),
}));

// Hook to access the current theme
export const useTheme = () => {
    const colorScheme = useColorScheme();
    const { mode } = useThemeStore();

    const isDark = mode === 'system' ? colorScheme === 'dark' : mode === 'dark';

    // Default to dark if system is undefined (e.g. some Android versions)
    const activeTheme = isDark || colorScheme === null ? darkTheme : lightTheme;

    return {
        theme: activeTheme,
        isDark,
        mode,
        setMode: useThemeStore.getState().setMode
    };
};

// Backwards compatibility for static usage (Avoid using this in components)
export const theme = darkTheme; 
