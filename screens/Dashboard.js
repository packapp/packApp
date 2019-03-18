import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import firebase from '../server/config';
import { Icon, Button } from 'react-native-elements';
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
  constructor(props) {
    super(props);
  }
  state = { currentUser: null };

  async componentDidMount() {
    const { currentUser } = await firebase.auth();
    this.setState({ currentUser });
    const userId = this.state.currentUser.uid;
    this.props.fetchUser(userId);
    this.props.fetchAlphaTrips(userId);
    this.props.fetchPackTrips(userId);
  }

  render() {
    const { currentUser } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.buttonContainer}>
            <Icon
              reverse
              name="add"
              type="material"
              color="#ff9933"
              onPress={() => navigate('NewTrip')}
            />
          </View>
          <View>
            <TripCard trips={this.props.alphaTrips} navigate={navigate} />
            <TripCard trips={this.props.packTrips} navigate={navigate} />
          </View>
        </ScrollView>
        <View style={{ height: 50 }} />
        <View style={styles.footer}>
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-chatbubbles" size={30} color="#aaaaaa" />}
            onPress={() =>
              this.props.navigation.navigate('Howl', { user: this.props.user })
            }
          />
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-home" size={30} color="black" />}
          />
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-person" size={30} color="#aaaaaa" />}
            onPress={() => navigate('Profile', { user: this.props.user })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
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
