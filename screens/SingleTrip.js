import React, { Component } from 'react';
import { Text, View, Image, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { fetchFlights } from '../store/flight';
import { PricingCard, Tile, Avatar } from 'react-native-elements';
import {fetchSingleTrip} from '../store/trip'
import {fetchUsers} from '../store/usersPerTrips'

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

    // console.log('USERS', userIds)
    if (this.props.users) {
      console.log('TRIP', this.props.trip)
    }
    return (
      <ScrollView>
        <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center' }}>
          <Tile
            imageSrc={{ uri: 'https://placeimg.com/400/100/nature' }}
            title={this.props.navigation.state.params.location}
            featured
            caption={`Start date: something - Endate: something`}
            height={200}
          />
            <ScrollView horizontal={true} contentContainerStyle={styles.contentContainer}>
              {this.props.users ? this.props.users.map(user => (
                <Avatar
                  size="medium"
                  key={user.firstName}
                  rounded
                  source={{uri:`${user.imgUrl}`}}
                  containerStyle={{flex: 2, marginLeft: 20, marginTop: 5}}
                  />
              )) : (<Text>No users</Text>)}
            </ScrollView>
          {this.props.flights.Carriers ? (
            this.props.flights.Carriers.map(carrier => (
              <PricingCard
                containerStyle={{ width: 400, height: 150 }}
                key={carrier.CarrierId}
                color="#ff9933"
                title={carrier.Name}
                titleStyle={{ fontSize: 18 }}
                // price="$0"
                pricingStyle={{ fontSize: 16 }}
                button={{ title: 'GET STARTED', icon: 'flight-takeoff' }}
              />
            ))
          ) : (
            <Text>No flights</Text>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  }
});

const mapState = state => {
  return {
    flights: state.flight,
    trip: state.trip.selectedTrip,
    users: state.users
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
