import React, { Component } from 'react';
import firebase from '../server/config';
import * as firebase2 from 'firebase';

import { StyleSheet, Text, Button, View, ScrollView } from 'react-native';
import { Input, Avatar } from 'react-native-elements';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export const createNewItinerary = async (itinInfo, trip, users, userId) => {
  const calcNumForApproval = numOfUsers => {
    return Math.ceil(numOfUsers.length / 2);
  };
  itinInfo.time =
    String(itinInfo.date).slice(0, 10) + String(itinInfo.time2).slice(10);

  try {
    const numForApproval = calcNumForApproval(users);

    let approved = false;

    if (numForApproval === 1) {
      approved = true;
    }
    const newItin = {
      title: itinInfo.title,
      description: itinInfo.description,
      time: new Date(itinInfo.time),
      numForApproval: calcNumForApproval(users),
      approved: approved,
      numApproved: 1,
      approvedBy: [userId],
    };
    const db = firebase.firestore();
    const tripRef = db.collection('trips').doc(trip);
    await tripRef.update({
      itinerary: firebase2.firestore.FieldValue.arrayUnion(newItin),
    });
  } catch (err) {
    console.error(err);
  }
};

class NewItin extends Component {
  static navigationOptions = {
    title: 'Add an item',
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      time: new Date(),
      numForApproval: 0,
      approved: false,
      numApproved: 1,
      isDateTimePickerVisible: false,
      isTimePickerVisible: false,
      date: '',
      time2: '',
    };
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
    this.handleOnPress = this.handleOnPress.bind(this);
  }

  componentDidMount() {
    if (this.props.navigation.state.params.title) {
      this.setState({ title: this.props.navigation.state.params.title });
    }
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = date => {
    console.log('A date has been picked: ', date);
    this.setState({
      date: date,
    });
    this.hideDateTimePicker();

    console.log('state', this.state.date);
  };

  showTimePicker = () => this.setState({ isTimePickerVisible: true });

  hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  handleTimePicked = time => {
    console.log('A time has been picked: ', time);
    this.hideTimePicker();
    this.setState({
      time2: time,
    });
    console.log('state', this.state.time2);
  };

  handleOnPress() {
    this.setState({
      time:
        String(this.state.date).slice(0, 10) +
        String(this.state.time2).slice(10),
    });
    createNewItinerary(
      this.state,
      this.props.navigation.state.params.trip,
      this.props.navigation.state.params.users,
      this.props.navigation.state.params.userId
    );
    this.props.navigation.navigate('SingleTrip');
  }

  render() {
    console.log('TITLE', this.state.title);
    return (
      <ScrollView style={{ marginTop: 40 }}>
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
        <Text style={styles.dateInput}>Date and time</Text>
        <View
          style={{
            flex: 1,
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 5,
            paddingBotton: 10,
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginLeft: 20,
          }}
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                margin: 10,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar
                size="medium"
                rounded
                avatarStyle={{ backgroundColor: '#66cc66' }}
                icon={{
                  name: 'calendar',
                  color: 'white',
                  type: 'font-awesome',
                }}
                onPress={this.showDateTimePicker}
                activeOpacity={0.7}
                containerStyle={{
                  marginLeft: 20,
                  marginTop: 5,
                  marginRight: 20,
                }}
              />
            </View>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode="date"
            />
            {this.state.date > new Date() ? (
              <Text>{this.state.date.toString().slice(4, 16)}</Text>
            ) : (
              <Text>Pick a date!</Text>
            )}
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                margin: 5,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar
                size="medium"
                rounded
                avatarStyle={{ backgroundColor: '#66cc66' }}
                icon={{
                  name: 'clock-o',
                  color: 'white',
                  type: 'font-awesome',
                }}
                onPress={this.showTimePicker}
                activeOpacity={0.7}
                containerStyle={{
                  marginLeft: 20,
                  marginTop: 5,
                  marginRight: 20,
                }}
              />
            </View>
            <DateTimePicker
              isVisible={this.state.isTimePickerVisible}
              onConfirm={this.handleTimePicked}
              onCancel={this.hideTimePicker}
              mode="time"
            />
            {this.state.time2 !== '' ? (
              <Text>
                {moment(this.state.time2.toString().slice(16, 24), 'HH:mm:ss')
                  .format('h:mm:ss A')
                  .slice(0, -6) +
                  moment(this.state.time2.toString().slice(16, 24), 'HH:mm:ss')
                    .format('h:mm:ss A')
                    .slice(-3)}
              </Text>
            ) : (
              <Text>Pick a time!</Text>
            )}
          </View>
        </View>
        <View
          style={{ backgroundColor: '#ff9933', borderRadius: 50, margin: 20 }}
        >
          <Button
            title="Add item"
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
    fontSize: 20,
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
  dateInput: {
    paddingLeft: 10,
    color: '#C8C8C8',
    fontSize: 18,
  },
  button: {
    padding: 10,
    flex: 3,
    color: 'white',
    backgroundColor: '#aaaaaa',
  },
  dateButton: {
    padding: 10,
    flex: 3,
    margin: 10,
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
