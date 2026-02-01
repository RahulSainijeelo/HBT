import { GlobalHeader } from '../components/GlobalHeader';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CheckSquare, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator();

export const TabNavigator = ({ navigation }: any) => {
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