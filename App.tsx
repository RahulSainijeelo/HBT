import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useTheme } from './src/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { notificationService } from './src/services/NotificationService';

const App = () => {
  const { theme, isDark } = useTheme();

  useEffect(() => {
    // Request notification permission on app start
    notificationService.requestPermission().then(granted => {
      if (granted) {
        console.log('Notification permission granted');
        notificationService.init();
      } else {
        console.log('Notification permission denied');
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <StatusBar
            barStyle={isDark ? "light-content" : "dark-content"}
            backgroundColor={theme.colors.background}
          />
          <AppNavigator />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
