import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  ScrollView,
  FlatList,
  View,
  TouchableHighlight,
} from 'react-native';
import firebase from '../server/config';
import { Icon, Card, PricingCard, Button, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchUser } from '../store/user';
import {
  fetchAlphaTrips,
  fetchPackTrips,
  fetchSingleTrip,
} from '../store/trip';
import { fetchUsers } from '../store/usersPerTrips';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressCircle from 'react-native-progress-circle';
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
            <Icon reverse name="add" type="material" color="#ff9933" />
          </View>
          <View>
            <TripCard trips={this.props.alphaTrips} navigate={navigate} />
            <TripCard trips={this.props.packTrips} navigate={navigate} />
            {/* {this.props.alphaTrips.length > 0 ? (
              this.props.alphaTrips.map((trip, idx) => {
                const todosTotal = Object.keys(trip.todos)
                  .reduce((acc, key) => {
                    return acc.concat(
                      trip.todos[key].map(obj => obj.completed)
                    );
                  }, [])
                  .reduce(
                    (acc, bool) => {
                      bool ? (acc.true += 1) : (acc.false += 1);
                      return acc;
                    },
                    { true: 0, false: 0 }
                  );
                const percentage =
                  (todosTotal.true / (todosTotal.true + todosTotal.false)) *
                  100;
                console.log('TODOS TOTAL', todosTotal);
                return (
                  <View key={idx} style={styles.tripBtns}>
                    <TouchableHighlight
                      onPress={() =>
                        navigate('SingleTrip', { location: trip.location })
                      }
                    >
                      <Text style={styles.card}>{trip.location}</Text>
                    </TouchableHighlight>
                    <ProgressCircle
                      percent={percentage}
                      radius={30}
                      borderWidth={8}
                      color="#66cc66"
                      shadowColor="#999"
                      bgColor="#aaaaaa"
                    >
                      <Avatar
                        size="medium"
                        key={trip.location}
                        rounded
                        source={{ uri: `${trip.imageUrl}` }}
                        containerStyle={{
                          flex: 2,
                          // marginLeft: 15,
                          // marginTop: 5,
                        }}
                      />
                    </ProgressCircle>
                  </View>
                );
              })
            ) : (
              <Text>You are not the Alpha for any trips yet!</Text>
            )} */}
            {/* {this.props.packTrips.length > 0 ? (
              this.props.packTrips.map((trip, idx) => {
                const todosTotal = Object.keys(trip.todos)
                  .reduce((acc, key) => {
                    return acc.concat(
                      trip.todos[key].map(obj => obj.completed)
                    );
                  }, [])
                  .reduce(
                    (acc, bool) => {
                      bool ? (acc.true += 1) : (acc.false += 1);
                      return acc;
                    },
                    { true: 0, false: 0 }
                  );
                const percentage =
                  (todosTotal.true / (todosTotal.true + todosTotal.false)) *
                  100;
                console.log('TODOS TOTAL', todosTotal, percentage);
                return (
                  <View key={idx} style={styles.tripBtns}>
                    <TouchableHighlight
                      onPress={() =>
                        navigate('SingleTrip', { location: trip.location })
                      }
                    >
                      <Text style={styles.card}>{trip.location}</Text>
                    </TouchableHighlight>
                    <ProgressCircle
                      percent={percentage}
                      radius={30}
                      borderWidth={8}
                      color="#66cc66"
                      shadowColor="#999"
                      bgColor="#aaaaaa"
                    >
                      <Avatar
                        size="medium"
                        key={trip.location}
                        rounded
                        source={{ uri: `${trip.imageUrl}` }}
                        containerStyle={{
                          flex: 2,
                          // marginLeft: 15,
                          // marginTop: 5,
                        }}
                      />
                    </ProgressCircle>
                  </View>
                );
              })
            ) : (
              <Text>You have not joined any packs yet!</Text>
            )} */}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-chatbubbles" size={30} color="#aaaaaa" />}
            onPress={() => this.props.navigation.navigate('Howl')}
          />
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-home" size={30} color="#ff9933" />}
          />
          <Button
            style={styles.navBtns}
            type="clear"
            icon={<Ionicons name="ios-person" size={30} color="#aaaaaa" />}
            onPress={() => this.props.navigation.navigate('Profile')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  cardContainer: {
    flex: 1,
    width: 300,
    backgroundColor: '#aaaaaa',
  },
  card: {
    color: 'white',
    fontFamily: 'Verdana',
    fontSize: 30,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripBtns: {
    padding: 10,
    backgroundColor: '#aaaaaa',
    margin: 20,
    alignItems: 'center',
    borderRadius: 10,
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
