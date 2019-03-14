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

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  state = { currentUser: null };

  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
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
    return (
      // <View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.buttonContainer}>
          <Icon reverse name="add" type="material" color="#ff9933" />
        </View>
        <View style={styles.container}>
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
