import React, { Component } from 'react';
//import firebase from '../server/config';
import * as firebase from 'firebase';

import { StyleSheet, Text, Button, View, ScrollView } from 'react-native';
import { Input, Avatar } from 'react-native-elements';

import DateTimePicker from 'react-native-modal-datetime-picker';

class NewItin extends Component {
  static navigationOptions = {
    title: 'Add Itinerary Item'
  }

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

  calcNumForApproval(numOfUsers) {
    return Math.ceil(numOfUsers.length / 2);
  }
  componentDidMount() {}

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
    this.createNewItinerary(
      this.state,
      this.props.navigation.state.params.trip,
      this.props.navigation.state.params.itin
    );
    this.props.navigation.navigate('Dashboard');
  }

  createNewItinerary = async (itinInfo, trip) => {
    itinInfo.time =
      String(itinInfo.date).slice(0, 10) + String(itinInfo.time2).slice(10);

    try {
      const numForApproval = this.calcNumForApproval(
        this.props.navigation.state.params.users
      );

      let approved = false;

      if (numForApproval === 1) {
        approved = true;
      }
      const newItin = {
        title: itinInfo.title,
        description: itinInfo.description,
        time: new Date(itinInfo.time),
        numForApproval: this.calcNumForApproval(
          this.props.navigation.state.params.users
        ),
        approved: approved,
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
    return (
      <ScrollView style={{marginTop: 50}}>
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
        <Text style={styles.dateInput}>Date and Time</Text>
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
          <View style={{ flex: 1 }}>
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
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                margin: 5,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20,
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
          </View>
        </View>
        <View style={{ backgroundColor: '#ff9933', borderRadius: 50, margin: 20 }}>
          <Button
            title="Add Item"
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
    fontSize: 18
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
