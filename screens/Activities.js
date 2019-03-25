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
import { fetchAirportCoordinates } from '../store/coordinates';
const { yelpCategories } = require('./yelpcategories');

// Placeholder until we get user's location
// const region = {
//   latitude: 37.321996988,
//   longitude: -122.0325472123455,
//   latitudeDelta: 0.0922,
//   longitudeDelta: 0.0421,
// };

const deltas = {
  latitudeDelta: 1.922,
  longitudeDelta: 1.01421,
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
      searchByAnything: '',
    };
    this.arrayHolder = [];
    this.searchFilter = this.searchFilter.bind(this);
  }
  // renderHeader = () => {
  //   return (
  //     <SearchBar
  //       placeholder="Type Here..."
  //       lightTheme
  //       round
  //       onChangeText={text => this.searchFilterFunction(text)}
  //       autoCorrect={false}
  //     />
  //   );
  // };

  updateSearch = search => {
    this.setState({ search });
  };

  searchFilter = async () => {
    this.state.data.forEach(item => {
      if (item.title.toLowerCase().includes(this.state.search.toLowerCase())) {
        this.state.searchYield.push(item.alias);
      }
    });
    const places = await YelpService.getPlaces(
      this.props.coordinates,
      this.state.searchYield
    );
    this.setState({ places });
    console.log('PLACES', places);
  };

  async componentDidMount() {
    await this.props.fetchCoordinates(
      this.props.navigation.state.params.airportCode
    );
  }

  async handleFilter(filter) {
    await this.getPlaces(filter);
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    const navigate = this.props.navigation.state.params.navigate;
    const { places } = this.state;
    const region = this.props.coordinates[0]
      ? {
          latitude: this.props.coordinates[0].lat,
          longitude: this.props.coordinates[0].lon,
          ...deltas,
        }
      : null;
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
          <Map
            region={region}
            places={this.state.places}
            navigate={navigate}
            userId={this.props.navigation.state.params.userId}
            trip={this.props.navigation.state.params.trip}
            users={this.props.navigation.state.params.users}
            itin={this.props.navigation.state.params.itin}
          />
        </SafeAreaView>
        <View style={{ bottom: 0 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

const mapStateToProps = state => {
  return {
    coordinates: state.coordinates,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCoordinates: airportCode =>
      dispatch(fetchAirportCoordinates(airportCode)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activities);
