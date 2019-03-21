import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class FriendProfile extends Component {
  render() {
    const places = this.props.navigation.state.params
    return (
      <Text>Friend Profile</Text>
    );
  }
}
