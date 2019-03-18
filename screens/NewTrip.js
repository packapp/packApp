import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';

export default class NewTrip extends Component {
  constructor() {
    super();
    this.state = {
      location: '',
      startDate: '',
      endDate: '',
      imageUrl: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {}
  render() {
    return (
      <View>
        <FormLabel>Create a New Trip</FormLabel>
        <FormInput onChangeText={this.handleOnChange} />
        <FormValidationMessage>Error message</FormValidationMessage>
      </View>
    );
  }
}
