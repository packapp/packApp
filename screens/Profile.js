import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Profile extends Component {
  render(){
    return(
      <View style={styles.container}>
        <View>
          <Text>Profile</Text>
        </View>
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
