import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { PricingCard, Tile, Avatar, Divider, Header} from 'react-native-elements';
export default class Todos extends Component {
  render(){
    const {flights} = this.props.navigation.state.params
    console.log('FLIGHTS FLIGHTS', flights)
    return(
      <View>
        {/* <Header
          centerComponent={{ text: 'Flights', style: { color: '#fff', fontSize: 24}}}
          containerStyle={{
            backgroundColor: "#aaaaaa",
            justifyContent: 'space-around',
          }}
        /> */}
        <ScrollView style={{marginBottom: 50}}>
          <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center' }}>
            {flights.Carriers ? (
                flights.Carriers.map(carrier => (
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center'
  }
});
