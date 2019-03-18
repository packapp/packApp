import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import React, { Component } from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
} from 'react-navigation';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store from './store/index';
// import the different screens
import Loading from './screens/Loading';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import SingleTrip from './screens/SingleTrip';
import NewTrip from './screens/NewTrip';
import Itinerary from './screens/Itinerary';
import Todos from './screens/Todos';
import Profile from './screens/Profile';
import Howl from './screens/Howl';
import TripCard from './screens/TripCard';

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
    SingleTrip: {
      screen: SingleTrip,
    },
    NewTrip: {
      screen: NewTrip,
    },
    Itinerary: {
      screen: Itinerary,
    },
    Todos: {
      screen: Todos,
    },
    Howl: {
      screen: Howl,
    },
    TripCard: {
      screen: TripCard,
    },
    Profile: {
      screen: Profile,
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
