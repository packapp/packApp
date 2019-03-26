import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button, CheckBox, Input, Avatar, Divider } from 'react-native-elements'
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

  render() {
    const {selectedTrip} = this.props
    const {users} = this.props
    console.log(this.props.users)
    console.log(selectedTrip.bookedFlights)
    return (
      <View style={{marginTop: 15}}>
        {selectedTrip.bookedFlights ? selectedTrip.bookedFlights.map((flight, idx) => (

          <View key={idx} style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
            <View style={{width: 50, height: 50}}>
              <Avatar
                rounded
                size="medium"
                source={{
                  uri:
                  users && users.length ? users.filter(user => user.userId === flight.userId)[0].imgUrl : '',
                }}
              />
            </View>
            <View style={{width: 330, height: 50, marginLeft: 5}}>
              <Text style={{color: 'gray'}}>{selectedTrip.location}</Text>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {users && users.length ? users.filter(user => user.userId === flight.userId)[0].firstName + ' booked a flight!': ''}
              </Text>
              <View style={{backgroundColor: '#fefcf5', borderColor: '#dbdbdb', borderWidth: 1, borderRadius: 5}}>
              <View key={idx} style={{width: 100, height: 100, marginTop: 10, marginLeft: 10}}>

                <ListItem
                  title={flight.startAirport}
                  leftIcon={{ name: 'flight-takeoff', marginRight: 0, paddingRight: 0 }}
                  containerStyle={{padding: 0, paddingBottom: 5, justifyContent: 'top', backgroundColor: '#fefcf5'}}
                  contentContainerStyle={{padding: 0, justifyContent: 'top'}}
                  titleStyle={{fontSize: 14, justifyContent: 'flex-start'}}
                />

                <Divider style={{ backgroundColor: 'gray', marginBottom: 10, marginTop: 10 }} />
                <ListItem
                  title={flight.endAirport}
                  leftIcon={{ name: 'flight-takeoff', paddingRight: 0 }}
                  containerStyle={{padding: 0, paddingBottom: 5, justifyContent: 'top', backgroundColor: '#fefcf5'}}
                  contentContainerStyle={{padding: 0, justifyContent: 'top'}}
                />
                </View>
              </View>
            </View>

        </View>

        )) : <Text></Text>}
      </View>
    )
  }
}
