import { StyleSheet, Platform, Image, Text, View } from 'react-native';
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import store from './store/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import { Icon } from 'react-native-elements';

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
      screen: SingleTrip
    },
    NewTrip: {
      screen: NewTrip
    },
    Itinerary: {
      screen: Itinerary
    },
    Todos: {
      screen: Todos
    }
  },
  {
    initialRouteName: 'Loading',
  }
);

const NavBar = createBottomTabNavigator(
  {
    Howl: {
      screen: Howl
    },
    Dashboard: AppStackNavigator,
    Profile: {
      screen: Profile
    }
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Howl') {
          iconName = 'ios-chatbubbles';
        } else if (routeName === 'Dashboard') {
          iconName = 'ios-home';
        } else {
          iconName = 'ios-person';
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />
      }
    })
  },
  {
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'gray'
    }
  }
);

const AppContainer = createAppContainer(NavBar);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
