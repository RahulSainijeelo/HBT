import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RiseLogoAnimationProps {
    primaryColor: string;
    onComplete?: () => void;
}

export const RiseLogoAnimation: React.FC<RiseLogoAnimationProps> = ({ primaryColor, onComplete }) => {
    // Rotation values
    const outerRotation = useRef(new Animated.Value(0)).current;
    const innerRotation = useRef(new Animated.Value(0)).current;

    // Checkmark dots opacities
    // We'll define about 25 dots for the checkmark
    const dotCoords = [
        // Column 1 (Left end)
        { x: -50, y: -10 }, { x: -50, y: 0 }, { x: -50, y: 10 },
        // Column 2
        { x: -40, y: 0 }, { x: -40, y: 10 }, { x: -40, y: 20 },
        // Column 3
        { x: -30, y: 10 }, { x: -30, y: 20 }, { x: -30, y: 30 },
        // Column 4
        { x: -20, y: 20 }, { x: -20, y: 30 }, { x: -20, y: 40 },
        // Column 5 (Bottom)
        { x: -10, y: 30 }, { x: -10, y: 40 }, { x: -10, y: 50 },
        // Column 6 (Right stroke up)
        { x: 0, y: 20 }, { x: 0, y: 30 }, { x: 0, y: 40 },
        // Column 7
        { x: 10, y: 10 }, { x: 10, y: 20 }, { x: 10, y: 30 },
        // Column 8
        { x: 20, y: 0 }, { x: 20, y: 10 }, { x: 20, y: 20 },
        // Column 9
        { x: 30, y: -10 }, { x: 30, y: 0 }, { x: 30, y: 10 },
        // Column 10
        { x: 40, y: -20 }, { x: 40, y: -10 }, { x: 40, y: 0 },
        // Column 11
        { x: 50, y: -30 }, { x: 50, y: -20 }, { x: 50, y: -10 }
    ];

    const dotAnims = useRef(dotCoords.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // 1. Rotation Animations
        Animated.loop(
            Animated.timing(outerRotation, {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(innerRotation, {
                toValue: 1,
                duration: 8000, // different speed
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // 2. Checkmark Staggered Appearance
        const staggerAnims = dotAnims.map((anim) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        );

        Animated.sequence([
            Animated.delay(1000),
            Animated.stagger(40, staggerAnims)
        ]).start(() => {
            if (onComplete) onComplete();
        });
    }, []);

    const renderRing = (radius: number, dotRadius: number, count: number, rotation: Animated.Value, direction: 1 | -1) => {
        const dots = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            dots.push(
                <Circle key={i} cx={x} cy={y} r={dotRadius} fill="white" />
            );
        }

        const rotateInterpolate = rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', (direction * 360) + 'deg'],
        });

        return (
            <AnimatedG style={{ transform: [{ rotate: rotateInterpolate }] }}>
                {dots}
            </AnimatedG>
        );
    };

    return (
        <View style={styles.container}>
            <Svg width="300" height="300" viewBox="0 0 300 300">
                <G x="150" y="150">
                    {/* Outer Ring */}
                    {renderRing(110, 5, 36, outerRotation, 1)}

                    {/* Inner Ring */}
                    {renderRing(90, 4, 32, innerRotation, -1)}

                    {/* Checkmark Cluster */}
                    {dotCoords.map((coord, i) => (
                        <AnimatedCircle
                            key={i}
                            cx={coord.x}
                            cy={coord.y}
                            r="5"
                            fill="#FF3B30" // Red for checkmark
                            style={{ opacity: dotAnims[i], transform: [{ scale: dotAnims[i] }] }}
                        />
                    ))}
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
