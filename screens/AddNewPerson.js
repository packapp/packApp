import React, { Component } from 'react';
import firebase from '../server/config';
import * as firebase2 from 'firebase';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { fetchUsers } from '../store/allUsers';
import { connect } from 'react-redux';
import { Button } from 'react-native';

class AddNewPerson extends Component {
  static navigationOptions = {
    title: 'Invite people',
  };

  constructor(props) {
    super(props);
    this.state = {
      newUser: '',
    };
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  addPersonToPack = async () => {
    const { navigate } = this.props.navigation;
    let newUserId = '';
    console.log(this.state.newUser);
    this.props.allUsers.forEach(user => {
      const fullName = `${user.firstName} ${user.lastName}`;
      console.log(user, fullName);
      if (this.state.newUser === fullName) {
        newUserId = user.id;
      }
    });
    try {
      const db = firebase.firestore();
      const tripRef = db
        .collection('trips')
        .doc(this.props.navigation.state.params.location);
      await tripRef.update({
        attendees: firebase2.firestore.FieldValue.arrayUnion(newUserId),
      });
    } catch (err) {
      console.error(err);
    }
    navigate('Dashboard', {});
  };

  render() {
    const USERS = this.props.allUsers
      ? this.props.allUsers.map(user => {
          return { value: `${user.firstName} ${user.lastName}` };
        })
      : '';

    if (this.props.allUsers) console.log(this.props.allUsers);
    return (
      <ScrollView style={{ marginTop: 40 }}>
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            marginRight: 10,
            justifyContent: 'center',
          }}
        >
          <Dropdown
            dropdownOffset={{ top: 15, bottom: 0 }}
            // containerStyle={{ width: 380 }}
            label="Who do you want to add?"
            data={USERS}
            value={this.state.newUserId}
            onChangeText={value => {
              this.setState({ newUser: value });
            }}
          />
        </View>
        <Button
          title={
            !this.state.newUser
              ? 'Add your packmate!'
              : `Add ${this.state.newUser} to pack!`
          }
          //type="outline"
          color="#66cc66"
          style={styles.button}
          onPress={this.addPersonToPack}
        >
          Add your packmate!
        </Button>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    flex: 3,
    color: 'white',
    backgroundColor: '#aaaaaa',
  },
});

const mapStateToProps = state => {
  return {
    allUsers: state.allUsers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNewPerson);
