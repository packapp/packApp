import React, {Component} from 'react';
import { View, Text } from 'react-native';

export default class Todos extends Component {
  render(){
    console.log('TODOS', this.props)
    return(
      <View>
        <Text>Todos</Text>
      </View>
    );
  }
}
