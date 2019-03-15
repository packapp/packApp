import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  ScrollView,
  FlatList,
  View,
  Button,
} from 'react-native';
import firebase from '../server/config';
import { Icon, Card, PricingCard } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchUser } from '../store/user';
import {
  fetchAlphaTrips,
  fetchPackTrips,
  fetchSingleTrip,
} from '../store/trip';
import { fetchUsers } from '../store/usersPerTrips';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
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

  handleLogOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Loading');
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const { currentUser } = this.state;
    const { navigate } = this.props.navigation;
    // if (this.props.user.places) {
    //   //debugger;
    //   console.log('USER', this.props.user.places.Singapore);
    // } else {
    //   console.log('USER');
    // }
    //for use in singleTrips:
    let userIds = [];
    if (this.props.selectedTrip.attendees) {
      userIds = [...this.props.selectedTrip.attendees];
      userIds.push(this.props.selectedTrip.host);
    }

    console.log(userIds);
    return (
      // <View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.buttonContainer}>
          <Icon reverse name="add" type="material" color="#ff9933" />
        </View>
        <View style={styles.container}>
          {/* {this.props.user.places ? (
            <Text>{this.props.user.places.Singapore.location}</Text>
          ) : null} */}
          {this.props.alphaTrips.length > 0 ? (
            this.props.alphaTrips.map((trip, idx) => {
              return (
                <View style={styles.cardContainer} key={idx}>
                  <Button
                    title={trip.location}
                    onPress={() =>
                      navigate('SingleTrip', { location: trip.location })
                    }
                  />
                </View>
              );
            })
          ) : (
            <Text>You are not the Alpha for any trips yet!</Text>
          )}
          {this.props.packTrips.length > 0 ? (
            this.props.packTrips.map((trip, idx) => {
              return (
                <View style={styles.cardContainer} key={idx}>
                  <Button
                    title={trip.location}
                    onPress={() =>
                      navigate('SingleTrip', { location: trip.location })
                    }
                  />
                </View>
              );
            })
          ) : (
            <Text>You have not joined any packs yet!</Text>
          )}
          <Button title="Log Out" onPress={this.handleLogOut} />
          <Button title="single trip" onPress={() => navigate('SingleTrip')} />
        </View>
      </ScrollView>
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
