import React, {Component} from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Howl extends Component {
  render(){
    return(
      <KeyboardAvoidingView style={{ flex: 1 }}>
          <GiftedChat
          />
        <View style={{flex: .2}}/>
        <View style={styles.footer}>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={30} color="#ff9933"/>} />
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Profile')}/>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 250
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30
  }
});
