import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  ScrollView,
  FlatList,
  View,
  Button,
} from 'react-native';
import firebase from '../server/config';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchUser } from '../store/user';
import { fetchAlphaTrips, fetchPackTrips } from '../store/trip';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  state = { currentUser: null };

  async componentDidMount() {
    const { currentUser } = await firebase.auth();
    this.setState({ currentUser });
    const userId = this.state.currentUser.uid;
    this.props.fetchUser(userId);
    this.props.fetchAlphaTrips(userId);
    this.props.fetchPackTrips(userId);
  }

  handleLogOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Loading');
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const { currentUser } = this.state;
    const { navigate } = this.props.navigation;
    // if (this.props.user.places) {
    //   //debugger;
    //   console.log('USER', this.props.user.places.Singapore);
    // } else {
    //   console.log('USER');
    // }
    return (
      // <View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.buttonContainer}>
          <Icon reverse name="add" type="material" color="#ff9933" />
        </View>
        <View style={styles.container}>
          {this.props.user.places ? (
            <Text>{this.props.user.places.Singapore.location}</Text>
          ) : null}
          <Button title="Log Out" onPress={this.handleLogOut} />
          <Button title="single trip" onPress={() => navigate('SingleTrip')} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
});

const mapStateToProps = state => {
  return {
    user: state.user.user,
    places: state.user.user.places,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: userId => dispatch(fetchUser(userId)),
    fetchAlphaTrips: userId => dispatch(fetchAlphaTrips(userId)),
    fetchPackTrips: userId => dispatch(fetchPackTrips(userId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
