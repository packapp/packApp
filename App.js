import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
// import the different screens
import Loading from './screens/Loading';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import store from './store/index';
// create our app's navigation stack

const AppStackNavigator = createStackNavigator(
  {
    Loading: {
      screen: Loading,
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        headerLeft: null,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        headerLeft: null,
      },
    },
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        headerLeft: null,
      },
    },
  },
  {
    initialRouteName: 'Loading',
  }
);

const AppContainer = createAppContainer(AppStackNavigator);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
