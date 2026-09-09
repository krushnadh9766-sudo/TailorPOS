import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {AppProvider} from './src/data/AppContext';

function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

export default App;