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
import { Icon, Card, PricingCard, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchUser } from '../store/user';
import {
  fetchAlphaTrips,
  fetchPackTrips,
  fetchSingleTrip,
} from '../store/trip';
import { fetchUsers } from '../store/usersPerTrips';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    //testing if fetch single trip works:
    // this.props.fetchSingleTrip('Antarctica');
    // this.props.fetchUsers([
    //   'H4hILMW5zgQSWHq2pGbrcAAsvbE3',
    //   'Zoap5Oj0UlXbQuNKQYawbpo1aP13',
    //   'xSnhikuzZMZBAkzC7hhOrlik5j62',
    // ]);
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
            {this.props.alphaTrips.length > 0 ? (
              this.props.alphaTrips.map((trip, idx) => {
                return (
                  <View key={idx}>
                    <TouchableHighlight
                      style={styles.tripBtns}
                      onPress={() =>
                        navigate('SingleTrip', { location: trip.location })
                      }
                    >
                      <Text>{trip.location}</Text>
                    </TouchableHighlight>
                  </View>
                );
              })
            ) : (
              <Text>You are not the Alpha for any trips yet!</Text>
            )}
            {this.props.packTrips.length > 0 ? (
              this.props.packTrips.map((trip, idx) => {
                return (
                  <View key={idx} style={styles.tripBtns}>
                    <TouchableHighlight
                      onPress={() =>
                        navigate('SingleTrip', { location: trip.location })
                      }
                    >
                      <Text style={styles.card}>{trip.location}</Text>
                    </TouchableHighlight>
                  </View>
                );
              })
            ) : (
              <Text>You have not joined any packs yet!</Text>
            )}
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
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
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
