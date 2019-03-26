import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from '../server/config';
import { Tile } from 'react-native-elements';

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
            const percentage = todosTotal.true
              ? (todosTotal.true / (todosTotal.true + todosTotal.false)) * 100
              : 0;
            const daysLeft = Math.floor(
              (Date.parse(trip.startDate.toDate()) - Date.parse(new Date())) /
                86400000
            );
            return (
              <View key={idx} style={styles.test}>
                <View style={{ flex: 1 }}>
                  <Tile
                    imageSrc={{ uri: trip.imageUrl }}
                    title={trip.location}
                    titleStyle={{ fontSize: 12, marginBottom: 5 }}
                    caption={`${daysLeft} days left!`}
                    featured
                    captionStyle={{ fontSize: 16, marginTop: 0 }}
                    height={200}
                    onPress={() =>
                      navigate('SingleTrip', {
                        location: trip.location,
                        userId: this.props.userId,
                      })
                    }
                  />
                </View>
                <View style={styles.tripCard}>
                  <View style={styles.circle}>
                    <ProgressCircle
                      percent={percentage}
                      radius={20}
                      borderWidth={3}
                      color="#66cc66"
                      shadowColor="#999"
                      bgColor="white"
                    >
                      <Text style={{ fontSize: 10, color: 'black' }}>
                        {Math.floor(percentage)}%
                      </Text>
                    </ProgressCircle>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={styles.noTrips}>No upcoming trips!</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tripCard: {
    paddingTop: 10,
    width: '50%',
  },
  card: {
    color: 'white',
    fontFamily: 'Verdana',
    fontSize: 25,
    //marginLeft: 30,
    padding: 5,
    fontWeight: 'bold',
  },
  tripBtns: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    //backgroundColor: '#aaaaaa',
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  countdown: {
    color: 'white',
    fontFamily: 'Verdana',
    fontSize: 25,
    // fontWeight: 'bold',
    padding: 10,
  },
  countdownNum: {
    color: '#ff9933',
    fontFamily: 'Verdana',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 10,
  },
  test: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  circle: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  noTrips: {
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default TripCard;
