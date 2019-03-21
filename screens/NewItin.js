import React, { Component } from 'react';
//import firebase from '../server/config';
import * as firebase from 'firebase';

import { StyleSheet, Text, Button, View, ScrollView } from 'react-native';
import { Input } from 'react-native-elements';

import DatePicker from 'react-native-datepicker';

import moment from 'moment';

class NewItin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      time: new Date(),
      numForApproval: 0,
      approved: false,
      numApproved: 1,
    };
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
    this.handleOnPress = this.handleOnPress.bind(this);
  }

  //numOfUsers = this.props.navigation.state.params.users.length;

  calcNumForApproval(numOfUsers) {
    return Math.ceil(numOfUsers.length / 2);
  }
  componentDidMount() {}

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  handleOnPress() {
    this.createNewItinerary(
      this.state,
      this.props.navigation.state.params.trip,
      this.props.navigation.state.params.itin
    );
  }

  createNewItinerary = async (itinInfo, trip) => {
    try {
      const newItin = {
        title: itinInfo.title,
        description: itinInfo.description,
        time: new Date(itinInfo.time),
        numForApproval: this.calcNumForApproval(
          this.props.navigation.state.params.users
        ),
        approved: false,
        numApproved: 1,
      };
      const db = firebase.firestore();
      const tripRef = db.collection('trips').doc(trip);
      await tripRef.update({
        itinerary: firebase.firestore.FieldValue.arrayUnion(newItin),
      });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const users = this.props.allUsers
      ? this.props.allUsers.map(user => {
          return { name: `${user.firstName} ${user.lastName}`, id: user.id };
        })
      : [];
    const userId = this.props.navigation.state.params.userId;

    return (
      <ScrollView>
        <Text style={styles.header}>create a itinerary item</Text>
        <Input
          placeholder="Title"
          style={styles.textInput}
          onChangeText={title => this.setState({ title })}
          value={this.state.title}
        />
        <Input
          placeholder="Description"
          style={styles.textInput}
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
        />
        <View style={{ height: 5 }} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            maxHeight: 50,
            width: '100%',
          }}
        >
          <Text style={styles.label}>date/time</Text>

          <DatePicker
            style={{ width: 200, height: 40, marginLeft: 3, marginTop: 7 }}
            date={this.state.time}
            mode="date"
            placeholder="Select Date"
            format="YYYY-MM-DD"
            minDate={new Date()}
            maxDate="2025-04-01"
            confirmBtnText="Select"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              this.setState({ time: date });
            }}
          />
        </View>
        <View
          style={{
            borderColor: 'white',
            borderBottomColor: 'grey',

            borderWidth: 1,
            width: '95%',
          }}
        />
        <View
          style={{
            marginTop: 7,
            borderColor: 'white',
            borderBottomColor: 'grey',
            borderWidth: 1,
            width: '95%',
          }}
        />

        <View style={{ backgroundColor: '#ff9933', borderRadius: 10 }}>
          <Button
            title="Add to Pending Itinerary!"
            type="outline"
            color="white"
            style={styles.button}
            onPress={this.handleOnPress}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    fontFamily: 'Verdana',
  },
  header: {
    fontSize: 30,
    padding: 10,
    fontWeight: 'bold',
    color: '#ff9933',
  },
  textInput: {
    height: 40,
    flex: 1,
    maxWidth: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
  button: {
    padding: 10,
    flex: 3,
    color: 'white',
    backgroundColor: '#aaaaaa',
  },
  label: {
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: 'Verdana',
    fontSize: 15,
  },
});

export default NewItin;
