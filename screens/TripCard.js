import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import firebase from '../server/config';
import { Avatar, Image } from 'react-native-elements';

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
              <View style={styles.tripCard} key={idx}>
                <Image
                  source={{ uri: trip.imageUrl }}
                  style={{
                    width: 300,
                    height: 100,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                />
                <View style={styles.tripBtns}>
                  <TouchableHighlight
                    onPress={() =>
                      navigate('SingleTrip', { location: trip.location })
                    }
                  >
                    <Text style={styles.card}>{trip.location}</Text>
                  </TouchableHighlight>
                  <View style={styles.circle}>
                    <ProgressCircle
                      percent={percentage}
                      radius={30}
                      borderWidth={8}
                      color="#66cc66"
                      shadowColor="#999"
                      bgColor="#aaaaaa"
                    >
                      {/* <Avatar
                        size="medium"
                        key={trip.location}
                        rounded
                        source={{ uri: `${trip.imageUrl}` }}
                        containerStyle={{
                          flex: 2,
                          // marginLeft: 15,
                          // marginTop: 5,
                        }}
                      /> */}
                      <Text style={{ fontSize: 18, color: 'white' }}>
                        {Math.floor(percentage)}%
                      </Text>
                    </ProgressCircle>
                  </View>
                </View>
                <Text style={styles.countdown}>
                  <Text style={styles.countdownNum}>{daysLeft}</Text> days left!
                </Text>
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
  tripCard: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#aaaaaa',
    margin: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  card: {
    color: 'white',
    fontFamily: 'Verdana',
    fontSize: 30,
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
  circle: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 20,
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
});

export default TripCard;
