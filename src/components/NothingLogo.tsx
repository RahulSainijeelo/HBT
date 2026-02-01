import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme';
import { NothingLogoStyles as styles } from '../styles/Nothing.ui.styles';

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
