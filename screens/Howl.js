import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Howl extends Component {
  render(){
    return(
      <View style={styles.container}>
        <Text>Howl</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  }
});
