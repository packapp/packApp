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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  state = { currentUser: null };

  async componentDidMount() {
    const { currentUser } = await firebase.auth();
    this.setState({ currentUser });
    this.props.fetchUser(this.state.currentUser.uid);
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
    if (this.props.user.places) {
      //debugger;
      console.log('USER', this.props.user.places.Singapore);
    } else {
      console.log('USER');
    }
    return (
      // <View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.buttonContainer}>
          <Icon reverse name="add" type="material" color="#ff9933" />
        </View>
        <View style={styles.container}>
          {/* {this.props.user ? (
            <Text>{this.props.user.user.places['Singapore']}</Text>
          ) : null} */}
          <Button title="Log Out" onPress={this.handleLogOut} />
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: userId => dispatch(fetchUser(userId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
