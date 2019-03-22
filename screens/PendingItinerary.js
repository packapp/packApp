import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import ProgressCircle from 'react-native-progress-circle';
import firebase from '../server/config';

export default class PendingItinerary extends Component {
  static navigationOptions = {
    title: 'Pending items',
  };

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('trips');
    this.unsubscribe = null;
    this.state = {
      pending: [],
    };
  }

  componentDidMount() {
    const trip = this.props.navigation.state.params.trip;
    const itinerary = trip.itinerary;
    let pendingItems = [];
    itinerary.map(item => {
      let date = new Date(null);
      date.setSeconds(item.time.seconds);
      if (!item.approved)
        pendingItems.push({ ...item, time: `${date}`.slice(0, 24) });
    });
    this.setState({
      pending: pendingItems,
    });
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = async querySnapshot => {
    let trips = [];
    await querySnapshot.forEach(doc => {
      trips.push(doc.data());
    });

    let trip = [];
    trips.map(item => {
      if (item.location === this.props.navigation.state.params.trip.location)
        trip = item;
    });

    // setting all updated items to database
    const db = firebase.firestore();
    const tripRef = await db.collection('trips').doc(trip.location);
    let items = trip.itinerary.map(item => {
      if (item.numApproved < item.numForApproval) {
        return item;
      } else {
        return { ...item, approved: true };
      }
    });
    await tripRef.update({
      itinerary: items,
    });

    // setting updated pending items to state
    let pendingItems = [];
    trip.itinerary.map(item => {
      let date = new Date(null);
      date.setSeconds(item.time.seconds);
      if (!item.approved)
        pendingItems.push({ ...item, time: `${date}`.slice(0, 24) });
    });

    pendingItems.map(item => {
      if (item.numApproved < item.numForApproval) {
        return item;
      } else {
        return { ...item, approved: true };
      }
    });

    this.setState({
      pending: pendingItems,
    });
  };

  calcPercentage = item => {
    const denom = item.numForApproval;
    const num = item.numApproved;
    return (num / denom) * 100;
  };

  handleAddApproval = async title => {
    const trip = this.props.navigation.state.params.trip;
    const itin = [];
    trip.itinerary.map(item => {
      if (item.title === title) itin.push(item);
    });
    const db = firebase.firestore();
    const tripRef = await db.collection('trips').doc(trip.location);
    const tripRefData = await tripRef.get();
    const itineraryData = tripRefData.data().itinerary;
    const updatedItinerary = itineraryData.map(item => {
      if (item.title !== itin[0].title) {
        return item;
      } else {
        const num = item.numApproved + 1;
        return {
          ...item,
          numApproved: num,
          approvedBy: [
            ...item.approvedBy,
            this.props.navigation.state.params.userId,
          ],
        };
      }
    });
    await tripRef.update({
      itinerary: updatedItinerary,
    });
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
        {this.state.pending && this.state.pending.length ? (
          this.state.pending.map(item => {
            if (!item.approved)
              return (
                <View key={item.title} style={styles.row}>
                  <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.text}>{item.time}</Text>
                  </View>
                  <ProgressCircle
                    percent={this.calcPercentage(item)}
                    radius={35}
                    borderWidth={10}
                    color="#66cc66"
                    shadowColor="#f8f8f8"
                    bgColor="#f8f8f8"
                  >
                    {!item.approvedBy.includes(
                      this.props.navigation.state.params.userId
                    ) ? (
                      <Button
                        buttonStyle={{
                          backgroundColor: '#ff9933',
                          borderRadius: 50,
                          height: 50,
                          width: 50,
                          alignSelf: 'center',
                          padding: 10,
                          marginLeft: 10,
                          marginRight: 10,
                        }}
                        onPress={() => this.handleAddApproval(item.title)}
                        title={<Icon name="ios-checkmark" size={25} />}
                      />
                    ) : (
                      <Button
                        buttonStyle={{
                          backgroundColor: '#aaaaaa',
                          borderRadius: 50,
                          height: 50,
                          width: 50,
                          alignSelf: 'center',
                          padding: 10,
                          marginLeft: 10,
                          marginRight: 10,
                        }}
                        // onPress={() => this.handleAddApproval(item.title)}
                        title={<Icon name="ios-checkmark" size={25} />}
                      />
                    )}
                  </ProgressCircle>
                </View>
              );
          })
        ) : (
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={styles.title}>No pending items</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    fontSize: 15,
  },
  header: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    color: '#ff9933',
  },
  description: {
    fontFamily: 'Verdana',
  },
  text: {
    fontFamily: 'Verdana',
    color: '#aaaaaa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
});
