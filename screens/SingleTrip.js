import React, { Component } from 'react';
import { Text, View, Image, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { fetchFlights } from '../store/flight';
import { PricingCard, Tile } from 'react-native-elements';

export class SingleTrip extends Component {
  componentDidMount() {
    this.props.getFlights();
  }
  render() {
    console.log('FLIGHTS', this.props.flights);
    return (
      <ScrollView>
        <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center' }}>
          <Tile
            imageSrc={{ uri: 'https://placeimg.com/400/100/nature' }}
            title="Yosemite"
            featured
            caption="Dates.... "
            height={200}
          />
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

const mapState = state => {
  return {
    flights: state.flight,
  };
};

const mapDispatch = dispatch => {
  return {
    getFlights: () => dispatch(fetchFlights()),
  };
};

export default connect(
  mapState,
  mapDispatch
)(SingleTrip);
