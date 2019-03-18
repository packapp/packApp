import React, {Component} from 'react';
import { Text } from 'react-native';

export default class HowlChat extends Component {
  render(){
    const person = this.props.navigation.state.params.person;
    return(
      <Text>Howl Chat with {person}</Text>
    );
  }
}
