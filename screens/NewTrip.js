import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  Button,
  KeyboardAvoidingView,
  View,
  Picker,
  ScrollView,
} from 'react-native';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';

import DatePicker from 'react-native-datepicker';

import { fetchAirport } from '../store/airports';

import { Dropdown } from 'react-native-material-dropdown';

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
      pack: [],
      data: [],
      startAirport: '',
      endAirport: '',
    };
    //this.handleOnPress = this.handleOnPress.bind(this);
    this.pickerValueChange = this.pickerValueChange.bind(this);
  }

  // handleOnPress(airports) {
  //   console.log(airports);
  //   this.setState({ airports: airports });
  //   console.log('STATE', this.state.airports);
  // }

  pickerValueChange(itemValue, itemIndex) {
    this.setState({ startAirport: itemValue });
  }
  render() {
    return (
      // <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <ScrollView>
        <Text style={styles.header}>create a new pack</Text>
        <Input
          placeholder="Destination"
          style={styles.textInput}
          onChangeText={destination => this.setState({ destination })}
          value={this.state.destination}
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
        <Input
          placeholder="Starting Airport"
          style={styles.textInput}
          onChangeText={startAirCity => {
            this.setState({ startAirCity });
          }}
          value={this.state.startAirCity}
        />
        <Button
          title="search airports"
          type="outline"
          color="#ff9933"
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
        <View style={{ width: 100 }}>
          <Dropdown
            data={this.state.data}
            value={this.state.startAirport}
            onChangeText={value => {
              this.setState({ startAirport: value });
              console.log(this.state);
            }}
          />
        </View>
        <Input
          placeholder="Ending Airport"
          style={styles.textInput}
          onChangeText={endAirCity => {
            this.setState({ endAirCity });
          }}
          value={this.state.endAirCity}
        />
        <Button
          title="search airports"
          type="outline"
          color="#ff9933"
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
        <View style={{ width: 100 }}>
          <Dropdown
            data={this.state.data}
            value={this.state.endAirport}
            onChangeText={value => {
              this.setState({ endAirport: value });
              console.log(this.state);
            }}
          />
        </View>
        <View style={{ height: 100 }} />
        <Button
          title="start the pack!"
          type="outline"
          color="#ff9933"
          style={styles.button}
          onPress={() => this.props.fetchAirport('Dubai')}
        />
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
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
  button: {
    padding: 10,
  },
  label: {
    alignSelf: 'center',
    marginLeft: 10,
    fontFamily: 'Verdana',
    fontSize: 15,
  },
});

const mapStateToProps = state => {
  return {
    airports: state.airports,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAirport: cityName => dispatch(fetchAirport(cityName)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTrip);
