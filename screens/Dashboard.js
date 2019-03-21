import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import firebase from '../server/config';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { fetchUser } from '../store/user';
import {
  fetchAlphaTrips,
  fetchPackTrips,
  fetchSingleTrip,
} from '../store/trip';
import { fetchUsers } from '../store/usersPerTrips';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TripCard from './TripCard';

class Dashboard extends React.Component {
  static navigationOptions = {
    title: 'Dashboard',
  };
  constructor(props) {
    super(props);
    this.tripsRef = firebase.firestore().collection('trips');
    this.unsubcribeTrips = null;
    this.state = { currentUser: null, trips: [] };
  }

  onCollectionUpdate = querySnapshot => {
    const trips = [];
    querySnapshot.forEach(doc => {
      if (doc.data().endDate.toDate() > new Date()) {
        trips.push(doc.data());
      }
    });
    this.setState({ trips });
  };

  async componentDidMount() {
    const { currentUser } = await firebase.auth();
    this.setState({ currentUser });
    const userId = this.state.currentUser.uid;
    this.props.fetchUser(userId);
    this.props.fetchAlphaTrips(userId);
    this.props.fetchPackTrips(userId);
    const newTrips = this.props.alphaTrips
      ? this.props.alphaTrips.filter(trip => {
          return trip.endDate < new Date();
        })
      : null;
    newTrips.concat(
      this.props.packTrips
        ? this.props.packTrips.filter(trip => {
            return trip.endDate < new Date();
          })
        : null
    );
    this.setState({
      trips: newTrips,
    });
    this.unsubcribeTrips = this.tripsRef.onSnapshot(this.onCollectionUpdate);
  }
  componentWillUnmount() {
    this.unsubcribeTrips();
  }

  render() {
    const { currentUser } = this.state;
    const { navigate } = this.props.navigation;
    const userId = currentUser ? currentUser.uid : 'test';
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.buttonContainer}>
            <Icon
              name="ios-add-circle"
              size={40}
              color="#66cc66"
              onPress={() =>
                navigate('NewTrip', { userId: this.state.currentUser.uid })
              }
            />
          </View>
          <View>
            <TripCard
              trips={this.state.trips}
              navigate={navigate}
              userId={userId}
            />
          </View>
        </ScrollView>
        <View style={{ height: 50 }} />
        <View style={styles.footer}>
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-chatbubbles" size={25} color="#aaaaaa" />}
            onPress={() =>
              this.props.navigation.navigate('Howl', {
                user: this.props.user,
                userId: this.state.currentUser.uid,
              })
            }
          />
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-home" size={25} color="black" />}
          />
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-person" size={25} color="#aaaaaa" />}
            onPress={() =>
              navigate('Profile', {
                user: this.props.user,
                userId: this.state.currentUser.uid,
              })
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30,
  },
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    places: state.user.user.places,
    selectedTrip: state.trip.selectedTrip,
    alphaTrips: state.trip.alpha,
    packTrips: state.trip.pack,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: userId => dispatch(fetchUser(userId)),
    fetchAlphaTrips: userId => dispatch(fetchAlphaTrips(userId)),
    fetchPackTrips: userId => dispatch(fetchPackTrips(userId)),
    fetchSingleTrip: trip => dispatch(fetchSingleTrip(trip)),
    fetchUsers: userIds => dispatch(fetchUsers(userIds)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
