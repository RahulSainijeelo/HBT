import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated, Easing, LayoutChangeEvent } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const ModalHandle = ({ theme }: { theme: any }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();
    }, [animatedValue]);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
    };

    const { width, height } = dimensions;

    // Animate the gradient position
    const gradX1 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["-100%", "100%"],
    });

    const gradX2 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "200%"],
    });

    return (
        <View
            style={[styles.modalHandleContainer, { backgroundColor: theme.colors.surface1 }]}
            onLayout={onLayout}
        >
            {width > 0 && height > 0 && (
                <View style={StyleSheet.absoluteFill}>
                    <Svg height={height} width={width}>
                        <Defs>
                            <AnimatedLinearGradient id="borderGrad" x1={gradX1} y1="0%" x2={gradX2} y2="0%">
                                <Stop offset="0" stopColor={theme.colors.border} stopOpacity="0.2" />
                                <Stop offset="0.5" stopColor={theme.colors.primary} stopOpacity="1" />
                                <Stop offset="1" stopColor={theme.colors.border} stopOpacity="0.2" />
                            </AnimatedLinearGradient>
                        </Defs>
                        <Path
                            d={`M 1,${height} L 1,24 Q 1,1 24,1 L ${width - 24},1 Q ${width - 1},1 ${width - 1},24 L ${width - 1},${height}`}
                            fill="none"
                            stroke="url(#borderGrad)"
                            strokeWidth="2"
                        />
                    </Svg>
                </View>
            )}
            <View style={[styles.modalHandle, { backgroundColor: theme.colors.border }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    modalHandleContainer: {
        width: "100%",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        minHeight: 40, // Ensure enough height for handle
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,

        alignSelf: 'center',
        marginVertical: 10,
    },
});