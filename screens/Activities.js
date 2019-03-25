import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  FlatList,
  List,
  ListItem,
} from 'react-native';
import Map from './Map';
import YelpService from '../services/yelp';
// import ActionButton from 'react-native-action-button';
import { Avatar, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { fetchCoordinates } from '../store/coordinates';
const { yelpCategories } = require('./yelpcategories');

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
  constructor() {
    super();
    this.state = {
      region: null,
      places: [],
      errorMessage: '',
      isOpen: false,
      loading: false,
      data: yelpCategories.yelp,
      error: null,
      searchYield: [],
      search: '',
    };
    this.arrayHolder = [];
    this.searchFilter = this.searchFilter.bind(this);
  }
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
      />
    );
  };

  updateSearch = search => {
    this.setState({ search });
  };

  searchFilter = () => {
    this.state.data.forEach(item => {
      if (item.title.toLowerCase().includes(this.state.search.toLowerCase())) {
        this.state.searchYield.push(item.alias);
      }
    });
    console.log(this.state.searchYield);
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
    const navigate = this.props.navigation.state.params.navigate;
    const { region, places } = this.state;
    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        <View style={{ height: 50, paddingRight: 450 }}>
          <Avatar
            size="medium"
            rounded
            icon={{
              name: 'angle-left',
              color: 'black',
              type: 'font-awesome',
            }}
            onPress={() => navigate('SingleTrip')}
            activeOpacity={0.7}
            containerStyle={{ marginLeft: 0, marginTop: 5 }}
            avatarStyle={{ backgroundColor: 'white' }}
          />
        </View>
        <SearchBar
          placeholder="Search by category..."
          lightTheme
          round
          onChangeText={this.updateSearch}
          autoCorrect={false}
          value={this.state.search}
          onEndEditing={this.searchFilter}
        />
        <SafeAreaView>
          <Map region={region} places={places} navigate={navigate} />
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
