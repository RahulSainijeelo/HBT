import React from 'react';
import { StatusBar, View } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useTheme } from './src/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  const { theme, isDark } = useTheme();

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
