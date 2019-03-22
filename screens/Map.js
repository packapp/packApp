import React, { Component } from 'react';
import { MapView } from 'expo';
import Icon from 'react-native-vector-icons/AntDesign';
import { Alert, AsyncStorage } from 'react-native';
import { createNewItinerary } from './NewItin';

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
          onPress: () => createNewItinerary(place),
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
        onCalloutPress={() => this.handlePress(this, place)}
      >
        <Icon name="smile-circle" size={25} color="#fda50f" />
      </Marker>
    ));
  }

  render() {
    const { region } = this.props;
    return (
      <MapView
        style={styles.container}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {this.renderMarkers()}
      </MapView>
    );
  }
}
const styles = {
  container: {
    width: '100%',
    height: '100%',
  },
};
