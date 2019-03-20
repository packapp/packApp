import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button, CheckBox, Input } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import {fetchTodos} from '../store/todos'
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../server/config';

export default class RecentActivity extends Component {

  render() {
    this.ref = firebase.firestore().collection('trips').doc(this.props.trip)
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        console.log('New todo: ', change.doc.data());
        <View>
          <Text>{change.doc.data()}</Text>
        </View>
      }
      if (change.type === 'modified') {
        console.log('Modified todo: ', change.doc.data());
      }
      if (change.type === 'removed') {
        console.log('Removed todo: ', change.doc.data());
      }
    });
  });
    return (
      <View>
        <Text>test</Text>
      </View>
    )
  }
}
