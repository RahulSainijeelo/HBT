import React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

interface TabIconProps {
    size?: number;
    color?: string;
    activeColor?: string;
    focused?: boolean;
}

// Home icon - House shape made of dots with red accent dot
export const HomeTabIcon = ({ size = 24, color = '#FFFFFF', focused = false }: TabIconProps) => {
    const dotSize = size / 12;
    const accentColor = '#E53935';

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <G fill={color}>
                {/* Roof - Triangle of dots */}
                <Circle cx="12" cy="3" r={dotSize} />
                <Circle cx="10" cy="5" r={dotSize} />
                <Circle cx="14" cy="5" r={dotSize} />
                <Circle cx="8" cy="7" r={dotSize} />
                <Circle cx="12" cy="7" r={dotSize} />
                <Circle cx="16" cy="7" r={dotSize} />
                <Circle cx="6" cy="9" r={dotSize} />
                <Circle cx="10" cy="9" r={dotSize} />
                <Circle cx="14" cy="9" r={dotSize} />
                <Circle cx="18" cy="9" r={dotSize} />

                {/* House body - Rectangle of dots */}
                <Circle cx="6" cy="11" r={dotSize} />
                <Circle cx="10" cy="11" r={dotSize} />
                <Circle cx="14" cy="11" r={dotSize} />
                <Circle cx="18" cy="11" r={dotSize} />
                <Circle cx="6" cy="13" r={dotSize} />
                <Circle cx="10" cy="13" r={dotSize} />
                <Circle cx="14" cy="13" r={dotSize} />
                <Circle cx="18" cy="13" r={dotSize} />
                <Circle cx="6" cy="15" r={dotSize} />
                <Circle cx="10" cy="15" r={dotSize} />
                <Circle cx="14" cy="15" r={dotSize} />
                <Circle cx="18" cy="15" r={dotSize} />
                <Circle cx="6" cy="17" r={dotSize} />
                <Circle cx="10" cy="17" r={dotSize} />
                <Circle cx="14" cy="17" r={dotSize} />
                <Circle cx="18" cy="17" r={dotSize} />
                <Circle cx="6" cy="19" r={dotSize} />
                <Circle cx="10" cy="19" r={dotSize} />
                <Circle cx="14" cy="19" r={dotSize} />
                <Circle cx="18" cy="19" r={dotSize} />

                {/* Door accent - red dot */}
                <Circle cx="12" cy="17" r={dotSize * 1.5} fill={focused ? accentColor : color} />
            </G>
        </Svg>
    );
};

// Tasks icon - Checklist/spiral made of dots
export const TasksTabIcon = ({ size = 24, color = '#FFFFFF', focused = false }: TabIconProps) => {
    const dotSize = size / 14;
    const accentColor = '#E53935';

    // Create spiral pattern with dots
    const spiralDots = [];
    const centerX = 12;
    const centerY = 12;

    for (let i = 0; i < 24; i++) {
        const angle = (i * 15) * (Math.PI / 180);
        const radius = 4 + (i * 0.3);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const isAccent = focused && i > 18;
        spiralDots.push(
            <Circle
                key={i}
                cx={x}
                cy={y}
                r={dotSize}
                fill={isAccent ? accentColor : color}
            />
        );
    }

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <G>{spiralDots}</G>
        </Svg>
    );
};

// Habits icon - Circular progress ring made of dots
export const HabitsTabIcon = ({ size = 24, color = '#FFFFFF', focused = false }: TabIconProps) => {
    const dotSize = size / 14;
    const accentColor = '#E53935';
    const centerX = 12;
    const centerY = 12;
    const radius = 8;

    // Create circular ring of dots
    const ringDots = [];
    const totalDots = 16;

    for (let i = 0; i < totalDots; i++) {
        const angle = (i * (360 / totalDots) - 90) * (Math.PI / 180);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        // Top right quadrant is red when focused (like the image)
        const isAccent = focused && i >= 0 && i <= 4;
        ringDots.push(
            <Circle
                key={i}
                cx={x}
                cy={y}
                r={dotSize}
                fill={isAccent ? accentColor : color}
            />
        );
    }

    // Inner ring
    const innerRadius = 5;
    for (let i = 0; i < 10; i++) {
        const angle = (i * (360 / 10) - 90) * (Math.PI / 180);
        const x = centerX + innerRadius * Math.cos(angle);
        const y = centerY + innerRadius * Math.sin(angle);
        ringDots.push(
            <Circle
                key={`inner-${i}`}
                cx={x}
                cy={y}
                r={dotSize * 0.8}
                fill={color}
                opacity={0.6}
            />
        );
    }

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <G>{ringDots}</G>
        </Svg>
    );
};
