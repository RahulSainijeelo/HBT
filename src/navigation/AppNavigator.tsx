import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { StyleSheet } from 'react-native';
import { HabitDetailScreen } from '../screens/HabitDetailScreen';
import { HabitKnowledgeScreen } from '../screens/HabitKnowledgeScreen';
import { TabNavigator } from './TabNavigator';
import { WidgetAddScreen } from '../screens/WidgetAddScreen';
import { WidgetLabelPickerScreen } from '../screens/WidgetLabelPickerScreen';
import { WidgetActionHandler } from '../screens/WidgetActionHandler';

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['rise://'],
    config: {
        screens: {
            Main: {
                path: 'home',
                screens: {
                    Home: 'root',
                    Tasks: 'tasks',
                    Habits: 'habits',
                }
            },
            HabitDetail: 'item/:habitId/habit',
            Profile: 'profile',
            // Widget shortcuts
            MainAdd: {
                path: 'add',
                exact: true,
            },
            LabelPicker: {
                path: 'label-picker',
                exact: true,
            },
            // Widget action handlers
            WidgetToggle: {
                path: 'toggle/:itemId/:itemType',
            },
            WidgetHabitDetail: {
                path: 'habit-detail/:itemId/:itemType',
            }
        }
    }
};

export const AppNavigator = () => {
    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
                <Stack.Screen name="HabitKnowledge" component={HabitKnowledgeScreen} />
                <Stack.Screen name="MainAdd" component={WidgetAddScreen} options={{ presentation: 'transparentModal', animation: 'fade' }} />
                <Stack.Screen name="LabelPicker" component={WidgetLabelPickerScreen} options={{ presentation: 'transparentModal', animation: 'fade' }} />
                <Stack.Screen name="WidgetToggle" component={WidgetActionHandler} options={{ animation: 'none' }} />
                <Stack.Screen name="WidgetHabitDetail" component={WidgetActionHandler} options={{ animation: 'none' }} />
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

export { styles };
