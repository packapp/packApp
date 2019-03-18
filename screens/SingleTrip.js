import React, { Component } from 'react';
import { Text, View, Image, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { fetchFlights } from '../store/flight';
import { PricingCard, Tile, Avatar, Divider, Button} from 'react-native-elements';
import {fetchSingleTrip} from '../store/trip'
import {fetchUsers} from '../store/usersPerTrips'
import Ionicons from 'react-native-vector-icons/Ionicons';

export class SingleTrip extends Component {
 async componentDidMount() {
    this.props.getFlights();
    await this.props.getTrip(this.props.navigation.state.params.location)

    let userIds = [];
    if (this.props.trip.attendees) {
      userIds = [...this.props.trip.attendees];
      userIds.push(this.props.trip.host);
    }
    this.props.getUsers(userIds)
  }
  render() {
    const { navigate } = this.props.navigation
    const user = this.props.user;
    // console.log('USERS', userIds)
    if (this.props.users) {
      console.log('TRIP', this.props.trip)
    }
    return (
      <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ flex: 1, justifyContent: 'top'}}>
          <Tile
            imageSrc={{ uri: 'https://placeimg.com/150/200/nature' }}
            title={this.props.navigation.state.params.location}
            featured
            caption={`Start date: ${this.props.trip.startDate} - Endate: something`}
            height={150}
          />
          <ScrollView horizontal={true} contentContainerStyle={styles.contentContainer}>
            {this.props.users ? this.props.users.map(user => (
              <Avatar
                size="small"
                key={user.firstName}
                rounded
                source={{uri:`${user.imgUrl}`}}
                containerStyle={{flex: 1, marginLeft: 15}}
                />
            )) : (<Text>No users</Text>)}
            </ScrollView>
            <Divider style={{ backgroundColor: 'gray', marginBottom: 5}} />
            <View style={{flexDirection: 'row'}}>
              <Avatar
                size="large"
                rounded
                icon={{name: 'check', color: 'white', type: 'font-awesome'}}
                onPress={() => navigate('Todos', { todos: this.props.trip.todos })}
                activeOpacity={0.7}
                containerStyle={{marginLeft: 15, marginTop: 5}}
                avatarStyle={{backgroundColor:'#ff9933' }}
              />
              <Avatar
                size="large"
                rounded
                icon={{name: 'plane', color: 'white', type: 'font-awesome'}}
                onPress={() => navigate('Flights', { flights: this.props.flights})}
                activeOpacity={0.7}
                containerStyle={{marginLeft: 15, marginTop: 5}}
                avatarStyle={{backgroundColor:'#66cc66' }}
              />
              <Avatar
                size="large"
                rounded
                icon={{name: 'calendar', color: 'white', type: 'font-awesome'}}
                onPress={() => navigate('Itinerary')}
                activeOpacity={0.7}
                containerStyle={{marginLeft: 15, marginTop: 5, marginRight: 20}}
              />
            </View>
        </View>
        <Divider style={{ backgroundColor: 'gray', marginTop: 15}} />
        <Text style={{marginTop: 30, marginLeft: 20, fontSize: 20}}>Recent activity</Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Howl', { user })}/>
        <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
        <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Profile', { user })}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 15,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30
  }
});

const mapState = state => {
  return {
    flights: state.flight,
    trip: state.trip.selectedTrip,
    users: state.users,
    user: state.user.user,
  };
};

const mapDispatch = dispatch => {
  return {
    getFlights: () => dispatch(fetchFlights()),
    getTrip: (tripName) => dispatch(fetchSingleTrip(tripName)),
    getUsers: (userIds) => dispatch(fetchUsers(userIds))
  };
};

export default connect(
  mapState,
  mapDispatch
)(SingleTrip);
