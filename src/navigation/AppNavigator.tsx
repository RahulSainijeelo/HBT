import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { theme } from '../theme';
import { LayoutDashboard, CheckSquare, RotateCcw } from 'lucide-react-native';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
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
                }}
            >
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
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
        </NavigationContainer>
    );
};
