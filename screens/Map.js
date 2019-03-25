import React, { Component } from 'react';
import { MapView } from 'expo';
import Icon from 'react-native-vector-icons/Feather';
import { Alert, AsyncStorage, Button, View, Text } from 'react-native';
import { createNewItinerary } from './NewItin';
import { Avatar } from 'react-native-elements';

const Marker = MapView.Marker;

export default class Map extends Component {
  // async addToItinerary(place) {
  //   try {
  //     await AsyncStorage.setItem(place.name, JSON.stringify(place));

  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  handlePress(markerData, place) {
    const navigate = this.props.navigate;
    Alert.alert(
      'Add to itinerary?',
      '',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            navigate('NewItin', {
              users: this.props.users,
              trip: this.props.trip.location,
              itin: this.props.itin,
              userId: String(this.props.userId),
              title: String(place.name),
            }),
        },
      ],
      { cancelable: false }
    );
  }

  renderMarkers() {
    return this.props.places.map((place, i) => (
      <Marker
        key={i}
        title={place.name}
        coordinate={place.coords}
        description={`Rating: ${place.rating.toString()}`}
        onCalloutPress={() => {
          this.handlePress(this, place);
        }}
      >
        <Icon name="map-pin" size={25} color="#ff9933" />
      </Marker>
    ));
  }

  render() {
    const region = this.props.region;
    console.log('PASSED DOWN PLACES', this.props.places);
    const navigate = this.props.navigate;
    return (
      <View style={{ alignContent: 'left' }}>
        <MapView style={styles.container} region={region} mapPadding={100}>
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }
}
const styles = {
  container: {
    width: '100%',
    height: '100%',
  },
};
