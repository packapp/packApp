import React, { Component } from 'react';
import MultiSelect from 'react-native-multiple-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { StyleSheet, Text, Button, View } from 'react-native';
import { Input, Button as Test, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { fetchAirport } from '../store/airports';

import { Dropdown } from 'react-native-material-dropdown';

import { fetchUsers } from '../store/allUsers';

import { createNewTrip } from '../store/trip';

import DateTimePicker from 'react-native-modal-datetime-picker';

class NewTrip extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Create a new pack',
      headerLeft: (
        <Test
          onPress={() => navigation.goBack()}
          type="clear"
          icon={<Icon name="chevron-left" size={30} />}
        />
      ),
    };
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
      startAirport: 'Click to choose home airport',
      endAirport: 'Click to choose destination airport',
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

  handleStartDatePicked = async startDate => {
    console.log('A start date has been picked: ', startDate);

    this.hideStartDateTimePicker();
    await this.setState({
      startDate,
    });
    console.log('STATE', this.state.startDate);
  };
  async setDate(newDate) {
    await this.setState({ startDate: newDate });
    console.log(this.state.startDate);
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      destination,
      imageUrl,
      startAirCity,
      endAirCity,
      selectedItems,
      data,
      startAirport,
      endAirport,
    } = this.state;

    const users = [];
    if (this.props.allUsers) {
      this.props.allUsers.forEach(user => {
        if (user.id !== this.props.navigation.state.params.userId) {
          users.push({
            name: `${user.firstName} ${user.lastName}`,
            id: user.id,
          });
        }
      });
    }
    const userId = this.props.navigation.state.params.userId;
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer}>
        <Input
          placeholder="Destination"
          style={styles.textInput}
          onChangeText={destination => this.setState({ destination })}
          value={this.state.destination}
        />
        <Input
          placeholder="Image URL"
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
          <Button title="Start date" onPress={this.showStartDateTimePicker} />
          <DateTimePicker
            isVisible={this.state.isStartDateTimePickerVisible}
            onConfirm={this.handleStartDatePicked}
            onCancel={this.hideStartDateTimePicker}
            mode="date"
            date={this.state.startDate}
            onDateChange={this.setDate}
          />
          {this.state.startDate > new Date() ? (
            <Text>{this.state.startDate.toString().slice(4, 16)}</Text>
          ) : (
            <Text>Pick a date!</Text>
          )}
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
          <Button title="End date" onPress={this.showEndDateTimePicker} />
          <DateTimePicker
            isVisible={this.state.isEndDateTimePickerVisible}
            onConfirm={this.handleEndDatePicked}
            onCancel={this.hideEndDateTimePicker}
            mode="date"
          />
          {this.state.endDate > new Date() ? (
            <Text style={{ fontFamily: 'Verdana', textAlign: 'center' }}>
              {this.state.endDate.toString().slice(4, 16)}
            </Text>
          ) : (
            <Text>Pick a date!</Text>
          )}
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
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Outbound airport
          </Text>
        </View>
        <View style={{ flex: 1, marginTop: 10, flexDirection: 'row' }}>
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
              marginTop: 5,
              alignContent: 'flex-start',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <Button
              title="Search airports"
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
              label=""
              data={this.state.data}
              value={this.state.startAirport}
              onChangeText={value => {
                this.setState({ startAirport: value });
              }}
            />
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            Inbound airport
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
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
              marginTop: 5,
              alignContent: 'flex-start',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <Button
              title="Search airports"
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
              label=""
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
            fontSize={16}
            ref={component => {
              this.multiSelect = component;
            }}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={this.state.selectedItems}
            selectText="Pick your pack"
            searchInputPlaceholderText="Search packmates..."
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
        <View style={{ height: 0 }} />
        <View
          style={{
            backgroundColor: '#ff9933',
            borderRadius: 50,
            flex: 1,
            justifyContent: 'center',
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          {destination &&
          imageUrl &&
          startAirCity &&
          endAirCity &&
          selectedItems.length &&
          data.length &&
          startAirport &&
          endAirport ? (
            <Button
              title="Start your pack!"
              type="outline"
              color="white"
              style={styles.button}
              onPress={this.handleOnPress}
            />
          ) : (
            <Button
              title="Start your pack!"
              type="outline"
              color="white"
              style={styles.button}
            />
          )}
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
    padding: 5,
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
    paddingVertical: 10,
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
