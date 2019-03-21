import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import firebase from '../server/config';
import { Avatar, Image, Tile } from 'react-native-elements';

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
              <View key={idx}>
                <View style={{flex: 1}}>
                  <Tile
                    imageSrc={{uri: trip.imageUrl}}
                    title={trip.location}
                    titleStyle={{ fontSize: 12 }}
                    caption={`${daysLeft} days left!`}
                    featured
                    captionStyle={{ fontSize: 16 }}
                    height={200}
                    onPress={() =>
                      navigate('SingleTrip', { location: trip.location, userId: this.props.userId })
                    }
                  />
                </View>
                <View style={styles.tripCard} >
                  <View style={styles.circle}>
                    <ProgressCircle
                      percent={percentage}
                      radius={20}
                      borderWidth={4}
                      color="#66cc66"
                      shadowColor="#999"
                      bgColor='#f8f8f8'
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
    marginBottom: 40,
    paddingTop: 10,
    marginLeft: 10
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
  circle: {
    flex: 1,
    alignItems: 'flex-start',
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
