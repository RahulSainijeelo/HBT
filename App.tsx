import React from 'react';
import { StatusBar, View } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  // Defensive check for GestureHandlerRootView
  const RootView = GestureHandlerRootView || View;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={theme?.colors?.background || '#000'} />
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
};

export default App;
