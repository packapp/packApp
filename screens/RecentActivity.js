import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button, CheckBox, Input } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import {fetchTodos} from '../store/todos'
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../server/config';

export default class RecentActivity extends Component {
  constructor(props) {
    super(props)
      this.ref = firebase.firestore().collection('trips').where('location', "==", this.props.trip)
      this.unsubscribe = null;
      this.state = {
        updatedDoc: []
      }
  }
  async componentDidMount() {
    this.setState({updatedDoc: this.props.trip})
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  onCollectionUpdate = (querySnapshot) => {
    const updatedDoc = []
    querySnapshot.docChanges().forEach(function(change) {
        if (change.type === "added") {
          console.log("added: ", change.doc.data());
        }
        if (change.type === "modified") {
            console.log("Modified data: ", change.doc.data());
            updatedDoc.push(change.doc.data())
        }
        if (change.type === "removed") {
            console.log("Removed data: ", change.doc.data());
        }
    });
    this.setState({updatedDoc})
  }

  render() {
    console.log(this.state)
    return (
      <View>
        <Text>{this.state.updatedDoc.name}</Text>
      </View>
    )
  }
}
