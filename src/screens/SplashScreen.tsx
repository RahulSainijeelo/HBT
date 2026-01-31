import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme';
import { NothingText } from '../components/NothingText';

const { width } = Dimensions.get('window');

export const SplashScreen = ({ navigation }: any) => {
    const { theme } = useTheme();

    // Animation Values
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 1. Initial Fade In & Scale Up
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // 2. Text Fade In after delay
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            delay: 400,
            useNativeDriver: true,
        }).start();

        // 3. Navigation Logic after animation
        const init = async () => {
            // Simulate minimum splash time
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Logic to auto-login could go here later (Phase 7)
            // For now, just go to Login
            navigation.replace('Login');
        };

        init();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View style={{ opacity, transform: [{ scale }] }}>
                <View style={[styles.logoContainer, { borderColor: theme.colors.primary }]}>
                    <NothingText variant="dot" size={48} color={theme.colors.primary}>
                        GLYPH
                    </NothingText>
                </View>
            </Animated.View>

            <Animated.View style={{ opacity: textOpacity, position: 'absolute', bottom: 60 }}>
                <NothingText variant="medium" size={12} color={theme.colors.textSecondary} style={{ letterSpacing: 4 }}>
                    SYSTEM LOADING...
                </NothingText>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        borderWidth: 1,
        borderStyle: 'dotted',
        padding: 32,
        borderRadius: 100, // Circleish
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.6,
        height: width * 0.6,
    }
});
