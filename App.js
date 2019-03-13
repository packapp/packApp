import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
// import the different screens
import Loading from './screens/Loading';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
// create our app's navigation stack
const AppStackNavigator = createStackNavigator(
  {
    Loading: {
      screen: Loading
    },
    SignUp: {
      screen: SignUp
    },
    Login: {
      screen: Login
    },
    Dashboard: {
      screen: Dashboard
    }
  },
  {
    initialRouteName: 'Loading'
  }
);

const App = createAppContainer(AppStackNavigator);
export default App;
