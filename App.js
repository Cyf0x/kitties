import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from 'kitties/Navigation/Navigation';
import 'react-native-gesture-handler'; 
import { Provider } from 'react-redux'
import Store from 'kitties/Reducers/Store/configureStore.js'

export default function App() {
  return (
    <Provider store={Store}>
      <Navigation  />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
