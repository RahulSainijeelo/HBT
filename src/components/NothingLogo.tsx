import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export const NothingLogo = ({ size = 60 }: { size?: number }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: theme.colors.border
        }]}>
            <View style={styles.grid}>
                {[...Array(9)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: i % 2 === 0 ? theme.colors.text : 'transparent',
                                opacity: i === 4 ? 1 : 0.3
                            }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
    },
    grid: {
        width: '60%',
        height: '60%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        margin: 4,
    }
});
