import React, { Component } from 'react';
import MultiSelect from 'react-native-multiple-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { StyleSheet, Text, Button, View, ScrollView } from 'react-native';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';

import DatePicker from 'react-native-datepicker';

import { fetchAirport } from '../store/airports';

import { Dropdown } from 'react-native-material-dropdown';

import { fetchUsers } from '../store/allUsers';

import { createNewTrip } from '../store/trip';

import DateTimePicker from 'react-native-modal-datetime-picker';

class NewTrip extends Component {
  static navigationOptions = {
    title: 'Create a new pack',
  };
  constructor(props) {
    super(props);
    this.state = {
      destination: '',
      imageUrl: '',
      startDate: new Date(),
      endDate: new Date(),
      startAirCity: '',
      endAirCity: '',
      selectedItems: [],
      data: [],
      startAirport: '',
      endAirport: '',
      isEndDateTimePickerVisible: false,
      isStartDateTimePickerVisible: false,
    };
    this.pickerValueChange = this.pickerValueChange.bind(this);
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
    this.handleOnPress = this.handleOnPress.bind(this);
    this.setDate = this.setDate.bind(this);
  }
  componentDidMount() {
    this.props.fetchUsers();
  }
  pickerValueChange(itemValue, itemIndex) {
    this.setState({ startAirport: itemValue });
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  handleOnPress() {
    this.props.createNewTrip({
      ...this.state,
      host: this.props.navigation.state.params.userId,
    });
    this.props.navigation.navigate('Dashboard');
  }

  getSelectedImages(selectedImage) {
    this.setState({
      imageUrl: selectedImage,
    });
  }

  showEndDateTimePicker = () =>
    this.setState({ isEndDateTimePickerVisible: true });

  hideEndDateTimePicker = () =>
    this.setState({ isEndDateTimePickerVisible: false });

  handleEndDatePicked = endDate => {
    console.log('A end date has been picked: ', endDate);
    this.setState({
      endDate,
    });
    this.hideEndDateTimePicker();
  };

  showStartDateTimePicker = () =>
    this.setState({ isStartDateTimePickerVisible: true });

  hideStartDateTimePicker = () =>
    this.setState({ isStartDateTimePickerVisible: false });

  handleStartDatePicked = startDate => {
    console.log('A end date has been picked: ', startDate);

    this.hideStartDateTimePicker();
    this.setState({
      startDate,
    });
  };
  setDate(newDate) {
    this.setState({ startDate: newDate });
    console.log(this.state.startDate);
  }

  render() {
    const users = this.props.allUsers
      ? this.props.allUsers.map(user => {
          return { name: `${user.firstName} ${user.lastName}`, id: user.id };
        })
      : [];
    const userId = this.props.navigation.state.params.userId;
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
        <Input
          placeholder="destination"
          style={styles.textInput}
          onChangeText={destination => this.setState({ destination })}
          value={this.state.destination}
        />
        <Input
          placeholder="image URL"
          style={styles.textInput}
          onChangeText={imageUrl => this.setState({ imageUrl })}
          value={this.state.imageUrl}
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
          <Button title="Start Date" onPress={this.showStartDateTimePicker} />
          <DateTimePicker
            isVisible={this.state.isStartDateTimePickerVisible}
            onConfirm={this.handleStartDatePicked}
            onCancel={this.hideStartDateTimePicker}
            mode="date"
            date={this.state.startDate}
            onDateChange={this.setDate}
          />
          {/* {this.state.startDate > new Date() ? (
            <Text>{Date(this.state.startDate).slice(4, 16)}</Text>
          ) : (
            <Text>Pick a date!</Text>
          )} */}
        </View>
        <View
          style={{
            flex: 1,
            borderColor: 'white',
            borderBottomColor: 'grey',
            alignSelf: 'center',
            borderWidth: 1,
            width: '95%',
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            maxHeight: 50,
            width: '100%',
          }}
        >
          <Button title="End Date" onPress={this.showEndDateTimePicker} />
          <DateTimePicker
            isVisible={this.state.isEndDateTimePickerVisible}
            onConfirm={this.handleEndDatePicked}
            onCancel={this.hideEndDateTimePicker}
            mode="date"
          />
        </View>
        <View
          style={{
            marginTop: 7,
            borderColor: 'white',
            borderBottomColor: 'grey',
            alignSelf: 'center',
            borderWidth: 1,
            width: '95%',
          }}
        />
        <View style={{ flex: 1, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Choose city"
              style={styles.textInput}
              onChangeText={startAirCity => {
                this.setState({ startAirCity });
              }}
              value={this.state.startAirCity}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#aaaaaa',
              borderRadius: 50,
              marginTop: 20,
              alignContent: 'flex-start',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <Button
              title="search airports"
              type="outline"
              color="white"
              style={styles.button}
              onPress={async () => {
                await this.props.fetchAirport(this.state.startAirCity);
                this.setState({
                  data: this.props.airports.map(airport => {
                    return { value: airport };
                  }),
                });
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            height: 70,
            width: 100,
            marginTop: 5,
          }}
        >
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Dropdown
              dropdownOffset={{ top: 15, bottom: 0 }}
              containerStyle={{ width: 390 }}
              label="select a departure airport"
              data={this.state.data}
              value={this.state.startAirport}
              onChangeText={value => {
                this.setState({ startAirport: value });
              }}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Choose city"
              style={styles.textInput}
              onChangeText={endAirCity => {
                this.setState({ endAirCity });
              }}
              value={this.state.endAirCity}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#aaaaaa',
              borderRadius: 50,
              marginTop: 20,
              alignContent: 'flex-start',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <Button
              title="search airports"
              type="outline"
              color="white"
              style={styles.button}
              onPress={async () => {
                await this.props.fetchAirport(this.state.endAirCity);
                this.setState({
                  data: this.props.airports.map(airport => {
                    return { value: airport };
                  }),
                });
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            height: 70,
            width: 100,
            marginTop: 5,
          }}
        >
          <View style={{ width: 150, marginLeft: 10 }}>
            <Dropdown
              dropdownOffset={{ top: 15, bottom: 0 }}
              containerStyle={{ width: 390 }}
              label="select an arrival airport"
              data={this.state.data}
              value={this.state.endAirport}
              onChangeText={value => {
                this.setState({ endAirport: value });
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <MultiSelect
            hidTags
            hideTags
            items={users}
            uniqueKey="id"
            ref={component => {
              this.multiSelect = component;
            }}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={this.state.selectedItems}
            selectText="pick your pack"
            searchInputPlaceholderText="search packmates..."
            onChangeInput={text => console.log(text)}
            altFontFamily="Verdana"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
          />
        </View>
        <View style={{ height: 10 }} />
        <View
          style={{
            backgroundColor: '#ff9933',
            borderRadius: 50,
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            width: 250,
          }}
        >
          <Button
            title="Pack!"
            type="outline"
            color="white"
            style={styles.button}
            onPress={this.handleOnPress}
          />
        </View>
      </KeyboardAwareScrollView>
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
    color: 'white',
    backgroundColor: '#aaaaaa',
  },
  label: {
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: 'Verdana',
    fontSize: 15,
  },
  airportLabel: {
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: 'Verdana',
    fontSize: 15,
    width: 150,
    textAlign: 'left',
  },
  contentContainer: {
    paddingVertical: 20,
  },
});

const mapStateToProps = state => {
  return {
    airports: state.airports,
    allUsers: state.allUsers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAirport: cityName => dispatch(fetchAirport(cityName)),
    fetchUsers: () => dispatch(fetchUsers()),
    createNewTrip: tripData => dispatch(createNewTrip(tripData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTrip);
