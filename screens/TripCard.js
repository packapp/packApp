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
import ProgressCircle from 'react-native-progress-circle';

export class TripCard extends React.Component {
  render() {
    const navigate = this.props.navigate;
    return (
      <View>
        {this.props.trips.length > 0 ? (
          this.props.trips.map((trip, idx) => {
            const todosTotal = Object.keys(trip.todos)
              .reduce((acc, key) => {
                return acc.concat(trip.todos[key].map(obj => obj.completed));
              }, [])
              .reduce(
                (acc, bool) => {
                  bool ? (acc.true += 1) : (acc.false += 1);
                  return acc;
                },
                { true: 0, false: 0 }
              );
            const percentage =
              (todosTotal.true / (todosTotal.true + todosTotal.false)) * 100;
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
        )}
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

export default TripCard;
