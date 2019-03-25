import React, { Component } from 'react';
import {
  createStackNavigator,
  createAppContainer,
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
import Flights from './screens/Flights';
import TripCard from './screens/TripCard';
import Places from './screens/Places';
import HowlChat from './screens/HowlChat';
import NewTodo from './screens/NewTodo';
import HowlGroup from './screens/HowlGroup';
import RecentActivity from './screens/RecentActivity'
import NewItin from './screens/NewItin';
import PendingItinerary from './screens/PendingItinerary';
import FriendProfile from './screens/FriendProfile';
import EditProfile from './screens/EditProfile';
import SingleTodos from './screens/SingleTodos';

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
      navigationOptions: {
        headerLeft: null,
      },
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
    Flights: {
      screen: Flights,
    },
    Places: {
      screen: Places,
    },
    HowlChat: {
      screen: HowlChat,
    },
    NewTodo: {
      screen: NewTodo,
    },
    HowlGroup: {
      screen: HowlGroup,
    },
    RecentActivity: {
      screen: RecentActivity
    },
    NewItin: {
      screen: NewItin,
    },
    PendingItinerary: {
      screen: PendingItinerary,
    },
    FriendProfile: {
<<<<<<< HEAD
      screen: FriendProfile
    },
    EditProfile: {
      screen: EditProfile
    }
=======
      screen: FriendProfile,
    },
    SingleTodos: {
      screen: SingleTodos,
    },
>>>>>>> 262b04528509bee0ee3370e01eacf2d95a17745b
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
