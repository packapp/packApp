import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { PricingCard, Button, ListItem} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'

export class Flights extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft:(
        <Button
        onPress={() => navigation.goBack()}
        type="clear"
        icon={<Icon name='chevron-left' size={30} />}
        />
    ),
    };
  };
  render(){
    const { navigate } = this.props.navigation;
    const endAirport = this.props.trip.endAirport.toString()
    const startAirport = this.props.trip.startAirport.toString()
    const {flights} = this.props.navigation.state.params
    const {Quotes, Carriers } = flights
    const user = this.props.user
    console.log(flights)
    return (
      <View style={{backgroundColor: '#f8f8f8'}}>
        <ScrollView>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <Button
            type="clear"
            title={'Outbound'}
            titleStyle={{textDecorationLine: 'underline', color: 'black', fontSize: 24}}
          />
          <Button
            type="clear"
            title={'Inbound'}
            titleStyle={{color: 'black', fontSize: 24}}
          />
        </View>
          {flights.Quotes ? flights.Quotes.map((quote, idx) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10, marginTop: 10, borderWidth: 1, borderColor: '#dbdbdb', borderRadius: 5, backgroundColor: '#fefcf5'}}>
            <View key={idx} style={{width: 100, height: 60, marginTop: 10, marginLeft: 10}}>
            <ListItem
              title={startAirport}
              leftIcon={{ name: 'flight-takeoff' }}
              containerStyle={{padding: 0, paddingBottom: 5, justifyContent: 'top', backgroundColor: '#fefcf5'}}
              contentContainerStyle={{padding: 0, justifyContent: 'top'}}
            />
          <Text>{quote.Direct ? <Text>Nonstop</Text> : <Text>Connection</Text>}</Text>
      </View>
      <View style={{width: 150, height: 60, marginTop: 10, alignItems: 'center'}}>
        <Text style={{fontSize: 16, color: 'gray', fontWeight: 'bold'}}>
          {flights.Quotes ? ( Carriers.filter((elem => {return elem.CarrierId === quote.OutboundLeg.CarrierIds[0]})))[0].Name : 'Nothing'}
        </Text>
      </View>
      <View style={{width: 100, height: 60, marginTop: 10, marginLeft: 10, marginRight: 0}}>
      <ListItem
          title={endAirport}
          leftIcon={{ name: 'flight-land' }}
          containerStyle={{padding: 0, paddingBottom: 5, justifyContent: 'top', backgroundColor: '#fefcf5'}}
          contentContainerStyle={{padding: 0, justifyContent: 'top'}}
        />

        {/* <Text>{endAirport}</Text> */}
        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#66cc66'}}>${quote.MinPrice}</Text>
      </View>
      </View>
      )) : (<Text>No quotes at this time</Text>)}
      </ScrollView>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center'
  },
});

const mapState = state => {
  return {
    user: state.user.user,
    trip: state.trip.selectedTrip,
  };
};

export default connect(
  mapState,
  null
)(Flights);
