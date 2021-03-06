import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Timeline from 'react-native-timeline-listview';
import firebase from '../server/config';
import { Icon } from 'react-native-elements';

export default class Itinerary extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Itinerary',
      headerLeft: (
        <Button
          onPress={() => navigation.goBack()}
          type="clear"
          icon={<Icon name="chevron-left" size={30} />}
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('trips');
    this.unsubscribe = null;
    this.state = {
      itinerary: [],
      allItin: [],
    };
  }

  componentDidMount() {
    const trip = this.props.navigation.state.params.trip;
    const itinerary = trip.itinerary;
    let approvedItems = [];
    itinerary.map(item => {
      let date = new Date(null);
      date.setSeconds(item.time.seconds);
      if (item.approved)
        approvedItems.push({ ...item, time: `${date}`.slice(0, 24) });
    });
    this.setState({
      itinerary: approvedItems,
      allItin: trip.itinerary,
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

    let updatedItin = [];
    trip.itinerary.map(item => {
      if (item.approved) {
        let date = new Date(null);
        date.setSeconds(item.time.seconds);
        updatedItin.push({ ...item, time: `${date}`.slice(0, 24) });
      }
    });

    updatedItin.sort((a, b) => {
      let dateA = new Date(a.time);
      let dateB = new Date(b.time);
      return dateA - dateB;
    });

    this.setState({
      itinerary: updatedItin,
      allItin: trip.itinerary,
    });
  };

  handlePress(event) {
    console.log('IN ITIN', event);
    Alert.alert(
      'Remove this item?',
      '',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.removeItin(event.description),
        },
      ],
      { cancelable: false }
    );
  }

  async removeItin(description) {
    try {
      const db = firebase.firestore();
      const tripRef = db
        .collection('trips')
        .doc(this.props.navigation.state.params.trip.location);
      const query = await tripRef.get();
      const itin = query.data().itinerary;
      const newItin = itin.filter(item => {
        return item.description !== description;
      });
      await tripRef.update({
        itinerary: newItin,
      });
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    const trip = this.props.navigation.state.params.trip;
    return (
      <View style={styles.container}>
        <View style={{ flex: 7 }}>
          <Timeline
            style={styles.list}
            data={this.state.itinerary}
            circleSize={20}
            circleColor="#66cc66"
            lineColor="#66cc66"
            timeContainerStyle={{ width: 125, marginTop: -5 }}
            timeStyle={{
              textAlign: 'left',
              padding: 5,
              fontFamily: 'Verdana',
              fontSize: 13,
            }}
            descriptionStyle={{ color: 'gray', fontFamily: 'Verdana' }}
            titleStyle={{ fontFamily: 'Verdana' }}
            options={{
              style: { paddingTop: 5 },
              removeClippedSubviews: false,
            }}
            onEventPress={event => this.handlePress(event)}
          />
        </View>
        <View style={styles.divider}>
          <Button
            buttonStyle={{
              backgroundColor: '#ff9933',
              borderRadius: 50,
              alignSelf: 'center',
              padding: 10,
              marginLeft: 10,
              marginRight: 10,
            }}
            onPress={() =>
              this.props.navigation.navigate('NewItin', {
                users: this.props.navigation.state.params.users,
                trip: this.props.navigation.state.params.location,
                itin: this.state.allItin,
                userId: this.props.navigation.state.params.userId,
              })
            }
            title="Add an item"
          />
          <Button
            buttonStyle={{
              backgroundColor: '#ff9933',
              borderRadius: 50,
              alignSelf: 'center',
              padding: 10,
              marginLeft: 10,
              marginRight: 10,
            }}
            onPress={() =>
              this.props.navigation.navigate('PendingItinerary', {
                trip: trip,
                userId: this.props.navigation.state.params.userId,
              })
            }
            title="Pending items"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
  },
  divider: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
