import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, ListItem, Divider, Badge, Icon} from 'react-native-elements';
import { connect } from 'react-redux';
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';
import Dialog from 'react-native-dialog';

export class Flights extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Flights',
      headerLeft:(
        <Button
        onPress={() => navigation.goBack()}
        type="clear"
        icon={<Icon name='chevron-left' size={30} />}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      addFlightAlert: false
    };
  }

  _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync('https://www.skyscanner.com/?ksh_id=_k_CjwKCAjwstfkBRBoEiwADTmnEBFXJ9nEsj2u56Cy8-vEsMxUUX14mltARFPkwFjq6_zNmzzPa4AlpxoCPj8QAvD_BwE_k_&associateID=SEM_GGT_00065_00033&utm_source=google&utm_medium=cpc&utm_campaign=US-Travel-Search-Brand-Skyscanner%20Only-Exact&utm_term=skyscanner&kpid=google_390972150_27422440950_183285134790_kwd-400074527_c_&gclid=CjwKCAjwstfkBRBoEiwADTmnEBFXJ9nEsj2u56Cy8-vEsMxUUX14mltARFPkwFjq6_zNmzzPa4AlpxoCPj8QAvD_BwE');
  }

  chooseFlight = async (carrierOutbound, carrierInbound, startAirport, endAirport, price) => {
    const inbound = carrierInbound;
    const outbound = carrierOutbound;
    const userId = this.props.navigation.state.params.userId;
    const trip = this.props.navigation.state.params.trip;

    const flightData = {endAirport, inbound, outbound, price, startAirport, userId};

    const db = firebase.firestore();
    const flightsRef = await db.collection('trips').doc(trip);
    await flightsRef.update({
      bookedFlights: firebase.firestore.FieldValue.arrayUnion(flightData)
    });
    this.setState({
      addFlightAlert: false
    });
    this.props.navigation.navigate('SingleTrip');
  }

  render(){
    const endAirport = this.props.trip.endAirport.toString();
    const startAirport = this.props.trip.startAirport.toString();
    const {flights} = this.props.navigation.state.params;
    const {Carriers } = flights;
    return (
      <View style={{backgroundColor: '#f8f8f8'}}>
        <ScrollView>
          {flights.Quotes ? flights.Quotes.map((quote, idx) => (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10, marginTop: 10, borderWidth: 1, borderColor: '#dbdbdb', borderRadius: 5, backgroundColor: '#fefcf5'}}>
              <View key={idx} style={{width: 100, height: 100, marginTop: 10, marginLeft: 10}}>

                <ListItem
                  title={startAirport}
                  leftIcon={{ name: 'flight-takeoff' }}
                  containerStyle={{padding: 0, paddingBottom: 5, justifyContent: 'top', backgroundColor: '#fefcf5'}}
                  contentContainerStyle={{padding: 0, justifyContent: 'top'}}
                />
              <Text>{quote.Direct ? <Text>Nonstop</Text> : <Text>Connection</Text>}</Text>
              <Divider style={{ backgroundColor: 'gray', marginBottom: 10, marginTop: 10 }} />
              <ListItem
                  title={endAirport}
                  leftIcon={{ name: 'flight-takeoff' }}
                  containerStyle={{padding: 0, paddingBottom: 5, justifyContent: 'top', backgroundColor: '#fefcf5'}}
                  contentContainerStyle={{padding: 0, justifyContent: 'top'}}
                />
              </View>
              <View style={{width: 150, height: 100, marginTop: 10, alignItems: 'center'}}>
                <Button
                  type="clear"
                  title={flights.Quotes ? ( Carriers.filter((elem => {return elem.CarrierId === quote.OutboundLeg.CarrierIds[0]})))[0].Name.slice(0, 17) : 'Nothing'}
                  onPress={this._handleOpenWithWebBrowser}
                  titleStyle={{color: 'gray', fontWeight: 'bold', fontSize: 16, margin: 0, padding: 0}}
                  buttonStyle={{margin: 0, padding: 0}}
                />

                <Text style={{color: 'gray'}}>Outbound</Text>
                <Divider style={{ backgroundColor: 'gray', marginBottom: 5, marginTop: 5 }} />
                <Button
                  type="clear"
                  title={flights.Quotes ? ( Carriers.filter((elem => {return elem.CarrierId === quote.InboundLeg.CarrierIds[0]})))[0].Name.slice(0, 17) : 'Nothing'}
                  onPress={this._handleOpenWithWebBrowser}
                  titleStyle={{color: 'gray', fontWeight: 'bold', fontSize: 16, margin: 0, padding: 0}}
                  buttonStyle={{margin: 0, padding: 0}}
                />
                <Text style={{color: 'gray'}}>Inbound</Text>
              </View>
              <View style={{borderBottomColor: 'black', borderWidth: 1}}></View>
              <View style={{width: 90, height: 100, marginTop: 10, marginLeft: 10, marginRight: 0}}>

              <Badge
                  onPress={() => this.setState({addFlightAlert: true})}
                  status="success"
                  badgeStyle={{backgroundColor: '#66cc66'}}
                  containerStyle={{ position: 'absolute', top: -14, right: 2}}
                  value={<Icon type="ion-icon" name="add" size="large" color="white"/>}>
                </Badge>

                <ListItem
                  title={endAirport}
                  leftIcon={{ name: 'flight-land' }}
                  containerStyle={{padding: 0, paddingBottom: 5, justifyContent: 'top', backgroundColor: 'transparent', width: 80}}
                  contentContainerStyle={{padding: 0, justifyContent: 'top'}}
                />

                <View>
                  <Dialog.Container visible={this.state.addFlightAlert}>
                    <Dialog.Title>Share this as your flight to your pack?</Dialog.Title>
                    <Dialog.Button label="Cancel" onPress={() => this.setState({addFlightAlert: false})}/>
                    <Dialog.Button label="OK" onPress={() => this.chooseFlight(flights.Quotes ? ( Carriers.filter((elem => {return elem.CarrierId === quote.OutboundLeg.CarrierIds[0]})))[0].Name.slice(0, 17) : 'Nothing', flights.Quotes ? ( Carriers.filter((elem => {return elem.CarrierId === quote.InboundLeg.CarrierIds[0]})))[0].Name.slice(0, 17) : 'Nothing', startAirport, endAirport, quote.MinPrice)}/>
                  </Dialog.Container>
                </View>
                <Text style={{fontWeight: 'bold', fontSize: 16, color: '#66cc66'}}>${quote.MinPrice}</Text>
                <Divider style={{ backgroundColor: 'gray', marginBottom: 10, marginTop: 10, marginRight: 10 }} />
                <ListItem
                  title={startAirport}
                  leftIcon={{ name: 'flight-land' }}
                  containerStyle={{padding: 0, paddingBottom: 5, justifyContent: 'top', backgroundColor: '#fefcf5', width: 80}}
                  contentContainerStyle={{padding: 0, justifyContent: 'top'}}
                />
              </View>
            </View>
          )) : (<Text>No quotes at this time</Text>)}
      </ScrollView>
    </View>
    );
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
