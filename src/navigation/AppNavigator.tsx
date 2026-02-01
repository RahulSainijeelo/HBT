import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { Home, CheckSquare, RotateCcw, User } from 'lucide-react-native';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { HabitDetailScreen } from '../screens/HabitDetailScreen';
import { HabitKnowledgeScreen } from '../screens/HabitKnowledgeScreen';
import { useTheme } from '../theme';
import { NothingLogo } from '../components/NothingLogo';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const GlobalHeader = ({ navigation }: any) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.header, { backgroundColor: theme.colors.background, paddingTop: Platform.OS === 'ios' ? 50 : 20 }]}>
            <NothingLogo size={36} />
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <View style={[styles.profileBtn, { backgroundColor: theme.colors.surface1, borderColor: theme.colors.border }]}>
                    <User size={18} color={theme.colors.text} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const TabNavigator = ({ navigation }: any) => {
    const { theme } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
};

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
                <Stack.Screen name="HabitKnowledge" component={HabitKnowledgeScreen} />
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
    },
    profileBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    }
});
