import React, {Component} from 'react';
import { Text, View, Image } from 'react-native';
import {connect} from 'react-redux'
import {fetchFlights} from '../store/flight'

export class SingleTrip extends Component {
  componentDidMount() {
    this.props.getFlights()
  }
  render() {

    console.log(this.props)
    return (
      <View style={{ flex: 1, justifyContent: "top", alignItems: "center" }}>
        <Image source={{uri: 'https://placeimg.com/400/100/nature'}}
       style={{width: 400, height: 200}} />
       {this.props.flights ? this.props.flights.map(flight => (
        <Text key={flight.CityId}>{flight.CityName}</Text>
       )) : 'no flights'}
      </View>
    )
  }
}

const mapState = state => {
  return {
    flights: state.flight
  }
}

const mapDispatch = (dispatch) => {
  return {
    getFlights: () => dispatch(fetchFlights())
  }
}

export default connect(mapState, mapDispatch)(SingleTrip)
