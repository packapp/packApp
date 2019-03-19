import React, { Component } from 'react';
import MultiSelect from 'react-native-multiple-select';

import { StyleSheet, Text, Button, View, ScrollView } from 'react-native';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';

import DatePicker from 'react-native-datepicker';

import { fetchAirport } from '../store/airports';

import { Dropdown } from 'react-native-material-dropdown';

import { fetchUsers } from '../store/allUsers';

import { createNewTrip } from '../store/trip';

class NewTrip extends Component {
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
    };
    this.pickerValueChange = this.pickerValueChange.bind(this);
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
    this.handleOnPress = this.handleOnPress.bind(this);
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
  }

  getSelectedImages(selectedImage) {
    this.setState({
      imageUrl: selectedImage,
    });
  }
  render() {
    const users = this.props.allUsers
      ? this.props.allUsers.map(user => {
          return { name: `${user.firstName} ${user.lastName}`, id: user.id };
        })
      : [];
    const userId = this.props.navigation.state.params.userId;
    console.log('USERID', userId);
    return (
      <ScrollView>
        <Text style={styles.header}>create a new pack</Text>
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
          <Text style={styles.label}>Start Date</Text>

          <DatePicker
            style={{ width: 200, height: 40, marginLeft: 3, marginTop: 7 }}
            date={this.state.startDate}
            mode="date"
            placeholder="select date"
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
              this.setState({ startDate: date });
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
            flex: 1,
            flexDirection: 'row',
            maxHeight: 50,
            width: '100%',
          }}
        >
          <Text style={styles.label}>End Date</Text>

          <DatePicker
            style={{ width: 200, height: 40, marginLeft: 11, marginTop: 7 }}
            date={this.state.endDate}
            mode="date"
            placeholder="select date"
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
              this.setState({ endDate: date });
            }}
          />
        </View>
        <View
          style={{
            marginTop: 7,
            borderColor: 'white',
            borderBottomColor: 'grey',
            borderWidth: 1,
            width: '95%',
          }}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: 150 }}>
            <Input
              placeholder="starting airport"
              style={styles.textInput}
              onChangeText={startAirCity => {
                this.setState({ startAirCity });
              }}
              value={this.state.startAirCity}
            />
          </View>
          <View style={{ backgroundColor: '#aaaaaa', borderRadius: 10 }}>
            <Button
              title="search airports by city"
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
          <Text style={styles.airportLabel}> select a departure airport</Text>
          <View style={{ width: 150, marginLeft: 10 }}>
            <Dropdown
              data={this.state.data}
              value={this.state.startAirport}
              onChangeText={value => {
                this.setState({ startAirport: value });
                console.log(this.state);
              }}
            />
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: 150 }}>
            <Input
              placeholder="destination airport"
              style={styles.textInput}
              onChangeText={endAirCity => {
                this.setState({ endAirCity });
              }}
              value={this.state.endAirCity}
            />
          </View>
          <View style={{ backgroundColor: '#aaaaaa', borderRadius: 10 }}>
            <Button
              title="search airports by city"
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
          <Text style={styles.airportLabel}> select an arrival airport</Text>
          <View style={{ width: 150, marginLeft: 10 }}>
            <Dropdown
              data={this.state.data}
              value={this.state.endAirport}
              onChangeText={value => {
                this.setState({ endAirport: value });
                console.log(this.state);
              }}
            />
          </View>
        </View>
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
        {/* {console.log('statePACK', this.state.selectedItems)} */}
        <View style={{ height: 100 }} />
        <View style={{ backgroundColor: '#ff9933', borderRadius: 10 }}>
          <Button
            title="start the pack!"
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
  airportLabel: {
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: 'Verdana',
    fontSize: 15,
    width: 150,
    textAlign: 'left',
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
