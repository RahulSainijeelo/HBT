import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { theme } from '../theme';
import { Home, CheckSquare, RotateCcw, User } from 'lucide-react-native';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { NothingText } from '../components/NothingText';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const GlobalHeader = ({ navigation }: any) => {
    const { currentUser } = useAppStore();
    return (
        <View style={styles.header}>
            <View style={styles.dotIcon}>
                <View style={styles.tinyDot} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <View style={styles.profileBtn}>
                    <User size={18} color={theme.colors.text} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const TabNavigator = ({ navigation }: any) => (
    <View style={{ flex: 1 }}>
        <GlobalHeader navigation={navigation} />
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: theme.colors.border,
                    height: Platform.OS === 'ios' ? 88 : 64,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
                    paddingTop: 12,
                },
                tabBarActiveTintColor: theme.colors.text,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Tasks"
                component={TasksScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Habits"
                component={HabitsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <RotateCcw size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    </View>
);

export const AppNavigator = () => {
    const { currentUser } = useAppStore();

    if (!currentUser) {
        return <LoginScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: theme.colors.background,
    },
    dotIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tinyDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
    },
    profileBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.surface1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    }
});
