import React from 'react';
import { Text, StyleSheet, View, Button, SafeAreaView } from 'react-native';
import Map from './Map';
import YelpService from '../services/yelp';
// import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { fetchCoordinates } from '../store/coordinates';

// Placeholder until we get user's location
const region = {
  latitude: 37.321996988,
  longitude: -122.0325472123455,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const deltas = {
  latitudeDelta: 0.00922,
  longitudeDelta: 0.01421,
};

class Activities extends React.Component {
  state = {
    region: null,
    places: [],
    errorMessage: '',
    isOpen: false,
  };

  componentWillMount() {
    //this.props.fetchCoordinates()
  }

  // async getPlaces (filter) {
  //   if(this.props.coordinates) {
  //     const { lat, lon } = this.props.coordinates;
  //   const userLocation = { latitude, longitude };
  //   const places = await YelpService.getPlaces(userLocation, filter);
  //   this.setState({ places });
  //   }

  // }

  // async getLocationAsync() {
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   if (status !== 'granted') {
  //     this.setState({
  //       errorMessage: 'Permission denied'
  //     });
  // //   }

  //   let location = await Location.getCurrentPositionAsync({});
  //   const region = {
  //     latitude: location.coords.latitude,
  //     longitude: location.coords.longitude,
  //     ...deltas
  //   };
  //   await this.setState({ region });
  //   await this.getPlaces();
  // }

  async handleFilter(filter) {
    await this.getPlaces(filter);
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    const { region, places } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View>
          {/* <Text style={styles.title}>
          h
          <Text style={{color:'#fce205'}}>app</Text>
          y
        </Text>
        <Button title='faves' color='#ffddaf' accessibilityLabel="Go to favorites" onPress={() => this.props.navigation.navigate('Favorites')}/> */}
        </View>
        <SafeAreaView>
          <Map region={region} places={places} />
          {/* <ActionButton buttonColor='#ffc30b'>
          <ActionButton.Item buttonColor='#fada5e' title="Spas" onPress={() => this.handleFilter({ term: 'spa' })}>
            <Icon name="flower" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#f8e473' title="Yoga" onPress={() => this.handleFilter({ term: 'yoga,pilates'})}>
            <Icon name="human-handsup" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#f8de7e' title="Parks" onPress={() => this.handleFilter({ term: 'park' })}>
            <Icon name="tree" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton> */}
        </SafeAreaView>
        <View style={{ bottom: 0 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // header: {
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   backgroundColor: '#ffc30b',
  //   height: 80,
  //   paddingRight: 20,
  //   paddingLeft: 20,
  // },
  title: {
    fontFamily: 'Verdana',
    fontSize: 30,
    color: '#fda50f',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

// const mapStateToProps = state => {
//   return {
//     coordinates: this.state.coordinates,
//   };
// };

const mapDispatchToProps = dispatch => {
  return {
    fetchCoordinates: airportCode => dispatch(fetchCoordinates(airportCode)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Activities);
