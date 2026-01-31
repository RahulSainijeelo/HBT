import React from 'react';
import { StatusBar, View } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  // Defensive check for GestureHandlerRootView
  const RootView = GestureHandlerRootView || View;

  return (
    <RootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={theme?.colors?.background || '#000'} />
      <AppNavigator />
    </RootView>
  );
};

export default App;
