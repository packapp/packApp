import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { PricingCard, Button} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

export class Flights extends Component {
  static navigationOptions = {
    title: 'Flights'
  }
  render(){
    const {flights} = this.props.navigation.state.params
    const {Quotes, Carriers } = flights
    const user = this.props.user
    return(
      <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        <ScrollView style={{marginBottom: 50}}>
          <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center' }}>
            {flights.Carriers ? (
                flights.Quotes.map(quote => (
                  <PricingCard
                    containerStyle={{ width: 400, height: 150, backgroundColor: '#fefcf5', marginBottom: 2 }}
                    key={quote.QuoteId}
                    color="#ff9933"
                    title={flights.Quotes ? (
                      Carriers.filter((elem => {
                      return elem.CarrierId === quote.OutboundLeg.CarrierIds[0]
                    })))[0].Name : 'Nothing'}
                    titleStyle={{ fontSize: 18 }}
                    price={'$' + quote.MinPrice}
                    pricingStyle={{ fontSize: 16 }}
                    button={{ title: 'GET STARTED', icon: 'flight-takeoff'}}
                  />
                )).filter((elem, idx) => {
                  if (idx < 20) {
                    return elem
                  }
                })
              ) : (
                <Text>No flights</Text>
              )}
          </View>
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
    paddingVertical: 20,
    alignItems: 'center'
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
    paddingRight: 30,
  },
});

const mapState = state => {
  return {
    user: state.user.user,
  };
};

export default connect(
  mapState,
  null
)(Flights);
