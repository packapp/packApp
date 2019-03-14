import React, {Component} from 'react';
import { Text, View, Image } from 'react-native';
import {connect} from 'react-redux'
import {fetchFlights} from '../store/flight'

export class SingleTrip extends Component {
  componentDidMount() {
    this.props.getFlights()
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "top", alignItems: "center" }}>
        <Image source={{uri: 'https://placeimg.com/400/100/nature'}}
       style={{width: 400, height: 200}} />
        <Text>Test</Text>
      </View>
    )
  }
}

const mapState = state => {
  return {
    flights: state.flights
  }
}

const mapDispatch = (dispatch) => {
  return {
    getFlights: () => dispatch(fetchFlights())
  }
}

export default connect(mapState, mapDispatch)(SingleTrip)
